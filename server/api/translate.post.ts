import { GoogleGenerativeAI } from '@google/generative-ai'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { text, targetLang, sourceLang } = body

  if (!text || !targetLang) {
    throw createError({ statusCode: 400, statusMessage: 'text and targetLang are required' })
  }

  const geminiApiKey = process.env.GEMINI_API_KEY

  if (!geminiApiKey) {
    throw createError({ statusCode: 500, statusMessage: 'GEMINI_API_KEY is not configured' })
  }

  const genAI = new GoogleGenerativeAI(geminiApiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const langNames: Record<string, string> = {
    ja: 'Japanese',
    en: 'English',
    zh: 'Simplified Chinese',
  }

  const targetLangName = langNames[targetLang] || targetLang
  const sourceLangName = sourceLang ? (langNames[sourceLang] || sourceLang) : 'auto-detect'

  const prompt = `You are a cultural translator for Japan. Your role is not just to translate words, but to convey cultural context and meaning.

When translating content related to Japanese culture, manners, or daily life:
- Preserve cultural nuances and explain implicit cultural context when needed
- If the text references a Japanese custom or concept that may be unfamiliar, provide a brief, natural explanation within the translation
- Maintain the original tone (formal/casual/friendly)
- Do NOT add translator's notes or brackets — weave any cultural context naturally into the translation

Source language: ${sourceLangName}
Target language: ${targetLangName}

Translate the following text. Return ONLY the translated text, nothing else:

${text}`

  try {
    const result = await model.generateContent(prompt)
    const translatedText = result.response.text()?.trim()

    if (!translatedText) {
      throw createError({ statusCode: 500, statusMessage: 'No translation returned' })
    }

    return { translatedText }
  } catch (e: unknown) {
    console.error('Translation error:', e)
    const message = e instanceof Error ? e.message : 'Translation failed'
    throw createError({ statusCode: 500, statusMessage: message })
  }
})
