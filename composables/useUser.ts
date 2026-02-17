// 簡易的なユーザーID管理
// 本番ではFirebase Auth等を使用してください
export const useUser = () => {
  const userId = useState<string>('app-user-id', () => '');
  const userName = useState<string>('app-user-name', () => 'ゲストさん');
  const userIcon = useState<string>('app-user-icon', () => '');

  const initUser = () => {
    if (process.client) {
      // LocalStorageから取得、なければ生成
      let storedId = localStorage.getItem('ru-mana-uid');
      if (!storedId) {
        storedId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('ru-mana-uid', storedId);
      }
      userId.value = storedId;

      // アイコンはランダムに決定（DiceBear API）
      userIcon.value = `https://api.dicebear.com/7.x/avataaars/svg?seed=${storedId}`;
    }
  };

  return {
    userId: readonly(userId),
    userName: readonly(userName),
    userIcon: readonly(userIcon),
    initUser
  };
};