import { GoogleGenerativeAI } from '@google/generative-ai'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

let knowledgeBase: string | null = null

function loadKnowledgeBase(): string {
  if (knowledgeBase) return knowledgeBase

  const guideDir = join(process.cwd(), 'server', 'data', 'guide')
  try {
    const files = readdirSync(guideDir).filter(f => f.endsWith('.md'))
    knowledgeBase = files
      .map(f => readFileSync(join(guideDir, f), 'utf-8'))
      .join('\n\n---\n\n')
    return knowledgeBase
  } catch (e) {
    console.error('Failed to load knowledge base:', e)
    return ''
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ChatRequest>(event)
  const { message, history, locale } = body

  if (!message?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'message is required' })
  }

  const geminiApiKey = process.env.GEMINI_API_KEY
  if (!geminiApiKey) {
    throw createError({ statusCode: 500, statusMessage: 'GEMINI_API_KEY is not configured' })
  }

  const docs = loadKnowledgeBase()

  const langInstructions: Record<string, string> = {
    ja: 'ユーザーの言語は日本語です。日本語で返答してください。',
    en: 'The user speaks English. Reply in English.',
    zh: '用户使用中文。请用简体中文回复。',
  }

  const systemPrompt = `You are "まなアシスタント" (Mana Assistant), the friendly AI concierge for the るうまな (RUUMANA) app.

Your personality:
- Warm, helpful, and knowledgeable about Japanese culture and manners
- Like a friendly local guide who genuinely cares about helping visitors
- Use a polite but casual tone (not robotic)
- When appropriate, add cultural context and practical tips
- Keep answers concise but informative (2-4 paragraphs max)
- Use emoji sparingly for warmth (1-2 per message max)

${langInstructions[locale] || langInstructions.ja}

Your knowledge base (the app's documentation):
---
${docs}
---

Guidelines:
- Answer questions about the app, Japanese manners, culture, and daily life
- If asked about something outside your knowledge, say so honestly and suggest where to find help
- For emergencies, always direct users to the おたすけ (Trouble) feature and relevant phone numbers (110 for police, 119 for ambulance/fire)
- Never make up information about specific locations, prices, or schedules
- When explaining manners, reference the relevant category from the knowledge base`

  const genAI = new GoogleGenerativeAI(geminiApiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const ackMessage = locale === 'en'
    ? 'Understood! I\'m Mana Assistant, ready to help with anything about RUUMANA or life in Japan.'
    : locale === 'zh'
    ? '明白了！我是玛娜助手，随时帮助您了解RUUMANA应用或日本生活。'
    : 'かしこまりました！まなアシスタントとして、るうまなアプリや日本の生活についてお手伝いします。'

  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: ackMessage }] },
      ...(history || []).slice(-20).map(h => ({
        role: h.role as 'user' | 'model',
        parts: [{ text: h.parts }],
      })),
    ],
  })

  try {
    const result = await chat.sendMessage(message)
    const reply = result.response.text()?.trim()

    if (!reply) {
      throw createError({ statusCode: 500, statusMessage: 'No response from AI' })
    }

    return { reply } as ChatResponse
  } catch (e: unknown) {
    console.error('Chat error:', e)
    const errorMessage = e instanceof Error ? e.message : 'Chat failed'
    throw createError({ statusCode: 500, statusMessage: errorMessage })
  }
})
