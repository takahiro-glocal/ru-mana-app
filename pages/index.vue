<template>
  <div class="tw-min-h-screen tw-bg-[#F9F5E7] tw-p-4 md:tw-p-8">
    <div class="tw-max-w-6xl tw-mx-auto">
      <header class="tw-hidden md:tw-flex tw-justify-between tw-items-center tw-mb-8">
        <div class="tw-flex tw-items-center tw-gap-4">
          <img src="/images/logo.png" alt="るうまな" class="tw-w-16 tw-h-16" />
          <div class="tw-ml-2">
            <h1 class="tw-text-4xl tw-font-bold tw-text-[#4B3E8E]">
              こんにちは ゲストさん！
            </h1>
            <p class="tw-text-pink-500 tw-text-lg tw-font-medium">Welcome to the various culture mind!</p>
          </div>
        </div>
        <div class="tw-flex tw-items-center tw-gap-6">
          <div class="tw-relative">
            <input type="text" class="tw-bg-[#4B3E8E] tw-bg-opacity-80 tw-text-white tw-rounded-md tw-py-1.5 tw-px-10 tw-w-64" />
            <Search class="tw-absolute tw-left-3 tw-top-1/2 tw-transform -tw-translate-y-1/2 tw-text-white tw-w-5" />
            <X class="tw-absolute tw-right-3 tw-top-1/2 tw-transform -tw-translate-y-1/2 tw-text-white tw-w-4" />
          </div>
          <Home class="tw-text-[#BCAF92] tw-w-9 tw-h-9 tw-cursor-pointer" />
          <UserCircle class="tw-text-[#BCAF92] tw-w-10 tw-h-10 tw-cursor-pointer" @click="isDrawerOpen = true" />
        </div>
      </header>

      <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-6">
        
        <div class="tw-col-span-1 md:tw-col-span-7 tw-space-y-6">
          <div class="md:tw-hidden tw-flex tw-items-center tw-justify-between tw-mb-4">
            <ChevronLeft class="tw-text-[#BCAF92] tw-w-8 tw-h-8" />
            <div class="tw-relative tw-flex-1 tw-mx-4">
              <input type="text" class="tw-w-full tw-bg-[#4B3E8E] tw-bg-opacity-80 tw-text-white tw-rounded-md tw-py-1.5 tw-px-10" />
              <Search class="tw-absolute tw-left-3 tw-top-1/2 tw-transform -tw-translate-y-1/2 tw-text-white tw-w-4" />
            </div>
            <UserCircle class="tw-text-[#BCAF92] tw-w-10 tw-h-10" @click="isDrawerOpen = true" />
          </div>

          <div class="tw-grid tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4">
            <NuxtLink :to="localePath('/shiru')" class="tw-bg-[#85C441] tw-aspect-square tw-rounded-2xl tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-white tw-shadow-sm hover:tw-opacity-90 tw-transition-all">
              <Lightbulb class="tw-w-14 tw-h-14 tw-mb-2" />
              <span class="tw-font-bold tw-text-lg">しるまな</span>
            </NuxtLink>
            <NuxtLink :to="localePath('/miru')" class="tw-bg-[#F26522] tw-aspect-square tw-rounded-2xl tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-white tw-shadow-sm hover:tw-opacity-90 tw-transition-all">
              <Binoculars class="tw-w-14 tw-h-14 tw-mb-2" />
              <span class="tw-font-bold tw-text-lg">みるまな</span>
            </NuxtLink>
            <NuxtLink :to="localePath('/kiku')" class="tw-bg-[#E4007F] tw-aspect-square tw-rounded-2xl tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-white tw-shadow-sm hover:tw-opacity-90 tw-transition-all">
              <Ear class="tw-w-14 tw-h-14 tw-mb-2" />
              <span class="tw-font-bold tw-text-lg">きくまな</span>
            </NuxtLink>
            <NuxtLink :to="localePath('/iku')" class="tw-bg-[#0099DD] tw-aspect-square tw-rounded-2xl tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-white tw-shadow-sm hover:tw-opacity-90 tw-transition-all">
              <Footprints class="tw-w-14 tw-h-14 tw-mb-2" />
              <span class="tw-font-bold tw-text-lg">いくまな</span>
            </NuxtLink>
          </div>

          <div class="tw-hidden md:tw-block tw-space-y-4">
            <h2 class="tw-text-xl tw-font-bold tw-text-gray-700">現在のエリア</h2>
            <div class="tw-flex tw-bg-[#2C3E50] tw-rounded-3xl tw-overflow-hidden tw-h-64 tw-shadow-lg">
              <div class="tw-w-[42%] tw-p-6 tw-text-white tw-flex tw-flex-col tw-justify-between tw-min-w-0">
                <div>
                  <div class="tw-flex tw-items-center tw-gap-2 tw-mb-1">
                    <MapPin class="tw-w-6 tw-h-6 tw-flex-shrink-0" />
                    <span class="tw-text-xl tw-font-bold tw-truncate">東京都・新宿区</span>
                  </div>
                  <div class="tw-text-lg tw-mb-4">{{ formattedDate }}</div>
                  <ul class="tw-space-y-2 tw-text-sm">
                    <li class="tw-truncate">● ● まつり <span class="tw-text-xs tw-opacity-70">[西新宿○丁目]</span></li>
                    <li class="tw-truncate">● ● フェア <span class="tw-text-xs tw-opacity-70">[新宿○丁目]</span></li>
                  </ul>
                  <button class="tw-text-xs tw-mt-2 tw-opacity-80">・・・ もっと見る</button>
                </div>
                <div class="tw-flex tw-items-end tw-gap-4">
                  <CloudSun class="tw-w-12 tw-h-12 tw-text-yellow-400 tw-flex-shrink-0" />
                  <span class="tw-text-6xl tw-font-light tw-leading-none">25度</span>
                </div>
              </div>
              <div class="tw-w-[58%] tw-relative tw-bg-gray-100">
                <div ref="mapContainerPC" class="tw-w-full tw-h-full"></div>
              </div>
            </div>
          </div>

          <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-10 tw-gap-4">
            <div class="tw-col-span-1 md:tw-col-span-4 tw-bg-[#2C3E50] tw-rounded-3xl tw-p-6 tw-text-white tw-shadow-lg">
              <div class="tw-flex tw-items-center tw-gap-2 tw-text-[#E4007F] tw-mb-3 tw-font-bold">
                <ArrowUp class="tw-w-5 tw-h-5" /> Update
              </div>
              <ul class="tw-space-y-2 tw-text-sm">
                <li class="tw-truncate">車内ルールだよ <span class="tw-text-[10px] tw-opacity-60">[新規コメント]</span></li>
                <li class="tw-truncate">とても素敵 <span class="tw-text-[10px] tw-opacity-60">[新規投稿]</span></li>
                <li class="tw-truncate">車内ルールだよ <span class="tw-text-[10px] tw-opacity-60">[新規コメント]</span></li>
                <li class="tw-truncate">とても素敵 <span class="tw-text-[10px] tw-opacity-60">[新規投稿]</span></li>
              </ul>
            </div>
            <div class="tw-col-span-1 md:tw-col-span-3 tw-bg-[#008080] tw-rounded-3xl tw-p-6 tw-text-white tw-shadow-lg">
              <div class="tw-font-bold tw-mb-1 tw-text-lg">今日は何の日</div>
              <div class="tw-text-sm tw-opacity-80 tw-mb-3">12月25日</div>
              <p class="tw-text-[11px] tw-leading-relaxed">●現在エリアの過去の出来事など表示<br><br>ピックアップはGemini先生にお任せ</p>
            </div>
            <div class="tw-col-span-1 md:tw-col-span-3 tw-flex tw-flex-col tw-items-center tw-justify-center">
              <NuxtLink :to="localePath('/trouble')" class="tw-relative tw-w-28 tw-h-28 tw-rounded-full tw-bg-white tw-border-[6px] tw-border-[#E4007F] tw-flex tw-flex-col tw-items-center tw-justify-center tw-shadow-xl active:tw-scale-95 tw-transition-transform">
                <div class="tw-bg-[#E4007F] tw-text-white tw-w-10 tw-h-10 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mb-1">
                  <span class="tw-font-black tw-text-2xl">!</span>
                </div>
                <div class="tw-text-[#E4007F] tw-font-black tw-text-[10px] tw-leading-tight tw-text-center">IN<br>TROUBLE</div>
              </NuxtLink>
              <span class="tw-text-sm tw-mt-2 tw-font-bold tw-text-gray-600">おたすけ</span>
            </div>
          </div>
        </div>

        <div class="tw-col-span-1 md:tw-col-span-5 tw-flex tw-flex-col tw-gap-6">
          
          <div class="tw-bg-[#EBECEF] tw-bg-opacity-80 tw-rounded-3xl tw-p-6 tw-shadow-sm">
            <h3 class="tw-text-xs tw-font-bold tw-text-gray-400 tw-uppercase tw-mb-4">パーソナル</h3>
            <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-4">
              <div class="tw-col-span-3 tw-flex tw-flex-col tw-gap-4">
                <div class="tw-flex tw-flex-col tw-items-center">
                  <div class="tw-bg-[#BCAF92] tw-w-16 tw-h-16 tw-rounded-2xl tw-flex tw-items-center tw-justify-center tw-shadow-sm">
                    <MessageSquare class="tw-w-8 tw-h-8 tw-text-white" />
                  </div>
                  <span class="tw-text-[10px] tw-mt-1 tw-text-gray-500 tw-font-bold">投稿</span>
                </div>
                <div class="tw-flex tw-flex-col tw-items-center">
                  <div class="tw-bg-[#BCAF92] tw-w-16 tw-h-16 tw-rounded-2xl tw-flex tw-items-center tw-justify-center tw-shadow-sm">
                    <Download class="tw-w-8 tw-h-8 tw-text-white" />
                  </div>
                  <span class="tw-text-[10px] tw-mt-1 tw-text-gray-500 tw-font-bold">ダウンロード</span>
                </div>
              </div>
              <div class="tw-col-span-9 tw-bg-[#D9A65D] tw-rounded-2xl tw-p-4 tw-text-white tw-shadow-sm">
                <div class="tw-flex tw-items-start tw-gap-3 tw-mb-3">
                  <div class="tw-text-6xl tw-font-bold tw-leading-none">{{ todayDay }}</div>
                  <div class="tw-flex-1 tw-text-[10px] tw-space-y-1">
                    <div>●本日のイベントはありません</div>
                    <div>●通知はありません</div>
                  </div>
                </div>
                <div class="tw-grid tw-grid-cols-7 tw-text-center tw-text-[10px] tw-gap-y-1.5">
                  <span v-for="d in ['S','M','T','W','T','F','S']" :key="d" class="tw-opacity-60">{{ d }}</span>
                  <div v-for="blank in firstDayOfMonth" :key="'blank-' + blank"></div>
                  <div v-for="n in daysInMonth" :key="n" 
                    :class="['tw-py-0.5', isToday(n) ? 'tw-bg-[#2C3E50] tw-rounded-full tw-font-bold' : '']">
                    {{ n }}
                  </div>
                </div>
                <div class="tw-text-center tw-mt-2 tw-text-[10px] tw-opacity-70">カレンダー</div>
              </div>
            </div>
          </div>

          <div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-4">
            <div class="tw-flex-1 tw-relative tw-rounded-3xl tw-overflow-hidden tw-shadow-lg tw-h-52">
              <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800" class="tw-w-full tw-h-full tw-object-cover" />
            </div>
            <div class="tw-w-full md:tw-w-24 tw-flex tw-flex-row md:tw-flex-col tw-gap-3">
              <div class="tw-flex-1 tw-bg-[#BCAF92] tw-rounded-2xl tw-p-3 tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-white tw-shadow-md">
                <Map class="tw-w-10 tw-h-10" />
                <span class="tw-text-[9px] tw-font-bold tw-mt-1">防災マップ</span>
              </div>
              <div class="tw-flex-1 tw-bg-[#D9A65D] tw-rounded-2xl tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-white tw-shadow-md">
                <div class="tw-grid tw-grid-cols-2 tw-gap-1.5">
                  <Facebook class="tw-w-4 tw-h-4" /> <span class="tw-font-bold tw-text-[8px] tw-mt-0.5">X</span>
                  <Youtube class="tw-w-4 tw-h-4" /> <Instagram class="tw-w-4 tw-h-4" />
                </div>
                <span class="tw-text-[9px] tw-font-bold tw-mt-1">SNS</span>
              </div>
            </div>
          </div>

          <div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-4">
            <div class="tw-flex-1 tw-bg-white tw-rounded-[2rem] tw-p-5 tw-shadow-sm tw-flex tw-flex-col tw-justify-center">
              <span class="tw-text-[10px] tw-text-gray-400 tw-font-bold tw-mb-3">みんな何してる？</span>
              <div class="tw-flex tw-items-center tw-justify-between">
                <div class="tw-flex tw-items-center -tw-space-x-3">
                  <img src="https://i.pravatar.cc/100?u=1" class="tw-w-12 tw-h-12 tw-rounded-full tw-border-4 tw-border-white" />
                  <img src="https://i.pravatar.cc/100?u=2" class="tw-w-12 tw-h-12 tw-rounded-full tw-border-4 tw-border-white" />
                  <img src="https://i.pravatar.cc/100?u=3" class="tw-w-12 tw-h-12 tw-rounded-full tw-border-4 tw-border-white" />
                </div>
                <div class="tw-text-[11px] tw-text-gray-500 tw-font-bold tw-leading-tight">Alex, Jhon, Piter</div>
              </div>
            </div>
            <div class="tw-w-full md:tw-w-40 tw-bg-white tw-rounded-[2rem] tw-p-5 tw-shadow-sm tw-flex tw-items-center tw-justify-between">
               <div class="tw-flex tw-flex-col tw-gap-2">
                 <div class="tw-bg-[#2C3E50] tw-text-white tw-px-3 tw-py-1 tw-rounded-md tw-text-sm tw-font-bold tw-text-center">G</div>
                 <span class="tw-text-[9px] tw-text-gray-400 tw-font-bold tw-text-center">ギャラリー</span>
               </div>
               <div class="tw-h-full tw-w-[1px] tw-bg-gray-100 tw-mx-1"></div>
               <div class="tw-flex tw-flex-col tw-gap-2">
                 <div class="tw-bg-[#2C3E50] tw-text-white tw-px-3 tw-py-1 tw-rounded-md tw-text-sm tw-font-bold tw-text-center">Q</div>
                 <span class="tw-text-[9px] tw-text-gray-400 tw-font-bold tw-text-center">クイズ</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <footer class="md:tw-hidden tw-mt-8 tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-10">
        <div v-for="item in mobileFooterItems" :key="item.label" class="tw-flex tw-flex-col tw-items-center">
          <div class="tw-bg-[#BCAF92] tw-rounded-2xl tw-p-3.5 tw-text-white tw-shadow-sm">
            <component :is="item.icon" class="tw-w-6 tw-h-6" />
          </div>
          <span class="tw-text-[10px] tw-mt-2 tw-text-gray-500 tw-font-bold">{{ item.label }}</span>
        </div>
      </footer>
    </div>

    <transition name="drawer-fade">
      <div v-if="isDrawerOpen" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-20 tw-z-[60] tw-backdrop-blur-sm" @click="isDrawerOpen = false"></div>
    </transition>
    <transition name="drawer-slide">
      <aside v-if="isDrawerOpen" class="tw-fixed tw-top-4 tw-right-4 tw-bottom-4 tw-w-full tw-max-w-md tw-bg-white tw-z-[70] tw-rounded-[2.5rem] tw-shadow-2xl tw-flex tw-flex-col">
        <div class="tw-p-6 tw-flex tw-justify-between tw-items-center tw-flex-shrink-0">
          <div class="tw-w-6"></div>
          <h2 class="tw-text-gray-400 tw-font-bold tw-uppercase tw-tracking-widest tw-text-sm">My Account</h2>
          <X class="tw-w-6 tw-h-6 tw-text-gray-300 tw-cursor-pointer" @click="isDrawerOpen = false" />
        </div>
        <div class="tw-flex-1 tw-overflow-y-auto tw-px-8">
           <div class="tw-flex tw-flex-col tw-items-center tw-mb-10">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" class="tw-w-28 tw-h-28 tw-bg-blue-50 tw-rounded-full tw-mb-4" />
              <h3 class="tw-text-2xl tw-font-bold tw-text-gray-700">Alex Johnson</h3>
              <p class="tw-text-sm tw-text-gray-400">@bus_daisuki</p>
           </div>
           <nav class="tw-space-y-4">
              <button v-for="m in ['登録情報','アクティビティ','設定・言語','ポイント','履歴','フィードバック']" :key="m" class="tw-w-full tw-flex tw-items-center tw-justify-between tw-py-4 tw-border-b tw-border-gray-50 tw-text-gray-600 tw-font-bold">
                <span>{{ m }}</span> <ChevronRight class="tw-w-5 tw-h-5 tw-text-gray-300" />
              </button>
           </nav>
        </div>
        <div class="tw-p-8 tw-flex tw-gap-4">
          <button class="tw-flex-1 tw-py-4 tw-bg-gray-50 tw-text-gray-400 tw-rounded-2xl tw-font-bold">ログアウト</button>
        </div>
      </aside>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { 
  Search, X, Home, UserCircle, MapPin, CloudSun, Lightbulb, 
  Binoculars, Ear, Footprints, AlertCircle, MessageSquare, 
  ArrowUp, ChevronLeft, ChevronRight, LayoutGrid, Settings, Download, User,
  Map, Facebook, Youtube, Instagram
} from 'lucide-vue-next'

const MAP_ID = '3d5da5a6ef6b2abd3358054a'; 
const { load } = useMapsLoader();
const localePath = useLocalePath();
const isDrawerOpen = ref(false);

const mapContainerPC = ref<HTMLElement | null>(null);

// Date & Calendar Logic
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();
const todayDay = now.getDate();

const formattedDate = computed(() => {
  const options: Intl.DateTimeFormatOptions = { month: 'numeric', day: 'numeric', weekday: 'short' };
  return now.toLocaleDateString('ja-JP', options).replace(/\((.+)\)/, ' $1').toLowerCase();
});

const firstDayOfMonth = computed(() => new Date(currentYear, currentMonth, 1).getDay());
const daysInMonth = computed(() => new Date(currentYear, currentMonth + 1, 0).getDate());
const isToday = (day: number) => day === todayDay;

const mobileFooterItems = [
  { icon: Download, label: 'ダウンロード' },
  { icon: Settings, label: '設定' },
  { icon: User, label: 'プロフ' },
  { icon: LayoutGrid, label: 'メニュー' }
];

declare const google: any;

const initGoogleMap = async () => {
  try {
    await load();
    if (mapContainerPC.value) {
      new google.maps.Map(mapContainerPC.value, {
        center: { lat: 35.6895, lng: 139.6917 },
        zoom: 15,
        minZoom: 15,
        mapId: MAP_ID,
        disableDefaultUI: true,
        gestureHandling: "none",
        zoomControl: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        keyboardShortcuts: false,
        clickableIcons: false,
      });
    }
  } catch (e) {
    console.error('Map failed', e);
  }
}

onMounted(() => {
  initGoogleMap();
});
</script>

<style scoped>
.tw-scrollbar-hide::-webkit-scrollbar { display: none; }
.tw-scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* Drawer Transitions */
.drawer-fade-enter-active, .drawer-fade-leave-active { transition: opacity 0.4s ease; }
.drawer-fade-enter-from, .drawer-fade-leave-to { opacity: 0; }
.drawer-slide-enter-active, .drawer-slide-leave-active { transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
.drawer-slide-enter-from, .drawer-slide-leave-to { transform: translateX(110%); }
</style>