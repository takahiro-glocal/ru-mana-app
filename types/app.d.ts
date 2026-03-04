// types/app.d.ts

import type { Component } from 'vue'

interface AppNavigation {
  title: string;
  path: string;
  icon: string;
  color: string;
}

interface UserExperience {
  id: string;
  userId: string;
  category: 'shiru' | 'miru' | 'kiku' | 'iku';
  content: string;
  createdAt: Date;
}

interface ShiruCategory {
  id: string
  name: string
  updateDate: string
  threadCount: number
  icon: string
}

interface ShiruThread {
  id: string
  categoryId: string
  title: string
  date: string
  count: number
}

/**
 * スレッド内の個別投稿（レス）の定義
 */
interface ShiruPost {
  id: string;          // 投稿ID (p1, p2...)
  userName: string;    // ユーザー名
  userIcon: string;    // ユーザーアイコンURL
  date: string;        // 投稿日時 (2025/12/17(水) 07:33)
  body: string;        // 投稿本文
  isOfficial: boolean; // 公式アカウントフラグ
}

/**
 * スレッド詳細（投稿一覧）の定義
 */
interface ShiruThreadDetail {
  threadId: string;    // スレッドID (t1, t2...)
  title: string;       // スレッドタイトル
  posts: ShiruPost[];  // 投稿配列
}

/**
 * 文化・マナーガイドのデータ構造
 */
interface CultureGuide {
  id: string;
  categoryId: string;
  title: string;
  icon: string; // アイコン名を文字列で保持 (例: 'droplets')
  desc: string;
  good: string;
  bad: string;
}

/**
 * カテゴリIDをキーとしたガイドのマップ
 */
interface CultureGuideMap {
  [key: string]: CultureGuide[];
}

// types/settings.d.ts

interface BrowsingHistory {
  threadId: string;
  categoryId: string;
  title: string;
  viewedAt: string; // ISO string
}

interface Country {
    id: string
    name: string
    nameEng: string
    code: string
    flag: string
    initialX?: number
    initialY?: number
    initialZ?: number
    initialAngle?: number
    rotationDuration?: number
    layerRadius?: number
    rotationDirection?: string
    randomDelay?: number
    randomDuration?: number
    animationName?: 'perspective3D' | 'perspective3DR'
}

/**
 * テーマ設定 (しるまなカテゴリ用)
 */
interface CategoryTheme {
  bg: string;
  border?: string;
  text: string;
  dot: string;
  btnBg?: string;
  textBg?: string;
}

/**
 * マップピン (みるまな用)
 */
interface MapSpot {
  id: number;
  type: 'sightseeing' | 'shelter' | 'wifi' | 'restroom';
  name: string;
  address: string;
  distance: number;
  x: number;
  y: number;
}

/**
 * ポイント履歴アイテム
 */
interface PointHistoryItem {
  id: string;
  amount: number;
  reason: string;
  createdAt: FirebaseTimestamp;
}

/**
 * Firebase Timestamp型 (Firestoreの{ seconds, nanoseconds }構造)
 */
interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
}

/**
 * 天気API レスポンス
 */
interface WeatherResponse {
  main: { temp: number };
  name: string;
  weather: Array<{ main: string }>;
}

/**
 * Firebase Auth User の最小型 (createThread用)
 */
interface FirebaseUserInfo {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
}