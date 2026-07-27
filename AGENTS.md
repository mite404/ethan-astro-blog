# AGENTS.md

Instructions for AI agents working in this repository.

- **Version control:** this repo uses **GitButler** and the `but` CLI — see
  [the GitButler section below](#️-this-repo-uses-gitbutler--not-vanilla-git). Run `but skill` first.
- **Active work:** [docs/tickets/](docs/tickets/) — current ticket queue.

> The project reference below mirrors [CLAUDE.md](CLAUDE.md). If the two disagree, CLAUDE.md wins.

---

## Project reference

Quick reference for working with this Astro 5 portfolio + blog site.

## Project Overview

Hybrid site: portfolio at `/` (1280px fixed-width) + blog at `/blog/*` (responsive Chiri theme).

**Stack:** Astro 5, TypeScript (strict), Tailwind CSS v4, Netlify  
**Task runner:** Bun (preferred) or pnpm  
**Documentation:** `docs/SPEC.md`, `docs/IMPLEMENTATION.md`

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

### Code Quality

```bash
bun lint              # Run ESLint
bun lint:fix          # Fix ESLint errors
bun lint:md           # Lint markdown with rumdl
bun format            # Format code with Prettier
bun format:check      # Check code formatting
```

### Maintenance

```bash
bun update-theme      # Update to latest theme version
```

## Project Structure

**Key directories:**

- `src/content/` - MDX posts and collection schemas
- `src/pages/` - Astro routes (index, [...slug], api, open-graph)
- `src/layouts/` - BaseLayout, PortfolioLayout, IndexLayout, PostLayout
- `src/components/` - Layout, UI, widgets, examples
- `src/styles/` - global.css (Tailwind), fonts.css, post.css
- `src/utils/` - Helpers (draft.ts, excerpt.ts, etc.)
- `public/fonts/` - Custom fonts (guisol, fit, iosevka)

See `docs/IMPLEMENTATION.md` for detailed architecture.

## Architecture

### Dual Layout System

The project maintains two distinct visual systems:

#### Portfolio Layout (`data-layout-type="portfolio"`)

- **Route:** `/` (index.astro)
- **Layout:** PortfolioLayout.astro
- **Width:** Fixed 1280px, centered (being migrated to fluid — see `docs/tickets/`)
- **Styling:** Tailwind v4 utilities + custom CSS
- **Components:** PortfolioHeader, Ticker, portfolio-specific sections
- **Design:** See `docs/portfolio-design-system.html` for colors, typography, and spacing

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

## Working with Posts

### Creating New Posts

Always use the script: `bun new "Post Title"` (or `pnpm new` as fallback)

- Automatically generates frontmatter with current date
- Sanitizes title for filename (lowercase, hyphens for spaces)
- Creates file in `src/content/posts/`
- Use `bun new "_Draft Title"` to create drafts (prefix with underscore)

### Post Filtering

Draft filtering logic is in `src/utils/draft.ts`. Posts starting with `_`
are excluded from production but visible in development.

## Portfolio Components

### PortfolioLayout.astro

**Purpose:** Fixed-width (1280px) centered layout for portfolio pages

**Key features:**

- Imports global.css (critical for Tailwind v4)
- Sets `data-layout-type="portfolio"` via BaseLayout
- `overflow: hidden` on `.portfolio-layout` to clip overflowing assets
  (e.g., parallax hand)
- Uses flexbox centering on body for side-spacing effect
- Responsive: 1280px desktop, 100% width mobile (<1536px)

### PortfolioHeader.astro

**Components:**

- Asterix icon (20×20px, top-left)
- GitHub and Blog navigation buttons
- Name heading ("Ethan Anderson", Fit font)
- Gradient dither background (1280×78px SVG)

**For styling details** (colors, dimensions, fonts): See `docs/portfolio-design-system.html`

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

- **Reference docs/portfolio-design-system.html** — Complete, interactive
  design system with colors, typography, spacing, and components
- **Figma file:** hxE0jhguSe2Irj2QoDH1JB (source of truth for design)
- **Layout:** 1280px fixed width, poster-style composition (migrating to fluid)

### General

- **Link cards require an adapter**: The `linkCard` feature needs a server
  adapter (Netlify, Vercel, etc.). Set `linkCard: false` in config.ts if
  deploying as static HTML
- **Math support**: Uses KaTeX for math rendering via remark-math and rehype-katex
- **Image optimization**: Uses Sharp for image processing with CSS inlining via @playform/inline
- **Theme toggle**: Can be enabled/disabled in config.ts (defaults to system theme)
- **Date format**: Highly configurable via config.ts (format, separator, position)
- **Custom directives**: Supports remark-directive for custom markdown syntax extensions

## Known Issues

See `docs/IMPLEMENTATION.md` for detailed issue tracking and status.

## 🧠 Educational Persona: The Senior Mentor

Treat every interaction as a tutoring session for a visual learner with a
background in Film/TV production and Graphic Design. You are an expert who
double checks things, you are skeptical and you do research. I'm not always right.
Neither are you, but we both strive for accuracy.

- **Concept First, Code Second:** Never provide a code snippet without first
  explaining the _pattern_ or _strategy_ behind it.
- **The "Why" and "How":** Explicitly explain _why_ a specific approach was chosen
  over alternatives and _how_ it fits into the larger architecture.
- **Analogy Framework:** Use analogies related to film sets, post-production
  pipelines, or design layers. (e.g., "The Database is the footage vault, the API
  is the editor, the Frontend is the theater screen").

## 🗣️ Explanation Style

- **Avoid Jargon:** Define technical terms immediately with plain
  language.
- **Visual Descriptions:** Describe code flow visually (e.g., "Imagine data
  flowing like a signal chain on a soundboard").
- **Scaffolding:** Break complex logic into "scenes" or "beats" rather
  than a wall of text.

## 📚 The "FOR_ETHAN.md" Learning Log

Maintain a living document at `docs/FOR_ETHAN.md`.
Update this file after every major feature implementation or refactor.

- **Structure:**
  1. **The Story So Far:** High-level narrative of the project.
  2. **Cast & Crew (Architecture):** How components talk to each other (using film analogies).
  3. **Behind the Scenes (Decisions):** Why we chose Stack X over Stack Y.
  4. **Bloopers (Bugs & Fixes):** Detailed breakdown of bugs, why they
     happened, and the logic used to solve them.
  5. **Director's Commentary:** Best practices and "Senior Engineer" mindset
     tips derived from the current work.
- **Tone:** Engaging, magazine-style, memorable. Not a textbook.

---

## ⚠️ This repo uses GitButler — not vanilla git

Version control runs through **GitButler** and the **`but`** CLI.

**Do not use `git commit`, `git checkout`, `git branch`, or `git push`.** GitButler manages
_virtual branches_ — multiple branches can be applied to the working directory **at the same
time**, which vanilla git commands do not understand.

### 🎓 Run `but skill` first

```bash
but skill      # Get tips and tricks for using GitButler effectively
```

There is a built-in tips command — **run it before starting version-control work.** There is also
a `gitbutler` agent skill available in this environment; prefer it over improvising.

### The one thing that most often goes wrong

Because **multiple virtual branches can be applied simultaneously**, a bare `but commit` may sweep
changes into the wrong branch. When more than one branch is applied, always name the target:

```bash
but commit [branch] -m "message"    # commit to a SPECIFIC branch — prefer this
but mark [branch]                   # or auto-assign changes to a branch up front
but status                          # always check what's applied before committing
```

### Setup and teardown

| Command        | Description                                   |
| -------------- | --------------------------------------------- |
| `but setup`    | Switch to GitButler in the current repository |
| `but teardown` | Go back to vanilla git branch management      |

### Branch management

| Command                            | Description                                            |
| ---------------------------------- | ------------------------------------------------------ |
| `but branch`                       | List all branches available                            |
| `but branch new [name]`            | Create a new parallel branch                           |
| `but branch new --anchor [branch]` | Create a new stacked branch from an existing branch    |
| `but branch list [search]`         | List all branches whose names match the search term    |
| `but branch apply [branch]`        | Apply (enable) a branch to your working directory      |
| `but branch unapply [branch]`      | Unapply (disable) a branch from your working directory |
| `but branch delete [branch]`       | Delete a branch from the workspace                     |
| `but reword [branch]`              | Rename a branch                                        |

### Inspection

| Command                     | Description                                                       |
| --------------------------- | ----------------------------------------------------------------- |
| `but status`                | Show workspace state, applied branches, staged files, and commits |
| `but status -f -v`          | Show status with committed files listed and more verbose output   |
| `but status -u`             | Show detailed list of unintegrated upstream commits               |
| `but diff`                  | Show changes in working directory compared to last commit         |
| `but diff [branch]`         | Show changes specific to a branch                                 |
| `but show [commit\|branch]` | Show details of a specific commit or branch                       |

### Committing changes

| Command                              | Description                                                   |
| ------------------------------------ | ------------------------------------------------------------- |
| `but commit -m "[message]"`          | Commit all changes to current branch                          |
| `but commit [branch] -m "[message]"` | **Commit to a specific branch when more than one is applied** |
| `but stage [file] [branch]`          | Stage specific file(s) for the next commit                    |
| `but commit --only [branch]`         | Commit only changes already staged to the branch              |
| `but commit -c [branch]`             | Create a new branch and commit to it                          |

### Commit editing

| Command                            | Description                                       |
| ---------------------------------- | ------------------------------------------------- |
| `but reword [commit]`              | Edit the commit message of a specified commit     |
| `but commit new --before [commit]` | Insert a blank commit before the specified commit |
| `but pick [commit]`                | Cherry-pick a commit into an applied branch       |
| `but rub [target] [source]`        | Combine two commits or branches together          |

### Remote operations

| Command             | Description                                            |
| ------------------- | ------------------------------------------------------ |
| `but push`          | Push all branches with unpushed commits                |
| `but push [branch]` | Push a specific branch to remote                       |
| `but pull`          | Pull latest upstream and integrate all active branches |
| `but pull --check`  | See what a pull would do without making changes        |
| `but pr`            | Create/update pull requests for active branches        |
| `but config forge`  | View and modify forge authentications                  |

### Operations log — your safety net

| Command                             | Description                               |
| ----------------------------------- | ----------------------------------------- |
| `but undo`                          | Undo the last operation                   |
| `but oplog`                         | Show operation history of workspace       |
| `but oplog restore [snapshot-id]`   | Restore workspace to a specific snapshot  |
| `but oplog snapshot -m "[message]"` | Create an on-demand snapshot with message |

**Take a snapshot before anything destructive.** `but oplog snapshot -m "before X"` then
`but oplog restore` beats reconstructing work by hand.

### Conflict management

| Command              | Description                                                        |
| -------------------- | ------------------------------------------------------------------ |
| `but resolve`        | Go into resolution mode                                            |
| `but merge [branch]` | Merge an active branch into your upstream branch (local mode only) |

### Auto-assignment

| Command                     | Description                                            |
| --------------------------- | ------------------------------------------------------ |
| `but mark [branch\|commit]` | Auto-assign changes to branch or auto-commit to commit |
| `but unmark`                | Remove all marks from workspace                        |

### Helper commands

| Command      | Description                                             |
| ------------ | ------------------------------------------------------- |
| `but skill`  | **Get tips and tricks for using GitButler effectively** |
| `but gui`    | Open the GUI to the current project                     |
| `but alias`  | Create and manage aliases for commonly used commands    |
| `but config` | View and modify GitButler configuration settings        |
| `but update` | Check for and install updates to GitButler              |

---

## Task runner

Use **Bun** — `bun dev`, `bun build`, `bun lint`, `bun format:check`.
See [CLAUDE.md](CLAUDE.md) for the full list.

## Before you finish

- `bun build` must complete clean.
- `bun lint` and `bun format:check` must pass.
- Per CLAUDE.md, update `docs/FOR_ETHAN.md` after any major feature or refactor.
