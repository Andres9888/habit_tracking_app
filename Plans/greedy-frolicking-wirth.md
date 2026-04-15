# Fix Archive Page to Match App Design

## Context

The Archived Habits page uses a completely custom header (BlurView, circular back button with shadow, large left-aligned title below nav bar) while every other Settings sub-page (Account, Sort Order) uses the shared `ScreenHeader` component with centered title, clean chevron back button, and `ModalCloseButton`. The loading skeleton also uses the wrong border radius. This makes the archive page visually inconsistent with the rest of the app.

## Changes

### 1. Rewrite header in `ArchivedHabitsModal.tsx`

**File:** `src/components/ArchivedHabitsModal/ArchivedHabitsModal.tsx`

Replace the custom `ModalHeader` with `ScreenHeader` + `ModalCloseButton`, matching the AccountPage pattern exactly:

- Remove `ModalHeader` import, remove `useSafeAreaInsets` (ScreenHeader handles it internally — keep insets only for FlatList bottom padding)
- Add imports: `ScreenHeader`, `ModalCloseButton`, `useThemeColors`
- Compute subtitle string inline (move logic from ModalHeader)
- Wrap in `<View style={{ backgroundColor: themeColors.background }}>` like AccountPage
- Use `ScreenHeader` with `leftAction='back'`, `title='Archived Habits'`, `subtitle={subtitle}`, `rightAction={<ModalCloseButton />}`, `onBack={onBack}`

### 2. Fix loading skeleton border radius in `LoadingState.tsx`

**File:** `src/components/ArchivedHabitsModal/components/LoadingState.tsx`

- Import `borderRadius` from `'../../../theme/spacing'`
- Change `cardSkeleton.borderRadius` from `12` to `borderRadius.card` (16)

### 3. Delete dead `ModalHeader.tsx`

**File:** `src/components/ArchivedHabitsModal/components/ModalHeader.tsx` — delete

### 4. Remove ModalHeader from barrel export

**File:** `src/components/ArchivedHabitsModal/components/index.ts`

- Remove line `export { ModalHeader } from './ModalHeader';`

## Files Modified

| File | Action |
|------|--------|
| `src/components/ArchivedHabitsModal/ArchivedHabitsModal.tsx` | Edit — swap header |
| `src/components/ArchivedHabitsModal/components/LoadingState.tsx` | Edit — fix borderRadius |
| `src/components/ArchivedHabitsModal/components/ModalHeader.tsx` | Delete |
| `src/components/ArchivedHabitsModal/components/index.ts` | Edit — remove export |

## What stays unchanged

- **CompactHabitRow.tsx** — cards use `rounded-2xl` (16px) and `shadows.card`, consistent with design tokens. The colored left-accent bar is a deliberate visual distinction for archived habits.
- **EmptyState.tsx** — already uses proper animations and design tokens.
- **ScreenHeader** — no changes needed, it already supports all required props.

## Verification

1. Run `npx tsc --noEmit` to confirm no type errors
2. Run `npx expo start` and navigate Settings > Habit Management > Archived Habits
3. Verify: header matches Account page style (centered title, clean back chevron, close button)
4. Verify: subtitle shows habit count below title
5. Verify: back button navigates to settings, close button dismisses modal
6. Verify: loading skeletons have rounded corners matching cards (16px)
7. Verify: dark mode renders correctly
