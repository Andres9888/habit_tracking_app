# Merge `library-improvements` working tree to `main`

## Context

The user asked: "merge to main".

Branch state right now:
- `library-improvements` is **at the same commit as `origin/main`** (0 ahead / 0 behind, both at `bb99dba70`).
- Nothing has been committed on the branch — everything that needs to "merge" lives in the working tree as **uncommitted changes** and **untracked files**.
- So "merge to main" really means: commit these changes and land them on `origin/main`.

What's in the working tree:

**Templates screen — Library Phase 1 refactor** (the substantive change):
- `src/screens/TemplatesScreen/TemplatesScreen.tsx` — wires `quickFilterCategories`, `selectedCategory`, `userHabitCount`, `onSelectCategory`, `onStartHerePress` props into `MainBrowseView`; adds local `handleSelectChipCategory` that clears search + sets category.
- `src/screens/TemplatesScreen/views/MainBrowseView.tsx` — lifts chip row above the body swap; adds combined "search OR category active" branch; delegates the non-filtered branch to a new `BrowseSections` component. Inline `stagger`/`bodyEnter`/`bodyExit` extracted to a helpers file.
- `src/screens/TemplatesScreen/views/MainBrowseView.types.ts` — adds the 5 new props.
- `src/screens/TemplatesScreen/views/BrowseSections.tsx` *(new, 83 lines)* — `StartHereCard` (conditional on `userHabitCount ≤ 1`) → `GoalCollectionGrid` → `PopularSection` → `PremiumPacks` (gated) → `ExploreAll`.
- `src/screens/TemplatesScreen/views/MainBrowseView.helpers.ts` *(new, 15 lines)* — shared `stagger`, `bodyEnter`, `bodyExit`.
- `src/screens/TemplatesScreen/useTemplatesData.ts` — replaces the duplicated `CATEGORY_METADATA` map with a lookup against the canonical `CATEGORY_META` (which carries chip colors), plus a small `EXTRA_LABELS` map for categories that are in the schema but don't yet have a deliberate color choice.
- `src/screens/TemplatesScreen/components/FeaturedCollection/*` *(deleted, 6 files / ~240 lines)* — unused; verified zero remaining references in `src/`.

**Unrelated drive-by fixes** (small, isolated):
- `src/components/BinaryHeatmap/MonthlyCalendarGrid/styles.ts` — `br.large` → `borderRadius.large`. `br` was an undefined identifier; this is a typo fix using the existing `borderRadius` import.
- `src/components/FullsizeTemplatePreview/utils/heroGradient.ts` — comment-only update (no behavior change), removes a stale reference to the now-deleted `FeaturedCollection`.

**Untracked artifacts not part of the source change:**
- `.superdesign/design_iterations/library_phase1_1.html` — design mockup for this work. The `.superdesign/design_iterations/` directory has many tracked HTMLs already, so the convention is to track these.
- `Plans/system-instruction-you-are-working-virtual-llama.md` — Conductor session plan from a prior workspace. Many such `system-instruction-*` files are already tracked in `Plans/`.

## Verification before committing

I already ran `npx tsc --noEmit`. The only errors reported are **pre-existing on `main`** (HabitDetailScreen LinearGradient, useTemplatesScreenProps, DrillListBody, SeeAllView, validation, and the `categoryMeta.ts` `colors.primary[50/200]` index complaint that lives on `main` already). None of them were introduced by this change. The user's memory notes that pre-commit eslint is broken upstream and `--no-verify` is acceptable.

## Decided plan

Per the user's answers:
- **One combined commit** containing the templates refactor, the BinaryHeatmap typo fix, the heroGradient comment update, and the design HTML.
- **Fast-forward main locally and push `origin main` directly** — no PR.
- **Leave `Plans/system-instruction-*-virtual-llama.md` untracked.**

### Commit message

```
feat(templates): library phase 1 — quick filter chips, StartHere, BrowseSections split

- MainBrowseView: lift chip row above body swap; combine search-active and
  category-active into one filtered branch; delegate non-filtered branch
  to new BrowseSections component.
- TemplatesScreen: wire quickFilterCategories / selectedCategory /
  userHabitCount / onSelectCategory / onStartHerePress into MainBrowseView.
- BrowseSections (new): StartHereCard (gated on userHabitCount ≤ 1) →
  GoalCollectionGrid → PopularSection → PremiumPacks (gated) → ExploreAll.
- MainBrowseView.helpers (new): shared stagger / bodyEnter / bodyExit.
- useTemplatesData: replace duplicated CATEGORY_METADATA with canonical
  CATEGORY_META lookup + small EXTRA_LABELS map for uncolored categories.
- Remove unused FeaturedCollection/* (verified no remaining references).
- Fix BinaryHeatmap MonthlyCalendarGrid styles: br.large → borderRadius.large
  (br was undefined; borderRadius is the existing import).
- heroGradient: update stale comment referencing deleted FeaturedCollection.
- Add design mockup .superdesign/design_iterations/library_phase1_1.html.
```

### Exact commands

```bash
# Stage everything except the orphan Plans file
git add \
  src/components/BinaryHeatmap/MonthlyCalendarGrid/styles.ts \
  src/components/FullsizeTemplatePreview/utils/heroGradient.ts \
  src/screens/TemplatesScreen/TemplatesScreen.tsx \
  src/screens/TemplatesScreen/useTemplatesData.ts \
  src/screens/TemplatesScreen/views/MainBrowseView.tsx \
  src/screens/TemplatesScreen/views/MainBrowseView.types.ts \
  src/screens/TemplatesScreen/views/BrowseSections.tsx \
  src/screens/TemplatesScreen/views/MainBrowseView.helpers.ts \
  src/screens/TemplatesScreen/components/FeaturedCollection \
  .superdesign/design_iterations/library_phase1_1.html

# Commit (allow --no-verify per user memory: pre-commit eslint is broken upstream)
git commit -m "<message above>"   # try without --no-verify first; fall back if hooks fail

# Fast-forward main and push
git checkout main
git pull --ff-only
git merge --ff-only library-improvements
git push origin main
git checkout library-improvements   # leave the user back where they started
```

If the pre-commit hook fails per the known upstream breakage, retry with `--no-verify` (creating a NEW commit, not amending — pre-commit failure means the commit didn't happen).

## Files this plan will modify on disk

- `src/components/BinaryHeatmap/MonthlyCalendarGrid/styles.ts` (already modified, will be committed)
- `src/components/FullsizeTemplatePreview/utils/heroGradient.ts` (comment only)
- `src/screens/TemplatesScreen/TemplatesScreen.tsx`
- `src/screens/TemplatesScreen/views/MainBrowseView.tsx`
- `src/screens/TemplatesScreen/views/MainBrowseView.types.ts`
- `src/screens/TemplatesScreen/useTemplatesData.ts`
- `src/screens/TemplatesScreen/views/BrowseSections.tsx` *(new)*
- `src/screens/TemplatesScreen/views/MainBrowseView.helpers.ts` *(new)*
- `src/screens/TemplatesScreen/components/FeaturedCollection/*` *(deleted)*
- `.superdesign/design_iterations/library_phase1_1.html` *(new, optional)*

## Verification after push

1. `git log --oneline origin/main -3` shows the two new commits at the tip.
2. `git status` is clean (or only retains the deliberately-excluded `Plans/system-instruction-*` file).
3. `npx tsc --noEmit` produces the same baseline error set as before (no new errors).
4. Optional smoke check: open `TemplatesScreen` in the running app, confirm the chip row appears above the browse content and tapping a chip clears the search box and filters the list; confirm the StartHere card shows for users with ≤1 habit.

## Open decisions — surfacing to the user

These determine the final commit/push commands; I'll ask via AskUserQuestion before exiting plan mode:
1. **Commit grouping:** two commits (typo-fix + feature), or one combined commit?
2. **Push path:** direct fast-forward to `main`, or push the branch and open a PR?
3. **Include `Plans/system-instruction-*-virtual-llama.md`** in the commit, or leave it untracked?
