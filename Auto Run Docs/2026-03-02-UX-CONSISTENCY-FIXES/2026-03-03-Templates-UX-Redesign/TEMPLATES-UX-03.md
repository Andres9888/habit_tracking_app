# Phase 03: Quick-Filter Category Chips

**Spec**: `specs/003-templates-ux-redesign/spec.md`
**Design Reference**: `.superdesign/design_iterations/templates_ux_redesign_1.html` (see `.chips-row` and `.chip` sections)
**Requirements**: FR-001, FR-002, FR-003

## Context

This phase adds a new horizontally scrollable chip row below the search bar for quick category filtering. This is a brand new component. The chip row shows "✨ All" (active by default) plus one chip per major category. Tapping a chip should navigate to the CategorySearchView filtered to that category, using the existing `effectiveViewMode` and `viewMode` state.

The existing navigation flow: tapping a category chip (other than "All") should behave the same as tapping a CategoryTile — it sets the viewMode to 'category' and passes the selected categoryId. The "All" chip returns to the main browse view.

Key data source: `CATEGORY_META` in `src/screens/TemplatesScreen/data/categoryMeta.ts` maps category IDs to icons and labels. The chips should use a curated subset of categories in a specific display order.

## Tasks

- [x] Create a new component `src/screens/TemplatesScreen/components/QuickFilterChips/QuickFilterChips.tsx`. The component accepts props: `activeCategory: string | null` (null = "All"), `onSelectCategory: (categoryId: string | null) => void`, and `categories: Array<{ id: string; icon: string; label: string }>`. Render a horizontal `ScrollView` (or `FlatList` with `horizontal`) with `showsHorizontalScrollIndicator={false}` and `contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}`. First chip is always "✨ All" which calls `onSelectCategory(null)`. Each subsequent chip renders the category emoji + short label. Active chip: `backgroundColor: colors.primary[600]`, white text, green border. Inactive chip: `backgroundColor: colors.light.surfaceElevated` (or white), `borderColor: colors.border`, secondary text color. Chips should be `Pressable` with `borderRadius: 9999` (full pill shape), `paddingHorizontal: 14, paddingVertical: 6`. Font: 13px, fontWeight 600.

  > Implemented with `ScrollView` horizontal, `Chip` sub-component, `Pressable` with full pill shape. Used `colors.light.surfaceMuted` (warm stone) for inactive chips since `surfaceElevated` doesn't exist — closest semantic equivalent. Active chips use `primary[600]` bg + `primary[700]` border.

- [x] Create `src/screens/TemplatesScreen/components/QuickFilterChips/index.ts` as a barrel export.

  > Exports `QuickFilterChips`, `CHIP_CATEGORIES`, and `ChipCategory` type.

- [x] Define the curated chip category list. Create a constant `CHIP_CATEGORIES` (either in the QuickFilterChips component or in a shared data file) with this ordered list: `[{ id: 'morning_routine', icon: '🌅', label: 'Morning' }, { id: 'mental_health', icon: '🧠', label: 'Mental' }, { id: 'health_fitness', icon: '💪', label: 'Fitness' }, { id: 'sleep', icon: '😴', label: 'Sleep' }, { id: 'mindfulness', icon: '🧘', label: 'Mindful' }, { id: 'learning', icon: '📚', label: 'Learning' }, { id: 'financial', icon: '💰', label: 'Finance' }]`. These are derived from `CATEGORY_META` but with shortened labels for chip display.

  > Co-located with the component in `QuickFilterChips.tsx` for cohesion.

- [x] Wire up `QuickFilterChips` into `MainBrowseView`. In `src/screens/TemplatesScreen/views/MainBrowseView.tsx`, import and render `QuickFilterChips` between the search bar `Animated.View` and the `ScrollView`. It should use the `anim-2` animation slot (adjust subsequent section stagger indices by +1). Add the necessary props to `MainBrowseViewProps` in `MainBrowseView.types.ts`: `activeChipCategory: string | null` and `onChipCategorySelect: (categoryId: string | null) => void`.

  > Chips inserted at stagger(0), FeaturedCollection shifted to stagger(1), PopularSection to stagger(2), CategoryGrid to stagger(4). Added `marginTop: 8` for spacing between search bar and chips.

- [x] Wire up the chip selection handler in the screen's hooks. In `src/screens/TemplatesScreen/hooks/useTemplatesScreenProps.ts` (or wherever handlers are assembled): When a category chip is tapped (categoryId is not null), it should trigger the same logic as `openCategory(categoryId)` — navigating to the CategoryDrillView or setting the viewMode to 'category'. When "All" is tapped (null), it should reset to the main browse view. Pass these through to `MainBrowseView` via the props assembly. The state for `activeChipCategory` should be derived from the current `viewNav.activeView` — if `type === 'category'`, use its `categoryId`, otherwise null.

  > `activeChipCategory` derived from `viewNav.activeView` in `useTemplatesScreenProps`. `handleChipSelect` calls `openCategory` for non-null IDs and `goBack` for null. Both exposed from the props hook and threaded through TemplatesScreen.tsx.

- [x] Run `npx tsc --noEmit` to verify no TypeScript errors. Verify all new files comply with the 100-line max rule.
  > Zero new TypeScript errors. All files under 100 lines (eslint max-lines verified): QuickFilterChips.tsx (92 non-blank), MainBrowseView.tsx (62), TemplatesScreen.tsx (100 exact), useTemplatesScreenProps.ts (93).
