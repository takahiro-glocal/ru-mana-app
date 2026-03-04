export const useTranslation = () => {
  const translations = useState<Record<string, string>>('ai-translations', () => ({}))
  const loadingIds = useState<Record<string, boolean>>('ai-translation-loading', () => ({}))

  const { locale } = useI18n()

  /**
   * テキストをAI翻訳する
   */
  const translateText = async (id: string, text: string): Promise<string | null> => {
    const cacheKey = `${id}:${locale.value}`

    // キャッシュ済みならそれを返す
    if (translations.value[cacheKey]) {
      return translations.value[cacheKey]
    }

    loadingIds.value[id] = true
    try {
      const result = await $fetch<{ translatedText: string }>('/api/translate', {
        method: 'POST',
        body: {
          text,
          targetLang: locale.value,
        },
      })

      translations.value[cacheKey] = result.translatedText
      return result.translatedText
    } catch (e) {
      console.error('Translation failed:', e)
      return null
    } finally {
      loadingIds.value[id] = false
    }
  }

  const getTranslation = (id: string): string | undefined => {
    return translations.value[`${id}:${locale.value}`]
  }

  const isTranslating = (id: string): boolean => {
    return !!loadingIds.value[id]
  }

  const hasTranslation = (id: string): boolean => {
    return !!translations.value[`${id}:${locale.value}`]
  }

  return {
    translateText,
    getTranslation,
    isTranslating,
    hasTranslation,
  }
}
