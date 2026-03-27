import { GoogleGenerativeAI } from '@google/generative-ai'

let genAIInstance: GoogleGenerativeAI | null = null

// 許可するモデル名のホワイトリスト
const ALLOWED_MODELS = ['gemini-2.5-flash']

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

  if (prompt.length > 10_000) {
    throw createError({ statusCode: 400, statusMessage: 'prompt too long' })
  }

  // モデル名バリデーション
  if (!ALLOWED_MODELS.includes(modelName)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid model name' })
  }

  if (!genAIInstance) {
    genAIInstance = new GoogleGenerativeAI(apiKey)
  }

  const model = genAIInstance.getGenerativeModel({ model: modelName })

  try {
    if (mode === 'chat' && Array.isArray(history)) {
      // history の基本的な構造バリデーション
      for (const entry of history) {
        if (!entry || typeof entry.role !== 'string' || !Array.isArray(entry.parts)) {
          throw createError({ statusCode: 400, statusMessage: 'Invalid history format' })
        }
      }
      const chat = model.startChat({ history })
      const result = await Promise.race([
        chat.sendMessage(prompt),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out')), 30_000)
        )
      ])
      return { text: result.response.text()?.trim() }
    } else {
      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out')), 30_000)
        )
      ])
      return { text: result.response.text()?.trim() }
    }
  } catch (e: any) {
    if (e.statusCode) throw e
    console.error('Gemini API error:', e.message)
    throw createError({ statusCode: 502, statusMessage: 'AI service unavailable' })
  }
})
