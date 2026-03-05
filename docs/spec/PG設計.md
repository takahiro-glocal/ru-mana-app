# PG設計書（プログラム設計）

## ドキュメント情報

| 項目 | 内容 |
|------|------|
| プロジェクト名 | るうまな（RUUMANA） |
| バージョン | 1.0 |
| 最終更新日 | 2026-03-05 |

---

## 1. 技術スタック

| レイヤー | 技術 | バージョン |
|----------|------|-----------|
| フレームワーク | Nuxt 3 | ^3.17.5 |
| UIフレームワーク | Vue 3 (Composition API) | ^3.5.17 |
| 言語 | TypeScript | Nuxt内蔵 |
| CSS | Tailwind CSS (`tw-` prefix) | ^6.14.0 (@nuxtjs/tailwindcss) |
| ルーティング | Vue Router (Nuxt File-based) | ^4.5.1 |
| 国際化 | @nuxtjs/i18n | ^10.1.1 |
| PWA | @vite-pwa/nuxt | ^1.0.7 |
| アイコン | lucide-vue-next | ^0.563.0 |
| HTMLサニタイズ | dompurify | ^3.2.6 |
| バックエンド | Firebase (Auth / Firestore / Storage) | ^12.8.0 |
| AI | @google/generative-ai (Gemini) | ^0.24.1 |
| 地図 | @googlemaps/js-api-loader | ^2.0.2 |

---

## 2. コーディング規約

### 2.1 ファイル命名規則

| 対象 | 規則 | 例 |
|------|------|------|
| ページ | kebab-case | `disaster-prevention.vue` |
| コンポーネント | PascalCase | `GlobalChat.vue` |
| Composables | camelCase (use接頭辞) | `useFirestore.ts` |
| 型定義 | PascalCase (Interface) | `ChatMessage` |
| 定数 | UPPER_SNAKE_CASE | `KNOWLEDGE_BASE` |
| i18n キー | dot.separated.lowercase | `shiru.cat_transport` |

### 2.2 Vue コンポーネント構成

```vue
<template>
  <!-- テンプレート -->
</template>

<script setup lang="ts">
// 1. import文
// 2. composable呼び出し
// 3. リアクティブ状態定義
// 4. computed
// 5. 関数定義
// 6. ライフサイクルフック
// 7. useHead (SEO)
</script>

<style scoped>
/* コンポーネントスコープCSS */
</style>
```

### 2.3 Tailwind CSS 規約

- 全クラスに `tw-` プレフィックス必須（`tailwind.config.js` で設定）
- レスポンシブ: `tw-block md:tw-hidden` のようにモバイルファーストで記述
- カスタムカラー: `tw-bg-ru-shiru`, `tw-text-ru-kiku` 等の定義済みカラーを使用

---

## 3. Composable 設計パターン

### 3.1 基本パターン

```typescript
// composables/useExample.ts
export const useExample = () => {
  // グローバル状態（useState: SSR対応、コンポーネント間で共有）
  const state = useState<Type>('unique-key', () => initialValue)

  // ローカル状態
  const localState = ref<Type>(initialValue)

  // computed
  const derived = computed(() => /* ... */)

  // メソッド
  const doSomething = async () => { /* ... */ }

  return { state, derived, doSomething }
}
```

### 3.2 シングルトンパターン（useAuth）

```typescript
// モジュールスコープで状態を保持 → 全コンポーネントで同一インスタンス
const user = shallowRef<User | null>(null)
let initialized = false

export const useAuth = () => {
  if (!initialized) {
    // 初回のみ実行
    initialized = true
    onAuthStateChanged(auth, (u) => { user.value = u })
  }
  return { user, /* ... */ }
}
```

### 3.3 Firestore リアルタイム購読パターン

```typescript
export const useFirestore = () => {
  const posts = ref<Post[]>([])

  const subscribeToPosts = (threadId: string) => {
    const q = query(
      collection(db, 'threads', threadId, 'posts'),
      orderBy('createdAt', 'asc')
    )
    // onSnapshot はリアルタイムリスナーを返す
    const unsubscribe = onSnapshot(q, (snapshot) => {
      posts.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    })
    return unsubscribe  // コンポーネントの onUnmounted で呼ぶ
  }

  return { posts, subscribeToPosts }
}
```

---

## 4. ページ実装詳細

### 4.1 pages/index.vue（ホーム）

| セクション | 実装 |
|-----------|------|
| メイン4メニュー | NuxtLink (shiru) / @click showComingSoon (miru/kiku/iku) |
| 天気ウィジェット | OpenWeatherMap API + ジオロケーション |
| 最新スレッド | useFirestore.subscribeToLatestThreads(5) |
| Google Maps | useMapsLoader + カスタムパルスオーバーレイ |
| モバイルフッター | mobileFooterItems computed (DL/設定/プロフ/メニュー) |
| Coming Soonトースト | route.query.coming_soon パラメータで検知 |
| 検索 | allThreadsForSearch をクライアントサイドフィルタ (300msデバウンス) |

### 4.2 pages/shiru/category/[cid]/thread/[tid].vue（スレッド詳細）

| 機能 | 実装 |
|------|------|
| 投稿一覧 | subscribeToPosts(tid) でリアルタイム |
| 投稿作成 | addPost() → Firestore |
| 返信引用 | replyTo state → UI表示 + replyToId/replyToName/replyToText 保存 |
| いいね | likePost() + localStorage重複チェック |
| 翻訳 | useTranslation().translateText() per post |
| 編集/削除 | userId === post.userId でボタン表示制御 |
| 自動スクロール | watch(posts, scrollToBottom) |
| 引用クリック | scrollIntoView + ハイライト(1.5秒) |
| 閲覧履歴追加 | addHistory() on mount |

---

## 5. コンポーネント実装詳細

### 5.1 AuthModal.vue

```
props: { isOpen: boolean }
emits: ['close']

状態:
  - mode: 'login' | 'register'
  - email, password: string
  - error: string
  - isProcessing: boolean

メソッド:
  - handleGoogleLogin()   → useAuth().loginWithGoogle()
  - handleEmailSubmit()   → mode === 'login' ? loginWithEmail : registerWithEmail
  - handleError(e)        → Firebaseエラーコード → ローカライズメッセージ
```

### 5.2 GlobalChat.vue

```
モバイル: 全画面パネル（bottom → top スライド）
デスクトップ: FABボタン + 400x600px ダイアログ

状態:
  - inputText: string
  - suggestedPrompts: 3つの初期サジェスト
  - textareaRef: HTMLTextAreaElement

操作:
  - Enter: 送信, Shift+Enter: 改行
  - textarea自動リサイズ
  - 新メッセージ時に自動スクロール
  - Markdownフォーマット（**太字**, 改行）
```

### 5.3 ThreadCreateModal.vue

```
props: { isOpen: boolean, categoryId: string }
emits: ['close', 'created']

入力: title, body
処理: useFirestore().createThread(categoryId, title, body, user)
```

---

## 6. プラグイン

### 6.1 firebase.client.ts

```typescript
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const app = initializeApp({
    apiKey: config.public.apiKey,
    authDomain: config.public.authDomain,
    // ...
  })

  const firestore = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentSingleTabManager({}),
    }),
  })

  return {
    provide: {
      firestore,
      auth: getAuth(app),
      storage: getStorage(app),
    }
  }
})
```

Firestore のローカルキャッシュ有効化により、オフライン時もキャッシュデータを表示可能。

---

## 7. ビルド・デプロイ

### 7.1 ビルドコマンド

```bash
# 開発
npm run dev          # http://localhost:3000

# 本番ビルド
npm run build        # .output/public/ に静的ファイル生成

# デプロイ
npm run deploy       # build + firebase deploy --only hosting

# プレビュー
npm run preview      # ローカルで本番ビルドを確認
```

### 7.2 ビルド出力

```
.output/public/
├── index.html        # SPAエントリポイント
├── 200.html          # SPA フォールバック
├── 404.html          # 404ページ
├── _nuxt/            # JS/CSS バンドル
├── sw.js             # Service Worker
├── workbox-*.js      # Workbox ランタイム
├── manifest.webmanifest  # PWA マニフェスト
├── icons/            # アイコン画像
├── images/           # 画像アセット
└── api-mocks/        # モックデータ
```

### 7.3 環境変数

```bash
# env.dev をテンプレートとして .env を作成
cp env.dev .env

# 必須変数:
API_KEY=xxx                    # Firebase
AUTH_DOMAIN=xxx                # Firebase
PROJECT_ID=xxx                 # Firebase
STORAGE_BUCKET=xxx             # Firebase
MESSAGING_SENDER_ID=xxx        # Firebase
APP_ID=xxx                     # Firebase
GEMINI_API_KEY=xxx             # Google AI
GOOGLE_MAP_API_KEY=xxx         # Google Maps
OPEN_WEATHER_API_KEY=xxx       # OpenWeatherMap
```

---

## 8. テスト方針

### 8.1 手動テストチェックリスト

| 機能 | 確認項目 |
|------|----------|
| 認証 | Google OAuth ポップアップ/リダイレクト、メール登録/ログイン |
| しるまな | カテゴリ一覧、スレッド表示、投稿/編集/削除/いいね |
| チャット | メッセージ送受信、多言語応答、履歴保持 |
| 翻訳 | タイトル自動翻訳、本文手動翻訳、キャッシュ動作 |
| おたすけ | 電話発信、ステップガイド表示、現在地コピー |
| 防災マップ | 地図表示、カテゴリフィルタ、現在地追跡 |
| ドロワー | 各セクション遷移、プロフィール編集、言語切替 |
| PWA | インストールプロンプト、オフライン表示 |
| Coming Soon | /miru, /kiku, /iku へのアクセスでリダイレクト |
| レスポンシブ | モバイル/タブレット/デスクトップ表示切替 |
