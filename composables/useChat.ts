export const useChat = () => {
  const isChatOpen = useState<boolean>('global-chat-open', () => false)
  const messages = useState<ChatMessage[]>('global-chat-messages', () => [])
  const isTyping = useState<boolean>('global-chat-typing', () => false)

  const { locale } = useI18n()

  const openChat = () => {
    isChatOpen.value = true
  }

  const closeChat = () => {
    isChatOpen.value = false
  }

  const toggleChat = () => {
    isChatOpen.value = !isChatOpen.value
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping.value) return

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: text.trim(),
      createdAt: new Date(),
    }
    messages.value = [...messages.value, userMsg]

    const history = messages.value
      .filter(m => m.id !== userMsg.id)
      .map(m => ({
        role: m.role === 'user' ? 'user' as const : 'model' as const,
        parts: m.content,
      }))

    isTyping.value = true

    try {
      const response = await $fetch<ChatResponse>('/api/chat', {
        method: 'POST',
        body: {
          message: text.trim(),
          history,
          locale: locale.value,
        } as ChatRequest,
      })

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: response.reply,
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
