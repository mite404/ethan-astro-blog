/**
 * verify-006.mjs — Ticket 006 acceptance verification.
 *
 * Walks 11 viewport widths, drives the portfolio as a user would (scroll,
 * click nav, navigate back), and asserts layout health at each width.
 *
 * Checks per width:
 *   1. No horizontal overflow
 *   2. Nav buttons ≥ 44px (WCAG 2.5.5 tap target)
 *   3. ParallaxHand present ≥768px, absent <768px
 *   4. Bio text legibility (≥16px computed font-size)
 *
 * Interaction per width: load → screenshot → scroll → click Blog → back → screenshot
 * Screenshots → shots/006/w{width}-{before,blog,after}.png
 * Exits 0 on all pass, non-zero on any failure.
 */

import { chromium } from 'playwright'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SHOTS = path.resolve(ROOT, 'shots/006')
const BASE = 'http://localhost:4321'
const WIDTHS = [1440, 1280, 1100, 1024, 900, 834, 768, 600, 430, 390, 320]
const HEIGHT = 900
const NAV_SELECTOR = '.btn-nav-blog, .btn-nav-gh, .btn-nav-resume'
const HAND = { selector: 'img[src*="HAND"]', threshold: 768 }

// Sandbox environment noise — not portfolio code errors.
// 403s: sandbox network policy blocks external CDN/media requests.
// frame-src/bilibili: blog posts embed iframes that can't load in a sandbox.
const NOISE = [/the server responded with a status of 403/i, /frame-src/i, /player\.bilibili\.com/i]

let failures = 0
let devProc = null

function pass(msg) {
  console.warn(`  ✓ ${msg}`)
}
function fail(msg) {
  console.error(`  ✗ ${msg}`)
  failures++
}

function checkMeasure(width, label, value, min, unit = 'px') {
  if (value === null) {
    fail(`[${width}] ${label} not found`)
  } else if (value < min) {
    fail(`[${width}] ${label} ${value.toFixed(1)}${unit} < ${min}${unit}`)
  } else {
    pass(`[${width}] ${label} ${value.toFixed(1)}${unit}`)
  }
}

async function probe(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(1500) })
    return res.status < 500
  } catch {
    return false
  }
}

async function waitReady(url, timeout = 60_000) {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    if (await probe(url)) return
    await new Promise((r) => setTimeout(r, 700))
  }
  throw new Error(`Dev server not ready at ${url} after ${timeout}ms`)
}

async function maybeStartServer() {
  if (await probe(BASE)) {
    console.warn('Dev server already running — skipping start.')
    return null
  }
  console.warn('Starting dev server…')
  const proc = spawn('bun', ['run', 'dev'], {
    cwd: ROOT,
    stdio: 'pipe',
    detached: false
  })
  proc.stdout.on('data', (d) => process.stdout.write(d))
  proc.stderr.on('data', (d) => process.stderr.write(d))
  proc.on('error', (err) => console.error('Dev server spawn error:', err.message))
  return proc
}

function stopServer(proc) {
  if (!proc) return
  try {
    proc.kill('SIGTERM')
  } catch {
    /* already gone */
  }
}

async function run() {
  fs.mkdirSync(SHOTS, { recursive: true })
  devProc = await maybeStartServer()

  try {
    await waitReady(BASE)
    console.warn(`Server ready at ${BASE}\n`)

    const browser = await chromium.launch()
    const context = await browser.newContext({ ignoreHTTPSErrors: true })
    const page = await context.newPage()

    const collectedErrors = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text()
        if (!NOISE.some((re) => re.test(text))) collectedErrors.push(`console.error: ${text}`)
      }
    })
    page.on('pageerror', (err) => {
      if (!NOISE.some((re) => re.test(err.message)))
        collectedErrors.push(`pageerror: ${err.message}`)
    })

    for (const width of WIDTHS) {
      console.warn(`\n── ${width}px ────────────────────────────────`)
      await page.setViewportSize({ width, height: HEIGHT })

      await page.goto(BASE, { waitUntil: 'networkidle' })
      await page.waitForTimeout(900)

      // Screenshot: before interaction
      await page.screenshot({ path: `${SHOTS}/w${width}-before.png` })
      console.warn(`  📸 w${width}-before.png`)

      // All four per-width checks in a single evaluate round-trip
      const metrics = await page.evaluate(
        ({ navSel, handSel }) => {
          const nav = document.querySelector(navSel)
          const hand = document.querySelector(handSel)
          const bio = document.querySelector('.bio-top p, .bio-btm p')
          return {
            scrollW: document.documentElement.scrollWidth,
            btnH: nav ? nav.getBoundingClientRect().height : null,
            handFound: hand !== null,
            bioFs: bio ? parseFloat(getComputedStyle(bio).fontSize) : null
          }
        },
        { navSel: NAV_SELECTOR, handSel: HAND.selector }
      )

      // Check 1: no horizontal overflow
      if (metrics.scrollW > width) {
        fail(
          `[${width}] horizontal overflow — scrollWidth ${metrics.scrollW}px > viewport ${width}px`
        )
      } else {
        pass(`[${width}] no horizontal overflow (scrollWidth ${metrics.scrollW}px)`)
      }

      // Check 2: nav button tap-target ≥ 44px
      checkMeasure(width, 'nav button height', metrics.btnH, 44)

      // Check 3: ParallaxHand visibility gate
      const expectHand = width >= HAND.threshold
      if (metrics.handFound === expectHand) {
        pass(
          `[${width}] ParallaxHand ${expectHand ? 'present' : `absent (correct below ${HAND.threshold}px)`}`
        )
      } else {
        fail(
          `[${width}] ParallaxHand ${metrics.handFound ? 'present' : 'absent'} — expected ${expectHand ? 'present' : 'absent'} at ${width}px`
        )
      }

      // Check 4: legibility floor — bio text ≥ 16px
      checkMeasure(width, 'bio font-size', metrics.bioFs, 16)

      // Interaction: scroll down → up → click Blog → back
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
      await page.waitForTimeout(400)
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.waitForTimeout(300)

      const blogBtn = page.locator('.btn-nav-blog')
      if (await blogBtn.isVisible()) {
        try {
          await Promise.all([page.waitForURL(/\/blog/, { timeout: 12_000 }), blogBtn.click()])
          await page.waitForLoadState('networkidle')
          await page.screenshot({ path: `${SHOTS}/w${width}-blog.png` })
          console.warn(`  📸 w${width}-blog.png`)

          await page.goBack({ waitUntil: 'networkidle' })
          await page.waitForTimeout(600)
        } catch (e) {
          fail(`[${width}] blog navigation failed: ${e.message}`)
        }
      } else {
        console.warn(`  ⚠ .btn-nav-blog not visible at ${width}px, skipping click`)
      }

      // Screenshot: after interaction
      await page.screenshot({ path: `${SHOTS}/w${width}-after.png` })
      console.warn(`  📸 w${width}-after.png`)
    }

    // Accumulated browser errors
    if (collectedErrors.length) {
      fail(`${collectedErrors.length} browser error(s):\n    ${collectedErrors.join('\n    ')}`)
    } else {
      pass('No browser console errors')
    }

    await browser.close()
  } finally {
    stopServer(devProc)
  }

  console.warn('')
  if (failures > 0) {
    console.error(`✗ ${failures} check(s) failed. Screenshots in shots/006/`)
    process.exit(1)
  }
  console.warn('✓ All checks passed. Screenshots in shots/006/')
}

run().catch((err) => {
  console.error(err)
  stopServer(devProc)
  process.exit(1)
})
