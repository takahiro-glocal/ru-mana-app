import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence,
  type User
} from "firebase/auth";
import { shallowRef, computed } from "vue";

// モジュールレベル: 全コンポーネントで共有
const user = shallowRef<User | null>(null);
const isAuthLoading = shallowRef(true);
let authInitialized = false;

export const useAuth = () => {
  const { $auth } = useNuxtApp();

  // 自動初期化: composable呼び出し時にリスナーを1回だけ登録
  if (process.client && !authInitialized) {
    authInitialized = true;

    // 明示的に永続化方式を設定
    setPersistence($auth, browserLocalPersistence).catch((err) => {
      console.warn("Auth persistence setup failed:", err);
    });

    onAuthStateChanged($auth, (currentUser) => {
      user.value = currentUser;
      isAuthLoading.value = false;
    });

    // リダイレクトログインの結果を処理（フォールバック時用）
    getRedirectResult($auth).catch((error) => {
      if (error?.code !== "auth/redirect-cancelled-by-user") {
        console.error("Redirect result error:", error);
      }
    });
  }

  // 後方互換のため残す (何もしない)
  const initAuth = () => {};

  // Googleログイン（ポップアップ優先、失敗時リダイレクト）
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup($auth, provider);
    } catch (error: unknown) {
      const code = (error as { code?: string })?.code;
      // ポップアップがブロックされた場合のみリダイレクトにフォールバック
      if (
        code === "auth/popup-blocked" ||
        code === "auth/popup-closed-by-user" ||
        code === "auth/cancelled-popup-request"
      ) {
        await signInWithRedirect($auth, provider);
      } else {
        console.error("Google Login Error:", error);
        throw error;
      }
    }
  };

  // パスワードポリシーチェック（最低8文字、英字+数字を含む）
  const validatePassword = (pass: string): string | null => {
    if (pass.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Za-z]/.test(pass)) return 'Password must contain at least one letter';
    if (!/[0-9]/.test(pass)) return 'Password must contain at least one number';
    return null;
  };

  // メールアドレスで新規登録
  const registerWithEmail = async (email: string, pass: string) => {
    const policyError = validatePassword(pass);
    if (policyError) throw new Error(policyError);
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
    return user.value.displayName || user.value.email?.split("@")[0] || "Guest";
  });

  // ユーザーアイコン取得
  const userPhotoURL = computed(() => {
    if (user.value?.photoURL) return user.value.photoURL;
    const seed = user.value?.uid || "guest";
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
