<template>
  <NuxtPwaManifest />
  <IntroAnimation v-if="!isLandingPage" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <MobileBottomNav v-if="!isLandingPage" />
  <GlobalDrawer v-if="!isLandingPage" />
  <GlobalChat v-if="!isLandingPage" />
  <OnboardingGuide v-if="!isLandingPage" />
</template>

<script setup lang="ts">
const route = useRoute()
const isLandingPage = computed(() => {
  const name = route.name as string | undefined
  return name ? name.startsWith('welcome') : false
})
</script>
