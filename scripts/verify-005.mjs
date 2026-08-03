/**
 * Ad-hoc verification for ticket 005 acceptance criteria.
 * Checks: hand absent <768px, nav buttons >=44px, no console errors.
 * Captures screenshots to shots/005/.
 */
import { chromium } from 'playwright'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SHOTS = path.resolve(__dirname, '../shots/005')
const BASE = 'http://localhost:4321'

const WIDTHS = [1440, 1280, 768, 600, 390, 320]
// widths >= 768 should show hand, < 768 should not
const HAND_WIDTHS = [1440, 1280, 768]
const NO_HAND_WIDTHS = [600, 390, 320]

let failures = 0

async function run() {
  const browser = await chromium.launch()
  const ctx = await browser.newContext()
  const page = await ctx.newPage()

  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))

  await page.goto(BASE, { waitUntil: 'networkidle' })

  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 })
    await page.waitForTimeout(500) // let React hydrate + motion settle

    const label = `w${width}`

    // Screenshot
    await page.screenshot({ path: path.join(SHOTS, `${label}.png`), fullPage: false })
    console.warn(`📸 ${label}.png`)

    // 1. Nav button height ≥ 44px
    const btnHeight = await page.evaluate(() => {
      const btn = document.querySelector('.btn-nav-blog, .btn-nav-gh, .btn-nav-resume')
      if (!btn) return null
      return btn.getBoundingClientRect().height
    })
    if (btnHeight === null) {
      console.error(`  ✗ [${width}] nav button not found`)
      failures++
    } else if (btnHeight < 44) {
      console.error(`  ✗ [${width}] nav button height ${btnHeight.toFixed(1)}px < 44px`)
      failures++
    } else {
      console.warn(`  ✓ [${width}] nav button height ${btnHeight.toFixed(1)}px ≥ 44px`)
    }

    // 2. Hand visibility — look for the HAND img specifically
    const handVisible = await page.evaluate(() => {
      const hand = document.querySelector('img[src*="HAND"]')
      return hand !== null
    })

    if (HAND_WIDTHS.includes(width)) {
      if (!handVisible) {
        console.error(`  ✗ [${width}] ParallaxHand expected but absent`)
        failures++
      } else {
        console.warn(`  ✓ [${width}] ParallaxHand present`)
      }
    } else if (NO_HAND_WIDTHS.includes(width)) {
      if (handVisible) {
        console.error(`  ✗ [${width}] ParallaxHand should be absent below 768px but found`)
        failures++
      } else {
        console.warn(`  ✓ [${width}] ParallaxHand absent (correct for <768px)`)
      }
    }

    // 3. No horizontal overflow
    const overflows = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth
    })
    if (overflows) {
      console.error(`  ✗ [${width}] horizontal overflow detected (scrollWidth > innerWidth)`)
      failures++
    } else {
      console.warn(`  ✓ [${width}] no horizontal overflow`)
    }
  }

  if (errors.length > 0) {
    console.error(`\n✗ Console/page errors:`)
    errors.forEach((e) => console.error(`  ${e}`))
    failures++
  }

  await browser.close()

  if (failures > 0) {
    console.error(`\n✗ ${failures} failure(s)`)
    process.exit(1)
  } else {
    console.warn(`\n✓ All checks passed`)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
