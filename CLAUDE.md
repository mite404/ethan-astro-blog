# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog built with Astro 5, based on the Chiri theme. It's a static site generator focused on markdown/MDX blog posts with custom plugins for enhanced content processing.

**Key technologies:**
- Astro 5 with MDX support
- TypeScript
- Deployed on Netlify (using @astrojs/netlify adapter)
- Package manager: pnpm

## Development Commands

### Essential Commands
```bash
pnpm dev              # Start development server
pnpm build            # Build for production (runs prebuild script first)
pnpm preview          # Preview production build
pnpm new <title>      # Create new blog post
pnpm new _<title>     # Create draft post (prefixed with underscore)
```

### Code Quality
```bash
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors
pnpm lint:md          # Lint markdown files
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting
```

### Maintenance
```bash
pnpm update-theme     # Update to latest theme version
```

## Architecture

### Content System
- **Content collections** are defined in [src/content.config.ts](src/content.config.ts)
- Blog posts live in `src/content/posts/` (markdown/MDX files)
- About page content in `src/content/about/`
- Posts starting with `_` are treated as drafts and filtered from production builds
- Frontmatter schema enforces: `title` (string), `pubDate` (date), `image` (optional string)

### Routing
- `src/pages/index.astro` - Homepage, displays post list
- `src/pages/[...slug].astro` - Dynamic routes for blog posts (uses `getStaticPaths`)
- `src/pages/404.astro` - 404 error page
- `src/pages/api/` - API routes for dynamic functionality
- `src/pages/open-graph/` - Open Graph image generation
- `src/pages/rss.xml.ts` and `src/pages/atom.xml.ts` - Feed generation

### Layout System
Three-tier layout hierarchy:
1. **BaseLayout** - Root HTML structure, theme management, global styles
2. **IndexLayout** - Extends BaseLayout for homepage/listing pages
3. **PostLayout** - Extends BaseLayout for individual blog posts

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
- **astro.config.ts** - Astro configuration with plugins pipeline
- **netlify.toml** - Netlify deployment config with headers and caching rules

### Path Aliases
The project uses `@/` as an alias for `src/` directory (configured in [astro.config.ts](astro.config.ts:44-48)).

### Build Process
The prebuild script (`scripts/toggle-proxy.ts`) runs before each build to handle proxy configuration for deployment environments.

## Working with Posts

### Creating New Posts
Always use the script: `pnpm new "Post Title"`
- Automatically generates frontmatter with current date
- Sanitizes title for filename (lowercase, hyphens for spaces)
- Creates file in `src/content/posts/`
- Use `pnpm new "_Draft Title"` to create drafts

### Post Filtering
Draft filtering logic is in `src/utils/draft.ts`. Posts starting with `_` are excluded from production but visible in development.

## Component Structure

### UI Components (`src/components/ui/`)
Reusable UI elements: ThemeManager, TableOfContents, ImageViewer, CopyCode, LinkCard, etc.

### Layout Components (`src/components/layout/`)
Structural components: Header, Footer, BaseHead, TransitionWrapper

### Widgets (`src/components/widgets/`)
Complex feature components for homepage sections

### Example Components (`src/components/examples/`)
Demonstration components (Callout, Tag) showing MDX capabilities

## Important Notes

- **Link cards require an adapter**: The `linkCard` feature needs a server adapter (Netlify, Vercel, etc.). Set `linkCard: false` in config.ts if deploying as static HTML
- **Math support**: Uses KaTeX for math rendering via remark-math and rehype-katex
- **Image optimization**: Uses Sharp for image processing
- **Theme toggle**: Can be enabled/disabled in config.ts (defaults to system theme)
- **Date format**: Highly configurable via config.ts (format, separator, position)
