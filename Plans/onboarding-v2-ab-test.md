# A/B test plan — Questionnaire vs Benefit-driven onboarding

## Context

The Jordan Morgan video (Z0b4RN84uwc) prescribes benefit-driven flows for habit trackers ("a habit tracker doesn't just track your habits, it makes you better every single day. So that's what you sell on this onboarding flow."). Our current 17-step onboarding-v2 is a questionnaire-flow hybrid with benefit-driven hooks (5 of 17 screens). To find out which converts better for ChainDay specifically, we'll build a benefit-driven variant alongside the current one and route users 50/50.

## Variants

### Variant A — Questionnaire (current 17 steps)
Already shipped. Welcome → Problem → Solution Intro → Name → Goal → Pain Points → Social Proof → Solution → Category → Processing → App Demo → Plan Preview → First Check-In → Celebration → Notifications → Account → Paywall (hard).

### Variant B — Benefit-driven (~13 steps, proposed)
1. Welcome
2. Problem
3. Solution Intro
4. **Strength Holds** (NEW) — *"You won't quit on day 42 again."* + strength bar visualization
5. **Material Growth** (NEW) — *"You'll watch it become real."* + copper/iron/gold tier cells
6. **Three-Habit Focus** (NEW) — *"You'll finish what you started."* + 3 active + 2 locked slots
7. **Milestones** (NEW) — *"Day 60 won't feel like a slog."* + tier timeline
8. Social Proof (Seinfeld)
9. Name
10. Pick 3 Habits (replaces App Demo+Category+Processing — direct curated picker)
11. Plan Preview
12. First Check-In
13. Celebration
14. Notifications
15. Account
16. Paywall (soft — "Continue with 3 habits free")

**Cut from B:** Goal (5), Pain Points (6), Pain Amp (already cut), Solution mapping (8), Category (9), Processing (10).

## Implementation order — 5 commits

### Commit 1 — Variant infrastructure
- New hook: `useOnboardingVariant()` returns `'questionnaire' | 'benefitDriven'`
- Random 50/50 assignment on first launch, persisted to AsyncStorage
- Dev-only override via env or storage debug key
- Console log on assignment for visibility
- Add `OnboardingVariant` type, storage key constant
- ~80 LOC across 1 new hook file + storage keys + types

### Commit 2 — Variant-aware sequence
- `types.ts`: add 4 new StepIds (`strengthHolds`, `materialGrowth`, `threeHabits`, `milestones`)
- New `STEP_SEQUENCE_BENEFIT` const exported alongside existing `STEP_SEQUENCE`
- `useOnboardingV2State` reads variant, returns the matching sequence
- `OnboardingFlowV2` picks sequence based on variant
- 4 stub step components (just headlines, no content yet) registered in `stepRegistry`
- ~120 LOC across 5-6 files

### Commit 3 — Build the 4 benefit-driven step components
- `StrengthHoldsStep.tsx` — outcome headline + strength bar visual + mechanic sub
- `MaterialGrowthStep.tsx` — outcome headline + 3 tier cells + mechanic sub
- `ThreeHabitsStep.tsx` — outcome headline + 3 active + 2 locked focus visual
- `MilestonesStep.tsx` — outcome headline + 3-dot tier timeline + mechanic sub
- Each step ≤90 LOC. Reuses HeroHeader, PrimaryCTA, DayTag where applicable.
- ~350 LOC across 4 new files

### Commit 4 — Direct habit picker (replaces App Demo + Category + Processing for variant B)
- `PickHabitsStep.tsx` — show 6-8 curated templates as a list, tap up to 3 to select, Continue when 3 selected
- Bypasses the category questionnaire + processing spinner + per-card swipe
- Falls back to `useDemoTemplates` for the template fetch
- Variant-A flow keeps the existing 3-step App Demo unchanged
- ~120 LOC

### Commit 5 — Soft paywall variant + analytics events
- `PaywallStep.tsx` accepts a `variant` prop, or branches on `useOnboardingVariant()`
  - Variant A: hard paywall (current)
  - Variant B: soft — adds "Continue with 3 habits free" link
- `AuthGate` accepts soft-dismiss path: signed-in user with onboarding done routes to HabitsApp regardless of subscription status
- Analytics console.log helper that emits:
  - `[onboarding] variant=X step_entered=Y at=Z`
  - `[onboarding] variant=X completed=true paywall_action=trial|free|skip`
- Real analytics integration (Mixpanel/Sentry) is a separate workstream
- ~150 LOC across PaywallStep + AuthGate + new analytics helper

## What we're not building in this scope

- Real analytics platform (Mixpanel, Amplitude, PostHog) — console.log only
- Server-side variant assignment (still 50/50 client-side)
- Paywall A/B beyond hard vs soft — same pricing tiers in both
- Variant override UI for QA/testing — dev-only env override
- Free habit cap enforcement (commit 3 in soft-paywall plan) — defer
- Tier cap at iron for free users (commit 4 in soft-paywall plan) — defer

## Verification

After each commit:
1. `node_modules/.bin/tsc -p tsconfig.app.json -noEmit` — zero new errors in onboarding-v2
2. All new files ≤100 LOC (per project convention)
3. Manual test on simulator (when NativeEventEmitter bug is resolved): force variant via dev override, walk through both flows end-to-end, confirm paywall behavior matches variant

## Open questions for Andres

1. **Analytics destination** — console.log for now is fine for dev visibility. Where do you want real events to go eventually? Mixpanel? PostHog? Sentry breadcrumbs?
2. **Variant assignment timing** — first onboarding launch (current plan) or first app open (would require gating before AuthGate routing)?
3. **Override mechanism** — env var, AsyncStorage key set via console, or a hidden settings toggle?
4. **Pick-3 habit picker (commit 4) UX** — do we show 6 curated templates (1 row) or 12 (2 rows)? Tap to select, Continue when 3 reached?
5. **Paywall pricing parity** — same tiers in both variants ($29.99/yr + $4.99/mo + 7-day trial), correct?

## Risks

- **5 commits is a lot.** Each is independently revertable but the variant infrastructure (commit 1) is load-bearing for everything else. If commit 1 has a bug, the whole experiment is broken.
- **No real analytics = soft signal.** We'll see console logs in dev but can't measure real conversion until analytics ship. Treat this as a UX comparison framework, not a true A/B test, until analytics integration lands.
- **More surface area for bugs.** Doubling the step components doubles the chance of regression. Keep step components small and shared.
- **NativeEventEmitter bug still open.** Variant B uses Reanimated entries (animated chain growth, etc.) — same bug surface as current Welcome. Plan to ship benefit screens without animation until the underlying issue is resolved.
