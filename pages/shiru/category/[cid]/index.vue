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
        <nav class="tw-hidden md:tw-flex tw-items-center tw-gap-2 tw-text-[10px] tw-text-gray-400 tw-mb-8">
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
              <div class="tw-bg-white tw-rounded-[2.5rem] tw-shadow-2xl tw-flex-1 tw-flex tw-flex-col tw-overflow-hidden tw-border tw-border-gray-50">
                <div :class="['tw-p-8 tw-text-center tw-relative tw-flex-shrink-0', getTheme(cat.id).bg]">
                  <div :class="['tw-w-24 tw-h-24 tw-mx-auto tw-rounded-full tw-bg-white tw-border-4 tw-flex tw-items-center tw-justify-center tw-mb-4 tw-shadow-sm', getTheme(cat.id).border]">
                    <component :is="getIcon(cat.icon)" :class="['tw-w-12 tw-h-12', getTheme(cat.id).text]" />
                  </div>
                  <h3 class="tw-text-2xl tw-font-black tw-text-gray-800">{{ cat.name }}</h3>
                  <p class="tw-text-[10px] tw-text-gray-400 tw-mt-1">{{ cat.updateDate || '2026.01.15' }} update</p>
                </div>

                <div class="tw-flex-1 tw-overflow-y-auto tw-p-5">
                  <div class="tw-flex tw-justify-between tw-items-center tw-text-[10px] tw-font-bold tw-text-gray-400 tw-border-b tw-pb-2 tw-mb-2">
                    <div class="tw-flex tw-gap-4">
                      <span>スレッド一覧 [新着]</span>
                      <span>[検索]</span>
                    </div>
                    <Search class="tw-w-3 tw-h-3" />
                  </div>
                  
                  <div class="tw-divide-y tw-divide-gray-50">
                    <div 
                      v-for="thread in filterThreadsByCid(cat.id)" 
                      :key="thread.id"
                      class="tw-group tw-flex tw-items-start tw-justify-between tw-py-4 active:tw-bg-gray-50 tw-transition-colors"
                      @click="() => $router.push(localePath(`/shiru/category/${cat.id}/thread/${thread.id}`))"
                    >
                      <div class="tw-flex tw-items-start tw-gap-3">
                        <div :class="['tw-w-2.5 tw-h-2.5 tw-rounded-full tw-mt-1 tw-flex-shrink-0', getTheme(cat.id).dot]"></div>
                        <div>
                          <h4 class="tw-text-[15px] tw-font-bold tw-text-gray-700 tw-leading-tight group-active:tw-text-[#85C441]">{{ thread.title }}</h4>
                          <div class="tw-flex tw-gap-2 tw-mt-1">
                             <span class="tw-text-[10px] tw-text-gray-300">{{ thread.date }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="tw-text-right tw-flex-shrink-0">
                        <div class="tw-flex tw-items-center tw-justify-end tw-gap-1 tw-text-[11px] tw-font-bold tw-text-gray-300">
                          <span>{{ thread.count }}</span>
                          <ArrowUp class="tw-w-2.5 tw-h-2.5 tw-text-gray-200" />
                        </div>
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
          <div class="tw-flex tw-items-center tw-justify-between tw-mb-8">
            <div class="tw-relative">
              <h2 class="tw-text-3xl tw-font-black tw-text-gray-800 tw-z-10 tw-relative uppercase">
                {{ currentCategory?.name }}
              </h2>
              <div class="tw-absolute tw-bottom-0 tw-left-0 tw-w-full tw-h-3 tw-bg-[#85C441] tw-opacity-30 tw-z-0"></div>
            </div>
            <div class="tw-flex tw-items-center tw-gap-6 tw-text-xs tw-font-bold tw-text-gray-400">
              <span class="tw-text-gray-800 tw-border-b-2 tw-border-gray-800 tw-pb-1">スレッド一覧</span>
              <span class="tw-cursor-pointer hover:tw-text-gray-800">新規投稿</span>
            </div>
          </div>

          <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-x-12 tw-gap-y-2">
            <div 
              v-for="thread in currentThreads" 
              :key="thread.id"
              class="tw-group tw-flex tw-items-center tw-justify-between tw-py-4 tw-border-b tw-border-gray-100 tw-cursor-pointer hover:tw-bg-gray-50 tw-transition-colors tw-px-2"
              @click="() => $router.push(localePath(`/shiru/category/${cid}/thread/${thread.id}`))"
            >
              <div class="tw-flex tw-items-center tw-gap-3 tw-min-w-0">
                <div :class="['tw-w-2 tw-h-2 tw-rounded-full tw-flex-shrink-0', getTheme(cid).dot]"></div>
                <h3 class="tw-text-base tw-font-bold tw-text-gray-700 group-hover:tw-text-[#85C441] tw-truncate">
                  {{ thread.title }}
                </h3>
              </div>
              <div class="tw-flex tw-items-center tw-gap-4 tw-flex-shrink-0">
                <span class="tw-text-[10px] tw-text-gray-300 tw-font-medium">{{ thread.date }}</span>
                <div class="tw-flex tw-items-center tw-gap-1 tw-text-[10px] tw-text-gray-300">
                  <span>{{ thread.count }}</span>
                  <ArrowUp class="tw-w-2 tw-h-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Lightbulb, Search, FileText, Home, UserCircle, 
  ChevronRight, ArrowUp, ArrowDown, Train, Users, Waves, Utensils, Plus 
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const { categories, allThreads, loadCategories, loadAllThreads, getThreadsByCategory, getCategoryById } = useShiru()

const cid = computed(() => route.params.cid as string)
const carouselRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
let isInitialScroll = true

// Color Themes derived from your design images
const themeMap: Record<string, any> = {
  transport: { bg: 'tw-bg-[#E0F2F7]', border: 'tw-border-[#A5D1E1]', text: 'tw-text-[#5FB3D5]', dot: 'tw-bg-[#A5D1E1]' },
  public: { bg: 'tw-bg-[#FCE7EB]', border: 'tw-border-[#F4A7B9]', text: 'tw-text-[#E95295]', dot: 'tw-bg-[#F4A7B9]' },
  spa: { bg: 'tw-bg-[#E5F1F6]', border: 'tw-border-[#7DB9DE]', text: 'tw-text-[#3E91FF]', dot: 'tw-bg-[#7DB9DE]' },
  cafe: { bg: 'tw-bg-[#FFF3E0]', border: 'tw-border-[#F5B169]', text: 'tw-text-[#F39800]', dot: 'tw-bg-[#F5B169]' },
  new: { bg: 'tw-bg-[#F3E5F5]', border: 'tw-border-[#B28FCE]', text: 'tw-text-[#9C27B0]', dot: 'tw-bg-[#B28FCE]' }
}

const getTheme = (id: string) => themeMap[id] || themeMap.new
const getIcon = (name: string) => {
  const icons: any = { train: Train, users: Users, waves: Waves, utensils: Utensils, plus: Plus }
  return icons[name] || Plus
}

const filterThreadsByCid = (targetCid: string) => allThreads.value.filter(t => t.categoryId === targetCid)
const currentCategory = computed(() => getCategoryById(cid.value).value)
const currentThreads = computed(() => getThreadsByCategory(cid.value).value)

/**
 * Mobile Snap Scroll Logic: Updates active index and replaces URL without history spam
 */
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
}

onMounted(async () => {
  await Promise.all([loadCategories(), loadAllThreads()])
  
  // Initialize carousel position based on URL
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

useHead(() => ({
  title: currentCategory.value ? `${currentCategory.value.name} | しるまな` : 'しるまな'
}))
</script>

<style scoped>
.tw-scrollbar-hide::-webkit-scrollbar { display: none; }
.tw-scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* Mobile-specific scroll behaviors */
@media (max-width: 768px) {
  div[ref="carouselRef"] {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }
}
</style>