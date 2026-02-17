<template>
  <header class="tw-bg-white tw-border-b tw-border-gray-100 tw-p-4 tw-flex tw-items-center tw-gap-4 tw-sticky tw-top-0 tw-z-50">
    <button @click="$router.back()" class="tw-p-2 tw-rounded-full hover:tw-bg-gray-50">
      <ChevronLeft class="tw-w-6 tw-h-6 tw-text-gray-600" />
    </button>
    <h1 class="tw-text-lg tw-font-bold tw-text-gray-800">{{ title }}</h1>
  </header>
</template>

<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'
defineProps<{ title: string }>()
</script>