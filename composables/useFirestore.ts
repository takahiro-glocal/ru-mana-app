import {
  collection,
  collectionGroup,
  addDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  onSnapshot,
  getDocs,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  increment,
  getDoc,
  setDoc,
  writeBatch
} from "firebase/firestore";

export interface Post {
  id: string;
  body: string;
  userId: string;
  userName: string;
  userIcon: string;
  createdAt: FirebaseTimestamp | null;
  likes: number;
  replyToId?: string;
  replyToName?: string;
  replyToText?: string;
  isOfficial?: boolean;
}

export interface Thread {
  id: string;
  categoryId: string;
  title: string;
  createdAt: FirebaseTimestamp | null;
  updatedAt: FirebaseTimestamp | null;
  postCount: number;
}

export const useFirestore = () => {
  const { $firestore } = useNuxtApp();

  // State
  const posts = ref<Post[]>([]);
  const threads = ref<Thread[]>([]); // スレッド一覧用
  const allThreads = ref<Thread[]>([]); // 全スレッド (検索用)
  const isLoading = ref(false);

  // onSnapshot リスナーの自動解除ヘルパー
  const activeUnsubscribes: (() => void)[] = [];
  const registerUnsubscribe = (unsubscribe: () => void) => {
    activeUnsubscribes.push(unsubscribe);
    return unsubscribe;
  };

  if (getCurrentInstance()) {
    onUnmounted(() => {
      activeUnsubscribes.forEach(unsub => unsub());
      activeUnsubscribes.length = 0;
    });
  }

  // --- Posts Logic (Existing) ---
  
  const subscribeToPosts = (threadId: string) => {
    isLoading.value = true;
    const q = query(
      collection($firestore, `threads/${threadId}/posts`),
      orderBy("createdAt", "asc")
    );
    
    return registerUnsubscribe(onSnapshot(q, (snapshot) => {
      posts.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Post));
      isLoading.value = false;
    }));
  };

  const MAX_POST_BODY_LENGTH = 5000;
  const MAX_THREAD_TITLE_LENGTH = 200;

  const addPost = async (threadId: string, threadTitle: string, postData: Omit<Post, 'id' | 'createdAt' | 'likes'>) => {
    if (postData.body.length > MAX_POST_BODY_LENGTH) {
      throw new Error(`Post body exceeds maximum length of ${MAX_POST_BODY_LENGTH} characters`);
    }
    const batch = writeBatch($firestore);

    // 1. Add Post
    const postRef = doc(collection($firestore, `threads/${threadId}/posts`));
    batch.set(postRef, {
      ...postData,
      createdAt: serverTimestamp(),
      likes: 0
    });

    // 2. Update Thread Meta (Last updated & count)
    const threadRef = doc($firestore, 'threads', threadId);
    batch.update(threadRef, {
      updatedAt: serverTimestamp(),
      postCount: increment(1)
    });

    await batch.commit();
  };

  const updatePost = async (threadId: string, postId: string, body: string) => {
    if (body.length > MAX_POST_BODY_LENGTH) {
      throw new Error(`Post body exceeds maximum length of ${MAX_POST_BODY_LENGTH} characters`);
    }
    const postRef = doc($firestore, `threads/${threadId}/posts`, postId);
    await updateDoc(postRef, { body });
  };

  const deletePost = async (threadId: string, postId: string) => {
    const batch = writeBatch($firestore);

    const postRef = doc($firestore, `threads/${threadId}/posts`, postId);
    batch.delete(postRef);

    const threadRef = doc($firestore, 'threads', threadId);
    batch.update(threadRef, { postCount: increment(-1) });

    await batch.commit();
  };

  const likePost = async (threadId: string, postId: string) => {
    const postRef = doc($firestore, `threads/${threadId}/posts`, postId);
    await updateDoc(postRef, { likes: increment(1) });
  };

  /**
   * ユーザーの投稿履歴を取得 (collectionGroup query)
   */
  const getUserPosts = async (userId: string): Promise<Post[]> => {
    const q = query(
      collectionGroup($firestore, 'posts'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      firestoreLimit(20)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    } as Post));
  };

  /**
   * ポイント取得 (users/{uid} ドキュメントから)
   */
  const getUserPoints = async (userId: string): Promise<number> => {
    const userDoc = await getDoc(doc($firestore, 'users', userId));
    return userDoc.exists() ? (userDoc.data()?.points ?? 0) : 0;
  };

  /**
   * ポイント加算
   */
  const addPoints = async (userId: string, amount: number, reason: string) => {
    const batch = writeBatch($firestore);
    const userRef = doc($firestore, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      batch.set(userRef, { points: amount });
    } else {
      batch.update(userRef, { points: increment(amount) });
    }

    const historyRef = doc(collection($firestore, `users/${userId}/point_history`));
    batch.set(historyRef, {
      amount,
      reason,
      createdAt: serverTimestamp()
    });

    await batch.commit();
  };

  /**
   * ポイント履歴取得
   */
  const getPointHistory = async (userId: string): Promise<PointHistoryItem[]> => {
    const q = query(
      collection($firestore, `users/${userId}/point_history`),
      orderBy('createdAt', 'desc'),
      firestoreLimit(20)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PointHistoryItem));
  };

  /**
   * フィードバック送信 → Firestore保存
   */
  const MAX_FEEDBACK_LENGTH = 5000;

  const submitFeedback = async (content: string, userId: string, userName: string) => {
    if (content.length > MAX_FEEDBACK_LENGTH) {
      throw new Error(`Feedback exceeds maximum length of ${MAX_FEEDBACK_LENGTH} characters`);
    }
    await addDoc(collection($firestore, 'feedback'), {
      content,
      userId,
      userName,
      createdAt: serverTimestamp(),
      status: 'new'
    });
  };

  /**
   * 最新スレッドを全カテゴリ横断で取得（ホーム更新フィード用）
   */
  const subscribeToLatestThreads = (limitCount: number = 5) => {
    isLoading.value = true;
    const q = query(
      collection($firestore, 'threads'),
      orderBy('updatedAt', 'desc'),
      firestoreLimit(limitCount)
    );

    return registerUnsubscribe(onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      } as Thread));
      allThreads.value = fetched;
      threads.value = fetched;
      isLoading.value = false;
    }));
  };

  // --- ★ New: Threads Logic ---

  /**
   * カテゴリごとのスレッド一覧をリアルタイム取得
   */
  const subscribeToCategoryThreads = (categoryId: string) => {
    isLoading.value = true;
    const q = query(
      collection($firestore, 'threads'),
      where('categoryId', '==', categoryId),
      orderBy('updatedAt', 'desc')
    );

    return registerUnsubscribe(onSnapshot(q, (snapshot) => {
      threads.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Thread));
      isLoading.value = false;
    }));
  };

  /**
   * 新規スレッド作成
   * スレッドドキュメントを作成し、直後に最初の投稿を追加します
   */
  const createThread = async (categoryId: string, title: string, body: string, user: FirebaseUserInfo) => {
    if (title.length > MAX_THREAD_TITLE_LENGTH) {
      throw new Error(`Thread title exceeds maximum length of ${MAX_THREAD_TITLE_LENGTH} characters`);
    }
    if (body.length > MAX_POST_BODY_LENGTH) {
      throw new Error(`Post body exceeds maximum length of ${MAX_POST_BODY_LENGTH} characters`);
    }
    // 1. Create Thread Document
    const threadRef = await addDoc(collection($firestore, 'threads'), {
      categoryId,
      title,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      postCount: 0 // addPostで+1されるため0スタート
    });

    // 2. Add First Post (This will also update postCount to 1)
    await addPost(threadRef.id, title, {
      body,
      userId: user.uid,
      userName: user.displayName || 'No Name',
      userIcon: user.photoURL || '',
    });

    return threadRef.id;
  };

  return {
    posts: readonly(posts),
    threads: readonly(threads),
    allThreads: readonly(allThreads),
    isLoading: readonly(isLoading),
    subscribeToPosts,
    addPost,
    updatePost,
    deletePost,
    likePost,
    getUserPosts,
    getUserPoints,
    addPoints,
    getPointHistory,
    submitFeedback,
    subscribeToLatestThreads,
    subscribeToCategoryThreads,
    createThread
  };
};