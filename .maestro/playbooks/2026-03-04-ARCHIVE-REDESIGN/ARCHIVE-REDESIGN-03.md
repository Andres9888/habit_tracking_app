# Archive Page Redesign — Phase 3: Empty State & Final Polish

**Design reference:** `.superdesign/design_iterations/archive_page_1.html`

## Context

Final polish pass: update the empty state copy, remove the `eslint-disable max-lines` comment (file should already be under 100 lines after this), and ensure consistent warm-stone theming.

## Tasks

- [x] **Update `EmptyState` copy and remove eslint-disable comment** _(Completed: removed eslint-disable, updated 3 text strings, extracted inline styles to StyleSheet.create — file now 60 lines)_

  **File:** `src/components/ArchivedHabitsModal/components/EmptyState.tsx`

  Changes:
  1. Remove the `/* eslint-disable max-lines */` comment on line 1 (the file is already within limits)
  2. Update the main heading from `"Your Habits Are Thriving!"` to `"All Habits Are Active!"`
  3. Update the first description line from `"All your habits are active and growing."` to `"Swipe left on any habit to archive it for safekeeping."`
  4. Update the second description text from `"When you need a break, swipe left on any habit to archive it here for safekeeping."` to `"Your progress is always preserved."`
  5. Keep all animations, colors, tip card, and layout exactly the same
  6. Verify file stays ≤100 lines. If over 100 lines, extract the inline styles into a `const styles` object at the top of the file to reduce verbosity

- [x] **Verify all modified files pass lint and type-check** _(Completed: 0 errors, 11 pre-existing warnings. All verification checks pass: no max-lines violations, DangerZoneFooter exported, accentColor typed, icons imported)_

  Run the following commands and fix any issues:

  ```bash
  npx eslint src/components/ArchivedHabitsModal/ --fix
  npx tsc --noEmit --pretty 2>&1 | grep -i "ArchivedHabitsModal" || echo "No type errors in ArchivedHabitsModal"
  ```

  Specifically check:
  - No `max-lines` violations in any file under `ArchivedHabitsModal/`
  - No unused imports after removing `onDeleteAll` from `StatsSummaryBar`
  - `DangerZoneFooter` is properly exported and imported
  - `accentColor` prop is properly typed and passed through
  - `RotateCcw` and `Trash2` icons are imported from `lucide-react-native` in `ActionButtons.tsx`
