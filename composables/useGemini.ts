import { GoogleGenerativeAI } from '@google/generative-ai'

let genAIInstance: GoogleGenerativeAI | null = null

// クライアントサイドレート制限（1分あたりの最大リクエスト数）
const MAX_REQUESTS_PER_MINUTE = 10
const requestTimestamps: number[] = []

const checkRateLimit = () => {
  const now = Date.now()
  // 1分以上前のタイムスタンプを除去
  while (requestTimestamps.length > 0 && now - requestTimestamps[0] > 60_000) {
    requestTimestamps.shift()
  }
  if (requestTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
    throw new Error('Rate limit exceeded. Please wait a moment before trying again.')
  }
  requestTimestamps.push(now)
}

export const useGemini = () => {
  const config = useRuntimeConfig()

  if (!genAIInstance) {
    genAIInstance = new GoogleGenerativeAI(config.public.geminiApiKey as string)
  }

  const getModel = (modelName = 'gemini-2.5-flash') => {
    checkRateLimit()
    return genAIInstance!.getGenerativeModel({ model: modelName })
  }

  return { getModel }
}
