<template>
  <div class="tw-min-h-screen tw-bg-white md:tw-bg-[#F9F5E7]">
    <header class="tw-bg-white tw-border-b tw-border-gray-100 tw-p-4 md:tw-px-8 md:tw-py-6 tw-z-30 tw-flex-shrink-0">
      <div class="tw-max-w-7xl tw-mx-auto tw-flex tw-justify-between tw-items-center">
        <div class="tw-flex tw-items-center tw-gap-4">
          <div class="tw-bg-[#85C441] tw-p-2 tw-rounded-xl md:tw-p-3 md:tw-rounded-2xl tw-cursor-pointer"
            @click="() => $router.push(localePath('/shiru'))">
            <Lightbulb class="tw-w-6 md:tw-w-10 tw-h-6 md:tw-h-10 tw-text-white" />
          </div>
          <div>
            <h1 class="tw-text-xl md:tw-text-4xl tw-font-bold tw-text-gray-800">しるまな</h1>
            <p class="tw-text-[9px] md:tw-text-sm tw-text-gray-500 tw-font-medium">その知識や経験を良い判断や問題解決に</p>
          </div>
        </div>

        <div class="tw-hidden md:tw-flex tw-items-center tw-gap-6">
          <div class="tw-relative">
            <input type="text"
              class="tw-bg-[#4B3E8E] tw-bg-opacity-10 tw-rounded-md tw-py-2 tw-px-10 tw-w-80 tw-text-sm"
              placeholder="[スレッド内検索]">
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
            <UserCircle v-else class="tw-w-8 tw-h-8 tw-text-gray-400 tw-cursor-pointer" @click="isLoginModalOpen = true" />
        </div>

      </div>
    </header>

    <div class="tw-max-w-6xl tw-mx-auto tw-p-4 md:tw-p-10">
      <nav class="tw-text-[10px] tw-text-gray-400 tw-mb-6 tw-hidden md:tw-block">
        しるまな / カテゴリー
      </nav>

      <div class="tw-hidden md:tw-flex tw-flex-col tw-gap-6">
        <div v-for="cat in categories" :key="cat.id"
          class="tw-group tw-bg-white tw-rounded-3xl tw-shadow-sm hover:tw-shadow-xl tw-transition-all tw-duration-300 tw-flex tw-items-center tw-overflow-hidden tw-cursor-pointer"
          @click="() => $router.push(localePath(`/shiru/category/${cat.id}`))">
          <div
            :class="['tw-w-44 tw-h-32 tw-flex tw-items-center tw-justify-center tw-relative tw-overflow-hidden', getTheme(cat.id).bg]">
            <component :is="getIcon(cat.icon)"
              :class="['tw-w-20 tw-h-20 tw-opacity-20 tw-absolute', getTheme(cat.id).text]" />
            <div
              :class="['tw-w-20 tw-h-20 tw-rounded-full tw-bg-white tw-border-4 tw-flex tw-items-center tw-justify-center tw-relative tw-z-10', getTheme(cat.id).border]">
              <component :is="getIcon(cat.icon)" :class="['tw-w-10 tw-h-10', getTheme(cat.id).text]" />
            </div>
          </div>
          <div class="tw-flex-1 tw-px-8 tw-flex tw-items-center tw-justify-between tw-border-r tw-border-gray-100">
            <div class="tw-flex tw-items-center tw-gap-6">
              <h2 class="tw-text-3xl tw-font-bold tw-text-gray-800">{{ cat.name }}</h2>
              <p class="tw-text-xs tw-text-gray-400 tw-mt-1">{{ cat.updateDate }} update</p>
            </div>
            <div class="tw-text-2xl tw-font-bold tw-text-gray-700">
              {{ getThreadCount(cat.id) }}スレッド
            </div>
          </div>
        </div>
      </div>

      <div class="md:tw-hidden tw-flex tw-flex-col tw-items-center tw-min-h-[600px]">
        <div ref="scrollContainer"
          class="tw-flex tw-overflow-x-auto tw-snap-x tw-snap-mandatory tw-scrollbar-hide tw-w-full tw-gap-6 tw-py-4"
          @scroll="handleScroll">
          <div v-for="cat in categories" :key="cat.id" class="tw-flex-shrink-0 tw-w-[85%] tw-snap-center">
            <div class="tw-bg-white tw-rounded-[3rem] tw-shadow-lg tw-flex tw-flex-col tw-h-[500px] tw-overflow-hidden">
              <div :class="['tw-p-10 tw-text-center tw-flex-shrink-0', getTheme(cat.id).bg]">
                <div
                  :class="['tw-w-24 tw-h-24 tw-mx-auto tw-rounded-full tw-bg-white tw-border-4 tw-flex tw-items-center tw-justify-center tw-mb-6', getTheme(cat.id).border]">
                  <component :is="getIcon(cat.icon)" :class="['tw-w-12 tw-h-12', getTheme(cat.id).text]" />
                </div>
                <h2 class="tw-text-3xl tw-font-black tw-text-gray-800">{{ cat.name }}</h2>
                <p class="tw-text-[10px] tw-text-gray-400 tw-mt-1">{{ cat.updateDate }} update</p>
              </div>
              <div class="tw-flex-1 tw-p-6 tw-flex tw-flex-col tw-justify-between tw-items-center">
                <div class="tw-w-full tw-text-center tw-mt-4">
                  <p class="tw-text-gray-400 tw-text-sm font-bold">{{ getThreadCount(cat.id) }} Threads</p>
                  <p class="tw-text-gray-400 tw-text-xs tw-mt-1">最新のスレッドをチェック</p>
                </div>
                <button @click="() => $router.push(localePath(`/shiru/category/${cat.id}`))"
                  class="tw-bg-[#85C441] tw-text-white tw-px-10 tw-py-4 tw-rounded-full tw-font-bold tw-shadow-lg tw-mb-4 active:tw-scale-95 tw-transition-transform">
                  一覧を見る
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="tw-flex tw-justify-center tw-gap-2 tw-py-6 tw-flex-shrink-0">
          <div v-for="(cat, idx) in categories" :key="cat.id"
            :class="['tw-w-2.5 tw-h-2.5 tw-rounded-full tw-transition-all tw-duration-300', activeIndex === idx ? 'tw-bg-[#85C441] tw-w-6' : 'tw-bg-gray-200']">
          </div>
        </div>
      </div>
    </div>

    <AuthModal :is-open="isLoginModalOpen" @close="isLoginModalOpen = false" />
  </div>
</template>

<script setup lang="ts">
import {
  Lightbulb, Search, FileText, Home, UserCircle,
  Train, Users, Waves, Utensils, Plus,
  ShoppingBag, Bed, Landmark, Trash2
} from 'lucide-vue-next'
import { collection, query, onSnapshot } from 'firebase/firestore'

const { user, initAuth, userPhotoURL } = useAuth()
const { openDrawer } = useDrawer()
const { $firestore } = useNuxtApp()
const isLoginModalOpen = ref(false)

const { categories, loadCategories } = useShiru()
const localePath = useLocalePath()

const threadCounts = ref<Record<string, number>>({})

onMounted(async () => {
  initAuth()
  await loadCategories()

  const q = query(collection($firestore, 'threads'))
  onSnapshot(q, (snapshot) => {
    const counts: Record<string, number> = {}
    snapshot.docs.forEach(doc => {
      const data = doc.data()
      if (data.categoryId) {
        counts[data.categoryId] = (counts[data.categoryId] || 0) + 1
      }
    })
    threadCounts.value = counts
  })
})

const getThreadCount = (categoryId: string) => {
  return threadCounts.value[categoryId] || 0
}

const scrollContainer = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

const handleScroll = (event: Event) => {
  const container = event.target as HTMLElement
  const scrollLeft = container.scrollLeft
  const itemWidth = container.offsetWidth * 0.85 
  activeIndex.value = Math.round(scrollLeft / itemWidth)
}

// カテゴリごとのテーマ設定
const categoryOptions: Record<string, any> = {
  transport: {
    bg: 'tw-bg-[#E0F2F7]',
    border: 'tw-border-[#A5D1E1]',
    text: 'tw-text-[#5FB3D5]'
  },
  public: {
    bg: 'tw-bg-[#FCE7EB]',
    border: 'tw-border-[#F4A7B9]',
    text: 'tw-text-[#E95295]'
  },
  spa: {
    bg: 'tw-bg-[#E5F1F6]',
    border: 'tw-border-[#7DB9DE]',
    text: 'tw-text-[#3E91FF]'
  },
  cafe: {
    bg: 'tw-bg-[#FFF3E0]',
    border: 'tw-border-[#F5B169]',
    text: 'tw-text-[#F39800]'
  },
  shopping: {
    bg: 'tw-bg-[#F3E5F5]',
    border: 'tw-border-[#CE93D8]',
    text: 'tw-text-[#9C27B0]'
  },
  hotel: {
    bg: 'tw-bg-[#E8F5E9]',
    border: 'tw-border-[#81C784]',
    text: 'tw-text-[#4CAF50]'
  },
  culture: {
    bg: 'tw-bg-[#FFEBEE]',
    border: 'tw-border-[#E57373]',
    text: 'tw-text-[#F44336]'
  },
  trash: {
    bg: 'tw-bg-[#ECEFF1]',
    border: 'tw-border-[#90A4AE]',
    text: 'tw-text-[#607D8B]'
  },
  new: {
    bg: 'tw-bg-[#F3E5F5]',
    border: 'tw-border-[#B28FCE]',
    text: 'tw-text-[#9C27B0]'
  }
}

// 修正: 存在しないIDが来てもエラーにならないようラップ
const getTheme = (id: string) => {
  return categoryOptions[id] || categoryOptions.new
}

const getIcon = (name: string) => {
  const icons: Record<string, any> = {
    train: Train,
    users: Users,
    waves: Waves,
    utensils: Utensils,
    'shopping-bag': ShoppingBag,
    bed: Bed,
    landmark: Landmark,
    'trash-2': Trash2,
    plus: Plus
  }
  return icons[name] || Plus
}

useHead({
  title: 'しるまな | るうまな'
})
</script>

<style scoped>
.tw-scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.tw-scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>