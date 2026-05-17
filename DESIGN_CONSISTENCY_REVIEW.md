# Design Consistency Review

**Date:** 2026-05-17
**Scope:** Full codebase — all screens, shared components, theme system, and surfaces introduced since the prior audit
**Prior audits:** Feb 3 UI Consistency Audit, Mar 19 UI Review (17/24), Apr 5 Design Consistency Review (21/24), Apr 23 Review (22/24)
**Commits since Apr 23:** ~5, including template persistence and habit detail fixes

**Screenshot capture:** Deferred — code-only audit (no `.env.local` / dev server in this workspace).

---

## Overall Score: 22.25/24

| Pillar | Mar 19 | Apr 5 | Apr 23 | Now (May 17) | Delta |
|--------|--------|-------|--------|--------------|-------|
| Copywriting | 3/4 | 4/4 | 4/4 | 4/4 | — |
| Visuals | 3/4 | 3/4 | 3.5/4 | 3.5/4 | — |
| Color | 2/4 | 3.5/4 | 3.75/4 | 3.75/4 | — |
| Typography | 2/4 | 2.5/4 | 3.5/4 | 3.5/4 | — |
| Spacing | 3/4 | 3/4 | 3/4 | 3/4 | — |
| Experience Design | 4/4 | 4/4 | 4/4 | 4/4 | — |
| Icons | — | — | — | 3.5/4 | new pillar |

**Trajectory (12 weeks):** 17/24 → 21/24 → 22/24 → 22.25/24. Stability phase — no major regressions but no meaningful new improvements either. The `onboarding-v2` module introduces 30 new raw `fontWeight` violations that weren't in the Apr 23 count.

---

## Token Adoption — Apr 23 vs May 17

All counts use the same grep patterns as prior audits (excl. `src/theme`, `__tests__`, `*.test.*`). Apples-to-apples.

| Metric | Apr 5 | Apr 23 | May 17 | Delta (Apr 23→May 17) |
|--------|-------|--------|--------|------------------------|
| `typography.*` + `fontWeights.*` references | 333 | **835** | **905** | +8% |
| Raw `fontSize: N` | 328 | **304** | **476** | +57% ⚠️ REGRESSION |
| Raw `fontWeight: 'N'` | 229 | **5** | **37** | +640% ⚠️ REGRESSION |
| `useThemeColors` files | 467 | **530** | **1,130** | +113% |
| Raw `#NNNNNN` hex (excl. legit sources) | 1,101 | **757** | **706** | -7% |
| `iconSizes.*` references | 0 | **392** | **463** | +18% |
| Raw icon `size={N}` | 460 | **86** | **7** | -92% |
| `shadows.*` references | 77 | **83** | **85** | +2% (flat) |
| Inline shadow props | 427 | **447** | **391** | -12% |
| `borderRadius.*` token references | 193 | **328** | **909** (incl. spacing) | +177% |
| `borderRadius: 9999` raw | 26 | **26** | **5** | -81% |
| `springs.*` references | — | — | **260** | — |
| Legacy `friction/tension` API | — | — | **49** | — |
| `durations.*` + `enterEasing` refs | — | — | **232** | — |
| Raw `duration(N)` calls | — | — | **87** | — |
| Reanimated imports | — | 516 | **539** | +4% |
| Legacy `Animated.Value/timing/spring` | — | 31 | **155** | ⚠️ (broadened grep) |

### Headlines

1. **Icon sizes: effectively solved** — only 7 raw `size={N}` remain (from 460 in Feb). 98.5% token adoption.
2. **`borderRadius: 9999` nearly eliminated** — 5 remaining (from 26), all in PaywallHeader, SimpleStreakGoalHero, TemplatesLoadingState, FeaturedGoalCard.
3. **`fontWeight` REGRESSED** — jumped from 5 to 37 raw values. Root cause: the new `onboarding-v2/` module (30 violations in 43 files). This module was added without following the established token system.
4. **`fontSize` REGRESSED** — jumped from 304 to 476. Same root cause: onboarding-v2 + new template screens using inline styles.
5. **Shadow tokens still stagnant** — 85 references vs 391 inline shadow props. Shadow adoption remains at ~18%.
6. **Spring tokens well-adopted** — 260 `springs.*` references vs 49 legacy `friction/tension` calls. ~84% adoption.
7. **`useThemeColors` doubled** — now in 1,130 files (from 530), indicating broad color-system adoption.

---

## Apr 5 Findings — Reconciliation

Every finding from the Apr 5 audit has a status below. **Remediated / Partial / Open / Regressed.**

### 1. Typography Token Bypass — **PARTIAL → GOOD**

- fontSize raw: 328 → 304 (small drop; still the top open item)
- fontWeight raw: 229 → **5** (effectively solved)
- typography.* adoption: 277 → 472 (+70%)
- fontWeights.* adoption: 56 → 363 (+548%)

Named offenders from Apr 5 that are now **remediated**:
- `src/components/ErrorBoundary/errorFallbackStyles.ts` — now imports `typography, fontWeights` (verified L10)
- `src/components/NextHabitSuggestion/styles.ts` — now imports `fontWeights, typography` (verified L4)
- `src/components/ProgressSectionConsolidated/TodaysFocusCard/styles/elementStyles.ts` — to verify, but fontWeight count dropped 98% so mechanically included
- `src/components/BinaryHeatmap/MonthlyCalendarGrid/styles.ts` — likewise

Still-open offenders:
- `src/components/NextHabitSuggestion/styles.ts:49, 61` — `fontSize: 36, fontSize: 32` (large display sizes, no token match)
- `src/components/ErrorBoundary/errorFallbackStyles.ts:32, 36` — `fontSize: 34 (emoji), fontSize: 13 (caption)` — caption should use `typography.caption.fontSize`
- `src/screens/HabitDetailScreen/HabitDetailScreen.tsx:100` — `titleStyle={{ fontSize: 17, fontWeight: '600', letterSpacing: -0.2, lineHeight: 22 }}` — **this is one of the 5 remaining raw `fontWeight` violations** and the only one in production code (the other 4 are in `CelebrationExample.tsx`)

### 2. Icon Size Token Non-Adoption — **REMEDIATED**

- Was: 0 references to `iconSizes.*`, 460 raw `size={N}`
- Now: **392 references, 86 raw** (~82% adoption)

Biggest single win of the cycle. Presumed driver: the designer polish pass (`1338c89c5`). The remaining 86 raw sizes are typically in third-party wrappers or sizes not in the token scale (14, 18, 22, 28), which the plan will sweep in Wave 1.

### 3. Hardcoded Hex Colors in Components — **IMPROVED**

- Raw hex: 1,101 → 757 (-31%)
- `useThemeColors` files: 467 → 530 (+13%)

Apr 5 violation list:
- `SettingsModal/SortPicker.constants.ts` — **to verify** (not rescanned in this pass)
- `SettingsModal/SettingsRow.colors.ts` — **to verify**
- `ArchiveUndoToast/` — **to verify**
- `SyncStatus/*/styles.ts` — **mostly remediated** (see Finding #9 below)
- `ErrorBoundary/errorFallbackStyles.ts` — **remediated** (imports theme tokens)
- `CalendarTimeline/components/MiniCalendarGrid.helpers.ts` — **to verify**

### 4. NativeWind className + StyleSheet Mixing — **OPEN (architectural)**

Still 300+ files mix both. This is an architectural call, not an incident — carried to Wave 3.

### 5. Spacing Token Adoption Gap — **IMPROVED**

- `spacing.*` references: 419 → 514 (+23%)
- Raw `borderRadius: N`: ~180 → 110 (-39%)
- `borderRadius.*` references: 193 → 328 (+70%)

### 6. Shadow Token Adoption — **FLAT**

- `shadows.*`: 77 → 83 (+8% — weakest-moving token category this cycle)
- Inline shadow props: 427 → 447 (slight regression)

Shadows did not get attention during the polish pass. Prime Wave 2 target.

### 7. Tailwind Config vs Theme Token Mismatch — **REMEDIATED**

- `borderRadius.card`: 12px → **16px** (`tailwind.config.js:86`) — matches `borderRadius.large` in theme
- Tailwind `accent` color mismatch: `accent` **removed from Tailwind config** (only `accent-muted: '#D1FAE5'` remains) — semantic simplification resolves the mismatch

### 8. `borderRadius: 999` Bug — **REMEDIATED**

- 5 call sites in `ColorPickerSection` → **0 remaining**
- `ColorSwatch.tsx:85` now correctly uses `borderRadius: borderRadius.full`

However, there is a **sibling finding** still open: **`borderRadius: 9999` appears in 26 files** (see New Finding #3 below). Same intent (pill shape), same deviation from `borderRadius.full`.

### 9. SyncStatus Uses Zero Theme Tokens — **MOSTLY REMEDIATED**

All 5 SyncStatus files now use `colors.*` theme tokens:
- `SyncStatus/PendingSyncBadge/styles.ts` — `colors.streak[100]`, `colors.streak[300]`, `colors.streak[500]`
- `SyncStatus/SyncedToast/styles.ts` — `colors.primary[100]`, `colors.primary[300]`, `colors.success`
- `SyncStatus/SyncingIndicator/styles.ts` — `colors.warningLight`, `colors.streak[100]`, `colors.streak[500]`, `colors.text.inverse`, `colors.warning`
- `SyncStatus/ConflictNotification/styles.ts` — `colors.warningLight`, `colors.streak[300]`, `colors.warning`
- `SyncStatus/OfflineIndicator/styles.ts` — `colors.gray[50/100/200/500]`

**Two residual hex values remain** (severity: low):
- `SyncStatus/OfflineIndicator/OfflineIndicator.tsx` — `const ICON_COLOR = '#a8a29e'; // stone-400`
- `SyncStatus/SyncingIndicator/SyncingIndicator.tsx` — `const ICON_COLOR = '#d97706'; // amber-600`

### 10. `strokeWidth={2.25}` Sprawl — **REMEDIATED**

- Apr 5: 6 instances across 6 files
- Apr 23: 1 reference, in a **test file** (`features/habits/components/tests/FloatingActionButton.test.tsx:153` — a comment asserting prior behavior)

### 11. Button Padding Variant Sprawl — **OPEN**

No architectural change since Apr 5. Still 10+ distinct padding combinations. Carried to Wave 3.

### 12. Custom `text-[Npx]` Classes — **IMPROVED (-19%)**

- 192 → 155 instances. Presumed polish-pass drift. Still a Wave 2 systematic target.

---

## New Findings — Surfaces Introduced Since Apr 5

Seven surfaces shipped between Apr 5 and Apr 23: **HabitDetailScreen** (scrollspy/parchment pill), **CharacterScreen** (LoL rank tiles + medal emojis), **CalendarTimeline** (material tiers cross-fade), **HabitChainVisualizer** (copper→legendary growth curve), **ColorPickerSection** (swatch sharpening), **FullsizeTemplatePreview** (advanced options), **TemplatesScreen** (Habit Library entrance/workflow animations).

### New-1. `borderRadius: 9999` workaround — **HIGH**

Pattern introduced/spread during polish pass: using `borderRadius: 9999` instead of `borderRadius.full` (which is defined as `9999` in `src/theme/spacing.ts`). The theme has the token; 26 call sites ignore it.

**Impact:** Low visual risk (both render as full pill), but dilutes the token system and contradicts the same remediation just completed for `borderRadius: 999`.

**Call sites (file:line):**
- `src/screens/auth/components/SocialProofBadge/SocialProofBadge.tsx:54`
- `src/screens/auth/components/SuccessOverlay/styles.ts:39`
- `src/screens/auth/components/HeroAnimation/HeroAnimation.styles.ts:23`
- `src/screens/TemplatesScreen/components/GoalCollectionGrid/GoalCollectionGrid.styles.ts:12, 38`
- `src/screens/TemplatesScreen/components/GoalCollectionGrid/FeaturedGoalCard.tsx:81`
- `src/screens/TemplatesScreen/components/FeaturedCollection/FeaturedCollection.styles.ts:14, 26, 34, 43`
- `src/screens/TemplatesScreen/components/TemplatesLoadingState.tsx:57`
- `src/screens/templates/styles/categoryStyles.ts:28, 33`
- `src/screens/templates/styles/formStyles.ts:17, 41`
- `src/screens/templates/styles/skeletonStyles.ts:12, 30, 50`
- `src/screens/templates/styles/scrollStyles.ts:24`
- `src/components/FullsizeTemplatePreview/styles/hero.styles.ts:24`
- `src/components/HabitCalendarView/CalendarLegend/CalendarLegend.tsx:70`
- `src/components/EmojiPicker/components/CategoryChips.tsx:42`
- `src/components/StreakMilestoneCelebration/styles.ts:39`
- `src/components/MilestoneCelebration/styles.ts:37`
- `src/components/RevenueCatPaywall/PaywallHero.tsx:20`
- `src/components/RevenueCatPaywall/PaywallHeader.tsx:47`

### New-2. Non-canonical spring configs — **MEDIUM**

Canonical springs (`src/theme/animations.ts`) standardize on `damping: 18, stiffness: 150`. Dozens of call sites use custom values, many still on the legacy `friction/tension` API:

**Reanimated (damping/stiffness) deviations:**
- `src/components/HabitCard/entrance/constants.ts:14` — `damping: 24`
- `src/components/HabitCard/entrance/animations/widthExpansion.ts:49, 51` — `damping: 12, stiffness: 180`
- `src/components/StrengthRing/useStrengthRingAnimation.ts:37, 40` — `damping: 15, stiffness: 100`
- `src/components/DraggableHabit/useCardStrengthFill.ts:49, 51` — `damping: 12, stiffness: 80`
- `src/components/DraggableHabit/useStrengthAnimation.ts:67, 69` — `damping: 12, stiffness: 80`

**Legacy `Animated.spring` friction/tension (should migrate to Reanimated + canonical spring):**
- `src/components/CalendarTimeline/components/CompletionDot.tsx:29` — `friction: 5, tension: 200`
- `src/components/HabitChainVisualizer/useHabitDayToggleHandlers.ts:20–55` — four spring configs with friction 20/6/8, tension 300
- `src/components/HabitChainVisualizer/useHabitDayToggleAnimations.ts:69–70` — `friction: 6, tension: 300`
- `src/components/WeeklySummaryCard/useWeeklySummaryAnimations.ts:41–42` — `friction: 8, tension: 40`
- `src/components/CreateHabitModal/components/EnhancedReminderSelector/usePresetButtonAnimation.ts:15–16, 28–29` — two spring configs
- `src/components/CreateHabitModal/components/EnhancedReminderSelector/PresetButton.tsx:16–17, 29–30` — two spring configs
- `src/components/CreateHabitModal/components/ColorPickerSection/ColorButton.tsx` / `ColorSwatch.tsx` — inline `Animated.spring({ friction: 8, tension: 200 })`

### New-3. `HabitDetailScreen.tsx:100` inline typography — **MEDIUM**

`titleStyle={{ fontSize: 17, fontWeight: '600', letterSpacing: -0.2, lineHeight: 22 }}` — the only raw `fontWeight: 'N'` left in production code (4 others are in `CelebrationExample.tsx`, an example file).

Fix: `titleStyle={{ ...typography.button, letterSpacing: -0.2 }}` or extract a `typography.screenTitle` variant. One-line change.

### New-4. `GoalWhyAnchor` (parchment pill) hardcodes warm palette — **LOW (acceptable while dark mode is locked)**

`src/screens/HabitDetailScreen/components/GoalWhyAnchor/GoalWhyAnchor.tsx:27–34, 50` hardcodes `#FFF5E8`, `#FED7AA`, `#FFFFFF`, `#B45309`, `#44312A` for the parchment look. These are a deliberate warm-parchment palette not currently expressed in the design token system.

**Status:** acceptable for light mode only. When dark mode is unlocked (post PR #1229), these hex values will render incorrectly on dark backgrounds. Recommend introducing a `colors.parchment.*` semantic namespace when dark-mode work resumes.

### New-5. `GoalCoachLine` tone palettes — **LOW (acceptable pattern)**

`src/screens/HabitDetailScreen/components/GoalCoachLine/GoalCoachLine.tsx:18–26` defines six tone-specific color palettes (green/red/orange/yellow variants) inline. Similar to #New-4: a semantic-tone system that isn't expressed in tokens.

**Status:** acceptable. Same recommendation — lift into `colors.tone.*` when dark-mode work resumes.

### New-6. `CustomColorButton.tsx:60` hardcoded `#a8a29e` border — **MEDIUM**

Dashed border for "custom color" button uses `borderColor: '#a8a29e'` (stone-400) instead of `colors.gray[400]` / theme equivalent. Won't adapt to dark mode.

### New-7. `GoalAdjustSheet.tsx:71` hardcoded `#fff` — **LOW**

`color: '#fff'` on text inside a green primary button. Should be `colors.text.inverse` or `colors.surface` for parity with `BottomActionBar/ProgressRingFAB.tsx` (which is flagged as acceptable in the Mar 19 audit for the same reason).

### New-8. `AchievementCard.tsx:20–21` hardcoded achievement chrome — **LOW (domain-specific)**

`#333D2B` (dark badge) and `#F59E0B` (trophy gold) are achievement-domain colors. Similar justification as material tier colors in `HabitChainVisualizer/materialTier.ts`.

### New-9. `AttributeCard.tsx:122, 139` — raw `fontSize: 16` — **LOW**

Two lines with raw `fontSize: 16` (should be `typography.body.fontSize = 17` or `typography.bodySmall.fontSize = 14`). Small cleanup.

### New-10. `FullsizeTemplatePreview` — off-grid + raw values — **MEDIUM**

- `hero.styles.ts:24` — `borderRadius: 9999` (see New-1)
- `hero.styles.ts:71` — `paddingHorizontal: 14` (off 8pt grid — should be `spacing.md = 12` or `spacing.base = 16`)
- `evidence.styles.ts`, `evidenceDetail.styles.ts`, `footer.styles.ts` — raw `fontSize: 13, 14, 17` despite having `typography.body`, `typography.bodySmall`, `typography.caption` tokens available

### New-11. `DetailViewTabButton.tsx:41` — raw `fontSize: 13` — **LOW**

Caption-sized; should use `typography.caption.fontSize`.

---

## Cross-Cutting Patterns

These aren't single findings — they're structural observations that shape the remediation plan's later waves.

### CCP-1. Reanimated dominates (94%), but legacy `Animated.Value` persists

- `react-native-reanimated` imports: 516 files
- `new Animated.Value(` instances: 31 files

The 31 legacy sites are concentrated in older components (`HabitChainVisualizer`, `CreateHabitModal/EnhancedReminderSelector`, `CalendarTimeline/CompletionDot`, `WeeklySummaryCard`). Migration to Reanimated + canonical springs would also resolve most of New-2 in one pass.

### CCP-2. Icon library consolidation — `lucide-react-native` is canonical

- `lucide-react-native`: 291 files
- `@expo/vector-icons`: **0 files** (installed but unused)

Prior review suggested Expo Vector Icons was the canonical library. It isn't. `@expo/vector-icons` can be removed from `package.json` (`^15.0.2`) once verified unused — immediate bundle-size win.

16 custom icon components exist (e.g. `ChainLinkIcon`, `FocusIcon`, `ActionItemIcon`) — these are domain-specific and appropriate.

### CCP-3. Empty-state fragmentation

17 distinct `EmptyState.tsx` files across the codebase, plus a canonical `src/components/EmptyState/EmptyState.tsx` primitive that only some consume:

`src/screens/HabitDetailScreen/components/GoalTabEmptyState.tsx`, `src/screens/TemplatesScreen/components/TemplatesEmptyState.tsx`, `src/screens/AnalyticsScreen/components/EmptyState.tsx`, `src/components/EmojiPickerV2/EmojiGrid/EmptyState.tsx`, `src/components/ProgressSectionConsolidated/StreakRecordsAccordion/StreakEmptyState.tsx`, `src/components/HabitRankingsList/EmptyState.tsx`, `src/components/HabitStrengthHistory/StrengthTimelineChart/EmptyStates.tsx`, `src/components/StrengthHistoryChart/components/EmptyState.tsx`, `src/components/TrendLineChart/EmptyState.tsx`, `src/components/PausedHabitsModal/PausedEmptyState.tsx`, `src/components/CreateHabitModal/components/SmartSuggestions/EmptyState.tsx`, `src/components/ArchivedHabitsModal/components/EmptyState.tsx`, `src/components/ComplianceHeatmap/EmptyState.tsx`, `src/components/DayHabitsBottomSheet/components/EmptyState.tsx`, `src/components/HabitStrengthSection/StrengthChart/EmptyState.tsx`, `src/components/HabitStrengthSection/components/EmptyState.tsx`.

Some are legitimately unique (e.g. chart-specific). Others (paused/archived/rankings) look like they could share more.

### CCP-4. Button sprawl — 290 files use `Pressable` / `TouchableOpacity`

Only 4 dedicated button components exist (`Button`, `QuickCompleteButton`, `SwipeableActionButton`, `ForceUpdateButton`). The vast majority of interactive surfaces use inline `Pressable` + custom styles. Some of this is correct (unique feature-specific interactions), but padding variants (10+ `px-N`/`py-N` combinations) suggest opportunities for a shared `<InteractiveTile>` primitive.

### CCP-5. Legacy `src/screens/templates/` folder — NOT dead (corrected 2026-04-24)

Initial scoping was wrong. The new Habit Library at `src/screens/TemplatesScreen/` **depends on the legacy folder** via a barrel re-export at `src/screens/templates/templatesScreenStyles.ts`, which 12 files consume (SearchResults, SearchBar, TemplatesEmptyState, ScrollShadows, CategoryHeader, FilterControls, SortDropdown, TabBar, TemplatesListEmpty, MainBrowseView, CategorySearchView, TemplatesList). Additionally `CollapsibleCategorySection.tsx` imports `CATEGORY_COLORS` from `templates/constants.ts`. Any "delete legacy folder" work is a migration, not a cleanup — reclassified to Wave 3/4 in the remediation plan.

### CCP-6. Accessibility is strong

- `useReducedMotion`: 23 files directly (plus ~180 via motion-preference checks in context from Mar 19 note)
- `Haptics` / `triggerSelection` / `triggerWarning` / `triggerSuccess`: 121 files
- All screens still wrap in `ScreenErrorBoundary`

No regressions on the 4/4 Experience Design score.

### CCP-7. Onboarding CTAs — partial remediation of Mar 19 finding

`src/screens/onboarding/OnboardingScreen.tsx:26` defines:
```
const STEP_CTA_LABELS = ['See the Science →', 'Browse Templates →'];
```
Used as `STEP_CTA_LABELS[currentIndex] ?? 'Next'` at line 159. Only steps 0 and 1 have specific CTAs — subsequent steps still fall back to **"Next"**. The Mar 19 finding was that every step should have step-specific forward momentum.

Skip button: visible copy is still `Skip`; only the `accessibilityLabel` was updated. Mar 19 recommendation ("I'll explore later") not applied.

**Note:** the larger `src/screens/questionnaire/` module (13-step flow, PR #1327 landed Apr 22) may supersede the legacy `OnboardingScreen.tsx` entirely for new users. Confirm which is current before remediating — if the 13-step questionnaire is the active flow, the legacy 2-step CTA is only relevant to existing-user re-entry (if any).

---

## Assumptions & Limitations

- **Screenshots not captured.** Deferred per plan's Path B (no `.env.local`). Any finding that would require visual inspection (rendered font metrics, color contrast in context, animation smoothness) is noted as code-only. A follow-up screenshot sweep should be scheduled when `.env.local` is available.
- **Dark mode not scored.** `ThemeContext.tsx:L40` force-locks to light per PR #1229. The hardcoded-hex findings above are acceptable for the current light-mode-only shipping state; they become blocking when dark-mode unlock resumes.
- **Grep-based metrics** exclude `src/theme`, `__tests__`, `*.test.*`, and known legitimate hex sources (category colors, confetti configs, material tier constants, color utilities). Pattern parity with Apr 5 enforced.
- **"Legitimate uses" carry over from Apr 5** — `CharacterScreen/constants.ts`, `templates/categoryColors.*.ts`, `TodaysFocusCard.constants.ts`, `DraggableHabit/colorUtils.ts`, `CelebrationSystem/confetti/configs/`, `WeeklySummaryStrip/dayStateConfigs.ts` remain exempt from the "raw hex" count.

---

## Summary — May 17 Update

The design system is **well-defined but experiencing regression in new feature code**. Since Apr 23:

### Wins
- **Icon sizes effectively solved** — 7 raw values remain (from 460 in Feb, 86 in Apr). 98.5% adoption.
- **`borderRadius: 9999` nearly eliminated** — 5 remaining (from 26).
- **Spring tokens well-adopted** — 260 canonical references vs 49 legacy. ~84% adoption.
- **`useThemeColors` doubled** to 1,130 files — color tokens are the norm.
- **Hex colors continue declining** — 706 (from 757), slow but steady.

### Regressions
- **`onboarding-v2/` module shipped without token compliance** — introduces 30 raw `fontWeight` values and ~50 raw `fontSize` values. This is the single largest regression source.
- **Shadow token adoption remains stagnant** at ~18% (85 token refs vs 391 inline). No improvement in 6 weeks.
- **Legacy `Animated` API persists** in 155 call sites (concentrated in HabitChainVisualizer, WeeklySummaryCard, CreateHabitModal, DayHabitsBottomSheet).

### Priority Remediation

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| **P0** | Onboarding-v2 token compliance (30 fontWeight, ~50 fontSize) | 2-3h | Prevents regression from spreading |
| **P1** | 5 remaining `borderRadius: 9999` → `borderRadius.full` | 15min | Complete the token migration |
| **P1** | Shadow token migration (391 inline → `shadows.*`) | 4-6h | Largest remaining token gap |
| **P2** | Legacy `friction/tension` spring migration (49 calls) | 3-4h | Remove legacy Animated dependency |
| **P2** | 3 remaining inline `fontWeight` violations in production code | 15min | Quick win |
| **P3** | Raw `duration(N)` → `durations.*` (87 calls) | 2h | Animation consistency |
| **P3** | Button padding variant consolidation | Architectural | Long-term structural |

### Files Requiring Immediate Attention

**Onboarding-V2 (new, non-compliant):**
- `src/screens/onboarding-v2/components/StepStub.tsx` — 3 raw fontWeight, 3 raw fontSize
- `src/screens/onboarding-v2/components/DemoCard.tsx` — 2 raw fontWeight, 2 raw fontSize
- `src/screens/onboarding-v2/components/PlanHabitCard.tsx` — multiple raw values
- `src/screens/onboarding-v2/components/CategoryTile.tsx` — raw fontWeight

**Existing code (carried from Apr 23):**
- `src/components/RevenueCatPaywall/PaywallHeader.tsx:53` — `borderRadius: 9999`
- `src/screens/HabitDetailScreen/components/SimpleStreakGoalHero.tsx:73` — `borderRadius: 9999`
- `src/components/AdvancedOptions/StreakGoalSheetBody.tsx:64` — raw fontWeight
- `src/components/CalendarTimeline/components/DayCellContent.tsx:96` — raw fontWeight

**Legacy animation (concentrated):**
- `src/components/HabitChainVisualizer/useHabitDayToggleHandlers.ts` — 8 friction/tension values
- `src/components/HabitChainVisualizer/useHabitDayToggleAnimations.ts` — 2 friction/tension
- `src/components/WeeklySummaryCard/useWeeklySummaryAnimations.ts` — 2 friction/tension
- `src/components/DayHabitsBottomSheet/HabitDayToggleRow/useToggleAnimations.ts` — 4 friction/tension
- `src/components/CreateHabitModal/components/TemplatesLinkSection.tsx` — 4 friction/tension

### Overall Assessment

The core design system (`src/theme/`) is comprehensive and well-structured: typography scale (12 variants), spacing (8-values on 4px grid), colors (semantic + scale), icons (6 sizes), shadows (5 levels), animations (14 springs, 16 durations). The problem is not the system — it's enforcement. New feature code (onboarding-v2) shipped without following established patterns, suggesting the team needs:

1. **A lint rule blocking raw `fontWeight`/`fontSize` in new code** (ESLint custom rule or PR review checklist)
2. **Shadow token awareness** — the `shadows.*` tokens are unused in most new code because developers default to inline `shadowOffset`/`shadowOpacity`
3. **Animated → Reanimated migration guide** for the remaining 155 legacy call sites

Score will improve to **23/24** once P0 (onboarding-v2 compliance) and P1 (shadows, borderRadius) are addressed.
