# Phase 01: Remove Premium UI & Section Renames

**Spec**: `specs/003-templates-ux-redesign/spec.md`
**Design Reference**: `.superdesign/design_iterations/templates_ux_redesign_1.html`
**Requirements**: FR-010, FR-011, FR-012, FR-013

## Context

The Templates screen currently shows PRO badges on the Andrew Huberman category tile and pack card, plus a sticky UsageBanner at the bottom. This phase strips all premium gatekeeping UI from the screen (the import-time paywall guard in `useImportFeedback.ts` must be preserved). It also renames section titles: "Popular" → "Trending Now" and "Habit Packs" → "Curated Packs".

## Tasks

- [x] In `src/screens/TemplatesScreen/components/CategoryGrid/CategoryTile.tsx`: Remove the `isPremium` prop and the entire PRO badge rendering block (the `View` with `s.proBadge` and `Text` with `s.proText`). Remove the associated `proBadge` and `proText` styles from the StyleSheet. Update the `CategoryTileProps` interface to remove `isPremium`. Ensure the `cat-top` row still renders correctly with just the icon.
<!-- ✅ Completed: Removed isPremium from interface, destructured props, PRO badge JSX block, and proBadge/proText styles. File is 57 lines. -->

- [x] In `src/screens/TemplatesScreen/components/CategoryGrid/` (the parent component that renders `CategoryTile`): Find where `isPremium` is passed as a prop to `CategoryTile` and remove it. Check `CategoryItem` type in the types file and remove `isPremium` from it. Search for any references to `isPremium` in the category pipeline (`useMainBrowseData.ts`, `categoryMeta.ts`) — do NOT remove `isPremium` from the `CATEGORY_META` data structure itself (it may be used elsewhere), just stop passing it to the tile.
<!-- ✅ Completed: Removed isPremium from CategoryItem interface and removed isPremium={cat.isPremium} prop from CategoryTile JSX. CATEGORY_META and CategoryMeta type left intact. File is 60 lines. -->

- [x] In `src/screens/TemplatesScreen/components/PremiumPacksSection/PremiumPackCard.tsx`: Remove the `Package` import from `lucide-react-native`. Remove the `Package` icon rendering in the `topRow`. The card should show just the emoji group on the left of the top row with no icon on the right. Remove any unused styles.
<!-- ✅ Completed: Removed Lock icon import from lucide-react-native (actual icon was Lock, not Package), removed Lock icon rendering from topRow, removed unnecessary justifyContent: 'space-between' from topRow style. File is 47 lines. -->

- [x] In `src/screens/TemplatesScreen/components/PopularSection/PopularSection.tsx`: Change the section title from `"Popular"` to `"Trending Now"` (the `Text` inside `s.header`). Add a fire emoji prefix: `"🔥 Trending Now"`. Update the `testID` from `"templates-popular-section"` to `"templates-trending-section"` and `"templates-popular-see-all"` to `"templates-trending-see-all"`.
<!-- ✅ Completed: Changed title to "🔥 Trending Now", updated testIDs to templates-trending-section and templates-trending-see-all, updated accessibilityLabel to match. File comment updated. File remains at 81 lines. -->

- [x] In `src/screens/TemplatesScreen/components/PremiumPacksSection/PremiumPacksSection.tsx`: Change the section title from `"Habit Packs"` to `"📦 Curated Packs"`.
<!-- ✅ Completed: Changed title from "Premium Packs" to "📦 Curated Packs", removed PRO badge View and associated proBadge/proText styles, removed unused borderRadius import, updated JSDoc comment. File is 41 lines. -->

- [x] Find where `UsageBanner` is rendered in the Templates screen (check `src/screens/TemplatesScreen/TemplatesScreen.tsx`, `MainBrowseView.tsx`, or any view files that render it). Remove the `UsageBanner` component rendering from the Templates screen entirely. Do NOT delete the `UsageBanner` component files themselves — they may be used on other screens. Just remove the usage/import from the Templates screen rendering pipeline. Verify the `useImportFeedback.ts` `guardImport()` function still checks `!isPremiumUser && userHabitCount >= FREE_HABIT_LIMIT` — this paywall guard must remain intact.
<!-- ✅ Completed: Removed UsageBanner import and rendering from MainBrowseView.tsx. Removed isPremiumUser, userHabitCount, onShowPaywall from MainBrowseViewProps interface. Removed isPremiumUser and userHabitCount prop passes from TemplatesScreen.tsx. Updated JSDoc layout comment. Verified guardTemplateImport() in useTemplateImportHandlers.ts (line 50-56) remains intact. UsageBanner component files preserved. -->

- [x] Run `npx tsc --noEmit` to verify no TypeScript errors were introduced. Run `npm run lint:max-lines` on the modified files to check they comply with the 100-line limit. Fix any errors.
<!-- ✅ Completed: tsc --noEmit shows no new TemplatesScreen errors (only pre-existing renderSubView.tsx JSX.Element issue). All 8 modified files pass max-lines. TemplatesScreen.tsx was initially 112 lines; fixed by extracting TemplatesScreenModals component (wraps TemplateModals + PaywallSheet + PackConfirmSheet) and compacting view-mode check. Final: TemplatesScreen.tsx 100 lines, TemplatesScreenModals.tsx 59 lines. -->
