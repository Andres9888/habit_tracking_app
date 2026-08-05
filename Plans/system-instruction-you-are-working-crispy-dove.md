# Merge origin/main into onboarding-v2

## Context
The `onboarding-v2` branch is 8 commits ahead of `main`, but `main` has 1 new commit (`92485b38d`) that hasn't been incorporated here yet. The user wants that commit merged in so the branch stays current before continuing onboarding polish work.

## Current State
- **Branch:** `onboarding-v2`
- **Ahead of main:** 8 commits (Phase A–E + fixes)
- **Behind main:** 1 commit — `92485b38d copy(advanced): tighten Advanced section subtitles + algo descriptions (#1331)`
- **Incoming commit touches:**
  - `Plans/system-instruction-you-are-working-toasty-falcon.md` (new plan file)
  - `src/components/AdvancedOptions/AdvancedOptionsSection.tsx`
  - `src/components/AdvancedOptions/StreakGoalSheetBody.tsx`
  - `src/components/AlgorithmPicker/algorithmCopy.ts`
- **Onboarding-v2 commits touch:** `src/components/onboarding-v2/**` primarily — no overlap with incoming files, so **no merge conflicts expected**.

## Uncommitted Local State (needs handling before merge)
- `package-lock.json` — modified (-222 lines; looks like a regeneration/reset)
- `Plans/system-instruction-you-are-working-partitioned-hanrahan.md` — untracked

Neither is touched by the incoming commit, but git merge refuses to proceed with a dirty tree only if a tracked file would be overwritten. Since `package-lock.json` isn't in the incoming diff, the merge should succeed without stashing. Still, safest path is to stash to keep the merge commit clean, then pop.

## Plan

1. **Stash local changes** (including untracked)
   ```
   git stash push -u -m "pre-merge-main stash"
   ```
2. **Merge origin/main** with a merge commit (no fast-forward since we're ahead)
   ```
   git merge origin/main --no-edit
   ```
   Expect a clean merge creating a merge commit. Divergent branches → merge commit is correct (not rebase — user said "merge").
3. **Pop the stash**
   ```
   git stash pop
   ```
4. **Verify**
   ```
   git log --oneline -5
   git status
   ```
   Confirm:
   - `92485b38d` is now an ancestor of HEAD
   - Working tree has the same uncommitted package-lock.json + untracked plan file as before
   - No conflict markers

## Rollback (if anything goes wrong)
- If merge has conflicts: `git merge --abort` then investigate
- If stash pop conflicts: resolve manually (only package-lock.json + untracked file, low risk)

## Not Doing
- Not pushing — the user only asked to merge locally
- Not committing the package-lock.json changes — those predate this request
- Not rebasing — user said "merge"
