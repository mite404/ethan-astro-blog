# FOR_ETHAN.md — Learning Log & Technical Insights

**Purpose**: A living document capturing key learnings, debugging insights, and
architectural decisions for this project.

**Last Updated**: February 13, 2026 (Typography & Font Rendering Session)

---

## The Story So Far

This is a hybrid Astro 5 site combining:

- **Portfolio landing page** at `/` (1280px fixed-width, poster-style)
- **Blog section** at `/blog/*` (responsive, Chiri theme-based)

Both sections coexist with isolated styling systems using `data-layout-type`
attributes for clean separation.

---

## Cast & Crew (Architecture)

### The Content Flow (Database → Viewer Pipeline)

Think of content collections like the **footage vault** in a production
pipeline:

```
Content Collection (Vault)
    ↓
getCollection() (Footage Retrieval)
    ↓
Filter/Sort Utils (Editorial Selection)
    ↓
getStaticPaths() (Shot List)
    ↓
Build Process (Rendering Pipeline)
    ↓
Static HTML (Final Delivery)
```

**Key Players:**

1. **Content Collections** (`src/content/posts/`)
   - The raw assets (markdown files)
   - Schema defined in `content.config.ts`

2. **`CollectionEntry<'posts'>`** (The Footage Metadata)
   - `id` → filename slug (e.g., "week-07")
   - `data` → frontmatter (title, pubDate, image)
   - `body` → raw markdown content
   - `render()` → converts markdown to renderable component

3. **Dynamic Routes** (`[...slug].astro`, `[...route].ts`)
   - The shot list — tells Astro what to render
   - MUST export `getStaticPaths()` for static generation

---

## Behind the Scenes (Key Decisions)

### Why Astro Content Collections?

**Film Analogy**: Like having a professionally organized footage library
instead of loose files in random folders.

**Benefits:**

- Type-safe frontmatter (schema validation)
- Built-in utilities (`getCollection`, `getEntry`)
- Automatic slug generation from filenames
- Draft filtering (files starting with `_`)

**How We Use It:**

```typescript
// Fetch all posts
const posts = await getCollection('posts')

// Each post has:
post.id // "week-07" (filename without extension)
post.data // { title: "...", pubDate: Date, image?: string }
post.body // Raw markdown string
```

### Why Two Layout Systems?

**Problem**: Portfolio needs fixed 1280px poster-style, blog needs responsive design.

**Solution**: `data-layout-type` attribute isolation

```astro
<!-- BaseLayout.astro sets the attribute -->
<body data-layout-type="portfolio">
  <!-- or "page" for blog -->

  <!-- CSS targets specific layouts -->
  body[data-layout-type='portfolio'] {/* Portfolio-only styles */}

  body:not([data-layout-type='portfolio']) {/* Blog-only styles */}</body
>
```

**Why not separate sites?** Shared infrastructure (build, deployment, content system)
with visual flexibility.

---

## Bloopers (Bugs & Fixes)

### 🐛 Bug #1: Blog Post Excerpts on Portfolio Page (Feb 12, 2026)

**The Setup:**
Portfolio landing page needed to display 4 most recent blog posts with
excerpts.

**The Problem:**

- No utility to extract plain-text excerpts from raw markdown
- Titles were too long for card layout (30px font overflowed grid)

**The Investigation:**

Looking at `post.body`:

```markdown
## Debrief

This week I led the design and prototyping efforts...
```

We needed: "This week I led the design and prototyping…" (45 chars, plain text)

**The Solution:**

Created `src/utils/excerpt.ts`:

```typescript
export function getExcerpt(body: string, length = 45): string {
  const lines = body.split('\n')
  let pastFirstHeading = false

  for (const line of lines) {
    // Find content after first ## heading
    if (line.startsWith('##')) {
      pastFirstHeading = true
      continue
    }

    if (pastFirstHeading) {
      const trimmed = line.trim()

      // Skip empty lines, sub-headings, directives
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('::')) {
        continue
      }

      // Strip markdown formatting
      const clean = trimmed
        .replace(/\*\*(.*?)\*\*/g, '$1') // **bold**
        .replace(/\*(.*?)\*/g, '$1') // *italic*
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // [link](url)
        .replace(/`(.*?)`/g, '$1') // `code`

      // Truncate with ellipsis
      return clean.length > length ? clean.slice(0, length) + '…' : clean
    }
  }
  return ''
}
```

**Key Insights:**

- **Simple line-walking** beats complex AST parsing for this use case
- **Regex chains** cleanly strip markdown syntax
- **Default parameters** (`length = 45`) make functions flexible
- **Safe fallbacks** (return `''`) prevent crashes

**Font Fix:**
Reduced blog title font from 30px → 16px to fit card layout without overflow.

**Director's Commentary:**
Sometimes the simplest solution is best. We could've used a markdown parser
library, but a 30-line function does exactly what we need with zero
dependencies.

---

### 🐛 Bug #2: Dynamic Route Build Error After Dependency Update (Feb 13, 2026)

**The Setup:**
Dependabot recommended updating Astro packages. After updating, build failed.

**The Error:**

```
Failed to call getStaticPaths for src/pages/open-graph/[...route].ts
ogRouteHandlers.getStaticPaths is not a function
```

**The Investigation:**

**First thought**: "Maybe the export syntax is wrong after Astro
update?"

Tried multiple approaches:

1. Storing result in variable, exporting separately ❌
2. Explicit function declaration ❌
3. Type annotations ❌

**The Breakthrough:**

Checked the type definition:

```typescript
// node_modules/astro-og-canvas/dist/routing.d.ts
export declare function OGImageRoute<T>(opts: ...): Promise<{
    getStaticPaths: GetStaticPaths;
    GET: APIRoute;
}>
```

Key word: **`Promise`**! 🎬

**The Problem:**

Original code:

```typescript
export const { getStaticPaths, GET } = OGImageRoute({...})
//                                     ^ Returns Promise, not object
```

Without `await`, we were destructuring a **Promise object**, not its resolved value:

```typescript
// What actually happened:
const promise = OGImageRoute({...})  // Promise<{ getStaticPaths, GET }>
const { getStaticPaths, GET } = promise
// getStaticPaths = undefined  ← Promise doesn't have this property!
// GET = undefined
```

**The Fix:**

One word:

```typescript
export const { getStaticPaths, GET } = await OGImageRoute({...})
//                                     ^^^^^
```

**Root Cause:**

Breaking change in `astro-og-canvas` update:

- **OLD**: Synchronous return `{ getStaticPaths, GET }`
- **NEW**: Async return `Promise<{ getStaticPaths, GET }>`

**Key Insights:**

1. **Check type definitions first** when dependencies update
2. **Promises need `await`** before destructuring
3. **Error messages can be misleading** — "is not a function" actually meant "is undefined"
4. **Breaking changes happen** — libraries evolve, especially async patterns

**The Film Analogy:**

Without `await`, you're trying to use the **shipping box** (Promise) as a tool
instead of **opening it first** to get the tools inside.

**Director's Commentary:**

This is why type definitions are valuable — they document the contract. The
code worked before because the library was synchronous. When it went async, the
contract changed, and our code broke. Always `await` Promises before
destructuring!

---

### 🐛 Bug #3: Ticker Width Overflow (Feb 13, 2026)

**The Problem:**
Ticker component expanded beyond 1280px container boundary on large viewports.

**The Fix:**
Added `max-w-[1280px]` constraint to Ticker wrapper.

**Responsive Behavior:**

- Desktop (>1280px): 1280px fixed width, centered
- Tablet (968px–1280px): Full viewport with responsive padding
- Mobile (<968px): Full viewport with responsive padding (mobile)

---

### 🐛 Bug #3.5: Invalid React Hook Call in ParallaxHand (Feb 13, 2026)

**The Problem:**

Console warning during dev:

```
Invalid hook call. Hooks can only be called inside of the body of a
function component.
```

**The Root Cause:**

Calling `window` and `document` APIs at module scope (outside component body)
**before** React hooks are invoked.

In `ParallaxHand.tsx`:

```typescript
export default function ParallaxHand() {
  const { scrollY } = useScroll()  // Hook #1

  // ❌ BAD: Module scope code runs BEFORE hooks complete
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0
  const globeBottomAbsolute =
    globeOffsetTop +
    (typeof document !== 'undefined'
      ? document.querySelector('.portfolio-layout')?.offsetTop || 0
      : 0)

  const scrollRange = {
    start: globeBottomAbsolute - viewportHeight,
    end: pageScrollHeight
  }

  // ✅ Hook calls happen AFTER ternary conditionals
  const y = useSpring(yRaw, { ... })
}
```

**Why It's a Problem:**

React's hook system requires strict ordering. When you access DOM APIs
(window, document) at module scope, React can't track which hooks are being
called. This breaks the "Rules of Hooks."

**The Fix:**

Move DOM conditionals inline where they're used, so all hook calls happen
first:

```typescript
export default function ParallaxHand() {
  const { scrollY } = useScroll()  // ✅ All hooks first
  const y = useSpring(yRaw, { ... })

  // ✅ Conditionals inline in the computed value
  const scrollRange = {
    start: globeOffsetTop -
      (typeof window !== 'undefined' ? window.innerHeight : 0),
    end: typeof document !== 'undefined' ?
      document.documentElement.scrollHeight : 0
  }
}
```

**Key Insights:**

1. **Hooks must be called at component scope first** — before any
   conditionals
2. **Window/document checks belong inside values** — not before all hooks
3. **Rules of Hooks apply to all React code** — not just obvious cases like
   `useState`
4. **The placement logic remains unchanged** — we only reorganized where
   conditionals are evaluated

**Director's Commentary:**

This is a subtle but critical rule. The fix didn't change the animation
logic—hand still starts 800px below and animates to -300px. We just moved
when React evaluates the code. Always put hooks first, conditionals second.

---

### 🐛 Bug #4: Custom Fonts 404 Errors (Resolved Dec 27, 2025 / Feb 13, 2026)

**The Problem:**

- `/fonts/guisol.woff2` returning 404 error
- `/fonts/fit.woff2` returning 404 error
- Typography not matching Figma design specifications

**The Fix:**

- ✅ All font files placed in `public/fonts/`
- ✅ @font-face declarations properly configured
- ✅ Iosevka Fixed converted to WOFF2 (10KB subset)
- ✅ Italic angle set to -12° for proper slant

**Font Stack:**

- Guisol → buttons, section headers
- Fit → name heading
- Iosevka Fixed Light Italic → bio text

---

### 🐛 Bug #5: Typography Rendering Mismatch Between Figma & Browser (Feb 13, 2026)

**The Problem:**
Project and blog card titles looked noticeably different in the browser vs Figma. Letters appeared
tighter/more condensed in Chrome, while Figma showed more breathing room between glyphs.

**Root Cause Analysis:**

- Figma uses Skia text rendering engine
- Chrome uses OS text shaping (CoreText on macOS)
- Global CSS setting `text-rendering: optimizeLegibility` was causing browser to apply aggressive
  kerning, tightening letter spacing beyond designer intent
- Font file: Guisol Regular at 30px (1.875rem)
- Figma specs: 0% letter-spacing, auto line-height

**The Solution:**
Added two CSS properties to `.project-title` and `.blog-title`:

```css
letter-spacing: 0.02em;
text-rendering: geometricPrecision;
```

**Why This Works:**

- `letter-spacing: 0.02em` → Compensates for Chrome's tighter kerning, matches Figma's visual spacing
- `text-rendering: geometricPrecision` → Overrides inherited `optimizeLegibility`, trusts the font's
  designed spacing rather than browser-applied optimizations

**Learning:**
Display fonts (like Guisol) benefit from `geometricPrecision` because they're explicitly designed with
precise spacing. Body text benefits from `optimizeLegibility` for readability. Different font types
need different rendering hints.

---

### 🐛 Bug #6: HTML Attributes Overriding CSS Styles (Feb 13, 2026)

**The Problem:**

Project preview images (200×125px) were added to the cards with CSS margins:

```css
.project-image {
  margin-top: 0.9375rem; /* 15px */
  margin-bottom: 1.5625rem; /* 25px */
}
```

But in the browser, the images had **zero margins**. The CSS wasn't applying at all.

**The Diagnosis:**

Using Chrome DevTools, I inspected the computed styles and found something unexpected:

```html
<!-- What was rendered in index.astro -->
<img
  src="{project.image}"
  alt="{`${project.title}"
  preview`}
  class="project-image"
  width="200"
  height="125"
/>
```

The `width="200"` and `height="125"` **HTML attributes** were present. While these
directly control image dimensions, they have **higher specificity** than CSS
margins.

**Why This Matters:**

CSS specificity hierarchy:

```
Element tag (img)          ← Lowest
.class selectors           ← Medium (what we used)
#id selectors              ← Higher
Inline style=""            ← Highest (except !important)
HTML attributes            ← Tricky middle ground
```

HTML attributes on elements like `<img>` have **implicit weight** in the cascade.
They're not "specificity" in the CSS sense, but they override CSS properties
when the properties conflict with their own rendering logic.

**The Fix:**

Remove the inline `width` and `height` HTML attributes:

```astro
{
  project.image && (
    <img
      src={project.image}
      alt={`${project.title} preview`}
      class="project-image"
      {
      /* ❌ Removed: width="200" height="125" */ }
    />
  )
}
```

Now CSS can control all sizing and spacing:

```css
.project-image {
  width: 12.5rem; /* 200px */
  height: 7.8125rem; /* 125px */
  aspect-ratio: 8/5;
  object-fit: cover;
  margin-top: 0.9375rem;
  margin-bottom: 1.5625rem;
}
```

**The Lesson:**

When styling HTML elements, be aware:

1. **Element-level attributes** (like `width`, `height`, `href`) can override CSS
2. **Inspect applied rules in DevTools** — look for both CSS and HTML attributes
3. **Check the source markup** — don't assume the HTML is clean
4. **Prefer CSS for styling** — keep HTML attributes for semantic purposes only

**Why This Happened:**

In Astro, when passing dimensions to `<img>`, it's common to set them as attributes
for performance (tells browser image dimensions before download). But when you _also_
want CSS to control spacing/margins, the HTML attributes create a conflict.

**Best Practice:**

```astro
<!-- Good: Use img with alt only, let CSS handle sizing -->
<img src={url} alt="description" class="responsive-image" />

<!-- Avoid: HTML dimensions override CSS -->
<img src={url} alt="description" width="200" height="125" class="card-image" />
```

If you need to communicate dimensions to the browser for performance, use the `sizes`
attribute or set dimensions in CSS instead:

```css
img.card-image {
  width: 200px;
  height: 125px;
  /* Now CSS controls it, not HTML attributes */
}
```

**Director's Commentary:**

This is a subtle but important lesson about the HTML/CSS cascade. HTML attributes
aren't "style", but they act like low-level style overrides. Always be explicit:
either let HTML attributes control layout, or use CSS — don't mix them on the same
element.

---

## Behind the Scenes: February 13 Session Insights

### Font Rendering & Cross-Platform Consistency

**Core Insight**: Different design tools and browsers render fonts differently due to underlying text
rendering engines. Figma ≠ Chrome ≠ Safari.

**The Challenge:**

- You designed titles in Figma (using Skia rendering)
- Implementation in Chrome/Safari uses OS text shaping
- Without compensating, designs look subtly different

**Best Practice Pattern:**

```css
/* For display/heading fonts (Guisol, Fit) */
.heading {
  text-rendering: geometricPrecision;
  letter-spacing: 0.02em; /* Adjust based on visual comparison */
}

/* For body fonts (system, sans-serif) */
body {
  text-rendering: optimizeLegibility;
  /* Browser handles spacing intelligently */
}
```

**Verification Method:**

1. Take screenshot in Figma at 100% zoom
2. Take screenshot in browser at 100% zoom
3. Compare letter spacing visually
4. Adjust `letter-spacing` until they match
5. Lock in the value

### Font Loading & Cascading Styles

**Important Discovery:**
Font names in CSS must **exactly match** the `font-family` declaration in `@font-face`.

- ❌ `font-family: 'Iosevka Fixed Light'` (doesn't exist in @font-face)
- ✅ `font-family: 'Iosevka Fixed'` (matches @font-face declaration)

When mismatched, the browser falls back to system fonts and applies synthetic italics/bolds, which
degrades quality significantly.

### Design System Documentation as Source of Truth

**Workflow That Works:**

1. `portfolio.css` is the source of truth (implementation)
2. Design system HTML mirrors portfolio.css exactly
3. Figma is the reference for visual specs (colors, spacing, sizing)
4. When updating styles, update all three in sync

This prevents the design system from becoming outdated documentation.

---

## Director's Commentary (Best Practices)

### Understanding Astro's Static Generation

**Core Principle**: Astro is a static site generator by default. At build time,
it needs to know every possible URL.

**Dynamic Routes Pattern:**

```typescript
// [Parameter] in filename = dynamic route
// [...spread] matches any number of segments

// src/pages/[...slug].astro
export async function getStaticPaths() {
  // Return array of all possible routes
  return [
    { params: { slug: 'week-07' } }, // → /week-07
    { params: { slug: 'week-05' } }, // → /week-05
    { params: { slug: 'nested/path' } } // → /nested/path
  ]
}
```

**Why It's Required:**

Unlike a server (handles any URL at runtime), a static site is just
files:

```
dist/
├── index.html
├── week-07/
│   └── index.html
├── week-05/
│   └── index.html
└── open-graph/
    ├── week-07.png
    └── week-05.png
```

No `getStaticPaths()` = No files generated = 404 errors

**The Build Graph:**

```
Build starts
│
├── Static routes (known URLs)
│   ├── /
│   └── /blog/
│
├── Dynamic routes (ask for URLs)
│   ├── [...slug].astro → "I generate 6 pages"
│   └── open-graph/[...route].ts → "I generate 6 images"
│
└── Build complete: All files written to dist/
```

### Working with Content Collections

**The Anatomy of a Collection Entry:**

```typescript
const post = await getEntry('posts', 'week-07')

// What you get:
{
  id: 'week-07',              // Filename (slug)
  slug: 'week-07',            // URL-friendly version
  collection: 'posts',        // Collection name
  data: {                     // Your schema (frontmatter)
    title: 'Week 07',
    pubDate: Date,
    image?: string
  },
  body: '## Debrief\n\n...',  // Raw markdown
  render: async () => ({      // Rendering function
    Content: Component,
    headings: [...],
    remarkPluginFrontmatter: {...}
  })
}
```

**Why the separation?**

Astro provides **system metadata** (`id`, `slug`, `body`) separate from **your
frontmatter** (`data`) to avoid naming conflicts.

### String Manipulation Patterns

**Truncation with Ellipsis:**

```typescript
// Ternary pattern
const truncated = str.length > maxLen ? str.slice(0, maxLen) + '…' : str

// As reusable function
function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len) + '…' : str
}
```

**Markdown Stripping (Regex Chains):**

```typescript
const clean = text
  .replace(/\*\*(.*?)\*\*/g, '$1') // **bold** → bold
  .replace(/\*(.*?)\*/g, '$1') // *italic* → italic
  .replace(/\[(.*?)\]\(.*?\)/g, '$1') // [text](url) → text
  .replace(/`(.*?)`/g, '$1') // `code` → code
```

**Why chain?** Each `.replace()` returns a new string, so they compose
naturally.

### Promises and Async Patterns

**Always `await` before destructuring:**

```typescript
// ❌ WRONG
const { data } = asyncFunction() // data is undefined

// ✅ RIGHT
const { data } = await asyncFunction() // data is the resolved value
```

**Top-level `await` in Astro:**

Astro supports top-level `await` in frontmatter and route files:

```astro
---
const posts = await getCollection('posts') // ✅ Works
---
```

### Conditional Rendering in JSX

**The `&&` Operator (Show or Nothing):**

```jsx
{
  project.blogLink && (
    <>
      {' '}
      |{' '}
      <a href={project.blogLink} class="project-link">
        Post
      </a>
    </>
  )
}
```

**How it works:**

1. Evaluate left side: `project.blogLink`
   - If truthy (value exists) → render right side
   - If falsy (undefined/null) → render nothing

2. Use cases:
   - Optional UI elements (show if data exists)
   - Feature flags (show if enabled)
   - Permission checks (show if authorized)

**The Ternary Operator (Show This or That):**

```jsx
{
  project.blogLink ? <a href={project.blogLink}>Post</a> : <span>No post</span>
}
```

**When to use each:**

- **`&&`** — Show something _or nothing_ (most common)
- **Ternary `? :`** — Show one of _two things_ (fallback message, loading state, etc.)

**Why fragments are needed:**

In JSX, you can only render **one root element**. When combining multiple
elements, wrap them in a fragment:

```jsx
// ❌ Error: two root elements
<div>Content</div>
<p>Text</p>

// ✅ Valid: one root element (the fragment)
<>
  <div>Content</div>
  <p>Text</p>
</>
```

This applies to Astro, React, and any JSX environment — it's not specific to
TypeScript or component type.

### Defensive Coding

**Nullish Coalescing (`??`):**

```typescript
// Guard against undefined
getExcerpt(post.body ?? '') // If body is undefined, use ''

// Why not ||?
'' || 'fallback' // → 'fallback' (empty string falsy)
'' ?? 'fallback' // → '' (null/undefined trigger fallback)
```

**Safe Array Operations:**

```typescript
// .slice() is non-destructive and safe
const arr = [1, 2, 3]
arr.slice(0, 10) // Returns [1, 2, 3] (doesn't crash on over-request)
arr.slice(-4) // Last 4 items (or fewer if array is smaller)
```

---

## Quick Reference

### File Paths & Aliases

```typescript
@/              → src/
@/utils/draft   → src/utils/draft.ts
@/styles/global → src/styles/global.css
```

### Common Patterns

**Fetch and sort blog posts:**

```typescript
import { getSortedFilteredPosts } from '@/utils/draft'

const posts = await getSortedFilteredPosts()
// Newest first, drafts excluded
const recent4 = posts.slice(0, 4) // First 4 = most recent
```

**Extract excerpt:**

```typescript
import { getExcerpt } from '@/utils/excerpt'

const excerpt = getExcerpt(post.body ?? '', 45) // 45 chars, safe fallback
```

**Dynamic rendering in Astro:**

```astro
{
  posts.map((post) => (
    <div class="card">
      <h3>{post.data.title}</h3>
      <p>{getExcerpt(post.body ?? '')}</p>
      <a href={`/${post.id}`}>Read More</a>
    </div>
  ))
}
<!-- JSX-like syntax in Astro templates -->
```

### Build Commands

```bash
bun dev              # Development server
bun build            # Production build
bun preview          # Preview build locally
bun new "Title"      # Create new blog post
bun new "_Draft"     # Create draft post (with _ prefix)
```

### Debugging Tips

1. **Check type definitions** when dependencies update
2. **Look for `Promise<...>` in types** — if present, you need `await`
3. **Use `console.warn()`** for debugging (ESLint allows it)
4. **Check `data-layout-type`** if styles aren't applying
5. **Verify imports** include `@/styles/global.css` for Tailwind

---

## Resources

- **Astro Docs**: <https://docs.astro.build>
- **Content Collections**:
  <https://docs.astro.build/en/guides/content-collections/>
- **Dynamic Routes**:
  <https://docs.astro.build/en/guides/routing/#dynamic-routes>
- **Figma Design**:
  <https://www.figma.com/design/hxE0jhguSe2Irj2QoDH1JB>
- **Design System**: `docs/portfolio-design-system.html`

---

**End of Learning Log** — This document grows with each session. Update it
after major features, bug fixes, or architectural decisions.
