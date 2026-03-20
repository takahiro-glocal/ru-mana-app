<template>
  <div class="tw-min-h-screen tw-bg-[#F9F5E7] tw-p-4 md:tw-p-8 tw-pb-24 md:tw-pb-8">
    <div class="tw-max-w-6xl tw-mx-auto">
      
      <header class="tw-hidden md:tw-flex tw-justify-between tw-items-center tw-mb-8">
        <div class="tw-flex tw-items-center tw-gap-4">
          <img src="/images/logo.png" alt="るうまな" class="tw-w-16 tw-h-16" />
          <div class="tw-ml-2">
            <h1 class="tw-text-4xl tw-font-bold tw-text-[#4B3E8E]">
              {{ $t('dashboard.welcome', { name: userDisplayName }) }}
            </h1>
            <p class="tw-text-pink-500 tw-text-lg tw-font-medium">{{ $t('dashboard.subtitle') }}</p>
          </div>
        </div>
        <div class="tw-flex tw-items-center tw-gap-6">
          <div class="tw-relative">
            <input v-model="searchQuery" type="text" :placeholder="$t('dashboard.search_threads')" class="tw-bg-[#4B3E8E] tw-bg-opacity-80 tw-text-white tw-placeholder-white/50 tw-rounded-md tw-py-1.5 tw-px-10 tw-w-64" @input="onSearch" />
            <Search class="tw-absolute tw-left-3 tw-top-1/2 tw-transform -tw-translate-y-1/2 tw-text-white tw-w-5" />
            <X v-if="searchQuery" class="tw-absolute tw-right-3 tw-top-1/2 tw-transform -tw-translate-y-1/2 tw-text-white tw-w-4 tw-cursor-pointer" @click="searchQuery = ''; searchResults = []" />
            <div v-if="searchResults.length > 0" class="tw-absolute tw-top-full tw-left-0 tw-right-0 tw-mt-1 tw-bg-white tw-rounded-xl tw-shadow-lg tw-z-50 tw-max-h-60 tw-overflow-y-auto">
              <div v-for="result in searchResults" :key="result.id" class="tw-p-3 tw-border-b tw-border-gray-50 tw-cursor-pointer hover:tw-bg-gray-50 tw-text-sm tw-text-gray-700" @click="navigateTo(localePath(`/shiru/category/${result.categoryId}/thread/${result.id}`)); searchQuery = ''; searchResults = []">
                {{ result.title }}
              </div>
            </div>
          </div>
          <Home class="tw-text-[#BCAF92] tw-w-9 tw-h-9 tw-cursor-pointer" />
          
          <div v-if="user" @click="openDrawer()" class="tw-cursor-pointer">
            <img :src="userPhotoURL" class="tw-w-10 tw-h-10 tw-rounded-full tw-border-2 tw-border-[#BCAF92]" />
          </div>
          <button v-else @click="isLoginModalOpen = true" class="tw-bg-[#E4007F] tw-text-white tw-font-bold tw-px-6 tw-py-2 tw-rounded-full tw-shadow-sm hover:tw-bg-[#c0006b] tw-transition-colors">
            {{ $t('common.login') }}
          </button>
        </div>
      </header>

      <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-6">
        
        <div class="tw-col-span-1 md:tw-col-span-7 tw-space-y-6">
          <div class="md:tw-hidden tw-flex tw-items-center tw-justify-between tw-mb-4">
            <div class="tw-relative tw-flex-1 tw-mx-4">
              <input v-model="searchQuery" type="text" :placeholder="$t('dashboard.search_short')" class="tw-w-full tw-bg-[#4B3E8E] tw-bg-opacity-80 tw-text-white tw-placeholder-white/50 tw-rounded-md tw-py-1.5 tw-px-10" @input="onSearch" />
              <Search class="tw-absolute tw-left-3 tw-top-1/2 tw-transform -tw-translate-y-1/2 tw-text-white tw-w-4" />
              <div v-if="searchResults.length > 0 && searchQuery" class="tw-absolute tw-top-full tw-left-0 tw-right-0 tw-mt-1 tw-bg-white tw-rounded-xl tw-shadow-lg tw-z-50 tw-max-h-60 tw-overflow-y-auto">
                <div v-for="result in searchResults" :key="result.id" class="tw-p-3 tw-border-b tw-border-gray-50 tw-cursor-pointer hover:tw-bg-gray-50 tw-text-sm tw-text-gray-700" @click="navigateTo(localePath(`/shiru/category/${result.categoryId}/thread/${result.id}`)); searchQuery = ''; searchResults = []">
                  {{ result.title }}
                </div>
              </div>
            </div>
            <div v-if="user" @click="openDrawer()" class="tw-cursor-pointer">
              <img :src="userPhotoURL" class="tw-w-10 tw-h-10 tw-rounded-full tw-border-2 tw-border-[#BCAF92]" />
            </div>
             <UserCircle v-else class="tw-text-[#BCAF92] tw-w-10 tw-h-10" @click="isLoginModalOpen = true" />
          </div>

          <div class="tw-grid tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4">
            <NuxtLink :to="localePath('/shiru')" class="tw-bg-[#85C441] tw-aspect-square tw-rounded-2xl tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-white tw-shadow-sm hover:tw-opacity-90 tw-transition-all">
              <Lightbulb class="tw-w-14 tw-h-14 tw-mb-2" />
              <span class="tw-font-bold tw-text-lg">{{ $t('common.shiru') }}</span>
            </NuxtLink>
            <div class="tw-relative tw-aspect-square tw-rounded-2xl tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-white tw-shadow-sm tw-cursor-pointer tw-overflow-hidden" @click="showComingSoon($t('common.miru'))">
              <div class="tw-absolute tw-inset-0">
                <SkyAnimation :show-logo="false" compact />
              </div>
              <div class="tw-absolute tw-inset-0 tw-bg-black/30"></div>
              <div class="tw-relative tw-z-10 tw-flex tw-flex-col tw-items-center tw-justify-center">
                <Binoculars class="tw-w-14 tw-h-14 tw-mb-2" />
                <span class="tw-font-bold tw-text-lg">{{ $t('common.miru') }}</span>
              </div>
            </div>
            <div class="tw-bg-[#E4007F] tw-aspect-square tw-rounded-2xl tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-white tw-shadow-sm tw-cursor-pointer" @click="showComingSoon($t('common.kiku'))">
              <Ear class="tw-w-14 tw-h-14 tw-mb-2" />
              <span class="tw-font-bold tw-text-lg">{{ $t('common.kiku') }}</span>
            </div>
            <div class="tw-bg-[#0099DD] tw-aspect-square tw-rounded-2xl tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-white tw-shadow-sm tw-cursor-pointer" @click="showComingSoon($t('common.iku'))">
              <Footprints class="tw-w-14 tw-h-14 tw-mb-2" />
              <span class="tw-font-bold tw-text-lg">{{ $t('common.iku') }}</span>
            </div>
          </div>

          <div class="tw-hidden md:tw-block tw-space-y-4">
            <h2 class="tw-text-xl tw-font-bold tw-text-gray-700">{{ $t('dashboard.current_area') }}</h2>
            <div class="tw-flex tw-bg-[#2C3E50] tw-rounded-3xl tw-overflow-hidden tw-h-64 tw-shadow-lg">
              <div class="tw-w-[42%] tw-p-6 tw-text-white tw-flex tw-flex-col tw-justify-between">
                <div>
                  <div class="tw-flex tw-items-center tw-gap-2 tw-mb-1">
                    <MapPin class="tw-w-6 tw-h-6" />
                    <span class="tw-text-xl tw-font-bold">{{ weather.area }}</span>
                  </div>
                  <div class="tw-text-lg">{{ formattedDate }}</div>
                </div>
                <div class="tw-flex tw-items-end tw-gap-4">
                  <component :is="weatherIcon" class="tw-w-12 tw-h-12 tw-text-yellow-400" />
                  <span class="tw-text-6xl tw-font-light leading-none">{{ weather.temp }}{{ $t('common.degree') }}</span>
                </div>
              </div>
              <div class="tw-w-[58%] tw-relative tw-bg-gray-100">
                <div ref="mapContainerPC" class="tw-w-full tw-h-full"></div>
              </div>
            </div>
          </div>

          <!-- モバイル: おたすけボタン + Update を横並び -->
          <div class="md:tw-hidden tw-flex tw-gap-3">
            <NuxtLink :to="localePath('/trouble')" class="tw-flex tw-items-center tw-gap-3 tw-bg-white tw-rounded-2xl tw-p-3 tw-shadow-sm tw-border-2 tw-border-[#E4007F] active:tw-scale-95 tw-transition-transform tw-flex-shrink-0">
              <div class="tw-bg-[#E4007F] tw-text-white tw-w-10 tw-h-10 tw-rounded-full tw-flex tw-items-center tw-justify-center">
                <span class="tw-font-black tw-text-xl">!</span>
              </div>
              <div>
                <div class="tw-text-[#E4007F] tw-font-black tw-text-xs tw-uppercase">In Trouble</div>
                <div class="tw-text-gray-500 tw-text-[10px] tw-font-bold">{{ $t('common.trouble') }}</div>
              </div>
            </NuxtLink>
            <div class="tw-flex-1 tw-bg-[#2C3E50] tw-rounded-2xl tw-p-3 tw-text-white tw-shadow-sm tw-min-w-0">
              <div class="tw-flex tw-items-center tw-gap-1 tw-text-[#E4007F] tw-mb-1 tw-font-bold tw-text-xs">
                <ArrowUp class="tw-w-3 tw-h-3" /> Update
              </div>
              <ul v-if="latestThreads.length > 0" class="tw-space-y-1">
                <li v-for="thread in latestThreads.slice(0, 3)" :key="thread.id" class="tw-truncate tw-cursor-pointer hover:tw-opacity-80 tw-text-[11px]" @click="navigateTo(localePath(`/shiru/category/${thread.categoryId}/thread/${thread.id}`))">
                  {{ thread.title }}
                </li>
              </ul>
              <p v-else class="tw-text-[11px] tw-opacity-60">{{ $t('common.no_updates') }}</p>
            </div>
          </div>

          <!-- PC: 従来の3カラムレイアウト -->
          <div class="tw-hidden md:tw-grid tw-grid-cols-10 tw-gap-4">
            <div class="tw-col-span-4 tw-bg-[#2C3E50] tw-rounded-3xl tw-p-6 tw-text-white tw-shadow-lg">
              <div class="tw-flex tw-items-center tw-gap-2 tw-text-[#E4007F] tw-mb-3 tw-font-bold">
                <ArrowUp class="tw-w-5 tw-h-5" /> Update
              </div>
              <ul v-if="latestThreads.length > 0" class="tw-space-y-2 tw-text-sm">
                <li v-for="thread in latestThreads" :key="thread.id" class="tw-truncate tw-cursor-pointer hover:tw-opacity-80" @click="navigateTo(localePath(`/shiru/category/${thread.categoryId}/thread/${thread.id}`))">
                  {{ thread.title }} <span class="tw-text-[10px] tw-opacity-60">[{{ $t('common.posts_count', { n: thread.postCount }) }}]</span>
                </li>
              </ul>
              <p v-else class="tw-text-sm tw-opacity-60">{{ $t('common.no_updates') }}</p>
            </div>
            <div class="tw-col-span-3 tw-bg-[#008080] tw-rounded-3xl tw-p-6 tw-text-white tw-shadow-lg">
              <div class="tw-font-bold tw-mb-1 tw-text-lg">{{ $t('dashboard.today_event') }}</div>
              <p class="tw-text-[11px] tw-leading-relaxed">{{ todayEvent }}</p>
            </div>
            <div class="tw-col-span-3 tw-flex tw-flex-col tw-items-center tw-justify-center">
              <NuxtLink :to="localePath('/trouble')" class="tw-relative tw-w-28 tw-h-28 tw-rounded-full tw-bg-white tw-border-[6px] tw-border-[#E4007F] tw-flex tw-flex-col tw-items-center tw-justify-center tw-shadow-xl active:tw-scale-95 tw-transition-transform">
                <div class="tw-bg-[#E4007F] tw-text-white tw-w-10 tw-h-10 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mb-1">
                  <span class="tw-font-black tw-text-2xl">!</span>
                </div>
                <div class="tw-text-[#E4007F] tw-font-black tw-text-[10px] tw-leading-tight tw-text-center uppercase">In<br>Trouble</div>
              </NuxtLink>
              <span class="tw-text-sm tw-mt-2 tw-font-bold tw-text-gray-600">{{ $t('common.trouble') }}</span>
            </div>
          </div>
        </div>

        <div class="tw-col-span-1 md:tw-col-span-5 tw-flex tw-flex-col tw-gap-6">
          
          <div class="tw-bg-[#EBECEF] tw-bg-opacity-80 tw-rounded-3xl tw-p-6 tw-shadow-sm">
            <h3 class="tw-text-xs tw-font-bold tw-text-gray-400 tw-uppercase tw-mb-4 tracking-widest">{{ $t('dashboard.personal') }}</h3>
            <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-4">
              <div class="tw-col-span-12 tw-bg-[#D9A65D] tw-rounded-2xl tw-p-4 tw-text-white shadow-sm">
                <div class="tw-flex tw-items-start tw-gap-3 tw-mb-3">
                  <div class="tw-text-6xl tw-font-bold leading-none">{{ todayDay }}</div>
                  <div class="tw-text-[10px] tw-space-y-1">
                    <div v-if="latestThreads.length > 0">● {{ latestThreads[0].title }}</div>
                    <div v-else>● {{ $t('dashboard.no_events_today') }}</div>
                    <div>● {{ todayEvent }}</div>
                  </div>
                </div>
                <div class="tw-grid tw-grid-cols-7 tw-text-center tw-text-[10px] tw-gap-y-1">
                  <span v-for="d in ['S','M','T','W','T','F','S']" :key="d" class="tw-opacity-60">{{ d }}</span>
                  <div v-for="n in 31" :key="n" :class="[n === todayDay ? 'tw-bg-[#2C3E50] tw-rounded-full tw-font-bold' : '']">{{ n }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-4">
            <div class="tw-flex-1 tw-relative tw-rounded-3xl tw-overflow-hidden tw-shadow-lg tw-h-52">
              <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800" class="tw-w-full tw-h-full tw-object-cover" />
            </div>
            <div class="tw-w-full md:tw-w-24 tw-flex tw-flex-row md:tw-flex-col tw-gap-3">
              <NuxtLink :to="localePath('/disaster-prevention')" class="tw-flex-1 tw-bg-[#BCAF92] tw-rounded-2xl tw-p-3 tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-white tw-shadow-md tw-cursor-pointer hover:tw-opacity-90 tw-transition-opacity">
                <MapIcon class="tw-w-10 tw-h-10" />
                <span class="tw-text-[9px] tw-font-bold tw-mt-1">{{ $t('dashboard.disaster_map') }}</span>
              </NuxtLink>
              <div class="tw-flex-1 tw-bg-[#D9A65D] tw-rounded-2xl tw-p-3 tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-white tw-shadow-md">
                <div class="tw-grid tw-grid-cols-2 tw-gap-3">
                  <a v-for="sns in snsLinks" :key="sns.label" :href="sns.url" target="_blank" rel="noopener noreferrer" class="tw-p-1.5 tw-rounded-lg hover:tw-bg-white/20 tw-transition-all">
                    <component :is="sns.icon" class="tw-w-5 tw-h-5" />
                  </a>
                </div>
                <span class="tw-text-[9px] tw-font-bold tw-mt-1.5">{{ $t('dashboard.sns') }}</span>
              </div>
            </div>
          </div>

          <div class="tw-bg-white tw-rounded-[2rem] tw-p-5 tw-shadow-sm">
            <div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-4">
              <div class="tw-flex-1 tw-flex tw-flex-col tw-justify-center">
                <span class="tw-text-[10px] tw-text-gray-400 tw-font-bold tw-mb-3 uppercase">{{ $t('dashboard.what_doing') }}</span>
                <div class="tw-flex tw-items-center">
                  <div class="tw-flex -tw-space-x-3 tw-flex-shrink-0">
                    <img src="https://i.pravatar.cc/100?u=1" class="tw-w-12 tw-h-12 tw-rounded-full tw-border-4 tw-border-white" />
                    <img src="https://i.pravatar.cc/100?u=2" class="tw-w-12 tw-h-12 tw-rounded-full tw-border-4 tw-border-white" />
                    <img src="https://i.pravatar.cc/100?u=3" class="tw-w-12 tw-h-12 tw-rounded-full tw-border-4 tw-border-white" />
                  </div>
                  <div class="tw-ml-3 tw-text-[11px] tw-text-gray-500 tw-font-bold">
                    Alex, Jhon...
                  </div>
                </div>
              </div>
              <div class="tw-flex tw-items-center tw-gap-4 md:tw-border-l md:tw-border-gray-100 md:tw-pl-4">
                <div class="tw-text-center tw-cursor-pointer tw-relative" @click="navigateTo(localePath('/animation'))">
                  <div class="tw-bg-[#2C3E50] tw-text-white tw-w-10 tw-h-10 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-text-xl tw-font-black active:tw-scale-95 tw-transition-transform">G</div>
                  <span class="tw-text-[9px] tw-text-gray-400 tw-font-bold">{{ $t('dashboard.gallery') }}</span>
                </div>
                <div class="tw-text-center tw-cursor-pointer tw-relative" @click="showComingSoon($t('dashboard.quiz'))">
                  <div class="tw-bg-[#2C3E50] tw-text-white tw-w-10 tw-h-10 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-text-xl tw-font-black active:tw-scale-95 tw-transition-transform">Q</div>
                  <span class="tw-text-[9px] tw-text-gray-400 tw-font-bold">{{ $t('dashboard.quiz') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <AuthModal :is-open="isLoginModalOpen" @close="isLoginModalOpen = false" />

    <Transition name="toast">
      <div v-if="comingSoonMessage" class="tw-fixed tw-bottom-24 tw-left-1/2 tw-transform -tw-translate-x-1/2 tw-bg-[#2C3E50] tw-text-white tw-px-6 tw-py-3 tw-rounded-full tw-shadow-lg tw-text-sm tw-font-bold tw-z-50 tw-whitespace-nowrap">
        {{ $t('common.coming_soon', { name: comingSoonMessage }) }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import {
  Search, X, Home, UserCircle, MapPin, CloudSun, Cloud, Sun, CloudRain, CloudSnow, Lightbulb,
  Binoculars, Ear, Footprints,
  ArrowUp, ChevronLeft,
  Map as MapIcon, Facebook, Youtube, Instagram, Twitter
} from 'lucide-vue-next'
import { onMounted, onUnmounted, ref, reactive, computed } from 'vue'

const { t, locale } = useI18n();
const { user, initAuth, userDisplayName, userPhotoURL } = useAuth();
const { openDrawer } = useDrawer();
const { threads: latestThreads, allThreads: allThreadsForSearch, subscribeToLatestThreads } = useFirestore();
const localePath = useLocalePath();

const isLoginModalOpen = ref(false);

// --- PWA Install Prompt ---
let deferredPrompt: BeforeInstallPromptEvent | null = null;
if (process.client) {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
  });
}

const handleInstall = async () => {
  if (deferredPrompt) {
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  } else {
    showComingSoon(t('dashboard.app_download'));
  }
};


// --- SNS Links ---
const snsLinks: SnsLink[] = [
  { icon: Facebook, label: 'Facebook', url: 'https://www.facebook.com/' },
  { icon: Twitter, label: 'Twitter', url: 'https://x.com/' },
  { icon: Youtube, label: 'YouTube', url: 'https://www.youtube.com/' },
  { icon: Instagram, label: 'Instagram', url: 'https://www.instagram.com/' },
]

// --- Coming Soon Toast ---
const comingSoonMessage = ref('');
let comingSoonTimer: ReturnType<typeof setTimeout> | null = null;
const showComingSoon = (name: string) => {
  comingSoonMessage.value = name;
  if (comingSoonTimer) clearTimeout(comingSoonTimer);
  comingSoonTimer = setTimeout(() => { comingSoonMessage.value = ''; }, 2000);
};

// --- Weather ---
const weather = reactive({
  temp: '--',
  area: 'Loading...',
  condition: 'cloudy' as 'clear' | 'cloudy' | 'rain' | 'snow'
});

const weatherIcon = computed(() => {
  switch (weather.condition) {
    case 'clear': return Sun;
    case 'rain': return CloudRain;
    case 'snow': return CloudSnow;
    default: return CloudSun;
  }
});

const fetchWeather = async (lat: number, lng: number) => {
  try {
    const config = useRuntimeConfig();
    const apiKey = config.public.openWeatherApiKey;
    if (!apiKey) {
      weather.area = 'Tokyo / Shinjuku';
      weather.temp = '25';
      return;
    }
    const data = await $fetch<WeatherResponse>(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&lang=${locale.value}&appid=${apiKey}`
    );
    weather.temp = Math.round(data.main.temp).toString();
    weather.area = data.name || 'Unknown';
    const mainWeather = data.weather?.[0]?.main?.toLowerCase() || '';
    if (mainWeather.includes('clear')) weather.condition = 'clear';
    else if (mainWeather.includes('rain') || mainWeather.includes('drizzle')) weather.condition = 'rain';
    else if (mainWeather.includes('snow')) weather.condition = 'snow';
    else weather.condition = 'cloudy';
  } catch (e) {
    console.error('Weather fetch failed:', e);
    weather.area = 'Tokyo / Shinjuku';
    weather.temp = '25';
  }
};

// --- Today's Event (今日は何の日) ---
const todayEventKeys: Record<string, string> = {
  '1-1': 'events.jan1', '1-7': 'events.jan7', '2-3': 'events.feb3',
  '2-11': 'events.feb11', '2-14': 'events.feb14', '3-3': 'events.mar3',
  '3-14': 'events.mar14', '3-21': 'events.mar21', '4-29': 'events.apr29',
  '5-3': 'events.may3', '5-5': 'events.may5', '6-21': 'events.jun21',
  '7-7': 'events.jul7', '7-17': 'events.jul17', '8-11': 'events.aug11',
  '8-15': 'events.aug15', '9-15': 'events.sep15', '9-23': 'events.sep23',
  '10-31': 'events.oct31', '11-3': 'events.nov3', '11-15': 'events.nov15',
  '11-23': 'events.nov23', '12-22': 'events.dec22', '12-25': 'events.dec25',
  '12-31': 'events.dec31',
};

const todayEvent = computed(() => {
  const key = `${now.getMonth() + 1}-${now.getDate()}`;
  const i18nKey = todayEventKeys[key];
  return i18nKey ? t(i18nKey) : t('dashboard.default_event', { month: now.getMonth() + 1, day: now.getDate() });
});

// --- Search ---
const searchQuery = ref('');
const searchResults = ref<Thread[]>([]);
let searchDebounce: ReturnType<typeof setTimeout> | null = null;

const onSearch = () => {
  if (searchDebounce) clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) { searchResults.value = []; return; }
    searchResults.value = allThreadsForSearch.value.filter(t =>
      t.title.toLowerCase().includes(q)
    ).slice(0, 10);
  }, 300);
};

// --- Firestore Unsubscribers ---
let unsubLatest: (() => void) | null = null;

// --- Google Maps Logic ---
const MAP_ID = '880da9152ccc05531e5c5014'; 
const { load } = useMapsLoader();
const mapContainerPC = ref<HTMLElement | null>(null);
let mapInstance: google.maps.Map | null = null;
let userOverlay: PulseOverlayInstance | null = null;
let watchId: number | null = null;
let googleMaps: typeof google.maps | null = null;

const createPulseOverlayClass = (gMaps: typeof google.maps) => {
  return class PulseOverlay extends gMaps.OverlayView {
    div: HTMLElement | null = null;
    position: google.maps.LatLng | null = null;
    constructor(map: google.maps.Map) { super(); this.setMap(map); }
    override onAdd() {
      const div = document.createElement('div');
      div.className = 'user-location-pulse';
      div.innerHTML = `<div class="pulse-ring"></div><div class="pulse-core"></div>`;
      this.div = div;
      const panes = this.getPanes();
      if (panes) panes.overlayMouseTarget.appendChild(div);
    }
    override draw() {
      if (!this.div || !this.position) return;
      const projection = this.getProjection();
      if (!projection) return;
      const point = projection.fromLatLngToDivPixel(this.position);
      if (point) { this.div.style.left = point.x + 'px'; this.div.style.top = point.y + 'px'; }
    }
    override onRemove() { if (this.div) { this.div.parentNode?.removeChild(this.div); this.div = null; } }
    setPosition(latlng: google.maps.LatLng) { this.position = latlng; this.draw(); }
  };
};

const initGoogleMap = async () => {
  try {
    await load();
    googleMaps = google.maps;
    if (mapContainerPC.value && googleMaps) {
      mapInstance = new googleMaps.Map(mapContainerPC.value, {
        center: { lat: 35.6895, lng: 139.6917 },
        zoom: 16,
        mapId: MAP_ID,
        disableDefaultUI: true,
        gestureHandling: "none",
        zoomControl: false,
        scrollwheel: false,
      });
      const PulseOverlayClass = createPulseOverlayClass(googleMaps);
      userOverlay = new PulseOverlayClass(mapInstance);
      startTracking();
    }
  } catch (e) { console.error('Map failed', e); }
}

const startTracking = () => {
  if (navigator.geolocation && googleMaps) {
    watchId = navigator.geolocation.watchPosition((position) => {
      if (!googleMaps) return;
      const pos = new googleMaps.LatLng(position.coords.latitude, position.coords.longitude);
      if (userOverlay) userOverlay.setPosition(pos);
      if (mapInstance) mapInstance.panTo(pos);
    }, null, { enableHighAccuracy: true });
  }
};

const now = new Date();
const todayDay = now.getDate();
const localeMap: Record<string, string> = { ja: 'ja-JP', en: 'en-US', zh: 'zh-CN' };
const formattedDate = computed(() => {
  const loc = localeMap[locale.value] || locale.value;
  return now.toLocaleDateString(loc, { month: 'numeric', day: 'numeric', weekday: 'short' }).toLowerCase();
});

const route = useRoute();
const router = useRouter();

onMounted(() => {
  initAuth();
  initGoogleMap();

  // Coming Soon リダイレクトからのトースト表示
  const comingSoonPage = route.query.coming_soon as string | undefined;
  if (comingSoonPage) {
    const nameKey = `common.${comingSoonPage}` as const;
    showComingSoon(t(nameKey));
    router.replace({ query: {} });
  }

  // Firestore: 最新スレッド購読 (更新フィード + 検索用)
  unsubLatest = subscribeToLatestThreads(5);

  // 天気: ユーザー位置で取得
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => fetchWeather(35.6895, 139.6917)
    );
  } else {
    fetchWeather(35.6895, 139.6917);
  }
});

onUnmounted(() => {
  if (watchId !== null) navigator.geolocation.clearWatch(watchId);
  if (userOverlay) userOverlay.setMap(null);
  if (unsubLatest) unsubLatest();
});
</script>

<style>
/* Global styles for Map Pulse (Must be non-scoped) */
.user-location-pulse { position: absolute; pointer-events: none; width: 0; height: 0; overflow: visible; z-index: 1000; }
.pulse-core { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 16px; height: 16px; background-color: #E4007F; border: 3px solid #FFFFFF; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3); z-index: 2; }
.pulse-ring { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 20px; height: 20px; border-radius: 50%; background-color: rgba(228, 0, 127, 0.4); animation: pulse-animation 2s infinite ease-out; z-index: 1; }
@keyframes pulse-animation { 0% { width: 20px; height: 20px; opacity: 0.8; } 100% { width: 80px; height: 80px; opacity: 0; } }
.toast-enter-active { transition: all 0.3s ease; }
.toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 20px); }
</style>