---
status: todo
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

## Optional follow-on — do NOT do inside this ticket

With the `isMobile` logic gone, `Ticker.tsx`'s only remaining state is hover-pause. It could become
a plain `.astro` component with a CSS animation, dropping a `client:load` React island from the
critical path. File as a separate ticket if desired.
