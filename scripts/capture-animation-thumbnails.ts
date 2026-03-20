/**
 * アニメーションサムネイル生成スクリプト
 *
 * 各アニメーションHTMLファイルをPlaywrightで開き、
 * 特徴的な瞬間のスクリーンショットをサムネイルとして保存する。
 *
 * Usage: npx tsx scripts/capture-animation-thumbnails.ts
 */
import { chromium } from 'playwright-core'
import { join } from 'path'
import { mkdirSync, existsSync, readdirSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = join(fileURLToPath(import.meta.url), '..')
const publicDir = join(__dirname, '..', 'public', 'animation')
const outputDir = join(publicDir, 'thumbnails')

interface AnimationConfig {
  id: string
  /** ミリ秒 — アニメーションの特徴的な瞬間までの待機時間 */
  delay: number
}

const animations: AnimationConfig[] = [
  { id: 'brush-torii', delay: 3000 },
  { id: 'flags-gathering', delay: 2500 },
  { id: 'circle-of-hands', delay: 2500 },
  { id: 'walking-together', delay: 2500 },
  { id: 'flags-particles', delay: 2500 },
  { id: 'just-one-human', delay: 3000 },
  { id: 'glass-intro', delay: 3000 },
  { id: 'human-first', delay: 3000 },
]

function findChromiumExecutable(): string | undefined {
  const cacheDir = join(process.env.HOME || '/root', '.cache', 'ms-playwright')
  if (!existsSync(cacheDir)) return undefined

  const dirs = readdirSync(cacheDir).filter((d) => d.startsWith('chromium-')).sort().reverse()
  for (const dir of dirs) {
    const candidates = [
      join(cacheDir, dir, 'chrome-linux', 'chrome'),
      join(cacheDir, dir, 'chrome-linux64', 'chrome'),
    ]
    const hsDir = dir.replace('chromium-', 'chromium_headless_shell-')
    candidates.push(
      join(cacheDir, hsDir, 'chrome-linux', 'headless_shell'),
      join(cacheDir, hsDir, 'chrome-linux64', 'headless_shell'),
    )
    for (const c of candidates) {
      if (existsSync(c)) return c
    }
  }
  return undefined
}

async function main() {
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  const executablePath = findChromiumExecutable()
  console.log(`Using browser: ${executablePath || 'default'}`)

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--allow-file-access-from-files'],
    ...(executablePath ? { executablePath } : {}),
  })

  // Block all external network requests (fonts, CDNs) to avoid timeout
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  })
  await context.route('https://**', (route) => route.abort())
  await context.route('http://**', (route) => route.abort())

  for (const anim of animations) {
    const filePath = join(publicDir, `${anim.id}.html`)
    if (!existsSync(filePath)) {
      console.warn(`⚠ ${anim.id}.html not found, skipping`)
      continue
    }

    console.log(`📸 Capturing ${anim.id} (wait ${anim.delay}ms)...`)
    const page = await context.newPage()
    // Remove external stylesheet links before loading to avoid font timeout
    await page.route('**/*', async (route) => {
      const url = route.request().url()
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return route.abort()
      }
      return route.continue()
    })
    await page.goto(`file://${filePath}`, { waitUntil: 'commit', timeout: 10000 })

    // Force document.fonts.ready to resolve by clearing pending font loads
    await page.evaluate(() => {
      // Remove link elements that load external fonts
      document.querySelectorAll('link[href*="fonts"]').forEach((el) => el.remove())
    })

    await page.waitForTimeout(anim.delay)

    const outputPath = join(outputDir, `${anim.id}.png`)
    // Use a raw CDP screenshot to bypass font waiting
    const cdp = await page.context().newCDPSession(page)
    const result = await cdp.send('Page.captureScreenshot', { format: 'png' })
    const { writeFileSync } = await import('fs')
    writeFileSync(outputPath, Buffer.from(result.data, 'base64'))
    await page.close()
    console.log(`  ✓ Saved ${outputPath}`)
  }

  await context.close()
  await browser.close()
  console.log('\n✅ All thumbnails generated.')
}

main().catch((err) => {
  console.error('Failed to generate thumbnails:', err)
  process.exit(1)
})
