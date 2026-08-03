---
status: done
---

# 003 — Apply fluid tokens, delete fixed values

**Branch:** `fluid-responsive-portfolio` · **Depends on:** 002 · **Blocks:** 004, 005, 006

## Context

Swap hardcoded sizes for tokens, and delete the viewport media queries the tokens replace. Those
queries are the direct cause of the phone bug — they resize text based on **viewport** while the
container stayed pinned at **1280px**.

⚠️ **Highest-risk ticket in this branch.** It deletes four media query blocks at once. If
something regresses later, look here first.

## Files

- `src/styles/portfolio.css`

## Task — swap sizes

| Selector (line)                             | Was                                                                    | Becomes                                                                  |
| ------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `.portfolio-name` (87)                      | `19.7rem`                                                              | `var(--fs-name)`                                                         |
| `.section-title` (193)                      | `6.25rem`                                                              | `var(--fs-section)`                                                      |
| `.bio-top` / `.bio-btm` (210, 240)          | `45px`                                                                 | `var(--fs-bio)`                                                          |
| `.btn-touch` (160–168)                      | `width:80rem`, `height:9.875rem`, `font-size:85px`, `radius:4.8125rem` | `width:100%`, `var(--h-touch)`, `var(--fs-touch)`, `border-radius:999px` |
| `.bat-zone-1-wrapper` (25)                  | `33.75rem`                                                             | `var(--zone-min)`                                                        |
| `.bat-zone-2-wrapper` (48)                  | `33.9375rem`                                                           | `var(--zone-min)`                                                        |
| `.bat-zone-2-content` (53)                  | `11.9375rem`                                                           | `var(--space-bio)`                                                       |
| `.bio-stars-divider-top` (223)              | `10.875rem`                                                            | `var(--space-bio)`                                                       |
| `.bio-stars-divider` (230)                  | `11.9375rem`                                                           | `var(--space-bio)`                                                       |
| `.project-title` / `.blog-title` (312, 323) | `1.875rem`                                                             | `var(--fs-card-title)`                                                   |
| `.ds-carousel` (525)                        | `height: 320px`                                                        | `height: auto` + fluid `min-height`                                      |

## Task — delete replaced media queries

- [ ] Delete `@media (max-width: 950px)` — lines 424–432
- [ ] Delete `@media (max-width: 640px)` — lines 435–486
- [ ] Delete `@media (max-width: 570px)` — lines 489–494
- [ ] Delete `@media (max-width: 480px)` — lines 497–506
- [ ] **Keep** the ds-carousel stacking block (791–813), retuned `760px` → **`767px`**
- [ ] **Keep** the `prefers-reduced-motion` block (815–821)

## Acceptance criteria

- No fixed `px`/`rem` font sizes remain on the selectors listed above.
- Resizing 1280 → 390 changes sizes **continuously**, with no snap.
- `bun build` clean.

## Notes

- `border-radius: 999px` on `.btn-touch` — a pill is always correct at any height, removing a
  value that previously had to be hand-maintained at half the height.
- The deleted 640px block contains **`font-size: 8`** at line 437 (no unit) — a real live bug that
  disappears with the block. **Do not port it forward.**
- The same block also set `.btn-nav-*` to a 44px WCAG touch target. That intent must be preserved
  — see ticket 005.

### Implementation notes

- All selectors in the ticket table updated to use tokens: `.portfolio-name` → `--fs-name`,
  `.section-title` → `--fs-section`, `.bio-top`/`.bio-btm` → `--fs-bio`, `.btn-touch` →
  `100%` / `--h-touch` / `--fs-touch` / `999px`, `.bat-zone-1-wrapper`/`.bat-zone-2-wrapper` →
  `--zone-min`, `.bat-zone-2-content` → `--space-bio`, `.bio-stars-divider-top`/`.bio-stars-divider`
  → `--space-bio`, `.project-title`/`.blog-title` → `--fs-card-title`.
- `.ds-carousel`: changed from `height: 320px` to `height: auto; min-height: var(--h-carousel)`.
  `--h-carousel: clamp(13.75rem, 11.01rem + 11.24vw, 20rem)` added to the token block (220px→320px).
- Four media queries deleted: 950px, 640px, 570px, 480px.
- ds-carousel stacking breakpoint retuned 760px → 767px. Redundant `height: auto` in that block
  removed (base rule already sets it).
- `--space-bio` intentionally collapses two slightly different original values (10.875rem /
  11.9375rem) per ticket table — both bio-zone spacings share the same fluid ramp.
- `--zone-min` intentionally collapses zone-1 (33.75rem) and zone-2 (33.9375rem) — 3px delta at
  max viewport; within visual tolerance, per ticket table.
- Gate: lint 0 errors (1 pre-existing `any` warning in index.astro), build clean.
