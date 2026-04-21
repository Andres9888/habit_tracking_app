# Merge main into habit-growth-curve-tiers

## Context
User wants to pull the latest `main` into the current branch `habit-growth-curve-tiers` so work-in-progress picks up recent fixes (designer polish pass, color-picker blur fix, etc.).

Current state:
- 3 commits on `origin/main` not yet in the branch
- Branch has NOT diverged (no local commits ahead of main) — this will be a fast-forward merge
- Working tree has uncommitted changes in `HabitChainVisualizer/` + `DraggableHabit/CardContent.tsx` plus untracked files
- Verified no overlap between incoming files and dirty working-tree files, so merge is safe

## Incoming commits
- `1338c89c5` design: designer-review polish pass (#1319)
- `dc54661a6` Merge #1318 fix-swatch-blur
- `216230eb4` fix(color-picker): sharpen selected swatch

## Plan
Single command:
```
git merge --ff-only origin/main
```

Fast-forward only — no merge commit, no possibility of a conflict-triggered commit. If the fast-forward fails (shouldn't, given the log), stop and report.

Leave working-tree WIP untouched. Do not stage, commit, or stash anything.

## Verification
After merge:
- `git log --oneline -5` → top commit is `1338c89c5`
- `git status` → same WIP modifications still present, branch up to date with `origin/main`
