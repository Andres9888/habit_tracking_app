# Phase 06: Enhanced Category Grid & Animation Verification

**Spec**: `specs/003-templates-ux-redesign/spec.md`
**Design Reference**: `.superdesign/design_iterations/templates_ux_redesign_1.html` (see `.cat-tile` and `.cat-preview` sections)
**Requirements**: FR-009, FR-014

## Context

The current `CategoryTile` shows an emoji icon, label, and template count. The redesign adds a row of 4 preview emojis at the bottom of each tile, showing sample habit icons from that category. The emojis should be derived from actual template data (first 4 templates by popularity in each category).

The data flow: templates are grouped by category in `useMainBrowseData` → `useTemplatesByCategory`. Each category's templates have `icon` fields (emoji strings). The first 4 icons by `popularityScore` become the preview emojis.

This phase also verifies that all sections in `MainBrowseView` use staggered `FadeInDown` entrance animations.

## Tasks

- [x] Update the category data pipeline to include preview emojis. In `src/screens/TemplatesScreen/hooks/useMainBrowseData.ts` (or wherever `categoryList` is built): For each category, compute `previewEmojis: string[]` by taking the first 4 templates (sorted by `popularityScore` descending) and extracting their `icon` field. If a category has fewer than 4 templates, include as many as available. Add `previewEmojis` to the `CategoryItem` type definition (find the type — likely in a types file or inline). Pass this data through to `CategoryTile`.

  > Added `PREVIEW_EMOJI_LIMIT = 4` constant. Computed `previewEmojis` inside `categoryList` useMemo by sorting each category's templates by `popularityScore` desc, slicing top 4, and mapping to `icon`. Reused the filtered `catTemplates` array for both count and preview computation.

- [x] Update `src/screens/TemplatesScreen/components/CategoryGrid/CategoryTile.tsx` to accept and render preview emojis. Add `previewEmojis: string[]` to `CategoryTileProps`. Below the count text, add a new `View` with `flexDirection: 'row', gap: 4, marginTop: 'auto', paddingTop: 8`. Map over `previewEmojis` and render each as a `Text` with `fontSize: 14, opacity: 0.6`. This positions the preview row at the bottom of the tile (the tile already uses `flex` layout). Make sure the tile `minHeight` accommodates the new row — it should be at least 120px (currently 100px).

  > Added `previewEmojis` prop, preview row with `marginTop: 'auto'` to anchor to bottom, increased minHeight from 100 to 120. File is 68 lines — well under limit.

- [x] In the parent component that renders `CategoryTile` (in the CategoryGrid), pass the `previewEmojis` prop from the enriched category data.

  > Added `previewEmojis: string[]` to `CategoryItem` interface in `CategoryGrid.tsx` and passed `previewEmojis={cat.previewEmojis}` to each `CategoryTile`.

- [x] Update the "Browse by Category" section header. Find where the category grid section title is rendered (may be in `MainBrowseView` or the CategoryGrid component itself). Change the title to `"🗂️ Browse by Category"`.

  > Updated in `CategoryGrid.tsx` line 34. The title was defined there, not in MainBrowseView.

- [x] Verify staggered entrance animations in `src/screens/TemplatesScreen/views/MainBrowseView.tsx`. After all phases, the section order should be: (0) QuickFilterChips (from Phase 03), (1) FeaturedCollection hero card, (2) Trending Now section, (3) Curated Packs section (premiumPacksSection prop), (4) Category Grid (categoryGrid prop). Each `Animated.View` wrapper should use `FadeInDown.delay(index * durations.stagger).duration(durations.enter)` with sequential indices. The `stagger` helper already exists — just verify all sections use it with correct indices. If QuickFilterChips was added without animation wrapping, add `<Animated.View entering={stagger(0)}>` around it.

  > QuickFilterChips already had `stagger(0)` wrapping. Fixed the gap: wrapped `premiumPacksSection` with `<Animated.View entering={stagger(3)}>` — it was previously rendered bare without animation. Now all 5 sections cascade: 0→1→2→3→4 with 60ms stagger intervals.

- [x] Run `npx tsc --noEmit` to verify TypeScript. Run `npm run lint:max-lines` on all modified files. If `CategoryTile.tsx` exceeds 100 lines after adding the preview row, extract styles to a separate file.
  > TypeScript check confirmed zero errors in modified files (pre-existing errors in convex/ and other unrelated areas). All 4 files under 100 lines: useMainBrowseData.ts (59), CategoryGrid.tsx (61), CategoryTile.tsx (68), MainBrowseView.tsx (74). Commit: 579823245.
