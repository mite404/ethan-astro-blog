---
status: todo
---

# 011 — Compare + verify

**Branch:** `scroll-experiments` · **Depends on:** 008, 009, 010 · **Blocks:** —

## Tasks

- [ ] Capture each variant with **chrome-devtools MCP** at **1280, 834, 390** — **mid-scroll**, not
      just at rest.
- [ ] Verify all variants under reduced-motion (`emulate` prefers-reduced-motion) fall back to a
      static vertical stack.
- [ ] Verify keyboard traversal reaches all 4 cards in every variant.
- [ ] Confirm **Option A's** page-height change against `ParallaxHand`'s `scrollRange.end`
      (see 008) — record whether the hand still meets the globe.
- [ ] `bun build`, `bun lint`, `bun format:check`.

## Deliverable — comparison note

Write `docs/tickets/011-results.md` scoring each variant:

|                 | Feel | A11y cost | Mobile/touch | JS weight | Ship-ready? |
| --------------- | ---- | --------- | ------------ | --------- | ----------- |
| A — pinned rail |      |           |              |           |             |
| B — snap rail   |      |           |              |           |             |
| C — sticky deck |      |           |              |           |             |

Include a one-line recommendation and the screenshots.

## Acceptance criteria

- All variants captured at 3 widths, mid-scroll.
- Reduced-motion verified for all.
- Comparison note written with an explicit recommendation.

## Committing

```bash
but commit scroll-experiments -m "..."
```
