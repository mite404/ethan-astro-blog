# Iterate Over Blog Posts on Portfolio — Tutorial

**Goal:** Display the 4 most recent blog posts on the portfolio landing page
with truncated titles and body excerpts pulled from the raw markdown.

**Estimated Time:** ~35 minutes  
**Learning Style:** Hybrid (fill-in-blanks + guided concepts)  
**Prerequisites:** Basic Astro knowledge, familiarity with this project's
structure

---

## Table of Contents

1. [Background Concepts](#background-concepts)
2. [Phase 1: Create the Excerpt Utility (10 min)](#phase-1-create-the-excerpt-utility)
3. [Phase 2: Fix the Slice Bug (5 min)](#phase-2-fix-the-slice-bug)
4. [Phase 3: Wire Up Dynamic Blog Cards (15 min)](#phase-3-wire-up-dynamic-blog-cards)
5. [Phase 4: Verification (5 min)](#phase-4-verification)
6. [Reference](#reference)

---

## Background Concepts

### How Astro Content Collections Work (First Principles)

**What are they?**  
Astro's content collections let you define typed groups of markdown/MDX files.
You define a schema, and Astro gives you a typed API to query your content.

**Where they're defined in this project:**

```typescript
// src/content.config.ts
const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string().optional(),
    image: z.string().optional(),
    // ...other optional fields
  }),
});
```

**What you get back from a query:**

Each `CollectionEntry<'posts'>` entry has:

| Property | Type | What It Contains |
|----------|------|------------------|
| `id` | `string` | Filename without extension (e.g., `"week-07"`) |
| `data` | `object` | Parsed frontmatter (`title`, `pubDate`, `image`, etc.) |
| `body` | `string` | Raw markdown content **below frontmatter** |

**Real-world analogy:** Think of a content collection like a database table.
Each `.md` file is a row, the frontmatter fields are typed columns, and `.body`
is a large text field.

---

### The `.body` Property — Your Key to Excerpts

**What is it?**  
`post.body` returns the raw markdown as a string, everything below the `---`
frontmatter fence. It does **not** render the markdown — it's just the source
text.

**Where it's already used in this project:**

```typescript
// src/utils/feed.ts — used to generate RSS feed content
const rawHtml = markdownParser.render(post.body || '')

// src/components/widgets/About.astro — checks if content exists
const hasContent = aboutEntry?.body
  ? aboutEntry.body.replace(/<!--[\s\S]*?-->/g, '').trim()
      .length > 0
  : false
```

**Why this matters:** You don't need a custom remark plugin or file system
reads. The `.body` property gives you exactly what you need to extract an
excerpt.

---

### Your Blog Post Structure

Every post in `src/content/posts/` follows this pattern:

```markdown
---
title: "week 07"
pubDate: 2025-02-24
---

## Debrief

This week I led the design and prototyping efforts for a new brand
identity for our boutique design agency, Fractal...
```

**Key observations:**

1. **Frontmatter** — Titles are full descriptive phrases (e.g.,
   `"The Hidden Superpower of Cross-Domain Pattern Recognition: Week 07"`)
2. **First heading is `##` (h2)** — Not `#` (h1). Posts start with `## Debrief`
3. **Body text follows immediately** — The paragraph after the first heading is what we want to extract
4. **Titles are long** — Most exceed 16 characters, so truncation will be common

**This means:** Your excerpt function needs to find content after the first `##` heading, not `#`.

---

### How `getSortedFilteredPosts()` Works

**Location:** `src/utils/draft.ts`

**Flow:**

```text
1. getCollection('posts')  → All posts from content collection
2. .filter(post => !post.id.startsWith('_'))  → Remove drafts
3. .sort((a, b) => b.pubDate - a.pubDate)  → Sort newest first
```

**Returns:** `CollectionEntry<'posts'>[]` — newest post at index 0, oldest at
the end.

**Current usage in `index.astro`:**

```typescript
const posts = await getSortedFilteredPosts()
const mostRecent4Posts = posts.slice(-4)  // ⚠️ Bug — gets OLDEST 4
```

We'll fix this in Phase 2.

---

## Phase 1: Create the Excerpt Utility

**Time:** 10 minutes  
**Concepts:** String parsing, markdown structure, utility functions

### Concept: Extracting Text from Raw Markdown

**The Problem:**  
Given a raw markdown string like this:

```markdown
## Debrief

This week I led the design and prototyping efforts for a new brand
identity for our boutique design agency, Fractal.

### Brand Identity Development

I started with research into design agencies...
```

We need to:

1. Skip past the first `##` heading
2. Find the first paragraph of actual body text
3. Strip markdown formatting (`**bold**`, `*italic*`, `[links](url)`,
   `` `code` ``)
4. Return the first 45 characters with an ellipsis

**Strategy:** Split by lines, walk through them, find the first non-empty,
non-heading line after a `##` heading.

---

### Step 1.1: Create the Utility File

Create `src/utils/excerpt.ts`:

```typescript
/**
 * Extracts a plain-text excerpt from raw markdown content.
 * Finds the first paragraph of body text after the first ## heading
 * and returns it truncated to the specified length.
 */
export function getExcerpt(body: string, length = 45): string {
  const lines = body.split('\n')
  let pastFirstHeading = false

  for (const line of lines) {
    // TODO 1: Detect the first ## heading
    // Think: What does a markdown h2 heading line start with?
    // When you find it, set pastFirstHeading to true and skip to the next line.
    // Hint: Use line.startsWith() and the `continue` keyword

    if (pastFirstHeading) {
      const trimmed = line.trim()

      // TODO 2: Skip lines we don't want
      // Think: What lines should we skip? (empty lines, sub-headings, directive lines)
      // An empty line has trimmed.length === 0
      // A sub-heading starts with '#'
      // A directive line starts with '::'
      // If any of these are true, continue to the next line

      // TODO 3: Strip markdown formatting and truncate
      // Think: We have a line of body text, but it may contain:
      //   **bold text**  → should become: bold text
      //   *italic text*  → should become: italic text
      //   [link text](url) → should become: link text
      //   `code`         → should become: code
      //
      // Use .replace() with regex patterns to strip each format.
      // Then check: if the cleaned string is longer than `length`,
      //   return the first `length` characters + '…'
      // Otherwise return the cleaned string as-is.
      //
      // Regex hints:
      //   Bold:   /\*\*(.*?)\*\*/g  → replace with '$1'
      //   Italic: /\*(.*?)\*/g      → replace with '$1'
      //   Links:  /\[(.*?)\]\(.*?\)/g → replace with '$1'
      //   Code:   /`(.*?)`/g        → replace with '$1'
    }
  }

  return ''
}
```

---

### Step 1.2: Fill in the TODOs

**TODO 1 — Detect the first heading:**

**Conceptual Process:**

1. Markdown h2 headings look like `## Some Title`
2. The line starts with the characters `##` (hash-hash-space)
3. When we find this line, we know everything after it is body content
4. We set our flag and `continue` to skip the heading line itself

**Why not check for `#` (h1)?** Blog posts don't use h1 headings in the
body — they start with `## Debrief`. The frontmatter `title` field serves
as the h1.

**TODO 2 — Skip unwanted lines:**

**Conceptual Process:**

1. Empty lines (`trimmed.length === 0`) — just whitespace, skip
2. Sub-headings (`trimmed.startsWith('#')`) — we want body text, not another
   heading
3. Custom directives (`trimmed.startsWith('::')`) — Astro directives like
   `::github{repo="..."}`, not readable text

**Why skip these?** We want the first actual sentence of prose, not structural
markdown elements.

**TODO 3 — Strip formatting and truncate:**

**Conceptual Process:**

1. Markdown formatting appears inline: `**bold**`, `*italic*`, `[text](url)`,
   `` `code` ``
2. Each has a regex pattern that captures the inner text
3. Chain `.replace()` calls to strip them all
4. Check the length — if over 45 characters, slice and add `…`

**Why strip formatting?** The excerpt appears as plain text in a card.
Markdown syntax characters like `**` and `[]()` would look broken outside of a
renderer.

---

### Step 1.3: Verify Your Function Mentally

Given this input from `week-07.md`:

```markdown
## Debrief

This week I led design and prototyping efforts for a new brand identity for
our boutique design agency, Fractal.
```

**Expected output with `length = 45`:**

```text
"This week I led the design and prototyping …"
```

**Walk-through:**

1. Line `## Debrief` → sets `pastFirstHeading = true`, continues
2. Empty line → skipped (length 0)
3. Line `This week I led...` → not empty, not a heading, not a directive
4. Strip formatting (none to strip in this case)
5. String is 113 chars > 45 → return first 45 + `…`

---

### ✅ Phase 1 Complete

You've learned:

- How to parse raw markdown by walking lines
- How to strip inline markdown formatting with regex
- How to build a focused utility that does one thing well

**Next:** Phase 2 — Fix the slice bug that gets the wrong posts.

---

## Phase 2: Fix the Slice Bug

**Time:** 5 minutes  
**Concepts:** Array slicing, sort order awareness

### Concept: `.slice(-4)` vs `.slice(0, 4)`

**The Bug:**

```typescript
// Current code in src/pages/index.astro
const posts = await getSortedFilteredPosts()  // Sorted newest → oldest
const mostRecent4Posts = posts.slice(-4)       // Gets LAST 4 = OLDEST 4
```

**Why it's wrong:**

`getSortedFilteredPosts()` sorts by `pubDate` descending — **newest first**.
So:

```text
Index 0: "The Hidden Superpower of Cross-Domain Pattern Recognition: Week 07" ← newest
Index 1: "Brush Yourself Off: Week 05"
Index 2: "Rust & Polish: Week 04"
Index 3: "How I Learned to Stop Memory Leaking and Love Garbage Collection: Week 03"
Index 4: "Mastering the Forms vs. Winning the Duel: Week 02"
Index 5: "The Mountain and the Map: Week 01" ← oldest
```

`.slice(-4)` takes the **last** 4 items from the array — that's `week-03`,
`week-02`, `week-01`, and whichever is 4th from the end. These are the **oldest**
posts, not the newest.

---

### Step 2.1: Fix the Slice

Open `src/pages/index.astro` and find this line:

```typescript
const mostRecent4Posts = posts.slice(-4)
```

**TODO:** Change it to get the first 4 items instead.

**Conceptual Process:**

1. `.slice(start, end)` returns elements from `start` up to (but not including)
   `end`
2. To get the first 4 elements: `.slice(0, 4)`
3. Since `posts` is sorted newest-first, index 0–3 are the 4 most recent
   posts

**Why this matters:** This is a common bug when working with sorted arrays.
Always check: "Which end are my desired items at?" The sort order of
`getSortedFilteredPosts()` puts newest at index 0, so we want the beginning,
not the end.

---

### Step 2.2: Verify the Fix

After making the change, you can verify by logging:

```typescript
console.log(mostRecent4Posts.map(p => p.data.title))
// Should show: ["week 07", "week 05", "week 04", "week 03"]
```

Remove the `console.log` after verifying.

---

### ✅ Phase 2 Complete

You've learned:

- How `.slice()` behaves with negative vs positive indices
- Why sort order matters when slicing arrays
- A common pitfall when getting "most recent N" items

**Next:** Phase 3 — Replace hardcoded cards with dynamic data.

---

## Phase 3: Wire Up Dynamic Blog Cards

**Time:** 15 minutes  
**Concepts:** Astro templating, dynamic rendering, string truncation

### Concept: Replacing Static HTML with Dynamic Data

**Current code** (hardcoded placeholders):

```astro
<div class="blog-card">
  <h3 class="blog-title">Recent Post 1</h3>
  <p class="blog-description">A brief description of the blog post content goes here...</p>
  <a href="/blog" class="blog-link">Read More...</a>
</div>
<!-- ...repeated 3 more times -->
```

**Target** (dynamic, data-driven):

```astro
{mostRecent4Posts.map((post) => (
  <div class="blog-card">
    <h3 class="blog-title">{/* truncated title */}</h3>
    <p class="blog-description">{/* excerpt from body */}</p>
    <a href={/* post URL */} class="blog-link">Read More...</a>
  </div>
))}
```

**Key difference:** Instead of 4 copy-pasted `<div>` blocks, we use `.map()` to
iterate over the posts array and generate one card per post.

---

### Step 3.1: Add the Import

At the top of `src/pages/index.astro`, in the frontmatter block (`---`):

```typescript
// TODO: Import getExcerpt from your new utility
// Hint: import { functionName } from '@/utils/filename'
// The @ alias maps to src/
```

**Conceptual Process:**

1. You created `src/utils/excerpt.ts` in Phase 1
2. It exports a function called `getExcerpt`
3. This project uses `@/` as an alias for `src/`
4. Pattern: `import { getExcerpt } from '@/utils/excerpt'`

---

### Step 3.2: Replace the Hardcoded Blog Section

Find the `<!-- BLOG Section -->` in `index.astro`. The inner grid currently
has 4 hardcoded `<div class="blog-card">` blocks.

Replace all 4 hardcoded cards with a single `.map()`:

```astro
<!-- BLOG Section -->
<section class="bordered pl-8 pt-2.5">
  <h2 class="section-title">BLOG:</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {
      mostRecent4Posts.map((post) => (
        <div class="blog-card">
          <h3 class="blog-title">
            {/* TODO 1: Display truncated title */}
          </h3>
          <p class="blog-description">
            {/* TODO 2: Display excerpt */}
          </p>
          <a href={/* TODO 3: Link to post */} class="blog-link">
            Read More...
          </a>
        </div>
      ))
    }
  </div>
</section>
```

---

### Step 3.3: Fill in the TODOs

**TODO 1 — Truncate the title to 16 characters:**

**Conceptual Process:**

1. The title lives at `post.data.title` (e.g.,
   `"The Hidden Superpower of Cross-Domain Pattern Recognition: Week 07"`)
2. Most titles are well over 16 characters — truncation will be common
3. If it's longer than 16 characters, slice it and add `…`
4. If it's 16 characters or shorter, display it as-is
5. Use a ternary expression:

   ```text
   {post.data.title.length > 16
     ? post.data.title.slice(0, 16) + '…'
     : post.data.title}
   ```

**Example outputs:**

| Full Title | Truncated (16 chars) |
|------------|----------------------|
| `The Hidden Superpower of Cross-Domain Pattern Recognition: Week 07` | `The Hidden Super…` |
| `Brush Yourself Off: Week 05` | `Brush Yourself O…` |
| `Rust & Polish: Week 04` | `Rust & Polish: W…` |

**Why 16 characters?** Your card titles use Guisol at 30px. At that font size,
16 characters is roughly the max that fits in a single card column without
wrapping awkwardly in a 4-column grid.

**TODO 2 — Display the excerpt:**

**Conceptual Process:**

1. Call your `getExcerpt` function with the post's raw body
2. `post.body` contains the raw markdown (or could be `undefined`)
3. Use the nullish coalescing operator `??` for safety: `post.body ?? ''`
4. Pattern: `{getExcerpt(post.body ?? '')}`

**Why `?? ''`?** Defensive coding — if `.body` is `undefined`, the
function receives an empty string instead of crashing.

**TODO 3 — Link to the post:**

**Conceptual Process:**

1. `post.id` contains the slug (e.g., `"week-07"`)
2. Your blog posts are routed via `src/pages/[...slug].astro`
3. The URL pattern is `/{post.id}`
4. Use a template literal: `` {`/${post.id}`} ``

---

### Step 3.4: Review the Complete Blog Section

After filling in all TODOs, your blog section should look like:

```astro
{
  mostRecent4Posts.map((post) => (
    <div class="blog-card">
      <h3 class="blog-title">
        {post.data.title.length > 16
          ? post.data.title.slice(0, 16) + '…'
          : post.data.title}
      </h3>
      <p class="blog-description">{getExcerpt(post.body ?? '')}</p>
      <a href={`/${post.id}`} class="blog-link">Read More...</a>
    </div>
  ))
}
```

**What this does for each post:**

1. **Title** — Shows first 16 chars (e.g., `"week 07"` fits, longer titles get truncated)
2. **Description** — Shows first 45 chars of body text after the first heading
3. **Link** — Points to the actual blog post URL

---

### ✅ Phase 3 Complete

You've learned:

- How to use `.map()` in Astro templates to render dynamic data
- How to truncate strings with slice and ternary expressions
- How to access content collection entry properties (`data`, `body`, `id`)
- How to safely handle nullable properties with `??`

**Next:** Phase 4 — Verify everything works.

---

## Phase 4: Verification

**Time:** 5 minutes

### Step 4.1: Run the Dev Server

```bash
bun dev
```

Open `http://localhost:4321` in your browser.

---

### Step 4.2: Check the Blog Section

Scroll down to the **BLOG:** section on the portfolio page. You should see:

**4 cards** with real data instead of placeholder text:

| Card | Expected Title | Expected Excerpt (first ~45 chars) |
|------|----------------|--------------------------------------|
| 1 | `The Hidden Super…` | `This week I led the design and prototyping …` |
| 2 | `Brush Yourself O…` | `This week I led an effort to build a reusab…` |
| 3 | `Rust & Polish: W…` | *(first 45 chars of week-04's body after ## heading)* |
| 4 | `How I Learned to…` | *(first 45 chars of week-03's body after ## heading)* |

---

### Step 4.3: Verify Each Detail

**Checklist:**

- [ ] **4 cards render** (not 3, not 5)
- [ ] **Titles are real** (not "Recent Post 1")
- [ ] **Titles truncate at 16 chars** with `…` if needed
- [ ] **Descriptions show body text** (not frontmatter, not heading itself)
- [ ] **Descriptions truncate at 45 chars** with `…`
- [ ] **"Read More..." links work** — clicking navigates to actual post
- [ ] **Posts are in newest-first order** (week-07 first, not week-01)

---

### Step 4.4: Edge Case Check

**What if you have fewer than 4 published posts?**

`.slice(0, 4)` handles this gracefully — if there are only 3 posts, it returns
all 3. The grid will render 3 cards instead of 4, which is valid behavior for a
responsive grid.

**What if a post has no body?**

`getExcerpt(post.body ?? '')` returns `''` — the description paragraph will be
empty but won't crash.

---

### ✅ Phase 4 Complete — You're Done

**What you built:**

1. A focused utility function (`getExcerpt`) that parses raw markdown
2. Fixed a subtle `.slice()` bug that would've shown the wrong posts
3. Replaced static placeholder HTML with dynamic, data-driven cards

---

## Reference

### Files Modified

| File | Change |
|------|--------|
| `src/utils/excerpt.ts` | **New** — Excerpt extraction utility |
| `src/pages/index.astro` | Import utility, fix slice, replace hardcoded blog cards |

### Key Patterns

#### Accessing Content Collection Data

```typescript
// In any .astro frontmatter block:
import { getSortedFilteredPosts } from '@/utils/draft'

const posts = await getSortedFilteredPosts()
// posts[0].data.title    → frontmatter title
// posts[0].data.pubDate  → frontmatter date
// posts[0].body          → raw markdown body
// posts[0].id            → filename slug
```

#### String Truncation with Ellipsis

```typescript
// Ternary pattern:
const truncated = str.length > maxLen
  ? str.slice(0, maxLen) + '…'
  : str

// As a reusable function:
function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len) + '…' : str
}
```

#### Iterating in Astro Templates

```astro
{items.map((item) => (
  <div class="card">
    <h3>{item.title}</h3>
    <p>{item.description}</p>
  </div>
))}
```

**Important:** In Astro's JSX-like syntax, `.map()` must be wrapped in `{ }`
and the callback uses `( )` not `{ }` for implicit return.

### Troubleshooting

**Problem:** "Cannot find module '@/utils/excerpt'"  
**Solution:** Verify the file is at exactly `src/utils/excerpt.ts` (not
`src/util/` or `src/utils/excerpts.ts`)

**Problem:** Excerpts are empty  
**Solution:** Check that your function looks for `##` (h2), not `#` (h1). Your
posts start with `## Debrief`, not h1.

**Problem:** Still seeing placeholder text ("Recent Post 1")  
**Solution:** Verify you replaced all 4 hardcoded `<div class="blog-card">`
blocks with the `.map()` loop. Check for leftover HTML below the loop.

**Problem:** Posts are in wrong order (oldest first)  
**Solution:** Verify you changed `.slice(-4)` to `.slice(0, 4)`. The negative
slice takes from the end of the array (oldest posts).

**Problem:** "Read More..." link goes to 404  
**Solution:** Check the `href` value. It should be `` {`/${post.id}`} ``. Verify
`post.id` matches your `[...slug].astro` route pattern.

---

### Key Takeaways

1. **`post.body` gives you raw markdown** — No need for remark plugins or
   file reads to extract text
2. **Sort order matters for slicing** — Always check which end of the array
   your data lives at
3. **Parse markdown by walking lines** — Simple string splitting is often
   enough; you don't always need an AST parser
4. **Strip formatting for plain text** — Regex `.replace()` chains handle
   inline markdown formatting
5. **Defensive coding with `??`** — Guard against undefined values at data
   boundaries

---

**End of Tutorial**
