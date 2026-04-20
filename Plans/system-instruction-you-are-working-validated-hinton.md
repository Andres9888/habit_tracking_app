# Pre-Auth Questionnaire Onboarding (Noom/Mob-Style)

## Context

Chain Day's current onboarding is a 3-page carousel that runs **after** sign-in. It's effectively dead: `useOnboardingStatus` auto-completes it for every new user (`src/screens/onboarding/useOnboardingStatus.ts:24-35`), so new users skip straight to an empty habits list with zero engagement. Retention at the critical "first session" moment is poor.

This plan replaces that flow with a **13-screen questionnaire-style onboarding** that runs **before sign-in**. The user identifies a goal, surfaces pain points, sees proof, configures preferences, does a functional demo (swipe to pick 3 habit templates), then is asked to sign up and pay. By the time the paywall appears, the user has invested ~3 minutes and holds a personalized plan they built — the paywall feels earned, not ambushed.

Blueprint was confirmed on 2026-04-15 and stored in `memory/project_onboarding_questionnaire.md`. Templates are already public-queryable (SEC-PUBLIC), so the demo works pre-auth without schema changes.

## Blueprint (13 Screens)

| # | Screen | Archetype | Headline (draft) | Storage Key |
|---|---|---|---|---|
| 1 | Welcome | Hook | "Build habits that actually stick." | — |
| 2 | Goal | Single-select | "What do you want to change?" | `goal` |
| 3 | Pain Points | Multi-select | "What's gotten in the way before?" | `painPoints[]` |
| 4 | Social Proof | Testimonials | "You're not alone." | — |
| 5 | Pain Amplification | Tinder cards | "Which of these sound like you?" | `relatable[]` |
| 6 | Personalized Solution | Bridge | "Here's how Chain Day fixes this." | — |
| 7 | Category Preferences | Grid multi-select | "What areas do you want to focus on?" | `categories[]` |
| 8 | Processing | Loader | "Building your plan…" | — |
| 9 | App Demo | Tinder swipe templates | "Swipe right on habits you want." | `selectedTemplateIds[]` |
| 10 | Plan Preview | Viral moment | "Your 3-habit starter plan" | — |
| 11 | Notification Priming | Permission pre-sell | "Never miss check-ins for {habit 1, 2, 3}" | `notifPermission` |
| 12 | Account Creation | OAuth gate | "Save your plan" | — |
| 13 | Paywall | RevenueCat | "Start your 7-day free trial" | — |

Screens 1-11 are pre-auth. Screen 12 triggers Clerk OAuth (Apple/Google) via the existing `useOAuthSignIn()` hook. Screen 13 is the existing `RevenueCatPaywall` wrapped with a skip-to-app option.

**Ordering decision:** Memory blueprint originally placed Notification Priming at step 8 (pre-demo). Moved to step 11 (post-Plan Preview) so the priming copy can name the user's actual 3 selected habits — context-grounded priming converts materially higher than abstract priming.

## Integration with Current Code

### AuthGate restructure
`src/components/auth/AuthGate.tsx` currently routes:
- `!isSignedIn` → `WelcomeScreen`
- `isSignedIn && !onboardingComplete` → `OnboardingScreen`
- `isSignedIn && onboardingComplete` → `HabitsApp`

New routing:
- `!isSignedIn && !questionnaireComplete` → `QuestionnaireFlow` (steps 1-12)
- `!isSignedIn && questionnaireComplete` → `WelcomeScreen` (returning user who bailed)
- `isSignedIn && pendingTemplates` → silent template import + `PaywallScreen` (step 13)
- `isSignedIn && questionnaireComplete` → `HabitsApp`

### Old carousel
Leave `src/screens/onboarding/*` in place but delete the `OnboardingScreen` render branch from `AuthGate.tsx` — the hook auto-completes it anyway, so this is a no-op for existing users. Deletion of the carousel files is deferred to a follow-up cleanup PR to keep this change reviewable.

### Template auto-import
After OAuth success, `AuthGate` reads `@chainday_questionnaire_selected_templates` and calls `api.templates.importTemplate` (existing, `convex/templates/importTemplate.ts:18`) once per template. Runs silently; if free tier limit of 3 is hit, that's fine — user picked 3.

## File Structure

```
src/screens/questionnaire/
├── QuestionnaireFlow.tsx                # Top-level stepper, owns current step
├── QuestionnaireFlow.types.ts           # Answers shape, step enum
├── useQuestionnaireState.ts             # AsyncStorage persistence + resume
├── questionnaire.storageKeys.ts         # @chainday_questionnaire_* keys
├── components/
│   ├── QuestionnaireProgress.tsx        # Top progress bar (shared)
│   ├── QuestionnaireScreenFrame.tsx     # Standard layout (header, content, CTA)
│   ├── PrimaryCTA.tsx                   # Styled button matching existing patterns
│   ├── OptionRow.tsx                    # Single-select / multi-select row
│   ├── SwipeCard.tsx                    # Reusable Tinder card (gesture-handler)
│   └── useSwipeCardGesture.ts           # Swipe logic hook
├── screens/
│   ├── WelcomeStep.tsx                  # Step 1 — hook
│   ├── GoalStep.tsx                     # Step 2
│   ├── PainPointsStep.tsx               # Step 3
│   ├── SocialProofStep.tsx              # Step 4
│   ├── PainAmplificationStep.tsx        # Step 5 — tinder cards
│   ├── SolutionStep.tsx                 # Step 6
│   ├── CategoryPreferencesStep.tsx      # Step 7
│   ├── ProcessingStep.tsx               # Step 8
│   ├── AppDemoStep.tsx                  # Step 9 — tinder templates
│   ├── PlanPreviewStep.tsx              # Step 10
│   ├── NotificationPrimingStep.tsx      # Step 11 — names selected habits
│   ├── AccountCreationStep.tsx          # Step 12 — wraps useOAuthSignIn
│   └── PaywallStep.tsx                  # Step 13 — wraps RevenueCatPaywall
└── data/
    ├── goals.ts                         # Goal options w/ emoji
    ├── painPoints.ts                    # Pain point options
    ├── testimonials.ts                  # Placeholder testimonials (marked TODO)
    ├── painStatements.ts                # Tinder card copy
    ├── solutions.ts                     # Pain → solution mapping
    └── categories.ts                    # Category preferences
```

## Persistence

Keys (all prefixed `@chainday_questionnaire_`):
- `step` — last completed step number, enables resume
- `answers` — JSON blob `{ goal, painPoints, relatable, categories, notifPermission }`
- `selected_template_ids` — array of Convex `Id<'templates'>` (used by auto-import after auth)
- `complete` — boolean, set true after paywall dismissed/purchased

All via existing `safeGetString/safeSetString/safeGetBoolean/safeSetBoolean` from `src/utils/storage/safeStorageCore.ts`. No new storage library.

## Reused Existing Code

- `useOAuthSignIn` — `src/screens/auth/hooks/useOAuthSignIn.ts` (Apple + Google)
- `SocialSignInButton` — `src/screens/auth/components/SocialSignInButton.tsx`
- `RevenueCatPaywall` — `src/components/RevenueCatPaywall/RevenueCatPaywall.tsx`
- `api.templates.list` — `convex/templates/queries.ts:17` (SEC-PUBLIC, no auth)
- `api.templates.importTemplate` — `convex/templates/importTemplate.ts:18`
- `ensureNotificationPermissions` — `src/utils/notifications/permissions.ts:40`
- `safeStorageCore` helpers — `src/utils/storage/safeStorageCore.ts`
- `useThemeColors`, `ScreenErrorBoundary`, existing animation vocabulary (FadeIn/FadeInUp + springify)
- `GestureDetector` + `useSharedValue` patterns from `useSwipeDismiss` — `src/components/CreateHabitModal/hooks/useSwipeDismiss.ts`
- `GoalCard` visual pattern — `src/screens/TemplatesScreen/components/GoalCollectionGrid/GoalCard.tsx` (for category grid)

## Implementation Order

Break into 4 focused commits to keep diffs reviewable:

**Commit 1 — Scaffold + routing.** Add `QuestionnaireFlow.tsx` with a stubbed 13-step switch, `useQuestionnaireState`, storage keys, `QuestionnaireScreenFrame`, `QuestionnaireProgress`. Rewire `AuthGate.tsx` with new routing. Each step renders a placeholder "Step N" view that advances on CTA. Verifies the state machine end-to-end before any content work.

**Commit 2 — Static steps (1, 2, 3, 4, 6, 7, 10, 11).** Implement welcome, goal, pain points, social proof, solution, categories, plan preview, notification priming. Use existing button/text primitives. Draft copy from blueprint; no swipe gestures yet. Plan preview can render with placeholder data until commit 3 wires the real template selection.

**Commit 3 — Interactive steps (5, 9) + processing (8).** Build `SwipeCard` + gesture hook. Wire pain amplification cards (Step 5) and the real template demo (Step 9) using `api.templates.list`. Processing step (8) is a 1.5s animated loader. After commit 3, Plan Preview (10) and Notification Priming (11) receive real selected-habit data.

**Commit 4 — Account creation (12) + paywall (13) + auto-import.** Step 12 wraps OAuth. Handle OAuth success → read stored `selected_template_ids` → batch-import via `importTemplate`. Step 13 wraps `RevenueCatPaywall` with "Maybe later" dismiss. On dismiss, mark `complete` + `onboardingComplete` (old key) and transition to `HabitsApp`.

## Key Design Decisions

1. **Resume behavior** — if user backgrounds the app mid-flow, `useQuestionnaireState` restores to their last completed step on next launch. No step is lost.
2. **Back navigation** — every step (except Processing, Account Creation's OAuth callback) has a back button. Answers persist; going back edits the existing answer.
3. **Template demo data source** — `api.templates.list` returns all templates. Filter client-side by `category ∈ answers.categories` (from Step 7), then sort by `popularityScore` desc. Show 8-12 cards.
4. **Viral moment on Step 11** — preview shows the 3 selected templates as a stacked card deck with a "Share plan" button (Share API). Share copy: "I'm starting 3 habits with Chain Day — [habit names]. Join me: [App Store link]".
5. **Paywall skip** — if user dismisses paywall, they still land in `HabitsApp` with their 3 selected habits auto-imported. Premium features remain gated by existing RevenueCat logic.
6. **Accessibility** — every step includes `accessibilityLabel` + `accessibilityRole`, respects `useReducedMotion` for all animations, swipe cards have tap-based alternatives (✓ / ✗ buttons).

## Verification

- Fresh install on iOS sim → QuestionnaireFlow launches, all 13 steps navigable forward + back.
- Kill app mid-flow → relaunch → resumes at last completed step with answers intact.
- Complete questionnaire → OAuth (Apple test account) → verify 3 templates appear in `HabitsApp` via `api.habits.listActive`.
- Decline notification prompt at Step 8 → continue normally; verify `safeGetBoolean('@chainday_questionnaire_answers')` reflects `notifPermission: 'denied'`.
- Dismiss paywall → lands in `HabitsApp` → reopen app → goes straight to `HabitsApp` (no questionnaire re-run).
- Decline OAuth at Step 12 → error displayed, stay on Step 12 (answers not lost).
- Reset state via dev menu → questionnaire restarts from Step 1.
- Run `npm run lint:max-lines` — all new files ≤100 LOC.
- Manual RTL + dark mode pass on every step.

## Files Modified (Summary)

- **New**: ~25 files under `src/screens/questionnaire/` (see File Structure)
- **Modified**: `src/components/auth/AuthGate.tsx` (routing rewrite)
- **Unchanged**: Convex schema, all existing habits/templates logic, paywall component, WelcomeScreen (now fallback)

## Out of Scope

- A/B testing infrastructure for copy variants (future)
- Real testimonials (current plan uses placeholder content marked TODO)
- Analytics events for funnel conversion (can be added inside each step's `onContinue` in a follow-up)
- Deleting the old `src/screens/onboarding/*` carousel (deferred cleanup)
- Paywall redesign — reusing existing `RevenueCatPaywall` as-is
