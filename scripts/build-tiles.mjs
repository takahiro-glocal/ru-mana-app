/**
 * CSVデータを緯度/経度ベースのタイルJSONに分割するビルドスクリプト
 *
 * Usage: node scripts/build-tiles.mjs
 *
 * Input:  public/data/japan_facilities_dataset.csv
 * Output: public/data/tiles/{latBin}_{lngBin}.json + index.json
 */

import { createReadStream, mkdirSync, writeFileSync, rmSync, existsSync } from 'fs'
import { createInterface } from 'readline'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const CSV_PATH = resolve(ROOT, 'public/data/japan_facilities_dataset.csv')
const TILES_DIR = resolve(ROOT, 'public/data/tiles')
const TILE_SIZE = 0.5

// CSV category -> short code
const CATEGORY_CODE = {
  medical: 'm',
  evacuation_site: 'e',
  shelter: 's',
  police: 'p',
  fire_station: 'f',
  grocery: 'g',
}

function parseCsvLine(line) {
  const fields = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"'
        i++
      } else if (ch === '"') {
        inQuotes = false
      } else {
        current += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === ',') {
        fields.push(current)
        current = ''
      } else {
        current += ch
      }
    }
  }
  fields.push(current)
  return fields
}

async function main() {
  console.log('Building facility tiles...')

  // Clean and create tiles directory
  if (existsSync(TILES_DIR)) {
    rmSync(TILES_DIR, { recursive: true })
  }
  mkdirSync(TILES_DIR, { recursive: true })

  const tiles = new Map()
  let totalRows = 0
  let skippedRows = 0
  let isHeader = true

  const rl = createInterface({
    input: createReadStream(CSV_PATH, { encoding: 'utf-8' }),
    crlfDelay: Infinity,
  })

  for await (const rawLine of rl) {
    // Strip BOM
    const line = rawLine.replace(/^\uFEFF/, '')

    if (isHeader) {
      isHeader = false
      continue
    }

    const fields = parseCsvLine(line)
    if (fields.length < 5) {
      skippedRows++
      continue
    }

    const [category, name, address, latStr, lngStr] = fields
    const code = CATEGORY_CODE[category]
    if (!code) {
      skippedRows++
      continue
    }

    const la = parseFloat(latStr)
    const lo = parseFloat(lngStr)
    if (isNaN(la) || isNaN(lo)) {
      skippedRows++
      continue
    }

    const latBin = Math.floor(la / TILE_SIZE)
    const lngBin = Math.floor(lo / TILE_SIZE)
    const key = `${latBin}_${lngBin}`

    if (!tiles.has(key)) {
      tiles.set(key, [])
    }
    tiles.get(key).push({
      c: code,
      n: name,
      a: address,
      la: Math.round(la * 1000000) / 1000000,
      lo: Math.round(lo * 1000000) / 1000000,
    })

    totalRows++
  }

  // Write tile files
  const index = {}
  for (const [key, facilities] of tiles) {
    const filePath = resolve(TILES_DIR, `${key}.json`)
    writeFileSync(filePath, JSON.stringify(facilities))
    index[key] = facilities.length
  }

  // Write index
  writeFileSync(resolve(TILES_DIR, 'index.json'), JSON.stringify(index))

  console.log(`Done! ${totalRows} facilities -> ${tiles.size} tiles (${skippedRows} rows skipped)`)
}

main().catch((err) => {
  console.error('Build failed:', err)
  process.exit(1)
})
