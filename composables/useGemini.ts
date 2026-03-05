import { GoogleGenerativeAI } from '@google/generative-ai'

let genAIInstance: GoogleGenerativeAI | null = null

export const useGemini = () => {
  const config = useRuntimeConfig()

  if (!genAIInstance) {
    genAIInstance = new GoogleGenerativeAI(config.public.geminiApiKey as string)
  }

  const getModel = (modelName = 'gemini-2.5-flash') => {
    return genAIInstance!.getGenerativeModel({ model: modelName })
  }

  return { getModel }
}
