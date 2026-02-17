<template>
  <div>
    <transition name="drawer-fade">
      <div v-if="isDrawerOpen" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-20 tw-z-[60] tw-backdrop-blur-sm" @click="closeDrawer"></div>
    </transition>
    
    <transition name="drawer-slide">
      <aside v-if="isDrawerOpen" class="tw-fixed tw-top-4 tw-right-4 tw-bottom-4 tw-w-[calc(100%-2rem)] md:tw-w-full tw-max-w-md tw-bg-white tw-z-[70] tw-rounded-[2.5rem] tw-shadow-2xl tw-flex tw-flex-col tw-overflow-hidden">
        <div class="tw-p-6 tw-flex tw-items-center tw-justify-between tw-flex-shrink-0">
          <button v-if="currentStep !== 'menu'" @click="currentStep = 'menu'" class="tw-p-2 tw-rounded-full hover:tw-bg-gray-50">
            <ChevronLeft class="tw-w-6 tw-h-6 tw-text-gray-400" />
          </button>
          <div v-else class="tw-w-10"></div>
          <h2 class="tw-text-gray-400 tw-font-bold tw-uppercase tw-tracking-widest tw-text-sm">{{ currentStepTitle }}</h2>
          <button @click="closeDrawer" class="tw-p-2 tw-rounded-full hover:tw-bg-gray-50">
            <X class="tw-w-6 tw-h-6 tw-text-gray-300" />
          </button>
        </div>
        
        <div class="tw-flex-1 tw-overflow-y-auto tw-px-8 tw-pb-8">
          <transition name="step-fade" mode="out-in">
            <div v-if="currentStep === 'menu'" key="menu">
              <div class="tw-flex tw-flex-col tw-items-center tw-mb-10">
                <img :src="userPhotoURL" class="tw-w-28 tw-h-28 tw-rounded-full tw-mb-4 tw-border-4 tw-border-white tw-shadow-md" />
                <h3 class="tw-text-2xl tw-font-bold tw-text-gray-700">{{ userDisplayName }}</h3>
                <p v-if="user" class="tw-text-sm tw-text-gray-400">{{ user.email }}</p>
              </div>
              <nav class="tw-space-y-4">
                <button v-for="item in menuItems" :key="item.id" @click="currentStep = item.id" class="tw-w-full tw-flex tw-items-center tw-justify-between tw-py-4 tw-border-b tw-border-gray-50 tw-text-gray-600 tw-font-bold hover:tw-text-[#4B3E8E] group">
                  <div class="tw-flex tw-items-center tw-gap-4">
                    <component :is="item.icon" class="tw-w-5 tw-h-5 tw-text-[#BCAF92] group-hover:tw-text-[#4B3E8E]" />
                    <span>{{ item.label }}</span>
                  </div>
                  <ChevronRight class="tw-w-5 tw-h-5 tw-text-gray-300" />
                </button>
              </nav>
              <div class="tw-mt-10">
                <button @click="handleLogout" class="tw-w-full tw-py-4 tw-bg-gray-50 tw-text-gray-400 tw-rounded-2xl tw-font-bold hover:tw-bg-red-50 hover:tw-text-red-500">ログアウト</button>
              </div>
            </div>
            <div v-else-if="currentStep === 'profile'" key="profile"><DrawerProfile /></div>
            <div v-else-if="currentStep === 'history'" key="history"><DrawerHistory /></div>
            <div v-else-if="currentStep === 'general'" key="general"><DrawerGeneral /></div>
            <div v-else-if="currentStep === 'points'" key="points"><DrawerPoints /></div>
            <div v-else-if="currentStep === 'feedback'" key="feedback"><DrawerFeedback /></div>
          </transition>
        </div>
      </aside>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight, X, User, History, Settings, Award, MessageCircle } from 'lucide-vue-next'
const { user, userDisplayName, userPhotoURL, logout } = useAuth()
const { isDrawerOpen, currentStep, closeDrawer } = useDrawer()

const menuItems = [
  { id: 'profile', label: '登録情報', icon: User },
  { id: 'general', label: '設定・言語', icon: Settings },
  { id: 'points', label: 'ポイント', icon: Award },
  { id: 'history', label: '履歴', icon: History },
  { id: 'feedback', label: 'フィードバック', icon: MessageCircle },
] as const

const currentStepTitle = computed(() => {
  if (currentStep.value === 'menu') return 'My Account'
  return menuItems.find(i => i.id === currentStep.value)?.label || ''
})

const handleLogout = async () => {
  await logout()
  closeDrawer()
}
</script>

<style scoped>
.drawer-fade-enter-active, .drawer-fade-leave-active { transition: opacity 0.4s ease; }
.drawer-fade-enter-from, .drawer-fade-leave-to { opacity: 0; }
.drawer-slide-enter-active, .drawer-slide-leave-active { transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
.drawer-slide-enter-from, .drawer-slide-leave-to { transform: translateX(110%); }
.step-fade-enter-active, .step-fade-leave-active { transition: all 0.25s ease; }
.step-fade-enter-from { opacity: 0; transform: translateX(20px); }
.step-fade-leave-to { opacity: 0; transform: translateX(-20px); }
</style>