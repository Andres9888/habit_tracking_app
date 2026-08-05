# Remove "Be specific" helper text from Create Habit page

## Context
The create habit page shows helper text "Be specific — include when, how long, or where" below the habit name input. User wants this removed.

## Changes

### 1. `src/components/CreateHabitModal/components/NameInputSection.tsx`
- Remove the "Be specific" text (line 68-81) — the `View` wrapper with the hint text and character counter
- Keep only the character counter when `habitName.length > 0`, without the helper text
- The error message (lines 58-66) stays untouched

### 2. `src/components/CreateHabitModal/__tests__/CreateHabitModal.integration.test.tsx`
- Remove or update the test at line 529-533 that asserts "Tip: Be specific" is rendered

### 3. `src/components/CreateHabitModal/components/__tests__/HabitNameField.test.tsx`
- Update/remove tests referencing `STRINGS.CREATE_HABIT.nameHelper` (lines 76, 129, 136, 143, 258)

### 4. `src/constants/strings.ts`
- Remove `nameHelper` string (line 17) if no other consumers exist

## Verification
- Run tests: `npx jest --testPathPattern CreateHabitModal`
- Visually confirm the helper text is gone but character counter still appears
