---
status: done
---

# 001 — Remove transform scaffolding

**Branch:** `fluid-responsive-portfolio` · **Depends on:** 000 · **Blocks:** 002

## Context

`PortfolioLayout.astro` wraps the poster in a `.portfolio-stage` and scales it with a JS `fit()`
routine. `transform: scale()` rasterizes a fixed canvas — it **cannot** reflow or hold a
legibility floor, so it is fundamentally incompatible with the fluid approach.

This ticket is a **net deletion**.

## Files

- `src/layouts/PortfolioLayout.astro`
- `src/components/ui/ParallaxHand.tsx`

## Tasks

- [ ] Delete the `.portfolio-stage` wrapper div (keep `.portfolio-layout` and its children).
- [ ] Delete the entire `<script>` block — `DESIGN_WIDTH`, `GUTTER`, `fit()`, the `resize` and
      `load` listeners, and the `ResizeObserver`.
- [ ] Delete the `.portfolio-stage` CSS rule and `transform-origin` from `.portfolio-layout`.
- [ ] Rewrite `.portfolio-layout` as a normal fluid container:

      ```css
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
          padding-inline: var(--gutter); /* token lands in 002 */
          ```

          Keep `min-height`, `display: flex`, `flex-direction`, `position: relative`, and
          `overflow: hidden` (still needed to clip the hand).

- [ ] In `ParallaxHand.tsx`, revert the scale-compensation block that divides by
      `posterRect.width / portfolioLayout.offsetWidth`. With no transform this always computes 1.
      Restore the simpler `offsetTop`-based globe measurement.

## Acceptance criteria

- No `transform`, `scale`, or `portfolio-stage` references remain in `PortfolioLayout.astro`.
- `bun build` completes clean.
- Page renders at 1280px essentially unchanged from before.
- Regressions **below** 1280px are expected here and are fixed by 002–005.

## Notes

`--gutter` does not exist yet; 002 introduces it. A temporary hardcoded `2rem` is acceptable
within this ticket only.

### Implementation (2026-07-27)

**What was done:**

- Deleted `.portfolio-stage` wrapper div and all JS scaling (`fit()`, `DESIGN_WIDTH`, `GUTTER`,
  resize/load listeners, ResizeObserver) from `PortfolioLayout.astro`.
- Removed `.portfolio-stage` CSS block and `transform-origin: top left` from `.portfolio-layout`.
- Rewrote `.portfolio-layout` as a fluid container: `max-width: 1280px; width: 100%; margin: 0 auto;
padding-inline: 2rem` (temp hardcode; replaced by `--gutter` in 002).
- Kept `min-height: 100vh`, `display: flex`, `flex-direction: column`, `position: relative`,
  `overflow: hidden`.
- In `ParallaxHand.tsx`: removed scale-compensation division
  `(globeRect.bottom - posterRect.top) / scale`. Now: `globeRect.bottom - portfolioRect.top`.
- Fixed pre-existing gate breakage: added `.netlify/**` to ESLint ignores (build artifacts were
  being linted, causing gate failures after any prior build run).

**Gate:** `bun install && bun run lint && bun run build` — GREEN (1 warning in index.astro, pre-existing, not introduced here).

**Simplify:** 4 parallel agents reviewed. No reuse, simplification, or altitude issues in the diff.
Two pre-existing efficiency issues noted in ParallaxHand.tsx (dual resize listeners; `globeOffsetTop`
as useState rather than useRef) — both pre-date this diff and are out of scope for ticket 001;
the isMobile geometry is explicitly addressed in ticket 005.

**Regressions below 1280px:** expected per acceptance criteria; fixed by 002–005.
