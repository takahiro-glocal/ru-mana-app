<template>
  <Transition name="modal">
    <div v-if="isOpen" class="tw-fixed tw-inset-0 tw-z-[100] tw-flex tw-items-center tw-justify-center tw-p-4">
      <div class="tw-absolute tw-inset-0 tw-bg-black/40 tw-backdrop-blur-sm" @click="$emit('close')"></div>
      
      <div class="tw-relative tw-bg-white tw-rounded-3xl tw-shadow-2xl tw-w-full tw-max-w-lg tw-overflow-hidden tw-animate-scale-in">
        <div :class="['tw-p-6 tw-flex tw-items-center tw-justify-between', theme.bg]">
          <h3 :class="['tw-text-lg tw-font-black', theme.text]">新しいスレッドを作成</h3>
          <button @click="$emit('close')" class="tw-p-2 tw-rounded-full tw-bg-white/50 hover:tw-bg-white tw-transition-colors">
            <X class="tw-w-5 tw-h-5 tw-text-gray-500" />
          </button>
        </div>

        <div class="tw-p-6 tw-space-y-6">
          <div class="tw-space-y-2">
            <label class="tw-text-xs tw-font-bold tw-text-gray-400 tw-uppercase">スレッドタイトル</label>
            <input 
              v-model="title" 
              type="text" 
              placeholder="例: 電車内でのベビーカーについて" 
              class="tw-w-full tw-bg-gray-50 tw-border tw-border-gray-100 tw-rounded-xl tw-p-4 tw-font-bold tw-text-gray-700 focus:tw-outline-none focus:tw-border-[#85C441] focus:tw-ring-2 focus:tw-ring-[#85C441]/20 tw-transition-all"
            />
          </div>

          <div class="tw-space-y-2">
            <label class="tw-text-xs tw-font-bold tw-text-gray-400 tw-uppercase">最初のコメント</label>
            <textarea 
              v-model="body" 
              rows="5"
              placeholder="詳細やあなたの考えを書いてください..." 
              class="tw-w-full tw-bg-gray-50 tw-border tw-border-gray-100 tw-rounded-xl tw-p-4 tw-text-sm tw-text-gray-700 tw-resize-none focus:tw-outline-none focus:tw-border-[#85C441] focus:tw-ring-2 focus:tw-ring-[#85C441]/20 tw-transition-all"
            ></textarea>
          </div>

          <button 
            @click="handleSubmit"
            :disabled="!isValid || isSubmitting"
            :class="['tw-w-full tw-py-4 tw-rounded-full tw-text-white tw-font-bold tw-shadow-lg tw-transition-all active:tw-scale-95 flex tw-items-center tw-justify-center tw-gap-2', isValid && !isSubmitting ? 'tw-bg-[#85C441] hover:tw-bg-[#74b036]' : 'tw-bg-gray-300 tw-cursor-not-allowed']"
          >
            <span v-if="isSubmitting" class="tw-animate-spin tw-border-2 tw-border-white tw-border-t-transparent tw-rounded-full tw-w-5 tw-h-5"></span>
            <span v-else>スレッドを作成する</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  theme: any
}>()

const emit = defineEmits(['close', 'create'])

const title = ref('')
const body = ref('')
const isSubmitting = ref(false)

const isValid = computed(() => title.value.trim().length > 0 && body.value.trim().length > 0)

const handleSubmit = async () => {
  if (!isValid.value || isSubmitting.value) return
  isSubmitting.value = true
  
  try {
    await emit('create', { title: title.value, body: body.value })
    // Reset form
    title.value = ''
    body.value = ''
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.tw-animate-scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>