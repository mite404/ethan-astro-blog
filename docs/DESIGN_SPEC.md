# Portfolio Design Specification

**Source**: Figma Design File - `hxE0jhguSe2Irj2QoDH1JB`  
**Last Updated**: 2025-12-11

This document serves as the source of truth for the portfolio site design, extracted from the Figma design file.

---

## Layout & Structure

### Canvas Dimensions
- **Width**: 792px
- **Height**: 1224px
- **Layout Type**: Fixed-width, centered composition (poster-style)

The entire portfolio uses a narrow, fixed-width layout that stays centered in the viewport. When the browser width exceeds 792px, extra space appears on the sides rather than stretching the content.

### Responsive Behavior
- **Desktop** (>968px): Fixed 792px width, centered
- **Mobile** (≤968px): Full width with responsive padding

---

## Color Palette

### Primary Colors
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Background | `#282828` | Main page background |
| White | `#FFFFFF` | Primary text, UI elements |
| Neon Green | `#7FEE40` | Accent color, CTAs, name |
| Light Gray | `#D9D9D9` | GitHub button background |
| Black | `#000000` | Button text |

---

## Typography

### Fonts
- **Guisol**: Used for buttons and UI elements
- **Fit**: Used for the name heading
- **Iosevka Fixed**: Used for body text and descriptions

### Type Specifications

#### Name Heading
- **Font**: Fit
- **Size**: 70px
- **Weight**: 400 (Normal)
- **Line Height**: 1em
- **Color**: #7FEE40 (Neon Green)
- **Text**: "Ethan Anderson"

#### Button Text
- **Font**: Guisol
- **Size**: 13px
- **Weight**: 400 (Normal)
- **Line Height**: 0.91em
- **Color**: #000000 (Black)

#### Section Headers
- **Font**: Guisol
- **Size**: 45px
- **Weight**: 400 (Normal)
- **Line Height**: 0.91em
- **Color**: #FFFFFF (White)
- **Examples**: "PROJECTS:", "BLOG:"

#### Body Text / Descriptions
- **Font**: Iosevka Fixed
- **Size**: 25px
- **Weight**: 400 (Normal)
- **Line Height**: 1.25em
- **Color**: #FFFFFF (White)

---

## Components

### Header

#### Layout
- Full width of 792px canvas
- Contains: Asterix icon (left), Buttons (right), Name + Gradient background

#### Asterix Icon
- **Size**: 20px × 20px
- **Position**: Top left corner

#### Buttons

##### GitHub Button
- **Width**: 61px
- **Height**: 30px
- **Border Radius**: 40px
- **Background**: #D9D9D9
- **Hover Background**: #C0C0C0
- **Text**: "GITHUB" (Guisol, 13px, Black)
- **Link**: https://github.com/mite404

##### Blog Button
- **Width**: 61px
- **Height**: 30px
- **Border Radius**: 40px
- **Background**: #7FEE40 (Neon Green)
- **Hover Background**: #6DD835
- **Text**: "BLOG" (Guisol, 13px, Black)
- **Link**: /blog

##### Button Spacing
- **Gap between buttons**: 9px

#### Gradient Dither Background
- **Width**: 797px (full width)
- **Height**: 51px
- **Asset**: `grad-dither-group.svg`
- **Position**: Behind name text

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

### Project Boxes

Each project card follows this structure:

#### Layout
- **Border Radius**: 0px (sharp corners)
- **Border**: White stroke
- **Background**: Transparent/Dark

#### Content Structure
1. **Project Title** (e.g., "Project 1:", "Project 2:")
   - Font: Guisol-style header
   - Color: #FFFFFF

2. **Description**
   - Font: Iosevka Fixed, 25px
   - Color: #FFFFFF
   - Text: "Amet Lorem eiusmod id ad ipsum deserunt dolor nisi laboris ex. Proident sint mollit est aliquip elit adipisicing vol."

3. **Meta Information**
   - Links: "Github | Live"
   - Tech Stack: "TypeScript | React | Tailwind"
   - Font: Iosevka Fixed
   - Color: #FFFFFF

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
- Use fixed `max-width: 792px` on main container
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

**File**: `hxE0jhguSe2Irj2QoDH1JB`  
**URL**: https://www.figma.com/design/hxE0jhguSe2Irj2QoDH1JB/Dev-Portfolio-Site?node-id=0-1

For detailed measurements and visual specifications, refer to the Figma design file.
