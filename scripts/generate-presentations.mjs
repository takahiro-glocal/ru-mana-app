/**
 * PPTX Presentation Generator for RUUMANA (るうまな)
 *
 * Generates two presentation decks:
 * 1. investor-deck.pptx — For investors (funding, market, revenue)
 * 2. partner-deck.pptx — For partners (service overview, use cases)
 *
 * Usage: node scripts/generate-presentations.mjs
 */

import PptxGenJS from 'pptxgenjs'
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// ── Brand Colors ──
const COLORS = {
  purple: '4B3E8E',
  pink: 'E4007F',
  beige: 'F9F5E7',
  gold: 'BCAF92',
  dark: '2C3E50',
  green: '85C441',
  white: 'FFFFFF',
  gray: '6B7280',
  lightGray: 'F3F4F6',
}

// ── File Paths ──
const LOGO_PATH = resolve(ROOT, 'public/images/logo.png')
const SCREENSHOTS = {
  top: resolve(ROOT, 'public/screenshots/Screenshot_top.jpg'),
  shiru: resolve(ROOT, 'public/screenshots/Screenshot_shiru_top.jpg'),
  qa: resolve(ROOT, 'public/screenshots/Screenshot_q_and_a.jpg'),
  rule: resolve(ROOT, 'public/screenshots/Screenshot_rule_and_manner.jpg'),
  thread: resolve(ROOT, 'public/screenshots/Screenshot_thread.jpg'),
}
const OUTPUT_DIR = resolve(ROOT, 'docs/presentations')

// ── Helper: Add logo to slide ──
function addLogo(slide, opts = {}) {
  const { x = 0.4, y = 0.3, w = 0.7, h = 0.7 } = opts
  if (existsSync(LOGO_PATH)) {
    slide.addImage({ path: LOGO_PATH, x, y, w, h })
  }
}

// ── Helper: Add screenshot(s) to a slide ──
function addScreenshot(slide, key, opts = {}) {
  const path = SCREENSHOTS[key]
  if (!path || !existsSync(path)) return
  const { x = 1.5, y = 1.5, w = 2.5, h = 4.5 } = opts
  slide.addImage({ path, x, y, w, h, rounding: true })
}

// ── Helper: Title slide template ──
function makeTitleSlide(pptx) {
  const slide = pptx.addSlide()
  slide.background = { color: COLORS.purple }

  addLogo(slide, { x: 4.1, y: 0.8, w: 1.8, h: 1.8 })

  slide.addText('るうまな', {
    x: 0.5, y: 2.8, w: 9, h: 0.8,
    fontSize: 40, fontFace: 'Arial',
    color: COLORS.white, bold: true, align: 'center',
  })
  slide.addText('RUUMANA', {
    x: 0.5, y: 3.5, w: 9, h: 0.5,
    fontSize: 20, fontFace: 'Arial',
    color: COLORS.gold, align: 'center',
  })
  slide.addText('異なる文化を持つ人同士が\n安心して交流できる社会を実現する', {
    x: 0.5, y: 4.2, w: 9, h: 0.8,
    fontSize: 14, fontFace: 'Arial',
    color: COLORS.white, align: 'center', lineSpacingMultiple: 1.5,
  })
  return slide
}

// ── Helper: Section header slide ──
function makeSectionSlide(pptx, title, subtitle = '') {
  const slide = pptx.addSlide()
  slide.background = { color: COLORS.dark }

  slide.addText(title, {
    x: 0.5, y: 2.0, w: 9, h: 1.0,
    fontSize: 32, fontFace: 'Arial',
    color: COLORS.white, bold: true, align: 'center',
  })
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.5, y: 3.0, w: 9, h: 0.6,
      fontSize: 14, fontFace: 'Arial',
      color: COLORS.gold, align: 'center',
    })
  }
  return slide
}

// ── Helper: Content slide with bullet points ──
function makeContentSlide(pptx, title, bullets, opts = {}) {
  const slide = pptx.addSlide()
  slide.background = { color: COLORS.white }

  // Top accent bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 0.08, fill: { color: COLORS.purple },
  })

  addLogo(slide, { x: 8.8, y: 0.2, w: 0.5, h: 0.5 })

  slide.addText(title, {
    x: 0.6, y: 0.3, w: 8, h: 0.6,
    fontSize: 22, fontFace: 'Arial',
    color: COLORS.purple, bold: true,
  })

  const bulletRows = bullets.map(b => ({
    text: b,
    options: {
      fontSize: 13, fontFace: 'Arial', color: COLORS.dark,
      bullet: { code: '25CF', color: COLORS.pink },
      paraSpaceAfter: 8,
    },
  }))

  slide.addText(bulletRows, {
    x: 0.8, y: opts.bulletY || 1.2, w: 8.2, h: 3.8,
    valign: 'top', lineSpacingMultiple: 1.4,
  })

  return slide
}

// ── Helper: Table slide ──
function makeTableSlide(pptx, title, headers, rows) {
  const slide = pptx.addSlide()
  slide.background = { color: COLORS.white }

  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 0.08, fill: { color: COLORS.purple },
  })

  addLogo(slide, { x: 8.8, y: 0.2, w: 0.5, h: 0.5 })

  slide.addText(title, {
    x: 0.6, y: 0.3, w: 8, h: 0.6,
    fontSize: 22, fontFace: 'Arial',
    color: COLORS.purple, bold: true,
  })

  const headerRow = headers.map(h => ({
    text: h, options: { fontSize: 11, bold: true, color: COLORS.white, fill: { color: COLORS.purple }, align: 'center' },
  }))

  const dataRows = rows.map(row =>
    row.map(cell => ({
      text: cell, options: { fontSize: 11, color: COLORS.dark, fill: { color: COLORS.lightGray }, align: 'center', paraSpaceAfter: 2 },
    }))
  )

  slide.addTable([headerRow, ...dataRows], {
    x: 0.5, y: 1.2, w: 9,
    border: { type: 'solid', pt: 0.5, color: 'D1D5DB' },
    colW: Array(headers.length).fill(9 / headers.length),
    rowH: 0.5,
    autoPage: false,
  })

  return slide
}

// ────────────────────────────────────────────────
// Investor Deck
// ────────────────────────────────────────────────
async function generateInvestorDeck() {
  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_WIDE'
  pptx.author = 'RUUMANA Team'
  pptx.title = 'るうまな — 投資家向けプレゼンテーション'

  // 1. Title
  makeTitleSlide(pptx)

  // 2. Mission & Principles
  const slide2 = makeContentSlide(pptx, 'ミッション & 5つの原則', [
    'ミッション: 異なる文化を持つ人同士が安心して交流できる社会を実現する',
    '① 否定しない — 文化の違いを優劣や正誤で判断しない',
    '② 争わない — 文化の違いで対立しない',
    '③ 個を尊重する — 国籍ではなく一人ひとりの「個」を見る',
    '④ 共生 — 相互理解と尊重に基づく共生社会の実現',
    '⑤ 楽しく学ぶ — 堅苦しくない、楽しみながら学べる文化体験',
  ])

  // 3. Problem — Visitors
  makeContentSlide(pptx, '訪日外国人が抱える課題', [
    '日本独特のマナーやルールがわからず不安を感じる',
    '言語の壁で困った時に助けを求められない',
    '文化の違いによる意図しないトラブルが発生する',
    '緊急時（病気・紛失・災害）の対処がわからない',
  ])

  // 4. Problem — Businesses
  makeContentSlide(pptx, '受け入れ側が抱える課題', [
    '外国人利用者とのコミュニケーションコストが高い',
    'マナー違反への対応に苦慮',
    '多言語対応の負担が大きい',
    '文化的な配慮が求められるが体系的な知識がない',
  ])

  // 5. Solution
  makeSectionSlide(pptx, 'るうまな（RUUMANA）', '知りたいマナーや解決策に、1タップでアクセス')

  // 6. Four Pillars
  makeTableSlide(pptx, '4つの柱', ['', 'しるまな（知る）', 'みるまな（見る）', 'きくまな（聞く）', 'いくまな（行く）'], [
    ['概要', 'マナー・文化を学ぶ', '文化コンテンツで楽しく学ぶ', '体験を共有する', '文化を体験する'],
    ['状態', '公開中', '構想中', '構想中', '構想中'],
    ['価値', '正しい知識の提供', '楽しい学習体験', '多様な視点の獲得', 'リアルな文化体験'],
  ])

  // 7. Product Screenshots
  const slide7 = pptx.addSlide()
  slide7.background = { color: COLORS.white }
  slide7.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: COLORS.purple } })
  addLogo(slide7, { x: 8.8, y: 0.2, w: 0.5, h: 0.5 })
  slide7.addText('プロダクト画面', {
    x: 0.6, y: 0.3, w: 8, h: 0.6,
    fontSize: 22, fontFace: 'Arial', color: COLORS.purple, bold: true,
  })
  // Add screenshots side by side
  const ssKeys = ['top', 'shiru', 'qa', 'rule']
  ssKeys.forEach((key, i) => {
    const path = SCREENSHOTS[key]
    if (existsSync(path)) {
      slide7.addImage({ path, x: 0.4 + i * 2.3, y: 1.2, w: 2.0, h: 3.8 })
    }
  })
  slide7.addText([
    { text: 'ホーム画面', options: { fontSize: 9, color: COLORS.gray } },
    { text: '        しるまなカテゴリ', options: { fontSize: 9, color: COLORS.gray } },
    { text: '        Q&A掲示板', options: { fontSize: 9, color: COLORS.gray } },
    { text: '        ルール・マナー', options: { fontSize: 9, color: COLORS.gray } },
  ], { x: 0.4, y: 5.1, w: 9, h: 0.4 })

  // 8. Technology
  makeContentSlide(pptx, '技術的特長', [
    'PWA対応 — アプリストア不要、ブラウザからインストール可能',
    'AI搭載 — Google Gemini による高品質なチャット応答と翻訳',
    'リアルタイム — 掲示板の投稿がリアルタイムに反映',
    '3言語対応 — 日本語・英語・中国語（今後拡張予定）',
    'オフライン対応 — ローカルキャッシュで一部機能がオフラインでも利用可能',
    'サーバーレス — Firebase基盤で低コスト運用、自動スケール',
  ])

  // 9. Market
  const slide9 = makeContentSlide(pptx, '市場規模', [
    '訪日外国人旅行者: 年間3,600万人以上（過去最高を更新中）',
    '在留外国人: 約340万人（留学生・技能実習生・永住者）',
    '訪日旅行者の困りごと第1位: コミュニケーション・文化の違い',
    'インバウンド市場規模: 約8兆円（2025年推計）',
  ])

  // 10. Business Model
  makeTableSlide(pptx, 'ビジネスモデル', ['収益源', '価格/料率', '内容'], [
    ['プレミアムプラン', '¥500/月', '広告非表示、AI優先応答、限定コンテンツ'],
    ['事業者スターター', '¥5,000/月', '多言語マナーガイドの施設埋込、基本分析'],
    ['事業者ビジネス', '¥20,000/月', 'カスタムガイド作成、詳細分析、API利用'],
    ['いくまな手数料', '10-15%', '文化体験イベント予約の手数料'],
    ['ネイティブ広告', 'CPM ¥500-1,000', 'コンテンツに溶け込む非侵入型広告'],
  ])

  // 11. Revenue Simulation
  makeTableSlide(pptx, '収支シミュレーション', ['項目', 'Phase 2 (MAU 5K)', 'Phase 3 (MAU 20K)'], [
    ['プレミアム会員', '¥125,000', '¥500,000'],
    ['事業者サブスク', '-', '¥200,000'],
    ['その他（広告・手数料）', '¥25,000', '¥200,000'],
    ['収入合計', '¥150,000', '¥900,000'],
    ['支出合計', '¥120,000', '¥680,000'],
    ['損益', '+¥30,000', '+¥220,000'],
  ])

  // 12. Roadmap
  makeContentSlide(pptx, 'ロードマップ', [
    '2026 Q1-Q2（現在）Phase 1: MVP公開 — しるまな・おたすけ・防災マップ・AIチャット',
    '2026 Q3-Q4  Phase 2: コンテンツ拡充 — みるまな・クイズ・言語追加（韓・西・仏）',
    '2027 Q1-Q2  Phase 3: コミュニティ＆体験 — きくまな・いくまな・事業者ダッシュボード',
    '2027 Q3〜   Phase 4: 収益化＆グローバル展開 — サブスク・広告・他国展開',
  ])

  // 13. KPI & Funding
  makeTableSlide(pptx, 'KPI & 資金調達', ['フェーズ', 'MAU', 'MRR', '資金調達'], [
    ['Phase 1', '1,000', '¥0（無料）', '-'],
    ['Phase 2', '5,000', '¥150,000', 'シード 500万〜1,000万円'],
    ['Phase 3', '20,000', '¥900,000', 'シリーズA 3,000万〜5,000万円'],
    ['Phase 4', '100,000', '¥5,000,000+', 'シリーズB 1億円〜'],
  ])

  // 14. Contact
  const slide14 = pptx.addSlide()
  slide14.background = { color: COLORS.purple }
  addLogo(slide14, { x: 4.1, y: 1.0, w: 1.8, h: 1.8 })
  slide14.addText('お問い合わせ', {
    x: 0.5, y: 3.0, w: 9, h: 0.7,
    fontSize: 30, fontFace: 'Arial', color: COLORS.white, bold: true, align: 'center',
  })
  slide14.addText('アプリ内のフィードバック機能または\nお問い合わせフォームよりご連絡ください', {
    x: 0.5, y: 3.8, w: 9, h: 0.8,
    fontSize: 14, fontFace: 'Arial', color: COLORS.gold, align: 'center', lineSpacingMultiple: 1.5,
  })
  slide14.addText('るうまな（RUUMANA）', {
    x: 0.5, y: 4.8, w: 9, h: 0.5,
    fontSize: 12, fontFace: 'Arial', color: COLORS.white, align: 'center',
  })

  const outPath = resolve(OUTPUT_DIR, 'investor-deck.pptx')
  await pptx.writeFile({ fileName: outPath })
  console.log(`✓ 投資家向けデッキ生成: ${outPath}`)
}

// ────────────────────────────────────────────────
// Partner Deck
// ────────────────────────────────────────────────
async function generatePartnerDeck() {
  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_WIDE'
  pptx.author = 'RUUMANA Team'
  pptx.title = 'るうまな — パートナー向けプレゼンテーション'

  // 1. Title
  makeTitleSlide(pptx)

  // 2. Service Overview
  makeContentSlide(pptx, 'るうまなとは？', [
    '「ルール」と「マナー」を組み合わせた異文化理解プラットフォーム',
    '日本の文化・マナー・生活ルールを楽しく・温かく・否定せずに伝える',
    '訪日外国人と地域社会の相互理解を促進',
    '3言語対応（日本語・英語・中国語）、AIチャット搭載',
    'PWA対応 — ブラウザからすぐ利用可能',
  ])

  // 3. Visitor Problems
  makeContentSlide(pptx, '訪日外国人が抱える課題', [
    '日本独特のマナーやルールがわからず不安を感じる',
    '言語の壁で困った時に助けを求められない',
    '文化の違いによる意図しないトラブルが発生する',
    '緊急時の対処法がわからない',
  ])

  // 4. Business Problems
  makeContentSlide(pptx, '事業者側の課題', [
    '外国人利用者へのマナー説明コストが高い',
    'マナー違反への対応に苦慮',
    '多言語対応の負担が大きい',
    '体系的な外国人対応ノウハウがない',
  ])

  // 5. Four Pillars
  makeTableSlide(pptx, '4つの柱', ['', 'しるまな（知る）', 'みるまな（見る）', 'きくまな（聞く）', 'いくまな（行く）'], [
    ['概要', 'マナー・文化を学ぶ', '文化コンテンツで楽しく学ぶ', '体験を共有する', '文化を体験する'],
    ['状態', '公開中', '構想中', '構想中', '構想中'],
    ['価値', '正しい知識の提供', '楽しい学習体験', '多様な視点の獲得', 'リアルな文化体験'],
  ])

  // 6. Product Screenshots
  const slide6 = pptx.addSlide()
  slide6.background = { color: COLORS.white }
  slide6.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: COLORS.purple } })
  addLogo(slide6, { x: 8.8, y: 0.2, w: 0.5, h: 0.5 })
  slide6.addText('プロダクト画面', {
    x: 0.6, y: 0.3, w: 8, h: 0.6,
    fontSize: 22, fontFace: 'Arial', color: COLORS.purple, bold: true,
  })
  const ssKeys = ['top', 'shiru', 'rule', 'thread']
  ssKeys.forEach((key, i) => {
    const path = SCREENSHOTS[key]
    if (existsSync(path)) {
      slide6.addImage({ path, x: 0.4 + i * 2.3, y: 1.2, w: 2.0, h: 3.8 })
    }
  })
  slide6.addText([
    { text: 'ホーム画面', options: { fontSize: 9, color: COLORS.gray } },
    { text: '        カテゴリ一覧', options: { fontSize: 9, color: COLORS.gray } },
    { text: '        ルール・マナー', options: { fontSize: 9, color: COLORS.gray } },
    { text: '        スレッド', options: { fontSize: 9, color: COLORS.gray } },
  ], { x: 0.4, y: 5.1, w: 9, h: 0.4 })

  // 7. Use Cases
  makeContentSlide(pptx, '活用シーン', [
    '宿泊施設: チェックイン時にるうまなのQRコードを提供 → 旅館マナーを事前学習',
    '飲食店: 食事マナーのガイドへのリンクを店内掲示',
    '交通機関: 車内マナーのガイドを多言語で案内',
    '自治体: 地域のルールやゴミ分別をるうまなで配信',
    '観光案内所: QRコード設置で外国人旅行者に直接案内',
  ])

  // 8. Future Features for Partners
  makeContentSlide(pptx, '事業者向け機能（将来）', [
    '事業者ダッシュボード — 外国人対応のインサイト・分析',
    'カスタムガイドの作成・配信 — 自社施設に合わせたマナーガイド',
    'いくまなとの連携 — 文化体験イベントの企画・集客',
    '多言語対応ツール — 施設内の案内を多言語で自動生成',
    'API提供 — 自社サービスへのマナーガイド埋め込み',
  ])

  // 9. Five Principles
  makeTableSlide(pptx, '5つの理念', ['#', '理念', '意味'], [
    ['1', '否定しない', '文化に優劣はない。違いを否定しない'],
    ['2', '争わない', '文化の違いで対立しない。橋渡し役になる'],
    ['3', '個を尊重する', '国籍ではなく、一人ひとりの「個」を大切に'],
    ['4', '共生', '相互理解に基づく共生社会の実現'],
    ['5', '楽しく学ぶ', '堅苦しくない、温かく楽しい文化学習'],
  ])

  // 10. Contact
  const slide10 = pptx.addSlide()
  slide10.background = { color: COLORS.purple }
  addLogo(slide10, { x: 4.1, y: 1.0, w: 1.8, h: 1.8 })
  slide10.addText('パートナーシップのご相談', {
    x: 0.5, y: 3.0, w: 9, h: 0.7,
    fontSize: 28, fontFace: 'Arial', color: COLORS.white, bold: true, align: 'center',
  })
  slide10.addText('るうまなに関するご質問、連携のご相談は\nアプリ内のフィードバック機能または\nお問い合わせフォームよりご連絡ください', {
    x: 0.5, y: 3.8, w: 9, h: 1.0,
    fontSize: 14, fontFace: 'Arial', color: COLORS.gold, align: 'center', lineSpacingMultiple: 1.5,
  })
  slide10.addText('るうまな（RUUMANA）', {
    x: 0.5, y: 4.9, w: 9, h: 0.5,
    fontSize: 12, fontFace: 'Arial', color: COLORS.white, align: 'center',
  })

  const outPath = resolve(OUTPUT_DIR, 'partner-deck.pptx')
  await pptx.writeFile({ fileName: outPath })
  console.log(`✓ パートナー向けデッキ生成: ${outPath}`)
}

// ── Main ──
async function main() {
  console.log('プレゼンテーション生成を開始...\n')
  await generateInvestorDeck()
  await generatePartnerDeck()
  console.log('\n完了！ 出力先: docs/presentations/')
}

main().catch(err => {
  console.error('生成エラー:', err)
  process.exit(1)
})
