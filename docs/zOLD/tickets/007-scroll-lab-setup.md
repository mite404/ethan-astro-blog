---
status: todo
---

# 007 — Scroll lab setup

**Branch:** `scroll-experiments` · **Depends on:** 000 · **Blocks:** 008, 009, 010

## Context

Three scroll-motion options need side-by-side comparison without destabilising the live `/` route.
A dedicated lab page keeps the experiment isolated and reviewable.

**Target section: Projects** (`index.astro:69–148`) — 4 cards with preview images, the most visual
payload of any section.

## Files

- `src/pages/scroll-lab.astro` (new)

## Tasks

- [ ] Create `scroll-lab.astro` using `PortfolioLayout`.
- [ ] Read the real project data from `src/data/projects.ts` and the optimized images — do **not**
      use placeholder content; the motion must be judged on real payload.
- [ ] Variant switcher via query param `?v=a|b|c`, defaulting to a plain vertical stack.
- [ ] Render visible variant labels + a link back to `/`.
- [ ] Extract the project card markup so all three variants share **one** card component —
      differences must live in the _container_, not the card.

## Acceptance criteria

- `/scroll-lab?v=a|b|c` renders without error.
- `/` is completely untouched by this branch.
- All three variants show identical card content.
- `bun build` clean.

## Notes

Motion 12 (`motion` `^12.42.2`) and React 19 are already dependencies — **no new packages**.

## Committing

Both virtual branches will be applied. Always target explicitly:

```bash
but commit scroll-experiments -m "..."
```
