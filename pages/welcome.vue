<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="landing-hero">
      <SkyAnimation :show-logo="false" :flag-size="32" />
      <div class="landing-hero-overlay" />
      <div class="landing-hero-content">
        <div class="landing-logo-area">
          <div class="landing-logo-ring">
            <img src="/images/logo.png" :alt="$t('landing.app_name')" class="landing-logo-img" />
          </div>
          <h1 class="landing-app-name">{{ $t('landing.app_name') }}</h1>
          <p class="landing-tagline">{{ $t('landing.tagline') }}</p>
        </div>
      </div>
    </section>

    <!-- Concept Section -->
    <section class="tw-bg-[#F9F5E7] tw-py-16 tw-px-6">
      <div class="tw-max-w-3xl tw-mx-auto tw-text-center">
        <h2 class="tw-text-2xl md:tw-text-3xl tw-font-bold tw-text-[#4B3E8E] tw-mb-4">
          {{ $t('landing.concept_title') }}
        </h2>
        <p class="tw-text-gray-600 tw-text-base md:tw-text-lg tw-leading-relaxed">
          {{ $t('landing.concept_body') }}
        </p>
      </div>
    </section>

    <!-- Key Messages -->
    <section class="tw-bg-white tw-py-14 tw-px-6">
      <div class="tw-max-w-4xl tw-mx-auto tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-8">
        <div v-for="(msg, i) in keyMessages" :key="i" class="tw-text-center tw-px-4">
          <div class="tw-w-16 tw-h-16 tw-mx-auto tw-mb-4 tw-rounded-full tw-flex tw-items-center tw-justify-center" :style="{ backgroundColor: msg.bgColor }">
            <component :is="msg.icon" class="tw-w-8 tw-h-8 tw-text-white" />
          </div>
          <p class="tw-text-lg tw-font-bold tw-text-[#2C3E50]">{{ $t(msg.textKey) }}</p>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="tw-bg-[#F9F5E7] tw-py-16 tw-px-6">
      <div class="tw-max-w-4xl tw-mx-auto">
        <h2 class="tw-text-2xl md:tw-text-3xl tw-font-bold tw-text-[#4B3E8E] tw-text-center tw-mb-10">
          {{ $t('landing.features_title') }}
        </h2>
        <div class="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-4 md:tw-gap-6">
          <div v-for="feature in features" :key="feature.id" class="tw-rounded-2xl tw-p-5 tw-text-white tw-text-center tw-shadow-lg tw-transform tw-transition-transform hover:tw-scale-105" :style="{ backgroundColor: feature.color }">
            <component :is="feature.icon" class="tw-w-10 tw-h-10 md:tw-w-12 md:tw-h-12 tw-mx-auto tw-mb-3" />
            <div class="tw-font-bold tw-text-base md:tw-text-lg tw-mb-1">{{ $t(feature.labelKey) }}</div>
            <div class="tw-text-xs md:tw-text-sm tw-opacity-90 tw-leading-relaxed">{{ $t(feature.descKey) }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Screenshot / App Preview -->
    <section class="tw-bg-white tw-py-16 tw-px-6">
      <div class="tw-max-w-5xl tw-mx-auto tw-text-center">
        <h2 class="tw-text-2xl md:tw-text-3xl tw-font-bold tw-text-[#4B3E8E] tw-mb-4">
          {{ $t('landing.preview_title') }}
        </h2>
        <p class="tw-text-gray-500 tw-text-sm md:tw-text-base tw-mb-10">
          {{ $t('landing.preview_subtitle') }}
        </p>
        <!-- Carousel (CoverFlow) -->
        <div class="screenshot-carousel" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
          <div class="screenshot-stage">
            <div
              v-for="(ss, i) in screenshots"
              :key="i"
              class="screenshot-slide"
              :class="{
                'screenshot-slide--active': i === activeSlide,
                'screenshot-slide--prev': i === activeSlide - 1,
                'screenshot-slide--next': i === activeSlide + 1,
                'screenshot-slide--hidden': Math.abs(i - activeSlide) > 1
              }"
              @click="goToSlide(i)"
            >
              <div class="phone-mockup">
                <div class="phone-notch" />
                <img :src="ss.src" :alt="$t(ss.captionKey)" class="phone-screen" loading="lazy" />
              </div>
              <p class="screenshot-caption">{{ $t(ss.captionKey) }}</p>
            </div>
          </div>
        </div>
        <!-- Dots -->
        <div class="tw-flex tw-justify-center tw-gap-2 tw-mt-6">
          <button v-for="(_, i) in screenshots" :key="i" class="screenshot-dot" :class="{ 'screenshot-dot--active': i === activeSlide }" :aria-label="`Slide ${i + 1}`" @click="goToSlide(i)" />
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="landing-cta-section">
      <div class="landing-cta-gradient" />
      <div class="landing-cta-content">
        <h2 class="tw-text-2xl md:tw-text-3xl tw-font-bold tw-text-white tw-mb-2 tw-text-center">
          {{ $t('landing.cta_title') }}
        </h2>
        <p class="tw-text-white/80 tw-mb-8 tw-text-center tw-text-sm md:tw-text-base">
          {{ $t('landing.cta_subtitle') }}
        </p>
        <div class="tw-flex tw-flex-col sm:tw-flex-row tw-gap-4 tw-w-full tw-max-w-md tw-mx-auto">
          <NuxtLink
            :to="localePath('/')"
            class="tw-flex-1 tw-flex tw-items-center tw-justify-center tw-gap-3 tw-bg-white tw-text-[#4B3E8E] tw-font-bold tw-py-4 tw-px-6 tw-rounded-2xl tw-shadow-lg tw-text-base hover:tw-bg-gray-50 tw-transition-colors tw-no-underline"
          >
            <Globe class="tw-w-5 tw-h-5" />
            {{ $t('landing.cta_browser') }}
          </NuxtLink>
          <button
            @click="handleInstallClick"
            class="tw-flex-1 tw-flex tw-items-center tw-justify-center tw-gap-3 tw-bg-[#E4007F] tw-text-white tw-font-bold tw-py-4 tw-px-6 tw-rounded-2xl tw-shadow-lg tw-text-base hover:tw-bg-[#c0006b] tw-transition-colors tw-border-0 tw-cursor-pointer"
          >
            <Download class="tw-w-5 tw-h-5" />
            {{ $t('landing.cta_install') }}
          </button>
        </div>
      </div>
    </section>

    <!-- PWA Install Guide Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showInstallGuide" class="landing-modal-backdrop" @click.self="showInstallGuide = false">
          <div ref="modalRef" class="landing-modal" role="dialog" aria-modal="true" :aria-label="$t('landing.install_title')" tabindex="-1">
            <button class="landing-modal-close" :aria-label="$t('common.back')" @click="showInstallGuide = false">
              <X class="tw-w-5 tw-h-5" />
            </button>
            <div class="tw-text-center tw-mb-6">
              <div class="tw-w-16 tw-h-16 tw-mx-auto tw-mb-4 tw-rounded-full tw-overflow-hidden tw-border-2 tw-border-[#4B3E8E]/20">
                <img src="/images/logo.png" :alt="$t('landing.app_name')" class="tw-w-full tw-h-full tw-object-cover" />
              </div>
              <h3 class="tw-text-xl tw-font-bold tw-text-[#4B3E8E]">
                {{ $t('landing.install_title') }}
              </h3>
            </div>

            <!-- Native install prompt available -->
            <div v-if="canNativeInstall" class="tw-space-y-4">
              <p class="tw-text-gray-600 tw-text-sm tw-text-center">
                {{ $t('landing.install_native_desc') }}
              </p>
              <button
                @click="triggerNativeInstall"
                class="tw-w-full tw-bg-[#4B3E8E] tw-text-white tw-font-bold tw-py-3 tw-px-6 tw-rounded-xl tw-border-0 tw-cursor-pointer hover:tw-bg-[#3a2f70] tw-transition-colors"
              >
                {{ $t('landing.install_button') }}
              </button>
            </div>

            <!-- Manual install instructions -->
            <div v-else class="tw-space-y-4">
              <p class="tw-text-gray-600 tw-text-sm tw-text-center">
                {{ $t('landing.install_manual_desc') }}
              </p>

              <!-- iOS Safari -->
              <div class="tw-bg-gray-50 tw-rounded-xl tw-p-4">
                <div class="tw-font-bold tw-text-sm tw-text-[#2C3E50] tw-mb-2">
                  iPhone / iPad (Safari)
                </div>
                <ol class="tw-text-sm tw-text-gray-600 tw-space-y-1 tw-pl-4 tw-list-decimal tw-m-0">
                  <li>{{ $t('landing.install_ios_step1') }}</li>
                  <li>{{ $t('landing.install_ios_step2') }}</li>
                  <li>{{ $t('landing.install_ios_step3') }}</li>
                </ol>
              </div>

              <!-- Android Chrome -->
              <div class="tw-bg-gray-50 tw-rounded-xl tw-p-4">
                <div class="tw-font-bold tw-text-sm tw-text-[#2C3E50] tw-mb-2">
                  Android (Chrome)
                </div>
                <ol class="tw-text-sm tw-text-gray-600 tw-space-y-1 tw-pl-4 tw-list-decimal tw-m-0">
                  <li>{{ $t('landing.install_android_step1') }}</li>
                  <li>{{ $t('landing.install_android_step2') }}</li>
                </ol>
              </div>

              <!-- PC -->
              <div class="tw-bg-gray-50 tw-rounded-xl tw-p-4">
                <div class="tw-font-bold tw-text-sm tw-text-[#2C3E50] tw-mb-2">
                  PC (Chrome / Edge)
                </div>
                <ol class="tw-text-sm tw-text-gray-600 tw-space-y-1 tw-pl-4 tw-list-decimal tw-m-0">
                  <li>{{ $t('landing.install_pc_step1') }}</li>
                  <li>{{ $t('landing.install_pc_step2') }}</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Footer -->
    <footer class="tw-bg-[#2C3E50] tw-text-white tw-py-8 tw-px-6 tw-text-center">
      <p class="tw-text-sm tw-opacity-60">&copy; {{ currentYear }} {{ $t('landing.app_name') }}</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {
  Heart, Users, Globe, Lightbulb, Binoculars, Ear, Footprints,
  Download, X
} from 'lucide-vue-next'

definePageMeta({
  layout: false,
})

const { t } = useI18n()
const localePath = useLocalePath()
const currentYear = new Date().getFullYear()

useHead({
  title: computed(() => `${t('landing.app_name')} — ${t('landing.tagline')}`),
  meta: [
    { name: 'description', content: computed(() => t('landing.concept_body')) },
  ],
})

// --- Key Messages ---
const keyMessages = [
  { icon: Heart, textKey: 'landing.msg_delight', bgColor: '#E4007F' },
  { icon: Users, textKey: 'landing.msg_person', bgColor: '#4B3E8E' },
  { icon: Globe, textKey: 'landing.msg_door', bgColor: '#0099DD' },
]

// --- Features ---
const features = [
  { id: 'shiru', icon: Lightbulb, color: '#85C441', labelKey: 'common.shiru', descKey: 'landing.feature_shiru' },
  { id: 'miru', icon: Binoculars, color: '#F26522', labelKey: 'common.miru', descKey: 'landing.feature_miru' },
  { id: 'kiku', icon: Ear, color: '#E4007F', labelKey: 'common.kiku', descKey: 'landing.feature_kiku' },
  { id: 'iku', icon: Footprints, color: '#0099DD', labelKey: 'common.iku', descKey: 'landing.feature_iku' },
]

// --- Screenshots Carousel ---
const screenshots = [
  { src: '/screenshots/Screenshot_top.jpg', captionKey: 'landing.ss_top' },
  { src: '/screenshots/Screenshot_shiru_top.jpg', captionKey: 'landing.ss_shiru' },
  { src: '/screenshots/Screenshot_q_and_a.jpg', captionKey: 'landing.ss_qa' },
  { src: '/screenshots/Screenshot_rule_and_manner.jpg', captionKey: 'landing.ss_rule' },
  { src: '/screenshots/Screenshot_thread.jpg', captionKey: 'landing.ss_thread' },
]

const activeSlide = ref(0)
let autoPlayTimer: ReturnType<typeof setInterval> | null = null
let touchStartX = 0

const goToSlide = (index: number) => {
  activeSlide.value = index
  resetAutoPlay()
}

const nextSlide = () => {
  activeSlide.value = (activeSlide.value + 1) % screenshots.length
}

const onTouchStart = (e: TouchEvent) => {
  touchStartX = e.changedTouches[0].clientX
}

const onTouchEnd = (e: TouchEvent) => {
  const diff = touchStartX - e.changedTouches[0].clientX
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      activeSlide.value = Math.min(activeSlide.value + 1, screenshots.length - 1)
    } else {
      activeSlide.value = Math.max(activeSlide.value - 1, 0)
    }
    resetAutoPlay()
  }
}

const resetAutoPlay = () => {
  if (autoPlayTimer) clearInterval(autoPlayTimer)
  autoPlayTimer = setInterval(nextSlide, 4000)
}

// --- PWA Install ---
const showInstallGuide = ref(false)
const canNativeInstall = ref(false)
const modalRef = ref<HTMLElement | null>(null)
let deferredPrompt: BeforeInstallPromptEvent | null = null

const onBeforeInstallPrompt = (e: Event) => {
  e.preventDefault()
  deferredPrompt = e as BeforeInstallPromptEvent
  canNativeInstall.value = true
}

const onEscKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && showInstallGuide.value) {
    showInstallGuide.value = false
  }
}

const handleInstallClick = () => {
  showInstallGuide.value = true
}

watch(showInstallGuide, (open) => {
  if (open) {
    nextTick(() => modalRef.value?.focus())
  }
})

const triggerNativeInstall = async () => {
  if (deferredPrompt) {
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      showInstallGuide.value = false
    }
    deferredPrompt = null
    canNativeInstall.value = false
  }
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  window.addEventListener('keydown', onEscKey)
  autoPlayTimer = setInterval(nextSlide, 4000)
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  window.removeEventListener('keydown', onEscKey)
  if (autoPlayTimer) clearInterval(autoPlayTimer)
})
</script>

<style scoped>
/* Hero */
.landing-page {
  overflow-x: hidden;
}

.landing-hero {
  position: relative;
  width: 100%;
  height: 100svh;
  min-height: 500px;
  overflow: hidden;
}

.landing-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.3) 60%,
    rgba(0, 0, 0, 0.6) 100%
  );
  z-index: 1;
}

.landing-hero-content {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.landing-logo-area {
  text-align: center;
}

.landing-logo-ring {
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.8);
  overflow: hidden;
  animation: landingLogoPulse 3s ease-in-out infinite;
}

.landing-logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.landing-app-name {
  font-size: 3rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.5rem;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.1em;
}

.landing-tagline {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  line-height: 1.6;
}

@media (min-width: 768px) {
  .landing-logo-ring {
    width: 160px;
    height: 160px;
  }
  .landing-app-name {
    font-size: 4rem;
  }
  .landing-tagline {
    font-size: 1.3rem;
  }
}

@keyframes landingLogoPulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 255, 255, 0.5);
    transform: scale(1.03);
  }
}

/* CTA Section */
.landing-cta-section {
  position: relative;
  padding: 5rem 1.5rem;
  min-height: 350px;
  overflow: hidden;
}

.landing-cta-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #4B3E8E 0%, #2C3E50 50%, #E4007F 100%);
}

.landing-cta-content {
  position: relative;
  z-index: 2;
}

/* Screenshot Carousel — CoverFlow */
.screenshot-carousel {
  overflow: hidden;
  touch-action: pan-y;
  margin: 0 -1.5rem;
  padding: 0 1.5rem;
}

.screenshot-stage {
  position: relative;
  height: 480px;
  perspective: 1000px;
}

.screenshot-slide {
  position: absolute;
  top: 0;
  left: 50%;
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
}

.screenshot-slide--active {
  transform: translateX(-50%) scale(1);
  z-index: 3;
  opacity: 1;
}

.screenshot-slide--prev {
  transform: translateX(calc(-50% - 160px)) scale(0.82);
  z-index: 2;
  opacity: 0.6;
}

.screenshot-slide--next {
  transform: translateX(calc(-50% + 160px)) scale(0.82);
  z-index: 2;
  opacity: 0.6;
}

.screenshot-slide--hidden {
  transform: translateX(-50%) scale(0.6);
  z-index: 1;
  opacity: 0;
  pointer-events: none;
}

.phone-mockup {
  position: relative;
  width: 200px;
  height: 420px;
  background: #1a1a2e;
  border-radius: 2rem;
  padding: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(255, 255, 255, 0.1) inset;
  transition: box-shadow 0.5s ease;
}

.screenshot-slide--active .phone-mockup {
  box-shadow: 0 25px 80px rgba(75, 62, 142, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.15) inset;
}

.phone-notch {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 20px;
  background: #1a1a2e;
  border-radius: 0 0 12px 12px;
  z-index: 2;
}

.phone-screen {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1.5rem;
}

.screenshot-caption {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-top: 1rem;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.screenshot-slide--active .screenshot-caption {
  opacity: 1;
}

.screenshot-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: #d1d5db;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
}

.screenshot-dot--active {
  background: #4B3E8E;
  transform: scale(1.3);
}

@media (min-width: 768px) {
  .screenshot-stage {
    height: 580px;
  }
  .screenshot-slide {
    width: 240px;
  }
  .phone-mockup {
    width: 240px;
    height: 500px;
  }
  .screenshot-slide--prev {
    transform: translateX(calc(-50% - 200px)) scale(0.82);
  }
  .screenshot-slide--next {
    transform: translateX(calc(-50% + 200px)) scale(0.82);
  }
}

/* Modal */
.landing-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  padding: 1rem;
}

.landing-modal {
  position: relative;
  background: #fff;
  border-radius: 1.5rem;
  padding: 2rem 1.5rem;
  max-width: 420px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.landing-modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
}

.landing-modal-close:hover {
  color: #374151;
}

/* Modal transitions */
.modal-fade-enter-active {
  transition: opacity 0.25s ease;
}
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
