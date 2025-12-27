# Portfolio Design Specification

**Source**: Figma Design File - `hxE0jhguSe2Irj2QoDH1JB`  
**Last Updated**: 2025-12-24  
**Implementation Status**: Portfolio sections implemented (Header, Ticker, Projects, Blog, Bio sections)

This document serves as the source of truth for the portfolio site design, extracted from the Figma design file.

## Implementation Status Legend

- ✅ **Implemented** - Component/feature is built and working
- 🚧 **In Progress** - Currently being developed
- ⏳ **Planned** - Documented but not yet started
- ⚠️ **Blocked** - Waiting on dependencies or decisions

---

## Layout & Structure

### Canvas Dimensions

- **Width**: 1280px
- **Height**: 1985px
- **Layout Type**: Fixed-width, centered composition (poster-style)

The entire portfolio uses a narrow, fixed-width layout that stays centered in the viewport. When the browser width exceeds 1280px, extra space appears on the sides rather than stretching the content.

### Responsive Behavior

- **Desktop** (>1280px): Fixed 1280px width, centered
- **Mobile** (≤968px): Full width with responsive padding

---

## Color Palette

### Primary Colors

| Color Name | Hex Code  | Usage                     |
| ---------- | --------- | ------------------------- | --------- |
| Background | `#282828` | Main page background      | #1c1c1c ? |
| White      | `#FFFFFF` | Primary text, UI elements |
| Neon Green | `#7FEE40` | Accent color, CTAs, name  |
| Light Gray | `#D9D9D9` | GitHub button background  |
| Black      | `#000000` | Button text               |

---

## Typography

### Fonts

- **Guisol**: Used for buttons and UI elements and headers
- **Fit**: Used for the name heading
- **Iosevka Fixed**: Used for body text
- **Aptos Narrow**: Used for description text for cards

### Type Specifications

#### Name Heading

- **Font**: Fit
- **Size**: 100px (responsive: 60px at 1024px, 40px at 640px)
- **Weight**: 400 (Normal)
- **Line Height**: 1em
- **Color**: #7FEE40 (Neon Green)
- **Text**: "Ethan Anderson"
- **Position**: Absolute, overlapping gradient dither background (top: 20px, left: 20px)

#### Button Text

- **Font**: Guisol
- **Size**: 13px
- **Weight**: 400 (Normal)
- **Line Height**: 0.91em
- **Color**: #000000 (Black)

#### Section Headers

- **Font**: Guisol
- **Size**: 100px
- **Weight**: 400 (Normal)
- **Line Height**: 0.91em
- **Color**: #FFFFFF (White)
- **Examples**: "PROJECTS:", "BLOG:"

#### Descriptions

- **Font**: Aptos Narrow
- **Size**: 12px
- **Weight**: 400 (Normal)
- **Line Height**: 1.25em
- **Color**: #FFFFFF (White)

#### Body Text / Descriptions

- **Font**: Iosevka Fixed
- **Size**: 45px
- **Weight**: 400 (Normal)
- **Line Height**: 1.25em
- **Color**: #FFFFFF (White)

---

## Components

### Header

#### Layout

- Full width of 1280px canvas
- Contains: Asterix icon (left), Buttons (right), Name + Gradient background

#### Asterix Icon

- **Size**: 20px × 20px
- **Position**: Top left corner

#### Buttons

##### GitHub Button

- **Width**: 100px
- **Height**: 50px
- **Border Radius**: 40px
- **Background**: #D9D9D9
- **Text**: "GITHUB" (Guisol, 20px, Black)
- **Link**: https://github.com/mite404
- **Hover Effect**: Text color changes to #e071e3

##### Blog Button

- **Width**: 100px
- **Height**: 50px
- **Border Radius**: 40px
- **Background**: #7FEE40 (Neon Green)
- **Text**: "BLOG" (Guisol, 20px, Black)
- **Link**: /blog
- **Hover Effect**: Text color changes to #e071e3

#### Gradient Dither Background

- **Width**: 1280px (full width)
- **Height**: 78px
- **Asset**: `src/assets/portfolio/grad-dither-group.svg`
- **Position**: Behind name text
- **Implementation**: Astro Image component with width={1280} height={78}

#### Name

- **Position**: Absolute, overlapping gradient
- **Offset**: Top 20px, Left 20px (from gradient container)

### Ticker / Warning Strip

#### Specifications

- **Display**: Single-line scrolling text
- **Background**: Warning stripe pattern with diagonal lines
- **Text Color**: #FFFFFF (White)
- **Content**: Tech stack badges/tags
- **Example**: "TypeScript | React | Tailwind | PostgreSQL | Drizzle | BetterAuth | TypeScript | React | Tailwind | PostgreSQL | Drizzle | BetterAuth | TypeScript | React | Tailwind |"

### Tagline / Intro Text

#### Primary Tagline

- **Font**: Iosevka Fixed, 25px
- **Width**: 713px
- **Height**: 120px
- **Color**: #FFFFFF
- **Text**: "An early-stage engineer drawn to creative tools and developer experience, where my professional background in video and audio production becomes a technical advantage."

#### Secondary Tagline

- **Font**: Guisol (gradient/styled text with pink/magenta accents)
- **Text**: "Bringing 19 years of systems thinking and team leadership within entertainment for brands like VICE & BEYONCÉ to early-stage companies building creative tools."

### Project Cards

Each project card follows this structure:

#### Layout

- **Container**: Grid-based (1 col mobile, 2 cols tablet, 4 cols desktop)
- **Border**: 1px solid white (section border only)
- **Background**: Transparent
- **Padding**: Bottom 1.5rem

#### Content Structure

1. **Project Title**
   - Font: Guisol, 30px (1.875rem)
   - Weight: 400
   - Color: #FFFFFF
   - Text-transform: uppercase

2. **Description**
   - Font: Aptos Narrow, 12px (0.938rem)
   - Color: rgba(255, 255, 255, 0.7)
   - Line-height: 1.6
   - Margin-bottom: 1rem

3. **Links**
   - Font: Aptos Narrow, 12px
   - Color: #FEFEFE
   - Hover: #e071e3
   - Format: "GitHub | Live"

4. **Meta/Details** (Tech Stack)
   - Font: Aptos Narrow, 13px (0.813rem)
   - Color: rgba(255, 255, 255, 0.5)
   - Text-transform: uppercase
   - Letter-spacing: 0.05em

### Contact Button

#### Specifications

- **Width**: 790px
- **Height**: 96px
- **Border Radius**: 40px
- **Background**: #7FEE40 (Neon Green)
- **Text**: "GET IN TOUCH"
  - Font: Guisol
  - Size: 45px
  - Weight: 400
  - Line Height: 0.91em
  - Color: #000000 (Black)
- **Position**: Centered within layout

---

## Section Structure

The portfolio page contains these sections in order:

1. **Header**
   - Asterix icon
   - GitHub & Blog buttons
   - Name with gradient background

2. **Ticker / Warning Strip**
   - Scrolling tech stack tags

3. **Primary Tagline**
   - Introduction text about engineering focus

4. **Secondary Tagline**
   - Experience summary with brand highlights

5. **Projects Section**
   - Header: "PROJECTS:"
   - Grid of 4 project boxes

6. **Blog Section**
   - Header: "BLOG:"
   - Grid of 4 blog post cards

7. **Contact Button**
   - "GET IN TOUCH" CTA

---

## Assets

### Images/SVGs Referenced

- `asterix.svg` - 20×20px icon
- `grad-dither-group.svg` - 797×51px gradient background
- Warning stripe pattern (diagonal lines)
- Various decorative elements:
  - "MOVIE GLOBE" (SVG)
  - "BAT" (SVG)
  - "HAND 1" (SVG)
  - "WAVE" (SVG)
  - "STARS" (SVG)
  - "TCHOTCHKES" (SVG)
  - "MASKED MAN" (SVG)
  - "Liquid" (SVG)

---

## Implementation Notes

### CSS Architecture

- Use fixed `max-width: 1280px` on main container
- Center container with flexbox on body
- Maintain poster-style composition on all screen sizes
- Mobile breakpoint at 968px switches to full-width

### Font Loading

- Fonts should be loaded with `font-display: swap` for performance
- Custom fonts: Guisol, Fit, Iosevka Fixed
- Fallback: sans-serif

### Accessibility

- Ensure sufficient color contrast (white text on dark background meets WCAG AA)
- Button text is 13px minimum (consider increasing for better accessibility)
- Maintain focus states on interactive elements

---

## Design Principles

1. **Fixed Composition**: Content width never exceeds 792px
2. **High Contrast**: White/Neon Green on dark background
3. **Minimal Padding**: Tight, poster-like spacing
4. **Bold Typography**: Large headers with custom display fonts
5. **Functional Simplicity**: Clear hierarchy, minimal decoration

---

## Figma Reference

Use Figma MCP server first, only use web url below as a fallback if a connection
to the MCP server can't be established.

**File**: `hxE0jhguSe2Irj2QoDH1JB`  
**URL**: https://www.figma.com/design/hxE0jhguSe2Irj2QoDH1JB/Dev-Portfolio-Site?node-id=0-1

For detailed measurements and visual specifications, refer to the Figma design file.
