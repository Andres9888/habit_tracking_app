# Fix Archive Page Header to Use Shared ScreenHeader

## Context

The Archived Habits page has a custom inline `ArchiveHeader` component (~60 lines) that implements its own back button, title, close button, and subtitle. Every other Settings sub-page (Account, Sort Order, Settings) uses the shared `ScreenHeader` component. This creates a visual inconsistency -- different button styles, animation timings, and layout behavior.

Steps 2-4 from the prior plan are already done on this branch (LoadingState border radius fix, ModalHeader.tsx deleted, index.ts export removed). Only the header swap remains.

## Change

**File:** `src/components/ArchivedHabitsModal/ArchivedHabitsModal.tsx`

Replace the custom `ArchiveHeader` component with `ScreenHeader` + `ModalCloseButton`, matching the AccountPage pattern.

### Remove
- The entire `ArchiveHeader` function (lines 58-125)
- The `styles` StyleSheet (lines 14-50) -- all 6 style definitions are header-only
- Imports no longer needed: `Pressable`, `StyleSheet`, `Text`, `ChevronLeft`, `X`
- `useThemeColors` import from the header (keep it in main component for `colors.background`)

### Add
- `import { ScreenHeader } from '../../components/ScreenHeader';`
- `import { ModalCloseButton } from '../../components/ui/ModalCloseButton';`

### Replace header usage (line 159)
```tsx
// Before
<ArchiveHeader subtitle={subtitle} onBack={onBack} onClose={onClose} />

// After
<ScreenHeader
  leftAction='back'
  rightAction={<ModalCloseButton label='Close archived habits' onClose={onClose} />}
  subtitle={subtitle}
  title='Archived Habits'
  onBack={onBack}
/>
```

### Keep unchanged
- `getSubtitle()` helper function (lines 52-56)
- Main `ArchivedHabitsModal` component body
- `useThemeColors` (still needed for `colors.background` on the container)
- `useSafeAreaInsets` (still needed for FlatList bottom padding)

## Reference Pattern

AccountPage (`src/components/SettingsModal/AccountPage.tsx` lines 37-42):
```tsx
<ScreenHeader
  leftAction='back'
  rightAction={<ModalCloseButton label='Close settings' onClose={onClose} />}
  title='Account'
  onBack={onBack}
/>
```

ScreenHeader (`src/components/ScreenHeader/ScreenHeader.tsx`):
- Already supports `subtitle` prop with dedicated animation (FadeInDown, 50ms delay)
- Handles safe area insets internally
- Renders centered title with left/right action slots

## Verification

1. `npx tsc --noEmit` -- no type errors
2. `npx expo start` -> Settings > Habit Management > Archived Habits
3. Header matches AccountPage style: centered title, clean chevron, ModalCloseButton
4. Subtitle shows habit count ("X habits waiting to come back")
5. Back button navigates to settings, close button dismisses modal
6. Loading state -> skeleton cards have 16px border radius
7. Dark mode renders correctly
8. Empty state (no archived habits) shows "No archived habits" subtitle
