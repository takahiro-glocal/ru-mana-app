export const useCultureGuides = () => {
  // ガイドデータを保持するState
  const guides = useState<CultureGuideMap>('culture-guides-data', () => ({}));
  const isLoading = useState<boolean>('culture-guides-loading', () => false);
  const error = useState<Error | null>('culture-guides-error', () => null);

  /**
   * APIモックからガイドデータを取得する
   */
  const loadGuides = async () => {
    // 既にデータがある場合は再取得しない（キャッシュ的な挙動）
    if (Object.keys(guides.value).length > 0) return;

    isLoading.value = true;
    try {
      const { data, error: fetchError } = await useFetch<CultureGuideMap>('/api-mocks/guides.json');
      
      if (fetchError.value) {
        throw new Error(fetchError.value.message);
      }

      if (data.value) {
        guides.value = data.value;
      }
    } catch (e: any) {
      console.error('Failed to load culture guides:', e);
      error.value = e;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * カテゴリIDを指定してガイド一覧を取得する
   */
  const getGuidesByCategory = (categoryId: string): ComputedRef<CultureGuide[]> => {
    return computed(() => guides.value[categoryId] || []);
  };

  return {
    guides: readonly(guides),
    isLoading: readonly(isLoading),
    error: readonly(error),
    loadGuides,
    getGuidesByCategory
  };
};