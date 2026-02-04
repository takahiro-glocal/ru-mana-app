<template>
  <div class="tw-min-h-screen tw-bg-[#F9F5E7] tw-p-4 md:tw-p-8">
    <div class="tw-max-w-6xl tw-mx-auto">
      <header class="tw-hidden md:tw-flex tw-justify-between tw-items-center tw-mb-8">
        <div class="tw-flex tw-items-center tw-gap-4">
          <img src="/images/logo.png" alt="るうまな" class="tw-w-16 tw-h-16" />
          <div>
            <h1 class="tw-text-3xl tw-font-bold tw-text-[#4B3E8E]">
              {{ $t('dashboard.welcome', { name: 'ゲスト' }) }}
            </h1>
            <p class="tw-text-pink-500 tw-font-medium">Welcome to the various culture mind!</p>
          </div>
        </div>
        <div class="tw-flex tw-items-center tw-gap-4">
          <div class="tw-relative">
            <input type="text" class="tw-bg-gray-200 tw-rounded-md tw-py-1 tw-px-10 tw-w-64" />
            <Search class="tw-absolute tw-left-3 tw-top-1/2 tw-transform -tw-translate-y-1/2 tw-text-gray-500 tw-w-5" />
            <X class="tw-absolute tw-right-3 tw-top-1/2 tw-transform -tw-translate-y-1/2 tw-text-gray-500 tw-w-4" />
          </div>
          <Home class="tw-text-gray-400 tw-w-8 tw-h-8" />
          <UserCircle class="tw-text-gray-400 tw-w-10 tw-h-10" />
        </div>
      </header>

      <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-6">
        
        <div class="tw-col-span-1 md:tw-col-span-7 tw-space-y-6">
          
          <div class="md:tw-hidden tw-flex tw-items-center tw-justify-between tw-mb-4">
            <ChevronLeft class="tw-text-gray-400 tw-w-8 tw-h-8" />
            <div class="tw-relative tw-flex-1 tw-mx-4">
              <input type="text" class="tw-w-full tw-bg-gray-200 tw-rounded-md tw-py-1 tw-px-8" />
              <Search class="tw-absolute tw-left-2 tw-top-1/2 tw-transform -tw-translate-y-1/2 tw-text-gray-500 tw-w-4" />
              <X class="tw-absolute tw-right-2 tw-top-1/2 tw-transform -tw-translate-y-1/2 tw-text-gray-500 tw-w-4" />
            </div>
          </div>

          <div class="tw-grid tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4">
            <NuxtLink :to="localePath('/shiru')" class="tw-bg-[#85C441] tw-aspect-square tw-rounded-2xl tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-white tw-shadow-sm hover:tw-opacity-90 tw-transition-all">
              <Lightbulb class="tw-w-12 tw-h-12 tw-mb-2" />
              <span class="tw-font-bold">{{ $t('common.shiru') }}</span>
            </NuxtLink>
            <NuxtLink :to="localePath('/miru')" class="tw-bg-[#F26522] tw-aspect-square tw-rounded-2xl tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-white tw-shadow-sm hover:tw-opacity-90 tw-transition-all">
              <Binoculars class="tw-w-12 tw-h-12 tw-mb-2" />
              <span class="tw-font-bold">{{ $t('common.miru') }}</span>
            </NuxtLink>
            <NuxtLink :to="localePath('/kiku')" class="tw-bg-[#E4007F] tw-aspect-square tw-rounded-2xl tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-white tw-shadow-sm hover:tw-opacity-90 tw-transition-all">
              <Ear class="tw-w-12 tw-h-12 tw-mb-2" />
              <span class="tw-font-bold">{{ $t('common.kiku') }}</span>
            </NuxtLink>
            <NuxtLink :to="localePath('/iku')" class="tw-bg-[#0099DD] tw-aspect-square tw-rounded-2xl tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-white tw-shadow-sm hover:tw-opacity-90 tw-transition-all">
              <Footprints class="tw-w-12 tw-h-12 tw-mb-2" />
              <span class="tw-font-bold">{{ $t('common.iku') }}</span>
            </NuxtLink>
          </div>

          <div class="tw-bg-[#2C3E50] tw-rounded-3xl tw-p-6 tw-text-white tw-relative tw-overflow-hidden">
            <div class="tw-flex tw-justify-between">
              <div class="tw-space-y-2">
                <div class="tw-flex tw-items-center tw-gap-2">
                  <MapPin class="tw-w-5 tw-h-5" />
                  <span class="tw-text-lg">東京都・新宿区</span>
                </div>
                <div class="tw-text-xl">12/25 thu</div>
                <ul class="tw-mt-4 tw-space-y-1 tw-text-sm">
                  <li>● ● まつり <span class="tw-text-xs tw-opacity-70">[西新宿○丁目]</span></li>
                  <li>● ● フェア <span class="tw-text-xs tw-opacity-70">[新宿○丁目]</span></li>
                </ul>
              </div>
              <div class="tw-text-right">
                <div class="tw-flex tw-items-center tw-justify-end tw-gap-2">
                  <CloudSun class="tw-w-10 tw-h-10 tw-text-yellow-400" />
                  <span class="tw-text-5xl tw-font-light">25度</span>
                </div>
              </div>
            </div>
            
            <div class="tw-hidden md:tw-block tw-mt-4 tw-rounded-xl tw-overflow-hidden tw-h-48 tw-relative tw-bg-gray-100">
              <div ref="mapContainer" class="tw-w-full tw-h-full"></div>
            </div>
          </div>

          <div class="md:tw-hidden tw-grid tw-grid-cols-3 tw-gap-4">
             <NuxtLink :to="localePath('/trouble')" class="tw-flex tw-flex-col tw-items-center">
               <div class="tw-w-20 tw-h-20 tw-rounded-full tw-border-2 tw-border-red-500 tw-flex tw-items-center tw-justify-center tw-bg-white">
                 <AlertCircle class="tw-w-12 tw-h-12 tw-text-red-500" />
               </div>
               <span class="tw-text-xs tw-mt-2">{{ $t('common.trouble') }}</span>
             </NuxtLink>
             <div class="tw-flex tw-flex-col tw-items-center">
               <div class="tw-w-20 tw-h-20 tw-rounded-2xl tw-bg-[#BCAF92] tw-flex tw-items-center tw-justify-center">
                 <MessageSquare class="tw-w-10 tw-h-10 tw-text-white" />
               </div>
               <span class="tw-text-xs tw-mt-2">投稿</span>
             </div>
             <div class="tw-flex tw-flex-col tw-items-center">
                <div class="tw-bg-[#2C3E50] tw-rounded-xl tw-p-3 tw-text-white tw-w-full tw-h-20 tw-text-[10px]">
                  <div class="tw-flex tw-items-center tw-gap-1 tw-text-red-500">
                    <ArrowUp class="tw-w-3 tw-h-3" /> Update
                  </div>
                  <div class="tw-truncate">車内ルールだよ...</div>
                  <div class="tw-truncate">とても素敵...</div>
                </div>
                <span class="tw-text-xs tw-mt-2">おすすめ</span>
             </div>
          </div>
        </div>

        <div class="tw-col-span-1 md:tw-col-span-5 tw-space-y-6">
          <div class="tw-bg-[#D9A65D] tw-rounded-3xl tw-p-6 tw-text-white">
            <div class="tw-flex tw-items-start tw-gap-4 tw-mb-4">
              <div class="tw-text-7xl tw-font-bold">12</div>
              <div class="tw-flex-1 tw-text-sm">
                <div>●本日のイベントはありません</div>
                <div>●通知はありません</div>
              </div>
            </div>
            <div class="tw-grid tw-grid-cols-7 tw-text-center tw-text-xs tw-gap-y-2">
              <span v-for="d in ['S','M','T','W','T','F','S']" :key="d" class="tw-opacity-60">{{ d }}</span>
              <div v-for="n in 31" :key="n" :class="['tw-py-1', n === 25 ? 'tw-bg-[#2C3E50] tw-rounded-full' : '']">{{ n }}</div>
            </div>
          </div>

          <div class="tw-hidden md:tw-grid tw-grid-cols-2 tw-gap-4">
             <div class="tw-bg-white tw-rounded-2xl tw-p-4 tw-shadow-sm tw-flex tw-items-center tw-gap-3">
               <img src="https://i.pravatar.cc/150?u=alex" class="tw-w-10 tw-h-10 tw-rounded-full" alt="Alex" />
               <div class="tw-text-[10px]">みんな何してる？<br/><strong>Alex</strong></div>
             </div>
             <div class="tw-bg-white tw-rounded-2xl tw-p-4 tw-shadow-sm tw-flex tw-items-center tw-gap-3">
                <div class="tw-flex tw-gap-1">
                  <div class="tw-bg-gray-800 tw-text-white tw-w-6 tw-h-6 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-[8px]">G</div>
                  <div class="tw-bg-gray-800 tw-text-white tw-w-6 tw-h-6 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-[8px]">Q</div>
                </div>
                <div class="tw-text-[10px]">エンタメ<br/>クイズ</div>
             </div>
          </div>

          <NuxtLink :to="localePath('/trouble')" class="tw-hidden md:tw-flex tw-bg-white tw-rounded-full tw-p-2 tw-items-center tw-gap-4 tw-border-2 tw-border-red-500 tw-max-w-[200px] tw-mx-auto tw-transition-transform hover:tw-scale-105">
             <div class="tw-bg-red-500 tw-rounded-full tw-p-2">
               <AlertCircle class="tw-w-6 tw-h-6 tw-text-white" />
             </div>
             <span class="tw-font-bold tw-text-red-500">おたすけ</span>
          </NuxtLink>
        </div>
      </div>

      <footer class="md:tw-hidden tw-mt-8 tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-10">
        <div v-for="item in mobileFooterItems" :key="item.label" class="tw-flex tw-flex-col tw-items-center">
          <div class="tw-bg-[#BCAF92] tw-rounded-xl tw-p-3 tw-text-white">
            <component :is="item.icon" class="tw-w-6 tw-h-6" />
          </div>
          <span class="tw-text-[10px] tw-mt-1">{{ item.label }}</span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Search, X, Home, UserCircle, MapPin, CloudSun, Lightbulb, 
  Binoculars, Ear, Footprints, AlertCircle, MessageSquare, 
  ArrowUp, ChevronLeft, LayoutGrid, Settings, Download, User
} from 'lucide-vue-next'

const MAP_ID = '3d5da5a6ef6b2abd3358054a'; 

const { load } = useMapsLoader();
const localePath = useLocalePath()
const { t } = useI18n()

const mapContainer = ref<HTMLElement | null>(null)
let map: google.maps.Map | null = null;

const mobileFooterItems = [
  { icon: LayoutGrid, label: '防災マップ' },
  { icon: Download, label: 'ダウンロード' },
  { icon: Settings, label: '設定' },
  { icon: User, label: 'アカウント' }
]

declare const google: any;

/**
 * 型定義の競合を回避しつつ、Google Mapを初期化する
 */
const initGoogleMap = async () => {
  try {
    await load();

    map = new google.maps.Map(mapContainer.value, {
      center: { lat: 35.6895, lng: 139.6917 },
      zoom: 15,
      minZoom: 15,
      mapId: MAP_ID, // AdvancedMarkerElementに必須
      disableDefaultUI: true,
      // 移動（ドラッグ）を禁止
      gestureHandling: "none",
      zoomControl: false,
      scrollwheel: false,
      disableDoubleClickZoom: true,
      // キーボード操作による移動を禁止
      keyboardShortcuts: false,
      clickableIcons: false, // 地図上の標準アイコンを非表示にして視認性UP
    });
  } catch (e) {
    console.error('Google Map Load Error:', e)
  }
}

onMounted(() => {
  initGoogleMap()
})
</script>

<style scoped>
/* モバイルのスクロールバー非表示 */
.tw-scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.tw-scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>