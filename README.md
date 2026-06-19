# ethan-astro-blog

Personal portfolio and blog.

![Astro](https://img.shields.io/badge/Astro-BC52EE?style=for-the-badge&logo=astro&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

### Media directive system with custom Apple Music embeds (reverse-engineered)

A single remark plugin (`remark-embedded-media.mjs`) handles all rich embeds
via markdown directives — Spotify, YouTube, Bilibili, X posts,
GitHub cards, link cards, and NeoDB cards.

However, Apple doesn't publish an official embed API. This site reverse-engineers the
`embed.music.apple.com` URL pattern to render native Apple Music players inline
in blog posts using a **custom remark directive**:

```md
:::applemusic{url="https://music.apple.com/us/album/some-album/1234?i=5678"}
```

The `?i=` parameter signals a single track (175px height) vs. an album or
playlist (450px). Implemented in `src/plugins/remark-embedded-media.mjs`.

### Dual layout system

The portfolio (`/`) and blog (`/blog/*`) coexist in one codebase with fully
isolated styling. The `data-layout-type` attribute on `<body>` gates styles:

```css
body:not([data-layout-type='portfolio']) {
  padding: 6rem 1.5rem 1.5rem 1.5rem;
}
```

Portfolio is a fixed 792px poster composition. Blog is the responsive Chiri
theme. Neither leaks into the other.

### Parallax hand animation

`ParallaxHand.tsx` — a 1.7x scaled SVG hand (2875px wide, intentionally
overflowing) animates on scroll using Motion spring physics. Scroll range is
calculated dynamically from the globe DOM element's position.

## Commands

```bash
bun dev           # dev server
bun build         # production build
bun new "Title"   # create a new post
bun new "_Draft"  # create a draft post (underscore prefix)
```

## Based on

Blog theme forked from [Chiri](https://github.com/the3ash/astro-chiri) by the3ash — a minimal Astro blog with MDX, KaTeX, dark mode, and RSS.
