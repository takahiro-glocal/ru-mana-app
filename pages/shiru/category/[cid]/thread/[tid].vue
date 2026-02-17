<template>
  <div class="tw-h-screen tw-bg-white md:tw-bg-[#F9F5E7] tw-flex tw-flex-col tw-overflow-hidden">
    <header class="tw-bg-white tw-border-b tw-border-gray-100 tw-p-4 md:tw-px-8 md:tw-py-6 tw-z-30 tw-flex-shrink-0">
      <div class="tw-max-w-7xl tw-mx-auto tw-flex tw-justify-between tw-items-center">
        <div class="tw-flex tw-items-center tw-gap-4">
          <div class="tw-bg-[#85C441] tw-p-2 tw-rounded-xl md:tw-p-3 md:tw-rounded-2xl tw-cursor-pointer" @click="() => $router.push(localePath('/shiru'))">
            <Lightbulb class="tw-w-6 md:tw-w-10 tw-h-6 md:tw-h-10 tw-text-white" />
          </div>
          <div>
            <h1 class="tw-text-xl md:tw-text-4xl tw-font-bold tw-text-gray-800">しるまな</h1>
            <p class="tw-text-[9px] md:tw-text-sm tw-text-gray-500 tw-font-medium">その知識や経験を良い判断や問題解決に</p>
          </div>
        </div>

        <div class="tw-hidden md:tw-flex tw-items-center tw-gap-6">
          <div class="tw-relative">
            <input type="text" class="tw-bg-[#4B3E8E] tw-bg-opacity-10 tw-rounded-md tw-py-2 tw-px-10 tw-w-80 tw-text-sm" placeholder="[スレッド内検索]">
            <Search class="tw-absolute tw-left-3 tw-top-1/2 tw-transform -tw-translate-y-1/2 tw-text-gray-500 tw-w-4" />
          </div>
          <div class="tw-flex tw-items-center tw-gap-4 tw-text-gray-300">
            <FileText class="tw-w-7 tw-h-7" />
            <Home class="tw-w-7 tw-h-7 tw-cursor-pointer" @click="() => $router.push(localePath('/'))" />
            
            <div v-if="user" @click="openDrawer()" class="tw-cursor-pointer">
              <img :src="userPhotoURL" class="tw-w-10 tw-h-10 tw-rounded-full tw-border-2 tw-border-gray-100 shadow-sm" />
            </div>
            <UserCircle v-else class="tw-w-10 tw-h-10 tw-text-gray-400 tw-cursor-pointer" @click="isLoginModalOpen = true" />
          </div>
        </div>

        <div class="md:tw-hidden tw-flex tw-items-center">
            <div v-if="user" @click="openDrawer()" class="tw-cursor-pointer">
              <img :src="userPhotoURL" class="tw-w-8 tw-h-8 tw-rounded-full tw-border-2 tw-border-gray-100 shadow-sm" />
            </div>
            <UserCircle v-else class="tw-text-gray-300 tw-w-8 tw-h-8 tw-cursor-pointer" @click="isLoginModalOpen = true" />
        </div>

      </div>
    </header>

    <div class="tw-max-w-7xl tw-mx-auto tw-w-full tw-flex-1 tw-flex tw-overflow-hidden">
      <aside class="tw-hidden md:tw-block tw-w-80 tw-bg-white tw-border-r tw-border-gray-100 tw-overflow-y-auto">
        <div class="tw-p-6">
          <h3 class="tw-text-[10px] tw-font-bold tw-text-gray-400 tw-uppercase tw-tracking-widest tw-mb-4">Related Threads</h3>
          <div class="tw-space-y-1">
            <div v-if="siblings.length === 0" class="tw-text-xs tw-text-gray-400">関連スレッドはありません</div>
            <div 
              v-for="t in siblings" 
              :key="t.id"
              @click="() => switchThread(t.id)"
              :class="[
                'tw-p-4 tw-rounded-2xl tw-cursor-pointer tw-transition-all tw-duration-200',
                tid === t.id ? 'tw-bg-[#F9F5E7] tw-text-[#85C441] tw-shadow-sm' : 'tw-text-gray-600 hover:tw-bg-gray-50'
              ]"
            >
              <div class="tw-flex tw-items-center tw-gap-2">
                <div :class="['tw-w-2 tw-h-2 tw-rounded-full', getTheme(cid).dot]"></div>
                <p class="tw-text-sm tw-font-bold tw-line-clamp-2">{{ t.title }}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main class="tw-flex-1 tw-relative tw-flex tw-flex-col tw-bg-white tw-overflow-hidden">
        
        <nav class="tw-hidden md:tw-flex tw-items-center tw-gap-2 tw-text-[10px] tw-text-gray-400 tw-pt-6 tw-px-10">
          <span class="tw-cursor-pointer hover:tw-text-gray-600" @click="() => $router.push(localePath('/shiru'))">しるまな</span>
          <ChevronRight class="tw-w-3 tw-h-3" />
          <span class="tw-cursor-pointer hover:tw-text-gray-600" @click="() => $router.push(localePath(`/shiru/category/${cid}`))">
            {{ currentCategory?.name }}
          </span>
          <ChevronRight class="tw-w-3 tw-h-3" />
          <span class="tw-text-gray-600 tw-truncate tw-max-w-xs">{{ currentThreadInfo?.title }}</span>
        </nav>

        <div v-if="currentThreadInfo" class="tw-p-6 md:tw-p-10 md:tw-pt-4 tw-border-b tw-border-gray-50 tw-flex-shrink-0">
          <div class="tw-flex tw-items-center tw-gap-3 tw-mb-3">
            <span :class="['tw-px-3 tw-py-1 tw-rounded-full tw-text-[10px] tw-font-black tw-text-white uppercase', getTheme(cid).textBg]">
              {{ currentCategory?.name }}
            </span>
            <span class="tw-text-[10px] tw-text-gray-300 tw-font-bold">{{ currentThreadInfo.date }}</span>
          </div>
          <h2 class="tw-text-2xl md:tw-text-4xl tw-font-black tw-text-gray-800 tw-leading-tight">
            {{ currentThreadInfo.title }}
          </h2>
        </div>

        <div 
          ref="postsContainer" 
          class="tw-flex-1 tw-overflow-y-auto tw-p-6 md:tw-p-10 tw-bg-[#FDFCF9] tw-pb-32 md:tw-pb-40"
        >
          <div v-if="posts.length > 0" class="tw-space-y-10">
            <div 
              v-for="(post, index) in posts" 
              :key="post.id"
              :id="'post-' + post.id" 
              class="tw-flex tw-gap-4 md:tw-gap-6 tw-group tw-transition-colors tw-duration-500 tw-rounded-xl tw-p-2"
            >
              <img :src="post.userIcon" class="tw-w-10 tw-h-10 md:tw-w-14 md:tw-h-14 tw-rounded-full tw-bg-white tw-shadow-sm tw-border tw-border-gray-100" />
              
              <div class="tw-flex-1 tw-min-w-0">
                <div class="tw-flex tw-items-center tw-gap-3 tw-mb-2">
                  <span class="tw-font-black tw-text-sm md:tw-text-base tw-text-gray-800">
                    {{ index + 1 }}. {{ post.userName }}
                  </span>
                  <span v-if="post.isOfficial" class="tw-bg-[#85C441] tw-text-white tw-text-[8px] tw-px-2 tw-py-0.5 tw-rounded tw-font-bold uppercase tracking-wider">Official</span>
                  <span class="tw-text-[10px] tw-text-gray-300 tw-font-bold">{{ formatDate(post.createdAt) }}</span>
                </div>

                <div class="tw-bg-white tw-p-5 tw-rounded-2xl tw-shadow-sm tw-border tw-border-gray-100 tw-relative">
                  
                  <div 
                    v-if="post.replyToId" 
                    @click="scrollToPost(post.replyToId)"
                    class="tw-mb-3 tw-pl-3 tw-border-l-4 tw-border-gray-200 tw-bg-gray-50 tw-p-2 tw-rounded-r-md tw-cursor-pointer hover:tw-bg-gray-100 tw-transition-colors"
                  >
                     <div class="tw-text-[10px] tw-text-gray-400 tw-font-bold tw-mb-0.5">
                       To: {{ post.replyToName || 'Unknown' }}
                     </div>
                     <div class="tw-text-xs tw-text-gray-500 tw-line-clamp-1 tw-italic">
                       "{{ post.replyToText || '...' }}"
                     </div>
                  </div>

                  <p class="tw-text-sm md:tw-text-base tw-text-gray-700 tw-leading-relaxed tw-whitespace-pre-wrap">{{ post.body }}</p>
                  <div class="tw-absolute tw-top-4 -tw-left-2 tw-w-4 tw-h-4 tw-bg-white tw-border-l tw-border-b tw-border-gray-100 tw-rotate-45"></div>
                  
                  <div v-if="user && post.userId === user.uid" class="tw-absolute tw-top-2 tw-right-2">
                    <button @click="toggleMenu(post.id)" class="tw-p-1 tw-rounded-full hover:tw-bg-gray-100 tw-text-gray-300">
                      <MoreVertical class="tw-w-4 tw-h-4" />
                    </button>
                    <div v-if="activeMenuId === post.id" class="tw-absolute tw-right-0 tw-top-6 tw-bg-white tw-shadow-lg tw-rounded-xl tw-border tw-border-gray-100 tw-z-10 tw-overflow-hidden tw-w-24 tw-animate-fade-in">
                      <button @click="startEdit(post)" class="tw-w-full tw-text-left tw-px-4 tw-py-2 tw-text-xs tw-font-bold tw-text-gray-600 hover:tw-bg-gray-50 tw-flex tw-items-center tw-gap-2">
                        <Edit2 class="tw-w-3 tw-h-3" /> 編集
                      </button>
                      <button @click="confirmDelete(post.id)" class="tw-w-full tw-text-left tw-px-4 tw-py-2 tw-text-xs tw-font-bold tw-text-red-500 hover:tw-bg-red-50 tw-flex tw-items-center tw-gap-2">
                        <Trash2 class="tw-w-3 tw-h-3" /> 削除
                      </button>
                    </div>
                  </div>
                </div>

                <div class="tw-flex tw-gap-5 tw-mt-3">
                  <button 
                    @click="handleLike(post.id)" 
                    :disabled="isLiked(post.id)"
                    :class="[
                      'tw-flex tw-items-center tw-gap-1.5 tw-text-[10px] tw-font-bold tw-transition-colors',
                      isLiked(post.id) ? 'tw-text-[#85C441]' : 'tw-text-gray-400 hover:tw-text-[#85C441]'
                    ]"
                  >
                    <ArrowUp class="tw-w-3 tw-h-3" /> 役に立った ({{ post.likes || 0 }})
                  </button>

                  <button 
                    @click="handleReply(post)" 
                    class="tw-flex tw-items-center tw-gap-1.5 tw-text-[10px] tw-font-bold tw-text-gray-400 hover:tw-text-[#E4007F] tw-transition-colors"
                  >
                    <MessageSquare class="tw-w-3 tw-h-3" /> 返信
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="!isLoading" class="tw-h-full tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-p-8">
            <div class="tw-w-32 tw-h-32 tw-bg-gray-100 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mb-6">
              <MessageSquare class="tw-w-16 tw-h-16 tw-text-gray-300" />
            </div>
            <h3 class="tw-text-xl tw-font-bold tw-text-gray-600 tw-mb-2">まだ投稿がありません</h3>
            <p class="tw-text-sm tw-text-gray-400 tw-max-w-xs">
              このスレッドの最初の投稿者になりませんか？<br>あなたの知識や経験が誰かの助けになります。
            </p>
          </div>
          
          <div v-else class="tw-h-full tw-flex tw-items-center tw-justify-center">
            <div class="tw-animate-pulse tw-flex tw-flex-col tw-items-center tw-gap-4">
              <div class="tw-w-12 tw-h-12 tw-bg-[#85C441] tw-rounded-xl tw-opacity-20"></div>
              <span class="tw-text-xs tw-text-gray-300">読み込み中...</span>
            </div>
          </div>
        </div>

        <div class="tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-p-4 md:tw-p-6 tw-bg-white tw-border-t tw-border-gray-100 tw-z-40 tw-shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)]">
          
          <div v-if="editingPostId" class="tw-max-w-4xl tw-mx-auto tw-mb-2 tw-flex tw-items-center tw-justify-between tw-bg-[#E4007F] tw-bg-opacity-10 tw-px-4 tw-py-2 tw-rounded-lg">
             <span class="tw-text-xs tw-font-bold tw-text-[#E4007F]">編集モード中...</span>
             <button @click="cancelEdit" class="tw-text-xs tw-text-gray-500 hover:tw-text-gray-800">キャンセル</button>
          </div>

          <div v-if="replyTarget" class="tw-max-w-4xl tw-mx-auto tw-mb-2 tw-flex tw-items-center tw-justify-between tw-bg-blue-50 tw-border tw-border-blue-100 tw-px-4 tw-py-2 tw-rounded-lg">
             <div class="tw-flex tw-flex-col tw-gap-0.5">
                <span class="tw-text-[10px] tw-font-bold tw-text-blue-500">Replying to {{ replyTarget.userName }}</span>
                <span class="tw-text-[10px] tw-text-gray-500 tw-truncate tw-max-w-[200px] md:tw-max-w-sm">"{{ replyTarget.body }}"</span>
             </div>
             <button @click="cancelReply" class="tw-p-1 tw-bg-white tw-rounded-full tw-text-gray-400 hover:tw-text-gray-600">
                <X class="tw-w-3 tw-h-3" />
             </button>
          </div>

          <div class="tw-max-w-4xl tw-mx-auto tw-flex tw-gap-4 tw-items-end">
            <div class="tw-flex-1 tw-relative">
              <textarea 
                v-model="inputBody"
                rows="1" 
                ref="textareaRef"
                :class="['tw-w-full tw-bg-gray-50 tw-border-none tw-rounded-3xl tw-py-3.5 tw-px-6 tw-text-sm tw-resize-none focus:tw-ring-2 focus:tw-ring-[#85C441] tw-placeholder-gray-300 tw-transition-all', isSending ? 'tw-opacity-50' : '']"
                :placeholder="editingPostId ? '内容を修正して更新' : (replyTarget ? '返信を入力...' : 'このスレッドにコメントする...')"
                @input="autoResize"
                :disabled="isSending"
              ></textarea>
            </div>
            <button 
              @click="handleSubmit"
              :disabled="!inputBody.trim() || isSending"
              :class="['tw-text-white tw-p-3.5 tw-rounded-full tw-shadow-lg active:tw-scale-90 tw-transition-all tw-flex-shrink-0', editingPostId ? 'tw-bg-[#E4007F]' : 'tw-bg-[#85C441]', (!inputBody.trim() || isSending) ? 'tw-opacity-50 tw-cursor-not-allowed' : '']"
            >
              <Send v-if="!editingPostId" class="tw-w-5 tw-h-5" />
              <Edit2 v-else class="tw-w-5 tw-h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>

    <AuthModal :is-open="isLoginModalOpen" @close="isLoginModalOpen = false" />
    <div v-if="activeMenuId" @click="activeMenuId = null" class="tw-fixed tw-inset-0 tw-z-0"></div>
  </div>
</template>

<script setup lang="ts">
import { 
  Lightbulb, UserCircle, ArrowUp, ArrowDown,
  MessageSquare, Send, Search, FileText, Home,
  MoreVertical, Trash2, Edit2, ChevronRight, X
} from 'lucide-vue-next'
import { type Post } from '@/composables/useFirestore'
import { doc, onSnapshot } from 'firebase/firestore'

const route = useRoute()
const localePath = useLocalePath()
const { $firestore } = useNuxtApp()

const tid = computed(() => route.params.tid as string)
const cid = computed(() => route.params.cid as string)

// Composables
const { 
  loadCategories, 
  getCategoryById,
} = useShiru()

const { 
  posts, 
  isLoading, 
  subscribeToPosts, 
  addPost, 
  updatePost, 
  deletePost,
  likePost,
  threads: firestoreThreads,
  subscribeToCategoryThreads
} = useFirestore()

const { user, userDisplayName, userPhotoURL, initAuth } = useAuth()
const { openDrawer } = useDrawer()
const { addHistory } = useUserHistory()

const isLoginModalOpen = ref(false)

// Local State
const inputBody = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const postsContainer = ref<HTMLElement | null>(null)
const isSending = ref(false)
const activeMenuId = ref<string | null>(null)
const editingPostId = ref<string | null>(null)
const replyTarget = ref<Post | null>(null)
const currentThreadData = ref<any>(null)

const likedPostIds = ref<string[]>([])
let unsubscribePosts: (() => void) | null = null
let unsubscribeThread: (() => void) | null = null
let unsubscribeCategory: (() => void) | null = null

// カラーパレット
const themeMap: Record<string, any> = {
  transport: { dot: 'tw-bg-[#A5D1E1]', textBg: 'tw-bg-[#5FB3D5]' },
  public:    { dot: 'tw-bg-[#F4A7B9]', textBg: 'tw-bg-[#E95295]' },
  spa:       { dot: 'tw-bg-[#7DB9DE]', textBg: 'tw-bg-[#3E91FF]' },
  cafe:      { dot: 'tw-bg-[#F5B169]', textBg: 'tw-bg-[#F39800]' },
  new:       { dot: 'tw-bg-[#B28FCE]', textBg: 'tw-bg-[#9C27B0]' }
}
const getTheme = (id: string) => themeMap[id] || themeMap.new

// Formatters
const formatDate = (date: any) => {
  if (!date) return ''
  const d = (date.seconds) ? new Date(date.seconds * 1000) : new Date(date)
  
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  
  if (diff < 60000) return '今すぐ'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}時間前`
  
  return d.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const formatDateShort = (date: any) => {
  if (!date) return ''
  const d = (date.seconds) ? new Date(date.seconds * 1000) : new Date(date)
  return d.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })
}

// Computed Infos
const currentThreadInfo = computed(() => {
  if (!currentThreadData.value) return null
  return {
    title: currentThreadData.value.title,
    date: formatDateShort(currentThreadData.value.createdAt)
  }
})

const currentCategory = computed(() => getCategoryById(cid.value).value)

// ★ Related Threads from Firestore
const siblings = computed(() => {
  return firestoreThreads.value.filter(t => t.id !== tid.value)
})

// Lifecycle
onMounted(async () => {
  initAuth() 
  const storedLikes = localStorage.getItem('ru-mana-liked-posts')
  if (storedLikes) {
    try {
      likedPostIds.value = JSON.parse(storedLikes)
    } catch (e) {
      likedPostIds.value = []
    }
  }

  await loadCategories()
  
  // Subscribe to Posts (Subcollection)
  unsubscribePosts = subscribeToPosts(tid.value)

  // Subscribe to Thread Info (Document)
  const threadRef = doc($firestore, 'threads', tid.value)
  unsubscribeThread = onSnapshot(threadRef, (doc) => {
    if (doc.exists()) {
      currentThreadData.value = { id: doc.id, ...doc.data() }
    }
  })

  // Subscribe to Category Threads (for Sidebar)
  unsubscribeCategory = subscribeToCategoryThreads(cid.value)
})

// Add to history when thread data is loaded
watch(currentThreadData, (newVal) => {
  if (newVal) {
    addHistory({
      threadId: tid.value,
      categoryId: cid.value,
      title: newVal.title
    })
  }
})

onUnmounted(() => {
  if (unsubscribePosts) unsubscribePosts()
  if (unsubscribeThread) unsubscribeThread()
  if (unsubscribeCategory) unsubscribeCategory()
})

// Scroll to bottom on new posts
watch(() => posts.value.length, (newVal, oldVal) => {
  if (newVal > oldVal) {
    nextTick(() => {
      if (postsContainer.value) {
        postsContainer.value.scrollTop = postsContainer.value.scrollHeight
      }
    })
  }
})

const switchThread = (id: string) => {
  useRouter().push(localePath(`/shiru/category/${cid.value}/thread/${id}`))
}

// Logic: Submit (Create or Update)
const handleSubmit = async () => {
  if (!user.value) {
    isLoginModalOpen.value = true
    return
  }

  if (!inputBody.value.trim() || isSending.value) return
  isSending.value = true

  try {
    if (editingPostId.value) {
      await updatePost(tid.value, editingPostId.value, inputBody.value)
      editingPostId.value = null
    } else {
      await addPost(tid.value, currentThreadInfo.value?.title || 'No Title', {
        body: inputBody.value,
        userId: user.value.uid,
        userName: userDisplayName.value,
        userIcon: userPhotoURL.value,
        ...(replyTarget.value ? {
           replyToId: replyTarget.value.id,
           replyToName: replyTarget.value.userName,
           replyToText: replyTarget.value.body
        } : {})
      })
      replyTarget.value = null
    }
    inputBody.value = ''
    if (textareaRef.value) textareaRef.value.style.height = 'auto'
  } catch (e) {
    alert('送信に失敗しました。')
    console.error(e)
  } finally {
    isSending.value = false
  }
}

// Logic: Post Menu
const toggleMenu = (postId: string) => {
  activeMenuId.value = activeMenuId.value === postId ? null : postId
}

const startEdit = (post: Post) => {
  editingPostId.value = post.id
  inputBody.value = post.body
  activeMenuId.value = null
  replyTarget.value = null
  nextTick(() => {
    textareaRef.value?.focus()
    autoResize()
  })
}

const cancelEdit = () => {
  editingPostId.value = null
  inputBody.value = ''
  if (textareaRef.value) textareaRef.value.style.height = 'auto'
}

const confirmDelete = async (postId: string) => {
  if (confirm('本当にこの投稿を削除しますか？')) {
    try {
      await deletePost(tid.value, postId)
      activeMenuId.value = null
    } catch (e) {
      alert('削除に失敗しました')
    }
  }
}

const isLiked = (postId: string) => likedPostIds.value.includes(postId)

const handleLike = async (postId: string) => {
  if (isLiked(postId)) return
  try {
    likedPostIds.value.push(postId)
    localStorage.setItem('ru-mana-liked-posts', JSON.stringify(likedPostIds.value))
    await likePost(tid.value, postId)
  } catch (e) {
    likedPostIds.value = likedPostIds.value.filter(id => id !== postId)
    localStorage.setItem('ru-mana-liked-posts', JSON.stringify(likedPostIds.value))
    console.error("Like failed", e)
  }
}

const handleReply = (post: Post) => {
  replyTarget.value = post
  editingPostId.value = null
  nextTick(() => {
    textareaRef.value?.focus()
  })
}

const cancelReply = () => {
   replyTarget.value = null
}

const scrollToPost = (targetId: string | undefined) => {
  if (!targetId) return
  const element = document.getElementById(`post-${targetId}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    element.classList.add('tw-bg-yellow-50')
    setTimeout(() => {
      element.classList.remove('tw-bg-yellow-50')
    }, 1500)
  } else {
    console.warn('Target post not found in DOM')
  }
}

const autoResize = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
  }
}

useHead(() => ({
  title: currentThreadInfo.value ? `${currentThreadInfo.value.title} | しるまな` : 'スレッド'
}))
</script>

<style scoped>
.tw-scrollbar-hide::-webkit-scrollbar { display: none; }
.tw-scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

:deep(body), :deep(html) {
  overflow: hidden;
  height: 100%;
}

.tw-animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>