# 002 — Fluid token system

**Branch:** `fluid-responsive-portfolio` · **Depends on:** 001 · **Blocks:** 003, 004, 005

## Context

Introduces the single source of truth for continuous scaling. Every token is a `clamp()` ramp
between a **390px** and a **1280px** viewport, so sizes move smoothly *through* both breakpoints.
Media queries (004) will only change flow, never size.

## Formula

```
slope     = (max − min) / (1280 − 390)
intercept = min − slope × 390
token     = clamp(min, intercept + (slope × 100)vw, max)
```

## Files

- `src/styles/portfolio.css` — add near the top, after the
  `body[data-layout-type='portfolio']` reset block.

## Task

- [ ] Add the token block:

```css
body[data-layout-type='portfolio'] {
  /* ── fluid ramp: 390px → 1280px viewport ───────────────── */
  --gutter:        clamp(1rem,     0.55rem + 1.80vw,  2rem);      /*  16 →  32 */
  --fs-name:       clamp(6rem,     24.7vw,            19.75rem);  /*  96 → 316 */
  --fs-section:    clamp(2.5rem,   0.86rem + 6.74vw,  6.25rem);   /*  40 → 100 */
  --fs-bio:        clamp(1.25rem,  0.57rem + 2.81vw,  2.8125rem); /*  20 →  45 */
  --fs-touch:      clamp(2.125rem, 0.73rem + 5.73vw,  5.3125rem); /*  34 →  85 */
  --fs-card-title: clamp(1.25rem,  0.98rem + 1.12vw,  1.875rem);  /*  20 →  30 */
  --h-touch:       clamp(4rem,     1.43rem + 10.56vw, 9.875rem);  /*  64 → 158 */
  --space-bio:     clamp(3.75rem,  0.63rem + 12.80vw, 10.875rem); /*  60 → 174 */
  --zone-min:      clamp(20rem,    13.98rem + 24.7vw, 33.75rem);  /* 320 → 540 */
}
```

## Acceptance criteria

- Tokens resolve correctly in devtools at **390px** (→ `min`), **1280px** (→ `max`), and
  **~800px** (between).
- No visual change yet — nothing consumes them until 003.

## Notes

- The **`min` column is the legibility floor** — the most important numbers in this workstream and
  the first thing to tune if phone text reads too small.
- `line-height` is authored unitless (`105%`, `0.756`) and `letter-spacing` in `em`, so both scale
  **automatically** with font size. No separate tokens are needed for line or word spacing.
