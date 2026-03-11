# Create Habit Workflow — UI/UX Improvement Plan

## Context

The add-habit workflow (triggered by the center Plus button in BottomActionBar) has a solid foundation: spring-animated full-screen modal, good accessibility, smart emoji suggestions, and comprehensive form fields. However, a codebase audit reveals **hardcoded colors bypassing the design system**, **missing visual affordances**, and an **unused success animation** that was built but never connected. This plan addresses all three improvement categories: UI consistency, UX flow, and form content.

---

## A. UI Consistency — Design Token Violations (7 files)

Replace hardcoded colors and non-standard spacing with design system tokens.

### A1. SaveButton.tsx
**File:** `src/components/CreateHabitModal/components/ModalHeader/SaveButton.tsx`
- Line 44: `'#059669'` → `colors.primary[600]` (same hex but references token)
- Line 46: `'#57534e'` (disabled dark) → `colors.gray[400]`
- Line 47: `'#a8a29e'` (disabled light) → `colors.gray[300]`
- Currently destructures only `{ isDark }` from `useThemeColors()` (line 25) — also destructure `colors`

### A2. NameInputSection.tsx
**File:** `src/components/CreateHabitModal/components/NameInputSection.tsx`
- Line 43: `'#A8A29E'` placeholder → `themeColors.text.tertiary` (already available via props)
- Line 49: `'#f87171'` error border → `colors.error` from `@/theme/colors/core` (`#B53030`)
- Line 61: `'#ef4444'` error text → same `colors.error`
- Line 29: `marginTop: 28` → `marginTop: 32` (align to 8px grid — `spacing.xl`)
- Line 29: `marginBottom: 40` → `marginBottom: spacing['2xl'] - spacing.sm` or just `40` (40 = 8×5, acceptable)

### A3. EmojiPicker.tsx
**File:** `src/components/CreateHabitModal/components/EmojiPicker/EmojiPicker.tsx`
- Lines 87-90: `text-emerald-600` NativeWind class → inline style `{ color: themeColors.primary[600] }` via `useThemeColors()`
- Requires adding `useThemeColors()` hook call to the component

### A4. ColorPickerContent.tsx
**File:** `src/components/CreateHabitModal/components/ColorPickerSection/ColorPickerContent.tsx`
- Line 47: `text-stone-500` NativeWind class → inline style `{ color: themeColors.text.tertiary }`
- Requires adding `useThemeColors()` hook call (or passing themeColors via props)

### A5. EmojiPicker label (when hideLabel=false)
**File:** `src/components/CreateHabitModal/components/EmojiPicker/EmojiPicker.tsx`
- Line 67: `text-stone-500` → same pattern, use `themeColors.text.tertiary`

---

## B. UX Flow Improvements (3 changes)

### B1. Add drag handle indicator to modal
**File:** `src/components/CreateHabitModal/CreateHabitModalCentered.tsx`

Add a small pill-shaped drag handle at the top of the sheet to signal swipe-to-dismiss affordance. Place it inside the `Animated.View` sheet, above the `ModalHeader`.

```
<View style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 4 }}>
  <View style={{
    width: 36,
    height: 5,
    borderRadius: borderRadius.xs,
    backgroundColor: themeColors.gray[300],
  }} />
</View>
```

This follows the pattern already shown in the design mockups (`.superdesign` files reference a `swipe-indicator`).

### B2. Add modal title to header
**File:** `src/components/CreateHabitModal/components/ModalHeader/ModalHeader.tsx`

Replace the empty `<View className='flex-1' />` spacer (line 54) with a centered title:

```tsx
<View className='flex-1 items-center justify-center'>
  <Text style={{
    color: themeColors.text.primary,
    fontSize: 17,
    fontWeight: '600',
  }}>
    {isEditMode ? 'Edit Habit' : 'New Habit'}
  </Text>
</View>
```

Uses `typography.body` size (17px) with semibold weight, consistent with other modal headers.

### B3. Wire up existing SuccessAnimation (create only, not edit)
**Files:**
- `src/components/CreateHabitModal/hooks/useCreateHabitModal.ts` — add success state + split flow
- `src/components/CreateHabitModal/CreateHabitModalCentered.tsx` — render SuccessAnimation

The `SuccessAnimation` component already exists at `src/components/CreateHabitModal/components/SuccessAnimation/` with confetti, success card, and haptic feedback — but it's never rendered.

**Current flow** (in `useCreateHabitModal.ts` lines 45-56):
```
handleCreate() → save to DB → cleanup() → modal closes immediately
```
`cleanup()` comes from `useModalCleanup` which calls `onClose`, `resetForm`, and `triggerSuccess` haptic.

**New flow** (create mode only; edit mode keeps current behavior):
```
handleCreate() → save to DB → setShowSuccess(true) → [animation] → cleanup()
```

**Changes to `useCreateHabitModal.ts`:**
1. Add `const [showSuccess, setShowSuccess] = useState(false)` state
2. In `handleCreate`, after successful save:
   - If `isEditMode`: call `cleanup()` directly (no animation)
   - If create: call `setShowSuccess(true)` instead of `cleanup()`
3. Add `handleSuccessComplete` callback that calls `cleanup()` + `setShowSuccess(false)`
4. Return `{ showSuccess, handleSuccessComplete }` alongside existing returns

**Changes to `CreateHabitModalCentered.tsx`:**
1. Import `SuccessAnimation` from `./components/SuccessAnimation`
2. Destructure `showSuccess` and `handleSuccessComplete` from `useCreateHabitModal`
3. Render `<SuccessAnimation>` inside the modal, passing `form.habitName`, `form.selectedEmoji`, `form.selectedColor`, `visible={showSuccess}`, `onComplete={handleSuccessComplete}`

This is the highest-impact UX win — the component is already built, just needs plumbing.

---

## C. Form Content Improvements (2 changes)

### C1. Replace "CUSTOMIZE" with descriptive section dividers
**File:** `src/components/CreateHabitModal/components/CreateHabitFormCentered.tsx`

The current `CUSTOMIZE` label (line 49) is vague. Replace with inline section labels for each picker, even in centered/hideLabel mode:

- Before emoji grid: "Choose an icon" (small, tertiary text)
- Before color picker: "Pick a color" (small, tertiary text)
- Before reminder toggle: no change needed (already has "Daily Reminder" label)

Remove the standalone `CUSTOMIZE` text block entirely. The individual section labels provide better orientation without the intermediary label.

### C2. Improve "Browse more emojis" link styling
**File:** `src/components/CreateHabitModal/components/EmojiPicker/EmojiPicker.tsx`

Currently uses hardcoded emerald-600. After fixing A3, also consider making the arrow (`→`) part of the same Text element rather than a separate `<Text>` (lines 88-90), and ensuring consistent tap target size (min 44px height per Apple HIG).

---

## Files Modified (Summary)

| # | File | Changes |
|---|------|---------|
| 1 | `SaveButton.tsx` | Replace 3 hardcoded colors with theme tokens |
| 2 | `NameInputSection.tsx` | Replace 3 hardcoded colors, fix spacing to 8px grid |
| 3 | `EmojiPicker.tsx` | Add useThemeColors, replace NativeWind color classes |
| 4 | `ColorPickerContent.tsx` | Add useThemeColors, replace NativeWind color class |
| 5 | `CreateHabitModalCentered.tsx` | Add drag handle indicator, render SuccessAnimation |
| 6 | `ModalHeader.tsx` | Add centered "New Habit" / "Edit Habit" title |
| 7 | `CreateHabitFormCentered.tsx` | Replace "CUSTOMIZE" with section labels |
| 8 | `useCreateHabitModal.ts` | Add showSuccess state, split create/edit flow for SuccessAnimation |

---

## Existing Utilities to Reuse

- `useThemeColors()` — `src/theme/ThemeContext.tsx` (already imported in most files)
- `colors` (static) — `src/theme/colors/core.ts` for `colors.error`, `colors.primary`
- `spacing`, `borderRadius` — `src/theme/spacing.ts`
- `typography` — `src/theme/typography.ts`
- `SuccessAnimation` — `src/components/CreateHabitModal/components/SuccessAnimation/` (ready to use)
- `springs` — `src/theme/animations.ts`

---

## Verification

1. **Visual check (both themes):** Toggle dark mode in settings, verify all colors adapt correctly
2. **Drag handle:** Swipe down on the modal — handle visible, dismiss works
3. **Modal title:** "New Habit" shown on create, "Edit Habit" on edit
4. **Success animation:** Create a habit → confetti + success card appears → auto-closes
5. **Error states:** Clear habit name → tap Save → error border + text use `colors.error` (#B53030)
6. **Section labels:** "Choose an icon" and "Pick a color" visible above respective sections
7. **Disabled save button:** Correct gray tint in both light and dark mode
8. **8px grid:** NameInputSection top margin is 32px (not 28px)
