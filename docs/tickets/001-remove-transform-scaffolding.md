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
