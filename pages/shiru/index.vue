<template>
  <div class="tw-min-h-screen tw-bg-white md:tw-bg-[#F9F5E7]">
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

    <div class="tw-max-w-6xl tw-mx-auto tw-p-4 md:tw-p-10">
      <nav class="tw-text-[10px] tw-text-gray-400 tw-mb-6 tw-hidden md:tw-block">
        しるまな / カテゴリー
      </nav>

      <div class="tw-hidden md:tw-flex tw-flex-col tw-gap-6">
        <div 
          v-for="cat in categories" 
          :key="cat.id"
          class="tw-group tw-bg-white tw-rounded-3xl tw-shadow-sm hover:tw-shadow-xl tw-transition-all tw-duration-300 tw-flex tw-items-center tw-overflow-hidden tw-cursor-pointer"
          @click="() => $router.push(localePath(`/shiru/category/${cat.id}`))"
        >
          <div :class="['tw-w-44 tw-h-32 tw-flex tw-items-center tw-justify-center tw-relative tw-overflow-hidden', categoryOptions[cat.id].bg]">
            <component :is="getIcon(cat.icon)" :class="['tw-w-20 tw-h-20 tw-opacity-20 tw-absolute', categoryOptions[cat.id].text]" />
            <div :class="['tw-w-20 tw-h-20 tw-rounded-full tw-bg-white tw-border-4 tw-flex tw-items-center tw-justify-center tw-relative tw-z-10', categoryOptions[cat.id].border]">
              <component :is="getIcon(cat.icon)" :class="['tw-w-10 tw-h-10', categoryOptions[cat.id].text]" />
            </div>
          </div>
          <div class="tw-flex-1 tw-px-8 tw-flex tw-items-center tw-justify-between tw-border-r tw-border-gray-100">
            <div class="tw-flex tw-items-center tw-gap-6">
              <h2 class="tw-text-3xl tw-font-bold tw-text-gray-800">{{ cat.name }}</h2>
              <p class="tw-text-xs tw-text-gray-400 tw-mt-1">{{ cat.updateDate }} update</p>
            </div>
            <div class="tw-text-2xl tw-font-bold tw-text-gray-700">
              {{ cat.threadCount }}スレッド
            </div>
          </div>
          <div class="tw-px-10 tw-flex tw-items-center tw-gap-3 tw-bg-gray-50 tw-bg-opacity-30 group-hover:tw-bg-white tw-transition-colors">
            <span class="tw-text-gray-400 tw-text-sm">[スレッド内検索]</span>
            <div class="tw-bg-[#BCAF92] tw-p-2 tw-rounded-full tw-shadow-sm">
              <Search class="tw-w-6 tw-h-6 tw-text-white" />
            </div>
          </div>
        </div>
      </div>

      <div class="md:tw-hidden tw-flex tw-flex-col tw-items-center tw-min-h-[600px]">
        <div class="tw-flex tw-overflow-x-auto tw-snap-x tw-snap-mandatory tw-scrollbar-hide tw-w-full tw-gap-6 tw-py-4">
          <div 
            v-for="cat in categories" 
            :key="cat.id"
            class="tw-flex-shrink-0 tw-w-[85%] tw-snap-center"
          >
            <div class="tw-bg-white tw-rounded-[3rem] tw-shadow-lg tw-flex tw-flex-col tw-h-[500px] tw-overflow-hidden">
              <div :class="['tw-p-10 tw-text-center tw-flex-shrink-0', categoryOptions[cat.id].bg]">
                <div :class="['tw-w-24 tw-h-24 tw-mx-auto tw-rounded-full tw-bg-white tw-border-4 tw-flex tw-items-center tw-justify-center tw-mb-6', categoryOptions[cat.id].border]">
                  <component :is="getIcon(cat.icon)" :class="['tw-w-12 tw-h-12', categoryOptions[cat.id].text]" />
                </div>
                <h2 class="tw-text-3xl tw-font-black tw-text-gray-800">{{ cat.name }}</h2>
                <p class="tw-text-[10px] tw-text-gray-400 tw-mt-1">{{ cat.updateDate }} update</p>
              </div>
              <div class="tw-flex-1 tw-p-6 tw-flex tw-flex-col tw-justify-between tw-items-center">
                <div class="tw-w-full tw-text-center tw-mt-4">
                  <p class="tw-text-gray-400 tw-text-sm">最新のスレッドをチェック</p>
                </div>
                <button 
                  @click="() => $router.push(localePath(`/shiru/category/${cat.id}`))"
                  class="tw-bg-[#85C441] tw-text-white tw-px-10 tw-py-4 tw-rounded-full tw-font-bold tw-shadow-lg tw-mb-4 active:tw-scale-95 tw-transition-transform"
                >
                  一覧を見る
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="tw-flex tw-gap-2 tw-my-6">
          <div v-for="n in categories.length" :key="n" class="tw-w-2 tw-h-2 tw-rounded-full tw-bg-gray-200"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Lightbulb, Search, FileText, Home, UserCircle, 
  Train, Users, Waves, Utensils, Plus 
} from 'lucide-vue-next'

const { categories, loadCategories } = useShiru()
await loadCategories()
const localePath = useLocalePath()

// Tailwindのパージを防ぐための静的なマッピング
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
  new: {
    bg: 'tw-bg-[#F3E5F5]',
    border: 'tw-border-[#B28FCE]',
    text: 'tw-text-[#9C27B0]'
  }
}

const getIcon = (name: string) => {
  const icons: Record<string, any> = {
    train: Train,
    users: Users,
    waves: Waves,
    utensils: Utensils,
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