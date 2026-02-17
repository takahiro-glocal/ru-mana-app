<template>
  <div class="tw-h-full">
    <div v-if="history.length === 0" class="tw-text-center tw-py-20 tw-text-gray-400">
      <p>履歴はありません</p>
    </div>
    
    <div v-else class="tw-space-y-4">
      <div class="tw-flex tw-justify-end">
        <button @click="clearHistory" class="tw-text-xs tw-text-red-500 tw-font-bold hover:tw-underline">履歴を全削除</button>
      </div>
      
      <div 
        v-for="item in history" 
        :key="item.threadId"
        @click="goToThread(item)"
        class="tw-block tw-bg-white tw-p-4 tw-rounded-2xl tw-shadow-sm hover:tw-shadow-md tw-transition-shadow tw-cursor-pointer"
      >
        <div class="tw-flex tw-justify-between tw-items-start">
          <div>
            <p class="tw-font-bold tw-text-gray-700 tw-line-clamp-1">{{ item.title }}</p>
            <p class="tw-text-xs tw-text-gray-400 tw-mt-1">{{ formatDate(item.viewedAt) }}</p>
          </div>
          <ChevronRight class="tw-w-5 tw-h-5 tw-text-gray-300" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

const localePath = useLocalePath()
const router = useRouter()
const { history, initHistory, clearHistory } = useUserHistory()
const { closeDrawer } = useDrawer()

onMounted(() => {
  initHistory()
})

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const goToThread = (item: any) => {
  closeDrawer() // ドロワーを閉じる
  router.push(localePath(`/shiru/category/${item.categoryId}/thread/${item.threadId}`)) // 遷移する
}
</script>