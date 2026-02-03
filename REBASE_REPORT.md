# PR Rebase Report - 2026-02-03

## Summary

After the mass merge of 100+ PRs, attempted to rebase conflicted PRs.

## ✅ Successfully Rebased

### PR #358 - UI consistency improvements

- **Branch:** `feature/ui-consistency-improvements`
- **Conflict:** 1 file (`src/components/StatsNotesModal/NoteEditor/NoteEditorActions.tsx`)
- **Resolution:** Merged both changes - kept `activeOpacity={0.7}` from main, kept padding changes (`px-4 py-2.5`) from PR
- **Status:** ✅ Rebased and force-pushed to origin

## ❌ Cannot Rebase (Recommend Closing)

### PR #336 - Lint fixes batch 4

- **Branch:** `fix/lint-batch-4-1770063290`
- **Conflicts:** 19 files with TypeScript import and type conflicts
- **Why close:**
  1. **Batches 5 & 6 already merged** - Later lint batches supersede this one
  2. **Dark mode commits** - Branch includes dark mode features (commits after lint fixes) that were intentionally removed from main
  3. **Extensive conflicts** - 19 files conflicting with import statement formatting changes
  4. **Changes likely superseded** - Many of the lint fixes may have been addressed in later PRs or are no longer relevant
- **Commits in branch:**
  - `7962f492` - fix: batch 4 lint fixes + onboarding scaffold
  - `d5711e2b` - perf: optimize animations to use Reanimated UI thread
  - `9c19873d` - feat: add dark mode support to key components
  - `378eb39b` - docs: add dark mode polish PR documentation

- **Recommendation:** Close PR #336 with explanation that:
  - Batches 5 and 6 already merged and supersede this work
  - Dark mode features in later commits conflict with decision to remove dark mode from main
  - Any valuable lint fixes not covered can be addressed in a new targeted PR

## ✅ Already Merged (Can Close)

### Confetti Celebration Feature

- **Branch:** `feature/habit-completion-confetti`
- **Status:** All commits already in main (dropped during rebase)
- **Action:** Close PR as "already merged"

### Bundle Identifier Update

- **Branch:** `feature/update-bundle-identifier`
- **Status:** All commits already in main (skipped during rebase)
- **Action:** Close PR as "already merged"

## ❌ Has Conflicts - Recommend Closing

### Dark Mode Polish

- **Branch:** `feature/dark-mode-polish`
- **Conflict:** `src/features/habits/components/HabitsList/MonetizationHero/MonetizationHero.tsx`
- **Reason to close:** Dark mode was intentionally removed from main (commit: "So, let's remove dark mode")
- **Action:** Close PR - dark mode features are no longer wanted

## Next Steps

1. ✅ PR #358 (`feature/ui-consistency-improvements`) - Ready to merge
2. Close PR #336 (`fix/lint-batch-4-1770063290`) - Superseded by batches 5 & 6 + dark mode conflicts
3. Close `feature/habit-completion-confetti` - Already merged
4. Close `feature/update-bundle-identifier` - Already merged
5. Close `feature/dark-mode-polish` - Dark mode intentionally removed
6. If specific lint errors from batch 4 still exist, create a new focused PR
