<template>
      <div class="tw-bg-gradient-to-br tw-from-[#FFD700] tw-to-[#FDB931] tw-rounded-3xl tw-p-8 tw-text-white tw-shadow-lg tw-mb-6 tw-relative tw-overflow-hidden">
        <div class="tw-absolute tw-top-[-20%] tw-right-[-20%] tw-w-40 tw-h-40 tw-bg-white tw-rounded-full tw-opacity-20"></div>
        <h3 class="tw-font-bold tw-opacity-90 tw-mb-1">{{ $t('points.current_points') }}</h3>
        <div class="tw-text-5xl tw-font-black">{{ points.toLocaleString() }} <span class="tw-text-xl">pt</span></div>
      </div>

      <div class="tw-bg-white tw-rounded-3xl tw-p-6 tw-shadow-sm">
        <h3 class="tw-font-bold tw-text-gray-700 tw-mb-4">{{ $t('points.history') }}</h3>
        <div v-if="isLoading" class="tw-text-center tw-py-8 tw-text-gray-400">{{ $t('common.loading') }}</div>
        <div v-else-if="history.length === 0" class="tw-text-center tw-py-8 tw-text-gray-400">{{ $t('points.no_history') }}</div>
        <ul v-else class="tw-space-y-4">
          <li v-for="item in history" :key="item.id" class="tw-flex tw-justify-between tw-items-center tw-pb-4 tw-border-b tw-border-gray-50 last:tw-border-0">
            <div>
              <p class="tw-text-sm tw-font-bold tw-text-gray-600">{{ item.reason }}</p>
              <p class="tw-text-xs tw-text-gray-400">{{ formatDate(item.createdAt) }}</p>
            </div>
            <span :class="['tw-font-bold', item.amount > 0 ? 'tw-text-[#85C441]' : 'tw-text-red-400']">
              {{ item.amount > 0 ? '+' : '' }}{{ item.amount }} pt
            </span>
          </li>
        </ul>
      </div>
</template>

<script setup lang="ts">
const { user } = useAuth()
const { getUserPoints, getPointHistory } = useFirestore()

const points = ref(0)
const history = ref<PointHistoryItem[]>([])
const isLoading = ref(true)

const formatDate = (timestamp: FirebaseTimestamp | null) => {
  if (!timestamp?.toDate) return ''
  const d = timestamp.toDate()
  return d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

onMounted(async () => {
  if (user.value?.uid) {
    try {
      const [pts, hist] = await Promise.all([
        getUserPoints(user.value.uid),
        getPointHistory(user.value.uid)
      ])
      points.value = pts
      history.value = hist
    } catch (e) {
      console.error('Failed to load points:', e)
    }
  }
  isLoading.value = false
})
</script>
