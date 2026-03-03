<template>
      <div class="tw-bg-transparent tw-rounded-3xl tw-p-8 tw-text-center">
        <div class="tw-relative tw-inline-block tw-mb-6">
          <img :src="currentPhotoURL" class="tw-w-28 tw-h-28 tw-rounded-full tw-border-4 tw-border-gray-100 tw-object-cover" />
          <div
            class="tw-absolute tw-bottom-0 tw-right-0 tw-bg-[#85C441] tw-p-2 tw-rounded-full tw-text-white tw-border-2 tw-border-white tw-cursor-pointer active:tw-scale-95 tw-transition-transform"
            @click="fileInput?.click()"
          >
            <Camera class="tw-w-4 tw-h-4" />
          </div>
          <input ref="fileInput" type="file" accept="image/*" class="tw-hidden" @change="handleFileSelect" />
        </div>
        <p v-if="uploadStatus" :class="['tw-text-xs tw-mb-4 tw-font-bold', uploadStatus.includes('失敗') ? 'tw-text-red-500' : 'tw-text-[#85C441]']">
          {{ uploadStatus }}
        </p>

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
            :disabled="isSaving"
            :class="[
              'tw-w-full tw-font-bold tw-py-3.5 tw-rounded-full tw-shadow-md active:tw-scale-95 tw-transition-all',
              isSaving ? 'tw-bg-gray-300 tw-text-gray-500' : 'tw-bg-[#E4007F] tw-text-white'
            ]"
          >
            {{ isSaving ? '保存中...' : '保存する' }}
          </button>
          <p v-if="saveMessage" class="tw-text-center tw-text-sm tw-font-bold tw-text-[#85C441]">{{ saveMessage }}</p>
        </form>
      </div>
</template>

<script setup lang="ts">
import { Camera } from 'lucide-vue-next'
import { updateProfile as firebaseUpdateProfile } from 'firebase/auth'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

const { user, userPhotoURL } = useAuth()
const { $storage } = useNuxtApp()

const name = ref(user.value?.displayName || '')
const currentPhotoURL = ref(userPhotoURL.value)
const fileInput = ref<HTMLInputElement | null>(null)
const uploadStatus = ref('')
const isSaving = ref(false)
const saveMessage = ref('')

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !user.value) return

  if (file.size > MAX_FILE_SIZE) {
    uploadStatus.value = 'ファイルサイズは2MB以下にしてください'
    return
  }

  if (!file.type.startsWith('image/')) {
    uploadStatus.value = '画像ファイルを選択してください'
    return
  }

  uploadStatus.value = 'アップロード中...'
  try {
    const fileRef = storageRef($storage, `avatars/${user.value.uid}`)
    await uploadBytes(fileRef, file)
    const url = await getDownloadURL(fileRef)

    await firebaseUpdateProfile(user.value, { photoURL: url })
    currentPhotoURL.value = url
    uploadStatus.value = '写真を更新しました'
  } catch (e) {
    console.error('Upload failed:', e)
    uploadStatus.value = 'アップロードに失敗しました'
  }
}

const updateProfile = async () => {
  if (!user.value) return
  isSaving.value = true
  saveMessage.value = ''
  try {
    await firebaseUpdateProfile(user.value, {
      displayName: name.value
    })
    saveMessage.value = 'プロフィールを更新しました'
  } catch (e) {
    saveMessage.value = '更新に失敗しました'
  } finally {
    isSaving.value = false
  }
}
</script>
