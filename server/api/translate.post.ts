import { VertexAI } from '@google-cloud/vertexai'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { text, targetLang, sourceLang } = body

  if (!text || !targetLang) {
    throw createError({ statusCode: 400, statusMessage: 'text and targetLang are required' })
  }

  const config = useRuntimeConfig()
  const projectId = config.public.projectId || process.env.PROJECT_ID

  if (!projectId) {
    throw createError({ statusCode: 500, statusMessage: 'PROJECT_ID is not configured' })
  }

  const vertexAI = new VertexAI({
    project: projectId,
    location: process.env.VERTEX_AI_LOCATION || 'asia-northeast1',
  })

  const model = vertexAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
  })

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
    const response = result.response
    const translatedText = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

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
