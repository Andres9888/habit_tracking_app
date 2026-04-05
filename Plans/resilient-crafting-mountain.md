# Templates Screen UX Review & Improvements

## Context

The `template-page-ux-review` branch redesigns the Templates screen from a tab-based interface to a curated browse view with QuickFilterChips, redesigned list cards (TemplateListCard), and improved search with match reasons. This plan identifies concrete UX improvements to ship a polished experience.

---

## Phase 1 -- Must Fix Before Merge

### 1.1 Remove redundant "Preview" button from TemplateListCard
**File:** `src/screens/TemplatesScreen/views/TemplateListCard.tsx`

The entire card is already a `Pressable` that calls `onPreview(item)` (line 87). Having a separate "Preview" button stacked below "Add" creates decision friction and visual weight. Remove the Preview button block (lines 150-171) and its styles (`previewButton`, `previewLabel`). The card tap already does what Preview does.

### 1.2 Fix loading-state subtitle mismatch
**File:** `src/screens/TemplatesScreen/components/TemplatesLoadingState.tsx`

Loading state subtitle (line 36): `"Science-backed templates to help you start faster"`
Actual MainBrowseView subtitle: `"Start with a category, a curated collection, or a quick add"`

The subtitle jumps on transition. Change the loading state to match, or share a constant.

### 1.3 Fix SearchBar accessibility label
**File:** `src/screens/TemplatesScreen/components/SearchBar.tsx`

Line 38: `accessibilityLabel='Search habits'` should be `'Search templates'`. Wrong screen context.

---

## Phase 2 -- High-Impact Polish (Same PR)

### 2.1 Improve import feedback on TemplateListCard
**File:** `src/screens/TemplatesScreen/views/TemplateListCard.tsx`
**Reference:** `src/screens/TemplatesScreen/components/TrendingCard/AddButton.tsx`

- Current: only `opacity: 0.72` during import, text changes to "Added" after
- Better: Add a `Check` icon (lucide-react-native) for "Added" state instead of text. Add a subtle scale bounce via `useSharedValue` + `withSpring` on success (pattern already in TrendingCard's AddButton)
- Fire `triggerHaptic('success')` on import completion, not just on press

### 2.2 Add scroll affordance to QuickFilterChips
**File:** `src/screens/TemplatesScreen/components/QuickFilterChips/QuickFilterChips.tsx`

8 chips with `showsHorizontalScrollIndicator={false}` -- ~5.5 fit on standard iPhone. No visual hint that more exist. Options:
- **Simple:** Increase `paddingRight` in `contentContainerStyle` to 32px so last chip is partially clipped, hinting at overflow
- **Better:** Add a trailing 24px-wide `LinearGradient` fade from transparent to `backgroundColor`

### 2.3 Add haptic feedback to QuickFilterChips
**File:** `src/screens/TemplatesScreen/components/QuickFilterChips/QuickFilterChips.tsx`

Import `triggerHaptic` from `@/utils/haptics`. Call `void triggerHaptic('selection')` in the Chip `onPress`. Matches pattern in `useNavigationHandlers.ts`.

### 2.4 Make match-reason text more scannable
**File:** `src/screens/TemplatesScreen/views/TemplateListCard.tsx`

Currently caption-sized bold text in a plain View. Add:
- Background tint: `backgroundColor: ${colors.primary[600]}10`, `borderRadius: borderRadius.small`, `padding: spacing.xs`
- Small `Search` icon prefix (12px) from lucide-react-native

### 2.5 Increase icon-wrapper background opacity
**File:** `src/screens/TemplatesScreen/views/TemplateListCard.tsx`

Line 93: `${iconColor}20` (12.5% opacity) is very faint. Increase to `${iconColor}30` (~19%) for visual pop. Or use `CATEGORY_META[item.category].bgColor` for richer, curated colors.

---

## Phase 3 -- Follow-up PR

### 3.1 Decompose TemplateListCard (318 lines -> 100-line limit)
```
views/TemplateListCard/
  index.ts                      # Barrel export
  TemplateListCard.tsx           # Orchestration (~60 lines)
  TemplateListCard.styles.ts     # StyleSheet (~40 lines)
  TemplateListCard.types.ts      # Props interface (~15 lines)
  getMatchReason.ts              # Pure function (~30 lines)
  components/
    MetaRow.tsx                  # Frequency + category + science pills (~40 lines)
    ImportButton.tsx             # Import button with states (~40 lines)
```

### 3.2 Add shimmer chip row to loading state
**File:** `src/screens/TemplatesScreen/components/TemplatesLoadingState.tsx`

After shimmer search bar, add a row of 5-6 `ShimmerBox` pills (height=36, borderRadius=9999, width=70, gap=8) to match QuickFilterChips layout and prevent layout shift.

### 3.3 Replace inline styles in TemplatesLoadingState
Replace hardcoded values (20, 22, 16, 24) with design tokens (`spacing.base`, `typography.heading1`). Current values don't match the spacing scale.

### 3.4 Add icons to meta pills
- Frequency: `Clock` or `Repeat` icon (11px)
- Category: category emoji from CATEGORY_META
- Science: `FlaskConical` icon (11px)

---

## Verification

After each change:
1. Run `npx expo start` and verify on iOS Simulator
2. Check both light and dark theme
3. Verify loading -> loaded transition is seamless (no layout jump)
4. Test search flow: type query -> verify match reasons appear prominently
5. Test quick filter flow: tap chip -> verify category filters, tap again -> verify deselect
6. Test import flow: tap Add -> verify visual feedback (animation, icon, haptic)
7. Run `npm run lint:max-lines` after Phase 3 to confirm compliance
8. Verify accessibility with VoiceOver on iOS
