<objective>
Debug why Tailwind CSS utility classes and custom styles are not applying correctly to portfolio components (PortfolioHeader.astro and Ticker.astro). The goal is to isolate portfolio styling from blog styling so that the portfolio site at `/` uses completely different styles than the blog at `/blog`.
</objective>

<context>
This is an Astro 5 project originally built as a blog using the Chiri theme. The user is now building a portfolio landing page at the index route while keeping all blog functionality under `/blog`. The portfolio components should have their own distinct styling (Tailwind v4 utilities + custom CSS) separate from the blog's styling.

Current architecture:
- Portfolio landing: `src/pages/index.astro` using `PortfolioLayout.astro`
- Blog routes: `src/pages/blog/` using existing blog layouts (`BaseLayout`, `IndexLayout`, `PostLayout`)
- PortfolioLayout attempts to override blog styles using `data-layout-type='portfolio'` attribute
- Tech stack: Astro 5, Tailwind CSS v4 (via @tailwindcss/vite), TypeScript

Review the project's CLAUDE.md for architecture details and conventions.
</context>

<problems>
1. **Tailwind utilities not rendering on buttons**: Classes like `w-[61px]`, `h-[30px]`, `rounded-[40px]` have no effect
2. **Ticker component text wrapping**: Should be single-line with scrolling, but displays multiple lines
3. **Blog styles bleeding into portfolio**: Global blog styles may be overriding portfolio-specific styles

Design specs (from reference):
- Buttons: 61px wide × 30px tall, 40px border radius
- GitHub button: #d9d9d9 background
- Blog button: #7fee40 background (neon green)
- Ticker: Single-line scrolling text only
- Custom fonts: Guisol (buttons), Fit (name heading)
</problems>

<research>
Before making changes, thoroughly investigate these files:

1. **Configuration files**:
   @tailwind.config.js - Check if portfolio component paths are in the `content` array for Tailwind scanning
   @astro.config.ts - Verify Tailwind integration setup
   
2. **Portfolio components**:
   @src/components/layout/PortfolioHeader.astro - Button implementation with mixed Tailwind + custom CSS
   @src/layouts/PortfolioLayout.astro - Layout attempting to override blog styles
   @src/components/layout/Ticker.astro - Text clamping issue
   @src/pages/index.astro - Portfolio landing page

3. **Global styles**:
   @src/styles/ - Look for any global CSS files that might override component styles
   @src/layouts/BaseLayout.astro - Check for global styles applied to all layouts

4. **Blog layouts** (to understand what's being inherited):
   @src/layouts/IndexLayout.astro
   @src/layouts/PostLayout.astro

For each file, analyze:
- How styles are scoped (scoped vs global)
- CSS specificity conflicts
- Whether Tailwind is configured to scan these files
- Load order of stylesheets
</research>

<investigation_checklist>
Systematically check:

1. **Tailwind configuration**:
   - [ ] Are portfolio component paths included in Tailwind's content scanning?
   - [ ] Is Tailwind v4 properly integrated via @tailwindcss/vite?
   - [ ] Are arbitrary values (like `w-[61px]`) supported in this Tailwind version?

2. **CSS specificity conflicts**:
   - [ ] Do custom `<style>` blocks override Tailwind utilities?
   - [ ] Are there global blog styles with higher specificity?
   - [ ] What's the cascade order: global CSS → Tailwind → component styles?

3. **Astro scoped styles**:
   - [ ] Are component `<style>` blocks scoped (default) or global (`is:global`)?
   - [ ] Could scoped styles be preventing Tailwind utilities from applying?

4. **PortfolioLayout overrides**:
   - [ ] Is `data-layout-type='portfolio'` actually being set on the `<body>` element?
   - [ ] Are the `!important` overrides in PortfolioLayout actually taking effect?
   - [ ] Is there a CSS cascade issue preventing these overrides from working?

5. **Ticker implementation**:
   - [ ] What CSS controls the text layout (examine Ticker.astro)?
   - [ ] Are there conflicting white-space, overflow, or line-clamping styles?

6. **Build output inspection**:
   - [ ] Run `pnpm build` and inspect the compiled CSS in `dist/`
   - [ ] Are Tailwind utilities being purged from the final CSS?
   - [ ] Are the portfolio component files being processed at all?
</investigation_checklist>

<debugging_steps>
Execute these steps systematically:

1. **Verify Tailwind is scanning portfolio files**:
   - Check `tailwind.config.js` content array
   - If portfolio paths are missing, add them explicitly
   - Test: Add a Tailwind utility to a portfolio component, rebuild, check if CSS is generated

2. **Identify CSS specificity conflicts**:
   - Use browser DevTools to inspect button elements
   - Check computed styles: which rules are applying, which are being overridden?
   - Document the specificity chain for conflicting properties

3. **Test style isolation**:
   - Temporarily add `!important` to Tailwind utilities to test specificity
   - Try moving custom CSS from `<style>` blocks to inline styles
   - Check if removing BaseLayout wrapper changes behavior

4. **Debug Ticker component**:
   - Inspect the Ticker.astro implementation
   - Check for CSS properties: `white-space`, `overflow`, `text-overflow`, `line-clamp`
   - Test with minimal styles to isolate the wrapping issue

5. **Validate build output**:
   !pnpm build
   - Check `dist/_astro/*.css` for portfolio component styles
   - Verify Tailwind utilities are present in the compiled CSS
</debugging_steps>

<solution_requirements>
Your solution should:

1. **Fix Tailwind utility classes**: Ensure all Tailwind utilities render correctly on portfolio components
2. **Fix Ticker text clamping**: Make ticker display single-line scrolling text
3. **Properly isolate portfolio styles**: Prevent blog styles from bleeding into portfolio components
4. **Maintain blog functionality**: Don't break existing blog styling at `/blog` routes
5. **Follow best practices**: 
   - Use proper CSS cascade and specificity
   - Avoid excessive `!important` declarations
   - Keep styles maintainable and organized

Explain WHY each issue occurred and HOW your fix resolves it. Understanding the root cause is critical for preventing similar issues.
</solution_requirements>

<output>
After investigation, provide:

1. **Root cause analysis**: For each of the 3 problems, explain what's causing it
2. **File modifications**: Update the necessary files with fixes
3. **Configuration changes**: If Tailwind config or Astro config needs updates
4. **Verification steps**: How to confirm each fix works

Save your analysis to: `./debugging-notes/portfolio-css-analysis.md` (optional, if helpful)
</output>

<verification>
Before declaring complete, verify your fixes by:

1. Running `pnpm dev` and inspecting the portfolio page at `http://localhost:4321`
2. Using browser DevTools to confirm:
   - Buttons are exactly 61px × 30px with 40px border radius
   - Background colors match design specs (#d9d9d9 and #7fee40)
   - Ticker displays as single-line scrolling text
3. Checking that `/blog` routes still display correctly with original blog styling
4. Running `pnpm build` to ensure production build works without errors
</verification>

<success_criteria>
- [ ] Button Tailwind utilities apply correctly (w-[61px], h-[30px], rounded-[40px])
- [ ] Buttons render with correct dimensions and styling per design spec
- [ ] Ticker component displays as single-line scrolling text
- [ ] Portfolio components use isolated styles (no blog CSS bleeding)
- [ ] Blog routes remain unaffected with original styling
- [ ] Build completes without errors
- [ ] Clear explanation provided for why issues occurred and how fixes resolve them
</success_criteria>
