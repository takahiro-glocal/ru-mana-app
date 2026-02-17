<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="tw-fixed tw-inset-0 tw-z-[100] tw-flex tw-items-center tw-justify-center tw-p-4">
      <div class="tw-absolute tw-inset-0 tw-bg-black/40 tw-backdrop-blur-sm" @click="close"></div>
      
      <div class="tw-relative tw-w-full tw-max-w-md tw-bg-white tw-rounded-[2.5rem] tw-shadow-2xl tw-overflow-hidden tw-flex tw-flex-col">
        <div class="tw-bg-[#4B3E8E] tw-h-32 tw-flex tw-items-center tw-justify-center tw-relative">
          <div class="tw-absolute tw-top-[-50%] tw-left-[-20%] tw-w-64 tw-h-64 tw-bg-[#E4007F] tw-rounded-full tw-opacity-20 tw-blur-3xl"></div>
          <div class="tw-absolute tw-bottom-[-50%] tw-right-[-20%] tw-w-64 tw-h-64 tw-bg-[#85C441] tw-rounded-full tw-opacity-20 tw-blur-3xl"></div>
          
          <img src="/images/logo.png" alt="Logo" class="tw-w-20 tw-h-20 tw-bg-white tw-rounded-full tw-p-1 tw-shadow-lg tw-z-10" />
          
          <button @click="close" class="tw-absolute tw-top-4 tw-right-4 tw-text-white/70 hover:tw-text-white tw-bg-black/10 tw-rounded-full tw-p-1">
            <X class="tw-w-6 tw-h-6" />
          </button>
        </div>

        <div class="tw-p-8">
          <h2 class="tw-text-center tw-text-2xl tw-font-bold tw-text-gray-800 tw-mb-6">
            {{ isRegister ? 'アカウント作成' : 'おかえりなさい！' }}
          </h2>

          <button 
            @click="handleGoogleLogin"
            class="tw-w-full tw-flex tw-items-center tw-justify-center tw-gap-3 tw-bg-white tw-border-2 tw-border-gray-100 tw-text-gray-600 tw-font-bold tw-py-3 tw-rounded-full tw-mb-6 hover:tw-bg-gray-50 tw-transition-colors"
          >
            <svg class="tw-w-5 tw-h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Googleで{{ isRegister ? '登録' : 'ログイン' }}
          </button>

          <div class="tw-relative tw-text-center tw-mb-6">
            <span class="tw-bg-white tw-px-4 tw-text-xs tw-text-gray-400 tw-relative tw-z-10">またはメールアドレスで</span>
            <div class="tw-absolute tw-top-1/2 tw-left-0 tw-w-full tw-h-px tw-bg-gray-100 tw-z-0"></div>
          </div>

          <form @submit.prevent="handleSubmit" class="tw-space-y-4">
            <div>
              <input 
                v-model="email" 
                type="email" 
                placeholder="メールアドレス" 
                required
                class="tw-w-full tw-bg-gray-50 tw-text-gray-800 tw-rounded-2xl tw-py-3 tw-px-5 tw-border-2 tw-border-transparent focus:tw-border-[#85C441] focus:tw-bg-white tw-outline-none tw-transition-all"
              />
            </div>
            <div>
              <input 
                v-model="password" 
                type="password" 
                placeholder="パスワード (6文字以上)" 
                required
                minlength="6"
                class="tw-w-full tw-bg-gray-50 tw-text-gray-800 tw-rounded-2xl tw-py-3 tw-px-5 tw-border-2 tw-border-transparent focus:tw-border-[#85C441] focus:tw-bg-white tw-outline-none tw-transition-all"
              />
            </div>
            
            <div v-if="errorMsg" class="tw-text-red-500 tw-text-xs tw-text-center tw-font-bold">
              {{ errorMsg }}
            </div>

            <button 
              type="submit"
              :disabled="isLoading"
              class="tw-w-full tw-bg-[#E4007F] tw-text-white tw-font-bold tw-py-3.5 tw-rounded-full tw-shadow-lg active:tw-scale-95 tw-transition-all hover:tw-bg-[#c0006b] disabled:tw-opacity-50"
            >
              {{ isLoading ? '処理中...' : (isRegister ? 'アカウント作成' : 'ログイン') }}
            </button>
          </form>

          <div class="tw-text-center tw-mt-6">
            <button @click="toggleMode" class="tw-text-sm tw-text-gray-500 hover:tw-text-[#4B3E8E] tw-font-bold">
              {{ isRegister ? 'すでにアカウントをお持ちの方はこちら' : 'アカウントをお持ちでない方はこちら' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { X } from 'lucide-vue-next';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close']);

const { loginWithGoogle, registerWithEmail, loginWithEmail } = useAuth();

const isRegister = ref(false);
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMsg = ref('');

const close = () => {
  emit('close');
  // Reset form slightly delayed
  setTimeout(() => {
    email.value = '';
    password.value = '';
    errorMsg.value = '';
    isLoading.value = false;
  }, 300);
};

const toggleMode = () => {
  isRegister.value = !isRegister.value;
  errorMsg.value = '';
};

const handleGoogleLogin = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  try {
    await loginWithGoogle();
    close();
  } catch (e: any) {
    errorMsg.value = 'Googleログインに失敗しました';
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  try {
    if (isRegister.value) {
      await registerWithEmail(email.value, password.value);
    } else {
      await loginWithEmail(email.value, password.value);
    }
    close();
  } catch (e: any) {
    // Firebaseのエラーコードに応じた簡易メッセージ
    if (e.code === 'auth/email-already-in-use') {
      errorMsg.value = 'このメールアドレスは既に使用されています';
    } else if (e.code === 'auth/wrong-password' || e.code === 'auth/user-not-found') {
      errorMsg.value = 'メールアドレスまたはパスワードが正しくありません';
    } else if (e.code === 'auth/weak-password') {
      errorMsg.value = 'パスワードが弱すぎます';
    } else {
      errorMsg.value = 'エラーが発生しました。もう一度お試しください。';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style>