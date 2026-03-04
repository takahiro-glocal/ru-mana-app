<template>
  <!-- FAB Button -->
  <button
    v-show="!isChatOpen"
    @click="openChat"
    class="tw-fixed tw-bottom-24 md:tw-bottom-8 tw-right-4 md:tw-right-8 tw-z-[55] tw-w-14 tw-h-14 tw-bg-[#4B3E8E] tw-rounded-full tw-shadow-lg tw-flex tw-items-center tw-justify-center tw-text-white hover:tw-bg-[#3d3275] active:tw-scale-90 tw-transition-all"
    :aria-label="$t('chat.open')"
  >
    <MessageCircle class="tw-w-6 tw-h-6" />
    <span
      v-if="messages.length === 0"
      class="tw-absolute -tw-top-1 -tw-right-1 tw-w-4 tw-h-4 tw-bg-[#E4007F] tw-rounded-full tw-animate-pulse"
    ></span>
  </button>

  <!-- Chat Panel Backdrop (mobile only) -->
  <Transition name="chat-fade">
    <div
      v-if="isChatOpen"
      class="tw-fixed tw-inset-0 tw-bg-black/20 tw-backdrop-blur-sm tw-z-[75] md:tw-hidden"
      @click="closeChat"
    ></div>
  </Transition>

  <!-- Chat Panel -->
  <Transition name="chat-slide">
    <div
      v-if="isChatOpen"
      class="tw-fixed tw-z-[80]
        tw-bottom-0 tw-left-0 tw-right-0 tw-top-12
        md:tw-bottom-8 md:tw-right-8 md:tw-left-auto md:tw-top-auto
        md:tw-w-[400px] md:tw-h-[600px]
        tw-bg-white tw-rounded-t-[2rem] md:tw-rounded-[2rem]
        tw-shadow-2xl tw-flex tw-flex-col tw-overflow-hidden"
    >
      <!-- Header -->
      <div class="tw-bg-[#4B3E8E] tw-px-5 tw-py-4 tw-flex tw-items-center tw-justify-between tw-flex-shrink-0">
        <div class="tw-flex tw-items-center tw-gap-3">
          <div class="tw-w-9 tw-h-9 tw-bg-white tw-rounded-full tw-flex tw-items-center tw-justify-center">
            <img src="/images/logo.png" alt="Mana" class="tw-w-7 tw-h-7" />
          </div>
          <div>
            <h3 class="tw-text-white tw-font-bold tw-text-sm">{{ $t('chat.title') }}</h3>
            <p class="tw-text-white/60 tw-text-[10px]">{{ $t('chat.subtitle') }}</p>
          </div>
        </div>
        <div class="tw-flex tw-items-center tw-gap-2">
          <button
            v-if="messages.length > 0"
            @click="clearMessages"
            class="tw-p-1.5 tw-rounded-full tw-text-white/50 hover:tw-text-white hover:tw-bg-white/10 tw-transition-colors"
            :title="$t('chat.clear')"
          >
            <Trash2 class="tw-w-4 tw-h-4" />
          </button>
          <button
            @click="closeChat"
            class="tw-p-1.5 tw-rounded-full tw-text-white/50 hover:tw-text-white hover:tw-bg-white/10 tw-transition-colors"
          >
            <X class="tw-w-5 tw-h-5" />
          </button>
        </div>
      </div>

      <!-- Messages Area -->
      <div ref="messagesContainer" class="tw-flex-1 tw-overflow-y-auto tw-p-4 tw-space-y-3">
        <!-- Welcome State -->
        <div v-if="messages.length === 0" class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-full tw-text-center tw-px-6">
          <div class="tw-w-20 tw-h-20 tw-bg-[#F9F5E7] tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mb-4">
            <img src="/images/logo.png" alt="Mana" class="tw-w-14 tw-h-14" />
          </div>
          <h4 class="tw-text-gray-800 tw-font-bold tw-mb-2">{{ $t('chat.welcome_title') }}</h4>
          <p class="tw-text-gray-400 tw-text-sm tw-mb-6">{{ $t('chat.welcome_desc') }}</p>
          <div class="tw-flex tw-flex-wrap tw-gap-2 tw-justify-center">
            <button
              v-for="n in 3"
              :key="n"
              @click="sendMessage($t(`chat.suggestion_${n}`))"
              class="tw-bg-[#F9F5E7] tw-text-gray-600 tw-text-xs tw-font-bold tw-px-4 tw-py-2 tw-rounded-full hover:tw-bg-[#4B3E8E] hover:tw-text-white tw-transition-colors"
            >
              {{ $t(`chat.suggestion_${n}`) }}
            </button>
          </div>
        </div>

        <!-- Message Bubbles -->
        <template v-for="msg in messages" :key="msg.id">
          <div v-if="msg.role === 'user'" class="tw-flex tw-justify-end">
            <div class="tw-bg-[#4B3E8E] tw-text-white tw-rounded-2xl tw-rounded-br-sm tw-px-4 tw-py-2.5 tw-max-w-[80%] tw-text-sm">
              {{ msg.content }}
            </div>
          </div>
          <div v-else class="tw-flex tw-justify-start tw-gap-2">
            <div class="tw-w-7 tw-h-7 tw-bg-[#F9F5E7] tw-rounded-full tw-flex tw-items-center tw-justify-center tw-flex-shrink-0 tw-mt-1">
              <img src="/images/logo.png" alt="Mana" class="tw-w-5 tw-h-5" />
            </div>
            <div class="tw-bg-gray-50 tw-text-gray-700 tw-rounded-2xl tw-rounded-bl-sm tw-px-4 tw-py-2.5 tw-max-w-[80%] tw-text-sm tw-leading-relaxed" v-html="formatMessage(msg.content)">
            </div>
          </div>
        </template>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="tw-flex tw-justify-start tw-gap-2">
          <div class="tw-w-7 tw-h-7 tw-bg-[#F9F5E7] tw-rounded-full tw-flex tw-items-center tw-justify-center tw-flex-shrink-0 tw-mt-1">
            <img src="/images/logo.png" alt="Mana" class="tw-w-5 tw-h-5" />
          </div>
          <div class="tw-bg-gray-50 tw-rounded-2xl tw-rounded-bl-sm tw-px-5 tw-py-3 tw-flex tw-gap-1.5">
            <span class="tw-w-2 tw-h-2 tw-bg-gray-300 tw-rounded-full tw-animate-bounce" style="animation-delay: 0ms"></span>
            <span class="tw-w-2 tw-h-2 tw-bg-gray-300 tw-rounded-full tw-animate-bounce" style="animation-delay: 150ms"></span>
            <span class="tw-w-2 tw-h-2 tw-bg-gray-300 tw-rounded-full tw-animate-bounce" style="animation-delay: 300ms"></span>
          </div>
        </div>

        <div ref="messagesEnd"></div>
      </div>

      <!-- Input Area -->
      <div class="tw-border-t tw-border-gray-100 tw-px-4 tw-py-3 tw-flex tw-items-end tw-gap-2 tw-flex-shrink-0 tw-bg-white">
        <textarea
          ref="inputRef"
          v-model="inputText"
          @keydown.enter.exact.prevent="handleSend"
          :placeholder="$t('chat.input_placeholder')"
          :disabled="isTyping"
          rows="1"
          class="tw-flex-1 tw-bg-gray-50 tw-border tw-border-gray-100 tw-rounded-2xl tw-px-4 tw-py-2.5 tw-text-sm tw-resize-none tw-outline-none focus:tw-border-[#4B3E8E] tw-transition-colors tw-max-h-24"
          @input="autoResize"
        ></textarea>
        <button
          @click="handleSend"
          :disabled="!inputText.trim() || isTyping"
          :class="[
            'tw-w-10 tw-h-10 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-transition-all tw-flex-shrink-0',
            inputText.trim() && !isTyping
              ? 'tw-bg-[#4B3E8E] tw-text-white active:tw-scale-90'
              : 'tw-bg-gray-100 tw-text-gray-300'
          ]"
        >
          <Send class="tw-w-4 tw-h-4" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { MessageCircle, X, Send, Trash2 } from 'lucide-vue-next'
import DOMPurify from 'dompurify'

const { isChatOpen, messages, isTyping, openChat, closeChat, sendMessage, clearMessages } = useChat()

const inputText = ref('')
const messagesEnd = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLTextAreaElement | null>(null)

const handleSend = () => {
  if (!inputText.value.trim() || isTyping.value) return
  sendMessage(inputText.value)
  inputText.value = ''
  if (inputRef.value) inputRef.value.style.height = 'auto'
}

const autoResize = () => {
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
    inputRef.value.style.height = Math.min(inputRef.value.scrollHeight, 96) + 'px'
  }
}

const formatMessage = (text: string): string => {
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
  return DOMPurify.sanitize(html)
}

watch(
  () => messages.value.length,
  () => {
    nextTick(() => {
      messagesEnd.value?.scrollIntoView({ behavior: 'smooth' })
    })
  }
)

watch(isTyping, (val) => {
  if (val) {
    nextTick(() => {
      messagesEnd.value?.scrollIntoView({ behavior: 'smooth' })
    })
  }
})

watch(isChatOpen, (val) => {
  if (val) {
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
})
</script>

<style scoped>
.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: transform 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.chat-slide-enter-from,
.chat-slide-leave-to {
  transform: translateY(100%);
}

@media (min-width: 768px) {
  .chat-slide-enter-active,
  .chat-slide-leave-active {
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    transform-origin: bottom right;
  }
  .chat-slide-enter-from,
  .chat-slide-leave-to {
    transform: scale(0.9) translateY(20px);
    opacity: 0;
  }
}

.chat-fade-enter-active,
.chat-fade-leave-active {
  transition: opacity 0.3s ease;
}
.chat-fade-enter-from,
.chat-fade-leave-to {
  opacity: 0;
}
</style>
