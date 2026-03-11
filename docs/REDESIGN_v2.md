# Portfolio Redesign v2 — Implementation Plan

**Source:** Figma file `hxE0jhguSe2Irj2QoDH1JB`, frame `195:6380` ("Website v2")
**Screenshot taken:** 2026-03-10
**Author:** Claude (from Figma MCP analysis)

---

## Executive Summary

The v2 design is an evolution, not a revolution. The color palette, fonts, and
most components are preserved. The key changes are:

1. **Page structure reordered** — Bio paragraph 1 moves *above* the Projects
   section (currently both bio paragraphs live below Projects).
2. **Stars/arrows decorators appear twice** — once above Projects, once above Blog.
3. **Header buttons switch from Guisol → Aptos Narrow** font.
4. **Blog cards gain a "Subheading" tag** element (category/date label below description).
5. **Ticker tech tags updated** — now includes PostgreSQL, Drizzle, BetterAuth.
6. **RESUMÉ button** gets the accent mark (RESUME → RESUMÉ).
7. **BAT backgrounds repositioned** — two separate bat instances at different scales
   create a more dramatic parallax-style look across both bio sections.

No new dependencies needed. All changes are HTML/CSS/Astro/React.

---

## Design Tokens (Unchanged)

| Token            | Value       | Usage                          |
|------------------|-------------|--------------------------------|
| Background       | `#1c1c1c`   | Body, page background          |
| Text primary     | `#fefefe`   | Body copy, headings            |
| Accent green     | `#7fee40`   | BLOG button, GET IN TOUCH btn  |
| Accent purple    | `#e071e3`   | RESUMÉ button, highlight text  |
| GitHub button    | `#d9d9d9`   | GITHUB nav button background   |
| Section border   | `#ffffff`   | Projects + Blog box borders    |

---

## Visual Diffs by Section

### 1. Header (`PortfolioHeader.astro`)

**Before:**
- Nav buttons: Guisol font, 22px, order: BLOG | GITHUB | RESUME
- RESUME: no accent mark

**After:**
- Nav buttons: Aptos Narrow font, 20px — same order
- RESUMÉ: with accent mark on the É
- Button dimensions unchanged: 100×50px, radius 40px, gap-0

**Files:** `src/components/layout/PortfolioHeader.astro`, `src/styles/portfolio.css`

---

### 2. Warning Strip / Ticker (`Ticker.tsx`)

**Tech tags:** The `items` array in `Ticker.tsx` already contains all relevant
tags (TypeScript, React, Tailwind, PostgreSQL, Drizzle, BetterAuth, etc.).
No changes needed to the items list.

**Warning stripe overlay — SVG vs CSS:**
The current implementation loads `warning-strip.svg` as a foreground overlay
at a hardcoded `width="1280"`. This breaks at smaller viewports because the
SVG asset doesn't scale proportionally.

The warning stripe pattern is a repeating diagonal stripe — this is trivially
reproducible in pure CSS using `repeating-linear-gradient`:

```css
background: repeating-linear-gradient(
  -45deg,
  transparent,
  transparent 4px,
  rgba(255, 255, 255, 0.15) 4px,
  rgba(255, 255, 255, 0.15) 8px
);
```

**Recommended:** Replace the `<img src="warning-strip.svg">` overlay in
`Ticker.tsx` with a `<div>` that uses this CSS gradient. It will scale to
any container width automatically, no asset needed, no `objectFit` hacks.

The exact stripe color, width, and angle should be matched to the current
SVG asset before replacing it.

**Files:** `src/components/layout/Ticker.tsx`

---

### 3. Page Structure Reorder (`index.astro`)

This is the biggest structural change. The page order changes from:

```
[Ticker]
[PROJECTS: bordered box]
[Bio Top + Bio Bottom (bat bg)]
[BLOG: bordered box]
[Decorative row: WAVE | TCHOTCHKES | LIQUID]
[Globe]
[GET IN TOUCH]
[Hand]
```

To:

```
[Ticker]
[Bio Top paragraph]
[Stars/Arrows decorators]
[PROJECTS: bordered box]
[Bio Bottom paragraph]
[Stars/Arrows decorators]
[BLOG: bordered box]
[Decorative row: WAVE | TCHOTCHKES | LIQUID]
[Globe]
[GET IN TOUCH]
[Hand]
```

**Files:** `src/pages/index.astro`

---

### 4. Bio Sections (Restructured)

The single `<section class="bio-container">` with both paragraphs gets split
into two independent sections, each with its own bat background context.

**Bio Top** (above PROJECTS):
- Text: "An early-stage engineer drawn to **creative tools** and developer
  experience, where my professional background in video and audio production
  becomes a **technical advantage**."
- Font: Iosevka Fixed, Italic, 45px, line-height 1.05
- Highlighted words: `#e071e3`
- The bat background (`BAT_.png`) is positioned at a very large scale behind
  this section. It bleeds out of bounds (like the current version). Use
  `overflow: hidden` on the containing element.

**Bio Bottom** (below PROJECTS, above BLOG):
- Text: "Bringing 19 years of **systems thinking and team leadership** within
  entertainment for brands like VICE, SPOTIFY & BEYONCÉ to early-stage
  companies building creative tools."
- Note: The brand list reorders to `"VICE, SPOTIFY, SQUARESPACE & BEYONCÉ"` —
  SQUARESPACE stays in, order changes
- Font: Iosevka Fixed Italic 45px for most text; highlighted portion
  in Guisol Regular 40px (per Figma `195:5468` mixed spans)
- Highlighted text: `#e071e3`
- Second bat instance positioned differently (larger, further off-canvas)

**Stars decorators:** The `<Image src={stars} />` element currently appears
once inside `.bio-container`. Extract it into a standalone reusable component
or just duplicate the `<Image>` tag — it now appears twice:
once after Bio Top, once after Bio Bottom.

**Files:** `src/pages/index.astro`, `src/styles/portfolio.css`

---

### 5. Projects Section (`index.astro` + `portfolio.css`)

**Before card layout:**
- Title: Aptos Narrow (current CSS)
- Image: 200×125px (`project-image` class)
- Description: Aptos Narrow 0.875rem
- Links: "GitHub | Live | Post"
- Details: Aptos Narrow 0.75rem, uppercase

**After card layout (from Figma `195:6304`):**
- **Title: Guisol Regular 30px** — this is a font change! Current CSS uses
  Aptos Narrow for project titles.
- Image: 200×125px — unchanged
- Description: Aptos Narrow 12px — unchanged
- Links: Aptos Narrow 10px (slightly smaller than current 0.938rem ≈ 15px)
- Tech stack tags line: Aptos Narrow 10px (e.g., "TypeScript | React | Tailwind")

**Section dimensions (match Figma exactly):**
- Border box: 1280×526px, 1px solid white
- Section title "PROJECTS:": Guisol 100px (matches current `.section-title`)
- Card columns: 4 equal columns, cards at x≈28, 327, 634, 927 (≈300px each)
- Images at top of each card, 200×125px

**Files:** `src/pages/index.astro`, `src/styles/portfolio.css`

---

### 6. Blog Section (`index.astro` + `portfolio.css`)

**Before card layout:**
- Title: `.blog-title` class (current font sizing)
- Description: `.blog-description`
- Link: "Read More..."

**After card layout (from Figma `195:5434`):**
- **Headline:** Aptos Narrow 30px — the blog card headline uses Aptos Narrow
  (not Guisol), 30px
- **Description:** Aptos Narrow 12px — same
- **Subheading (NEW):** Aptos Narrow 10px, below description — this is a new
  element, likely the post category or publication date. Add a "Subheading"
  line showing `post.data.pubDate` formatted as the month/year, or a category
  tag if available.

**Section dimensions:**
- Border box: 1280×286px, 1px solid white (more compact than Projects)
- Section title "BLOG:": Guisol 100px (unchanged)
- 4 columns, same x positions as Projects

**Blog link:** The "Read More..." link may be removed in v2 — the Figma only
shows Headline, Description, and Subheading. Remove the link element or
make it part of the Headline (wrap headline in `<a>` tag).

**Files:** `src/pages/index.astro`, `src/styles/portfolio.css`

---

### 7. Decorative Row, Globe, Contact (Minor/Unchanged)

- `DecorativeElements.astro` — already implemented correctly (WAVE, TCHOTCHKES, LIQUID)
- Globe asset — unchanged
- GET IN TOUCH button — unchanged (1280×158px, radius 77px, green #7fee40)
- ParallaxHand — unchanged

---

## Step-by-Step Implementation Order

### Step 1 — CSS: Header button font
**File:** `src/styles/portfolio.css`

Update `.btn-nav-gh`, `.btn-nav-blog`, `.btn-nav-resume` font-family from
`'Guisol', sans-serif` to `'Aptos Narrow', sans-serif`. Update font-size
from `22px` to `20px`.

### Step 2 — Header: RESUMÉ spelling
**File:** `src/components/layout/PortfolioHeader.astro`

Change `RESUME` to `RESUMÉ` in the button label.

### Step 3 — Ticker: Replace SVG stripe with CSS gradient
**File:** `src/components/layout/Ticker.tsx`

The items list is already up to date — no changes needed there.

Replace the `<img src="/assets/portfolio/warning-strip.svg">` overlay element
with a `<div>` using `repeating-linear-gradient` at `-45deg`. This makes the
stripe fully responsive at any container width without needing an asset.
Match the stripe color/opacity/width to the existing SVG before removing it.

### Step 4 — Page reorder: Extract bio into separate sections
**File:** `src/pages/index.astro`

Decompose `<section class="bio-container">` into:
- `BioTop` inline section (above projects)
- `BioBottom` inline section (below projects)
- Move stars `<Image>` to appear after each bio paragraph

### Step 5 — Bio text: Update brand list order
**File:** `src/pages/index.astro`

Keep SQUARESPACE in the brand list. Reorder from `"SPOTIFY, SQUARESPACE, VICE & BEYONCÉ"`
to `"VICE, SPOTIFY, SQUARESPACE & BEYONCÉ"` to match the new emphasis order.

### Step 6 — CSS: Bio bottom mixed font
**File:** `src/styles/portfolio.css`

In `.bio-btm`, confirm base font stays Iosevka Fixed Italic. For the
highlighted `<span class="highlight">` within bio-btm, the Figma uses Guisol
at a slightly smaller size (40px vs 45px surrounding text). Add:
```css
.bio-btm .highlight {
  font-family: 'Guisol', sans-serif;
  font-size: 40px;
}
```

### Step 7 — CSS: Project card title font
**File:** `src/styles/portfolio.css`

Change `.project-title` font-family from `'Aptos Narrow'` to `'Guisol', sans-serif`.
Update font-size to `1.875rem` (30px).

### Step 8 — CSS: Project link size
**File:** `src/styles/portfolio.css`

Reduce `.project-link` font-size from `0.938rem` to `0.625rem` (10px) to match
Figma spec.

### Step 9 — Blog cards: Add Subheading element
**File:** `src/pages/index.astro`

In the blog card map, add a `<p class="blog-subheading">` element showing
the post's publication date (formatted as "Month YYYY"). Place it below the
description `<p>`.

### Step 10 — CSS: Blog subheading style
**File:** `src/styles/portfolio.css`

Add new rule:
```css
body[data-layout-type='portfolio'] .blog-subheading {
  font-family: 'Aptos Narrow', sans-serif;
  font-size: 0.625rem; /* 10px */
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### Step 11 — CSS: Blog card title size
**File:** `src/styles/portfolio.css`

Confirm `.blog-title` is `font-size: 1.875rem` (30px) and `font-family: 'Aptos Narrow'`.
No change needed if current matches.

### Step 12 — Blog card: Wrap title in link
**File:** `src/pages/index.astro`

Wrap `<h3 class="blog-title">` in `<a href={...}>` and remove the separate
"Read More..." link if it's no longer in the v2 design.

### Step 13 — Verify bat backgrounds
**File:** `src/pages/index.astro`, `src/styles/portfolio.css`

After restructuring, ensure both bio sections have appropriate bat background
coverage. Current `BAT_.png` asset at `src/assets/portfolio/BAT_.png` can be
reused for both. Bio top section needs the bat at a large scale (overflow),
bio bottom can share or use a differently positioned instance.

### Step 14 — Smoke test
Run `bun dev` and verify:
- Page section order matches screenshot
- Button fonts are Aptos Narrow
- RESUMÉ has accent mark
- Ticker shows new tags
- Bio top appears above Projects
- Stars appear twice (above Projects, above Blog)
- Blog cards show subheading (date) element
- Project card titles are in Guisol

---

## Files Changed Summary

| File | Type of Change |
|------|---------------|
| `src/pages/index.astro` | Major structural reorder + new elements |
| `src/styles/portfolio.css` | Font/size updates, new `.blog-subheading` rule |
| `src/components/layout/PortfolioHeader.astro` | RESUMÉ typo fix |

**No new components** need to be created for this redesign.
**No new assets** need to be exported from Figma (all SVGs/images already exist).
**No new dependencies** required.

---

## Reference

- Figma node IDs for each section:
  - Header: `195:6363`
  - Warning Strip: `195:6327`
  - Middle Section (bios + bats): `195:5454`
  - Projects: `195:6304`
  - Blog: `195:5434`
  - TCHOTCHKES: `195:5481`
  - Globe: `195:5470`
  - Contact button: `195:10`
  - Hand mask: `195:13`
