import {
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from "firebase/auth";

// グローバルフラグ: リスナー登録済みかどうか
let authInitialized = false;

export const useAuth = () => {
  const { $auth } = useNuxtApp();

  // ユーザー状態 (nullの場合はゲスト)
  const user = useState<User | null>('firebase-user', () => null);
  const isAuthLoading = useState<boolean>('auth-loading', () => true);

  // 自動初期化: composable呼び出し時にリスナーを1回だけ登録
  if (process.client && !authInitialized) {
    authInitialized = true;

    onAuthStateChanged($auth, (currentUser) => {
      user.value = currentUser;
      isAuthLoading.value = false;
    });

    // Googleリダイレクトログインの結果を処理
    getRedirectResult($auth).catch((error) => {
      if (error?.code !== 'auth/redirect-cancelled-by-user') {
        console.error("Redirect result error:", error);
      }
    });
  }

  // 後方互換のため残す (何もしない)
  const initAuth = () => {};

  // Googleログイン（リダイレクト方式 — COOPエラー回避）
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect($auth, provider);
    } catch (error) {
      console.error("Google Login Error:", error);
      throw error;
    }
  };

  // メールアドレスで新規登録
  const registerWithEmail = async (email: string, pass: string) => {
    try {
      await createUserWithEmailAndPassword($auth, email, pass);
    } catch (error) {
      console.error("Register Error:", error);
      throw error;
    }
  };

  // メールアドレスでログイン
  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword($auth, email, pass);
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };

  // ログアウト
  const logout = async () => {
    try {
      await signOut($auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // ユーザー表示名取得
  const userDisplayName = computed(() => {
    if (!user.value) return "Guest";
    return user.value.displayName || user.value.email?.split('@')[0] || "Guest";
  });

  // ユーザーアイコン取得
  const userPhotoURL = computed(() => {
    if (user.value?.photoURL) return user.value.photoURL;
    const seed = user.value?.uid || 'guest';
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  });

  return {
    user,
    isAuthLoading,
    initAuth,
    loginWithGoogle,
    registerWithEmail,
    loginWithEmail,
    logout,
    userDisplayName,
    userPhotoURL
  };
};
