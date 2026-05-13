# Plan: Merge `library-quick-roi-chips` to `main`

## Context

The Habit Library Phase 2 work (Quick + High ROI chips, wider right-edge fade with chevron) is **uncommitted** on branch `library-quick-roi-chips` — `git log origin/main..HEAD` is empty; everything lives in the working tree. The user wants it on `main`.

Per the prior conversation, the working tree mixes three buckets that must be separated before merge:

- **Bucket A — feature** (ship): chip UI, filter logic, types, tests, helper data file
- **Bucket B — testing-only hacks** (must NOT ship): `AuthGate.tsx` onboarding bypass, `convex/schema.ts` `schemaValidation: false`
- **Bucket C — legacy-field tolerance** (ship): `validators.ts` + `schema.ts` field additions allowing `benefits` / `scienceNote` / `startSmallVersion` through. Required because, with B reverted, schemaValidation goes back on and these fields exist on dev/prod rows.

Artifacts (`Plans/*.md`, `.superdesign/*.html`) follow the repo's existing pattern of committing both.

## Approach

1. **Revert Bucket B (testing-only changes) in the working tree.**
   - `src/components/auth/AuthGate.tsx`: `git checkout -- src/components/auth/AuthGate.tsx` (restores `onboardingComplete ?? false`).
   - `convex/schema.ts`: surgically remove ONLY the `{ schemaValidation: false }` argument and its `TEMP(...)` comment block (lines around 478–490 in the diff). **Keep** the three `v.optional(v.any())` field additions (`benefits`, `scienceNote`, `startSmallVersion`) — those are Bucket C.

2. **Stage and commit Bucket A + C + artifacts** as a single feature commit on the branch:
   - `convex/habits/validators.ts` (C)
   - `convex/schema.ts` (C, post-revert above)
   - `src/screens/templates/templates.types.ts` (A)
   - `src/screens/TemplatesScreen/data/templateFilters.ts` (A, new)
   - `src/screens/TemplatesScreen/useFilteredTemplates.ts` (A)
   - `src/screens/TemplatesScreen/components/QuickFilterChips/QuickFilterChips.tsx` (A)
   - `src/screens/TemplatesScreen/hooks/useTemplatesScreenProps.ts` (A)
   - `src/screens/TemplatesScreen/__tests__/useFilteredTemplates.test.tsx` (A)
   - `.superdesign/design_iterations/library_phase2_chips_1.html` (artifact)
   - `Plans/system-instruction-you-are-working-jolly-dewdrop.md` (artifact)
   - This plan file `Plans/system-instruction-you-are-working-misty-cook.md` (artifact)

3. **Verify before merge:**
   - `npm run lint:max-lines` → expect "All files compliant!"
   - `npx tsc --noEmit` (or project's typecheck script) — confirm no new errors introduced by these files.
   - `npx jest src/screens/TemplatesScreen/__tests__/useFilteredTemplates.test.tsx` → 5/5 pass.
   - `git diff main...HEAD -- src/components/auth/AuthGate.tsx` → empty (proves Bucket B reverted).
   - `git grep "schemaValidation" convex/schema.ts` → no match.

4. **Merge to main.** Confirm with user which mechanism:
   - **Option a (direct local merge + push)**: `git checkout main && git pull && git merge --no-ff library-quick-roi-chips && git push origin main`. Fast, no PR, no review.
   - **Option b (PR)**: `gh pr create --base main --head library-quick-roi-chips`. Slower, reviewable, leaves audit trail.

   Pushing to `main` is a shared-state action — I will ask via `AskUserQuestion` which path before executing.

## Critical files

- `src/components/auth/AuthGate.tsx:83-93` — revert target (Bucket B)
- `convex/schema.ts:478-490` — surgically strip `{ schemaValidation: false }` only (Bucket B); keep field additions at lines 51-56, 149-152, 318-322 (Bucket C)
- `convex/habits/validators.ts:18-25, 55-59` — keep as-is (Bucket C)

## Verification (end-to-end)

- Type check passes for the 8 touched files.
- `useFilteredTemplates` test suite green.
- `git diff origin/main...HEAD` shows ONLY: feature files + Bucket C field additions + artifacts. No `AuthGate.tsx`. No `schemaValidation: false`.
- After merge, on `main`: tapping `⚡ Quick` filters to short habits; tapping `🔥 High ROI` filters to `popularityScore ≥ 85` OR `tips.length ≥ 2`; signed-in users still see onboarding (bypass gone).
