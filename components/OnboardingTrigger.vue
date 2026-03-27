<template>
  <button
    class="onboarding-trigger"
    :title="$t('onboarding.help_tooltip')"
    @click="$emit('click')"
  >
    <HelpCircle :size="22" />
  </button>
</template>

<script setup lang="ts">
import { HelpCircle } from 'lucide-vue-next'

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.onboarding-trigger {
  position: fixed;
  bottom: 6.5rem;
  right: 1.25rem;
  z-index: 50;
  width: 44px;
  height: 44px;
  border-radius: 9999px;
  background: #4B3E8E;
  color: #fff;
  border: none;
  box-shadow: 0 4px 12px rgba(75, 62, 142, 0.35);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.2s;
}

.onboarding-trigger:hover {
  background: #3a2f70;
  transform: scale(1.08);
}

.onboarding-trigger:active {
  transform: scale(0.95);
}

@media (min-width: 768px) {
  .onboarding-trigger {
    bottom: 1.5rem;
    right: 6rem;
  }
}
</style>
