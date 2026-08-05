# Merge main → onboarding-v2 + verify Habit Library / Habit Details features

## Context

Branch `onboarding-v2` is **9 commits behind `origin/main`**. Main contains three commits the user wants confirmed on this branch:

- `a7667776c` — `feat(templates): library phase 1 — quick filter chips, StartHere, BrowseSections split`
- `786e6ae49` — `feat(templates): add 'Start small' tiny-habit version to all 253 templates`
- `29c89ccc6` — `feat(template-preview): redesign science section, remove Start small block`

Working tree has substantial uncommitted onboarding-v2 WIP: deletions of old step files, new step/component files, and modifications to `convex/schema.ts`, `convex/habits/validators.ts`, `index.ts`. A schema.ts conflict is likely (786e6ae49 added `startSmallVersion`).

User chose: stash WIP → merge → re-apply stash → resolve conflicts.

"ROI" search chip — no literal "ROI" string exists in main code (all matches are obfuscated "android"). Treat as voice-to-text artifact; verification step will list every chip label so user can point to which one.

## Approach

### Phase 1 — Preserve WIP
1. `git stash push -u -m "onboarding-v2 WIP pre-main-merge $(date +%Y-%m-%d)"`
   - `-u` includes untracked (the new step/component files and `.superdesign/` mockups).
   - Verify clean tree: `git status` → only `Plans/system-instruction-you-are-working-zany-seal.md`.

### Phase 2 — Merge origin/main
2. `git merge origin/main --no-ff -m "Merge origin/main into onboarding-v2 — bring template library quick chips + Habit Details science redesign"`
   - Expect a clean merge (no overlap between branch's committed onboarding-v2 work and main's templates work).
   - If conflicts appear, resolve them inline, then `git add` + finish merge.

### Phase 3 — Re-apply stash
3. `git stash pop`
   - Likely conflict: `convex/schema.ts` (branch's onboarding fields vs. main's `startSmallVersion` on templates table).
   - Resolution rule: **keep both** — main's `startSmallVersion` is on `templates` table, branch's onboarding edits are likely on `users`/`profiles` table. They should coexist.
   - Other potential conflict: `index.ts` if main touched it (unlikely for templates work).
   - After resolving: `git add <conflicted files>`. Stash pop leaves the conflicted files in working tree (no commit yet — they remain WIP).

### Phase 4 — Verify the merged-in features

For each, read the file at HEAD (post-merge) and confirm presence of the expected code:

**4a. Habit Library quick chips (`a7667776c`)**
- Confirm exists: `src/screens/TemplatesScreen/components/QuickFilterChips/QuickFilterChips.tsx`
- Confirm exists: `src/screens/TemplatesScreen/views/BrowseSections.tsx`
- Confirm exists: `src/screens/TemplatesScreen/components/StartHereCard/StartHereCard.tsx`
- Read `MainBrowseView.tsx` and confirm it renders `<QuickFilterChips>` above the body and delegates non-filtered branch to `<BrowseSections>`.
- **Enumerate every chip label rendered by QuickFilterChips** (✨ All + the 7 category pills with their emoji + label) and report them to the user so they can identify "ROI".

**4b. Habit Details — `Start small` inline line (`786e6ae49`)**
- Read `src/components/FullsizeTemplatePreview/components/DescriptionSection.tsx` and confirm it renders `startSmallVersion` with ✨ glyph, `Start small:` label, top-border separator, template's `iconColor`.
- Confirm `convex/schema.ts` has optional `startSmallVersion` field on templates table (post-conflict-resolution).

**4c. Habit Details — Science redesign (`29c89ccc6`)**
- Confirm exists: `src/components/FullsizeTemplatePreview/components/ScienceActionPills.tsx`
- Confirm exists: `src/components/FullsizeTemplatePreview/styles/actionPills.styles.ts`
- Read `ScienceEvidenceSection.tsx` and confirm two-zone layout (green hero + cream "Why it works" tips zone).
- Read `ScienceEvidenceHeader.tsx` and confirm "Science-backed" pill with shield.

### Phase 5 — Sanity checks (read-only)
- `git log --oneline -10` — confirm merge commit at HEAD with expected parents.
- `git status` — confirm only the WIP files are dirty (no surprise files staged).
- Do NOT run lint/typecheck unless user asks — branch's WIP is mid-flight and may not pass.

## Critical files to read for verification

| Purpose | Path |
|---|---|
| Quick chips | `src/screens/TemplatesScreen/components/QuickFilterChips/QuickFilterChips.tsx` |
| Browse view orchestration | `src/screens/TemplatesScreen/views/MainBrowseView.tsx` |
| Browse rows | `src/screens/TemplatesScreen/views/BrowseSections.tsx` |
| Start Here card | `src/screens/TemplatesScreen/components/StartHereCard/StartHereCard.tsx` |
| Start small inline line | `src/components/FullsizeTemplatePreview/components/DescriptionSection.tsx` |
| Science two-zone | `src/components/FullsizeTemplatePreview/components/ScienceEvidenceSection.tsx` |
| Science action pills | `src/components/FullsizeTemplatePreview/components/ScienceActionPills.tsx` |
| Science header | `src/components/FullsizeTemplatePreview/components/ScienceEvidenceHeader.tsx` |
| Science tips | `src/components/FullsizeTemplatePreview/components/ScienceEvidenceTips.tsx` |
| Schema (conflict zone) | `convex/schema.ts` |

## Verification (end-to-end)

After merge + verification reads, report to user:

1. ✅/❌ Merge succeeded; merge commit SHA and parent SHAs.
2. ✅/❌ `QuickFilterChips`, `StartHereCard`, `BrowseSections` all present and wired into `MainBrowseView`.
3. **Listed chip labels** — full enumeration of every chip the user will see on the Habit Library search, so they can point to which one is "ROI".
4. ✅/❌ `Start small:` inline line in DescriptionSection.
5. ✅/❌ Science section two-zone redesign + ScienceActionPills.
6. WIP status: stash re-applied; conflicts (if any) resolved manually with branch's onboarding fields + main's `startSmallVersion` both preserved.
7. Optional offer: dev-build verification by running the app and screenshotting the Habit Library search + a Habit Details preview — only if user requests, since the branch is mid-WIP.

## Rollback

If anything goes sideways:
- Pre-merge state: HEAD was `3821abc88`, stash captures all WIP.
- `git merge --abort` cancels in-progress merge.
- `git reset --hard 3821abc88 && git stash pop` restores exactly to where we started.
