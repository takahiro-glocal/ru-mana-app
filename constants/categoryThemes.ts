import type { Component } from 'vue'

export interface CategoryThemeConfig {
  bg: string
  border: string
  text: string
  dot: string
  btnBg?: string
  textBg?: string
}

/**
 * カテゴリごとのテーマ設定（SoT: 全ページで共有）
 */
export const CATEGORY_THEMES: Record<string, CategoryThemeConfig> = {
  transport: { bg: 'tw-bg-[#E0F2F7]', border: 'tw-border-[#A5D1E1]', text: 'tw-text-[#5FB3D5]', dot: 'tw-bg-[#A5D1E1]', btnBg: 'tw-bg-[#5FB3D5]', textBg: 'tw-bg-[#5FB3D5]' },
  public:    { bg: 'tw-bg-[#FCE7EB]', border: 'tw-border-[#F4A7B9]', text: 'tw-text-[#E95295]', dot: 'tw-bg-[#F4A7B9]', btnBg: 'tw-bg-[#E95295]', textBg: 'tw-bg-[#E95295]' },
  spa:       { bg: 'tw-bg-[#E5F1F6]', border: 'tw-border-[#7DB9DE]', text: 'tw-text-[#3E91FF]', dot: 'tw-bg-[#7DB9DE]', btnBg: 'tw-bg-[#3E91FF]', textBg: 'tw-bg-[#3E91FF]' },
  cafe:      { bg: 'tw-bg-[#FFF3E0]', border: 'tw-border-[#F5B169]', text: 'tw-text-[#F39800]', dot: 'tw-bg-[#F5B169]', btnBg: 'tw-bg-[#F39800]', textBg: 'tw-bg-[#F39800]' },
  shopping:  { bg: 'tw-bg-[#F3E5F5]', border: 'tw-border-[#CE93D8]', text: 'tw-text-[#9C27B0]', dot: 'tw-bg-[#CE93D8]', btnBg: 'tw-bg-[#9C27B0]', textBg: 'tw-bg-[#9C27B0]' },
  hotel:     { bg: 'tw-bg-[#E8F5E9]', border: 'tw-border-[#81C784]', text: 'tw-text-[#4CAF50]', dot: 'tw-bg-[#81C784]', btnBg: 'tw-bg-[#4CAF50]', textBg: 'tw-bg-[#4CAF50]' },
  culture:   { bg: 'tw-bg-[#FFEBEE]', border: 'tw-border-[#E57373]', text: 'tw-text-[#F44336]', dot: 'tw-bg-[#E57373]', btnBg: 'tw-bg-[#F44336]', textBg: 'tw-bg-[#F44336]' },
  trash:     { bg: 'tw-bg-[#ECEFF1]', border: 'tw-border-[#90A4AE]', text: 'tw-text-[#607D8B]', dot: 'tw-bg-[#90A4AE]', btnBg: 'tw-bg-[#607D8B]', textBg: 'tw-bg-[#607D8B]' },
  new:       { bg: 'tw-bg-[#F3E5F5]', border: 'tw-border-[#B28FCE]', text: 'tw-text-[#9C27B0]', dot: 'tw-bg-[#B28FCE]', btnBg: 'tw-bg-[#9C27B0]', textBg: 'tw-bg-[#9C27B0]' },
}

export const getCategoryTheme = (id: string): CategoryThemeConfig => CATEGORY_THEMES[id] || CATEGORY_THEMES.new
