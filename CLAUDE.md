# CLAUDE.md

**Last Updated**: 2025-12-27

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a hybrid portfolio + blog site built with Astro 5. The portfolio landing page uses a fixed-width poster-style composition (792px), while the blog section is based on the Chiri theme with responsive design.

**Key technologies:**

- Astro 5 with MDX support
- Tailwind CSS v4 (via @tailwindcss/vite)
- TypeScript (strict mode)
- Deployed on Netlify (using @astrojs/netlify adapter)
- **Task runner:** Bun (preferred) with pnpm as package manager fallback

**Site Structure:**

- `/` - Portfolio landing page (fixed 792px width, poster composition)
- `/blog` - Blog section (responsive, Chiri theme)
- Isolated styling systems using `data-layout-type` attributes

**Documentation:**

- `docs/SPEC.md` - Design specifications from Figma
- `docs/IMPLEMENTATION.md` - Implementation status and roadmap
- `debugging-notes/` - Debug session documentation

**Site Structure:**

- `/` - Portfolio landing page (fixed 792px width, poster composition)
- `/blog` - Blog section (responsive, Chiri theme)
- Isolated styling systems using `data-layout-type` attributes

**Documentation:**

- `docs/SPEC.md` - Design specifications from Figma
- `docs/IMPLEMENTATION.md` - Implementation status and roadmap
- `debugging-notes/` - Debug session documentation

## Development Commands

**Preferred task runner: Bun** (faster, more efficient)

### Essential Commands

```bash
bun dev               # Start development server
bun build             # Build for production (runs prebuild script first)
bun preview           # Preview production build
bun new <title>       # Create new blog post
bun new _<title>      # Create draft post (prefixed with underscore)
```

**Fallback (pnpm):**

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm new <title>      # Create new blog post
pnpm new _<title>     # Create draft post
```

### Code Quality

```bash
bun lint              # Run ESLint
bun lint:fix          # Fix ESLint errors
bun lint:md           # Lint markdown files
bun format            # Format code with Prettier
bun format:check      # Check code formatting
```

### Maintenance

```bash
bun update-theme      # Update to latest theme version
```

## Project Structure

The main source code is organized as follows:

- **src/content/** - Markdown/MDX content files and collection schemas
- **src/pages/** - Astro page and API route files
  - `index.astro` - Portfolio landing page
  - `[...slug].astro` - Dynamic routes for blog posts
  - `blog/` - Blog section routes (planned)
  - `api/` - API routes for dynamic functionality
  - `open-graph/` - Open Graph image generation
- **src/layouts/** - Page layout components
  - `BaseLayout.astro` - Root HTML structure, sets `data-layout-type` attribute
  - `PortfolioLayout.astro` - Portfolio-specific layout (792px fixed width)
  - `IndexLayout.astro` - Blog index layout
  - `PostLayout.astro` - Individual blog post layout
- **src/components/** - Reusable UI and feature components
  - **layout/** - Structural components (Header, Footer, PortfolioHeader, Ticker, BaseHead)
  - **ui/** - Reusable UI elements (ThemeManager, TableOfContents, ImageViewer, etc.)
  - **widgets/** - Complex feature components for homepage sections
  - **examples/** - MDX demonstration components (Callout, Tag)
- **src/assets/portfolio/** - Portfolio-specific images and SVGs
- **src/styles/** - Global and component styles
  - `global.css` - Imports Tailwind v4, defines CSS variables, base styles
  - `fonts.css` - Font definitions
  - `post.css` - Blog post-specific styles
- **src/utils/** - Utility functions and helpers
- **src/types/** - TypeScript type definitions
- **src/plugins/** - Custom Remark/Rehype plugins for markdown processing
- **scripts/** - Build and utility scripts (toggle-proxy.ts, new-post.ts, update-theme.ts)
- **docs/** - Project documentation (SPEC.md, IMPLEMENTATION.md)
- **debugging-notes/** - Debug session documentation
- **prompts/** - Claude Code task prompts

## Architecture

### Dual Layout System

The project maintains two distinct visual systems:

#### Portfolio Layout (`data-layout-type="portfolio"`)

- **Route:** `/` (index.astro)
- **Layout:** PortfolioLayout.astro
- **Width:** Fixed 792px, centered with flexbox
- **Styling:** Tailwind v4 utilities + custom CSS
- **Components:** PortfolioHeader, Ticker, portfolio-specific sections
- **Design:** High-contrast (#282828 bg, #FFFFFF text, #7FEE40 accent)

#### Blog Layout (`data-layout-type="page"`)

- **Routes:** `/blog/*` (planned migration)
- **Layouts:** IndexLayout.astro, PostLayout.astro
- **Width:** Responsive, max-width defined by theme
- **Styling:** Chiri theme styles
- **Components:** Header, Footer, blog-specific widgets

### Style Isolation Architecture

The key to separating portfolio from blog styles:

1. **BaseLayout sets `data-layout-type` attribute** on `<body>` element
2. **global.css uses conditional selectors:**
   ```css
   /* Blog-specific padding (NOT applied to portfolio) */
   body:not([data-layout-type='portfolio']) {
     padding: 6rem 1.5rem 1.5rem 1.5rem;
   }
   ```
3. **Each layout imports global.css** to load Tailwind v4
4. **Layout-specific styles use scoped or global blocks** as needed

### Tailwind CSS v4 Integration

**Important differences from v3:**

- **No `content` array in config** - Scans files based on CSS imports
- **Import-based:** Files must import CSS containing `@import 'tailwindcss'`
- **Plugin:** Uses `@tailwindcss/vite` in astro.config.ts
- **Arbitrary values:** Fully supported (e.g., `w-[61px]`, `gap-[9px]`)

**How it works:**

1. `src/styles/global.css` contains `@import 'tailwindcss'`
2. Layouts import global.css: `import '@/styles/global.css'`
3. Tailwind Vite plugin scans imported file's dependency graph
4. Generates utility classes for all components in that tree

**Critical:** If a layout doesn't import global.css, Tailwind utilities won't work in that route!

### Content System

- **Content collections** are defined in [src/content.config.ts](src/content.config.ts)
- Blog posts live in `src/content/posts/` (markdown/MDX files)
- About page content in `src/content/about/`
- Posts starting with `_` are treated as drafts and filtered from production builds
- Frontmatter schema enforces: `title` (string), `pubDate` (date), `image` (optional string)

### Routing

**Current:**

- `src/pages/index.astro` - Portfolio landing page (uses PortfolioLayout)
- `src/pages/[...slug].astro` - Dynamic routes for blog posts (uses getStaticPaths)
- `src/pages/404.astro` - 404 error page
- `src/pages/api/` - API routes for dynamic functionality
- `src/pages/open-graph/` - Open Graph image generation
- `src/pages/rss.xml.ts` and `src/pages/atom.xml.ts` - Feed generation

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

### Configuration

- **src/config.ts** - Main theme configuration (site info, general settings, date format, post features)
- **astro.config.ts** - Astro configuration with Tailwind v4 Vite plugin
- **tailwind.config.js** - Minimal config (v4 auto-scans via imports)
- **netlify.toml** - Netlify deployment config with headers and caching rules

### Path Aliases

The project uses `@/` as an alias for `src/` directory (configured in astro.config.ts).

### Build Process

The prebuild script (`scripts/toggle-proxy.ts`) runs before each build to handle proxy configuration for deployment environments.

## Working with Posts

### Creating New Posts

Always use the script: `bun new "Post Title"` (or `pnpm new` as fallback)

- Automatically generates frontmatter with current date
- Sanitizes title for filename (lowercase, hyphens for spaces)
- Creates file in `src/content/posts/`
- Use `bun new "_Draft Title"` to create drafts (prefix with underscore)

### Post Filtering

Draft filtering logic is in `src/utils/draft.ts`. Posts starting with `_` are excluded from production but visible in development.

## Portfolio Components

### PortfolioLayout.astro

**Purpose:** Fixed-width (1280px) centered layout for portfolio pages

**Key features:**

- Imports global.css (critical for Tailwind v4)
- Sets `data-layout-type="portfolio"` via BaseLayout
- `overflow: hidden` on `.portfolio-layout` to clip overflowing assets (e.g., parallax hand)
- Uses flexbox centering on body for side-spacing effect
- Responsive: 1280px desktop, 100% width mobile (<1536px)

### PortfolioHeader.astro

**Components:**

- Asterix icon (20×20px, top-left)
- GitHub button (100×50px, #D9D9D9, 40px radius)
- Blog button (100×50px, #7FEE40, 40px radius)
- Name heading ("Ethan Anderson", 100px Fit font, #7FEE40)
- Gradient dither background (1280×78px SVG)

**Fonts:**

- Uses @font-face to load Guisol (buttons) and Fit (name)
- Font files: `public/fonts/guisol.woff2` and `public/fonts/fit.woff2`
- ✅ All font files resolved and working

### Ticker.tsx (React Component)

**Purpose:** Scrolling tech stack ticker with warning stripe SVG overlay

**Implementation:**

- React component with Motion library animation
- Dynamic text width measurement using `useRef`
- SVG warning stripe overlay (foreground layer at z-10)
- Repeats text 4x for seamless loop animation
- Configurable props: `items`, `separator`, `speed`, `className`

**Props:**

```tsx
interface TickerProps {
  items?: string[] // Tech tags to display
  separator?: string // Divider between items (default: "  |  ")
  speed?: number // Animation duration in seconds (default: 40)
  className?: string // Additional CSS classes
}
```

### ParallaxHand.tsx (React Component)

**Purpose:** Scroll-triggered parallax hand animation with proper scaling

**Implementation:**

- 1.7x scaled hand asset (2875px width, intentional overflow)
- Motion library scroll transforms with spring physics
- Dynamic scroll range calculation based on globe DOM position
- Positioned 150px left of center for composition
- Container `overflow: hidden` on parent clips to 1280px boundary

**Key Features:**

- Scroll range: dynamically calculated from `.portfolio-layout` and `[data-globe-container]` positions
- Y animation: 800px (hidden below) → -300px (thumb at globe center)
- Spring physics: stiffness 100, damping 30, mass 1
- Hand asset: `HAND.svg` (1513×1123px), scaled to 2875px width

## Component Structure

### UI Components (`src/components/ui/`)

Reusable UI elements: ThemeManager, TableOfContents, ImageViewer, CopyCode, LinkCard, etc.

### Layout Components (`src/components/layout/`)

Structural components: Header, Footer, BaseHead, TransitionWrapper, PortfolioHeader, Ticker

### Widgets (`src/components/widgets/`)

Complex feature components for homepage sections

### Example Components (`src/components/examples/`)

Demonstration components (Callout, Tag) showing MDX capabilities

## TypeScript Configuration

- Extends Astro's strict TypeScript config with `strictNullChecks: true`
- Path alias `@/` resolves to `src/` directory
- All files (except dist) are included in TypeScript checking

## Code Quality Standards

**ESLint Rules:**

- Console statements are warned (only `console.warn` and `console.error` allowed)
- Unused variables warned (except those prefixed with `_`)
- `any` types warned but not forbidden
- Prettier is integrated for code formatting

## Important Notes

### Tailwind v4 Specifics

- **Must import global.css in layouts** - Otherwise Tailwind utilities won't render
- **Import-based scanning** - No need to configure content paths
- **Arbitrary values work** - `w-[61px]`, `h-[30px]`, etc. are fully supported
- **CSS-first config** - Use `@import 'tailwindcss'` in CSS files

### Style Isolation

- **Use `data-layout-type` attributes** - Set by BaseLayout, target with CSS selectors
- **Conditional styling via `:not()`** - Blog styles exclude portfolio: `body:not([data-layout-type='portfolio'])`
- **Avoid `!important`** - Use proper specificity and selectors instead

### Design System

- **Reference docs/SPEC.md** for complete design specifications
- **Figma file:** hxE0jhguSe2Irj2QoDH1JB
- **Color palette:** #282828 (bg), #FFFFFF (text), #7FEE40 (accent), #D9D9D9 (button)
- **Layout:** 792px fixed width, poster-style composition

### General

- **Link cards require an adapter**: The `linkCard` feature needs a server adapter (Netlify, Vercel, etc.). Set `linkCard: false` in config.ts if deploying as static HTML
- **Math support**: Uses KaTeX for math rendering via remark-math and rehype-katex
- **Image optimization**: Uses Sharp for image processing with CSS inlining via @playform/inline
- **Theme toggle**: Can be enabled/disabled in config.ts (defaults to system theme)
- **Date format**: Highly configurable via config.ts (format, separator, position)
- **Custom directives**: Supports remark-directive for custom markdown syntax extensions

## Known Issues

### ✅ RESOLVED - Font System

**Previous Issue:**

- `/fonts/guisol.woff2` was returning 404
- `/fonts/fit.woff2` was returning 404

**Resolution (Dec 27, 2025):**

- ✅ All custom fonts now loaded and working
- ✅ Iosevka ExtraLight Italic converted to WOFF2 (10KB subset)
- ✅ Italic angle set to -12° for proper slant rendering
- ✅ All @font-face declarations properly configured

**Font Stack:**

- Guisol (buttons, headers) - `public/fonts/guisol.woff2`
- Fit (name heading) - `public/fonts/fit.woff2`
- Iosevka ExtraLight Italic (bio text) - `public/fonts/iosevka-extralight-italic.woff2`

See `docs/IMPLEMENTATION.md` for detailed implementation status and roadmap.
