<template>
  <!-- <div class="tw-min-h-screen tw-bg-[#F9F5E7]"> -->
    <!-- <SettingsHeader title="設定・言語" /> -->
    <!-- <div class="tw-p-4 tw-max-w-md tw-mx-auto tw-space-y-6"> -->
      
      <section class="tw-bg-transparent tw-rounded-3xl tw-p-6">
        <h3 class="tw-font-bold tw-text-gray-700 tw-mb-4">{{ $t('settings.language') }}</h3>
        <div class="tw-space-y-2">
          <button 
            v-for="localeItem in availableLocales" 
            :key="localeItem.code"
            @click="setLocale(localeItem.code)"
            :class="[
              'tw-w-full tw-flex tw-items-center tw-justify-between tw-p-3 tw-rounded-xl tw-transition-colors',
              currentLocale === localeItem.code ? 'tw-bg-[#E4007F] tw-text-white' : 'tw-bg-gray-50 tw-text-gray-600'
            ]"
          >
            <span class="tw-font-bold">{{ localeItem.name }}</span>
            <span v-if="currentLocale === localeItem.code">✓</span>
          </button>
        </div>
      </section>

      <section class="tw-bg-white tw-rounded-3xl tw-p-6 tw-shadow-sm">
        <h3 class="tw-font-bold tw-text-gray-700 tw-mb-4">{{ $t('settings.notifications') }}</h3>
        <div class="tw-flex tw-items-center tw-justify-between tw-p-2">
          <span class="tw-text-sm tw-text-gray-600">{{ $t('settings.push_notifications') }}</span>
          <div
            @click="toggleNotification"
            :class="[
              'tw-w-12 tw-h-7 tw-rounded-full tw-relative tw-cursor-pointer tw-transition-colors tw-duration-300',
              notificationEnabled ? 'tw-bg-[#85C441]' : 'tw-bg-gray-300'
            ]"
          >
            <div
              :class="[
                'tw-absolute tw-top-1 tw-w-5 tw-h-5 tw-bg-white tw-rounded-full tw-transition-all tw-duration-300',
                notificationEnabled ? 'tw-right-1' : 'tw-left-1'
              ]"
            ></div>
          </div>
        </div>
      </section>

    <!-- </div> -->
  <!-- </div> -->
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n()
const currentLocale = computed(() => locale.value)

const availableLocales = [
  { code: 'ja', name: '日本語' },
  { code: 'en', name: 'English' },
  { code: 'zh', name: '简体中文' },
] as const

// --- 通知設定の永続化 ---
const NOTIFICATION_KEY = 'ru-mana-notification-enabled'
const notificationEnabled = ref(true)

onMounted(() => {
  if (process.client) {
    const stored = localStorage.getItem(NOTIFICATION_KEY)
    if (stored !== null) {
      notificationEnabled.value = stored === 'true'
    }
  }
})

const toggleNotification = () => {
  notificationEnabled.value = !notificationEnabled.value
  if (process.client) {
    localStorage.setItem(NOTIFICATION_KEY, String(notificationEnabled.value))
  }
}
</script>

<style scoped>
/* 必要に応じて追加 */
</style>