<template>
  <div class="tw-min-h-screen tw-bg-[#F9F5E7] tw-p-4 md:tw-p-8 tw-pb-24 md:tw-pb-8">
    <div class="tw-max-w-6xl tw-mx-auto">
      <header class="tw-mb-6 md:tw-mb-8">
        <NuxtLink :to="localePath('/')" class="tw-inline-flex tw-items-center tw-gap-1 tw-text-sm tw-text-gray-500 hover:tw-text-gray-700 tw-transition-colors tw-mb-3">
          <ArrowLeft class="tw-w-4 tw-h-4" />
          {{ $t('common.home') }}
        </NuxtLink>
        <h1 class="tw-text-2xl md:tw-text-3xl tw-font-bold tw-text-[#4B3E8E]">
          {{ $t('animation.page_title') }}
        </h1>
        <p class="tw-text-gray-500 tw-text-sm tw-mt-1">
          {{ $t('animation.subtitle') }}
        </p>
      </header>

      <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-5">
        <a
          v-for="anim in animations"
          :key="anim.id"
          :href="`/animation/${anim.id}.html`"
          target="_blank"
          rel="noopener"
          class="tw-bg-white tw-rounded-2xl tw-shadow-sm hover:tw-shadow-lg tw-transition-all tw-border tw-border-gray-50 tw-overflow-hidden tw-group tw-block"
          @mouseenter="onHoverStart(anim.id)"
          @mouseleave="onHoverEnd(anim.id)"
          @touchstart.passive="onTouchStart($event, anim.id)"
          @touchend="onTouchEnd($event, anim.id)"
          @touchcancel="onTouchEnd($event, anim.id)"
        >
          <div class="tw-relative tw-aspect-video tw-bg-gray-100 tw-overflow-hidden">
            <img
              v-if="!thumbnailErrors[anim.id]"
              :src="`/animation/thumbnails/${anim.id}.png`"
              :alt="$t(anim.titleKey)"
              class="tw-w-full tw-h-full tw-object-cover"
              @error="thumbnailErrors[anim.id] = true"
            />
            <div
              v-else
              class="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center"
              :class="anim.fallbackGradient"
            >
              <span class="tw-text-white tw-font-bold tw-text-lg tw-drop-shadow-md">{{ $t(anim.titleKey) }}</span>
            </div>

            <Transition name="fade">
              <iframe
                v-if="previewingId === anim.id"
                :src="`/animation/${anim.id}.html`"
                class="tw-absolute tw-inset-0 tw-w-full tw-h-full tw-border-0 tw-pointer-events-none"
                loading="lazy"
              />
            </Transition>

            <div
              v-if="previewingId === anim.id"
              class="tw-absolute tw-bottom-2 tw-left-2 tw-bg-black/50 tw-text-white tw-text-xs tw-px-2 tw-py-0.5 tw-rounded-full"
            >
              {{ $t('animation.previewing') }}
            </div>
          </div>

          <div class="tw-p-4">
            <h2 class="tw-text-base tw-font-bold tw-text-gray-800 group-hover:tw-text-[#4B3E8E] tw-transition-colors">
              {{ $t(anim.titleKey) }}
            </h2>
            <p class="tw-text-sm tw-text-gray-500 tw-mt-1">
              {{ $t(anim.descKey) }}
            </p>
            <div class="tw-flex tw-flex-wrap tw-gap-1.5 tw-mt-2">
              <span
                v-for="tag in anim.tags"
                :key="tag"
                class="tw-bg-gray-100 tw-text-gray-500 tw-text-xs tw-px-2 tw-py-0.5 tw-rounded-full"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'

const localePath = useLocalePath()

const animations = [
  {
    id: 'claude',
    titleKey: 'animation.claude_title',
    descKey: 'animation.claude_desc',
    tags: ['SVG', 'CSS'],
    fallbackGradient: 'tw-bg-gradient-to-br tw-from-[#85C441] tw-to-[#4B3E8E]',
  },
  {
    id: 'claude-5',
    titleKey: 'animation.claude5_title',
    descKey: 'animation.claude5_desc',
    tags: ['Canvas'],
    fallbackGradient: 'tw-bg-gradient-to-br tw-from-[#E4007F] tw-to-[#4B3E8E]',
  },
  {
    id: 'claude-7',
    titleKey: 'animation.claude7_title',
    descKey: 'animation.claude7_desc',
    tags: ['Canvas'],
    fallbackGradient: 'tw-bg-gradient-to-br tw-from-[#F26522] tw-to-[#4B3E8E]',
  },
  {
    id: 'claude-8',
    titleKey: 'animation.claude8_title',
    descKey: 'animation.claude8_desc',
    tags: ['Canvas'],
    fallbackGradient: 'tw-bg-gradient-to-br tw-from-[#0099DD] tw-to-[#4B3E8E]',
  },
  {
    id: 'claude-9',
    titleKey: 'animation.claude9_title',
    descKey: 'animation.claude9_desc',
    tags: ['Canvas', 'Flags'],
    fallbackGradient: 'tw-bg-gradient-to-br tw-from-[#E8A800] tw-to-[#85C441]',
  },
  {
    id: 'claude-10',
    titleKey: 'animation.claude10_title',
    descKey: 'animation.claude10_desc',
    tags: ['Canvas', 'Flags'],
    fallbackGradient: 'tw-bg-gradient-to-br tw-from-[#4B3E8E] tw-to-[#E4007F]',
  },
  {
    id: 'chatgpt',
    titleKey: 'animation.chatgpt_title',
    descKey: 'animation.chatgpt_desc',
    tags: ['Glassmorphism'],
    fallbackGradient: 'tw-bg-gradient-to-br tw-from-[#9ac7ff] tw-to-[#8fd3a8]',
  },
  {
    id: 'chatgpt-2',
    titleKey: 'animation.chatgpt2_title',
    descKey: 'animation.chatgpt2_desc',
    tags: ['Glassmorphism'],
    fallbackGradient: 'tw-bg-gradient-to-br tw-from-[#9ad6cf] tw-to-[#9ac7ff]',
  },
]

const previewingId = ref<string | null>(null)
const thumbnailErrors = reactive<Record<string, boolean>>({})

let longPressTimer: ReturnType<typeof setTimeout> | null = null
let longPressTriggered = false

function onHoverStart(id: string) {
  previewingId.value = id
}

function onHoverEnd(id: string) {
  if (previewingId.value === id) {
    previewingId.value = null
  }
}

function onTouchStart(_event: TouchEvent, id: string) {
  longPressTriggered = false
  longPressTimer = setTimeout(() => {
    longPressTriggered = true
    previewingId.value = id
  }, 500)
}

function onTouchEnd(event: TouchEvent, id: string) {
  if (longPressTimer) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
  if (longPressTriggered) {
    event.preventDefault()
    previewingId.value = null
    longPressTriggered = false
  }
}
</script>

<style scoped>
.fade-enter-active {
  transition: opacity 0.3s ease;
}
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
