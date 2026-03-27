<template>
  <Teleport to="body">
    <Transition name="onboarding-fade">
      <div v-if="isActive && currentStep" class="onboarding-overlay" @click.self="skip">
        <!-- Spotlight cutout via SVG mask -->
        <svg class="onboarding-mask" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <mask id="onboarding-spotlight">
              <rect width="100%" height="100%" fill="white" />
              <rect
                :x="spotlightRect.x"
                :y="spotlightRect.y"
                :width="spotlightRect.width"
                :height="spotlightRect.height"
                rx="12"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.6)"
            mask="url(#onboarding-spotlight)"
          />
        </svg>

        <!-- Tooltip -->
        <div
          ref="tooltipRef"
          class="onboarding-tooltip"
          :style="tooltipStyle"
        >
          <div class="onboarding-tooltip-header">
            <span class="onboarding-tooltip-step">
              {{ currentStepIndex + 1 }} / {{ totalSteps }}
            </span>
            <button class="onboarding-tooltip-close" @click="skip">
              <X :size="16" />
            </button>
          </div>

          <h3 class="onboarding-tooltip-title">{{ $t(currentStep.titleKey) }}</h3>
          <p class="onboarding-tooltip-desc">{{ $t(currentStep.descKey) }}</p>

          <div class="onboarding-tooltip-actions">
            <button
              v-if="!isFirstStep"
              class="onboarding-btn onboarding-btn--secondary"
              @click="prev"
            >
              <ChevronLeft :size="16" />
              {{ $t('onboarding.prev') }}
            </button>
            <button
              v-else
              class="onboarding-btn onboarding-btn--secondary"
              @click="skip"
            >
              {{ $t('onboarding.skip') }}
            </button>
            <button
              class="onboarding-btn onboarding-btn--primary"
              @click="next"
            >
              {{ isLastStep ? $t('onboarding.done') : $t('onboarding.next') }}
              <ChevronRight v-if="!isLastStep" :size="16" />
            </button>
          </div>

          <!-- Progress dots -->
          <div class="onboarding-progress">
            <span
              v-for="(_, idx) in totalSteps"
              :key="idx"
              :class="['onboarding-dot', idx === currentStepIndex ? 'onboarding-dot--active' : '']"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const { isActive, currentStep, currentStepIndex, totalSteps, isLastStep, isFirstStep, next, prev, skip } = useOnboarding()

const tooltipRef = ref<HTMLElement | null>(null)

const PADDING = 8

const spotlightRect = ref({ x: 0, y: 0, width: 0, height: 0 })
const tooltipStyle = ref<Record<string, string>>({})

const findTargetEl = (): Element | null => {
  if (!currentStep.value) return null
  const els = document.querySelectorAll(currentStep.value.target)
  return Array.from(els).find(e => {
    const r = e.getBoundingClientRect()
    return r.width > 0 && r.height > 0
  }) || null
}

const applyPosition = (el: Element) => {
  const rect = el.getBoundingClientRect()
  spotlightRect.value = {
    x: rect.left - PADDING,
    y: rect.top - PADDING,
    width: rect.width + PADDING * 2,
    height: rect.height + PADDING * 2
  }

  const viewW = window.innerWidth
  const viewH = window.innerHeight
  const isMobile = viewW < 768
  const tooltipW = 320
  const tooltipH = 220
  const gap = 16
  // Reserve space for mobile bottom nav
  const bottomReserved = isMobile ? 80 : 0

  const spaceBelow = viewH - bottomReserved - rect.bottom
  const spaceAbove = rect.top
  const spaceRight = viewW - rect.right
  const spaceLeft = rect.left

  let top: string
  let left: string
  let transform = ''

  // When the target element is taller than the available viewport, center the tooltip on screen
  const availableH = viewH - bottomReserved
  if (rect.height > availableH * 0.7) {
    top = `${Math.max(gap, (availableH - tooltipH) / 2)}px`
    left = '50%'
    transform = 'translateX(-50%)'
  } else if (spaceBelow >= tooltipH + gap) {
    top = `${rect.bottom + gap}px`
    left = `${Math.max(16, Math.min(rect.left, viewW - tooltipW - 16))}px`
  } else if (spaceAbove >= tooltipH + gap) {
    top = `${rect.top - gap}px`
    left = `${Math.max(16, Math.min(rect.left, viewW - tooltipW - 16))}px`
    transform = 'translateY(-100%)'
  } else if (!isMobile && spaceRight >= tooltipW + gap) {
    top = `${Math.max(16, rect.top)}px`
    left = `${rect.right + gap}px`
  } else if (!isMobile && spaceLeft >= tooltipW + gap) {
    top = `${Math.max(16, rect.top)}px`
    left = `${rect.left - gap}px`
    transform = 'translateX(-100%)'
  } else {
    // Fallback: center horizontally, position above or below target
    left = '50%'
    transform = 'translateX(-50%)'
    if (spaceAbove > spaceBelow) {
      top = `${rect.top - gap}px`
      transform += ' translateY(-100%)'
    } else {
      top = `${rect.bottom + gap}px`
    }
  }

  tooltipStyle.value = { top, left, transform }
}

let scrollRecalcTimer: ReturnType<typeof setTimeout> | null = null

const updatePosition = () => {
  if (!currentStep.value) return

  const el = findTargetEl()
  if (!el) {
    spotlightRect.value = { x: -100, y: -100, width: 0, height: 0 }
    tooltipStyle.value = {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }
    return
  }

  const rect = el.getBoundingClientRect()
  const viewH = window.innerHeight
  const isMobile = window.innerWidth < 768
  const isOutOfView = rect.top < 0 || rect.bottom > viewH

  if (isMobile && isOutOfView) {
    // On mobile, scroll first then recalculate after scroll settles
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    if (scrollRecalcTimer) clearTimeout(scrollRecalcTimer)
    scrollRecalcTimer = setTimeout(() => {
      const updated = findTargetEl()
      if (updated) applyPosition(updated)
    }, 400)
    // Set initial position to avoid flash
    spotlightRect.value = { x: -100, y: -100, width: 0, height: 0 }
    tooltipStyle.value = { opacity: '0' }
    return
  }

  applyPosition(el)

  // Scroll target into view if needed (PC: smooth, non-blocking)
  if (isOutOfView) {
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }
}

watch([currentStep, isActive], () => {
  if (isActive.value && currentStep.value) {
    nextTick(() => {
      updatePosition()
    })
  }
})

let resizeHandler: (() => void) | null = null

onMounted(() => {
  resizeHandler = () => {
    if (isActive.value) updatePosition()
  }
  window.addEventListener('resize', resizeHandler)
  window.addEventListener('scroll', resizeHandler, true)
})

onUnmounted(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    window.removeEventListener('scroll', resizeHandler, true)
  }
  if (scrollRecalcTimer) clearTimeout(scrollRecalcTimer)
})
</script>

<style scoped>
.onboarding-overlay {
  position: fixed;
  inset: 0;
  z-index: 9500;
}

.onboarding-mask {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.onboarding-tooltip {
  position: fixed;
  width: 320px;
  max-width: calc(100vw - 32px);
  background: #fff;
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  z-index: 9501;
  transition: opacity 0.2s ease;
}

.onboarding-tooltip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.onboarding-tooltip-step {
  font-size: 0.75rem;
  font-weight: 700;
  color: #9ca3af;
}

.onboarding-tooltip-close {
  padding: 0.25rem;
  border-radius: 9999px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.onboarding-tooltip-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.onboarding-tooltip-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #4B3E8E;
  margin: 0 0 0.5rem;
}

.onboarding-tooltip-desc {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0 0 1rem;
  line-height: 1.6;
}

.onboarding-tooltip-actions {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.onboarding-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  border: none;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.onboarding-btn--primary {
  background: #4B3E8E;
  color: #fff;
}

.onboarding-btn--primary:hover {
  background: #3a2f70;
}

.onboarding-btn--secondary {
  background: #f3f4f6;
  color: #374151;
}

.onboarding-btn--secondary:hover {
  background: #e5e7eb;
}

.onboarding-progress {
  display: flex;
  justify-content: center;
  gap: 0.375rem;
  margin-top: 0.75rem;
}

.onboarding-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background: #e5e7eb;
  transition: all 0.2s;
}

.onboarding-dot--active {
  background: #4B3E8E;
  width: 1.25rem;
}

.onboarding-fade-enter-active,
.onboarding-fade-leave-active {
  transition: opacity 0.3s ease;
}

.onboarding-fade-enter-from,
.onboarding-fade-leave-to {
  opacity: 0;
}

@media (max-width: 767px) {
  .onboarding-tooltip-desc {
    margin-bottom: 1.5rem;
  }
}
</style>
