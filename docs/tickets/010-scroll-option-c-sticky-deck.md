---
status: todo
---

# 010 — Option C: sticky stacked deck (stretch)

**Branch:** `scroll-experiments` · **Depends on:** 007 · **Blocks:** 011

## Concept

Cards stack and overlap as you scroll, like a dealt deck. Mostly CSS.

- Each card `position: sticky; top: calc(8vh + n * 12px)` so successive cards come to rest slightly
  below the previous one.
- Optional Motion layer: slight `scale` / `opacity` falloff on buried cards.

## Tasks

- [ ] Build variant C behind `?v=c`.
- [ ] Set the per-card `top` offset via a CSS custom property (`--i`) rather than four hand-written
      rules.
- [ ] Honor `prefers-reduced-motion: reduce` — fall back to a plain vertical stack.

## Acceptance criteria

- Cards visibly stack with consistent offset; no overlap glitches at any width.
- Works with 4 cards and would still work with 5+.
- Reduced-motion users get a static stack.

## Status

**Stretch goal.** Ship 008 and 009 first; drop this if time is short.
