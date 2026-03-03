<template>
  <!-- <div class="tw-min-h-screen tw-bg-[#F9F5E7]"> -->
    <!-- <SettingsHeader title="フィードバック" /> -->
    <!-- <div class="tw-p-6 tw-max-w-md tw-mx-auto"> -->
      <div class="tw-bg-white tw-rounded-3xl tw-p-8 tw-shadow-sm">
        <p class="tw-text-sm tw-text-gray-600 tw-mb-6">
          サービスの改善にご協力ください。<br>
          ご意見・ご要望をお待ちしております。
        </p>
        
        <form @submit.prevent="sendFeedback" class="tw-space-y-4">
          <textarea
            v-model="content"
            rows="5"
            placeholder="ここに内容を入力してください..."
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
            {{ isSending ? '送信中...' : '送信する' }}
          </button>
          <p v-if="successMessage" class="tw-text-center tw-text-sm tw-text-[#85C441] tw-font-bold">{{ successMessage }}</p>
        </form>
      </div>
    <!-- </div> -->
  <!-- </div> -->
</template>

<script setup lang="ts">
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
      user.value?.displayName || 'ゲスト'
    )
    content.value = ''
    successMessage.value = 'フィードバックを送信しました。ご協力ありがとうございます！'
  } catch (e) {
    console.error('Feedback submission failed:', e)
    successMessage.value = '送信に失敗しました。もう一度お試しください。'
  } finally {
    isSending.value = false
  }
}
</script>