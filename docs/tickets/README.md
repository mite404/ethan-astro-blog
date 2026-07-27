# Tickets — Fluid Responsive Portfolio + Scroll Experiments

Two independent workstreams on two **GitButler virtual branches**. Do not mix them.

| # | Ticket | Branch | Depends on |
|---|---|---|---|
| 000 | Branch setup | both | — |
| 001 | Remove transform scaffolding | `fluid-responsive-portfolio` | 000 |
| 002 | Fluid token system | `fluid-responsive-portfolio` | 001 |
| 003 | Apply fluid tokens | `fluid-responsive-portfolio` | 002 |
| 004 | Flow + breakpoints | `fluid-responsive-portfolio` | 003 |
| 005 | Component fluidity | `fluid-responsive-portfolio` | 003 |
| 006 | Verify fluid responsive | `fluid-responsive-portfolio` | 004, 005 |
| 007 | Scroll lab setup | `scroll-experiments` | 000 |
| 008 | Option A — pinned rail | `scroll-experiments` | 007 |
| 009 | Option B — snap rail | `scroll-experiments` | 007 |
| 010 | Option C — sticky deck | `scroll-experiments` | 007 |
| 011 | Compare + verify | `scroll-experiments` | 008, 009, 010 |

004 and 005 depend only on 003, not on each other — they can run in parallel.

## Why this work exists

The portfolio at `/` is a poster authored at a fixed **1280px**. A `transform: scale()` "stage"
was added to shrink the canvas to fit narrow viewports. It works on desktop but **fails on
phones** — at 390px the poster renders at ~0.27 scale and is illegible.

The deeper cause: the codebase already has **viewport-based** rules (`portfolio.css` media
queries at 950/760/640/570/480px; Tailwind `md:`/`lg:` in `index.astro`). They fire off *viewport*
width while the container is pinned at 1280px, so they contradict each other — the grid collapses
to one column **of 1280px-wide cards**.

**Target:** genuinely fluid CSS (porter.run-style). `clamp()` handles continuous scaling across the
whole 390→1280px range; media queries only change *flow*.

## Architecture decision

**Delete the transform-scale mechanism. Use fluid CSS.**

| | Transform scale (current) | Fluid CSS (target) |
|---|---|---|
| Type size | shrinks to illegibility | `clamp()` with legibility floor |
| Layout flow | never changes — always 1280px | reflows at breakpoints |
| Text rendering | rasterized at fractional scale | native, selectable, zoomable |
| Existing media queries | conflict | become the real mechanism |

Two mechanisms, kept deliberately separate:

1. **Continuous scaling** → `clamp()` tokens, active across the *entire* 390→1280px range, so
   scaling stays smooth *through* both breakpoints.
2. **Flow changes** → two media queries that only change *arrangement*, never size.

## Breakpoints

| Band | Viewport | Grid | Flow |
|---|---|---|---|
| Desktop | ≥ 1024px | 4 col | side-by-side |
| iPad | 768–1023px | 2 col | side-by-side |
| iPhone | < 768px | 1 col | vertical |

Matches Tailwind v4 defaults (`md`=768, `lg`=1024), so the `md:`/`lg:` classes already in
`index.astro` become correct for free once the container is fluid.

## Decisions made — override if you disagree

1. **Transform-scale is deleted, not extended** — incompatible with real fluid type.
2. **Breakpoints 1024 / 768** to match Tailwind defaults.
3. **Ramp anchored 390→1280px**; the `min` values are the legibility floors — tune first.
4. **Hand dropped below 768px** — say so if you'd rather it were re-composed for phone.
5. **Scroll experiments target Projects**, three options on `/scroll-lab`, Option B recommended.

## See also

- [../../AGENTS.md](../../AGENTS.md) — GitButler `but` CLI reference. **Read before committing.**
- [../../CLAUDE.md](../../CLAUDE.md) — stack, commands, architecture.
