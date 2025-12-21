# Implementation Status & Roadmap

**Last Updated**: 2025-12-11  
**Project**: Ethan Anderson Portfolio + Blog  
**Status**: Portfolio Foundation Complete

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
- [x] Separated blog styles from portfolio using `:not([data-layout-type='portfolio'])` selectors
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
- [x] Created scrolling tech stack ticker
- [x] Fixed text wrapping issue (changed to `inline-block`)
- [x] Implemented CSS animation (20s infinite scroll)
- [x] Applied warning stripe background styling

**Files:**
- `src/components/layout/Ticker.astro`

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

## Current Architecture

### Routing Structure

```
/                          → Portfolio landing (PortfolioLayout)
/blog/                     → Blog index (IndexLayout)
/blog/[slug]               → Individual posts (PostLayout)
```

### Layout Hierarchy

#### Portfolio Route (`/`)
```
BaseLayout (type="portfolio")
└── PortfolioLayout
    ├── PortfolioHeader
    ├── Ticker
    └── <slot> (page content)
```

#### Blog Routes (`/blog/*`)
```
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

2. **Layout-specific styles** (`<style is:global>`)
   - PortfolioLayout: body flexbox, 792px container
   - Blog layouts: specific overrides if needed

3. **Component-scoped styles** (`<style>`)
   - PortfolioHeader: fonts, button colors
   - Ticker: animation keyframes
   - Other components as needed

### Tailwind CSS v4 Integration

- **Plugin**: `@tailwindcss/vite` in astro.config.ts
- **Config**: Minimal `tailwind.config.js` (v4 auto-scans via imports)
- **Import-based scanning**: Files must import CSS containing `@import 'tailwindcss'`
- **Arbitrary values**: Fully supported (e.g., `w-[61px]`, `gap-[9px]`)

---

## Known Issues

### 🔴 Missing Custom Fonts

**Issue:**
- `/fonts/guisol.woff2` returns 404
- `/fonts/fit.woff2` returns 404

**Impact:**
- Button text falls back to sans-serif
- Name heading falls back to sans-serif
- Design doesn't match Figma specifications

**Resolution Required:**
- Obtain or create Guisol and Fit font files
- Place in `public/fonts/` directory
- Verify @font-face paths in PortfolioHeader.astro

**Files Affected:**
- `src/components/layout/PortfolioHeader.astro` (references fonts)
- `public/fonts/` (missing directory or files)

---

## Upcoming Work

### 🟡 Phase 2: Portfolio Content Sections

#### Tagline/Intro Section
- [ ] Create intro text component matching Figma
- [ ] Implement primary tagline (Iosevka Fixed, 25px)
- [ ] Implement secondary tagline with styled text
- [ ] Add decorative SVG elements (stars, waves, etc.)

**Design Specs:**
- Width: 713px
- Font: Iosevka Fixed, 25px, white
- Line height: 1.25em

**Files to Create:**
- `src/components/portfolio/IntroSection.astro`

#### Projects Section
- [ ] Create ProjectCard component
- [ ] Implement 4-project grid layout
- [ ] Add project data structure (title, description, links, tech stack)
- [ ] Style with white borders and transparent backgrounds
- [ ] Add "PROJECTS:" section header (Guisol, 45px)

**Design Specs:**
- Card structure: Title → Description → Meta (links + tech)
- Border: White stroke
- Background: Transparent
- Border radius: 0px (sharp corners)

**Files to Create:**
- `src/components/portfolio/ProjectCard.astro`
- `src/components/portfolio/ProjectsSection.astro`
- `src/data/projects.ts` (project data)

#### Blog Posts Section
- [ ] Create BlogPostCard component (similar to ProjectCard)
- [ ] Fetch latest 4 blog posts from content collection
- [ ] Display with title, excerpt, date
- [ ] Add "BLOG:" section header
- [ ] Link to full /blog route

**Files to Create:**
- `src/components/portfolio/BlogPostCard.astro`
- `src/components/portfolio/BlogSection.astro`

#### Contact CTA Button
- [ ] Create large contact button component
- [ ] Implement specs: 790×96px, #7fee40, 40px radius
- [ ] Add "GET IN TOUCH" text (Guisol, 45px, black)
- [ ] Determine contact action (mailto, form modal, /contact page)

**Design Specs:**
- Width: 790px
- Height: 96px
- Border radius: 40px
- Background: #7fee40
- Text: Guisol, 45px, black

**Files to Create:**
- `src/components/portfolio/ContactButton.astro`

#### Decorative Assets
- [ ] Source/create remaining SVG assets from Figma
- [ ] Add MOVIE GLOBE svg
- [ ] Add BAT svg
- [ ] Add HAND svg
- [ ] Add WAVE svg
- [ ] Add STARS svg variants
- [ ] Add TCHOTCHKES svg
- [ ] Add MASKED MAN svg
- [ ] Position assets as per Figma layout

**Files to Create:**
- `src/assets/portfolio/movie-globe.svg`
- `src/assets/portfolio/bat.svg`
- `src/assets/portfolio/hand.svg`
- `src/assets/portfolio/wave.svg`
- `src/assets/portfolio/stars-*.svg`
- `src/assets/portfolio/tchotchkes.svg`
- `src/assets/portfolio/masked-man.svg`

### 🟡 Phase 3: Blog Route Migration

**Goal:** Move blog from `/` to `/blog/`

- [ ] Create `src/pages/blog/index.astro` (current homepage logic)
- [ ] Create `src/pages/blog/[...slug].astro` (current post routing)
- [ ] Update internal links to point to `/blog/*`
- [ ] Add redirects from old URLs to new `/blog/*` structure
- [ ] Update RSS/Atom feed paths
- [ ] Update sitemap generation
- [ ] Test all blog functionality at new route

**Files to Modify:**
- `src/pages/index.astro` (becomes portfolio, not blog list)
- Create new blog route files
- Update navigation components
- `netlify.toml` (add redirect rules)

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
- **`docs/SPEC.md`** - Complete Figma design specs
- **Figma File**: `hxE0jhguSe2Irj2QoDH1JB`

### Key Constants

```typescript
// Layout
PORTFOLIO_MAX_WIDTH = 792px
MOBILE_BREAKPOINT = 968px

// Colors
BG_DARK = #282828
TEXT_WHITE = #FFFFFF
ACCENT_GREEN = #7FEE40
BUTTON_GRAY = #D9D9D9

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
pnpm build
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
- Update dependencies monthly (`pnpm update`)
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

### Q: Why 792px width?
**A:** Matches Figma canvas dimensions exactly. Creates "poster-style" narrow composition that centers in viewport with side spacing.

### Q: Why not use Tailwind config for custom values?
**A:** Tailwind v4 uses CSS-first configuration. Arbitrary values (e.g., `w-[61px]`) work out of the box. Custom theme extensions can be added to `tailwind.config.js` if needed for reusable values.

### Q: Why separate PortfolioLayout instead of conditional logic in BaseLayout?
**A:** Separation of concerns. Portfolio and blog have fundamentally different layout needs. Easier to maintain and reason about when separate.

### Q: How does Tailwind v4 scanning work without content array?
**A:** The `@tailwindcss/vite` plugin scans files that import CSS containing `@import 'tailwindcss'`. It follows the import graph automatically.

### Q: Why use data attributes instead of classes for layout types?
**A:** Data attributes are semantic and don't pollute the class namespace. They're perfect for state/type indicators that CSS selectors can target.

---

## Resources

- **Astro Docs**: https://docs.astro.build
- **Tailwind CSS v4**: https://tailwindcss.com/docs/v4-beta
- **Chiri Theme**: https://github.com/your-username/chiri (if applicable)
- **Figma Design**: https://www.figma.com/design/hxE0jhguSe2Irj2QoDH1JB
