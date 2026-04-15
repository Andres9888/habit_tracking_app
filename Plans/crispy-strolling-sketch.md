# Habit Library Page — Frontend Design (superdesign)

## Context
The Habit Library (TemplatesScreen) is a curated browse experience for discovering and importing science-backed habit templates. It currently has: hero featured collection, trending carousel, category grid, and premium packs. The user wants a design iteration using the superdesign workflow to produce a standalone HTML mockup.

## Superdesign Workflow (4 steps, each confirmed before proceeding)

### Step 1: Layout Design (ASCII wireframe)
Present the current layout structure as an ASCII wireframe, propose any improvements, and confirm with the user before moving on.

**Current structure:**
1. Header — "Habit Library" + subtitle
2. Search bar — full-width, 44px height
3. Featured hero — gradient card with chips, badge, decorative circles
4. Trending carousel — horizontal scroll, 165px cards
5. Category grid — 2-column, emoji previews
6. Premium packs — full-width stacked cards

### Step 2: Theme Design (generateTheme tool)
Design colors, fonts, spacing, shadows — referencing the app's existing design tokens (DM Sans, 8px grid, green primary #10B981). Output a CSS theme file.

### Step 3: Animation Design
Define entrance animations, micro-interactions, scroll behaviors — matching the existing staggered FadeInDown pattern.

### Step 4: Generate HTML
Build a single responsive HTML page combining all components into `.superdesign/design_iterations/habit_library_1.html`.

## Key Files
- `/src/screens/TemplatesScreen/TemplatesScreen.tsx` — main component
- `/src/screens/TemplatesScreen/views/MainBrowseView.tsx` — primary browse layout
- `/src/screens/TemplatesScreen/views/CategoryDrillView.tsx` — drill-down view
- `/src/screens/templates/styles/` — 13 style modules
- 24 sub-components in `/src/screens/TemplatesScreen/components/`

## Verification
- Open the generated HTML file in browser to visually verify layout, theme, and animations
- Compare against the existing React Native implementation for fidelity
