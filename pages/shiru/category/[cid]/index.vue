<template>
  <div class="tw-min-h-screen tw-bg-white md:tw-bg-[#F9F5E7] tw-flex tw-flex-col tw-overflow-hidden">
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
        <div class="tw-flex tw-items-center tw-gap-3 md:tw-gap-6">
          <div class="tw-hidden md:tw-flex tw-relative">
            <input type="text" class="tw-bg-[#4B3E8E] tw-bg-opacity-10 tw-rounded-md tw-py-2 tw-px-10 tw-w-80 tw-text-sm" placeholder="[スレッド内検索]">
            <Search class="tw-absolute tw-left-3 tw-top-1/2 tw-transform -tw-translate-y-1/2 tw-text-gray-500 tw-w-4" />
          </div>
          <div class="tw-flex tw-items-center tw-gap-2 md:tw-gap-4">
            <Home class="tw-hidden md:tw-block tw-w-7 tw-h-7 tw-text-gray-300 tw-cursor-pointer" @click="() => $router.push(localePath('/'))" />
            
            <div v-if="user" @click="openDrawer()" class="tw-cursor-pointer">
              <img :src="userPhotoURL" class="tw-w-8 h-8 md:tw-w-10 md:tw-h-10 tw-rounded-full tw-border-2 tw-border-gray-100 shadow-sm" />
            </div>
            <UserCircle v-else class="tw-text-gray-300 tw-w-8 h-8 md:tw-w-10 md:tw-h-10 tw-cursor-pointer" @click="isLoginModalOpen = true" />
          </div>
        </div>
      </div>
    </header>

    <div class="tw-max-w-7xl tw-mx-auto tw-w-full tw-flex-1 tw-flex tw-flex-col md:tw-flex-row tw-overflow-hidden">
      <aside class="tw-hidden md:tw-block tw-w-72 tw-p-8 tw-bg-gray-50 tw-bg-opacity-50 tw-min-h-screen">
        <nav class="tw-space-y-4">
          <button 
            v-for="cat in categories" 
            :key="cat.id" 
            @click="() => switchCategory(cat.id)"
            :class="[
              'tw-w-full tw-flex tw-items-center tw-gap-4 tw-px-6 tw-py-4 tw-rounded-full tw-text-sm tw-font-bold tw-transition-all',
              cid === cat.id ? 'tw-bg-white tw-shadow-lg tw-text-gray-800' : 'tw-text-gray-400 hover:tw-bg-white/50'
            ]"
          >
            <div :class="['tw-w-3 tw-h-3 tw-rounded-full', getTheme(cat.id).dot]"></div>
            {{ cat.name }}
          </button>
        </nav>
      </aside>

      <main class="tw-flex-1 tw-relative tw-flex tw-flex-col md:tw-p-10 tw-overflow-hidden">
        <nav class="tw-hidden md:tw-flex tw-items-center tw-gap-2 tw-text-[10px] tw-text-gray-400 tw-mb-6">
          <span class="tw-cursor-pointer hover:tw-text-gray-600" @click="() => $router.push(localePath('/shiru'))">しるまな</span>
          <ChevronRight class="tw-w-3 tw-h-3" />
          <span class="tw-text-gray-600">{{ currentCategory?.name }}</span>
        </nav>

        <div class="md:tw-hidden tw-flex-1 tw-flex tw-flex-col tw-overflow-hidden">
          <div 
            ref="carouselRef"
            class="tw-flex-1 tw-flex tw-overflow-x-auto tw-snap-x tw-snap-mandatory tw-scrollbar-hide"
            @scroll="onMobileScroll"
          >
            <div 
              v-for="cat in categories" 
              :key="cat.id"
              class="tw-flex-shrink-0 tw-w-full tw-snap-center tw-px-6 tw-py-4 tw-flex tw-flex-col"
            >
              <div class="tw-bg-white tw-rounded-[2.5rem] tw-shadow-lg tw-flex-1 tw-flex tw-flex-col tw-overflow-hidden tw-border tw-border-gray-50">
                <div :class="['tw-p-6 tw-text-center tw-relative tw-flex-shrink-0', getTheme(cat.id).bg]">
                  <div :class="['tw-w-20 tw-h-20 tw-mx-auto tw-rounded-full tw-bg-white tw-border-4 tw-flex tw-items-center tw-justify-center tw-mb-3 tw-shadow-sm', getTheme(cat.id).border]">
                    <component :is="getCategoryIcon(cat.icon)" :class="['tw-w-10 tw-h-10', getTheme(cat.id).text]" />
                  </div>
                  <h3 class="tw-text-xl tw-font-black tw-text-gray-800">{{ cat.name }}</h3>
                  
                  <div class="tw-mt-4 tw-bg-white/60 tw-backdrop-blur-sm tw-p-1 tw-rounded-full tw-flex tw-text-[10px] tw-font-bold tw-shadow-sm">
                    <button 
                      @click="activeTab = 'threads'"
                      :class="['tw-flex-1 tw-py-2 tw-rounded-full tw-transition-all', activeTab === 'threads' ? 'tw-bg-white tw-shadow-sm tw-text-gray-800' : 'tw-text-gray-400']"
                    >
                      スレッド
                    </button>
                    <button 
                      @click="activeTab = 'guides'"
                      :class="['tw-flex-1 tw-py-2 tw-rounded-full tw-transition-all', activeTab === 'guides' ? 'tw-bg-white tw-shadow-sm tw-text-gray-800' : 'tw-text-gray-400']"
                    >
                      るうまなガイド
                    </button>
                  </div>
                </div>

                <div class="tw-flex-1 tw-overflow-y-auto tw-p-5 tw-bg-white">
                  <div v-if="activeTab === 'threads'">
                    
                    <div class="tw-mb-4" v-if="cat.id === cid">
                      <button 
                        @click="openCreateModal"
                        :class="['tw-w-full tw-py-3 tw-rounded-xl tw-font-bold tw-text-white tw-shadow-md tw-flex tw-items-center tw-justify-center tw-gap-2 active:tw-scale-95 tw-transition-all', getTheme(cat.id).btnBg || 'tw-bg-[#85C441]']"
                      >
                        <Plus class="tw-w-5 tw-h-5" /> 新しいスレッドを作成
                      </button>
                    </div>

                    <div v-if="threadsLoading" class="tw-py-10 tw-text-center tw-text-gray-400 tw-text-xs">
                      読み込み中...
                    </div>
                    <div v-else-if="currentThreads.length === 0" class="tw-py-10 tw-text-center tw-text-gray-400 tw-text-xs">
                      スレッドがまだありません
                    </div>
                    
                    <div v-else class="tw-divide-y tw-divide-gray-50">
                      <div 
                        v-for="thread in currentThreads" 
                        :key="thread.id"
                        class="tw-group tw-flex tw-items-start tw-justify-between tw-py-4 active:tw-bg-gray-50 transition-colors"
                        @click="() => $router.push(localePath(`/shiru/category/${cat.id}/thread/${thread.id}`))"
                      >
                        <div class="tw-flex tw-items-start tw-gap-3">
                          <div :class="['tw-w-2.5 tw-h-2.5 tw-rounded-full tw-mt-1 tw-flex-shrink-0', getTheme(cat.id).dot]"></div>
                          <div>
                            <h4 class="tw-text-[15px] tw-font-bold tw-text-gray-700 tw-leading-tight group-active:tw-text-[#85C441]">{{ thread.title }}</h4>
                            <div class="tw-flex tw-gap-2 tw-mt-1">
                               <span class="tw-text-[10px] tw-text-gray-300">{{ formatDate(thread.updatedAt || thread.createdAt) }}</span>
                            </div>
                          </div>
                        </div>
                        <div class="tw-text-right tw-flex-shrink-0">
                          <div class="tw-flex tw-items-center tw-justify-end tw-gap-1 tw-text-[11px] tw-font-bold tw-text-gray-300">
                            <span>{{ thread.postCount || 0 }}</span>
                            <ArrowUp class="tw-w-2.5 tw-h-2.5 tw-text-gray-200" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="tw-space-y-4">
                    <div v-if="getGuides(cat.id).length === 0" class="tw-text-center tw-py-8 tw-text-gray-400 tw-text-xs">
                        <span v-if="isGuideLoading">読み込み中...</span>
                        <span v-else>まだガイドがありません</span>
                     </div>
                    <div v-for="guide in getGuides(cat.id)" :key="guide.id" class="tw-bg-white tw-border tw-border-gray-100 tw-rounded-2xl tw-p-4 tw-shadow-sm">
                        <div class="tw-flex tw-items-center tw-gap-2 tw-mb-3">
                           <component :is="mapGuideIcon(guide.icon)" :class="['tw-w-6 tw-h-6', getTheme(cat.id).text]" />
                           <h4 class="tw-font-bold tw-text-gray-800 tw-text-sm">{{ guide.title }}</h4>
                        </div>
                        <div class="tw-grid tw-grid-cols-2 tw-gap-2">
                           <div class="tw-bg-[#EAFBF2] tw-rounded-xl tw-p-2 tw-text-center"><span class="tw-text-[9px] tw-font-bold tw-text-green-600">OK:</span> <span class="tw-text-[9px]">{{ guide.good }}</span></div>
                           <div class="tw-bg-[#FEECEC] tw-rounded-xl tw-p-2 tw-text-center"><span class="tw-text-[9px] tw-font-bold tw-text-red-600">NG:</span> <span class="tw-text-[9px]">{{ guide.bad }}</span></div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tw-flex tw-justify-center tw-gap-2 tw-py-6 tw-flex-shrink-0">
            <div 
              v-for="(cat, idx) in categories" 
              :key="cat.id"
              :class="['tw-w-2.5 tw-h-2.5 tw-rounded-full tw-transition-all tw-duration-300', activeIndex === idx ? 'tw-bg-[#85C441] tw-w-6' : 'tw-bg-gray-200']"
            ></div>
          </div>
        </div>

        <div class="tw-hidden md:tw-block">
           <div class="tw-flex tw-items-end tw-justify-between tw-mb-8">
            <div class="tw-flex tw-items-center tw-gap-4">
              <h2 class="tw-text-3xl tw-font-black tw-text-gray-800 uppercase">{{ currentCategory?.name }}</h2>
              
              <button 
                v-if="activeTab === 'threads'"
                @click="openCreateModal"
                :class="['tw-px-4 tw-py-2 tw-rounded-full tw-text-xs tw-font-bold tw-text-white tw-shadow-md tw-flex tw-items-center tw-gap-1 hover:tw-opacity-90 tw-transition-opacity', getTheme(cid).btnBg || 'tw-bg-[#85C441]']"
              >
                <Plus class="tw-w-4 tw-h-4" /> スレッド作成
              </button>
            </div>

            <div class="tw-bg-gray-200 tw-p-1.5 tw-rounded-full tw-flex tw-gap-1">
               <button @click="activeTab = 'threads'" :class="['tw-px-6 tw-py-2 tw-rounded-full tw-text-xs tw-font-bold tw-transition-all', activeTab === 'threads' ? 'tw-bg-white tw-shadow-sm tw-text-gray-800' : 'tw-text-gray-400']">みんなのQ&A</button>
               <button @click="activeTab = 'guides'" :class="['tw-px-6 tw-py-2 tw-rounded-full tw-text-xs tw-font-bold tw-transition-all', activeTab === 'guides' ? 'tw-bg-white tw-shadow-sm tw-text-gray-800' : 'tw-text-gray-400']">ルールとマナー</button>
            </div>
          </div>
          
          <div v-if="activeTab === 'threads'" class="tw-animate-fade-in">
             <div v-if="threadsLoading" class="tw-py-20 tw-text-center tw-text-gray-400">
                読み込み中...
             </div>
             <div v-else-if="currentThreads.length === 0" class="tw-py-20 tw-text-center tw-text-gray-400">
                まだスレッドがありません。最初の投稿を作成してみましょう！
             </div>
             <div v-else class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-x-12">
                <div v-for="thread in currentThreads" :key="thread.id" class="tw-flex tw-items-center tw-justify-between tw-py-4 tw-border-b tw-border-gray-100 tw-cursor-pointer hover:tw-bg-gray-50 tw-px-2" @click="() => $router.push(localePath(`/shiru/category/${cid}/thread/${thread.id}`))">
                    <div class="tw-flex tw-items-center tw-gap-3">
                      <div :class="['tw-w-2 tw-h-2 tw-rounded-full', getTheme(cid).dot]"></div>
                      <h3 class="tw-text-base tw-font-bold tw-text-gray-700">{{ thread.title }}</h3>
                    </div>
                    <div class="tw-flex tw-items-center tw-gap-4 tw-flex-shrink-0">
                      <span class="tw-text-[10px] tw-text-gray-300">{{ formatDate(thread.updatedAt || thread.createdAt) }}</span>
                      <div class="tw-flex tw-items-center tw-gap-1 tw-text-[10px] tw-text-gray-300">
                        <span>{{ thread.postCount || 0 }}</span>
                        <ArrowUp class="tw-w-2 tw-h-2" />
                      </div>
                    </div>
                </div>
             </div>
          </div>

          <div v-else class="tw-animate-fade-in">
             <div v-if="currentGuides.length === 0" class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-64 tw-text-gray-400">
               <BookOpen class="tw-w-12 tw-h-12 tw-mb-2 tw-opacity-20" />
               <p v-if="isGuideLoading">読み込み中...</p>
               <p v-else>このカテゴリのガイドはまだありません</p>
             </div>
             
             <div class="tw-grid tw-grid-cols-2 tw-gap-6">
               <div 
                  v-for="guide in currentGuides" 
                  :key="guide.id"
                  class="tw-bg-white tw-rounded-3xl tw-p-6 tw-shadow-sm tw-border tw-border-gray-100 hover:tw-shadow-md tw-transition-shadow"
               >
                  <div class="tw-flex tw-items-start tw-justify-between tw-mb-4">
                     <div class="tw-flex tw-items-center tw-gap-3">
                        <div :class="['tw-p-2 tw-rounded-xl', getTheme(cid).bg]">
                           <component :is="mapGuideIcon(guide.icon)" :class="['tw-w-6 tw-h-6', getTheme(cid).text]" />
                        </div>
                        <h3 class="tw-font-bold tw-text-lg tw-text-gray-800">{{ guide.title }}</h3>
                     </div>
                     <span :class="['tw-text-[10px] tw-font-bold tw-px-2 tw-py-1 tw-rounded-full tw-bg-gray-100 tw-text-gray-500']">Basic Rule</span>
                  </div>
                  
                  <p class="tw-text-sm tw-text-gray-600 tw-mb-6 tw-leading-relaxed">{{ guide.desc }}</p>

                  <div class="tw-grid tw-grid-cols-2 tw-gap-4">
                     <div class="tw-bg-[#F0F9F4] tw-rounded-2xl tw-p-4 tw-flex tw-flex-col tw-items-center tw-text-center">
                        <CheckCircle class="tw-w-8 tw-h-8 tw-text-green-500 tw-mb-2" />
                        <span class="tw-text-xs tw-font-bold tw-text-green-700 tw-mb-1">Good / OK</span>
                        <span class="tw-text-[10px] tw-text-green-800">{{ guide.good }}</span>
                     </div>
                     <div class="tw-bg-[#FEF2F2] tw-rounded-2xl tw-p-4 tw-flex tw-flex-col tw-items-center tw-text-center">
                        <XCircle class="tw-w-8 tw-h-8 tw-text-red-500 tw-mb-2" />
                        <span class="tw-text-xs tw-font-bold tw-text-red-700 tw-mb-1">Bad / NG</span>
                        <span class="tw-text-[10px] tw-text-red-800">{{ guide.bad }}</span>
                     </div>
                  </div>
               </div>
             </div>
          </div>
        </div>
      </main>
    </div>

    <AuthModal :is-open="isLoginModalOpen" @close="isLoginModalOpen = false" />
    <ThreadCreateModal 
      :is-open="isCreateModalOpen" 
      :theme="getTheme(cid)"
      @close="isCreateModalOpen = false"
      @create="handleCreateThread"
    />
  </div>
</template>

<script setup lang="ts">
import { 
  Lightbulb, Search, Home, UserCircle, ChevronRight, Train, Users, Waves, Utensils, Plus,
  MessageSquare, BookOpen, CheckCircle, XCircle, Shirt, Droplets, VolumeX, Backpack, ArrowUp
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const { user, initAuth, userPhotoURL } = useAuth()
const { openDrawer } = useDrawer()
const isLoginModalOpen = ref(false)
const isCreateModalOpen = ref(false)

const { categories, loadCategories, getCategoryById } = useShiru() // Removed allThreads, loadAllThreads
const { 
  threads: firestoreThreads, 
  isLoading: threadsLoading, 
  subscribeToCategoryThreads,
  createThread
} = useFirestore()

const { loadGuides, getGuidesByCategory, isLoading: isGuideLoading } = useCultureGuides()

const cid = computed(() => route.params.cid as string)
const carouselRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const activeTab = ref<'threads' | 'guides'>('threads')

let isInitialScroll = true
let unsubscribe: (() => void) | null = null

const themeMap: Record<string, any> = {
  transport: { bg: 'tw-bg-[#E0F2F7]', border: 'tw-border-[#A5D1E1]', text: 'tw-text-[#5FB3D5]', dot: 'tw-bg-[#A5D1E1]', btnBg: 'tw-bg-[#5FB3D5]' },
  public: { bg: 'tw-bg-[#FCE7EB]', border: 'tw-border-[#F4A7B9]', text: 'tw-text-[#E95295]', dot: 'tw-bg-[#F4A7B9]', btnBg: 'tw-bg-[#E95295]' },
  spa: { bg: 'tw-bg-[#E5F1F6]', border: 'tw-border-[#7DB9DE]', text: 'tw-text-[#3E91FF]', dot: 'tw-bg-[#7DB9DE]', btnBg: 'tw-bg-[#3E91FF]' },
  cafe: { bg: 'tw-bg-[#FFF3E0]', border: 'tw-border-[#F5B169]', text: 'tw-text-[#F39800]', dot: 'tw-bg-[#F5B169]', btnBg: 'tw-bg-[#F39800]' },
  new: { bg: 'tw-bg-[#F3E5F5]', border: 'tw-border-[#B28FCE]', text: 'tw-text-[#9C27B0]', dot: 'tw-bg-[#B28FCE]', btnBg: 'tw-bg-[#9C27B0]' }
}
const getTheme = (id: string) => themeMap[id] || themeMap.new

const getCategoryIcon = (name: string) => {
  const icons: any = { train: Train, users: Users, waves: Waves, utensils: Utensils, plus: Plus }
  return icons[name] || Plus
}

const mapGuideIcon = (iconName: string) => {
  const iconMap: Record<string, any> = { droplets: Droplets, shirt: Shirt, waves: Waves, 'volume-x': VolumeX, backpack: Backpack }
  return iconMap[iconName] || BookOpen
}

const currentCategory = computed(() => getCategoryById(cid.value).value)
// ★ Use Firestore Threads
const currentThreads = computed(() => firestoreThreads.value)
const currentGuides = getGuidesByCategory(cid.value)
const getGuides = (categoryId: string) => getGuidesByCategory(categoryId).value

const formatDate = (date: any) => {
  if (!date) return ''
  const d = (date.seconds) ? new Date(date.seconds * 1000) : new Date(date)
  return d.toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const onMobileScroll = (e: Event) => {
  const target = e.target as HTMLElement
  const index = Math.round(target.scrollLeft / target.offsetWidth)
  if (activeIndex.value !== index) {
    activeIndex.value = index
    const targetCategory = categories.value[index]
    if (targetCategory && !isInitialScroll) {
      router.replace(localePath(`/shiru/category/${targetCategory.id}`))
    }
  }
}

const switchCategory = (id: string) => {
  router.push(localePath(`/shiru/category/${id}`))
  activeTab.value = 'threads'
}

// Thread Creation
const openCreateModal = () => {
  if (!user.value) {
    isLoginModalOpen.value = true
    return
  }
  isCreateModalOpen.value = true
}

const handleCreateThread = async (data: { title: string, body: string }) => {
  try {
    const threadId = await createThread(cid.value, data.title, data.body, user.value)
    isCreateModalOpen.value = false
    router.push(localePath(`/shiru/category/${cid.value}/thread/${threadId}`))
  } catch (e) {
    console.error("Failed to create thread", e)
    alert("スレッドの作成に失敗しました。")
  }
}

onMounted(async () => {
  initAuth()
  await Promise.all([loadCategories(), loadGuides()])
  
  // ★ Subscribe to Firestore threads for current Category
  unsubscribe = subscribeToCategoryThreads(cid.value)

  const index = categories.value.findIndex(c => c.id === cid.value)
  if (index !== -1) {
    activeIndex.value = index
    nextTick(() => {
      if (carouselRef.value) {
        carouselRef.value.scrollLeft = index * carouselRef.value.offsetWidth
        setTimeout(() => { isInitialScroll = false }, 500)
      }
    })
  }
})

// Watch for category change to re-subscribe
watch(cid, (newCid) => {
  if (unsubscribe) unsubscribe()
  unsubscribe = subscribeToCategoryThreads(newCid)
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

useHead(() => ({
  title: currentCategory.value ? `${currentCategory.value.name} | しるまな` : 'しるまな'
}))
</script>

<style scoped>
.tw-scrollbar-hide::-webkit-scrollbar { display: none; }
.tw-scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.tw-animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 768px) { div[ref="carouselRef"] { scroll-behavior: smooth; -webkit-overflow-scrolling: touch; } }
</style>