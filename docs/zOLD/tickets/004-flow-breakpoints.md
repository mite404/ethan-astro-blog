---
status: done
---

# 004 — Flow + breakpoints

**Branch:** `fluid-responsive-portfolio` · **Depends on:** 003 · **Blocks:** 006

Can run in parallel with 005.

## Context

With sizing handled by tokens, media queries are now responsible for **arrangement only** —
side-by-side becomes vertical.

Breakpoints match Tailwind v4 defaults (`md`=768, `lg`=1024), which means the `md:`/`lg:` classes
already in `index.astro` become **correct for free** once the container is fluid. They were only
ever broken by the fixed 1280px parent.

## Files

- `src/pages/index.astro`
- `src/styles/portfolio.css`

## Tasks — `index.astro`

- [ ] **Delete** the `<style>` block at lines 336–351. Its bare `.grid` rules at 1024/640px fight
      the Tailwind column classes.
- [ ] **Keep** `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` (lines 71, 250) — this already produces
      the intended 1 / 2 / 4 behavior.
- [ ] Line 52: replace `pt-[100px] md:pt-[174px]` with a class using
      `padding-top: var(--space-bio)`. The fluid ramp supersedes the two-step jump.
- [ ] Lines 69, 248: replace `pl-8` / `pr-8` on `<section class="bordered">` with
      `padding-inline: var(--gutter)`.
- [ ] Line 284: replace the fixed `style="padding-top: 120px"` spacer with a fluid clamp.

## Task — `portfolio.css`

- [ ] Add the two flow queries:

```css
/* ── iPad ─────────────────────────────────────── */
@media (max-width: 1023px) {
  body[data-layout-type='portfolio'] .ds-slide-inner {
    grid-template-columns: 1fr 1fr;
  }
}

/* ── iPhone: everything becomes a vertical flow ── */
@media (max-width: 767px) {
  body[data-layout-type='portfolio'] .ds-slide-inner {
    grid-template-columns: 1fr;
  }
  body[data-layout-type='portfolio'] .decorative-container {
    flex-direction: column;
  }
  body[data-layout-type='portfolio'] header nav {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}
```

## Acceptance criteria

- 4 columns ≥1024px, 2 columns 768–1023px, 1 column <768px.
- At <768px nothing sits side-by-side; the page is a single vertical flow.
- Crossing 1024 and 768 changes **column count only** — no font-size jump.
- No horizontal scrollbar at any width from 320px up.

## Notes

### Implementation

- Deleted `<style>` block (lines 336–351) from `index.astro`; its bare `.grid` rules at 1024/640px
  were overriding Tailwind's `lg:grid-cols-4 md:grid-cols-2 grid-cols-1` classes.
- `bat-zone-1-content` class added to the bio-top wrapper div; `padding-top: var(--space-bio)`
  in `portfolio.css` replaces the two-step `pt-[100px] md:pt-[174px]` Tailwind classes.
  Mirrors the existing `bat-zone-2-content` pattern.
- `pl-8`/`pr-8` removed from `<section class="bordered">` at PROJECTS (line 69) and BLOG (line 248).
  `padding-inline: var(--gutter)` added to `section.bordered:not([data-ds-carousel])` in CSS.
  Carousel section excluded explicitly — at ≤767px its slides go `position: relative`, making
  section-level padding additive with `.ds-slide-inner`'s own inset.
- Fixed `style="padding-top: 120px"` replaced by `class="spacer-contact-bottom"` with
  `padding-top: var(--space-contact-bottom)`. Token `--space-contact-bottom` (60→120px ramp)
  added to the fluid token block on `body[data-layout-type='portfolio']`.
- `@media (max-width: 1023px)` block added: `.ds-slide-inner` goes 2-col on iPad.
- The two `@media (max-width: 767px)` blocks (new flow rules + existing carousel stacking) merged
  into one; redundant `grid-template-columns: 1fr` dropped from the flow section since the
  carousel block's fuller `.ds-slide-inner` declaration covers it.

### Gate

- `bun run lint`: 0 errors (1 pre-existing `any` warning in index.astro, unchanged).
- `bun run build`: clean.
- `bun run verify`: not yet available (ticket 006 builds the script).
