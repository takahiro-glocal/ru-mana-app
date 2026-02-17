<template>
  <!-- <div class="tw-min-h-screen tw-bg-[#F9F5E7]"> -->
    <!-- <SettingsHeader title="アクティビティ" /> -->
    <!-- <div class="tw-p-4 tw-max-w-2xl tw-mx-auto"> -->
      <div v-if="activities.length === 0" class="tw-text-center tw-py-20 tw-text-gray-400">
        <p>まだアクティビティはありません</p>
      </div>
      <div v-else class="tw-space-y-4">
        <div v-for="i in 3" :key="i" class="tw-bg-white tw-p-4 tw-rounded-2xl tw-shadow-sm">
          <p class="tw-text-sm tw-text-gray-600">投稿しました</p>
          <p class="tw-text-xs tw-text-gray-400 tw-mt-1">2025/02/18</p>
        </div>
      </div>
    <!-- </div> -->
  <!-- </div> -->
</template>

<script setup lang="ts">
const activities = ref([]) // 将来的にuseFirestoreから取得
</script>