# Onboarding Questionnaire — Status Check & Next Step

## Context

You invoked `/app-onboarding-questionnaire` in this workspace (branch now renamed to `onboarding-flow-v2`, previously `calgary-v4`). Before planning any new work, I checked memory and current git state because the skill's first step is **RECALL**.

**What memory says (2026-04-22 snapshot):**
- 13-screen questionnaire was designed, implemented, and pushed in **PR #1327** on branch `onboarding-land`.
- Blueprint confirmed: Welcome → Goal → Pain Points → Social Proof → Pain Amplification (tinder) → Personalized Solution → Categories → Processing → App Demo → Plan Preview → Notification Priming → Account Creation → Paywall.
- Architecture: `src/screens/questionnaire/` (~28 files ≤100 SLOC), `useQuestionnaireState` with AsyncStorage resume, RevenueCatPaywall reused, template auto-import via `api.templates.importTemplate`, OAuth via existing `useOAuthSignIn`.
- **Remaining gate: device QA on TestFlight.**

**What current git state confirms:**
- `gh pr view 1327` → **OPEN**, mergeable, last updated 2026-04-22, base `main`, head `onboarding-land`. No reviews, not draft.
- `onboarding-land` has 5 questionnaire commits ahead of main — all present, matches memory.
- **This branch (`onboarding-flow-v2`) has NO questionnaire code.** It contains unrelated recent work: habit-detail scrollspy, ranks tiles, templates calm animations, chain material tiers, goal section theming.
- `src/screens/onboarding/` on this branch is still the old 3-screen carousel (the one the questionnaire was meant to replace).
- Several stale onboarding branches exist locally and on remote (`onboarding-improvements`, `onboarding-v2`, `onboarding-flow`, `onboarding-questionnaire`, `questionnaire-onboarding`, `feat/onboarding-ab-test`, etc.) — noise to be ignored unless you say otherwise.

**Why this matters for planning:** The skill assumes we're either starting fresh or resuming mid-draft. Neither applies — the implementation is done and awaiting QA on a different branch. Charging into Phase 1 (App Discovery) would duplicate work; charging into Phase 5 (Implementation) on this branch would fork it. I need to know your actual intent first.

## Possible intents (to disambiguate with you)

1. **Device QA the existing PR** — check out `onboarding-land`, run the TestFlight QA checklist from memory (fresh install, mid-flow resume, sign-in-jump-to-paywall, auto-import, sign-out behaviour, notification priming one-shot, share sheet), fix blockers, merge.
2. **Iterate the design before merge** — change copy, reorder screens, tweak the demo, update testimonials on `onboarding-land`, push to the existing PR.
3. **Fresh design pass in this workspace** — ignore the existing PR and redesign from scratch here (only makes sense if you're deliberately exploring an alternative and want to compare).
4. **Wrong workspace** — you meant to invoke this in a different Conductor workspace, or on a different branch. Nothing to do here.

## Plan (to be refined once you confirm intent)

Will be filled in after you answer the clarifying question below. For each intent the shape differs significantly:

- Intent 1 → Checkout branch, write QA checklist, execute device tests, log findings, fix any.
- Intent 2 → Resume skill at Phase 3 (Blueprint) or Phase 4 (Copy) on `onboarding-land`, present current copy/screens, iterate, push to PR.
- Intent 3 → Proceed through Phases 1–5 of the skill fresh on this branch.
- Intent 4 → Stop and point you at the right workspace/branch.

## Files & branches of note (read-only reference)

- PR: https://github.com/Andres9888/habit_tracking_app/pull/1327
- Questionnaire code lives on branch `onboarding-land` at `src/screens/questionnaire/`
- Old carousel (still on this branch): `src/screens/onboarding/OnboardingScreen.tsx`
- Memory: `~/.claude/projects/-Users-andres-Code-habit-tracking-app/memory/project_onboarding_questionnaire.md`

## Verification (once plan is executed)

Depends on chosen intent — will add specific steps after you pick.
