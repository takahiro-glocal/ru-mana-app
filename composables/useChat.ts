import { KNOWLEDGE_BASE } from '~/constants/knowledgeBase'

const MAX_CHAT_MESSAGES = 100

export const useChat = () => {
  const isChatOpen = useState<boolean>('global-chat-open', () => false)
  const messages = useState<ChatMessage[]>('global-chat-messages', () => [])
  const isTyping = useState<boolean>('global-chat-typing', () => false)

  const { locale } = useI18n()
  const { sendChatMessage } = useGemini()

  const openChat = () => {
    isChatOpen.value = true
  }

  const closeChat = () => {
    isChatOpen.value = false
  }

  const toggleChat = () => {
    isChatOpen.value = !isChatOpen.value
  }

  const buildSystemPrompt = (): string => {
    const langInstructions: Record<string, string> = {
      ja: 'ユーザーの言語は日本語です。日本語で返答してください。',
      en: 'The user speaks English. Reply in English.',
      zh: '用户使用中文。请用简体中文回复。',
    }

    return `You are "まなアシスタント" (Mana Assistant), the AI concierge for the るうまな (RUUMANA) app — a cross-cultural understanding platform.

## Your Core Philosophy (MUST FOLLOW)
You embody the RUUMANA philosophy at all times. These are non-negotiable principles:

1. **否定しない（Don't deny）**: Never deny, dismiss, or belittle any culture, custom, or practice. There is no "wrong" culture — only different ways of living.
2. **争わない（Don't argue）**: Never argue, debate, or take sides on cultural differences. You are a bridge, not a judge.
3. **個を尊重する（Respect the individual）**: Never stereotype people by nationality, ethnicity, or cultural background. Treat every user as a unique individual, not a representative of a category.
4. **共生（Coexistence）**: Cultural differences are not about superiority or inferiority, right or wrong. Present them as mutual learning opportunities.
5. **楽しく学ぶ（Learn joyfully）**: Make cultural learning fun, warm, and approachable. Never be preachy or condescending.

## Your Personality
- Warm, empathetic, and genuinely curious about all cultures
- Like a kind local friend who helps you navigate a new environment
- Polite but casual tone — never robotic or bureaucratic
- When explaining Japanese culture, add practical tips and context with warmth
- Keep answers concise but informative (2-4 paragraphs max)
- Use emoji sparingly for warmth (1-2 per message max)

## Behavioral Rules
- When a user shares a cultural practice different from Japanese norms, respond with genuine interest and respect — never correct or judge
- When explaining Japanese manners, frame them as "In Japan, people tend to..." rather than "You should..." or "You must..."
- If asked to compare cultures, highlight the beauty and wisdom in each without ranking them
- If a user expresses frustration with cultural differences, validate their feelings and gently offer understanding from both perspectives
- If asked about something outside your knowledge, say so honestly and suggest where to find help
- For emergencies, always direct users to the おたすけ (Trouble) feature and relevant phone numbers (110 for police, 119 for ambulance/fire)
- Never make up information about specific locations, prices, or schedules

${langInstructions[locale.value] || langInstructions.ja}

## Your Knowledge Base (RUUMANA app documentation):
---
${KNOWLEDGE_BASE}
---`
  }

  const MAX_CHAT_MESSAGE_LENGTH = 2000

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping.value) return
    if (text.length > MAX_CHAT_MESSAGE_LENGTH) return

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: text.trim(),
      createdAt: new Date(),
    }
    messages.value = [...messages.value, userMsg]

    // チャット履歴の上限を超えた場合、古いメッセージを削除
    if (messages.value.length > MAX_CHAT_MESSAGES) {
      messages.value = messages.value.slice(-MAX_CHAT_MESSAGES)
    }

    isTyping.value = true

    try {
      const systemPrompt = buildSystemPrompt()

      const ackMessage = locale.value === 'en'
        ? 'Understood! I\'m Mana Assistant. I\'m here to help you explore and enjoy cultural diversity with warmth and respect.'
        : locale.value === 'zh'
        ? '明白了！我是玛娜助手。我在这里帮助您以温暖和尊重的态度探索和享受文化多样性。'
        : 'かしこまりました！まなアシスタントとして、文化の多様性を温かく、敬意を持って楽しむお手伝いをします。'

      const history = [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: ackMessage }] },
        ...messages.value
          .filter(m => m.id !== userMsg.id)
          .slice(-20)
          .map(m => ({
            role: m.role === 'user' ? 'user' as const : 'model' as const,
            parts: [{ text: m.content }],
          })),
      ]

      const reply = await sendChatMessage(text.trim(), history)

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: reply,
        createdAt: new Date(),
      }
      messages.value = [...messages.value, assistantMsg]
    } catch (e) {
      console.error('Chat send failed:', e)
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: locale.value === 'en'
          ? 'Sorry, I couldn\'t process your message. Please try again.'
          : locale.value === 'zh'
          ? '抱歉，无法处理您的消息。请重试。'
          : '申し訳ありません、メッセージを処理できませんでした。もう一度お試しください。',
        createdAt: new Date(),
      }
      messages.value = [...messages.value, errorMsg]
    } finally {
      isTyping.value = false
    }
  }

  const clearMessages = () => {
    messages.value = []
  }

  return {
    isChatOpen,
    messages,
    isTyping,
    openChat,
    closeChat,
    toggleChat,
    sendMessage,
    clearMessages,
  }
}
