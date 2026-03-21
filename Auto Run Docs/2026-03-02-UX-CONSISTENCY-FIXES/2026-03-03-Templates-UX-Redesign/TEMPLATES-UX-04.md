# Phase 04: Trending Section Redesign

**Spec**: `specs/003-templates-ux-redesign/spec.md`
**Design Reference**: `.superdesign/design_iterations/templates_ux_redesign_1.html` (see `.trending-card` section)
**Requirements**: FR-005, FR-006, FR-007, FR-015

## Context

The current "Popular" section uses `MiniTemplateCard` components (200×150px) in a horizontal `FlatList`. The redesign replaces these with taller, narrower cards (165px wide) that include: (1) an emoji icon on a colored background square, (2) the habit name, (3) frequency in monospace + optional science badge, (4) a bottom row with popularity count + trending icon on the left and a circular green "Add" button on the right.

The key UX change: the Add button triggers a **direct import** (1-tap) without opening the preview modal. Tapping the card body (not the button) should still open the existing fullsize preview. This means the card needs two separate press targets.

The existing `onImport` handler in `PopularSection` already exists for direct imports. The `importedTemplateIds` Set tracks which templates have been added this session.

## Tasks

- [x] Create a new component `src/screens/TemplatesScreen/components/TrendingCard/TrendingCard.tsx` to replace `MiniTemplateCard` usage in the popular/trending section. Props: `icon: string`, `iconColor: string`, `name: string`, `frequency: string`, `hasResearch: boolean`, `popularityScore: number`, `isImported: boolean`, `isImporting: boolean`, `onPress: () => void` (opens preview), `onImport: () => void` (direct import). The card is a `Pressable` (165px wide) with `backgroundColor: colors.light.surfaceElevated`, `border: 1.5px solid colors.border`, `borderRadius: 16`, `padding: 16`, and `shadow: shadows.card`. The card body `onPress` fires the preview handler.

  > Used `colors.light.surfaceMuted` (#FAF8F5) — `surfaceElevated` doesn't exist in the theme; surfaceMuted is the lightest surface token that creates visual lift above the warm parchment background.

- [x] Inside `TrendingCard`, render: (1) **Icon area**: 48×48px `View` with `borderRadius: 12, backgroundColor` derived from `iconColor` at 15% opacity (e.g., `${iconColor}25`), centered emoji text at 28px. (2) **Name**: 14px, fontWeight 700, `colors.text.primary`, marginTop 12, lineHeight 1.3. (3) **Meta row**: `flexDirection: 'row', gap: 4, marginTop: 4`. Contains frequency text in JetBrains Mono 11px `colors.text.tertiary`, and conditionally a science badge `View` (`backgroundColor: '#FEF3C7', borderRadius: 9999, paddingHorizontal: 6, paddingVertical: 2`) with "🔬 Science" text (10px, color `#92400E`, fontWeight 600) when `hasResearch` is true. (4) **Bottom row**: `flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 12`. Left: popularity count with `TrendingUp` icon from lucide-react-native (12px, primary-600 color) + formatted count text (11px, tertiary). Right: circular Add button.

- [x] Create the circular Add button as a separate `Pressable` inside `TrendingCard` (or as a small extracted component). Default state: 32×32px circle, `backgroundColor: colors.primary[600]`, white `Plus` icon (16px), `shadow: 0 2px 6px rgba(5,150,105,0.25)`. The button calls `onImport` directly (NOT `onPress`). Use `hitSlop={4}` to increase tap target. Importing state: show a small `ActivityIndicator` (white, size 16) instead of the icon. Imported state: `backgroundColor: colors.surface.muted`, `color: colors.primary[600]`, `Check` icon, no shadow. Add a brief spring scale animation on import success using `useAnimatedStyle` with `withSpring` (scale 1 → 1.2 → 1 over 200ms).

  > Extracted as `AddButton.tsx` (64 lines). Uses `Animated.createAnimatedComponent(Pressable)` for spring scale animation.

- [x] Create `src/screens/TemplatesScreen/components/TrendingCard/index.ts` as barrel export.

- [x] Update `src/screens/TemplatesScreen/components/PopularSection/PopularSection.tsx` to use `TrendingCard` instead of `MiniTemplateCard`. Replace the `MiniTemplateCard` import with `TrendingCard`. In the `FlatList` `renderItem`, map the template data to `TrendingCard` props: `icon={item.icon}`, `iconColor={item.iconColor}`, `name={item.name}`, `frequency={item.frequency}`, `hasResearch={!!item.scientificReference}`, `popularityScore={item.popularityScore}`, `isImported={importedTemplateIds.has(item._id)}`, `isImporting={importingTemplateId === item._id}`, `onPress={() => onPreview(item)}`, `onImport={() => onImport(item)}`.

  > `popularityScore` is optional on the Convex schema, so mapped as `item.popularityScore ?? 0`.

- [x] Add a `formatPopularity` helper (either inline or as a tiny utility) that formats `popularityScore` for display: scores >= 1000 become "X.Xk" (e.g., 1200 → "1.2k"), scores < 1000 show as-is. Use this in the TrendingCard bottom row.

  > Created `formatPopularity.ts` (11 lines) + unit test at `tests/unit/components/TrendingCard/formatPopularity.test.ts` — 2/2 tests pass.

- [x] If any file exceeds 100 lines, decompose following project patterns. Extract styles to `TrendingCard.styles.ts`, the add button to `AddButton.tsx`, etc. Run `npx tsc --noEmit` and `npm run lint:max-lines` on all modified/new files.
  > All files within limits: TrendingCard.tsx (62), AddButton.tsx (64), TrendingCard.styles.ts (82), TrendingCard.types.ts (37), formatPopularity.ts (11), PopularSection.tsx (80). Zero new TypeScript errors. ESLint max-lines pass.
