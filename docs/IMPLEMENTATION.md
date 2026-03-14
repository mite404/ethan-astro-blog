# Implementation Status & Roadmap

**Last Updated**: 2026-03-13
**Project**: Ethan Anderson Portfolio + Blog
**Status**: Portfolio sections complete (all major components implemented and styled) + Bio section refinements complete

---

## Overview

This project is a hybrid site combining:

- **Portfolio landing page** at `/` (792px fixed-width poster composition)
- **Blog** at `/blog/*` (existing Chiri theme, responsive)

Both sections coexist in a single Astro 5 codebase with isolated styling systems.

---

## Completed Work

### ✅ Phase 1: Portfolio Foundation & CSS Architecture

#### Fixed-Width Layout System

- [x] Implemented 792px fixed-width "poster" composition matching Figma design
- [x] Created PortfolioLayout.astro with centered container approach
- [x] Added responsive breakpoint at 968px for mobile full-width
- [x] Configured body flexbox centering for side-spacing effect

**Files:**

- `src/layouts/PortfolioLayout.astro`

#### Style Isolation Architecture

- [x] Debugged Tailwind CSS v4 import issues
- [x] Added `import '@/styles/global.css'` to PortfolioLayout
- [x] Implemented conditional body padding using `data-layout-type` attributes
- [x] Separated blog styles from portfolio using
      `:not([data-layout-type='portfolio'])` selectors
- [x] Removed `!important` overrides in favor of proper CSS specificity

**Files:**

- `src/styles/global.css`
- `src/layouts/PortfolioLayout.astro`

#### Header Component

- [x] Built PortfolioHeader.astro with Figma specs
- [x] Implemented GitHub button (61×30px, #d9d9d9, 40px border-radius)
- [x] Implemented Blog button (61×30px, #7fee40, 40px border-radius)
- [x] Added Asterix icon (20×20px, top-left)
- [x] Positioned name heading with gradient dither background
- [x] Configured custom font loading (@font-face for Guisol, Fit)

**Files:**

- `src/components/layout/PortfolioHeader.astro`
- `src/assets/portfolio/asterix.svg`
- `src/assets/portfolio/grad-dither-group.svg`

#### Ticker Component

- [x] Created scrolling tech stack ticker (React component)
- [x] Implemented Motion library animation with dynamic text width measurement
- [x] Applied warning stripe SVG overlay (foreground layer)
- [x] Configurable items, separator, and speed props
- [x] Fixed text wrapping with whitespace-nowrap and proper height constraint
- [x] **FIXED (Feb 13):** Ticker now properly constrains width to 1280px
      container on all viewport sizes
  - Previously: Ticker expanded beyond 1280px on large viewports
  - Now: Ticker respects container boundaries and scales responsively
  - Solution: Added `max-w-[1280px]` constraint + responsive width handling

**Files:**

- `src/components/layout/Ticker.tsx` (React client component)
- `src/assets/portfolio/warning-strip.svg`

**Usage:**

```tsx
<Ticker
  items={['TypeScript', 'React', 'Tailwind']}
  separator="  |  "
  speed={40}
  className="custom-class"
/>
```

**Responsive Behavior:**

- Desktop (>1280px): Constrained to 1280px width, centered
- Tablet (968px–1280px): Full viewport width with responsive padding
- Mobile (<968px): Full viewport width with responsive padding

#### Parallax Hand Animation

- [x] Implemented scroll-triggered parallax hand (1.7x scaled, 2875px width)
- [x] Hand SVG properly converted to WOFF2 with italic angle (-12°)
- [x] Container overflow clipping at 1280px boundaries
- [x] Dynamic scroll range calculation based on globe position
- [x] Spring physics for smooth animation transitions
- [x] Positioned 150px left of center for dramatic composition

**Files:**

- `src/components/ui/ParallaxHand.tsx` (React client component)
- `src/assets/portfolio/HAND.svg` (1513×1123px original)

**Usage:**

```tsx
<ParallexHand client:load />
```

**Animation Details:**

- Scroll range: dynamically calculated from globe position
- Y transform: 800px (hidden) → -300px (thumb at globe center)
- Spring: stiffness 100, damping 30, mass 1
- Transform: centered horizontally, shifted 150px left

#### Documentation

- [x] Created SPEC.md with Figma design specifications
- [x] Created portfolio-css-analysis.md documenting debugging process
- [x] Created debugging prompt (001-debug-portfolio-css-styles.md)
- [x] Updated IMPLEMENTATION.md (this file)

**Files:**

- `docs/SPEC.md`
- `debugging-notes/portfolio-css-analysis.md`
- `prompts/001-debug-portfolio-css-styles.md`

---

## Architecture Reference

### Routing Structure

**Current:**

- `src/pages/index.astro` - Portfolio landing page (uses PortfolioLayout)
- `src/pages/[...slug].astro` - Dynamic routes for blog posts (uses getStaticPaths)
- `src/pages/404.astro` - 404 error page
- `src/pages/api/` - API routes for dynamic functionality
- `src/pages/open-graph/` - Open Graph image generation
- `src/pages/rss.xml.ts` and `src/pages/atom.xml.ts` - Feed generation

**Route Hierarchy:**

```text
/                          → Portfolio landing (PortfolioLayout)
/blog/                     → Blog index (IndexLayout)
/blog/[slug]               → Individual posts (PostLayout)
```

**Planned (Phase 3):**

- Move blog routes to `src/pages/blog/index.astro` and `src/pages/blog/[...slug].astro`
- Keep portfolio at `/`
- Update internal links and navigation

### Custom Remark/Rehype Plugins

Located in `src/plugins/`, these process markdown content:

- **remark-embedded-media.mjs** - Handles embedded media (videos, tweets, etc.)
- **remark-reading-time.mjs** - Calculates reading time
- **remark-toc.mjs** - Generates table of contents
- **rehype-image-processor.mjs** - Processes images for optimization
- **rehype-copy-code.mjs** - Adds copy button to code blocks
- **rehype-cleanup.mjs** - Cleans up HTML output

### Configuration Files

- **src/config.ts** - Main theme configuration (site info, general settings, date format, post features)
- **astro.config.ts** - Astro configuration with Tailwind v4 Vite plugin
- **tailwind.config.js** - Minimal config (v4 auto-scans via imports)
- **netlify.toml** - Netlify deployment config with headers and caching rules

### Path Aliases

The project uses `@/` as an alias for `src/` directory (configured in astro.config.ts).

### Build Process

The prebuild script (`scripts/toggle-proxy.ts`) runs before each build to handle proxy configuration
for deployment environments.

### Component Organization

**UI Components** (`src/components/ui/`)

- Reusable UI elements: ThemeManager, TableOfContents, ImageViewer, CopyCode, LinkCard, etc.

**Layout Components** (`src/components/layout/`)

- Structural components: Header, Footer, BaseHead, TransitionWrapper, PortfolioHeader, Ticker

**Widgets** (`src/components/widgets/`)

- Complex feature components for homepage sections

**Example Components** (`src/components/examples/`)

- Demonstration components (Callout, Tag) showing MDX capabilities

### TypeScript Configuration

- Extends Astro's strict TypeScript config with `strictNullChecks: true`
- Path alias `@/` resolves to `src/` directory
- All files (except dist) are included in TypeScript checking

### Layout Hierarchy

#### Portfolio Route (`/`)

```text
BaseLayout (type="portfolio")
└── PortfolioLayout
    ├── PortfolioHeader
    ├── Ticker
    └── <slot> (page content)
```

#### Blog Routes (`/blog/*`)

```text
BaseLayout (type="page")
└── IndexLayout / PostLayout
    └── <slot> (blog content)
```

### CSS Loading Order

1. **global.css** (imported by layouts)
   - `@import 'tailwindcss'` (Tailwind v4 via @tailwindcss/vite)
   - CSS custom properties (light/dark theme variables)
   - Base body styles
   - Conditional blog padding: `body:not([data-layout-type='portfolio'])`

2. **portfolio.css** (imported by index.astro page)
   - All portfolio-specific styles scoped to `body[data-layout-type='portfolio']`
   - Header, buttons, ticker, cards, bio sections styling
   - Typography, colors, animations
   - Responsive breakpoints (1024px, 640px)

3. **Layout-specific styles** (`<style is:global>`)
   - PortfolioLayout: body flexbox, 1280px container
   - Blog layouts: specific overrides if needed

4. **Component-scoped styles** (`<style>`)
   - PortfolioHeader: minimal (fonts delegated to portfolio.css)
   - Ticker: animation keyframes (if any)
   - Page-specific grid adjustments

### Tailwind CSS v4 Integration

- **Plugin**: `@tailwindcss/vite` in astro.config.ts
- **Config**: Minimal `tailwind.config.js` (v4 auto-scans via imports)
- **Import-based scanning**: Files must import CSS containing `@import 'tailwindcss'`
- **Arbitrary values**: Fully supported (e.g., `w-[61px]`, `gap-[9px]`)

---

## Known Issues

### ⏳ OUTSTANDING - Vite CSS Module Cache Invalidation: Nav Button Hover (Mar 13, 2026)

**User-Facing Bug:**

Navigation buttons (BLOG, GITHUB, RESUMÉ) at the top of the portfolio page only trigger hover states in the top 10–20px of the 50px pill-shaped button area, instead of across the entire button height. This regression appeared after recent changes to `portfolio.css` and bat background image paths.

**Root Cause:**

Vite's CSS module deduplication combined with a duplicate import pattern caused the browser to serve stale compiled CSS:

1. **Import pattern:** `global.css` has `@import './portfolio.css'` (line 4)
2. **Duplicate:** `src/pages/index.astro` also had `import '@/styles/portfolio.css'` in its frontmatter
3. **Deduplication:** When both files import the same module, Vite optimizes by caching the compiled result
4. **Cache staleness:** When `portfolio.css` was updated with new bat-zone-1 rules (position: absolute, height: 58rem) and font-size changes (19.7rem), Vite didn't invalidate the cached version
5. **Result:** Browser received old CSS missing the "BAT BACKGROUND ZONES" section entirely

**Evidence:**

Chrome DevTools inspection revealed:

- `.bat-zone-1` element with `position: static` (should be `absolute`)
- Nav buttons positioned at y=835px instead of y=16px
- `.portfolio-name` with `font-size: 100px` instead of `19.7rem`
- Old hover colors (purple/green) instead of current scheme
- All CSS rules for bat-zone-1 missing from loaded stylesheets

**Secondary Issues Discovered:**

1. Bat image path broken: `/assets/portfolio/BAT_TOP_CROPPED.png` → file moved to `/assets/BAT_TOP_CROPPED.png`
2. Duplicate Ticker frame appearing around component (symptom of stale CSS)

**The Fix:**

Three-part solution:

```bash
# 1. Clear Vite module cache
rm -rf node_modules/.vite/

# 2. Restart development server (forces CSS recompilation)
bun dev
```

Then in code:

```astro
# 3a. Remove duplicate import from src/pages/index.astro (line 2)
# DELETE: import '@/styles/portfolio.css'

# 3b. Fix bat image path in src/pages/index.astro (line 23)
# FROM: src="/assets/portfolio/BAT_TOP_CROPPED.png"
# TO:   src="/assets/BAT_TOP_CROPPED.png"
```

After restart, hard-refresh browser (Cmd+Shift+R / Ctrl+Shift+R) to load fresh CSS.

**Why This Happened:**

The architecture imports `portfolio.css` in two places:

- Global: `global.css` → imported by PortfolioLayout
- Page-level: `index.astro` → direct import in component

Vite's import deduplication is a performance optimization: it prevents duplicate CSS from being compiled and bundled. However, when CSS changes after the initial cache, Vite doesn't automatically invalidate the cache until the dependency graph is rebuilt (which requires clearing `.vite/` or restarting dev server).

**Prevention:**

Remove the duplicate import pattern. Since `global.css` already imports `portfolio.css`, `index.astro` doesn't need to. The CSS file reaches `index.astro` through the layout hierarchy:

```
index.astro
→ PortfolioLayout.astro
→ BaseLayout.astro
→ imports global.css
→ imports portfolio.css
```

**Files Affected:**

- `src/pages/index.astro` (duplicate import removed, bat path fixed)
- `src/styles/portfolio.css` (unchanged, but was being served stale)
- `global.css` (unchanged, still imports portfolio.css)

**Status:** Pending user restart and verification. Once dev server restarts with cache cleared, nav button hover should work across full 50px button height.

---

### ✅ RESOLVED - Custom Fonts Loading (Feb 13, 2026)

**Previous Issue:**

- `/fonts/guisol.woff2` returned 404 error
- `/fonts/fit.woff2` returned 404 error

**Resolution:**

- ✅ All custom fonts now properly loaded and rendering
- ✅ Guisol font displays in buttons and headers correctly
- ✅ Fit font displays in name heading correctly
- ✅ Iosevka Fixed loaded for bio text
- ✅ Design now matches Figma specifications with proper typography

**Files:**

- `public/fonts/guisol.woff2` (buttons, headers)
- `public/fonts/fit.woff2` (name heading)
- `public/fonts/iosevka-fixed-light-italic.woff2` (bio text)
- `src/components/layout/PortfolioHeader.astro` (@font-face
  declarations)

### ✅ RESOLVED - Typography Rendering Mismatch Between Figma & Browser (Feb 13, 2026)

**Previous Issue:**

- Project and blog card titles appeared tighter/more condensed in Chrome than in Figma design
- Letters lacked breathing room compared to design reference
- Visual discrepancy between design intent and implementation

**Root Cause:**

- Global CSS `text-rendering: optimizeLegibility` was applying aggressive kerning
- Figma uses Skia text rendering engine
- Chrome uses OS text shaping (CoreText on macOS)
- Different rendering engines = different letter spacing

**Resolution:**

```css
.project-title,
.blog-title {
  letter-spacing: 0.02em;
  text-rendering: geometricPrecision;
}
```

**Technical Explanation:**

- `text-rendering: geometricPrecision` overrides inherited `optimizeLegibility`, trusts font's designed
  spacing
- `letter-spacing: 0.02em` compensates for cross-platform rendering differences
- Display fonts (Guisol, Fit) need `geometricPrecision`; body fonts benefit from `optimizeLegibility`

**Verification Method:**

1. Screenshot Figma at 100% zoom
2. Screenshot browser at 100% zoom
3. Compare letter spacing visually
4. Adjust `letter-spacing` value until they match (0.02em achieved visual parity)

**Lesson Learned:**
Different text rendering engines produce different results. Cross-platform design consistency requires
explicit font-rendering hints and letter-spacing adjustments.

### ✅ RESOLVED - Bio Section Spacing & Star Asset Positioning (Mar 11, 2026)

**Previous Issue:**

- Top bio section and bottom bio section had inconsistent spacing around star dividers
- Bottom bio section's stars couldn't be repositioned—margin-top had no effect
- Container constraint preventing visual adjustments

**Root Cause:**

1. `.bio-btm` was missing `margin-bottom: 30px` that `.bio-top` had
2. `.bat-zone-2-wrapper` had fixed `min-height: 543px` with `overflow: hidden`, clipping star position adjustments

**Resolution:**

```css
/* src/styles/portfolio.css (line 217-218) */
body[data-layout-type='portfolio'] .bio-btm {
  margin-bottom: 30px; /* Added to match .bio-top */
}

/* src/styles/portfolio.css (line 50) */
body[data-layout-type='portfolio'] .bat-zone-2-wrapper {
  min-height: 800px; /* Increased from 543px to allow stars movement */
}
```

**Technical Details:**

- **Bio text spacing:** Both `.bio-top` and `.bio-btm` now have `margin-bottom: 30px`
- **Stars divider spacing:** Both use `.bio-stars-divider` with `margin-top: 100px` and `margin-bottom: 65px`
- **Container height:** Increased bat-zone-2-wrapper min-height from 543px → 800px to accommodate flexible star positioning
- **Architecture principle:** The `overflow: hidden` property clips content to container boundaries—when increasing spacing, parent container height must grow proportionally

**Files Modified:**

- `src/styles/portfolio.css` (lines 50, 217)

**Impact:**

- Star assets now position consistently in both bio sections
- Bio section spacing is visually balanced top-to-bottom
- Container has breathing room for future positioning adjustments without hitting overflow constraints

---

## Upcoming Work

### ✅ Phase 2: Portfolio Content Sections (Complete)

#### Tagline/Intro Sections

- [x] Implement bio sections with styled text
- [x] Primary tagline (Iosevka Fixed, 45px italic, white)
- [x] Secondary tagline with highlight color (#e071e3) styling
- [x] Proper typography and line-height (1.4)

**Design Specs:**

- Width: 713px
- Font: Iosevka Fixed, 25px, white
- Line height: 1.25em

**Note**: Intro sections now integrated directly into index.astro with
styled text blocks.

#### Projects Section

- [x] Implemented projects grid layout (1/2/4 column responsive)
- [x] Created project data structure in `src/data/projects.ts`
- [x] Styled cards with proper typography and spacing
- [x] Added "PROJECTS:" section header
- [x] Proper link styling and hover states (#e071e3)

**Implementation Details:**

- Card spacing: 1.5rem padding-bottom, 1rem margin-bottom on descriptions
- Title: Guisol, 30px uppercase
- Description: Aptos Narrow, 12px (0.7 opacity white)
- Links: Aptos Narrow, 12px with hover effect
- Details/Tech: Uppercase, 13px, 0.5 opacity white, letter-spacing

**Files:**

- `src/pages/index.astro` (projects section markup)
- `src/data/projects.ts` (project data)
- `src/styles/portfolio.css` (all card styles)

#### Blog Posts Section

- [x] Created blog post cards with dynamic content from content collection
- [x] Grid layout matching projects (1/2/4 column responsive)
- [x] Added "BLOG:" section header
- [x] Styled with consistent card styling
- [x] **NEW:** Implemented excerpt extraction utility (`src/utils/excerpt.ts`)
- [x] **NEW:** Dynamically fetches 4 most recent blog posts
- [x] **NEW:** Displays truncated titles (with ellipsis if > 16 chars)
- [x] **NEW:** Displays excerpts (first 45 chars of body text after first
      heading)
- [x] **NEW:** Links to individual blog post routes

**Implementation Details:**

- Uses `getSortedFilteredPosts()` to fetch and filter posts
- `.slice(0, 4)` gets the 4 most recent posts (sorted newest-first)
- `getExcerpt()` extracts plain-text excerpt from raw markdown:
  - Finds content after first `##` heading
  - Strips markdown formatting (bold, italic, links, code)
  - Truncates to 45 characters with `…` ellipsis
  - Safe fallback for posts without body content
- Title truncation to 16 characters for card fit:

  ```typescript
  {
    post.data.title.length > 16 ? post.data.title.slice(0, 16) + '…' : post.data.title
  }
  ```

- Links use `post.id` (filename slug) for route: `/{post.id}`

**Files:**

- `src/pages/index.astro` (blog section markup with `.map()`)
- `src/utils/excerpt.ts` (NEW - excerpt extraction utility)
- `src/utils/draft.ts` (getSortedFilteredPosts, getFilteredPosts)
- `src/styles/portfolio.css` (blog-card styles for responsive grid)

#### Styling Refactor

- [x] Extracted all portfolio styles to `src/styles/portfolio.css`
- [x] Scoped all styles to `body[data-layout-type='portfolio']`
- [x] Removed CSS specificity issues and `!important` overrides
- [x] Added responsive breakpoints (1024px, 640px)
- [x] Fixed indent spacing in PR #57

**Architecture Improvement:**
Portfolio-specific styles now live in dedicated file, preventing blog style conflicts.

#### Contact Button & Decorative Assets

- [x] Contact CTA Button (1280×158px responsive, #7fee40, Guisol 85px)
- [x] Decorative SVG assets (MOVIE GLOBE, BAT, HAND with parallax, STARS)
- [x] Parallax hand animation integrated with scroll behavior
- [x] Bio section with bat background image and stars divider
- [x] **COMPLETED:** Bio section spacing refinements (matching top/bottom bio margins)
- [x] **COMPLETED:** Star asset positioning flexibility (increased container height from 543px → 800px)
- [x] **COMPLETED:** Dynamic blog post fetching from content collection
- [ ] Optional: Project showcase with images

**Implementation Details:**

Bio sections now have consistent spacing:

```css
/* Both top and bottom bio text blocks */
.bio-top, .bio-btm {
  margin-bottom: 30px; /* Unified spacing */
}

/* Star dividers - both sections */
.bio-stars-divider {
  margin-top: 100px;
  margin-bottom: 65px;
}

/* Container height for bottom bio zone */
.bat-zone-2-wrapper {
  min-height: 800px; /* Allows flexible star positioning */
  overflow: hidden;
}

### Excerpt Utility (`src/utils/excerpt.ts`)

**Purpose:** Extract plain-text excerpts from raw markdown blog post content

**How It Works:**

1. Splits markdown into lines
2. Finds content after first `##` heading (skips `#` and `##` heading lines)
3. Skips empty lines and directive lines (starting with `::`)
4. Strips inline markdown formatting:
   - `**bold**` → `bold`
   - `*italic*` → `italic`
   - `[link text](url)` → `link text`
   - `` `code` `` → `code`
5. Truncates to specified length (default: 45 chars) with `…` ellipsis

**Function Signature:**

```typescript
export function getExcerpt(body: string, length = 45): string
```

**Usage in index.astro:**

```astro
{getExcerpt(post.body ?? '')}
```

**Edge Cases Handled:**

- Post with no body → returns empty string
- Post with no content after heading → returns empty string
- Short excerpts (< 45 chars) → returned as-is without ellipsis
- Markdown formatting → properly stripped to plain text

**Example:**

Input markdown:

```markdown
## Debrief

This week I led design and prototyping efforts for a new brand identity for
our boutique design agency, Fractal.
```

Output with `length = 45`:

```
This week I led the design and prototyping …
```

---

### ✅ Phase 3: Blog Route Migration (Complete - March 13, 2026)

**Goal:** Move blog from `/` to `/blog/`

- [x] Create `src/pages/blog/index.astro` (current homepage logic)
- [x] Create `src/pages/blog/[...slug].astro` (current post routing)
- [x] Update internal links to point to `/blog/*`
- [x] Add redirects from old URLs to new `/blog/*` structure
- [x] Update RSS/Atom feed paths
- [x] Update sitemap generation
- [x] Test all blog functionality at new route

**Files Modified:**

- ✅ `src/pages/index.astro` (portfolio landing, not blog list)
- ✅ `src/pages/blog/index.astro` (blog index, replaces old root list)
- ✅ `src/pages/blog/[...slug].astro` (dynamic post routing)
- ✅ `src/components/widgets/PostList.astro` (links updated to `/blog/`)
- ✅ `netlify.toml` (301 redirects from `/:slug` to `/blog/:slug`)

**Verification:**

```bash
/blog/week-07/  → 200 ✅ (routing works)
/week-07/       → 301 ✅ (permanent redirect)
bun run build   → ✅ (clean build, all pages generated)
```

**Key Implementation Details:**

- **Routing architecture:** `src/pages/blog/[...slug].astro` catches `/blog/*` via `getStaticPaths()`
- **Link generation:** `PostList.astro` generates `href={`/blog/${post.id}/`}` links
- **Backward compatibility:** Netlify redirects old `/week-07` URLs to `/blog/week-07` (301 permanent)
- **No breaking changes:** Blog functionality identical, just under new URL namespace

**See also:** `docs/FOR_ETHAN.md` "Phase 3 Complete: Blog URL Migration" for detailed architectural walkthrough.

### 🟢 Phase 4: Polish & Production

- [ ] Performance audit (Lighthouse)
- [ ] Accessibility audit (WCAG AA compliance)
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing
- [ ] SEO optimization (meta tags, structured data)
- [ ] Analytics integration (optional)
- [ ] Final design review against Figma

---

## Technical Debt

### CSS Architecture

- ⚠️ Consider extracting portfolio-specific CSS to separate file (`portfolio.css`)
- ⚠️ Evaluate need for CSS modules vs scoped styles for complex components
- ⚠️ Document `data-layout-type` system in BaseLayout.astro

### Font Strategy

- ⚠️ Implement font subsetting for custom fonts (reduce file size)
- ⚠️ Add fallback font stack that closely matches custom fonts
- ⚠️ Consider system font alternative if custom fonts unavailable

### Component Organization

- ⚠️ Create `src/components/portfolio/` directory for portfolio-specific components
- ⚠️ Separate blog components from portfolio components clearly
- ⚠️ Document component API and props

---

## Design System Reference

All design specifications are documented in:

- **`docs/portfolio-design-system.html`**
- **Figma File**: `hxE0jhguSe2Irj2QoDH1JB`

### Key Constants

```typescript
// Layout (from code)
PORTFOLIO_MAX_WIDTH = 1280px     // Actual canvas width (not 792px)
MOBILE_BREAKPOINT = 968px
HAND_SCALE = 1.7x                // 2875px width (1513 * 1.7)
HAND_OFFSET_LEFT = -150px        // Positioned left of center

// Colors
BG_DARK = #1c1c1c               // Actual background (not #282828)
TEXT_WHITE = #FFFFFF
ACCENT_GREEN = #7FEE40
BUTTON_GRAY = #D9D9D9
BUTTON_HOVER = #e071e3

// Typography
FONT_GUISOL = 'Guisol', sans-serif
FONT_FIT = 'Fit', sans-serif
FONT_IOSEVKA = 'Iosevka Fixed', monospace
```

---

## Testing Checklist

### Per-Component Testing

- [ ] Visual regression against Figma
- [ ] Responsive behavior (desktop, tablet, mobile)
- [ ] Accessibility (keyboard navigation, screen readers)
- [ ] Cross-browser (Chrome, Firefox, Safari, Edge)

### Integration Testing

- [ ] Portfolio → Blog navigation works
- [ ] Blog → Portfolio navigation works
- [ ] Theme toggle doesn't affect portfolio
- [ ] Build process completes without errors
- [ ] Deployed site matches local development

---

## Deployment Notes

### Build Command

```bash
bun build             # Recommended (faster)
pnpm build            # Alternative
```

### Netlify Configuration

- Adapter: `@astrojs/netlify`
- Build script runs `prebuild` (proxy toggle) automatically
- Static assets optimized via Sharp
- Headers configured in `netlify.toml`

### Environment Variables

None currently required for portfolio functionality.

---

## Maintenance

### Regular Tasks

- Update dependencies monthly (`bun add -D` or `pnpm update`)
- Review and merge Chiri theme updates (blog section)
- Monitor Lighthouse scores
- Review analytics (if implemented)

### Documentation Updates

When making significant changes, update:

- This file (`docs/IMPLEMENTATION.md`)
- `docs/SPEC.md` (if design changes)
- `CLAUDE.md` (if architecture changes)
- Component README files (if created)

---

## Questions & Decisions Log

### Q: Why not use Tailwind config for custom values?

**A:** Tailwind v4 uses CSS-first configuration. Arbitrary values (e.g.,
`w-[61px]`) work out of the box. Custom theme extensions can be added to
`tailwind.config.js` if needed for reusable values.

### Q: Why separate PortfolioLayout instead of conditional logic in BaseLayout?

**A:** Separation of concerns. Portfolio and blog have fundamentally different
layout needs. Easier to maintain and reason about when separate.

### Q: How does Tailwind v4 scanning work without content array?

**A:** The `@tailwindcss/vite` plugin scans files that import CSS containing
`@import 'tailwindcss'`. It follows the import graph automatically.

### Q: Why use data attributes instead of classes for layout types?

**A:** Data attributes are semantic and don't pollute the class namespace.
They're perfect for state/type indicators that CSS selectors can target.

---

## Resources

- **Astro Docs**: <https://docs.astro.build>
- **Tailwind CSS v4**: <https://tailwindcss.com/docs/v4-beta>
- **Chiri Theme**: <https://github.com/your-username/chiri> (if applicable)
- **Figma Design**: <https://www.figma.com/design/hxE0jhguSe2Irj2QoDH1JB>
