# Plan: Comprehensive UX Design Review — ChainDay

## Context

Two prior audits exist but cover only part of the app:
- **ULTRATHINKING_UI_AUDIT.md** — Home screen content gaps (hidden behavioral data fields, static momentum meter)
- **DESIGN_CONSISTENCY_AUDIT.md** — Design token violations (1,688 hardcoded hex, 80+ rogue font sizes, ~530 inline shadows)

**Neither audit covers:** Auth/onboarding, habit detail, habit edit, analytics, character, templates, settings, create modal, or the premium/monetization journey end-to-end. This review fills those gaps and produces a unified, prioritized action plan.

## Deliverable

A single comprehensive review document at `docs/UX_DESIGN_REVIEW.md` covering every screen/flow with:
- Per-screen 8-dimension scoring (IA, Flow, Visual, Interaction, A11y, States, Copy, Monetization)
- Specific findings tagged P0–P3
- Cross-cutting themes
- Prioritized action plan
- Quick wins list

## Approach

Read source files for each unaudited screen, evaluate across 8 UX dimensions, and produce findings. No code changes — review only.

### Phase 1: Auth & Onboarding (never audited)

**WelcomeScreen** — Read and evaluate:
- `src/screens/auth/WelcomeScreen.tsx` + `WelcomeScreen.styles.ts`
- `src/screens/auth/hooks/useOAuthSignIn.ts`, `useWelcomeAnimations.ts`
- `src/screens/auth/components/SocialSignInButton/`, `ValueProps/`, `AuthError/`, `SuccessOverlay/`, `LegalFooter/`

Focus: First-impression clarity, OAuth button order/sizing/loading/error states, value prop copy, dark mode, a11y

**OnboardingScreen** — Read and evaluate:
- `src/screens/onboarding/OnboardingScreen.tsx` + styles + data + handlers + status
- `src/screens/onboarding/DotIndicators.tsx`, `ChainVisualization.tsx`, `StrengthMeter.tsx`, `TemplateGrid.tsx`

Focus: Slide content quality, skip button, CTA progression, swipe navigation, does it explain key concepts (chains, strength)?

### Phase 2: Core Screens (shallow or no prior coverage)

**HabitDetailScreen** — Read and evaluate:
- `src/screens/HabitDetailScreen/HabitDetailScreen.tsx` + types + constants + state hook + calendar handlers
- Components: `DetailHero.tsx`, `HabitDetailContent.tsx`, `DetailViewTabs.tsx`, `QuickStatsRow.tsx`, `YearHeatmapSection.tsx`, `HabitDetailModals.tsx`, `UndoToasts.tsx`

Focus: Tab UX (Progress/Motivation/Manage), calendar interaction model, hero content gaps (no why/identity/strength), modal dismissal, undo mechanism, a11y roles on tabs

**HabitEditScreen** — Read and evaluate:
- `src/screens/HabitEditScreen/` — all files (HabitEditScreen.tsx, useHabitEditScreen.ts, EditHeader.tsx, NameInputSection.tsx, CustomizeSection.tsx, DangerZone.tsx, HabitEditSkeleton.tsx)

Focus: Unsaved changes protection (M5 still open), DangerZone confirmation flow, form completeness (missing why/identity editing), keyboard handling, save feedback

**AnalyticsScreen** — Read and evaluate:
- `src/screens/AnalyticsScreen/` — all files (main + hooks + components)

Focus: Dead-end `handleHabitPress` (P0 still open), premium gating UX (paywall on open vs. preview), export flow lock icon, individual chart empty states, no time period selection, chart a11y

**CharacterScreen** — Read and evaluate:
- `src/screens/CharacterScreen/` — all files

Focus: Real data integration (was mock, now fixed), gamification loop clarity, attribute meanings, thin achievement set (only 3), hardcoded colors, empty state with 0 habits

**TemplatesScreen** — Read and evaluate:
- `src/screens/TemplatesScreen/` — all files (views + hooks + components + data)

Focus: 4-view navigation complexity (browse/search/drill/see-all), import→home flow, search empty state, premium packs presentation, UsageBanner monetization, category UX

### Phase 3: Modals & Sheets

**CreateHabitModal** — Read and evaluate:
- `src/components/CreateHabitModal/` — all files

Focus: Unsaved changes on swipe-dismiss, live preview existence, form validation messaging, quick picks UX, premium teaser placement, emoji picker perf, color picker a11y

**SettingsModal** — Read and evaluate:
- `src/components/SettingsModal/` — all files

Focus: PremiumStatus misleading copy (P0), section organization, missing settings (dark mode toggle?), delete account flow, hardcoded version string, local color file

### Phase 4: Cross-Cutting

**Premium/Monetization Journey** — Read:
- `src/components/PremiumPaywall/`, `src/hooks/usePremium/`, `LockedHabitCard.tsx`, `PremiumPackCard.tsx`, `TrialCountdownBanner.tsx`, `PremiumStatus.tsx`

Focus: Map all premium touchpoints, consistency of lock/premium visuals, free→paid friction, value preview for free users, paywall variant consistency

**Error/Loading/Empty States** — Cross-screen spot check:
- Verify skeleton loaders match content layout per screen
- Verify ErrorBoundary wraps every screen
- Verify offline banners appear appropriately
- Verify empty states are actionable

**Navigation & IA** — Evaluate:
- Modal-based navigation model (no React Navigation)
- Screen transition consistency
- Can user always navigate back? Dead ends?

## Execution Order

1. Phase 1 (Auth + Onboarding) — first screens users see
2. Phase 2: AnalyticsScreen — most confirmed open P0s
3. Phase 2: HabitDetailScreen + HabitEditScreen — primary interaction screens
4. Phase 2: CharacterScreen — gamification assessment
5. Phase 2: TemplatesScreen — complex multi-view flow
6. Phase 3 (CreateHabit + Settings modals)
7. Phase 4 (Cross-cutting consolidation)
8. Write final `docs/UX_DESIGN_REVIEW.md`

## Output Format

```
# Comprehensive UX Review — ChainDay v1

## Scorecard
| Screen | IA | Flow | Visual | Interaction | A11y | States | Copy | Monetization | Overall |

## Findings by Screen
### [Screen Name]
| ID | Finding | Severity | Dimension | Recommendation |

## Cross-Cutting Themes
Issues appearing across 3+ screens

## Prioritized Action Plan
### P0 (This Sprint) / P1 (Next Sprint) / P2 (Backlog) / P3 (Polish)

## Quick Wins (< 1 hour each)
```

## Verification

- Every screen listed in navigation has a corresponding review section
- All open findings from prior audits (UX-AUDIT-03 tracker) are verified as fixed/still-open
- Scoring is evidence-based (file:line citations)
- No findings without specific file references
