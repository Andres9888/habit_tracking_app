# Plan: Align Edit Habit Screen with Create Habit Modal

## Context
The Edit Habit screen and Create Habit modal are both bottom-sheet modals but have diverged visually. The Create modal is the reference design. This plan brings the Edit screen into alignment: same title size, section labels, button shape, padding, drag handle, and background color. No functional changes.

## Changes

### 1. `src/screens/HabitEditScreen/HabitEditScreen.tsx`
- **Background**: `colors.background` -> `colors.surface` (matches Create)
- **Drag handle**: Add 36x5px drag handle bar before EditHeader (same as Create: `borderRadius: 4, height: 5, width: 36`, centered, `colors.gray[300]`)
- **Remove "CUSTOMIZE" SectionLabel** — replaced by inline labels in CustomizeSection
- **Keep "DANGER ZONE" SectionLabel** — edit-specific
- **Remove `<View className='pt-4'>` wrapper** around NameInputSection — spacing now handled by NameInputSection itself
- **Change content padding** from `px-4` to `px-6` on the CustomizeSection wrapper

### 2. `src/screens/HabitEditScreen/NameInputSection.tsx`
- **Title size**: 34px -> 22px, match Create's `text-[22px] font-bold leading-tight`
- **Remove inline fontSize/letterSpacing/lineHeight style** — use Tailwind classes instead
- **Outer View**: Add `items-center`, change to `px-6`, add `style={{ marginBottom: 40, marginTop: spacing.xl }}`
- **Add import** for `spacing` from `@/theme/spacing`

### 3. `src/screens/HabitEditScreen/CustomizeSection.tsx`
- **Add "Choose an icon"** label (13px uppercase semibold, letterSpacing 0.5, text.tertiary) before EmojiPicker
- **Add "Pick a color"** label (same style, with mt-4 mb-3) before ColorPickerSection
- **Add imports**: `Text` from react-native, `useThemeColors` from theme
- Matches `CreateHabitFormCentered.tsx` lines 45-64 exactly

### 4. `src/screens/HabitEditScreen/EditHeader.tsx`
- **Save button shape**: `rounded-xl px-5 py-2.5` -> `rounded-full h-11 px-6`
- **Add** `justify-center` to button className

## Files Modified
- `src/screens/HabitEditScreen/HabitEditScreen.tsx`
- `src/screens/HabitEditScreen/NameInputSection.tsx`
- `src/screens/HabitEditScreen/CustomizeSection.tsx`
- `src/screens/HabitEditScreen/EditHeader.tsx`

## Files NOT Modified
- `SectionLabel.tsx` — still used for DANGER ZONE
- `DangerZone.tsx` — edit-specific, no visual alignment needed
- `HabitEditSkeleton.tsx` — loading state, out of scope

## Reference File (target style)
- `src/components/CreateHabitModal/components/CreateHabitFormCentered.tsx`
- `src/components/CreateHabitModal/CreateHabitModalCentered.tsx`

## Verification
- Open edit habit modal and visually compare with create habit modal
- Title is 22px, not 34px
- Drag handle visible at top
- "Choose an icon" and "Pick a color" labels appear
- No "CUSTOMIZE" divider line
- "DANGER ZONE" divider still present
- Save button is pill-shaped (rounded-full)
- Background matches create modal
- Dark mode still works correctly
- All files remain under 100 lines (except HabitEditScreen.tsx which has existing eslint-disable)
