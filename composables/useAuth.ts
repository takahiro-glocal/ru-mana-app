import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from "firebase/auth";

export const useAuth = () => {
  const { $auth } = useNuxtApp();
  
  // ユーザー状態 (nullの場合はゲスト)
  const user = useState<User | null>('firebase-user', () => null);
  const isAuthLoading = useState<boolean>('auth-loading', () => true);

  // 初期化：状態監視
  const initAuth = () => {
    if (process.client) {
      onAuthStateChanged($auth, (currentUser) => {
        user.value = currentUser;
        isAuthLoading.value = false;
      });
    }
  };

  // Googleログイン
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup($auth, provider);
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

  // ユーザー表示名取得（なければメールの一部、それもなければゲスト）
  const userDisplayName = computed(() => {
    if (!user.value) return "ゲストさん";
    return user.value.displayName || user.value.email?.split('@')[0] || "名無しさん";
  });

  // ユーザーアイコン取得
  const userPhotoURL = computed(() => {
    if (user.value?.photoURL) return user.value.photoURL;
    // DiceBear APIでシードごとのアイコンを生成
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