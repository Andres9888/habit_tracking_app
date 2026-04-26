# Plan: Netflix-style Category Rows in Templates Library

## Context

User wants to bring back a Netflix-style "one horizontal row per category" browse pattern that was either prototyped earlier or designed as a mockup (`templates_layout_recommendation_1.html` was committed with the April 5 redesign but didn't ship as the current MainBrowseView). The goal: make category browsing more shoppable/discoverable than the current vertical accordion (`ExploreAllSection`).

**Current state:**
- `src/screens/TemplatesScreen/views/MainBrowseView.tsx` is the main surface
- Already has the right ingredients: `PopularSection` is already a horizontal carousel (proves the pattern works here), `CategoryDrillView` handles deep-dive, `QuickFilterChips` handles fast filtering, `categoryMeta.ts` has icons/colors for 14 categories
- `ExploreAllSection` (vertical accordion) currently occupies the "browse all categories" slot

## Recommendation: Yes, this is a good idea — with constraints

**Verdict:** Ship it *in place of* `ExploreAllSection`, not on top of it. Category rows are a strictly better discovery pattern than the accordion (the accordion hides habits behind a tap; rows show them). Doing both = the duplicate-affordance problem that killed `BrowseAllCategoriesLink` in #1314.

**Row count: show top 5–6 category rows, then a "Browse all categories →" link**
- 14 rows = ~2800px of scroll, sparse (3 cards/row on mobile), users tune out after row 3
- 3 rows = doesn't deliver the browse feel
- 5–6 rows = matches `QuickFilterChips`' curation, keeps screen scannable, "Browse all →" opens a full category-list view (can reuse `ExploreAllSection` UI there or a new `AllCategoriesView`)
- Use `useMainBrowseData.categoryPriority` ordering to pick which 5–6

## Proposed approach

New component: `src/screens/TemplatesScreen/components/CategoryRowsSection/`
- `CategoryRowsSection.tsx` — composes top-N rows + "Browse all" CTA
- `CategoryRow.tsx` — single row: header (icon + label + "See all →") + horizontal `FlatList` of template cards
- `CategoryRow.types.ts`
- Reuse `useHorizontalScrollFade` hook for edge gradients
- Reuse `PopularSection`'s FlatList pattern/card dimensions for consistency
- Each card tap → `handlers.handleTemplatePreview`
- "See all →" on row → `viewNav.openCategory(id)` (existing CategoryDrillView)
- "Browse all categories →" at bottom → new `viewNav.openAllCategories()` (or reuse `seeAll` with category filter)

Swap in `MainBrowseView.tsx`: replace `ExploreAllSection` with `CategoryRowsSection`.

**Critical files:**
- `src/screens/TemplatesScreen/views/MainBrowseView.tsx` — swap section
- `src/screens/TemplatesScreen/components/CategoryRowsSection/` (new, ≤100 lines per file per project convention)
- `src/screens/TemplatesScreen/hooks/useMainBrowseData.ts` — expose `topCategoryRows` (5–6 categories + their templates)
- `src/screens/TemplatesScreen/hooks/useViewNavigation.ts` — add `openAllCategories` if new view needed

**Reuse:**
- `useHorizontalScrollFade` (`src/components/EmojiPickerV2/useHorizontalScrollFade.ts`)
- `PopularSection` FlatList layout (`src/screens/TemplatesScreen/components/PopularSection/`)
- `TemplateCard` or `TrendingCard` for row items
- `categoryMeta.ts` for icons/colors
- `CategoryDrillView` for "See all" destination

**What not to change:**
- `QuickFilterChips`, `PopularSection`, `GoalCollectionGrid`, `PremiumPacksSection`, `CategoryDrillView`
- Category data model, `categoryMeta.ts` taxonomy
- Search behavior

## Tradeoffs

- ✅ Higher discoverability; "shoppable" feel (App Store / Netflix / Spotify mental model)
- ✅ Leans on a pattern already proven in the app (`PopularSection`)
- ✅ Replaces, not adds — avoids the duplicate-affordance anti-pattern
- ❌ Each row shows only 2–3 cards on a phone; users may not realize categories are bigger (mitigated by "See all →")
- ❌ Removing `ExploreAllSection` discards recent polish work (#1319); the "Browse all" link preserves access
- ⚠️ If `topCategoryRows` starts feeling stale, we'll need a curation strategy (personalization, popularity, time-of-day)

## Updated scope: side-by-side mockup comparison, no implementation yet

Git archaeology found that the Oct–Nov 2025 "categories page" was actually a **single horizontal chip rail of all categories with counts** + a vertical filtered list — NOT Netflix-style rows. User wants to see both patterns as mockups before deciding.

**Phase 0 (this plan, after approval): mockups only — no code changes**

Create two HTML mockups in `.superdesign/design_iterations/`:

1. **`categories_pattern_a_chip_rail_1.html`** — the Nov 2025 revival
   - Header + search
   - Single horizontal scrollable chip rail: all 14 categories with counts (e.g., `🌅 Morning (24)`)
   - Spotlight hero card (one featured template)
   - Vertical list of templates filtered by selected chip
   - Use real category names/icons/counts from `src/screens/TemplatesScreen/data/categoryMeta.ts`

2. **`categories_pattern_b_netflix_rows_1.html`** — the Netflix alternative
   - Header + search + QuickFilterChips (unchanged)
   - PopularSection (horizontal carousel, unchanged)
   - 5–6 horizontal category rows (icon + label + "See all →" header, then horizontal list of ~5 template cards)
   - "Browse all categories →" CTA at the bottom
   - Use same design tokens as pattern A so visual comparison is fair

3. **`categories_comparison_index.html`** — simple index page linking both side-by-side with a short "pros/cons" note

Open all three in the browser. User reviews, picks a direction (or asks for a third option).

**Phase 1 (only after user picks a direction): implementation plan to be written fresh based on choice.**

## Verification (Phase 1)

1. `npm run dev`, open Templates tab in simulator
2. Confirm: 5–6 category rows render in priority order, each horizontally scrollable with fade edges
3. Confirm: tapping a card opens template preview; "See all →" opens CategoryDrillView
4. Confirm: "Browse all categories →" link at bottom opens full list
5. Confirm: QuickFilterChips + Popular + GoalCollectionGrid + Premium Packs all still work
6. Confirm: scroll performance smooth (FlatList virtualization on row lists)
7. Confirm: dark mode — row header icons/labels use `categoryMeta` colors correctly
8. Screenshot end-to-end and compare against the mockup
