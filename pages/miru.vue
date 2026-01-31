<template>
  <div class="tw-relative tw-h-screen tw-w-full tw-overflow-hidden tw-bg-slate-300">
    <div class="tw-absolute tw-inset-0">
      <div v-for="pin in filteredPins" :key="pin.id" 
           class="tw-absolute tw-cursor-pointer tw-transition-transform hover:tw-scale-110"
           :style="{ top: pin.y + '%', left: pin.x + '%' }"
           @click="selectPin(pin)">
        <div :class="[
          'tw-p-2 tw-rounded-full tw-shadow-lg tw-border-2 tw-border-white',
          pin.type === 'shelter' ? 'tw-bg-ru-trouble' : 'tw-bg-ru-miru'
        ]">
          <component :is="getIcon(pin.type)" class="tw-w-5 tw-h-5 tw-text-white" />
        </div>
      </div>
    </div>

    <div class="tw-absolute tw-top-4 tw-inset-x-4 tw-z-10 tw-max-w-md tw-mx-auto">
      <div class="tw-bg-white/90 tw-backdrop-blur-md tw-rounded-2xl tw-shadow-xl tw-p-2 tw-flex tw-items-center">
        <button class="tw-p-2 tw-text-gray-500">
          <Search class="tw-w-5 tw-h-5" />
        </button>
        <input type="text" :placeholder="$t('miru.title')" 
               class="tw-flex-1 tw-bg-transparent tw-border-none focus:tw-ring-0 tw-text-sm" />
        <button class="tw-p-2 tw-text-ru-miru">
          <Navigation class="tw-w-5 tw-h-5" />
        </button>
      </div>
    </div>

    <div class="tw-absolute tw-top-20 tw-inset-x-0 tw-z-10 tw-flex tw-gap-2 tw-px-4 tw-overflow-x-auto tw-scrollbar-hide">
      <button v-for="filter in filters" :key="filter.id"
              @click="toggleFilter(filter.id)"
              :class="[
                'tw-px-4 tw-py-2 tw-rounded-full tw-text-xs tw-font-bold tw-flex tw-items-center tw-whitespace-nowrap tw-transition-all tw-shadow-md',
                activeFilter === filter.id 
                  ? (filter.id === 'shelter' ? 'tw-bg-ru-trouble tw-text-white' : 'tw-bg-ru-miru tw-text-white')
                  : 'tw-bg-white tw-text-gray-600'
              ]">
        <component :is="filter.icon" class="tw-w-4 tw-h-4 tw-mr-1.5" />
        {{ $t(`miru.filter_${filter.id}`) }}
      </button>
    </div>

    <Transition name="slide-up">
      <div v-if="selectedSpot" 
           class="tw-absolute tw-bottom-0 tw-inset-x-0 lg:tw-bottom-auto lg:tw-top-32 lg:tw-left-4 lg:tw-w-80 tw-z-20">
        <div :class="[
          'tw-bg-white tw-rounded-t-3xl lg:tw-rounded-3xl tw-shadow-2xl tw-overflow-hidden tw-transition-colors tw-duration-500',
          selectedSpot.type === 'shelter' ? 'tw-border-t-8 tw-border-ru-trouble' : ''
        ]">
          <div class="lg:tw-hidden tw-w-12 tw-h-1.5 tw-bg-gray-200 tw-rounded-full tw-mx-auto tw-my-3"></div>
          
          <div class="tw-p-6">
            <div class="tw-flex tw-justify-between tw-items-start tw-mb-2">
              <h2 class="tw-text-xl tw-font-bold tw-text-gray-900">{{ selectedSpot.name }}</h2>
              <button @click="selectedSpot = null" class="tw-text-gray-400">
                <X class="tw-w-5 tw-h-5" />
              </button>
            </div>
            
            <p class="tw-text-sm tw-text-gray-500 tw-mb-4">{{ selectedSpot.address }}</p>
            
            <div class="tw-flex tw-gap-4 tw-mb-6">
              <div class="tw-flex tw-items-center tw-text-xs tw-text-gray-600">
                <MapPin class="tw-w-4 tw-h-4 tw-mr-1 tw-text-ru-miru" />
                {{ $t('miru.distance', { n: selectedSpot.distance }) }}
              </div>
              <div v-if="selectedSpot.type === 'shelter'" class="tw-flex tw-items-center tw-text-xs tw-text-ru-trouble tw-font-bold">
                <ShieldCheck class="tw-w-4 tw-h-4 tw-mr-1" />
                {{ $t('miru.status_safe') }}
              </div>
            </div>

            <button :class="[
              'tw-w-full tw-py-3 tw-rounded-xl tw-text-white tw-font-bold tw-flex tw-items-center tw-justify-center tw-transition-colors',
              selectedSpot.type === 'shelter' ? 'tw-bg-ru-trouble' : 'tw-bg-ru-miru'
            ]">
              <ExternalLink class="tw-w-4 tw-h-4 tw-mr-2" />
              {{ $t('shiru.read_more') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { 
  Search, Navigation, MapPin, X, Landmark, 
  ShieldAlert, Wifi, Pill, ExternalLink, ShieldCheck 
} from 'lucide-vue-next';

// ---------------------------------------------------------
// Logic & State
// ---------------------------------------------------------

const { t } = useI18n();
const localePath = useLocalePath();

const activeFilter = ref('sightseeing');
const selectedSpot = ref<any>(null);

const filters = [
  { id: 'sightseeing', icon: Landmark },
  { id: 'shelter', icon: ShieldAlert },
  { id: 'wifi', icon: Wifi },
  { id: 'restroom', icon: Pill }
];

// Mock Map Pins
const allPins = ref([
  { id: 1, type: 'sightseeing', name: 'Kawagoe Toki no Kane', address: 'Kura-no-machi, Kawagoe', distance: 150, x: 45, y: 40 },
  { id: 2, type: 'shelter', name: 'Kawagoe Elementary School', address: 'Emergency Shelter A-1', distance: 450, x: 60, y: 30 },
  { id: 3, type: 'wifi', name: 'Town Free Wi-Fi 01', address: 'Main Street Crossing', distance: 50, x: 30, y: 55 },
  { id: 4, type: 'restroom', name: 'Public Restroom (Barrier-Free)', address: 'Central Park Entrance', distance: 300, x: 20, y: 35 },
  { id: 5, type: 'sightseeing', name: 'Kashiya Yokocho', address: 'Penny Candy Lane', distance: 600, x: 70, y: 65 },
]);

// ---------------------------------------------------------
// Computed & Functions
// ---------------------------------------------------------

const filteredPins = computed(() => {
  return allPins.value.filter(pin => pin.type === activeFilter.value);
});

const toggleFilter = (id: string) => {
  activeFilter.value = id;
  selectedSpot.value = null; // フィルタ切り替え時に選択を解除
};

const selectPin = (pin: any) => {
  selectedSpot.value = pin;
};

const getIcon = (type: string) => {
  switch(type) {
    case 'sightseeing': return Landmark;
    case 'shelter': return ShieldAlert;
    case 'wifi': return Wifi;
    case 'restroom': return Pill;
    default: return MapPin;
  }
};

// ---------------------------------------------------------
// Meta
// ---------------------------------------------------------

useHead(() => ({
  title: t('miru.title'),
}));
</script>

<style scoped>
.tw-scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.tw-scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Transition for Spot Detail */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (min-width: 1024px) {
  .slide-up-enter-from,
  .slide-up-leave-to {
    transform: translateX(-100%);
    opacity: 0;
  }
}
</style>