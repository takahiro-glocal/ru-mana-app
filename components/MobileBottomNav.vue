<template>
  <nav
    class="tw-fixed tw-bottom-0 tw-left-0 tw-right-0 tw-z-50
           tw-bg-white tw-border-t tw-border-gray-100
           tw-shadow-[0_-2px_10px_rgba(0,0,0,0.05)]
           md:tw-hidden"
    :style="{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }"
  >
    <div class="tw-flex tw-items-center tw-justify-around tw-h-16 tw-max-w-lg tw-mx-auto">
      <NuxtLink
        v-for="item in navItems"
        :key="item.id"
        :to="localePath(item.path)"
        class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-flex-1 tw-h-full tw-relative tw-no-underline tw-transition-all tw-duration-200"
        :aria-current="isActive(item.id) ? 'page' : undefined"
      >
        <div
          v-if="isActive(item.id)"
          class="tw-absolute tw-top-1 tw-w-4 tw-h-1 tw-rounded-full tw-transition-all tw-duration-300"
          :style="{ backgroundColor: item.color }"
        />
        <component
          :is="item.icon"
          class="tw-w-5 tw-h-5 tw-transition-all tw-duration-200"
          :class="isActive(item.id) ? '-tw-translate-y-0.5' : 'tw-text-gray-300'"
          :style="isActive(item.id) ? { color: item.color } : {}"
        />
        <span
          class="tw-text-[10px] tw-mt-1 tw-transition-all tw-duration-200"
          :class="isActive(item.id) ? 'tw-font-bold' : 'tw-font-medium tw-text-gray-400'"
          :style="isActive(item.id) ? { color: item.color } : {}"
        >
          {{ $t(item.labelKey) }}
        </span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Home, Lightbulb, Binoculars, Ear, Footprints } from 'lucide-vue-next'
import type { Component } from 'vue'

interface NavItem {
  id: string
  path: string
  labelKey: string
  icon: Component
  color: string
}

const route = useRoute()
const localePath = useLocalePath()

const navItems: NavItem[] = [
  { id: 'home',  path: '/',      labelKey: 'common.home',  icon: Home,       color: '#4B3E8E' },
  { id: 'shiru', path: '/shiru', labelKey: 'common.shiru', icon: Lightbulb,  color: '#85C441' },
  { id: 'miru',  path: '/miru',  labelKey: 'common.miru',  icon: Binoculars, color: '#F26522' },
  { id: 'kiku',  path: '/kiku',  labelKey: 'common.kiku',  icon: Ear,        color: '#E4007F' },
  { id: 'iku',   path: '/iku',   labelKey: 'common.iku',   icon: Footprints, color: '#0099DD' },
]

const isActive = (id: string): boolean => {
  const path = route.path
  if (id === 'home') {
    const homePath = localePath('/')
    return path === homePath || path === homePath + '/'
  }
  return path.startsWith(localePath(`/${id}`))
}
</script>
