---
status: todo
---

# 008 — Option A: pinned horizontal rail

**Branch:** `scroll-experiments` · **Depends on:** 007 · **Blocks:** 011

## Concept

The dramatic one. Vertical scroll drives horizontal travel through the 4 project cards — the
section pins to the viewport while the cards slide sideways, then releases.

## Implementation

- Tall outer wrapper (`height: 300vh`) containing an inner
  `position: sticky; top: 0; height: 100vh; overflow: hidden`.
- Motion 12:

  ```ts
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end']
  })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%'])
  ```

  applied to a flex row of the 4 cards.

- Cards `flex: 0 0 auto`, width `clamp(280px, 60vw, 520px)`.

## Tasks

- [ ] Build variant A behind `?v=a`.
- [ ] Honor `prefers-reduced-motion: reduce` — fall back to a plain vertical stack.
- [ ] Keep cards as real links, keyboard-reachable, in DOM order.

## Acceptance criteria

- Scrolling moves cards horizontally; the section pins then releases cleanly.
- Reduced-motion users get a static vertical stack.
- Tab order traverses all 4 cards.

## ⚠️ Known conflicts — document, do not silently absorb

- **Hijacks native scroll.** A real accessibility and user-agency cost. Record it in ticket 011.
- Tripling page height changes `document.documentElement.scrollHeight`, which **`ParallaxHand`
  reads to compute `scrollRange.end`** (`src/components/ui/ParallaxHand.tsx`). The hand's timing
  _will_ shift. Verify the hand still meets the globe, and record the interaction in 011.
