import { doc, getDoc, setDoc } from 'firebase/firestore'

export const useTranslation = () => {
  const translations = useState<Record<string, string>>('ai-translations', () => ({}))
  const loadingIds = useState<Record<string, boolean>>('ai-translation-loading', () => ({}))

  const { locale } = useI18n()
  const { $firestore } = useNuxtApp()

  /**
   * Firestoreのキャッシュキーを生成（テキスト+言語のSHA-256ハッシュ）
   * 衝突リスクを排除するため暗号学的ハッシュを使用
   */
  const generateCacheId = async (text: string, targetLang: string): Promise<string> => {
    const str = `${text}::${targetLang}`
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    // Firestoreドキュメント名制限に収まるよう先頭32文字を使用（128bit = 十分な衝突耐性）
    return `tr_${hashHex.substring(0, 32)}`
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

    loadingIds.value[id] = true
    try {
      const firestoreCacheId = await generateCacheId(text, locale.value)

      // 2. Firestoreキャッシュ確認
      const cached = await getFromFirestore(firestoreCacheId)
      if (cached) {
        translations.value[memKey] = cached
        return cached
      }

      // 3. サーバーサイドGemini API経由で翻訳
      const { generateContent } = useGemini()

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

      const translatedText = await generateContent(prompt)

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

  // スレッドタイトル翻訳ヘルパー（複数ページで共通利用）
  const needsTranslation = computed(() => locale.value !== 'ja')

  const isTitleTranslated = (threadId: string): boolean => {
    if (!needsTranslation.value) return true
    return !!getTranslation(`title:${threadId}`)
  }

  const getTranslatedTitle = (threadId: string, originalTitle: string): string => {
    if (!needsTranslation.value) return originalTitle
    return getTranslation(`title:${threadId}`) || originalTitle
  }

  return {
    translateText,
    getTranslation,
    isTranslating,
    hasTranslation,
    needsTranslation,
    isTitleTranslated,
    getTranslatedTitle,
  }
}
