/**
 * タイルJSONの施設名・住所を Gemini API で英語・中国語に翻訳するスクリプト
 *
 * Usage:
 *   GEMINI_API_KEY=xxx node scripts/translate-tiles.mjs
 *   GEMINI_API_KEY=xxx node scripts/translate-tiles.mjs --batch-size 40 --delay 200
 *
 * Options:
 *   --batch-size <n>  1回のAPIリクエストで翻訳する文字列数 (default: 50)
 *   --delay <ms>      APIリクエスト間のディレイ (default: 150)
 *   --reset           進捗をリセットして最初から翻訳
 *
 * 中断しても再実行すれば未完了タイルから再開します。
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { GoogleGenerativeAI } from '@google/generative-ai'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const TILES_DIR = resolve(ROOT, 'public/data/tiles')
const PROGRESS_FILE = resolve(__dirname, '.translate-progress.json')
const TARGET_LANGS = ['en', 'zh']

// --------------- CLI args ---------------
const args = process.argv.slice(2)
const flag = (name) => args.includes(name)
const opt = (name, def) => {
  const i = args.indexOf(name)
  return i !== -1 && args[i + 1] ? args[i + 1] : def
}

const BATCH_SIZE = parseInt(opt('--batch-size', '50'), 10)
const DELAY_MS = parseInt(opt('--delay', '150'), 10)
const RESET = flag('--reset')

// --------------- Gemini setup ---------------
const API_KEY = process.env.GEMINI_API_KEY
if (!API_KEY) {
  console.error('Error: GEMINI_API_KEY environment variable is required')
  process.exit(1)
}

const genAI = new GoogleGenerativeAI(API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

// --------------- Progress tracking ---------------
function loadProgress() {
  if (RESET || !existsSync(PROGRESS_FILE)) return {}
  try {
    return JSON.parse(readFileSync(PROGRESS_FILE, 'utf-8'))
  } catch {
    return {}
  }
}

function saveProgress(progress) {
  writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2))
}

// --------------- Translation ---------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Gemini に日本語テキスト配列を渡し、en/zh 翻訳を取得
 * @param {string[]} texts - 翻訳対象の日本語テキスト
 * @param {string} targetLang - 'en' or 'zh'
 * @returns {Promise<string[]>} 翻訳結果（入力と同じ順序・同じ長さ）
 */
async function translateBatch(texts, targetLang) {
  const langName = targetLang === 'en' ? 'English' : 'Simplified Chinese'

  const prompt = `Translate the following Japanese texts to ${langName}.
Return ONLY a JSON array of translated strings, in the same order as the input.
Do NOT add explanations, notes, or markdown formatting.
For proper nouns (facility names, place names), use the standard ${langName} transliteration or translation.
For addresses, translate prefecture/city/district names and keep number formats.

Input JSON array:
${JSON.stringify(texts)}`

  const maxRetries = 3
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt)
      const responseText = result.response.text().trim()

      // Extract JSON array from response (may be wrapped in ```json ... ```)
      const jsonMatch = responseText.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error(`No JSON array found in response: ${responseText.slice(0, 200)}`)
      }

      const parsed = JSON.parse(jsonMatch[0])
      if (!Array.isArray(parsed) || parsed.length !== texts.length) {
        throw new Error(`Array length mismatch: expected ${texts.length}, got ${parsed?.length}`)
      }

      return parsed.map((t) => (typeof t === 'string' ? t : String(t)))
    } catch (err) {
      console.warn(`  Retry ${attempt + 1}/${maxRetries} for ${targetLang}: ${err.message}`)
      if (attempt < maxRetries - 1) await sleep(2000 * (attempt + 1))
      else throw err
    }
  }
}

/**
 * テキスト配列を BATCH_SIZE ごとに分割して翻訳
 */
async function translateAll(texts, targetLang) {
  const results = []
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE)
    const translated = await translateBatch(batch, targetLang)
    results.push(...translated)
    if (i + BATCH_SIZE < texts.length) await sleep(DELAY_MS)
  }
  return results
}

// --------------- Main ---------------
async function main() {
  console.log(`Translate tiles — batch=${BATCH_SIZE}, delay=${DELAY_MS}ms`)

  const indexPath = resolve(TILES_DIR, 'index.json')
  if (!existsSync(indexPath)) {
    console.error('index.json not found. Run "npm run build:tiles" first.')
    process.exit(1)
  }

  const index = JSON.parse(readFileSync(indexPath, 'utf-8'))
  const tileKeys = Object.keys(index)
  const progress = loadProgress()
  const remaining = tileKeys.filter((k) => !progress[k])

  console.log(`Total tiles: ${tileKeys.length}, Already done: ${tileKeys.length - remaining.length}, Remaining: ${remaining.length}`)

  for (let ti = 0; ti < remaining.length; ti++) {
    const key = remaining[ti]
    const tilePath = resolve(TILES_DIR, `${key}.json`)

    if (!existsSync(tilePath)) {
      console.warn(`Tile ${key}.json not found, skipping`)
      progress[key] = true
      saveProgress(progress)
      continue
    }

    const records = JSON.parse(readFileSync(tilePath, 'utf-8'))
    console.log(`[${ti + 1}/${remaining.length}] Tile ${key} (${records.length} records)`)

    // Collect unique strings to minimize API calls
    const uniqueNames = [...new Set(records.map((r) => r.n))]
    const uniqueAddrs = [...new Set(records.map((r) => r.a))]
    const allTexts = [...uniqueNames, ...uniqueAddrs]

    if (allTexts.length === 0) {
      progress[key] = true
      saveProgress(progress)
      continue
    }

    // Translate to each target language
    for (const lang of TARGET_LANGS) {
      try {
        console.log(`  Translating ${allTexts.length} unique strings to ${lang}...`)
        const translated = await translateAll(allTexts, lang)

        // Build lookup maps
        const nameMap = new Map()
        const addrMap = new Map()
        uniqueNames.forEach((n, i) => nameMap.set(n, translated[i]))
        uniqueAddrs.forEach((a, i) => addrMap.set(a, translated[uniqueNames.length + i]))

        // Apply translations to records
        const nKey = `n_${lang}`
        const aKey = `a_${lang}`
        for (const r of records) {
          r[nKey] = nameMap.get(r.n) || r.n
          r[aKey] = addrMap.get(r.a) || r.a
        }
      } catch (err) {
        console.error(`  Failed to translate tile ${key} to ${lang}: ${err.message}`)
        console.error('  Saving progress and stopping. Re-run to resume.')
        saveProgress(progress)
        process.exit(1)
      }
    }

    // Write enriched tile
    writeFileSync(tilePath, JSON.stringify(records))
    progress[key] = true
    saveProgress(progress)
  }

  console.log('All tiles translated successfully!')
}

main().catch((err) => {
  console.error('Translation failed:', err)
  process.exit(1)
})
