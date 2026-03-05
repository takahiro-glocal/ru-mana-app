<template>
  <!-- <div class="tw-min-h-screen tw-bg-[#F9F5E7]"> -->
    <!-- <SettingsHeader title="フィードバック" /> -->
    <!-- <div class="tw-p-6 tw-max-w-md tw-mx-auto"> -->
      <div>
        <p class="tw-text-sm tw-text-gray-600 tw-mb-6">
          {{ $t('feedback.help_text') }}<br>
          {{ $t('feedback.help_text_2') }}
        </p>
        
        <form @submit.prevent="sendFeedback" class="tw-space-y-4">
          <textarea
            v-model="content"
            rows="5"
            :placeholder="$t('feedback.placeholder')"
            class="tw-w-full tw-bg-gray-50 tw-rounded-xl tw-p-4 tw-text-sm tw-outline-none focus:tw-ring-2 focus:tw-ring-[#85C441]"
            required
          ></textarea>
          <button
            type="submit"
            :disabled="isSending"
            :class="[
              'tw-w-full tw-font-bold tw-py-3.5 tw-rounded-full tw-shadow-md active:tw-scale-95 tw-transition-all',
              isSending ? 'tw-bg-gray-300 tw-text-gray-500' : 'tw-bg-[#4B3E8E] tw-text-white'
            ]"
          >
            {{ isSending ? $t('feedback.sending') : $t('feedback.send') }}
          </button>
          <p v-if="successMessage" class="tw-text-center tw-text-sm tw-text-[#85C441] tw-font-bold">{{ successMessage }}</p>
        </form>
      </div>
    <!-- </div> -->
  <!-- </div> -->
</template>

<script setup lang="ts">
const { t } = useI18n()
const { user } = useAuth()
const { submitFeedback } = useFirestore()

const content = ref('')
const isSending = ref(false)
const successMessage = ref('')

const sendFeedback = async () => {
  if (!content.value.trim()) return
  isSending.value = true
  successMessage.value = ''
  try {
    await submitFeedback(
      content.value,
      user.value?.uid || 'anonymous',
      user.value?.displayName || t('feedback.guest')
    )
    content.value = ''
    successMessage.value = t('feedback.success')
  } catch (e) {
    console.error('Feedback submission failed:', e)
    successMessage.value = t('feedback.error')
  } finally {
    isSending.value = false
  }
}
</script>