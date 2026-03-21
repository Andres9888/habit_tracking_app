# Phase 05: Category Polish, Footer, & Section Reorder

**Spec**: Templates Science-Based UX Improvements
**Design Reference**: `.superdesign/design_iterations/templates_ux_painpoint_2_1.html`
**Scope**: Small-Medium — final polish pass across CategoryTile, MainBrowseView, and a new footer

## Context

Three science principles for the final polish:

1. **Von Restorff (applied to grid)**: One category tile should stand out. A "🔥 Hot" badge on the most popular category (Morning) makes it visually distinct in the 2×2 grid, drawing attention to the highest-value entry point.

2. **Peak-End Rule (Kahneman, 1993)**: Users judge an experience primarily by its peak moment and its ending. Adding a motivational footer at the bottom of the scroll creates a positive emotional close: "You're building something meaningful. Every habit you add is a vote for the person you want to become."

3. **Fogg's B=MAP Section Reorder**: The current section order is optimized for visual hierarchy (hero first), but Fogg's Behavior Model says Ability tools should come before Motivation content. Reorder: Search → Chips → Trending (Ability) → For You (Motivation) → Hero (Prompt) → Packs → Categories → Footer.

## Data Flow

- Category "Hot" badge: `CategoryTile.tsx` — needs a way to determine which category is "hottest". Can be derived from which category has the most templates or highest aggregate popularity.
- Footer: New small component or inline text in `MainBrowseView.tsx`.
- Section reorder: `MainBrowseView.tsx` — rearrange JSX children and update stagger animation indices.

## Tasks

- [x] **Add "Hot" badge to the most popular category tile.** In the CategoryGrid/CategoryTile area: _(Done — hotCategoryKey derived from max template count in useMainBrowseData, amber badge rendered in CategoryTile top-right via flexRow)_
  - In `src/screens/TemplatesScreen/hooks/useMainBrowseData.ts`, determine which category has the highest template count or aggregate popularity score. Add a `hotCategoryKey: string` to the return value.
  - In `CategoryGrid.tsx`, receive `hotCategoryKey` as a prop and pass an `isHot` boolean to the relevant `CategoryTile`.
  - In `CategoryTile.tsx`, when `isHot` is true, render a small badge in the top-right corner: "🔥 Hot" text, amber background (`#fef3c7`), dark amber text (`#b45309`), font-size 9px, font-weight 800, padding 2px 6px, border-radius 6px, positioned with `position: 'absolute', top: 8, right: 8`.
  - Update CategoryTile props type to include `isHot?: boolean`.
  - All files under 100 lines. Run `npx tsc --noEmit --pretty`.

- [x] **Add motivational footer at the bottom of the templates scroll (Peak-End Rule).** In `MainBrowseView.tsx` or as a tiny extracted component: _(Done — extracted MotivationalFooter.tsx component, 34 lines, renders centered text with theme colors)_
  - After the last section (CategoryGrid), add a centered text block with 24px top padding and 16px bottom padding.
  - Primary text: "You're building something meaningful." — font-size 13px, font-weight 600, color `colors.text.secondary` or a warm muted tone.
  - Secondary text: "Every habit you add is a vote for the person you want to become." — font-size 11px, lighter color, margin-top 4px.
  - This is a small addition. If MainBrowseView is close to the 100-line limit, extract it as a `MotivationalFooter.tsx` component in the components directory.
  - Run `npx tsc --noEmit --pretty`.

- [x] **Reorder sections in MainBrowseView to follow Fogg's B=MAP model.** In `src/screens/TemplatesScreen/views/MainBrowseView.tsx`: _(Done — Chips→Trending→ForYou→Hero→Packs→Categories→Footer, stagger indices 0-6)_
  - The current order is approximately: QuickFilterChips → FeaturedCollection (Hero) → PopularSection (Trending) → PremiumPacksSection → CategoryGrid.
  - Reorder to: QuickFilterChips → PopularSection (Trending Now) → ForYouSection → FeaturedCollection (Hero) → PremiumPacksSection (Curated Packs) → CategoryGrid → MotivationalFooter.
  - The principle: **Ability-tier** content (search, chips, 1-tap trending) comes first, then **Motivation-tier** (For You, Hero), then **Browse-tier** (Packs, Categories), then **Peak-End** (footer).
  - Update the stagger animation delay indices so they still cascade in visual order (index 0 for chips, 1 for trending, 2 for for-you, 3 for hero, 4 for packs, 5 for categories, 6 for footer).
  - File must stay under 100 lines. Run `npx tsc --noEmit --pretty`.

## Verification

- One category tile (the most popular) shows a "🔥 Hot" badge
- Scrolling to the bottom shows a centered motivational message
- Section order follows Fogg's model: Trending before Hero, For You between them
- Stagger animations cascade correctly in the new order
- All files under 100 lines, zero TypeScript errors
