import { GoogleGenerativeAI } from '@google/generative-ai'

let genAIInstance: GoogleGenerativeAI | null = null

// サーバーサイドレート制限（1分あたりの最大リクエスト数）
const MAX_REQUESTS_PER_MINUTE = 30
const requestTimestamps: number[] = []

const checkRateLimit = () => {
  const now = Date.now()
  while (requestTimestamps.length > 0 && now - requestTimestamps[0] > 60_000) {
    requestTimestamps.shift()
  }
  if (requestTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
    throw createError({ statusCode: 429, statusMessage: 'Rate limit exceeded. Please wait a moment.' })
  }
  requestTimestamps.push(now)
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.geminiApiKey as string

  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Gemini API key not configured' })
  }

  checkRateLimit()

  const body = await readBody(event)
  const { prompt, history, modelName = 'gemini-2.5-flash', mode = 'generate' } = body

  if (!prompt || typeof prompt !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'prompt is required' })
  }

  // 入力長制限
  if (prompt.length > 10_000) {
    throw createError({ statusCode: 400, statusMessage: 'prompt too long' })
  }

  if (!genAIInstance) {
    genAIInstance = new GoogleGenerativeAI(apiKey)
  }

  const model = genAIInstance.getGenerativeModel({ model: modelName })

  try {
    if (mode === 'chat' && Array.isArray(history)) {
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
