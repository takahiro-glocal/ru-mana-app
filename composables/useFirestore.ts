import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  deleteDoc,
  increment,
  getDoc
} from "firebase/firestore";

export interface Post {
  id: string;
  body: string;
  userId: string;
  userName: string;
  userIcon: string;
  createdAt: any;
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
  createdAt: any;
  updatedAt: any;
  postCount: number;
}

export const useFirestore = () => {
  const { $firestore } = useNuxtApp();
  
  // State
  const posts = ref<Post[]>([]);
  const threads = ref<Thread[]>([]); // スレッド一覧用
  const isLoading = ref(false);

  // --- Posts Logic (Existing) ---
  
  const subscribeToPosts = (threadId: string) => {
    isLoading.value = true;
    const q = query(
      collection($firestore, `threads/${threadId}/posts`),
      orderBy("createdAt", "asc")
    );
    
    return onSnapshot(q, (snapshot) => {
      posts.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Post));
      isLoading.value = false;
    });
  };

  const addPost = async (threadId: string, threadTitle: string, postData: Omit<Post, 'id' | 'createdAt' | 'likes'>) => {
    // 1. Add Post
    await addDoc(collection($firestore, `threads/${threadId}/posts`), {
      ...postData,
      createdAt: serverTimestamp(),
      likes: 0
    });

    // 2. Update Thread Meta (Last updated & count)
    const threadRef = doc($firestore, 'threads', threadId);
    await updateDoc(threadRef, {
      updatedAt: serverTimestamp(),
      postCount: increment(1)
    });
  };

  const updatePost = async (threadId: string, postId: string, body: string) => {
    const postRef = doc($firestore, `threads/${threadId}/posts`, postId);
    await updateDoc(postRef, { body });
  };

  const deletePost = async (threadId: string, postId: string) => {
    const postRef = doc($firestore, `threads/${threadId}/posts`, postId);
    await deleteDoc(postRef);
    // Decrement count
    const threadRef = doc($firestore, 'threads', threadId);
    await updateDoc(threadRef, { postCount: increment(-1) });
  };

  const likePost = async (threadId: string, postId: string) => {
    const postRef = doc($firestore, `threads/${threadId}/posts`, postId);
    await updateDoc(postRef, { likes: increment(1) });
  };

  const getUserPosts = async (userId: string) => {
    // Implementation for getting user posts (omitted for brevity as per instructions)
    return [];
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

    return onSnapshot(q, (snapshot) => {
      threads.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Thread));
      isLoading.value = false;
    });
  };

  /**
   * 新規スレッド作成
   * スレッドドキュメントを作成し、直後に最初の投稿を追加します
   */
  const createThread = async (categoryId: string, title: string, body: string, user: any) => {
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
    threads: readonly(threads), // Expose threads
    isLoading: readonly(isLoading),
    subscribeToPosts,
    addPost,
    updatePost,
    deletePost,
    likePost,
    getUserPosts,
    subscribeToCategoryThreads, // New
    createThread // New
  };
};