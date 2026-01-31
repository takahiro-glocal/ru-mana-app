// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'tw-',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        'ru-shiru': '#85C441',  // 緑
        'ru-miru': '#F26522',   // オレンジ
        'ru-kiku': '#E4007F',   // ピンク
        'ru-iku': '#0099DD',    // 水色
        'ru-trouble': '#E60012', // おたすけ赤
        'ru-bg': '#F9F5E7',     // 全体背景色（画像のクリーム色）
      },
    },
  },
}