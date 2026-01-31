// i18n.config.ts
import { defineI18nConfig } from '#i18n'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'ja',
  fallbackLocale: 'ja'
  // messages プロパティは nuxt.config.ts の langDir 経由で読み込まれるため不要
}))