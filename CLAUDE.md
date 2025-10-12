# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production (includes prebuild script that toggles proxy/adapter based on linkCard config)
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues automatically
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm new <title>` - Create new blog post (use `_title` for drafts)
- `pnpm update-theme` - Update theme to latest version

## Architecture

This is an Astro-based blog using the "Chiri" theme with the following key characteristics:

### Framework Stack

- **Astro 5.x** - Main framework with SSG/SSR capabilities
- **TypeScript** - Strict configuration with path aliases (`@/*` → `src/*`)
- **MDX + Markdown** - Content system with custom remark/rehype plugins
- **CSS** - Custom styling with CSS variables for theming

### Content System

- Blog posts in `src/content/posts/` (`.md` and `.mdx` files)
- About page in `src/content/about/about.md`
- Content collections defined in `src/content.config.ts` with Zod schema validation
- Frontmatter schema: `title` (string), `pubDate` (date), `image` (optional string)

### Configuration

- Main theme config in `src/config.ts` controls layout, features, and behavior
- Key toggleable features: theme toggle, reading time, TOC, image viewer, copy code, link cards
- Adapter configuration dynamically toggled based on `linkCard` setting via prebuild script

### Custom Plugins

- `remark-embedded-media.mjs` - Media embedding
- `remark-reading-time.mjs` - Reading time calculation
- `remark-toc.mjs` - Table of contents generation
- `rehype-cleanup.mjs` - HTML cleanup
- `rehype-image-processor.mjs` - Image processing
- `rehype-copy-code.mjs` - Code copy functionality

### Layout Structure

- `BaseLayout.astro` - Root layout with theme management and transitions
- `IndexLayout.astro` - Homepage layout
- `PostLayout.astro` - Blog post layout
- Components organized in `components/ui/`, `components/layout/`, `components/widgets/`

### Dynamic Features

- Conditional adapter loading (Netlify adapter enabled/disabled based on linkCard config)
- API proxy at `/api/proxy.ts` for link card functionality
- Theme switching with system preference detection
- Image optimization with Sharp
- OpenGraph image generation

### Build Process

- Prebuild script (`scripts/toggle-proxy.ts`) automatically enables/disables proxy and adapter based on `linkCard` setting in config
- Uses `@playform/inline` for CSS inlining (excludes KaTeX)
- Generates sitemap and RSS feeds
- Sharp for image processing

## File Organization

- `src/pages/` - Route pages including dynamic `[...slug].astro`
- `src/layouts/` - Page layouts
- `src/components/` - Reusable Astro components
- `src/content/` - Markdown/MDX content
- `src/styles/` - Global CSS files
- `src/utils/` - Utility functions
- `src/types/` - TypeScript type definitions
- `scripts/` - Build and utility scripts