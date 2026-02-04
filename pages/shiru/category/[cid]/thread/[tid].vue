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
            <UserCircle class="tw-w-10 tw-h-10 tw-text-gray-400" />
          </div>
        </div>
      </div>
    </header>

    <div class="tw-max-w-7xl tw-mx-auto tw-w-full tw-flex-1 tw-flex tw-overflow-hidden">
      <aside class="tw-hidden md:tw-block tw-w-80 tw-bg-white tw-border-r tw-border-gray-100 tw-overflow-y-auto">
        <div class="tw-p-6">
          <h3 class="tw-text-[10px] tw-font-bold tw-text-gray-400 tw-uppercase tw-tracking-widest tw-mb-4">Related Threads</h3>
          <div class="tw-space-y-1">
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
        
        <div v-if="currentThreadInfo" class="tw-p-6 md:tw-p-10 tw-border-b tw-border-gray-50 tw-flex-shrink-0">
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

        <div class="tw-flex-1 tw-overflow-y-auto tw-p-6 md:tw-p-10 tw-bg-[#FDFCF9] tw-pb-32 md:tw-pb-40">
          <div v-if="detail && detail.posts && detail.posts.length > 0" class="tw-space-y-10">
            <div 
              v-for="(post, index) in detail.posts" 
              :key="post.id"
              class="tw-flex tw-gap-4 md:tw-gap-6"
            >
              <img :src="post.userIcon" class="tw-w-10 tw-h-10 md:tw-w-14 md:tw-h-14 tw-rounded-full tw-bg-white tw-shadow-sm tw-border tw-border-gray-100" />
              <div class="tw-flex-1 tw-min-w-0">
                <div class="tw-flex tw-items-center tw-gap-3 tw-mb-2">
                  <span class="tw-font-black tw-text-sm md:tw-text-base tw-text-gray-800">
                    {{ index + 1 }}. {{ post.userName }}
                  </span>
                  <span v-if="post.isOfficial" class="tw-bg-[#85C441] tw-text-white tw-text-[8px] tw-px-2 tw-py-0.5 tw-rounded tw-font-bold uppercase tracking-wider">Official</span>
                  <span class="tw-text-[10px] tw-text-gray-300 tw-font-bold">{{ post.date }}</span>
                </div>
                <div class="tw-bg-white tw-p-5 tw-rounded-2xl tw-shadow-sm tw-border tw-border-gray-100 tw-relative">
                  <p class="tw-text-sm md:tw-text-base tw-text-gray-700 tw-leading-relaxed tw-whitespace-pre-wrap">{{ post.body }}</p>
                  <div class="tw-absolute tw-top-4 -tw-left-2 tw-w-4 tw-h-4 tw-bg-white tw-border-l tw-border-b tw-border-gray-100 tw-rotate-45"></div>
                </div>
                <div class="tw-flex tw-gap-5 tw-mt-3">
                  <button class="tw-flex tw-items-center tw-gap-1.5 tw-text-[10px] tw-font-bold tw-text-gray-400 hover:tw-text-[#85C441] tw-transition-colors">
                    <ArrowUp class="tw-w-3 tw-h-3" /> 役に立った
                  </button>
                  <button class="tw-flex tw-items-center tw-gap-1.5 tw-text-[10px] tw-font-bold tw-text-gray-400 hover:tw-text-[#E4007F] tw-transition-colors">
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
          <div class="tw-max-w-4xl tw-mx-auto tw-flex tw-gap-4 tw-items-center">
            <div class="tw-flex-1 tw-relative">
              <textarea 
                rows="1" 
                class="tw-w-full tw-bg-gray-50 tw-border-none tw-rounded-full tw-py-3.5 tw-px-6 tw-text-sm tw-resize-none focus:tw-ring-2 focus:tw-ring-[#85C441] tw-placeholder-gray-300"
                placeholder="このスレッドにコメントする..."
              ></textarea>
            </div>
            <button class="tw-bg-[#85C441] tw-text-white tw-p-3.5 tw-rounded-full tw-shadow-lg active:tw-scale-90 tw-transition-transform">
              <Send class="tw-w-5 tw-h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Lightbulb, UserCircle, ArrowUp, ArrowDown,
  MessageSquare, Send, Search, FileText, Home
} from 'lucide-vue-next'

const route = useRoute()
const localePath = useLocalePath()
const tid = computed(() => route.params.tid as string)
const cid = computed(() => route.params.cid as string)
const isLoading = ref(true)

const { 
  categories, 
  loadCategories, 
  loadAllThreads, 
  loadThreadDetails,
  getThreadDetail,
  getThreadsByCategory,
  getCategoryById,
  allThreads
} = useShiru()

// カラーパレット
const themeMap: Record<string, any> = {
  transport: { dot: 'tw-bg-[#A5D1E1]', textBg: 'tw-bg-[#5FB3D5]' },
  public:    { dot: 'tw-bg-[#F4A7B9]', textBg: 'tw-bg-[#E95295]' },
  spa:       { dot: 'tw-bg-[#7DB9DE]', textBg: 'tw-bg-[#3E91FF]' },
  cafe:      { dot: 'tw-bg-[#F5B169]', textBg: 'tw-bg-[#F39800]' },
  new:       { dot: 'tw-bg-[#B28FCE]', textBg: 'tw-bg-[#9C27B0]' }
}
const getTheme = (id: string) => themeMap[id] || themeMap.new

onMounted(async () => {
  isLoading.value = true
  await Promise.all([
    loadCategories(),
    loadAllThreads(),
    loadThreadDetails()
  ])
  isLoading.value = false
})

// スレッド詳細データ
const detail = computed(() => getThreadDetail(tid.value).value)

// スレッドのメタ情報
const currentThreadInfo = computed(() => {
  return allThreads.value.find(t => t.id === tid.value)
})

const currentCategory = computed(() => getCategoryById(cid.value).value)
const siblings = computed(() => getThreadsByCategory(cid.value).value)

const switchThread = (id: string) => {
  useRouter().push(localePath(`/shiru/category/${cid.value}/thread/${id}`))
}

useHead(() => ({
  title: currentThreadInfo.value ? `${currentThreadInfo.value.title} | しるまな` : 'スレッド'
}))
</script>

<style scoped>
/* スクロールバー非表示（デザイン準拠） */
.tw-scrollbar-hide::-webkit-scrollbar { display: none; }
.tw-scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* ページ全体の高さを固定して、チャット風のスクロールを実現 */
:deep(body), :deep(html) {
  overflow: hidden;
  height: 100%;
}
</style>