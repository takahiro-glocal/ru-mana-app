<template>
  <div class="tw-min-h-screen tw-bg-gray-50 tw-pb-24">
    <header class="tw-bg-ru-trouble tw-text-white tw-pt-8 tw-pb-12 tw-px-6 tw-rounded-b-[3rem] tw-shadow-lg">
      <div class="tw-max-w-2xl tw-mx-auto">
        <div class="tw-flex tw-items-center tw-mb-4">
          <AlertTriangle class="tw-w-8 tw-h-8 tw-mr-3 tw-animate-pulse" />
          <h1 class="tw-text-3xl tw-font-bold">{{ $t('trouble.title') }}</h1>
        </div>
        <p class="tw-text-white/90 tw-text-sm">{{ $t('trouble.emergency_subtitle') }}</p>
      </div>
    </header>

    <main class="tw-max-w-2xl tw-mx-auto tw-px-4 tw-mt-[-3rem]">
      <section class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-8">
        <button 
          @click="() => makeCall('110')"
          class="tw-bg-white tw-p-6 tw-rounded-3xl tw-shadow-xl tw-flex tw-flex-col tw-items-center tw-justify-center tw-border-2 tw-border-ru-trouble active:tw-scale-95 tw-transition-transform"
        >
          <div class="tw-bg-blue-600 tw-p-4 tw-rounded-full tw-mb-3">
            <ShieldAlert class="tw-w-8 tw-h-8 tw-text-white" />
          </div>
          <span class="tw-text-xs tw-text-gray-500 tw-font-bold tw-uppercase">Police</span>
          <span class="tw-text-2xl tw-font-black tw-text-blue-700">110</span>
        </button>

        <button 
          @click="() => makeCall('119')"
          class="tw-bg-white tw-p-6 tw-rounded-3xl tw-shadow-xl tw-flex tw-flex-col tw-items-center tw-justify-center tw-border-2 tw-border-ru-trouble active:tw-scale-95 tw-transition-transform"
        >
          <div class="tw-bg-red-600 tw-p-4 tw-rounded-full tw-mb-3">
            <Flame class="tw-w-8 tw-h-8 tw-text-white" />
          </div>
          <span class="tw-text-xs tw-text-gray-500 tw-font-bold tw-uppercase">Ambulance</span>
          <span class="tw-text-2xl tw-font-black tw-text-red-700">119</span>
        </button>
      </section>

      <section class="tw-bg-blue-50 tw-rounded-2xl tw-p-5 tw-mb-8 tw-border tw-border-blue-100">
        <div class="tw-flex tw-items-start">
          <MapPin class="tw-w-5 tw-h-5 tw-text-blue-600 tw-mr-3 tw-mt-1" />
          <div class="tw-flex-1">
            <h3 class="tw-text-xs tw-font-bold tw-text-blue-800 tw-uppercase tw-mb-1">
              {{ $t('trouble.current_location') }}
            </h3>
            <p class="tw-text-sm tw-font-bold tw-text-gray-800">
              {{ $t('trouble.location_placeholder') }}
            </p>
          </div>
          <button @click="() => copyLocation()" class="tw-ml-auto tw-p-2 tw-text-blue-600">
            <Copy class="tw-w-5 tw-h-5" />
          </button>
        </div>
      </section>

      <h3 class="tw-text-lg tw-font-bold tw-text-gray-800 tw-mb-4 tw-px-2">{{ $t('trouble.select_issue') }}</h3>
      <section class="tw-grid tw-grid-cols-1 tw-gap-4">
        <button 
          v-for="item in helpCategories" 
          :key="item.id"
          @click="() => openGuide(item)"
          class="tw-bg-white tw-p-5 tw-rounded-2xl tw-shadow-sm tw-flex tw-items-center tw-border tw-border-gray-100 hover:tw-border-ru-trouble tw-transition-colors"
        >
          <div :class="['tw-p-3 tw-rounded-xl tw-mr-4', item.colorClass]">
            <component :is="item.icon" class="tw-w-6 tw-h-6 tw-text-white" />
          </div>
          <div class="tw-text-left tw-flex-1">
            <h4 class="tw-font-bold tw-text-gray-800">{{ $t(`trouble.category_${item.id}`) }}</h4>
            <p class="tw-text-xs tw-text-gray-500">{{ $t(`trouble.desc_${item.id}`) }}</p>
          </div>
          <ChevronRight class="tw-w-5 tw-h-5 tw-text-gray-300" />
        </button>
      </section>

      <section class="tw-mt-10 tw-p-6 tw-bg-white tw-rounded-3xl tw-border tw-border-dashed tw-border-gray-300">
        <div class="tw-flex tw-items-center tw-mb-4">
          <Globe class="tw-w-5 tw-h-5 tw-text-gray-400 tw-mr-2" />
          <h3 class="tw-text-sm tw-font-bold tw-text-gray-600">{{ $t('trouble.support_hotline') }}</h3>
        </div>
        <div class="tw-space-y-4">
          <div @click="() => makeCall('03-5320-7744')" class="tw-flex tw-justify-between tw-items-center tw-cursor-pointer hover:tw-bg-gray-50 tw-p-2 tw-rounded-lg">
            <span class="tw-text-sm tw-text-gray-700">Himawari (Medical Info)</span>
            <span class="tw-text-sm tw-font-bold tw-text-blue-600">03-5320-7744</span>
          </div>
          <div @click="() => makeCall('0570-000-911')" class="tw-flex tw-justify-between tw-items-center tw-cursor-pointer hover:tw-bg-gray-50 tw-p-2 tw-rounded-lg">
            <span class="tw-text-sm tw-text-gray-700">Japan Visitor Hotline</span>
            <span class="tw-text-sm tw-font-bold tw-text-blue-600">0570-000-911</span>
          </div>
        </div>
      </section>
    </main>

    <Transition name="fade">
      <div v-if="selectedGuide" class="tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-end lg:tw-items-center tw-justify-center tw-p-4 tw-bg-black/60 tw-backdrop-blur-sm">
        <div class="tw-bg-white tw-w-full tw-max-w-lg tw-rounded-[2rem] tw-overflow-hidden tw-animate-slide-up">
          <div :class="['tw-p-6 tw-text-white', selectedGuide.colorClass]">
            <div class="tw-flex tw-justify-between tw-items-center">
              <h3 class="tw-text-xl tw-font-bold">{{ $t(`trouble.category_${selectedGuide.id}`) }}</h3>
              <button @click="() => selectedGuide = null" class="tw-p-1 hover:tw-bg-white/20 tw-rounded-full">
                <X class="tw-w-6 tw-h-6" />
              </button>
            </div>
          </div>
          <div class="tw-p-8 tw-max-h-[60vh] tw-overflow-y-auto">
            <ul class="tw-space-y-4">
              <li v-for="(step, index) in selectedGuide.steps" :key="index" class="tw-flex">
                <span class="tw-w-6 tw-h-6 tw-bg-gray-100 tw-text-gray-600 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-xs tw-font-bold tw-mr-3 tw-flex-shrink-0">
                  {{ index + 1 }}
                </span>
                <p class="tw-text-sm tw-text-gray-700">{{ step }}</p>
              </li>
            </ul>
            <button @click="() => selectedGuide = null" class="tw-w-full tw-mt-8 tw-py-4 tw-bg-gray-900 tw-text-white tw-rounded-2xl tw-font-bold">
              Got it
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { 
  AlertTriangle, ShieldAlert, Flame, MapPin, 
  ChevronRight, Globe, X, Stethoscope, 
  Search, Bomb, Copy
} from 'lucide-vue-next';

// ---------------------------------------------------------
// Types (In actual project, these should be in types/app.d.ts)
// ---------------------------------------------------------
interface HelpCategory {
  id: string;
  icon: any;
  colorClass: string;
  steps: string[];
}

// ---------------------------------------------------------
// Logic & State
// ---------------------------------------------------------

const { t } = useI18n();

const selectedGuide = ref<HelpCategory | null>(null);

const helpCategories: HelpCategory[] = [
  { 
    id: 'medical', 
    icon: Stethoscope, 
    colorClass: 'tw-bg-red-500',
    steps: [
      'Stay calm and check your surroundings for safety.',
      'If unconscious or bleeding heavily, call 119 immediately.',
      'Find the nearest AED if necessary.',
      'Prepare your passport and insurance information.'
    ]
  },
  { 
    id: 'lost', 
    icon: Search, 
    colorClass: 'tw-bg-blue-500',
    steps: [
      'Go to the nearest "Koban" (Police Box).',
      'Fill out a "Lost Property Report" (Ishitsubutsu-todoke).',
      'If you lost a credit card, contact your bank immediately.',
      'Check the station office if lost on a train.'
    ]
  },
  { 
    id: 'disaster', 
    icon: Bomb, 
    colorClass: 'tw-bg-orange-500',
    steps: [
      'Drop, Cover, and Hold On during an earthquake.',
      'Check the "Mirumana" map for the nearest evacuation shelter.',
      'Follow the instructions of local staff or police.',
      'Use "Disaster Message Board (171)" to contact family.'
    ]
  }
];

// ---------------------------------------------------------
// Functions (Arrow Notation)
// ---------------------------------------------------------

const makeCall = (number: string): void => {
  if (confirm(`Do you want to call ${number}?`)) {
    window.location.href = `tel:${number}`;
  }
};

const openGuide = (item: HelpCategory): void => {
  selectedGuide.value = item;
};

const copyLocation = async (): Promise<void> => {
  const loc = t('trouble.location_placeholder');
  try {
    await navigator.clipboard.writeText(loc);
    alert('Location copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};

// ---------------------------------------------------------
// Meta
// ---------------------------------------------------------

useHead(() => ({
  title: t('trouble.title'),
}));
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.tw-animate-slide-up {
  animation: slideUp 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}
</style>