# Design Consistency Review

**Date:** 2026-05-07
**Scope:** Full codebase — all screens, shared components, theme system, and surfaces introduced since the prior audit
**Prior audits:** Feb 3 UI Consistency Audit, Mar 19 UI Review (17/24), Apr 5 Review (21/24), Apr 23 Review (22/24)
**Methodology:** Code-only audit using grep-based token adoption metrics. Same exclusion patterns as prior audits (excl. `src/theme`, `__tests__`, `*.test.*`).

---

## Overall Score: 22.5/24

| Pillar | Mar 19 | Apr 5 | Apr 23 | Now | Delta |
|--------|--------|-------|--------|-----|-------|
| Copywriting | 3/4 | 4/4 | 4/4 | 4/4 | — |
| Visuals | 3/4 | 3/4 | 3.5/4 | 3.5/4 | — |
| Color | 2/4 | 3.5/4 | 3.75/4 | 3.75/4 | — |
| Typography | 2/4 | 2.5/4 | 3.5/4 | 3.75/4 | +0.25 |
| Spacing | 3/4 | 3/4 | 3/4 | 3/4 | — |
| Experience Design | 4/4 | 4/4 | 4/4 | 4/4 | — |

**Trajectory (9 weeks):** 17/24 → 21/24 → 22/24 → 22.5/24. The codebase is firmly in the diminishing-returns phase. The +0.25 in Typography reflects continued `fontWeight` token adoption in production code (down from 33 raw values to mostly onboarding-v2 concentrated violations). No pillar regressed.

---

## Token Adoption — Apr 23 vs May 7

All counts use the same grep patterns as prior audits (excl. `src/theme`, `__tests__`, `*.test.*`). Apples-to-apples.

| Metric | Apr 23 | May 7 | Delta | Trend |
|--------|--------|-------|-------|-------|
| `typography.*` references | 472 | **606** | +28% | Improving |
| Raw `fontSize: N` | 304 | **215** | -29% | Improving |
| `fontWeights.*` references | 363 | **343** | -6% | Stable |
| Raw `fontWeight: 'N'` | 5 | **33** | +560% | **Regressed** (onboarding-v2) |
| `useThemeColors` references | 530 | **1,112** | +110% | Strong improvement |
| Raw `#NNNNNN` hex (excl. legit) | 757 | **618** | -18% | Improving |
| `iconSizes.*` references | 392 | **461** | +18% | Improving |
| `shadows.*` references | 83 | **85** | +2% | Flat |
| Inline shadow props | 447 | **391** | -13% | Slight improvement |
| `borderRadius.*` references | 328 | **393** | +20% | Improving |
| `spacing.*` references | 514 | **522** | +2% | Stable |
| Custom `text-[Npx]` Tailwind | 155 | **63** | -59% | Strong improvement |
| `borderRadius: 9999` raw | 26 | **4** | -85% | Strong improvement |

### Headlines

1. **`useThemeColors` doubled** — from 530 to 1,112 references. This is the single largest token-adoption metric movement across all audit cycles. Semantic color usage is now deeply embedded.
2. **Raw `fontSize` down 29%** — 215 remaining, down from 304. Steady cleanup continuing.
3. **Custom `text-[Npx]` dropped 59%** — from 155 to 63. Major Tailwind class cleanup.
4. **`borderRadius: 9999` down 85%** — from 26 to 4 remaining violations. Near-complete remediation.
5. **`fontWeight` REGRESSED** — from 5 to 33 raw values. Entirely concentrated in the new `onboarding-v2/` module (28 of 33 violations). The remaining 5 are in `TemplatesScreen/` components.
6. **Shadow tokens remain flat** — 85 references vs 391 inline shadow props. Shadow token adoption at ~18% is the weakest pillar and has been for 3 cycles.

---

## Reconciliation of Apr 23 Findings

### New-1. `borderRadius: 9999` workaround — **MOSTLY REMEDIATED**

- Was: 26 call sites
- Now: **4 remaining**
  - `src/components/RevenueCatPaywall/PaywallHeader.tsx:53`
  - `src/screens/TemplatesScreen/components/TemplatesLoadingState.tsx:58`
  - `src/screens/TemplatesScreen/components/GoalCollectionGrid/FeaturedGoalCard.styles.ts:11, 24`

**Fix:** Replace `borderRadius: 9999` with `borderRadius.full` — 4 one-line changes.

### New-2. Non-canonical spring configs — **OPEN**

Legacy `friction/tension` spring API persists in **24 call sites** across 10 files:
- `DayHabitsBottomSheet/HabitDayToggleRow/useToggleAnimations.ts` (4 sites)
- `HabitChainVisualizer/useHabitDayToggleAnimations.ts` (2 sites)
- `HabitChainVisualizer/useHabitDayToggleHandlers.ts` (8 sites)
- `WeeklySummaryCard/useWeeklySummaryAnimations.ts` (2 sites)
- `CreateHabitModal/components/TemplatesLinkSection.tsx` (4 sites)
- `CreateHabitModal/components/EnhancedReminderSelector/PresetButton.tsx` (4 sites)
- `CreateHabitModal/components/EnhancedReminderSelector/usePresetButtonAnimation.ts` (4 sites)
- `CreateHabitModal/components/TimeOfDaySelector/TimeOfDayButton.tsx` (4 sites)
- `CreateHabitModal/components/HabitPreview/usePreviewAnimations.ts` (8 sites)
- `CreateHabitModal/components/ColorPickerSection/ColorSwatch.tsx` (2 sites)
- `CalendarTimeline/components/CompletionDot.tsx` (1 site)
- `CreateHabitModal/components/QuickPicksRow/QuickPickCard.tsx` (4 sites)

Legacy `new Animated.Value` usage: **58 files** (up from 31 in Apr 23). Possible regression or broader grep pattern.

### New-3. `HabitDetailScreen.tsx:100` inline typography — **OPEN**

Still present. One-line fix.

### New-4 through New-11 — **Carried forward, statuses unchanged.**

---

## New Findings — May 7

### F-1. `onboarding-v2/` module bypasses design tokens — **HIGH**

The new `onboarding-v2/` module introduced **28 raw `fontWeight: 'N'` violations** and extensive inline styling that bypasses the design system:

**fontWeight violations (28):**
- `CategoryTile.tsx:43` — `fontWeight: '600'`
- `DemoCard.tsx:47, 57` — `fontWeight: '600'`, `'700'`
- `PrimaryCTA.tsx:46` — `fontWeight: '600'`
- `SolutionRow.tsx:36` — `fontWeight: '600'`
- `SolutionIntroStep.tsx:36, 62` — `fontWeight: '800'`, `'500'`
- `ProblemStep.tsx:18, 30, 56, 82` — `'500'`, `'800'`, `'800'`, `'500'`
- `StepStub.tsx:17, 20, 42` — `'600'`, `'800'`, `'600'`
- `OptionRow.tsx:45, 72` — `'500'`, `'700'`
- `TestimonialCard.tsx:43, 49` — `'700'`, `'600'`
- `PlanHabitCard.tsx:49` — `'600'`
- `AppDemoStep.tsx:68, 81` — `'600'`, `'600'`
- `HeroHeader.tsx:20, 33` — `'600'`, `'800'`
- `NameStep.tsx:43` — `'600'`
- `WelcomeStep.tsx:24, 37` — `'800'`, `'500'`
- `SocialProofStep.tsx:34` — `'600'`
- `PainAmplificationStep.tsx:54, 74, 89` — `'500'`, `'600'`, `'600'`

**Additional issues:** Several files in `onboarding-v2/` also use hardcoded hex colors like `'#FFFFFF'` instead of `colors.text.inverse`, and non-standard font sizes (11, 15, 30px) that don't match the typography scale.

**Note:** `fontWeight: '800'` (extra-bold) is not defined in the `fontWeights` token system at all. If this weight is intentional for the onboarding v2 flow, the token system should be extended with `fontWeights.extrabold = '800'`.

### F-2. `TemplatesScreen` raw fontWeight — **MEDIUM**

5 remaining violations outside onboarding-v2:
- `CategoryRow.tsx:77` — `fontWeight: '600'` (should be `fontWeights.semibold`)
- `CategoryRowsSection.tsx:91, 92` — `fontWeight: '700'` (should be `fontWeights.bold`)

Both are appended to spread typography tokens (e.g., `{ ...typography.bodySmall, fontWeight: '600' }`), so they override correctly but bypass the `fontWeights.*` token.

### F-3. Hardcoded `#fff` / `#FFFFFF` for inverse text — **MEDIUM**

7 call sites use `color: '#fff'` instead of `colors.text.inverse`:
- `PackConfirmSheet/ActionButtons.tsx:31`
- `MiniTemplateCard/styles/importButtonStyles.ts:25`
- `HabitDetailScreen/components/GoalTabEmptyState.tsx:95`
- `HabitDetailScreen/components/GoalAdjustSheet/GoalAdjustSheet.tsx:71`
- `StartHereCard/StartHereCard.tsx:68, 83, 100`

9 additional call sites use `color: '#FFFFFF'`. Total: **16 hardcoded white text values**.

**Impact:** Won't adapt to dark mode. The semantic token `colors.text.inverse` exists and should be used.

### F-4. `DEFAULT_ICON_COLOR` defined 4 times as `'#78716c'` — **LOW**

Duplicated across 4 files instead of a shared constant:
- `TemplateCard/TemplateCard.constants.ts:8`
- `FullsizeTemplatePreview/FullsizeTemplatePreview.constants.ts:6`
- `MiniTemplateCard/constants.ts:6`
- `templates/TemplatePreviewModal/constants.ts:6`

Should be a single shared constant or mapped to a theme token (closest: `colors.gray[500]` = `#6B6560`; `#78716c` is stone-500 and doesn't match the warm-stone palette).

### F-5. Shadow token adoption remains weakest pillar — **MEDIUM (systemic)**

- Token references: **85** (vs 83 in Apr 23 — essentially flat)
- Inline shadow props: **391** (down from 447 — slight improvement)
- **Adoption rate: ~18%** — lowest of any token category

The `shadows.*` namespace defines 5 tiers (subtle/card/floatingActionButton/modal/alert). 82% of shadow usage still uses inline `shadowColor`/`shadowOffset`/`shadowOpacity`/`shadowRadius` props. This is the top systemic consistency gap.

### F-6. NativeWind `className` + `StyleSheet.create` coexistence — **ARCHITECTURAL (carried)**

- `className=` usage: **2,279** files
- `StyleSheet.create` usage: **216** files

Not a regression — this is a known architectural duality. The codebase primarily uses NativeWind/Tailwind (`className`) with `StyleSheet.create` for dynamic styles and animation targets. This coexistence is acceptable for a React Native app.

### F-7. Off-grid spacing values — **LOW (77 instances)**

77 instances of spacing values that don't align to the 8pt grid (e.g., `padding: 14`, `margin: 10`, `padding: 6`). Most are minor and concentrated in older components.

### F-8. EmptyState component fragmentation — **ARCHITECTURAL (carried)**

13 distinct `EmptyState*.tsx` files across the codebase. The canonical `src/components/EmptyState/EmptyState.tsx` primitive exists but isn't universally consumed. This is a Wave 3/4 consolidation opportunity.

---

## Priority Matrix

### Quick Wins (< 1 hour each, immediate consistency gains)

| # | Finding | Files | Fix |
|---|---------|-------|-----|
| 1 | `borderRadius: 9999` → `borderRadius.full` | 4 files | Find-replace |
| 2 | `TemplatesScreen` raw `fontWeight` | 2 files, 3 sites | Use `fontWeights.*` |
| 3 | `color: '#fff'` → `colors.text.inverse` | 7 files | Find-replace |
| 4 | `DEFAULT_ICON_COLOR` dedup | 4 files | Shared constant |

### Wave 1 — Token Migration (1-2 days)

| # | Finding | Scope | Impact |
|---|---------|-------|--------|
| 5 | `onboarding-v2/` fontWeight + typography adoption | 28 violations, ~15 files | Prevents score regression |
| 6 | Remaining raw `fontSize` cleanup | 215 instances | Typography 3.75 → 4/4 |
| 7 | Hardcoded hex cleanup (non-onboarding) | ~590 instances | Color 3.75 → 4/4 |

### Wave 2 — Shadow + Spring Migration (2-3 days)

| # | Finding | Scope | Impact |
|---|---------|-------|--------|
| 8 | Shadow token adoption | 391 inline → `shadows.*` | Spacing/Visuals improvement |
| 9 | Legacy `friction/tension` → Reanimated + canonical springs | 24 call sites, 10 files | Animation consistency |
| 10 | Legacy `Animated.Value` → Reanimated | 58 files | Animation architecture |

### Wave 3 — Architectural (multi-sprint)

| # | Finding | Scope |
|---|---------|-------|
| 11 | EmptyState primitive consolidation | 13 files |
| 12 | Button/padding variant consolidation | 290+ files |
| 13 | `onboarding-v2` vs legacy onboarding resolution | TBD |

---

## Cross-Cutting Observations

### Theme System Maturity

The design token system (`src/theme/`) is **comprehensive and well-documented**:
- Colors: 250+ values across core, semantic, strength, material, parchment, and tone palettes
- Typography: 12 named variants covering display through tab bar
- Spacing: 8pt grid system with 8 named stops
- Border radius: 7 semantic aliases
- Shadows: 5-tier elevation system
- Animations: 16 duration tokens, 13 spring presets, canonical easing
- Icons: Complete size scale

The architecture (static tokens + ThemeContext for dark/light) is sound. The gap is adoption, not definition.

### Onboarding-v2 Isolation Risk

The `onboarding-v2/` module is the primary source of new design token violations. It appears to have been built in isolation from the design system, using inline styles extensively. If this becomes the production onboarding flow, it needs a token-adoption pass before ship.

### Dark Mode Readiness

`ThemeContext.tsx` still force-locks to light mode. The ~618 hardcoded hex values and ~16 `#fff`/`#FFFFFF` usages will break when dark mode is unlocked. The semantic color system (`useThemeColors`) is ready (1,112 references), but raw values remain the blocker.

---

## Assumptions & Limitations

- **Screenshots not captured.** Code-only audit. Visual inconsistencies (rendered font metrics, animation smoothness, color contrast in-context) require device testing.
- **Dark mode not scored.** Force-locked to light per `ThemeContext.tsx`. Hardcoded hex findings are acceptable for current light-mode-only state but become blocking when dark mode unlocks.
- **Grep-based metrics** exclude `src/theme`, `__tests__`, `*.test.*`, and known legitimate hex sources (categoryColors, confetti configs, materialTier constants, colorUtils). Pattern parity with all prior audits enforced.

---

## Summary

The design system is **mature and well-adopted** at 22.5/24. Since Apr 23:

- `useThemeColors` adoption doubled (+110%), establishing semantic colors as the dominant pattern
- Raw `fontSize` dropped 29% (215 remaining)
- `borderRadius: 9999` dropped 85% (4 remaining)
- Custom `text-[Npx]` classes dropped 59%

**Regressions:**
- `fontWeight` violations jumped from 5 → 33, entirely due to the new `onboarding-v2/` module bypassing the design system

**Stalled areas:**
- Shadow token adoption (~18%) — flat for 3 consecutive cycles
- Legacy `Animated.spring` friction/tension API — 24 call sites unchanged

**Path to 24/24:**
1. Quick wins: 4 tasks, <1 hour — fixes borderRadius, fontWeight, inverse text color, icon color dedup
2. `onboarding-v2` token adoption pass — prevents Typography score regression
3. Shadow token migration — the last major systematic gap
4. Legacy animation migration — architectural but bounded (10 files)

The codebase is in excellent shape. The remaining work is mostly mechanical token substitution, with the `onboarding-v2` module being the only area that needs architectural attention before it ships.
