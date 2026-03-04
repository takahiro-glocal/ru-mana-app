<template>
  <div class="tw-min-h-screen tw-bg-gray-50">
    <!-- ===== Safe-area top bar ===== -->
    <div class="tw-bg-ru-trouble tw-h-2 md:tw-h-3"></div>

    <!-- ===== Header ===== -->
    <header class="tw-bg-ru-trouble tw-text-white tw-px-4 md:tw-px-8 tw-pb-16 md:tw-pb-20 tw-relative">
      <!-- Navigation -->
      <div class="tw-max-w-4xl tw-mx-auto tw-flex tw-items-center tw-justify-between tw-py-4 md:tw-py-5">
        <button @click="$router.push(localePath('/'))" class="tw-p-2 tw-rounded-full hover:tw-bg-white/20 tw-transition-colors">
          <ChevronLeft class="tw-w-6 tw-h-6" />
        </button>
        <div class="tw-flex tw-items-center tw-gap-3">
          <button @click="showComingSoon($t('dashboard.disaster_map'))" class="tw-flex tw-items-center tw-gap-1.5 tw-bg-white/20 tw-backdrop-blur-sm tw-px-3 tw-py-1.5 tw-rounded-full tw-text-xs tw-font-bold hover:tw-bg-white/30 tw-transition-colors">
            <MapPin class="tw-w-3.5 tw-h-3.5" />
            {{ $t('dashboard.disaster_map') }}
          </button>
          <NuxtLink :to="localePath('/')" class="tw-hidden md:tw-flex tw-p-2 tw-rounded-full hover:tw-bg-white/20 tw-transition-colors">
            <Home class="tw-w-5 tw-h-5" />
          </NuxtLink>
          <div v-if="user" @click="openDrawer()" class="tw-cursor-pointer">
            <img :src="userPhotoURL" class="tw-w-8 tw-h-8 tw-rounded-full tw-border-2 tw-border-white/50" />
          </div>
          <button v-else @click="isLoginModalOpen = true" class="tw-p-1.5 tw-rounded-full hover:tw-bg-white/20 tw-transition-colors">
            <UserCircle class="tw-w-7 tw-h-7" />
          </button>
        </div>
      </div>

      <!-- Title -->
      <div class="tw-max-w-4xl tw-mx-auto tw-pb-4">
        <div class="tw-flex tw-items-center tw-mb-2">
          <div class="tw-bg-white/20 tw-p-2 tw-rounded-xl tw-mr-3">
            <AlertTriangle class="tw-w-6 tw-h-6 md:tw-w-7 md:tw-h-7" />
          </div>
          <div>
            <h1 class="tw-text-2xl md:tw-text-3xl tw-font-bold">{{ $t('trouble.title') }}</h1>
            <p class="tw-text-white/80 tw-text-xs md:tw-text-sm">{{ $t('trouble.emergency_subtitle') }}</p>
          </div>
        </div>
      </div>

      <!-- Curved bottom -->
      <div class="tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-h-8 tw-bg-gray-50 tw-rounded-t-[2rem]"></div>
    </header>

    <!-- ===== Main Content ===== -->
    <main class="tw-max-w-4xl tw-mx-auto tw-px-4 tw-mt-[-2.5rem] tw-relative tw-z-10 tw-pb-24">
      <!-- ===== PC: Two Column Layout ===== -->
      <div class="md:tw-grid md:tw-grid-cols-12 md:tw-gap-8">

        <!-- Left Column: Emergency + Categories -->
        <div class="md:tw-col-span-7">
          <!-- Emergency Buttons -->
          <section class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-8">
            <button
              @click="() => makeCall('110')"
              class="tw-bg-white tw-p-5 md:tw-p-6 tw-rounded-3xl tw-shadow-lg tw-flex tw-flex-col tw-items-center tw-justify-center tw-border-2 tw-border-transparent hover:tw-border-blue-200 active:tw-scale-95 tw-transition-all"
            >
              <div class="tw-bg-blue-600 tw-p-3 md:tw-p-4 tw-rounded-full tw-mb-3 tw-shadow-md">
                <ShieldAlert class="tw-w-7 tw-h-7 md:tw-w-8 md:tw-h-8 tw-text-white" />
              </div>
              <span class="tw-text-xs tw-text-gray-500 tw-font-bold tw-uppercase">{{ $t('trouble.police') }}</span>
              <span class="tw-text-2xl tw-font-black tw-text-blue-700">110</span>
            </button>

            <button
              @click="() => makeCall('119')"
              class="tw-bg-white tw-p-5 md:tw-p-6 tw-rounded-3xl tw-shadow-lg tw-flex tw-flex-col tw-items-center tw-justify-center tw-border-2 tw-border-transparent hover:tw-border-red-200 active:tw-scale-95 tw-transition-all"
            >
              <div class="tw-bg-red-600 tw-p-3 md:tw-p-4 tw-rounded-full tw-mb-3 tw-shadow-md">
                <Flame class="tw-w-7 tw-h-7 md:tw-w-8 md:tw-h-8 tw-text-white" />
              </div>
              <span class="tw-text-xs tw-text-gray-500 tw-font-bold tw-uppercase">{{ $t('trouble.ambulance') }}</span>
              <span class="tw-text-2xl tw-font-black tw-text-red-700">119</span>
            </button>
          </section>

          <!-- Location Section -->
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
              <button @click="() => copyLocation()" class="tw-ml-auto tw-p-2 tw-text-blue-600 hover:tw-bg-blue-100 tw-rounded-lg tw-transition-colors">
                <Copy class="tw-w-5 tw-h-5" />
              </button>
            </div>
          </section>

          <!-- Help Categories -->
          <h3 class="tw-text-lg tw-font-bold tw-text-gray-800 tw-mb-4 tw-px-2">{{ $t('trouble.select_issue') }}</h3>
          <section class="tw-grid tw-grid-cols-1 tw-gap-4">
            <button
              v-for="item in helpCategories"
              :key="item.id"
              @click="() => openGuide(item)"
              class="tw-bg-white tw-p-5 tw-rounded-2xl tw-shadow-sm tw-flex tw-items-center tw-border tw-border-gray-100 hover:tw-border-ru-trouble hover:tw-shadow-md tw-transition-all active:tw-scale-[0.98]"
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
        </div>

        <!-- Right Column: Hotlines + Quick Links -->
        <div class="md:tw-col-span-5 tw-mt-10 md:tw-mt-0">
          <!-- Support Hotlines -->
          <section class="tw-p-6 tw-bg-white tw-rounded-3xl tw-shadow-sm tw-border tw-border-gray-100">
            <div class="tw-flex tw-items-center tw-mb-5">
              <div class="tw-bg-gray-100 tw-p-2 tw-rounded-lg tw-mr-3">
                <Globe class="tw-w-5 tw-h-5 tw-text-gray-500" />
              </div>
              <h3 class="tw-text-sm tw-font-bold tw-text-gray-700">{{ $t('trouble.support_hotline') }}</h3>
            </div>
            <div class="tw-space-y-3">
              <div @click="() => makeCall('03-5320-7744')" class="tw-flex tw-justify-between tw-items-center tw-cursor-pointer hover:tw-bg-gray-50 tw-p-4 tw-rounded-xl tw-transition-colors tw-border tw-border-gray-100">
                <div>
                  <span class="tw-text-sm tw-font-bold tw-text-gray-700 tw-block">{{ $t('trouble.himawari') }}</span>
                  <span class="tw-text-[10px] tw-text-gray-400">24h / Multilingual</span>
                </div>
                <span class="tw-text-sm tw-font-black tw-text-blue-600">03-5320-7744</span>
              </div>
              <div @click="() => makeCall('0570-000-911')" class="tw-flex tw-justify-between tw-items-center tw-cursor-pointer hover:tw-bg-gray-50 tw-p-4 tw-rounded-xl tw-transition-colors tw-border tw-border-gray-100">
                <div>
                  <span class="tw-text-sm tw-font-bold tw-text-gray-700 tw-block">{{ $t('trouble.visitor_hotline') }}</span>
                  <span class="tw-text-[10px] tw-text-gray-400">24h / EN, ZH, KO, JA</span>
                </div>
                <span class="tw-text-sm tw-font-black tw-text-blue-600">0570-000-911</span>
              </div>
            </div>
          </section>

          <!-- Quick Links -->
          <section class="tw-mt-6 tw-space-y-3">
            <div @click="showComingSoon($t('dashboard.disaster_map'))" class="tw-flex tw-items-center tw-gap-3 tw-bg-white tw-p-4 tw-rounded-2xl tw-shadow-sm tw-border tw-border-gray-100 hover:tw-border-[#BCAF92] hover:tw-shadow-md tw-transition-all tw-cursor-pointer">
              <div class="tw-bg-[#BCAF92] tw-p-2.5 tw-rounded-xl">
                <MapPin class="tw-w-5 tw-h-5 tw-text-white" />
              </div>
              <div class="tw-flex-1">
                <h4 class="tw-font-bold tw-text-gray-700 tw-text-sm">{{ $t('dashboard.disaster_map') }}</h4>
                <p class="tw-text-[10px] tw-text-gray-400">{{ $t('disaster.subtitle') }}</p>
              </div>
              <ChevronRight class="tw-w-4 tw-h-4 tw-text-gray-300" />
            </div>

            <NuxtLink :to="localePath('/')" class="tw-flex tw-items-center tw-gap-3 tw-bg-white tw-p-4 tw-rounded-2xl tw-shadow-sm tw-border tw-border-gray-100 hover:tw-border-[#85C441] hover:tw-shadow-md tw-transition-all">
              <div class="tw-bg-[#85C441] tw-p-2.5 tw-rounded-xl">
                <Home class="tw-w-5 tw-h-5 tw-text-white" />
              </div>
              <div class="tw-flex-1">
                <h4 class="tw-font-bold tw-text-gray-700 tw-text-sm">{{ $t('common.home') }}</h4>
              </div>
              <ChevronRight class="tw-w-4 tw-h-4 tw-text-gray-300" />
            </NuxtLink>
          </section>
        </div>
      </div>
    </main>

    <!-- ===== Guide Modal ===== -->
    <Transition name="fade">
      <div v-if="selectedGuide" class="tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-end lg:tw-items-center tw-justify-center tw-p-4 tw-bg-black/60 tw-backdrop-blur-sm" @click.self="selectedGuide = null">
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
            <button @click="() => selectedGuide = null" class="tw-w-full tw-mt-8 tw-py-4 tw-bg-gray-900 tw-text-white tw-rounded-2xl tw-font-bold active:tw-scale-95 tw-transition-transform">
              {{ $t('trouble.got_it') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Coming Soon Toast -->
    <Transition name="toast">
      <div v-if="comingSoonMessage" class="tw-fixed tw-bottom-24 tw-left-1/2 tw-transform -tw-translate-x-1/2 tw-bg-[#2C3E50] tw-text-white tw-px-6 tw-py-3 tw-rounded-full tw-shadow-lg tw-text-sm tw-font-bold tw-z-50 tw-whitespace-nowrap">
        {{ $t('common.coming_soon', { name: comingSoonMessage }) }}
      </div>
    </Transition>

    <AuthModal :is-open="isLoginModalOpen" @close="isLoginModalOpen = false" />
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import {
  AlertTriangle, ShieldAlert, Flame, MapPin,
  ChevronRight, ChevronLeft, Globe, X, Stethoscope,
  Search, Bomb, Copy, Home, UserCircle
} from 'lucide-vue-next';

interface HelpCategory {
  id: string;
  icon: Component;
  colorClass: string;
  steps: string[];
}

const { t } = useI18n();
const localePath = useLocalePath();
const { user, userPhotoURL } = useAuth();
const { openDrawer } = useDrawer();

const selectedGuide = ref<HelpCategory | null>(null);
const isLoginModalOpen = ref(false);

// --- Coming Soon Toast ---
const comingSoonMessage = ref('');
let comingSoonTimer: ReturnType<typeof setTimeout> | null = null;
const showComingSoon = (name: string) => {
  comingSoonMessage.value = name;
  if (comingSoonTimer) clearTimeout(comingSoonTimer);
  comingSoonTimer = setTimeout(() => { comingSoonMessage.value = ''; }, 2000);
};

const helpCategories = computed<HelpCategory[]>(() => [
  {
    id: 'medical',
    icon: Stethoscope,
    colorClass: 'tw-bg-red-500',
    steps: [
      t('trouble_steps.medical_1'),
      t('trouble_steps.medical_2'),
      t('trouble_steps.medical_3'),
      t('trouble_steps.medical_4'),
    ]
  },
  {
    id: 'lost',
    icon: Search,
    colorClass: 'tw-bg-blue-500',
    steps: [
      t('trouble_steps.lost_1'),
      t('trouble_steps.lost_2'),
      t('trouble_steps.lost_3'),
      t('trouble_steps.lost_4'),
    ]
  },
  {
    id: 'disaster',
    icon: Bomb,
    colorClass: 'tw-bg-orange-500',
    steps: [
      t('trouble_steps.disaster_1'),
      t('trouble_steps.disaster_2'),
      t('trouble_steps.disaster_3'),
      t('trouble_steps.disaster_4'),
    ]
  }
]);

const makeCall = (number: string): void => {
  if (confirm(t('trouble_steps.call_confirm', { number }))) {
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
    alert(t('trouble.copy_success'));
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};

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

.toast-enter-active { transition: all 0.3s ease; }
.toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 20px); }
</style>
