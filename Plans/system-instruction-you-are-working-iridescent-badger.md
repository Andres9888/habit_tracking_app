# Land the Questionnaire Onboarding — Rebase + Gap Fixes + QA

## Context

The 13-screen questionnaire onboarding was designed and implemented on 2026-04-15/20 on the local branch `questionnaire-onboarding` (4 commits, 41 files, +2373/-27 LOC). It replaces the old auto-skipped carousel and builds investment (goal → pain → proof → demo → viral plan) before asking for sign-in or payment.

**Nothing has landed on `main`.** Since the branch was cut, main moved 25 commits ahead (habit library review, keyboard/modal fixes, templates polish, design-token migrations). The branch needs a rebase before it can ship, plus three concrete gaps closed to match the skill's 14-archetype framework and the TODOs already captured in memory.

**Goal of this workspace (`lyon-v1`):** rebase the branch onto current main, close the three remaining gaps, and open the PR. Device QA runs once the PR build is on TestFlight.

---

## Audit: Existing implementation vs. 14-archetype framework

| # | Archetype | Existing screen | Status |
|---|---|---|---|
| 1 | Welcome | `WelcomeStep.tsx` | ✅ Copy + CTA. No device preview — acceptable for current style. |
| 2 | Goal | `GoalStep.tsx` | ✅ Single-select, 5 emoji goals. |
| 3 | Pain Points | `PainPointsStep.tsx` | ✅ Multi-select, 6 pain points. |
| 4 | Social Proof | `SocialProofStep.tsx` + `data/testimonials.ts` | ⚠️ Placeholder quotes (flagged TODO in file). |
| 5 | Pain Amplification (Tinder) | `PainAmplificationStep.tsx` + `SwipeCard` + `useSwipeCardGesture` | ✅ |
| 6 | Personalised Solution | `SolutionStep.tsx` + `data/solutions.ts` | ✅ |
| 7 | Comparison Table | — | ⏭️ Skipped (optional). |
| 8 | Preference Config | `CategoryPreferencesStep.tsx` + `data/categories.ts` | ✅ Grid of 6 categories, multi-select. |
| 9 | Processing Moment | `ProcessingStep.tsx` | ✅ |
| 10 | App Demo | `AppDemoStep.tsx` | ✅ Real `api.templates.list` query, category-filtered, 3-pick tinder. |
| 11 | Value Delivery + Share | `PlanPreviewStep.tsx` | ⚠️ Title reads "Your 1-habit starter plan" when user has 0 picks — copy bug. |
| 12 | Permission Priming (notifications) | `NotificationPrimingStep.tsx` | ✅ Positioned post-preview (can reference real picks) — good call. |
| 13 | Account Creation | `AccountCreationStep.tsx` | ✅ Reuses `useOAuthSignIn` + `SocialSignInButton`. |
| 14 | Paywall | `PaywallStep.tsx` → `RevenueCatPaywall` | ✅ Auto-imports selected templates on mount via `useTemplateAutoImport`. |

**AuthGate wiring** (`src/components/auth/AuthGate.tsx`): already refactored to route pre-auth users into `QuestionnaireFlow`; mid-flow signed-in users resume at paywall; completed users → app; completed + signed-out → `WelcomeScreen`. Old `OnboardingScreen` + `useOnboardingStatus` hook removed from the import graph on this branch.

---

## Plan

### Part 1 — Rebase `questionnaire-onboarding` onto current `main`

Starting branch state: 4 commits on top of `603ec6d05` (base: 2026-04-20, PR #1309). Target: current `main` tip (`35ad6e2d1`, +25 commits). Expected conflict surface is small and localized.

**Execution:**

```bash
# From this workspace (lyon-v1)
git fetch origin
git checkout questionnaire-onboarding
git rebase main
# Resolve conflicts (see likely conflict zones below)
# Continue with each commit
```

**Likely conflict zones** (based on what main has touched since the base):

1. **`src/components/auth/AuthGate.tsx`** — low risk. The branch rewrites this file. Main hasn't touched it in the 25-commit range (verified: no AuthGate changes in main's recent log). If surprise conflicts surface, prefer the branch's rewrite; it's intentional.
2. **Design tokens / fontWeight migration (PR #1324)** — main migrated `GoalCard`/`GoalDetail`/`StreakGoalSection` fontWeight to tokens. Our questionnaire screens use raw `'600'`/`'700'` weights. **Not a conflict** (different files) but we should follow the same token pattern for new files. Action: in Part 2 cleanup, sweep the 13 step files for raw fontWeight → tokens.
3. **Template auto-import** — main added `api.templates.importTemplate` signature/behavior changes? Verify at rebase time by running the importTemplate call path against current Convex generated types.

**Fallback if rebase gets messy:** do `git rebase --abort`, create a squash-merge branch `questionnaire-onboarding-v2` off current main, and cherry-pick the 4 commits with `-Xtheirs` strategy.

### Part 2 — Close the three concrete gaps

#### Gap A — Replace placeholder testimonials with launch-quality aspirational copy

**File:** `src/screens/questionnaire/data/testimonials.ts`

Current state: 3 placeholder testimonials (M.B., J.L., A.K.) with `TODO: Replace with real App Store / TestFlight reviews before launch.`

**Action:** keep the 3-slot structure but rewrite the quotes so they:
- Mirror the 5 goals in `data/goals.ts` — one testimonial per major audience segment (parent, founder, student is fine as-is; validate tags match the Goal screen options)
- Lead with a specific outcome number ("40 days" is good; audit all three for this)
- Use Chain Day's actual vocabulary ("chain", "streak", "check-ins") — not generic habit-app language

Flag the file with a `// PLACEHOLDER — replace with real App Store reviews post-launch` header comment so future engineers know these are approved aspirational copy, not scraped quotes. Do **not** invent names of real users.

#### Gap B — Fix `PlanPreviewStep` title when user picked 0 habits

**File:** `src/screens/questionnaire/screens/PlanPreviewStep.tsx` (line ~38)

Current:
```tsx
title={`Your ${Math.max(selected.length, 1)}-habit starter plan`}
```

Bug: shows "Your 1-habit starter plan" when `selected.length === 0`, which contradicts the empty-state body text immediately below ("We'll suggest 3 habits once you sign in…").

**Fix:**
```tsx
title={
  selected.length > 0
    ? `Your ${selected.length}-habit starter plan`
    : 'Your starter plan is ready'
}
```

Single-line change. No new imports.

#### Gap C — Sweep raw fontWeight values in questionnaire screens → design tokens

**Files:** 13 step files under `src/screens/questionnaire/screens/` and 10 components under `src/screens/questionnaire/components/`

This aligns with the token migration pattern from recent main commits (e.g. `35ad6e2d1 design(tokens): migrate Goal*...fontWeight to tokens (#1324)`). Find the token source first (`src/theme/typography.ts` or equivalent — verify at execution time), then replace raw `fontWeight: '600'` / `'700'` usages.

**Only change** files that use raw string/numeric fontWeight. Do not touch spacing, color, or other concerns — minimal scope.

### Part 3 — Verification

Run in order, halt on first failure:

```bash
# Type-check
npx tsc --noEmit

# Lint the touched module only (avoid repo-wide churn)
npx eslint src/screens/questionnaire src/components/auth/AuthGate.tsx

# Max-lines check (files must be ≤100 lines)
npm run lint:max-lines -- src/screens/questionnaire

# Build (Metro / Expo)
npx expo start --clear  # smoke — can cancel once bundler starts clean
```

**Device QA checklist (post-PR, TestFlight):**

1. Fresh install → lands on `WelcomeStep` (step 1/13 progress bar)
2. Back button disabled on step 1, enabled 2–13
3. Close app mid-flow → reopen → resumes at same step (AsyncStorage `useQuestionnaireState`)
4. Sign in on step 12 → auto-jump to step 13 (paywall). This path uses `POST_AUTH_STEP = 13` + `jumpedRef` in `QuestionnaireFlow.tsx`
5. Skip paywall → lands in main app with the 3 picked habits auto-imported (verify via `useTemplateAutoImport`)
6. Kill app after onboarding complete → reopens to main app (not questionnaire)
7. Sign out → returns to `WelcomeScreen` (not back into questionnaire — behaviour per `getScreenKey`)
8. Notification priming (step 11): "Not now" path does not trigger iOS system dialog; "Enable" path triggers one-shot permission
9. Share button on `PlanPreviewStep` opens native share sheet with 3-habit summary

### Part 4 — PR

```bash
git push -u origin questionnaire-onboarding
gh pr create --base main --title "feat(onboarding): questionnaire flow replacing carousel"
```

PR body should include: before/after screenshot pair, the 13-screen flow list, and a call-out that testimonials are aspirational placeholders approved for launch.

---

## Critical files modified (summary)

| # | File | Changes |
|---|------|---------|
| 1 | `src/screens/questionnaire/data/testimonials.ts` | Rewrite 3 quotes; add placeholder-disclaimer header |
| 2 | `src/screens/questionnaire/screens/PlanPreviewStep.tsx` | Fix empty-state title |
| 3 | `src/screens/questionnaire/screens/*.tsx` (13 files) | Raw fontWeight → tokens (only where found) |
| 4 | `src/screens/questionnaire/components/*.tsx` (10 files) | Raw fontWeight → tokens (only where found) |

Files **not** modified (intentional, already correct):

- `src/components/auth/AuthGate.tsx` — routing already correct on the branch
- `src/screens/questionnaire/QuestionnaireFlow.tsx` — orchestration already correct
- `src/screens/questionnaire/useQuestionnaireState.ts` — AsyncStorage resume logic already correct
- `src/screens/questionnaire/useTemplateAutoImport.ts` — auto-import hook already correct
- `RevenueCatPaywall` reuse — already correct

---

## Existing utilities being reused (from memory + inspection)

- `safeStorage*` helpers (AsyncStorage wrappers) — used by `useQuestionnaireState`
- `useOAuthSignIn` + `SocialSignInButton` — used by `AccountCreationStep`
- `RevenueCatPaywall` — used by `PaywallStep`
- `api.templates.list` + `api.templates.importTemplate` — Convex queries in `AppDemoStep` and `useTemplateAutoImport`
- `ScreenErrorBoundary` — wraps `QuestionnaireFlow`
- `BrandedLoadingScreen` — hydration fallback
- `useThemeColors` — theming across all step screens

---

## Out of scope (deliberately)

- Analytics wiring (memory says this is a separate effort)
- Real testimonials scraped from the App Store (PR uses aspirational-but-approved copy)
- Rebuilding any screen from scratch — the existing implementation substantially matches the skill framework; no "rip and replace"
- Screen 7 Comparison Table — optional archetype, intentionally skipped in the blueprint
- Adding a device-preview mockup to WelcomeStep — optional archetype detail; current style uses bullets which is a valid variant
