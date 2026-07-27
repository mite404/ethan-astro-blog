---
status: todo
---

# 006 — Verify fluid responsive

**Branch:** `fluid-responsive-portfolio` · **Depends on:** 004, 005 · **Blocks:** —

## Tasks

- [ ] `bun dev`, then walk the range with **chrome-devtools MCP** (`resize_page` +
      `take_screenshot`) at: **1440, 1280, 1100, 1024, 900, 834, 768, 600, 430, 390, 320**.
- [ ] At every step confirm: no horizontal scrollbar, no clipped right edge, text legible.
- [ ] Confirm the **1024 and 768 transitions reflow without a size jump** — sizes move
      continuously, only column count snaps.
- [ ] Specifically verify **390px (iPhone 12 Pro)** — the original reported failure — and
      **834px (iPad)**.
- [ ] Confirm ParallaxHand still meets the globe on desktop and is absent below 768px.
- [ ] Confirm nav buttons ≥44px tall at all widths.
- [ ] `bun build` — clean.
- [ ] `bun lint` and `bun format:check`.

## Documentation

Per `CLAUDE.md`, update **`docs/FOR_ETHAN.md`**:

- **Behind the Scenes** — why fluid CSS beat `transform: scale()`. Scale rasterizes a fixed
  canvas; it cannot reflow or hold a legibility floor. Film analogy: scaling is a printed poster
  photographed smaller; fluid CSS is a re-blocked scene.
- **Bloopers** — the viewport-media-query vs fixed-container conflict. Textbook entry: rules that
  respond to the **viewport** while the container is pinned at a **fixed width** will always
  disagree. Include the unit-less `font-size: 8` typo found at `portfolio.css:437`.

## Acceptance criteria

- Screenshots captured at all 11 widths, attached to the branch.
- Build, lint and format all clean.
- `FOR_ETHAN.md` updated.

## Committing

Both virtual branches will be applied. Always target explicitly:

```bash
but commit fluid-responsive-portfolio -m "..."
```
