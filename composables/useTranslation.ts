import { doc, getDoc, setDoc } from 'firebase/firestore'

export const useTranslation = () => {
  const translations = useState<Record<string, string>>('ai-translations', () => ({}))
  const loadingIds = useState<Record<string, boolean>>('ai-translation-loading', () => ({}))

  const { locale } = useI18n()
  const { $firestore } = useNuxtApp()

  /**
   * Firestoreのキャッシュキーを生成（テキスト+言語のハッシュ）
   */
  const generateCacheId = (text: string, targetLang: string): string => {
    let hash = 0
    const str = `${text}::${targetLang}`
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash |= 0
    }
    return `tr_${Math.abs(hash).toString(36)}`
  }

  /**
   * Firestoreからキャッシュされた翻訳を取得
   */
  const getFromFirestore = async (cacheId: string): Promise<string | null> => {
    try {
      const docRef = doc($firestore, 'translations', cacheId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return docSnap.data().translatedText
      }
    } catch (e) {
      console.warn('Firestore cache read failed:', e)
    }
    return null
  }

  /**
   * Firestoreに翻訳をキャッシュ保存
   */
  const saveToFirestore = async (cacheId: string, sourceText: string, targetLang: string, translatedText: string) => {
    try {
      const docRef = doc($firestore, 'translations', cacheId)
      await setDoc(docRef, {
        sourceText,
        targetLang,
        translatedText,
        createdAt: new Date()
      })
    } catch (e) {
      console.warn('Firestore cache write failed:', e)
    }
  }

  /**
   * テキストをAI翻訳する（Firestore → メモリ → API の順で取得）
   */
  const translateText = async (id: string, text: string): Promise<string | null> => {
    const memKey = `${id}:${locale.value}`

    // 1. メモリキャッシュ確認
    if (translations.value[memKey]) {
      return translations.value[memKey]
    }

    const firestoreCacheId = generateCacheId(text, locale.value)

    loadingIds.value[id] = true
    try {
      // 2. Firestoreキャッシュ確認
      const cached = await getFromFirestore(firestoreCacheId)
      if (cached) {
        translations.value[memKey] = cached
        return cached
      }

      // 3. クライアントサイドGemini APIで翻訳
      const { getModel } = useGemini()
      const model = getModel()

      const langNames: Record<string, string> = {
        ja: 'Japanese',
        en: 'English',
        zh: 'Simplified Chinese',
      }
      const targetLangName = langNames[locale.value] || locale.value

      const prompt = `You are a cultural translator for Japan. Your role is not just to translate words, but to convey cultural context and meaning.

When translating content related to Japanese culture, manners, or daily life:
- Preserve cultural nuances and explain implicit cultural context when needed
- If the text references a Japanese custom or concept that may be unfamiliar, provide a brief, natural explanation within the translation
- Maintain the original tone (formal/casual/friendly)
- Do NOT add translator's notes or brackets — weave any cultural context naturally into the translation

Source language: auto-detect
Target language: ${targetLangName}

Translate the following text. Return ONLY the translated text, nothing else:

${text}`

      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Translation timed out')), 30_000)
        )
      ])
      const translatedText = result.response.text()?.trim()

      if (!translatedText) throw new Error('No translation returned')

      // メモリとFirestoreの両方にキャッシュ（SoT: Firestore を先に保存）
      await saveToFirestore(firestoreCacheId, text, locale.value, translatedText)
      translations.value[memKey] = translatedText

      return translatedText
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
