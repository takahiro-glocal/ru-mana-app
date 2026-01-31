<template>
  <div class="tw-min-h-screen tw-bg-ru-bg tw-pb-24">
    <section v-if="featuredEvent" class="tw-relative tw-w-full tw-h-[60vh] tw-overflow-hidden">
      <div class="tw-absolute tw-inset-0 tw-bg-gray-300">
        <div class="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center">
          <Image class="tw-w-16 tw-h-16 tw-text-gray-400" />
        </div>
      </div>
      <div class="tw-absolute tw-inset-0 tw-bg-gradient-to-t tw-from-black/80 tw-to-transparent"></div>
      
      <div class="tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-p-6 lg:tw-p-12 tw-max-w-7xl tw-mx-auto">
        <span class="tw-inline-block tw-bg-ru-iku tw-text-white tw-text-[10px] tw-font-bold tw-px-3 tw-py-1 tw-rounded-full tw-mb-4 tw-uppercase tw-tracking-widest">
          {{ $t('iku.category_workshop') }}
        </span>
        <h2 class="tw-text-3xl lg:tw-text-5xl tw-font-bold tw-text-white tw-mb-4">
          {{ featuredEvent.title }}
        </h2>
        <div class="tw-flex tw-flex-wrap tw-gap-6 tw-text-white/90 tw-text-sm tw-mb-6">
          <div class="tw-flex tw-items-center"><Calendar class="tw-w-4 tw-h-4 tw-mr-2" /> {{ featuredEvent.date }}</div>
          <div class="tw-flex tw-items-center"><MapPin class="tw-w-4 tw-h-4 tw-mr-2" /> {{ featuredEvent.location }}</div>
          <div class="tw-flex tw-items-center tw-font-bold tw-text-ru-iku">
            {{ $t('iku.price_label', { price: featuredEvent.price }) }}
          </div>
        </div>
        <button 
          @click="toggleReserve(featuredEvent.id)"
          :class="[
            'tw-px-8 tw-py-3 tw-rounded-full tw-font-bold tw-transition-all tw-duration-300',
            featuredEvent.isReserved ? 'tw-bg-gray-500 tw-text-white' : 'tw-bg-white tw-text-black hover:tw-bg-ru-iku hover:tw-text-white'
          ]"
        >
          {{ featuredEvent.isReserved ? 'Reserved' : $t('iku.hero_book_now') }}
        </button>
      </div>
    </section>

    <main class="tw-max-w-7xl tw-mx-auto tw-px-4 tw-mt-8">
      <header class="tw-mb-10">
        <h1 class="tw-text-2xl tw-font-bold tw-text-gray-800 tw-mb-6">{{ $t('iku.title') }}</h1>
        
        <div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-4">
          <div class="tw-relative tw-flex-shrink-0">
            <button class="tw-flex tw-items-center tw-bg-white tw-px-4 tw-py-2 tw-rounded-xl tw-border tw-border-gray-100 tw-text-sm tw-text-gray-600">
              <CalendarDays class="tw-w-4 tw-h-4 tw-mr-2 tw-text-ru-iku" />
              {{ $t('iku.filter_date') }}
            </button>
          </div>
          
          <div class="tw-flex tw-gap-2 tw-overflow-x-auto tw-scrollbar-hide">
            <button 
              v-for="cat in categories" :key="cat"
              @click="selectedCategory = cat"
              :class="[
                'tw-px-4 tw-py-2 tw-rounded-full tw-text-xs tw-font-bold tw-whitespace-nowrap tw-transition-all',
                selectedCategory === cat ? 'tw-bg-ru-iku tw-text-white' : 'tw-bg-white tw-text-gray-500 tw-border tw-border-gray-50'
              ]"
            >
              {{ cat.toUpperCase() }}
            </button>
          </div>
        </div>
      </header>

      <section class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-8">
        <article 
          v-for="event in filteredEvents" :key="event.id"
          class="tw-group tw-bg-white tw-rounded-3xl tw-overflow-hidden tw-shadow-sm hover:tw-shadow-xl tw-transition-all tw-duration-500"
        >
          <div class="tw-relative tw-aspect-[16/10] tw-bg-gray-200">
            <div class="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center">
              <component :is="event.icon" class="tw-w-10 tw-h-10 tw-text-gray-300" />
            </div>
            <div v-if="event.spotsLeft < 5" class="tw-absolute tw-top-4 tw-right-4">
              <span class="tw-bg-red-500 tw-text-white tw-text-[10px] tw-font-bold tw-px-2 tw-py-1 tw-rounded-md tw-animate-pulse">
                {{ $t('iku.spots_left', { n: event.spotsLeft }) }}
              </span>
            </div>
          </div>

          <div class="tw-p-6">
            <div class="tw-flex tw-justify-between tw-items-start tw-mb-2">
              <span class="tw-text-[10px] tw-font-bold tw-text-ru-iku tw-uppercase">{{ event.category }}</span>
              <div class="tw-flex tw-items-center tw-text-yellow-400">
                <Star class="tw-w-3 tw-h-3 tw-fill-current" />
                <span class="tw-text-[10px] tw-text-gray-500 tw-ml-1">{{ event.rating }}</span>
              </div>
            </div>
            
            <h3 class="tw-text-lg tw-font-bold tw-text-gray-900 tw-mb-2 group-hover:tw-text-ru-iku tw-transition-colors">
              {{ event.title }}
            </h3>
            
            <p class="tw-flex tw-items-center tw-text-xs tw-text-gray-500 tw-mb-4">
              <MapPin class="tw-w-3 tw-h-3 tw-mr-1" /> {{ event.location }}
            </p>

            <div class="tw-flex tw-items-center tw-justify-between tw-mt-auto tw-pt-4 tw-border-t tw-border-gray-50">
              <span class="tw-font-bold tw-text-gray-900">
                {{ $t('iku.price_label', { price: event.price }) }}
              </span>
              <button 
                @click="toggleReserve(event.id)"
                :class="[
                  'tw-px-4 tw-py-2 tw-rounded-xl tw-text-xs tw-font-bold tw-transition-all',
                  event.isReserved ? 'tw-bg-gray-100 tw-text-gray-400' : 'tw-bg-ru-iku tw-text-white hover:tw-bg-blue-600'
                ]"
              >
                {{ event.isReserved ? 'Reserved' : 'Book' }}
              </button>
            </div>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { 
  Image, 
  Calendar, 
  CalendarDays, 
  MapPin, 
  Star, 
  Utensils, 
  Camera, 
  Flame,
  Palette
} from 'lucide-vue-next';

// ---------------------------------------------------------
// Logic & State
// ---------------------------------------------------------

const { t } = useI18n();
const localePath = useLocalePath();

const selectedCategory = ref('all');
const categories = ['all', 'workshop', 'festival', 'food', 'culture'];

// Mock Events Data
const events = ref([
  {
    id: 1,
    title: 'Traditional Kimono Fitting in Old Town',
    category: 'workshop',
    date: '2024.10.15',
    location: 'Kawagoe Kura-machi',
    price: 5500,
    rating: 4.9,
    spotsLeft: 2,
    icon: Palette,
    isReserved: false,
    featured: true
  },
  {
    id: 2,
    title: 'Zen Meditation & Green Tea',
    category: 'culture',
    date: 'Daily',
    location: 'Kita-in Temple',
    price: 3000,
    rating: 4.8,
    spotsLeft: 8,
    icon: Flame,
    isReserved: false
  },
  {
    id: 3,
    title: 'Local Sake Tasting Tour',
    category: 'food',
    date: 'Weekends',
    location: 'Kawagoe Brewery',
    price: 4500,
    rating: 4.7,
    spotsLeft: 3,
    icon: Utensils,
    isReserved: false
  },
  {
    id: 4,
    title: 'Street Photography Workshop',
    category: 'workshop',
    date: '2024.10.20',
    location: 'Time Bell Tower Area',
    price: 8000,
    rating: 5.0,
    spotsLeft: 5,
    icon: Camera,
    isReserved: false
  }
]);

// ---------------------------------------------------------
// Computed & Functions
// ---------------------------------------------------------

const featuredEvent = computed(() => events.value.find(e => e.featured));

const filteredEvents = computed(() => {
  const others = events.value.filter(e => !e.featured);
  if (selectedCategory.value === 'all') return others;
  return others.filter(e => e.category === selectedCategory.value);
});

const toggleReserve = (id: number) => {
  const event = events.value.find(e => e.id === id);
  if (event) {
    event.isReserved = !event.isReserved;
    // 簡易シミュレーション: 予約時に残り枠を減らす
    if (event.isReserved) event.spotsLeft--;
    else event.spotsLeft++;
  }
};

// ---------------------------------------------------------
// Meta
// ---------------------------------------------------------

useHead(() => ({
  title: t('iku.title')
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
</style>