import { ref, computed } from 'vue'

// グローバルステート（ページを跨いでもデータを保持）
const categories = ref<ShiruCategory[]>([])
const allThreads = ref<ShiruThread[]>([])
const threadDetails = ref<ShiruThreadDetail[]>([])

export const useShiru = () => {
  /**
   * カテゴリー一覧のロード
   */
  const loadCategories = async () => {
    if (categories.value.length > 0) return // 既に取得済ならスキップ
    try {
      categories.value = await $fetch<ShiruCategory[]>('/api-mocks/shiru-categories.json')
    } catch (e) {
      console.error('Failed to load categories:', e)
    }
  }

  /**
   * 全スレッドデータのロード
   */
  const loadAllThreads = async () => {
    if (allThreads.value.length > 0) return // 既に取得済ならスキップ
    try {
      allThreads.value = await $fetch<ShiruThread[]>('/api-mocks/shiru-threads.json')
    } catch (e) {
      console.error('Failed to load threads:', e)
    }
  }

  /**
   * 特定カテゴリーのスレッド一覧を取得（Computed）
   * @param cid カテゴリーID
   */
  const getThreadsByCategory = (cid: string) => {
    return computed(() => allThreads.value.filter(t => t.categoryId === cid))
  }

  /**
   * 特定のスレッド詳細を取得
   * @param tid スレッドID
   */
  const getThreadById = (tid: string) => {
    return computed(() => allThreads.value.find(t => t.id === tid))
  }

  /**
   * カテゴリー情報の取得
   * @param cid カテゴリーID
   */
  const getCategoryById = (cid: string) => {
    return computed(() => categories.value.find(c => c.id === cid))
  }

  const loadThreadDetails = async () => {
    if (threadDetails.value.length > 0) return
    threadDetails.value = await $fetch<any[]>('/api-mocks/shiru-thread-detail.json')
  }

  const getThreadDetail = (tid: string) => {
    return computed(() => threadDetails.value.find(d => d.threadId === tid))
  }

  return {
    categories,
    allThreads,
    loadCategories,
    loadAllThreads,
    loadThreadDetails,
    getThreadsByCategory,
    getThreadById,
    getCategoryById,
    getThreadDetail,
  }
}