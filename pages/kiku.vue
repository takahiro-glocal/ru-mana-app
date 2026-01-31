<template>
  <div class="tw-min-h-screen tw-bg-ru-bg tw-pb-24">
    <header class="tw-bg-white/80 tw-backdrop-blur-md tw-sticky tw-top-0 tw-z-30 tw-border-b tw-border-pink-100">
      <div class="tw-max-w-2xl tw-mx-auto tw-px-4 tw-py-4">
        <h1 class="tw-text-2xl tw-font-bold tw-text-gray-800 tw-mb-4">{{ $t('kiku.title') }}</h1>
        
        <div class="tw-flex tw-space-x-1 tw-bg-pink-50/50 tw-p-1 tw-rounded-xl">
          <button 
            v-for="tab in ['feed', 'questions', 'tips']" 
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'tw-flex-1 tw-py-2 tw-text-sm tw-font-medium tw-rounded-lg tw-transition-all',
              activeTab === tab ? 'tw-bg-white tw-text-ru-kiku tw-shadow-sm' : 'tw-text-gray-500 hover:tw-text-gray-700'
            ]"
          >
            {{ $t(`kiku.tab_${tab}`) }}
          </button>
        </div>
      </div>
    </header>

    <main class="tw-max-w-2xl tw-mx-auto tw-px-4 tw-mt-6 tw-space-y-6">
      <section class="tw-bg-white tw-rounded-2xl tw-shadow-sm tw-p-4 tw-border tw-border-pink-50">
        <div class="tw-flex tw-space-x-4">
          <div class="tw-w-10 tw-h-10 tw-rounded-full tw-bg-pink-100 tw-flex-shrink-0 tw-flex tw-items-center tw-justify-center">
            <User class="tw-w-6 tw-h-6 tw-text-ru-kiku" />
          </div>
          <div class="tw-flex-1">
            <textarea 
              v-model="newPostContent"
              :placeholder="$t('kiku.post_placeholder')"
              class="tw-w-full tw-border-none focus:tw-ring-0 tw-resize-none tw-text-gray-700 tw-placeholder-gray-400 tw-text-sm"
              rows="2"
            ></textarea>
            <div class="tw-flex tw-justify-between tw-items-center tw-mt-2 tw-pt-2 tw-border-t tw-border-gray-50">
              <div class="tw-flex tw-space-x-2">
                <button class="tw-p-2 tw-text-gray-400 hover:tw-text-ru-kiku tw-transition-colors">
                  <ImagePlus class="tw-w-5 tw-h-5" />
                </button>
                <button class="tw-p-2 tw-text-gray-400 hover:tw-text-ru-kiku tw-transition-colors">
                  <Languages class="tw-w-5 tw-h-5" />
                </button>
              </div>
              <button 
                @click="submitPost"
                :disabled="!newPostContent.trim()"
                class="tw-bg-ru-kiku tw-text-white tw-px-6 tw-py-1.5 tw-rounded-full tw-text-sm tw-font-bold disabled:tw-opacity-50 disabled:tw-cursor-not-allowed hover:tw-bg-pink-600 tw-transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </section>

      <transition-group name="list" tag="div" class="tw-space-y-4">
        <article 
          v-for="post in filteredPosts" 
          :key="post.id"
          class="tw-bg-white tw-rounded-2xl tw-shadow-sm tw-p-5 tw-border tw-border-gray-50 hover:tw-border-pink-100 tw-transition-colors"
        >
          <div class="tw-flex tw-justify-between tw-items-start tw-mb-3">
            <div class="tw-flex tw-items-center tw-space-x-3">
              <div class="tw-w-10 tw-h-10 tw-rounded-full tw-bg-gray-100 tw-overflow-hidden">
                <img :src="post.userAvatar" :alt="post.userName" class="tw-w-full tw-h-full tw-object-cover">
              </div>
              <div>
                <h3 class="tw-text-sm tw-font-bold tw-text-gray-800">{{ post.userName }}</h3>
                <span class="tw-text-[10px] tw-text-gray-400">{{ post.timeAgo }}</span>
              </div>
            </div>
            <span class="tw-px-2 tw-py-0.5 tw-bg-gray-100 tw-text-gray-500 tw-rounded-md tw-text-[10px] tw-font-bold">
              {{ post.lang.toUpperCase() }}
            </span>
          </div>

          <p class="tw-text-gray-700 tw-text-sm tw-leading-relaxed tw-mb-3">
            {{ post.content }}
          </p>

          <div v-if="post.tags.length" class="tw-flex tw-wrap tw-gap-2 tw-mb-4">
            <span v-for="tag in post.tags" :key="tag" class="tw-text-xs tw-text-ru-kiku tw-bg-pink-50 tw-px-2 tw-py-0.5 tw-rounded">
              #{{ tag }}
            </span>
          </div>

          <div class="tw-flex tw-items-center tw-space-x-6 tw-pt-3 tw-border-t tw-border-gray-50">
            <button 
              @click="toggleLike(post.id)"
              class="tw-flex tw-items-center tw-space-x-1.5 tw-transition-colors"
              :class="post.isLiked ? 'tw-text-ru-kiku' : 'tw-text-gray-400 hover:tw-text-ru-kiku'"
            >
              <Heart :class="['tw-w-5 tw-h-5', post.isLiked ? 'tw-fill-current' : '']" />
              <span class="tw-text-xs">{{ $t('kiku.reaction_count', { n: post.likes }) }}</span>
            </button>
            <button class="tw-flex tw-items-center tw-space-x-1.5 tw-text-gray-400 hover:tw-text-gray-600 tw-transition-colors">
              <MessageCircle class="tw-w-5 tw-h-5" />
              <span class="tw-text-xs">Reply</span>
            </button>
            <button class="tw-flex tw-items-center tw-text-gray-400 hover:tw-text-gray-600 tw-ml-auto">
              <Share2 class="tw-w-4 tw-h-4" />
            </button>
          </div>
        </article>
      </transition-group>
    </main>

    <button class="lg:tw-hidden tw-fixed tw-bottom-24 tw-right-6 tw-w-14 tw-h-14 tw-bg-ru-kiku tw-text-white tw-rounded-full tw-shadow-lg tw-flex tw-items-center tw-justify-center hover:tw-scale-110 tw-transition-transform tw-z-40">
      <PenLine class="tw-w-6 tw-h-6" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { 
  User, 
  ImagePlus, 
  Languages, 
  Heart, 
  MessageCircle, 
  Share2, 
  PenLine 
} from 'lucide-vue-next';

// ---------------------------------------------------------
// Logic & State
// ---------------------------------------------------------

const { t } = useI18n();
const activeTab = ref('feed');
const newPostContent = ref('');

// Mock Data
const posts = ref([
  {
    id: 1,
    userName: 'Alex Smith',
    userAvatar: 'https://i.pravatar.cc/150?u=alex',
    timeAgo: '2h ago',
    content: 'Found a very kind person in Kawagoe who helped me find the bus stop. Japanese hospitality is real! 🌸',
    tags: ['Kawagoe', 'Kindness'],
    category: 'feed',
    lang: 'en',
    likes: 24,
    isLiked: false
  },
  {
    id: 2,
    userName: 'Yuki',
    userAvatar: 'https://i.pravatar.cc/150?u=yuki',
    timeAgo: '5h ago',
    content: 'How do I pay at a local izakaya? Do I pay at the table or at the register?',
    tags: ['Dining', 'Help'],
    category: 'questions',
    lang: 'ja',
    likes: 8,
    isLiked: true
  },
  {
    id: 3,
    userName: 'Li Wei',
    userAvatar: 'https://i.pravatar.cc/150?u=li',
    timeAgo: '1d ago',
    content: 'Tip: Use the "Mirumana" map to find the cleanest restrooms in the area. Saved me today!',
    tags: ['TravelTip', 'Useful'],
    category: 'tips',
    lang: 'en',
    likes: 42,
    isLiked: false
  }
]);

// ---------------------------------------------------------
// Computed & Functions
// ---------------------------------------------------------

const filteredPosts = computed(() => {
  if (activeTab.value === 'feed') return posts.value;
  return posts.value.filter(post => post.category === activeTab.value);
});

const submitPost = () => {
  if (!newPostContent.value.trim()) return;

  const newPost = {
    id: Date.now(),
    userName: 'Guest User',
    userAvatar: 'https://i.pravatar.cc/150?u=guest',
    timeAgo: 'Just now',
    content: newPostContent.value,
    tags: ['New'],
    category: activeTab.value === 'feed' ? 'feed' : activeTab.value,
    lang: 'en',
    likes: 0,
    isLiked: false
  };

  posts.value.unshift(newPost);
  newPostContent.value = '';
};

const toggleLike = (postId: number) => {
  const post = posts.value.find(p => p.id === postId);
  if (post) {
    post.isLiked = !post.isLiked;
    post.likes += post.isLiked ? 1 : -1;
  }
};

// ---------------------------------------------------------
// Meta
// ---------------------------------------------------------

useHead(() => ({
  title: t('kiku.title')
}));
</script>

<style scoped>
/* List Animation */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>