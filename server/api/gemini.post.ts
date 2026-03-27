import { GoogleGenerativeAI } from '@google/generative-ai'

let genAIInstance: GoogleGenerativeAI | null = null

// 許可するモデル名のホワイトリスト
const ALLOWED_MODELS = ['gemini-2.5-flash']

// 許可するモードのホワイトリスト
const ALLOWED_MODES = ['generate', 'chat']

// 許可する履歴ロールのホワイトリスト
const ALLOWED_ROLES = ['user', 'model']

// 履歴の最大エントリ数
const MAX_HISTORY_LENGTH = 100

// IPごとのレート制限（1分あたりの最大リクエスト数）
const MAX_REQUESTS_PER_MINUTE = 20
const rateLimitMap = new Map<string, number[]>()

// 定期的に古いエントリを掃除（メモリリーク防止）
const CLEANUP_INTERVAL = 5 * 60_000
let lastCleanup = Date.now()

const checkRateLimit = (clientIp: string) => {
  const now = Date.now()

  // 定期クリーンアップ
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    for (const [ip, timestamps] of rateLimitMap.entries()) {
      const filtered = timestamps.filter(t => now - t < 60_000)
      if (filtered.length === 0) {
        rateLimitMap.delete(ip)
      } else {
        rateLimitMap.set(ip, filtered)
      }
    }
    lastCleanup = now
  }

  const timestamps = rateLimitMap.get(clientIp) || []
  const recent = timestamps.filter(t => now - t < 60_000)

  if (recent.length >= MAX_REQUESTS_PER_MINUTE) {
    throw createError({ statusCode: 429, statusMessage: 'Rate limit exceeded. Please wait a moment.' })
  }

  recent.push(now)
  rateLimitMap.set(clientIp, recent)
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.geminiApiKey as string

  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Gemini API key not configured' })
  }

  const clientIp = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  checkRateLimit(clientIp)

  const body = await readBody(event)
  const { prompt, history, modelName = 'gemini-2.5-flash', mode = 'generate' } = body

  if (!prompt || typeof prompt !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'prompt is required' })
  }

  // Null バイト等の制御文字を除去
  const sanitizedPrompt = prompt.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').trim()

  if (sanitizedPrompt.length === 0 || sanitizedPrompt.length > 10_000) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid prompt length' })
  }

  // モデル名バリデーション
  if (!ALLOWED_MODELS.includes(modelName)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid model name' })
  }

  // モードバリデーション
  if (!ALLOWED_MODES.includes(mode)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid mode' })
  }

  if (!genAIInstance) {
    genAIInstance = new GoogleGenerativeAI(apiKey)
  }

  const model = genAIInstance.getGenerativeModel({ model: modelName })

  try {
    if (mode === 'chat' && Array.isArray(history)) {
      // history の構造バリデーション
      if (history.length > MAX_HISTORY_LENGTH) {
        throw createError({ statusCode: 400, statusMessage: 'History too long' })
      }
      for (const entry of history) {
        if (!entry || typeof entry.role !== 'string' || !ALLOWED_ROLES.includes(entry.role) || !Array.isArray(entry.parts)) {
          throw createError({ statusCode: 400, statusMessage: 'Invalid history format' })
        }
        for (const part of entry.parts) {
          if (!part || typeof part.text !== 'string') {
            throw createError({ statusCode: 400, statusMessage: 'Invalid history part format' })
          }
        }
      }
      const chat = model.startChat({ history })
      const result = await Promise.race([
        chat.sendMessage(sanitizedPrompt),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out')), 30_000)
        )
      ])
      return { text: result.response.text()?.trim() }
    } else {
      const result = await Promise.race([
        model.generateContent(sanitizedPrompt),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out')), 30_000)
        )
      ])
      return { text: result.response.text()?.trim() }
    }
  } catch (e: unknown) {
    if (e instanceof Error && 'statusCode' in e) throw e
    console.error('Gemini API error:', e instanceof Error ? e.message : 'Unknown error')
    throw createError({ statusCode: 502, statusMessage: 'AI service unavailable' })
  }
})
