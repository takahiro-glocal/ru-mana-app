<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="landing-hero">
      <SkyAnimation :show-logo="false" />
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

    <!-- Screenshot / App Preview Placeholder -->
    <section class="tw-bg-white tw-py-16 tw-px-6">
      <div class="tw-max-w-4xl tw-mx-auto tw-text-center">
        <h2 class="tw-text-2xl md:tw-text-3xl tw-font-bold tw-text-[#4B3E8E] tw-mb-8">
          {{ $t('landing.preview_title') }}
        </h2>
        <div class="tw-bg-gradient-to-br tw-from-[#4B3E8E]/10 tw-to-[#E4007F]/10 tw-rounded-3xl tw-p-8 md:tw-p-12 tw-border-2 tw-border-dashed tw-border-[#4B3E8E]/20">
          <div class="tw-flex tw-items-center tw-justify-center tw-gap-4 tw-flex-wrap">
            <div class="tw-w-48 tw-h-80 md:tw-w-56 md:tw-h-96 tw-bg-[#2C3E50] tw-rounded-[2rem] tw-shadow-2xl tw-flex tw-items-center tw-justify-center tw-border-4 tw-border-gray-700">
              <div class="tw-text-center tw-text-white/60">
                <Smartphone class="tw-w-12 tw-h-12 tw-mx-auto tw-mb-3" />
                <p class="tw-text-xs">{{ $t('landing.preview_placeholder') }}</p>
              </div>
            </div>
          </div>
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
  Download, Smartphone, X
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
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  window.removeEventListener('keydown', onEscKey)
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
