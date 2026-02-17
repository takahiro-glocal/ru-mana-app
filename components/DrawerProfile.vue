<template>
  <!-- <div class="tw-min-h-screen tw-bg-[#F9F5E7]"> -->
    <!-- <SettingsHeader title="登録情報" /> -->
    <!-- <div class="tw-p-6 tw-max-w-md tw-mx-auto"> -->
      <div class="tw-bg-transparent tw-rounded-3xl tw-p-8 tw-text-center">
        <div class="tw-relative tw-inline-block tw-mb-6">
          <img :src="userPhotoURL" class="tw-w-28 tw-h-28 tw-rounded-full tw-border-4 tw-border-gray-100" />
          <div class="tw-absolute tw-bottom-0 tw-right-0 tw-bg-[#85C441] tw-p-2 tw-rounded-full tw-text-white tw-border-2 tw-border-white">
            <Camera class="tw-w-4 tw-h-4" />
          </div>
        </div>
        
        <form @submit.prevent="updateProfile" class="tw-space-y-6 tw-text-left">
          <div>
            <label class="tw-block tw-text-xs tw-font-bold tw-text-gray-400 tw-mb-2">表示名</label>
            <input 
              v-model="name" 
              type="text" 
              class="tw-w-full tw-bg-gray-50 tw-rounded-xl tw-py-3 tw-px-4 tw-font-bold tw-text-gray-700 focus:tw-ring-2 focus:tw-ring-[#85C441] tw-outline-none"
            />
          </div>
          <div>
            <label class="tw-block tw-text-xs tw-font-bold tw-text-gray-400 tw-mb-2">メールアドレス</label>
            <div class="tw-w-full tw-bg-gray-100 tw-rounded-xl tw-py-3 tw-px-4 tw-text-gray-400 tw-text-sm">
              {{ user?.email }}
            </div>
          </div>
          <button 
            type="submit" 
            class="tw-w-full tw-bg-[#E4007F] tw-text-white tw-font-bold tw-py-3.5 tw-rounded-full tw-shadow-md active:tw-scale-95 tw-transition-all"
          >
            保存する
          </button>
        </form>
      </div>
    <!-- </div> -->
  <!-- </div> -->
</template>

<script setup lang="ts">
import { Camera } from 'lucide-vue-next'
import { updateProfile as firebaseUpdateProfile } from 'firebase/auth'

const { user, userPhotoURL } = useAuth()
const name = ref(user.value?.displayName || '')

const updateProfile = async () => {
  if (!user.value) return
  try {
    await firebaseUpdateProfile(user.value, {
      displayName: name.value
    })
    alert('プロフィールを更新しました')
    // リロードして反映（簡易対応）
    window.location.reload() 
  } catch (e) {
    alert('更新に失敗しました')
  }
}
</script>