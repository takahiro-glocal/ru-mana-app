<template>
  <Teleport to="body">
    <Transition name="intro-fade" @after-leave="onAfterLeave">
    <div v-if="showOverlay" class="intro-overlay">
      <iframe
        :src="`/animation/${selectedAnimation}.html`"
        class="intro-iframe"
        allow="autoplay"
      />

      <button
        class="intro-skip-btn"
        @click="showSkipModal = true"
      >
        {{ $t('intro.skip_button') }}
      </button>

      <Transition name="intro-modal">
        <div v-if="showSkipModal" class="intro-modal-backdrop" @click.self="showSkipModal = false">
          <div class="intro-modal">
            <button class="intro-modal-btn intro-modal-btn--primary" @click="skipThisTime">
              {{ $t('intro.skip_this_time') }}
            </button>
            <button class="intro-modal-btn intro-modal-btn--secondary" @click="skipForever">
              {{ $t('intro.skip_forever') }}
            </button>
            <p class="intro-modal-hint">
              {{ $t('intro.gallery_hint') }}
            </p>
          </div>
        </div>
      </Transition>
    </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const STORAGE_KEY = 'ru-mana-skip-intro'
const SESSION_KEY = 'ru-mana-intro-shown'
const ANIMATIONS = ['flags-gathering', 'circle-of-hands', 'walking-together']

const showOverlay = ref(false)
const showSkipModal = ref(false)
const selectedAnimation = ref(ANIMATIONS[0])

let fallbackTimeout: ReturnType<typeof setTimeout> | null = null

function close() {
  showSkipModal.value = false
  showOverlay.value = false
  if (fallbackTimeout) {
    clearTimeout(fallbackTimeout)
    fallbackTimeout = null
  }
}

function onAfterLeave() {
  window.removeEventListener('message', onMessage)
}

function skipThisTime() {
  close()
}

function skipForever() {
  try {
    localStorage.setItem(STORAGE_KEY, 'never')
  } catch {}
  close()
}

function onMessage(event: MessageEvent) {
  if (event.data && event.data.type === 'ru-mana-animation-complete') {
    close()
  }
}

onMounted(() => {
  try {
    if (localStorage.getItem(STORAGE_KEY) === 'never') return
    if (sessionStorage.getItem(SESSION_KEY) === '1') return
  } catch {
    return
  }

  selectedAnimation.value = ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)]
  showOverlay.value = true

  try {
    sessionStorage.setItem(SESSION_KEY, '1')
  } catch {}

  window.addEventListener('message', onMessage)

  fallbackTimeout = setTimeout(() => {
    close()
  }, 30000)
})

onUnmounted(() => {
  window.removeEventListener('message', onMessage)
  if (fallbackTimeout) {
    clearTimeout(fallbackTimeout)
  }
})
</script>

<style scoped>
.intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #000;
}

.intro-iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

.intro-skip-btn {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 10000;
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.45);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: background 0.2s, color 0.2s;
}

.intro-skip-btn:hover {
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
}

.intro-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
}

.intro-modal {
  background: #fff;
  border-radius: 1rem;
  padding: 1.5rem;
  max-width: 320px;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.intro-modal-btn {
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.intro-modal-btn--primary {
  background: #4B3E8E;
  color: #fff;
}

.intro-modal-btn--primary:hover {
  background: #3a2f70;
}

.intro-modal-btn--secondary {
  background: #f3f4f6;
  color: #374151;
}

.intro-modal-btn--secondary:hover {
  background: #e5e7eb;
}

.intro-modal-hint {
  font-size: 0.75rem;
  color: #9ca3af;
  text-align: center;
  margin: 0;
  line-height: 1.5;
}

.intro-fade-leave-active {
  transition: opacity 0.8s ease;
}

.intro-fade-leave-to {
  opacity: 0;
}

.intro-modal-enter-active,
.intro-modal-leave-active {
  transition: opacity 0.2s ease;
}

.intro-modal-enter-from,
.intro-modal-leave-to {
  opacity: 0;
}
</style>
