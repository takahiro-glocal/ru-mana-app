<template>
  <div class="tw-min-h-screen tw-bg-[#F9F5E7] md:tw-bg-white">
    <header class="tw-bg-white tw-border-b tw-border-gray-100 tw-p-4 md:tw-px-8 md:tw-py-6">
      <div class="tw-max-w-7xl tw-mx-auto tw-flex tw-justify-between tw-items-center">
        <div class="tw-flex tw-items-center tw-gap-4">
          <div class="tw-bg-[#85C441] tw-p-2 tw-rounded-xl md:tw-p-3 md:tw-rounded-2xl">
            <Lightbulb class="tw-w-6 tw-h-6 md:tw-w-8 md:tw-h-8 tw-text-white" />
          </div>
          <div>
            <h1 class="tw-text-xl md:tw-text-3xl tw-font-bold tw-text-gray-800">{{ $t('common.shiru') }}</h1>
            <p class="tw-text-[9px] md:tw-text-xs tw-text-gray-500">{{ $t('shiru.tagline') }}</p>
          </div>
        </div>
        <div class="tw-hidden md:tw-flex tw-items-center tw-gap-6">
          <div class="tw-relative">
            <input type="text" class="tw-bg-[#F1F3F4] tw-rounded-md tw-py-2 tw-px-10 tw-w-64 tw-text-sm" :placeholder="$t('shiru.search_placeholder')">
            <Search class="tw-absolute tw-left-3 tw-top-1/2 tw-transform -tw-translate-y-1/2 tw-text-gray-400 tw-w-4" />
          </div>
          <div class="tw-flex tw-items-center tw-gap-4 tw-text-gray-300">
            <FileText class="tw-w-6 tw-h-6 tw-cursor-pointer hover:tw-text-[#85C441]" />
            <Home class="tw-w-6 tw-h-6 tw-cursor-pointer hover:tw-text-[#85C441]" @click="() => $router.push(localePath('/'))" />
            <div class="tw-flex tw-items-center tw-gap-2">
              <UserCircle class="tw-w-8 tw-h-8 tw-text-gray-400" />
              <span class="tw-text-sm tw-text-gray-600">Alex</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="tw-max-w-7xl tw-mx-auto">
      
      <div class="md:tw-hidden">
        <main class="tw-relative tw-h-[calc(100vh-80px)] tw-flex tw-flex-col">
          <div 
            ref="scrollContainer"
            class="tw-flex tw-flex-1 tw-overflow-x-auto tw-snap-x tw-snap-mandatory tw-scrollbar-hide tw-py-10"
            @scroll="onScroll"
          >
            <div 
              v-for="cat in categories" 
              :key="cat.id"
              class="tw-flex-shrink-0 tw-w-full tw-px-8 tw-snap-center"
            >
              <div class="tw-bg-white tw-h-full tw-rounded-[2.5rem] tw-shadow-2xl tw-flex tw-flex-col tw-overflow-hidden">
                <div :class="['tw-p-8 tw-text-center tw-relative', cat.bgLight]">
                  <div :class="['tw-w-24 tw-h-24 tw-mx-auto tw-rounded-full tw-bg-white tw-border-4 tw-flex tw-items-center tw-justify-center tw-mb-4', cat.border]">
                    <component :is="cat.icon" :class="['tw-w-12 tw-h-12', cat.text]" />
                  </div>
                  <h2 class="tw-text-2xl tw-font-black tw-text-gray-800">{{ $t(`shiru.category_${cat.id}`) }}</h2>
                  <p class="tw-text-[10px] tw-text-gray-400">2026.01.15 update</p>
                </div>
                <div class="tw-flex-1 tw-p-6 tw-overflow-y-auto">
                  <div class="tw-flex tw-justify-between tw-text-[10px] tw-font-bold tw-text-gray-400 tw-border-b tw-pb-2 tw-mb-2">
                    <span>スレッド一覧 [新着]</span>
                    <Search class="tw-w-3 tw-h-3" />
                  </div>
                  <div class="tw-space-y-1">
                    <div 
                      v-for="thread in getThreads(cat.id)" 
                      :key="thread.id"
                      class="tw-flex tw-items-center tw-justify-between tw-py-4 tw-border-b tw-border-gray-50 tw-text-left"
                      @click="() => $router.push(localePath(`/shiru/${thread.id}`))"
                    >
                      <div class="tw-flex tw-items-center tw-gap-3 tw-flex-1">
                        <div :class="['tw-w-2 tw-h-2 tw-rounded-full', cat.dot]"></div>
                        <span class="tw-text-xs tw-font-medium tw-text-gray-700 tw-line-clamp-1">{{ thread.title }}</span>
                      </div>
                      <div class="tw-flex tw-items-center tw-gap-2 tw-text-[9px] tw-text-gray-300">
                        <span>150</span>
                        <ArrowUp class="tw-w-2 tw-h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tw-flex tw-justify-center tw-gap-2 tw-pb-6">
            <div v-for="(cat, idx) in categories" :key="cat.id"
              :class="['tw-w-2 tw-h-2 tw-rounded-full tw-transition-all', activeIndex === idx ? 'tw-bg-[#85C441] tw-w-4' : 'tw-bg-gray-300']"
            ></div>
          </div>
          <!-- <div class="tw-flex tw-justify-center tw-pb-4">
            <div class="tw-bg-white tw-shadow-lg tw-p-4 tw-rounded-full">
              <Search class="tw-w-6 tw-h-6 tw-text-gray-400" />
            </div>
          </div> -->
        </main>
      </div>

      <div class="tw-hidden md:tw-flex">
        <aside class="tw-w-72 tw-p-8 tw-bg-gray-50/50 tw-min-h-[calc(100vh-100px)]">
          <nav class="tw-space-y-4">
            <button 
              v-for="cat in categories" :key="cat.id"
              @click="() => selectedCategoryPC = cat.id"
              :class="[
                'tw-w-full tw-flex tw-items-center tw-gap-4 tw-px-6 tw-py-4 tw-rounded-full tw-text-sm tw-font-bold tw-transition-all',
                selectedCategoryPC === cat.id ? 'tw-bg-white tw-shadow-lg tw-text-gray-800' : 'tw-text-gray-400 hover:tw-bg-white/50'
              ]"
            >
              <div :class="['tw-w-4 tw-h-4 tw-rounded-full', cat.dot]"></div>
              {{ $t(`shiru.category_${cat.id}`) }}
            </button>
          </nav>
          <div class="tw-mt-12 tw-opacity-30">
            <div class="tw-bg-gray-200 tw-rounded-3xl tw-aspect-[3/4] tw-flex tw-items-center tw-justify-center">
              <Map class="tw-w-12 tw-h-12 tw-text-gray-400" />
            </div>
          </div>
        </aside>

        <main class="tw-flex-1 tw-p-10">
          <div class="tw-flex tw-items-center tw-justify-between tw-mb-8">
            <h2 class="tw-text-2xl tw-font-bold tw-text-gray-800 tw-border-b-4 tw-border-[#85C441] tw-pb-1 uppercase tracking-wider">
              {{ $t(`shiru.category_${selectedCategoryPC}`) }}
            </h2>
            <div class="tw-flex tw-gap-6 tw-text-xs tw-text-gray-400">
              <span class="tw-cursor-pointer hover:tw-text-[#85C441] tw-border-b tw-border-gray-400">スレッド一覧</span>
              <span class="tw-cursor-pointer hover:tw-text-[#85C441]">新規投稿</span>
            </div>
          </div>

          <div class="tw-grid tw-grid-cols-3 tw-gap-x-12 tw-gap-y-4">
            <div 
              v-for="thread in allThreads" :key="thread.id"
              class="tw-group tw-flex tw-items-center tw-justify-between tw-py-3 tw-border-b tw-border-gray-100 tw-cursor-pointer hover:tw-bg-gray-50 tw-transition-colors"
              @click="() => $router.push(localePath(`/shiru/${thread.id}`))"
            >
              <span class="tw-text-[13px] tw-font-bold tw-text-gray-700 group-hover:tw-text-[#85C441] tw-truncate">
                {{ thread.title }}
              </span>
              <span class="tw-text-[9px] tw-text-gray-300 tw-whitespace-nowrap tw-ml-2">
                2025/12/17(水) 07:33
              </span>
            </div>
          </div>

          <div class="tw-flex tw-items-center tw-justify-end tw-gap-4 tw-mt-12 tw-text-sm tw-text-gray-400">
            <ChevronLeft class="tw-w-4 tw-h-4 tw-cursor-pointer" />
            <span class="tw-text-gray-800 tw-font-bold">1</span>
            <span class="tw-cursor-pointer hover:tw-text-gray-800">2</span>
            <ChevronRight class="tw-w-4 tw-h-4 tw-cursor-pointer" />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Lightbulb, Search, FileText, Home, UserCircle, 
  ChevronLeft, ChevronRight, Train, Users, Waves, Utensils, 
  Map, ArrowUp, Plus 
} from 'lucide-vue-next'

// ---------------------------------------------------------
// Logic & State
// ---------------------------------------------------------

const localePath = useLocalePath()
const { t } = useI18n()

const scrollContainer = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const selectedCategoryPC = ref('transport')

const categories = [
  { id: 'transport', icon: Train, bgLight: 'tw-bg-[#E0F2F7]', border: 'tw-border-[#A5D1E1]', text: 'tw-text-[#5FB3D5]', dot: 'tw-bg-[#A5D1E1]' },
  { id: 'public', icon: Users, bgLight: 'tw-bg-[#FCE7EB]', border: 'tw-border-[#F4A7B9]', text: 'tw-text-[#E95295]', dot: 'tw-bg-[#F4A7B9]' },
  { id: 'spa', icon: Waves, bgLight: 'tw-bg-[#E5F1F6]', border: 'tw-border-[#7DB9DE]', text: 'tw-text-[#3E91FF]', dot: 'tw-bg-[#7DB9DE]' },
  { id: 'cafe', icon: Utensils, bgLight: 'tw-bg-[#FFF3E0]', border: 'tw-border-[#F5B169]', text: 'tw-text-[#F39800]', dot: 'tw-bg-[#F5B169]' },
  { id: 'new', icon: Plus, bgLight: 'tw-bg-[#F3E5F5]', border: 'tw-border-[#B28FCE]', text: 'tw-text-[#9C27B0]', dot: 'tw-bg-[#B28FCE]' }
]

// Mock data to match Image 1769578426358 
const allThreads = Array.from({ length: 36 }, (_, i) => ({
  id: i + 1,
  title: '駅・空港・旅先で迷ったら',
  category: 'transport'
}))

const getThreads = (catId: string) => allThreads.filter(t => t.category === catId).slice(0, 10)

/**
 * Mobile Scroll Handler
 */
const onScroll = (e: Event) => {
  const target = e.target as HTMLElement
  const index = Math.round(target.scrollLeft / target.offsetWidth)
  if (activeIndex.value !== index) {
    activeIndex.value = index
  }
}

useHead(() => ({
  title: t('common.shiru') + ' | るうまな'
}))
</script>

<style scoped>
.tw-scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.tw-scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* For smooth mobile carousel */
@media (max-width: 768px) {
  nav {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }
}
</style>