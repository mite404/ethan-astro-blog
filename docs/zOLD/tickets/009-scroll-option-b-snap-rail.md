---
status: todo
---

# 009 — Option B: native scroll-snap rail ⭐ recommended

**Branch:** `scroll-experiments` · **Depends on:** 007 · **Blocks:** 011

## Concept

Zero JavaScript. Uses the platform. **Recommended ship candidate.**

```css
.rail {
  display: flex;
  gap: var(--gutter);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--gutter);
  overscroll-behavior-x: contain;
}

.rail > * {
  flex: 0 0 clamp(260px, 70vw, 340px);
  scroll-snap-align: start;
}
```

## Tasks

- [ ] Build variant B behind `?v=b`.
- [ ] Optionally hide the scrollbar (`scrollbar-width: none`) — but keep the rail
      keyboard-scrollable and focus-visible.
- [ ] Verify touch, trackpad, and keyboard traversal.

## Acceptance criteria

- Swipe/trackpad scrolling snaps cleanly to each card.
- **No JavaScript** required for the interaction.
- Reduced-motion needs no special case — smooth-scroll is user-controlled.
- Tab order traverses all 4 cards; the focused card scrolls into view.

## Why this is the recommendation

Native scroll-snap costs no JS, works perfectly on touch, is keyboard-accessible by default,
honors reduced-motion inherently, and pairs naturally with the vertical phone layout from the
`fluid-responsive-portfolio` branch.
