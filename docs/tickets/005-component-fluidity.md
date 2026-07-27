---
status: done
---

# 005 — Component fluidity

**Branch:** `fluid-responsive-portfolio` · **Depends on:** 003 · **Blocks:** 006

Can run in parallel with 004.

## Context

Four components carry their own fixed sizing or their own JS breakpoint logic, bypassing the token
system. Two of them duplicate work that CSS now does for free.

## Files

- `src/components/ui/ParallaxHand.tsx`
- `src/components/layout/Ticker.tsx`
- `src/components/layout/DecorativeElements.astro`
- `src/components/layout/PortfolioHeader.astro`

## Tasks

- [ ] **`ParallaxHand.tsx`** — the asset is **2875px wide**; meaningless on a 390px screen and pure
      bandwidth + scroll math. Return `null` below 768px. The existing `isMobile` state already
      tracks this breakpoint — change it from a *size* switch to a *render* switch. Make the
      desktop width fluid rather than a hardcoded 2875px so it tracks the composition.

- [ ] **`Ticker.tsx`** — replace the JS `isMobile` branch (lines 43–59: `fontSize`, `height`,
      `borderWidthH`, `borderWidthV`) with CSS `clamp()`. Deletes a `resize` listener and a
      hydration-dependent layout shift.

- [ ] **`DecorativeElements.astro`** — its `@media (max-width: 768px)` (line 63) is off-by-one
      against the 767px iPhone breakpoint. Align to `767px`.

- [ ] **`PortfolioHeader.astro`** — `.btn-nav-gh` / `.btn-nav-blog` / `.btn-nav-resume` are fixed at
      `6.25rem × 3.125rem` (`portfolio.css:104–105`). Make fluid, but **enforce a 44px minimum
      height** via the clamp floor (WCAG touch target). The 640px block deleted in 003 had this
      right — preserve the intent.

## Acceptance criteria

- No `window.innerWidth` breakpoint logic remains in `Ticker.tsx`.
- Hand is absent below 768px; still meets the globe on desktop.
- Nav buttons are ≥44px tall at every viewport width.
- No layout shift on hydration.

## Notes

### Implementation

- **ParallaxHand.tsx** — `isMobile` state changed from a *size-switch* to a *render-switch*: `if (!mounted || isMobile) return null` now returns null below 768px, eliminating the 2875×0.75 scaled path entirely. Desktop width made fluid: `clamp(1724px, 224.6vw, 2875px)` (2875/1280 × 100vw). Left offset tracks composition: `clamp(90px, 11.72vw, 150px)`. `matchMedia('(max-width: 767px)')` replaces the resize-listener `isMobile` effect — fires only at the threshold crossing, not on every resize pixel. Breakpoint aligned to canonical 767px.
- **Ticker.tsx** — `isMobile` state + `useEffect` + resize listener deleted. Four clamp values moved to CSS custom properties in `portfolio.css` (`--h-ticker`, `--fs-ticker`, `--border-ticker-h`, `--border-ticker-v`). Component uses `var(--h-ticker)` etc. in inline styles, keeping values in the CSS token system.
- **DecorativeElements.astro** — scoped `@media (max-width: 767px)` block deleted; all rules (flex-direction, gap, padding, align-self) moved to portfolio.css's merged 767px block, which is the canonical owner of portfolio mobile layout.
- **portfolio.css** — nav buttons (`btn-nav-gh`, `btn-nav-blog`, `btn-nav-resume`) changed from fixed `6.25rem × 3.125rem` to fluid: width `clamp(5.5rem, ..., 6.25rem)`, height `clamp(2.75rem, ..., 3.125rem)` with 44px WCAG floor, border-radius `clamp(1.375rem, ..., 2.5rem)`.

### Verification (scripts/verify-005.mjs)

Ad-hoc Playwright script. All checks passed at all widths. Measured values:

| Width | Nav button height | Hand |
|-------|------------------|------|
| 1440px | 50.0px | present |
| 1280px | 50.0px | present |
| 768px | 46.5px | present |
| 600px | 45.4px | absent ✓ |
| 390px | 44.0px | absent ✓ |
| 320px | 44.0px | absent ✓ |

Expected: hand absent below 768px, nav buttons ≥44px at all widths. Screenshots match expectation — continuous sizing, no overflow.

### Gate

- `bun run lint`: 1 pre-existing `any` warning in index.astro, unchanged.
- `bun run build`: clean.

## Optional follow-on — do NOT do inside this ticket

With the `isMobile` logic gone, `Ticker.tsx`'s only remaining state is hover-pause. It could become
a plain `.astro` component with a CSS animation, dropping a `client:load` React island from the
critical path. File as a separate ticket if desired.
