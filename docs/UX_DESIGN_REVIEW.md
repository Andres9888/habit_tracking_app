# Comprehensive UX Design Review — ChainDay v1

**Date:** 2026-04-01
**Reviewer:** Sally (UX Expert)
**Scope:** All screens, modals, and cross-cutting UX concerns
**Method:** Source code analysis across 8 UX dimensions per screen

> **Builds on (does not duplicate):**
> - `ULTRATHINKING_UI_AUDIT.md` — Home screen content gaps
> - `DESIGN_CONSISTENCY_AUDIT.md` — Design system token violations

---

## Executive Summary

ChainDay is a **sophisticated, psychology-informed habit tracker** with strong visual design foundations (warm stone palette, Literata/DM Sans typography, spring-based animations). The app excels at daily interaction quality — haptic feedback, staggered animations, and offline-first architecture are well-executed.

**Critical gaps** center on three themes:
1. **Premium monetization UX** — 4 paywall variants with inconsistent copy, no lock icons on gated content, aggressive shimmer animations
2. **Missing unsaved-changes protection** — Both CreateHabitModal and HabitEditScreen allow data loss on swipe-dismiss
3. **Hidden behavioral intelligence** — Backend computes `why`, `identity`, `strengthLevel`, `predictedCompletionProb` but the UI never surfaces them (documented in ULTRATHINKING_UI_AUDIT)

**Overall App Score: 7.4/10** — Strong bones, needs monetization consistency and a11y polish.

---

## Scorecard

| Screen | IA | Flow | Visual | Interaction | A11y | States | Copy | Monetization | **Avg** |
|--------|:--:|:----:|:------:|:-----------:|:----:|:------:|:----:|:----------:|:-------:|
| WelcomeScreen | 8 | 7 | 7 | 8 | 7 | 8 | 8 | — | **7.6** |
| OnboardingScreen | 7 | 8 | 8 | 8 | 8 | 8 | 7 | — | **7.7** |
| HabitDetailScreen | 9 | 8 | 9 | 9 | 8 | 7 | 8 | 8 | **8.3** |
| HabitEditScreen | 9 | 8 | 9 | 9 | 8 | 8 | 8 | 7 | **8.3** |
| AnalyticsScreen | 7 | 5 | 8 | 7 | 8 | 7 | 7 | 5 | **6.8** |
| CharacterScreen | 8 | 9 | 7 | 8 | 7 | 9 | 6 | 10 | **8.0** |
| TemplatesScreen | 7 | 6 | 8 | 7 | 6 | 7 | 7 | 5 | **6.6** |
| CreateHabitModal | 8 | 7 | 8 | 9 | 7 | 6 | 8 | 8 | **7.6** |
| SettingsModal | 9 | 8 | 7 | 9 | 8 | 8 | 7 | 8 | **8.0** |
| **Cross-Cutting** | | | | | | | | | |
| Premium Journey | — | — | — | — | — | — | — | 6 | **6.2** |
| Error/Loading/Empty | — | — | — | — | — | 7 | — | — | **7.1** |
| Navigation/IA | 7 | — | — | — | 7 | — | — | — | **6.8** |

---

## Findings by Screen

### WelcomeScreen

| ID | Finding | P | Dimension | File:Line |
|----|---------|---|-----------|-----------|
| W1 | Hardcoded colors in SuccessOverlay (#10b981, #ffffff, #1c1917) don't adapt to dark mode; white background invisible in dark mode | P1 | Visual | `SuccessOverlay/styles.ts:7,14,32,37,45` |
| W2 | SocialSignInButton Apple/Google colors always black/white regardless of theme | P1 | Visual | `SocialSignInButton.tsx:18-28` |
| W3 | ValueProps icon colors hardcoded (#D1FAE5, #059669) instead of theme tokens | P1 | Visual | `ValueProps.tsx:25-26` |
| W4 | HeroAnimation background hardcoded #f5f5f4 | P2 | Visual | `HeroAnimation.styles.ts:21` |
| W5 | AuthError shadow color hardcoded #1c1917 | P2 | Visual | `AuthError.tsx:22` |
| W6 | No haptic feedback on OAuth button press | P2 | Interaction | `useOAuthSignIn.ts` |
| W7 | LegalFooter text 12px — below 14px minimum; no minHeight touch target | P2 | A11y | `LegalFooter.tsx` |
| W8 | No visible back/exit path if user arrives accidentally | P1 | Flow | `WelcomeScreen.tsx` |
| W9 | No timeout state — OAuth flow can hang with spinner indefinitely | P2 | States | `useOAuthSignIn.ts` |

### OnboardingScreen

| ID | Finding | P | Dimension | File:Line |
|----|---------|---|-----------|-----------|
| O1 | TemplateGrid width hardcoded to 280px — not responsive on small screens | P1 | Visual | `onboarding.visuals.styles.ts:52` |
| O2 | useOnboardingStatus auto-completes for new users — carousel may never be shown | P1 | Flow | `useOnboardingStatus.ts:25-28` |
| O3 | No visible swipe affordance (dots only); arrow buttons would help less mobile-native users | P2 | Interaction | `OnboardingScreen.tsx` |
| O4 | Skip button text uses colors.text.secondary — lower contrast than needed | P2 | A11y | `OnboardingScreen.tsx:94` |
| O5 | DotIndicators don't announce progress verbally for screen readers | P2 | A11y | `DotIndicators.tsx` |
| O6 | No transition animation between slides — hard cut on swipe | P2 | Interaction | `OnboardingScreen.tsx` |
| O7 | "Science-backed" appears in both slide 2 and slide 3 copy — repetitive | P2 | Copy | `onboarding.data.ts` |

### HabitDetailScreen

| ID | Finding | P | Dimension | File:Line |
|----|---------|---|-----------|-----------|
| D1 | UndoToasts onDismiss triggers onConfirmArchive — dismissing toast = auto-confirming archive | P0 | Interaction | `UndoToasts.tsx:44` |
| D2 | YearHeatmapSection passes `currentStreak={0}` hardcoded instead of actual streak | P2 | States | `YearHeatmapSection.tsx:36` |
| D3 | QuickStatsRow emojis (🔥⭐📅) have no accessibilityLabel — invisible to AT users | P2 | A11y | `QuickStatsRow.tsx:77-79` |
| D4 | DetailViewTabs tablist has no accessibilityLabel | P2 | A11y | `DetailViewTabs.tsx:67` |
| D5 | No error state UI for calendar toggle failure — only Alert, no persistent indicator | P2 | States | `useCalendarHandlers.ts:85-87` |
| D6 | Date formatting hardcoded to "en-US" — should use device locale | P3 | Copy | `useCalendarHandlers.ts:70-74` |
| D7 | Hero section does not show `why`, `identity`, or `strengthLevel` fields | P1 | IA | `DetailHero.tsx` |

### HabitEditScreen

| ID | Finding | P | Dimension | File:Line |
|----|---------|---|-----------|-----------|
| E1 | No unsaved changes warning — user can swipe-dismiss or press Cancel, losing all edits | P0 | Flow | `HabitEditScreen.tsx:79` |
| E2 | Disabled button colors hardcoded ('#D6D3D1', '#78716C') — may fail WCAG contrast | P1 | Visual | `EditHeader.tsx:48-49` |
| E3 | Notification permission denial silently disables reminders without telling user | P1 | States | `useHabitSaveHandler.tsx:67-70` |
| E4 | DangerZone confirmation buttons don't disable during API call — race condition possible | P1 | Interaction | `DangerZone.tsx:40-59` |
| E5 | Delete confirmation says "permanently deleted" but doesn't specify count of completions lost | P2 | Copy | `useHabitActions.tsx:22` |
| E6 | Cannot edit `why`, `identity`, or frequency from edit screen — form incomplete | P2 | IA | `HabitEditScreen.tsx` |
| E7 | Character counter discrepancy — TextInput allows 50 chars but warning threshold at different value | P2 | Copy | `NameInputSection.tsx` |

### AnalyticsScreen

| ID | Finding | P | Dimension | File:Line |
|----|---------|---|-----------|-----------|
| A1 | handleHabitPress is dead-end TODO stub — tapping habit cards does nothing | P0 | Flow | `hooks/useAnalyticsActions.ts:59-61` |
| A2 | ExportButton visible to all users but triggers paywall on tap — no lock icon warning | P0 | Monetization | `hooks/useAnalyticsActions.ts:22-28`, `ExportButton.tsx` |
| A3 | Paywall shown by default on mount for free users (`useState(!isPremiumUser)`) — aggressive | P1 | Monetization | `hooks/useAnalyticsActions.ts:19` |
| A4 | No individual chart empty states — charts render with null data silently | P1 | States | `components/ChartSections.tsx:42-44` |
| A5 | No time period selection — all data is "30-Day Trend" only | P1 | IA | `AnalyticsScreen.tsx` |
| A6 | Weekly Insights archive button is stubbed `onArchivePress={() => { /* TODO */ }}` | P1 | Interaction | `components/InsightsSections.tsx:36-38` |
| A7 | No haptic feedback on habit card press (even when handler works) | P2 | Interaction | `hooks/useAnalyticsActions.ts` |

### CharacterScreen

| ID | Finding | P | Dimension | File:Line |
|----|---------|---|-----------|-----------|
| C1 | Hardcoded colors in AchievementCard (#333D2B, #FEF3C7, #F59E0B) break dark mode | P0 | Visual | `components/AchievementCard.tsx:19-20` |
| C2 | Title always "Habit Hero" regardless of level — no progression feeling | P0 | Copy | `characterData.helpers.ts:96` |
| C3 | Attribute meanings (Energy/Strength/Vitality/Wisdom) never explained — opaque formulas | P1 | A11y | `characterData.helpers.ts:27-33` |
| C4 | Only 3 achievement types exist — system feels thin after level 10 | P1 | Copy | `characterData.helpers.ts:36-42` |
| C5 | XP progression formula not shown to user — can't understand how to level up faster | P2 | Copy | `characterData.helpers.ts:88-90` |
| C6 | Trophy badge count shows number but no label ("3" with no "Achievements" context) | P3 | Copy | `CharacterCard.tsx:57-67` |

### TemplatesScreen

| ID | Finding | P | Dimension | File:Line |
|----|---------|---|-----------|-----------|
| T1 | After importing template, no navigation to home — user stays in browse view with no next action | P0 | Flow | `useTemplateImportHandlers.ts:39-68` |
| T2 | Paywall appears without context when free user hits limit — no "why" toast before paywall | P0 | Monetization | `useImportFeedback.ts:40-46` |
| T3 | disableGestureClose always true on preview modal — can't swipe to close | P1 | Interaction | `FullsizeTemplatePreview.tsx:70` |
| T4 | 4-view navigation (browse/search/drill/seeAll) has no breadcrumb — users lose position | P1 | IA | `useViewNavigation.ts:15-19` |
| T5 | UsageBanner (free tier limit indicator) may not be rendered in TemplatesScreen | P1 | Monetization | `MainBrowseView.tsx` |
| T6 | Pack import flow: onComplete callback never wired — no count feedback after batch import | P1 | Flow | `usePackConfirm.ts:28-44` |
| T7 | Missing live region for search results count — screen readers don't know results updated | P1 | A11y | `TemplatesList.tsx:68-90` |
| T8 | UsageBanner hardcodes `colors.light.surfaceMuted` — doesn't respect dark theme | P1 | Visual | `UsageBanner.tsx:55` |
| T9 | Empty search state copy too generic — "Try adjusting filters" with no examples | P2 | Copy | `TemplatesListEmpty.tsx:23` |
| T10 | View transition uses setTimeout(280ms) — race condition if user taps back rapidly | P2 | Interaction | `useViewNavigation.ts:32-39` |

### CreateHabitModal

| ID | Finding | P | Dimension | File:Line |
|----|---------|---|-----------|-----------|
| CM1 | No unsaved changes protection — swipe-to-dismiss loses all form state without warning | P0 | Flow | `CreateHabitModalCentered.tsx:36-38`, `useSwipeDismiss.ts:51-58` |
| CM2 | Swipe-to-close doesn't reset form — reopening shows previous data | P0 | States | `CreateHabitModalCentered.tsx:47-52` |
| CM3 | Character counter 40/50 discrepancy — MAX_LENGTH vs MAX_CHARS confusing | P1 | Copy | `HabitNameField.constants.ts:6` |
| CM4 | Color swatch lacks visible keyboard focus ring | P2 | A11y | `ColorSwatch.tsx:96-105` |
| CM5 | HabitPreview empty border hardcoded #e7e5e4 — not dark mode aware | P2 | Visual | `HabitPreview.tsx:40` |
| CM6 | Reminder permission denial only shows Alert then silently disables | P2 | States | `useCreateHabitModal.ts:47-50` |

### SettingsModal

| ID | Finding | P | Dimension | File:Line |
|----|---------|---|-----------|-----------|
| S1 | AccountSection avatar color hardcoded #7c3aed — breaks dark mode | P0 | Visual | `sections/AccountSection.tsx:34` |
| S2 | Version string hardcoded '1.0.0' / buildNumber '1' — not dynamic | P0 | States | `SettingsContent.tsx:227` |
| S3 | PremiumStatus says "All features unlocked" — inaccurate (free tier has core features) | P1 | Copy | `sections/PremiumStatus.tsx:113` |
| S4 | SettingsRow.colors.ts uses hardcoded #facc15 for high-contrast instead of theme | P1 | Visual | `SettingsRow.colors.ts:18-27` |
| S5 | Delete account requires only two taps — no email re-entry or secondary confirmation | P1 | Flow | `sections/DeleteAccountButton.tsx:20-33` |
| S6 | Archived habits badge count lacks accessible description | P2 | A11y | `SettingsRow.tsx:158-169` |
| S7 | Sign out uses native Alert instead of app's custom modal design language | P2 | Interaction | `useAccountActions.ts:15-29` |
| S8 | No haptics toggle in Behavior section despite haptics used throughout | P3 | IA | `SettingsContent.tsx` |

---

## Cross-Cutting Themes

### Theme 1: Inconsistent Premium Monetization (6+ locations)

Four paywall variants with different copy, gradients, and social proof:
- **UpgradePrompt:** "$0 for 7 days · Cancel anytime"
- **BenefitsCTAFooter:** "7-day free trial • Cancel anytime" + "$6.99/month"
- **MonetizationHero:** "Try free for 7 days" (no price shown)
- **PremiumStatus (Settings):** "Unlock sounds, reminders & more" + shimmer animation

No lock icons on gated content (Templates premium packs, Analytics export, Analytics screen itself). User discovers paywall through friction, not foresight.

**Files:** `UpgradePrompt.tsx`, `BenefitsCTAFooter.tsx`, `MonetizationHero.tsx`, `PremiumStatus.tsx`, `variants.ts`

### Theme 2: Missing Unsaved Changes Protection (3 locations)

- **CreateHabitModal** — swipe-to-dismiss discards form without warning
- **HabitEditScreen** — Cancel/swipe discards changes without warning
- **TemplatesScreen customize flow** — closing customize modal discards selections

**Files:** `useSwipeDismiss.ts`, `HabitEditScreen.tsx:79`, `useTemplateImportHandlers.ts`

### Theme 3: Hardcoded Colors Breaking Dark Mode (10+ locations)

Despite a well-designed theme system, many components bypass it:
- `SuccessOverlay/styles.ts` — white bg, hardcoded green/black
- `AccountSection.tsx:34` — hardcoded purple avatar
- `AchievementCard.tsx:19-20` — hardcoded badge colors
- `UsageBanner.tsx:55` — hardcoded light surface
- `HabitPreview.tsx:40` — hardcoded border
- `EditHeader.tsx:48-49` — hardcoded disabled state
- `PremiumPackCard.tsx:61-62` — hardcoded white text
- `HeroAnimation.styles.ts:21` — hardcoded background
- Auth screens: 15+ hardcoded colors in `SignInScreen.tsx`, `WelcomeScreen.styles.ts`

### Theme 4: Accessibility Gaps in Interactive Elements (5+ locations)

- QuickStatsRow emojis have no alt text (`QuickStatsRow.tsx:77`)
- DetailViewTabs tablist has no label (`DetailViewTabs.tsx:67`)
- TemplatesList search results have no live region (`TemplatesList.tsx:68`)
- Color swatches lack keyboard focus ring (`ColorSwatch.tsx:96`)
- BottomActionBar Settings button has dual actions (tap + long-press) on one element (`BottomActionBar.tsx:53`)
- Archived habits badge lacks description (`SettingsRow.tsx:158`)

### Theme 5: Dead-End / Stubbed Interactions (3+ locations)

- `handleHabitPress` TODO stub in Analytics (`useAnalyticsActions.ts:59`)
- `onArchivePress` TODO stub in Insights (`InsightsSections.tsx:36`)
- `onComplete` not wired for pack imports (`usePackConfirm.ts`)

---

## Prioritized Action Plan

### P0 — This Sprint (8 issues)

| ID | Issue | Screen | Est. |
|----|-------|--------|------|
| D1 | UndoToasts onDismiss confirms archive instead of canceling | HabitDetail | 5 min |
| E1 | No unsaved changes warning on edit dismiss/cancel | HabitEdit | 30 min |
| CM1 | No unsaved changes warning on create dismiss | CreateHabit | 20 min |
| CM2 | Form not reset on swipe-close; stale data on reopen | CreateHabit | 10 min |
| A1 | handleHabitPress dead-end in Analytics | Analytics | 30 min |
| A2 | Export button visible to free users with no lock icon | Analytics | 5 min |
| C1 | AchievementCard hardcoded colors break dark mode | Character | 5 min |
| S1 | AccountSection avatar hardcoded #7c3aed | Settings | 5 min |

### P1 — Next Sprint (20 issues)

| ID | Issue | Screen | Est. |
|----|-------|--------|------|
| T1 | No navigation to home after template import | Templates | 15 min |
| T2 | Paywall appears without context message | Templates | 5 min |
| T3 | disableGestureClose always true on preview | Templates | 5 min |
| T4 | No breadcrumb in 4-view navigation | Templates | 30 min |
| T5 | UsageBanner possibly not rendered | Templates | 10 min |
| T6 | Pack import onComplete not wired | Templates | 15 min |
| T7 | Search results no live region for a11y | Templates | 5 min |
| T8 | UsageBanner hardcodes light surface color | Templates | 2 min |
| A3 | Paywall shown on mount, not on action | Analytics | 2 min |
| A4 | Chart empty states missing | Analytics | 15 min |
| A5 | No time period selection | Analytics | 2h |
| A6 | Insights archive button stubbed | Analytics | 30 min |
| C2 | Title always "Habit Hero" regardless of level | Character | 10 min |
| C3 | Attribute meanings never explained | Character | 20 min |
| C4 | Only 3 achievement types — thin system | Character | 45 min |
| S3 | PremiumStatus "All features unlocked" inaccurate | Settings | 5 min |
| S5 | Delete account only 2 taps, no re-entry | Settings | 30 min |
| E2 | Disabled button hardcoded colors | HabitEdit | 5 min |
| E3 | Silent reminder permission disable | HabitEdit | 10 min |
| W1-W3 | SuccessOverlay + ValueProps + SignIn hardcoded colors | Welcome | 15 min |

### P2 — Backlog (25+ issues)

Key items: Auth dark mode gaps, onboarding swipe affordance, QuickStatsRow a11y, YearHeatmap hardcoded streak, search empty state copy, view transition race condition, color swatch focus ring, character XP explanation, sign out native Alert, offline state duplication.

### P3 — Polish (5 issues)

Detail hero icon color documentation, date locale, character badge label, SectionLabel background tint, haptics toggle in settings.

---

## Quick Wins (< 15 minutes each)

| Fix | File | Time |
|-----|------|------|
| Fix UndoToasts onDismiss semantics | `UndoToasts.tsx:44` | 5 min |
| Replace AchievementCard hardcoded colors with theme tokens | `AchievementCard.tsx:19-20` | 5 min |
| Replace AccountSection avatar #7c3aed with theme color | `AccountSection.tsx:34` | 5 min |
| Add lock icon to Analytics ExportButton for free users | `ExportButton.tsx` | 5 min |
| Fix Analytics paywall default: `useState(false)` not `!isPremiumUser` | `useAnalyticsActions.ts:19` | 2 min |
| Fix PremiumStatus copy: "Premium features unlocked" | `PremiumStatus.tsx:113` | 5 min |
| Add accessibilityLabel to DetailViewTabs tablist | `DetailViewTabs.tsx:67` | 2 min |
| Fix YearHeatmapSection: pass actual streak not 0 | `YearHeatmapSection.tsx:36` | 3 min |
| Replace SuccessOverlay hardcoded colors with theme tokens | `SuccessOverlay/styles.ts` | 5 min |
| Add toast before paywall on template import limit | `useImportFeedback.ts:42` | 5 min |
| Fix UsageBanner bg to theme-aware `colors.card` | `UsageBanner.tsx:55` | 2 min |
| Add accessibilityLiveRegion to TemplatesList results | `TemplatesList.tsx:68` | 3 min |
| Fix HabitPreview empty border for dark mode | `HabitPreview.tsx:40` | 3 min |
| Fix EditHeader disabled button colors to theme tokens | `EditHeader.tsx:48-49` | 5 min |
| Add dynamic character titles by level | `characterData.helpers.ts:96` | 10 min |

**Total: ~75 minutes for 15 fixes addressing 5 P0s + 6 P1s + 4 P2s**

---

## Methodology Notes

**Dimensions scored 1-10:**
1. **Information Architecture** — Content hierarchy, grouping, labels, discoverability
2. **User Flow** — Entry/exit paths, friction points, dead ends, task completion clarity
3. **Visual Design** — Theme token compliance, spacing, layout, dark mode
4. **Interaction Design** — Gesture model, feedback loops, animations, haptics
5. **Accessibility** — Roles, labels, focus management, contrast, reduced motion
6. **State Handling** — Empty, loading, error, offline, edge-case states
7. **Content/Copy** — Clarity, tone, motivation, consistency
8. **Monetization UX** — Premium gating clarity, upgrade friction, value communication

**Severity levels:**
- **P0** — Breaks core UX or causes data loss; fix this sprint
- **P1** — Degrades experience quality; fix next sprint
- **P2** — Minor friction or polish; backlog
- **P3** — Nice-to-have improvements
