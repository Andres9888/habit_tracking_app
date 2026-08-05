# Plan: Remove char-count from Edit Habit name input

## Context

The edit habit screen shows a `{habitName.length}/50 characters` counter below the name input. The add habit modal does not — it only surfaces an inline error when the name is empty. To make the edit page follow the add page more closely, remove the counter Text from the edit screen's `NameInputSection`.

The `maxLength={50}` stays on the `TextInput` (the add page also has it). The user's ask — "remove the char limit" — refers to the visible counter, since that's the actual visual difference between the two pages.

## Change

**File:** `src/screens/HabitEditScreen/NameInputSection.tsx`

Delete the `<Text>` block at lines 67–72 (the `{habitName.length}/50 characters` counter) and its trailing `typography` import if it becomes unused.

After the edit, the `Animated.View` wrapping the input will contain just the `<TextInput>`, matching the add page's layout pattern (input only, no counter below).

### Before (lines 45–73)
```tsx
<Animated.View className='w-full' entering={...}>
  <TextInput ... />
  <Text className='mt-2 text-center' style={{ ...typography.caption, color: colors.text.tertiary }}>
    {habitName.length}/50 characters
  </Text>
</Animated.View>
```

### After
```tsx
<Animated.View className='w-full' entering={...}>
  <TextInput ... />
</Animated.View>
```

## Scope discipline

- Do NOT touch `maxLength={50}` — the add page has it too; removing it would diverge, not converge.
- Do NOT restructure the heading, animations, border, or focus logic — those are pre-existing differences the user didn't mention.
- Do NOT touch the add page.
- Check if `typography` import becomes unused after the delete; remove if so.

## Verification

1. Read the file after edit — confirm the counter `<Text>` is gone and the `<TextInput>` remains intact with `maxLength={50}`.
2. Run `npx tsc --noEmit` to confirm no TS errors from the removed `typography` reference.
3. Run `npm run lint -- src/screens/HabitEditScreen/NameInputSection.tsx` to confirm no unused-import warnings.
4. Visually: open the edit habit screen in the app — the "X/50 characters" text below the input should be gone; the input and heading remain.

## Critical files

- `src/screens/HabitEditScreen/NameInputSection.tsx` (only file modified)
- `src/components/CreateHabitModal/components/NameInputSection.tsx` (reference, unchanged)
