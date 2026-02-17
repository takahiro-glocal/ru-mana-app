// composables/useUserHistory.ts

export const useUserHistory = () => {
  const historyKey = 'ru-mana-history';
  const history = useState<BrowsingHistory[]>('user-history', () => []);

  // 初期化：ローカルストレージから読み込み
  const initHistory = () => {
    if (process.client) {
      const stored = localStorage.getItem(historyKey);
      if (stored) {
        try {
          history.value = JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse history', e);
          history.value = [];
        }
      }
    }
  };

  // 履歴に追加
  const addHistory = (item: Omit<BrowsingHistory, 'viewedAt'>) => {
    if (!process.client) return;

    // 重複排除（同じスレッドは一旦削除して先頭に追加）
    const filtered = history.value.filter(h => h.threadId !== item.threadId);
    
    const newItem: BrowsingHistory = {
      ...item,
      viewedAt: new Date().toISOString()
    };

    // 最大50件まで保持
    const newHistory = [newItem, ...filtered].slice(0, 50);
    
    history.value = newHistory;
    localStorage.setItem(historyKey, JSON.stringify(newHistory));
  };

  // 履歴を全削除
  const clearHistory = () => {
    if (!process.client) return;
    history.value = [];
    localStorage.removeItem(historyKey);
  };

  return {
    history: readonly(history),
    initHistory,
    addHistory,
    clearHistory
  };
};