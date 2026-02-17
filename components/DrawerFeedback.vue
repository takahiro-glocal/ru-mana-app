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
            class="tw-w-full tw-bg-[#4B3E8E] tw-text-white tw-font-bold tw-py-3.5 tw-rounded-full tw-shadow-md active:tw-scale-95 tw-transition-all"
          >
            送信する
          </button>
        </form>
      </div>
    <!-- </div> -->
  <!-- </div> -->
</template>

<script setup lang="ts">
const content = ref('')

const sendFeedback = () => {
  // 本来はFirestoreなどに保存
  alert('フィードバックを送信しました。\nご協力ありがとうございます！')
  content.value = ''
  useRouter().back()
}
</script>