# Fix: Template screen chips and Import button cut off on iPhone 16 Pro Max

## Context

On iPhone 16 Pro Max (430pt width), the CategoryDrillView has two overflow issues:
1. **Filter chips** — "Hide imported" chip text is clipped ("Hide impor...") because the chip row is a plain `View` with no scroll capability, and `marginLeft: 'auto'` pushes the last chip past the screen edge
2. **"Import Habit" button** — text is clipped ("Import Ha...") due to double horizontal padding: FlatList adds 16px per side AND the card adds another 16px margin per side, consuming 96px total before content padding starts

## Changes

### 1. CategoryDrillView.tsx — Filter chips (horizontal ScrollView)

**File:** `src/screens/TemplatesScreen/views/CategoryDrillView.tsx`

- Add `ScrollView` to the `react-native` import
- Replace `<View style={s.filterBar}>` with `<ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterBarOuter} contentContainerStyle={s.filterBarContent}>`
- Remove `s.toggleChip` from the "Hide imported" Pressable style array (line 65)
- Update styles:
  - Replace `filterBar` with `filterBarOuter: { paddingVertical: 8 }` and `filterBarContent: { flexDirection: 'row', gap: 8, paddingHorizontal: spacing.base }`
  - Remove `toggleChip` style entirely

This follows the existing `QuickFilterChips` pattern already used elsewhere in the app.

### 2. CategoryDrillView.tsx — Remove FlatList double-padding

**File:** `src/screens/TemplatesScreen/views/CategoryDrillView.tsx`

- Change `list` style from `{ paddingBottom: 100, paddingHorizontal: spacing.base }` to `{ paddingBottom: 100 }`
- The card already has `marginHorizontal: spacing.base` (16px) providing identical visual margins

### 3. SeeAllView.tsx — Same FlatList double-padding fix

**File:** `src/screens/TemplatesScreen/views/SeeAllView.tsx`

- Change line 36 from `contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: spacing.base }}` to `contentContainerStyle={{ paddingBottom: 100 }}`

## Files to modify
1. `src/screens/TemplatesScreen/views/CategoryDrillView.tsx`
2. `src/screens/TemplatesScreen/views/SeeAllView.tsx`

## Existing pattern reference
- `src/screens/TemplatesScreen/components/QuickFilterChips/QuickFilterChips.tsx` — uses horizontal ScrollView for filter chips

## Verification
- Filter chips: all 4 chips fully visible, scrollable if screen is narrow
- Import button: "Import Habit" text fully visible without clipping
- Card spacing: 16px margin from screen edges preserved (from card's own `marginHorizontal`)
- Test on iPhone SE (375pt) to confirm chips scroll properly on narrower screens
