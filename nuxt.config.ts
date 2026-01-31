export default defineNuxtConfig({
  app: {
    head: {
      link: [
        // iOS Safari用ホーム画面アイコン
        {
          rel: 'apple-touch-icon',
          href: '/images/logo.png', // 180x180など推奨
          sizes: '180x180'
        }
      ],
      meta: [
        // 必須：PWAとして認識させる
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        // iOSのステータスバーの色を設定
        // appleStatusBarStyle: 'black-translucent' は
        // <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        // に変換されるため、直接 meta 配列に記述します。
        {
          name: 'apple-mobile-web-app-status-bar-style',
          content: 'black-translucent'
        }
      ],
    }
  },
  modules: [
    '@nuxtjs/i18n',
    '@vite-pwa/nuxt',
    '@nuxtjs/tailwindcss',
  ],
  // 💡 ここに Tailwind CSS の設定を追加します
  tailwindcss: {
    // どの設定ファイルをTailwind CSSの設定として使用するかを指定します。
    // デフォルトでは 'tailwind.config.js' ですが、明示すると制御しやすいです。
    configPath: 'tailwind.config.js',

    // 開発時に設定ファイルを監視するかどうか (通常はtrueで良い)
    exposeConfig: true,

    // configPath で指定したファイルに prefix を定義していれば、
    // ここで prefix を指定する必要はありません。
    // prefix: 'tw-', // ← configPathで定義するので、ここは不要（念のためコメントアウト）
  },
  css: ['~/assets/css/main.css'],
  i18n: {
    /**
     * 利用する言語の定義
     */
    locales: [
      { code: 'ja', iso: 'ja-JP', name: '日本語', file: 'ja.json' },
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
      { code: 'zh', iso: 'zh-CN', name: '简体中文', file: 'zh.json' },
    ],

    /**
     * 翻訳ファイル（UI文言）を置くディレクトリ
     */
    langDir: 'locales/',

    /**
     * デフォルト言語
     */
    defaultLocale: 'ja',

    /**
     * URL戦略 (SEOに強く推奨)
     * defaultLocaleが 'ja' の場合:
     * / (日本語ページ)
     * /en (英語ページ)
     * /zh (中国語ページ)
     */
    strategy: 'prefix_except_default',

    /**
     * ブラウザの言語設定を検出してリダイレクトする
     */
    detectBrowserLanguage: {
      useCookie: true, // 言語設定をクッキーに保存
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // ルート (/) に来た時だけ検出
    },

    /**
     * vue-i18n本体の設定
     */
    vueI18n: './i18n.config.ts', // (後述)
  },
  pwa: {
    manifest: {
      name: 'Gem Studio',
      short_name: 'Gem Studio',
      description: '未来の思考を、あなたの手に。ビジョナリーなAIとの対話。',
      lang: 'ja',
      theme_color: '#000000', // ヘッダーの色（漆黒）
      background_color: '#000000', // スプラッシュ画面の背景
      display: 'standalone', // fullscreenよりも安定性が高く推奨されます
      start_url: '/',
      orientation: 'portrait',
      icons: [
        {
          src: 'images/logo.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'images/logo.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'images/logo.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable' // Android等で丸や四角に切り抜かれても良い設定
        }
      ],
    },
    // Workbox設定（オフラインキャッシュ）
    workbox: {
      navigateFallback: '/',
      // ここでFCMのService Workerロジックをインポートする
      importScripts: ['/firebase-messaging-sw.js'], // または '/firebase-messaging-sw.js'
    },
    // デバイスへのインストールを促す設定
    devOptions: {
      enabled: true,
      type: 'module'
    }
  },
  vite: {
    define: {
      global: 'globalThis'
    },
  },
  runtimeConfig: {
    public: {
      googleMapsApiKey: process.env.GOOGLE_MAP_API_KEY,
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      databaseURL: process.env.DATABASE_URL,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
      googleFcmPublicVapidKey: process.env.GOOGLE_FCM_PUBLICVAPIDKEY,
    }
  },
  ssr: false,
  devtools: { enabled: false },
})
