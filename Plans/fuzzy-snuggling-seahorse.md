# Plan: Allow 1-Character Habit Names

## Context

Currently, habits require at least 2 characters to be created. This blocks users from creating single-character habits (e.g., emoji-only names, single-letter abbreviations). The minimum should be lowered to 1 character.

## Changes

### 1. `src/utils/validation/textValidation.ts` (line 40)

Change `trimmed.length < 2` to `trimmed.length < 1`:

```ts
// Before
if (trimmed.length < 2) {
  return { error: 'Habit name must be at least 2 characters', isValid: false };
}

// After — remove this block entirely (the empty check on lines 18-26 already catches length 0)
```

The empty-string checks on lines 18-26 already reject empty/whitespace-only input, so the `< 2` block can simply be removed.

### 2. `src/lib/validation/basicValidators.ts` (lines 20-25)

Same pattern — remove the `trimmed.length < 2` block. The `!value || !value.trim()` check on line 14 already rejects empty input.

### 3. `src/components/CreateHabitModal/components/NameInputSection.tsx` (line 65)

Update error message from "at least 2 characters" to "Give your habit a name":
```
"Give your habit a name (at least 2 characters)" → "Give your habit a name"
```

### 4. `src/components/CreateHabitModal/components/StickyCreateBar/CreateButton.tsx` (line 46)

Update accessibility label:
```
"Create habit, disabled. Enter at least 2 characters." → "Create habit, disabled. Enter a habit name."
```

### 5. `src/components/CreateHabitModal/components/__tests__/HabitNameField.v11.test.tsx` (lines 331-334)

Update the test that asserts 1 character is invalid — it should now be valid:
```ts
it('should be valid with 1 character', () => {
  const value = 'A';
  expect(value.trim().length < 1).toBe(false);
});
```

### Files NOT changed (already correct)
- `src/components/CreateHabitModal/utils.ts` — `HABIT_NAME_MIN_LENGTH` is already `1`
- `convex/lib/inputValidation.ts` — no minimum length check on backend
- `src/components/CreateHabitModal/hooks/useCreateHabitModal.ts` line 47 — `!form.habitName.trim()` already allows 1-char (checks for empty, not length >= 2)
- `src/components/CreateHabitModal/components/ModalHeader/ModalHeader.tsx` line 21 — `habitName.trim().length > 0` already allows 1-char

## Verification

1. Run existing tests: `npx jest --testPathPattern="CreateHabitModal|textValidation|basicValidator" --no-coverage`
2. Verify a 1-character habit name passes `validateHabitName('A')`
3. Verify empty string still fails validation
