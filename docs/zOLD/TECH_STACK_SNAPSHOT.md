# Astro Blog Tech Stack & Architecture Snapshot

**Purpose**: Reference document for planning portfolio site transformation while
maintaining blog functionality.

**Last Updated**: December 2, 2025

---

## Core Technology Stack

### Framework & Runtime

- **Astro 5.13.7** - Static site generator with partial hydration support
- **TypeScript 5.9.2** - Strict mode (`strictNullChecks: true`)
- **Node.js** with **pnpm** package manager + **bun** as task runner

### Build & Deployment

- **@astrojs/netlify v6.5.10** - Netlify adapter (enables server-side features
  like link cards)
- **Vite** - Build tool (included with Astro)
- **Sharp v0.34.3** - Image processing and optimization

### Content & Markdown

- **MDX v4.3.5** - Markdown with JSX component support
- **Remark** ecosystem:
  - `remark-math` - Math expression parsing
  - `remark-directive` - Custom markdown syntax extensions
  - Custom plugins: embedded-media, reading-time, table-of-contents
- **Rehype** ecosystem (HTML processing):
  - `rehype-katex` - Math rendering
  - Custom plugins: image-processor, copy-code, cleanup

### Styling & UI

- **CSS Modules** with scoped styling
- **@playform/inline v0.1.2** - CSS inlining for performance
- **KaTeX v0.16.22** - Mathematical typesetting

### Feed & SEO

- **@astrojs/rss v4.0.12** - RSS feed generation
- **@astrojs/sitemap v3.5.1** - XML sitemap generation
- **astro-og-canvas v0.7.0** - Open Graph image generation
- **Feed v5.1.0** - Atom feed support

### Code Quality

- **ESLint 9.35.0** with TypeScript support
- **Prettier 3.6.2** with Astro plugin
- **Markdownlint** - Markdown linting

---

## Directory Structure

### Root Configuration Files

```
astro.config.ts           # Main Astro config with integrations
tsconfig.json             # TypeScript configuration with @ alias
src/config.ts             # Theme config (single source of truth)
src/content.config.ts     # Content collection definitions
netlify.toml              # Netlify deployment configuration
package.json              # Dependencies and scripts
```

### `/src` Directory (Application Source)

#### `/src/content` - Content Collections

```
content/
├── posts/                # Blog posts (markdown/MDX files)
│   └── _assets/          # Post-associated assets
└── about/                # About page content
```

**Collection Schema**:

- `posts`: Requires `title`, `pubDate` (date), optional `image` (string)
- `about`: No required fields
- Draft filtering: Files prefixed with `_` excluded from production

#### `/src/pages` - Routes & Templates

```
pages/
├── index.astro           # Homepage - displays post listings
├── [...slug].astro       # Dynamic route for blog posts
├── 404.astro             # 404 error page
├── rss.xml.ts            # RSS feed endpoint
├── atom.xml.ts           # Atom feed endpoint
├── api/                  # API routes (server-side functionality)
└── open-graph/
    └── [...route].ts     # Open Graph image generation
```

#### `/src/layouts` - Template Hierarchy

```
layouts/
├── BaseLayout.astro      # Root layout (HTML, theme, globals)
├── IndexLayout.astro     # Extends BaseLayout for listing pages
└── PostLayout.astro      # Extends BaseLayout for individual posts
```

#### `/src/components` - UI Components

```
components/
├── layout/               # Structural components
│   ├── Header.astro
│   ├── Footer.astro
│   ├── BaseHead.astro    # Meta tags & head setup
│   └── TransitionWrapper.astro
├── ui/                   # Reusable UI elements
│   ├── ThemeManager.astro
│   ├── ThemeToggle.astro
│   ├── TableOfContents.astro
│   ├── ImageViewer.astro
│   ├── CopyCode.astro
│   ├── LinkCard.astro
│   ├── GitHubCard.astro
│   ├── NeoDBCard.astro
│   └── ... (10+ additional UI components)
├── widgets/              # Complex feature components
│   ├── PostList.astro
│   ├── About.astro
│   ├── FormattedDate.astro
│   └── FootnoteScroll.astro
└── examples/             # Demo components (MDX examples)
    ├── Callout.astro
    ├── Tag.astro
    └── CounterButton.astro
```

#### `/src/plugins` - Custom Markdown Processing

```
plugins/
├── remark-embedded-media.mjs  # Embedded media (videos, tweets,
│                               # Spotify, YouTube, Bilibili, X, GitHub,
│                               # NeoDB, Apple Music)
├── remark-reading-time.mjs    # Calculate reading time metric
├── remark-toc.mjs             # Generate table of contents
├── rehype-image-processor.mjs  # Image optimization pipeline
├── rehype-copy-code.mjs        # Add copy button to code blocks
└── rehype-cleanup.mjs          # Clean up HTML output
```

**Custom Apple Music Embed Handler**:

- **Location**: Inside `remark-embedded-media.mjs` as `applemusic` handler
- **Type**: Custom remark directive (not published npm plugin)
- **Supports**: Apple Music songs, albums, and playlists
- **Purpose**: Alternative to Spotify embeds for music in blog posts
- **Usage**: `::applemusic{url="https://music.apple.com/..."}`
- **Height Logic**:
  - Single tracks (`?i=`): 175px
  - Albums/Playlists: 450px
- **Transform**: Converts `music.apple.com` → `embed.music.apple.com`

#### `/src/utils` - Utility Functions

```
utils/
├── draft.ts              # Draft post filtering logic
├── date.ts               # Date formatting utilities
├── feed.ts               # Feed generation helpers
├── image-config.ts       # Sharp image processing config
└── ... (additional utilities)
```

#### `/src/types` - TypeScript Definitions

```
types/
├── index.ts
├── config.types.ts       # Theme config type definitions
├── component.types.ts    # Component prop types
├── content.types.ts      # Content collection types
└── ... (additional type definitions)
```

#### `/src/styles` - Stylesheets

```
styles/
└── *.css                 # Global and component-scoped styles
```

#### `/src/env.d.ts`

- Astro type definitions & environment configuration

---

## Key Configuration Details

### Theme Configuration (`src/config.ts`)

Central configuration object controlling site behavior:

```typescript
{
  site: {
    website: string,      // Site domain
    title: string,        // Site title
    author: string,       // Author name
    description: string,  // Site description
    language: string      // Default language (en-US)
  },
  general: {
    contentWidth: string,           // Content width (35rem default)
    centeredLayout: boolean,        // Layout alignment
    themeToggle: boolean,           // Show theme toggle button
    postListDottedDivider: boolean, // Visual divider option
    footer: boolean,                // Show footer
    fadeAnimation: boolean          // Enable fade animations
  },
  date: {
    dateFormat: string,    // YYYY-MM-DD, MM-DD-YYYY, etc.
    dateSeparator: string, // . - / (except word-based formats)
    dateOnRight: boolean   // Date position in post lists
  },
  post: {
    readingTime: boolean,  // Show reading time in posts
    toc: boolean,          // Show table of contents
    imageViewer: boolean,  // Enable image viewer
    copyCode: boolean,     // Enable copy button in code blocks
    linkCard: boolean      // Enable link card (requires adapter)
  }
}
```

### Content Processing Pipeline

1. **Remark plugins** (Markdown → AST transformation):
   - Math, Directives, Embedded Media, Reading Time, TOC
2. **Rehype plugins** (HTML processing):
   - KaTeX, Cleanup, Image Processing, Copy Code Buttons
3. **Shiki** - Syntax highlighting for code blocks

### Asset Handling

- Images: Sharp for processing with CSS inlining
- Posts have associated assets in `src/content/posts/_assets/`
- Open Graph images generated on-the-fly via canvas

---

## Build Process

### Scripts (from `package.json`)

```
pnpm dev              # Start development server
pnpm build            # Build → runs prebuild script first
pnpm preview          # Preview production build
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors
pnpm lint:md          # Lint markdown files
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting
pnpm new "<title>"    # Create new blog post
pnpm new "_<title>"   # Create draft post
pnpm update-theme     # Update to latest theme version
```

### Pre-build Script (`scripts/toggle-proxy.ts`)

Runs before each build to handle proxy configuration for deployment
environments.

---

## Path Aliases

- `@/` → `src/` (configured in `astro.config.ts` and `tsconfig.json`)
- Usage: `import { Component } from '@/components/...'`

---

## Current Feature Set

### Enabled Features (from `src/config.ts`)

- **Table of Contents** - Auto-generated from headings
- **Image Viewer** - Interactive image expansion
- **Copy Code Button** - Code block enhancement
- **Link Cards** - Rich link previews (requires Netlify adapter)
- **Reading Time** - Currently disabled
- **Math Support** - KaTeX rendering enabled
- **Theme Toggle** - Currently disabled (uses system theme)
- **Custom Directives** - Remark directive support for extended syntax

### Disabled Features

- Reading time display
- Theme toggle UI

---

## CI/CD Pipeline

### GitHub Actions (`.github/workflows/ci.yml`)

- **Triggers**: Push to `main`/`master`, pull requests
- **validate job**: Checkout → Setup Bun → Install deps →
  Check formatting (non-blocking) → ESLint (non-blocking) → Lint → Build
- **auto-merge job**: Auto-approves and squash-merges Dependabot PRs or
  PRs labeled `automerge` (requires validate job success)
- **Concurrency**: Single workflow per branch (cancels in-progress runs)

### Dependabot (`.github/dependabot.yml`)

- **Schedule**: Weekly Monday 09:00 (Asia/Shanghai)
- **NPM**: Ignores major version updates, 10 PR limit, prefixes: `deps`
  (prod), `dev` (dev), assignee: `the3ash`
- **GitHub Actions**: Same schedule, 10 PR limit, prefix: `github-actions`
- **Labels**: `dependencies`, `automated` (+ `github-actions` for actions
  updates)

### Netlify Configuration

**`netlify.toml`**:

- **Build**: `publish = "dist"`, `command = "bun run build"`
- **Processing**: CSS/JS bundling & minification, HTML pretty URLs
- **Security Headers** (global): SAMEORIGIN, nosniff, strict CSP
  (allows `self` + `unsafe-inline` for scripts/styles, bilibili embeds)
- **Cache Strategy**:
  - Homepage `/`: 30min (short - frequent changes)
  - Blog posts `/*/ `: 24hrs (longer - stable content)
  - Static assets `/_astro/*`, `/assets/*`, fonts: 1 year (immutable)
  - Images: 1 year (immutable)
- **Redirects**: `/_astro/*` → `/_astro/:splat` (200 rewrite)

**`.netlify/` Directory**:

- `v1/config.json`: Netlify API config (generated, synced from
  `netlify.toml`)
- `state.json`: Local Netlify state tracking

### Deployment

- **Host**: Netlify with `@astrojs/netlify` adapter
- **Trigger**: Automatic on push to `main`/`master`
- **Feeds**: RSS at `/rss.xml`, Atom at `/atom.xml`,
  Sitemap at `/sitemap-index.xml`

---

## Important Constraints & Notes

1. **Link Card Adapter Requirement**: Link card feature requires a server
   adapter (Netlify, Vercel). Set `linkCard: false` if deploying as
   static HTML.

2. **Static Site Limitation**: Currently optimized for static generation.
   Dynamic features are limited to Netlify-specific capabilities.

3. **Content Collection Schema**: Content collections require frontmatter
   matching defined schemas (title, pubDate, optional image).

4. **Image Optimization**: Images are automatically processed by Sharp with
   CSS inlining via @playform/inline (excluding KaTeX-related images).

5. **Draft Filtering**: Posts starting with `_` are excluded from
   production builds via `src/utils/draft.ts`.

6. **TypeScript Strict Mode**: All code must pass strict TypeScript
   checking.

---

## Potential Portfolio Transformation Points

### Low-Impact Changes

- Modify `src/config.ts` to change site title, author, description
- Add new page routes in `src/pages/` (projects, experience, etc.)
- Create new components in `src/components/`
- Modify layout structure without changing content system

### Medium-Impact Changes

- Add new content collections in `src/content.config.ts`
  (projects, experience, etc.)
- Modify homepage layout (`src/pages/index.astro`)
- Change styling globally via `src/styles/`

### High-Impact Changes

- Restructure page routing system
- Modify or remove blog-specific features
- Change core layout hierarchy
- Remove/replace content collections

### To Preserve Blog Functionality

- Keep `src/content/posts/` and posts collection intact
- Maintain `PostLayout.astro` for post rendering
- Preserve markdown processing pipeline
- Keep feed generation intact

---

## Portfolio Transformation Layout Architecture

### Design Goals

The portfolio transformation must maintain the excellent blog layout design
while creating a distinct portfolio experience:

1. **Preserve Blog Formatting**: The current blog post layout has excellent
   design - particularly the left sidebar with table of contents, navigation
   headers, and back button. This should remain untouched for blog posts.

2. **Portfolio as Primary Landing Page**: The homepage (`src/pages/index.astro`)
   will become the portfolio page with a **unique custom layout** - different
   visual design from the blog.

3. **Featured Recent Blog Post**: On the portfolio landing page, include a
   preview/featured section of the most recent blog post as proof of technical
   writing capability.

4. **Separate Blog Section**: Once the user navigates away from the portfolio
   homepage, they enter the blog section which maintains all current blog
   formatting (PostLayout with left sidebar, TOC, back button, etc.).

### Layout Hierarchy Strategy

**Current State**:

- `BaseLayout.astro` → `IndexLayout.astro` (homepage list of posts)
- `BaseLayout.astro` → `PostLayout.astro` (individual blog posts)

**Proposed State for Portfolio**:

- `BaseLayout.astro` → `PortfolioLayout.astro` (NEW - portfolio landing,
  unique design)
  - Features custom portfolio-specific styling and layout
  - Includes featured recent blog post preview section
- `BaseLayout.astro` → `PostLayout.astro` (existing - unchanged for blog
  posts)
  - Maintains all current formatting with left sidebar, TOC, back button
  - Preserves padding and spacing design
- `BaseLayout.astro` → `BlogListLayout.astro` (optionally new - blog
  archive/listing)
  - Could be used for `/blog` or `/posts` archive page
  - Uses current post listing design

### File/Folder Changes Required

1. **Homepage Route** (`src/pages/index.astro`):
   - Migrate from post listing to portfolio landing page
   - Use new `PortfolioLayout.astro`
   - Query single most recent blog post for featured preview
   - Design custom portfolio sections (projects, experience, skills, etc.)

2. **New Layout** (`src/layouts/PortfolioLayout.astro`):
   - Custom portfolio-specific design
   - NOT based on blog aesthetic
   - Includes featured blog post preview component
   - Separate styling in `src/styles/portfolio.css` or similar

3. **Content Collections** (optional):
   - Consider adding new collections for portfolio items (projects,
     experience)
   - Or keep portfolio data in config/components if content is minimal

4. **Components**:
   - Create new portfolio-specific components in `src/components/portfolio/`
     (suggested)
   - Create featured blog preview component (could go in
     `src/components/widgets/`)
   - Keep existing blog components untouched

### Critical Design Constraints

- **PostLayout.astro** must remain unchanged for blog posts
- **Left sidebar with TOC and back button** stays exactly as-is in blog
  context
- **Blog post padding/spacing** must not be affected by portfolio changes
- **Navigation context matters**: When on a blog post, show blog layout.
  When on portfolio, show portfolio layout.

### Implementation Priority

**Phase 1 - Preserve Blog**:

1. Understand current `PostLayout.astro` structure in detail
2. Ensure all blog-specific styling is contained and won't be overridden

**Phase 2 - Create Portfolio Landing**:

1. Create `PortfolioLayout.astro` with distinct styling
2. Query most recent blog post for featured preview
3. Redesign `src/pages/index.astro` as portfolio page

**Phase 3 - Add Portfolio Content**:

1. Create portfolio-specific components
2. Add projects/experience sections
3. Style featured blog preview to fit portfolio aesthetic
