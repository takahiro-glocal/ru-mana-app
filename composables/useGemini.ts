/**
 * Gemini AI composable
 * サーバーサイドAPI経由でGemini AIにアクセスする。
 * APIキーはサーバーサイドに保持し、クライアントには露出しない。
 */
export const useGemini = () => {
  /**
   * テキスト生成（単発プロンプト）
   */
  const generateContent = async (prompt: string): Promise<string> => {
    const { text } = await $fetch<{ text: string }>('/api/gemini', {
      method: 'POST',
      body: { prompt, mode: 'generate' },
    })
    if (!text) throw new Error('No response from AI')
    return text
  }

  /**
   * チャット（会話履歴付き）
   */
  const sendChatMessage = async (
    prompt: string,
    history: Array<{ role: string; parts: Array<{ text: string }> }>
  ): Promise<string> => {
    const { text } = await $fetch<{ text: string }>('/api/gemini', {
      method: 'POST',
      body: { prompt, history, mode: 'chat' },
    })
    if (!text) throw new Error('No response from AI')
    return text
  }

  return { generateContent, sendChatMessage }
}
