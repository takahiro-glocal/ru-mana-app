<template>
      <div v-if="isLoading" class="tw-text-center tw-py-20 tw-text-gray-400">
        <p>{{ $t('common.loading') }}</p>
      </div>
      <div v-else-if="activities.length === 0" class="tw-text-center tw-py-20 tw-text-gray-400">
        <p>{{ $t('activity.no_activity') }}</p>
      </div>
      <div v-else class="tw-space-y-4">
        <div v-for="activity in activities" :key="activity.id" class="tw-bg-white tw-p-4 tw-rounded-2xl tw-shadow-sm">
          <p class="tw-text-sm tw-text-gray-600 tw-line-clamp-2">{{ activity.body }}</p>
          <p class="tw-text-xs tw-text-gray-400 tw-mt-1">{{ formatDate(activity.createdAt) }}</p>
        </div>
      </div>
</template>

<script setup lang="ts">
import type { Post } from '~/composables/useFirestore'

const { user } = useAuth()
const { getUserPosts } = useFirestore()

const activities = ref<Post[]>([])
const isLoading = ref(true)

const formatDate = (timestamp: FirebaseTimestamp | null) => {
  if (!timestamp?.toDate) return ''
  const d = timestamp.toDate()
  return d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

onMounted(async () => {
  if (user.value?.uid) {
    try {
      activities.value = await getUserPosts(user.value.uid)
    } catch (e) {
      console.error('Failed to load activities:', e)
    }
  }
  isLoading.value = false
})
</script>
