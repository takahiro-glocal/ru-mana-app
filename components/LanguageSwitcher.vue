<template>
  <div class="tw-relative">
    <button
      @click="isOpen = !isOpen"
      :aria-label="$t('settings.switch_language')"
      :aria-expanded="isOpen"
      :class="[
        'tw-flex tw-items-center tw-gap-1.5 tw-rounded-full tw-px-3 tw-py-1.5 tw-text-sm tw-font-bold tw-transition-colors tw-cursor-pointer',
        variant === 'light'
          ? 'tw-bg-white/30 tw-backdrop-blur-md tw-text-white tw-border tw-border-white/40 hover:tw-bg-white/50'
          : 'tw-bg-[#4B3E8E]/15 tw-text-[#4B3E8E] tw-border tw-border-[#4B3E8E]/20 hover:tw-bg-[#4B3E8E]/25'
      ]"
    >
      <Languages class="tw-w-4 tw-h-4" />
      <span>{{ currentLocaleName }}</span>
    </button>

    <!-- Backdrop -->
    <div v-if="isOpen" class="tw-fixed tw-inset-0 tw-z-[55] tw-cursor-default" @click="isOpen = false" />

    <!-- Dropdown -->
    <Transition name="dropdown">
      <div
        v-if="isOpen"
        role="menu"
        class="tw-absolute tw-right-0 tw-mt-2 tw-bg-white tw-rounded-xl tw-shadow-lg tw-py-2 tw-min-w-[160px] tw-z-[56]"
      >
        <button
          v-for="localeItem in availableLocales"
          :key="localeItem.code"
          role="menuitem"
          @click="switchLocale(localeItem.code)"
          :class="[
            'tw-w-full tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-2.5 tw-text-sm tw-font-bold tw-transition-colors tw-border-0 tw-cursor-pointer',
            currentLocale === localeItem.code
              ? 'tw-bg-[#E4007F] tw-text-white'
              : 'tw-bg-transparent tw-text-gray-700 hover:tw-bg-gray-50'
          ]"
        >
          <span>{{ localeItem.name }}</span>
          <span v-if="currentLocale === localeItem.code" class="tw-text-xs">✓</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { Languages } from 'lucide-vue-next'

withDefaults(defineProps<{
  variant?: 'light' | 'dark'
}>(), {
  variant: 'dark',
})

const { locale, setLocale } = useI18n()
const currentLocale = computed(() => locale.value)
const isOpen = ref(false)

const availableLocales = [
  { code: 'ja', name: '日本語' },
  { code: 'en', name: 'English' },
  { code: 'zh', name: '简体中文' },
] as const

const currentLocaleName = computed(() =>
  availableLocales.find(l => l.code === currentLocale.value)?.name ?? currentLocale.value
)

const switchLocale = (code: string) => {
  setLocale(code)
  isOpen.value = false
}

const onEscKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', onEscKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onEscKey)
})
</script>

<style scoped>
.dropdown-enter-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
