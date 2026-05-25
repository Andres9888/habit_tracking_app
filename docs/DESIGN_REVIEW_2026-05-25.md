# Design Consistency Review — 2026-05-25

**Scope:** Chain Day mobile app (`src/`), web CSS (`global.css`), marketing site (`website/`)  
**Reference:** `src/theme/` warm-minimal design system  
**Prior audits:** `DESIGN_CONSISTENCY_AUDIT.md` (Feb 2026), `DESIGN_TOKEN_ADOPTION_AUDIT.md` (Apr 2026)

---

## Executive Summary

**Overall grade: B+ (84/100)** — The design system is well-defined and improving, but adoption is uneven. Core primitives (`Button`, `Card`) were misaligned with token specs; onboarding CTAs bypassed the shared button entirely. Shadows remain the weakest pillar.

| System | Grade | Adoption | Trend |
|--------|-------|----------|-------|
| Colors | B | ~68% tokenized | ↑ slow |
| Typography (fontWeight) | A | ~96% | ↑↑ |
| Typography (fontSize) | C+ | ~59% | ↑ |
| Icons | B+ | ~50–94% | ↑↑ |
| Shadows | D+ | ~22% | ↑ |
| Border radius | B | Mostly compliant | → |
| Button primitive | C+ → **B** | 9 imports; fixed today | ↑ |
| Card primitive | C+ → **B** | Fixed today | ↑ |

---

## Current Metrics (2026-05-25)

| Metric | Count |
|--------|-------|
| Files with hardcoded hex | 343 |
| `shadows.*` token usage | 90 |
| Inline `shadowColor:` | 102 |
| Shared `Button` imports | 9 |
| Raw `fontWeight: 'N'` | 34 |

---

## What's Working Well

1. **Theme architecture** — `src/theme/` provides colors, typography, spacing, shadows, animations with light/dark via `ThemeContext`.
2. **fontWeight migration** — 96%+ adoption; raw string literals down to ~34 across 8 live files (mostly Goal tab).
3. **Icon sizes** — `iconSizes.*` widely adopted after Settings/Library polish pass.
4. **Automated enforcement** — 40+ theme compliance tests in `tests/unit/theme/`.
5. **Recent screen migrations** — WelcomeScreen, Settings, Templates, Analytics largely tokenized.
6. **Phased remediation docs** — `docs/Design-Consistency/DESIGN-CONSISTENCY-01` through `09` provide actionable checklists.

---

## Critical Inconsistencies Found

### 1. Shared primitives misaligned with tokens (FIXED this review)

| Component | Was | Should be | Status |
|-----------|-----|-----------|--------|
| `Button` border radius | `borderRadius.small` (8px) | `borderRadius.button` (12px) | ✅ Fixed |
| `Card` radius + shadow | Tailwind `rounded-xl` + `shadow-sm` | `borderRadius.card` (16px) + `shadows.card` | ✅ Fixed |
| `PrimaryCTA` | Custom Pressable, 14px radius, 16px font, `#FFFFFF` | Shared `Button` large + theme tokens | ✅ Fixed |
| `global.css` fonts | Source Sans 3 / Plus Jakarta | DM Sans / Literata | ✅ Fixed |
| `global.css` `--card` | White `#FFFFFF` | Warm stone `#EDEAE5` | ✅ Fixed |

### 2. Button primitive under-adopted

~200+ custom `<Pressable>` buttons vs 9 `Button` imports. High-traffic surfaces still use bespoke buttons:

- Onboarding (`PrimaryCTA` — now wraps `Button`)
- Auth social buttons
- Habit edit/detail header actions
- Create habit modal CTAs

**Recommendation:** Migrate CTAs screen-by-screen starting with auth → onboarding → modals.

### 3. Shadow system fragmentation (biggest remaining gap)

- Canonical: 5 warm shadows in `src/theme/spacing.ts` using `#2D2A26`
- Reality: ~102 inline `shadowColor` declarations; Tailwind `shadow-sm/md/lg` on web
- Branded off-palette shadows on monetization: `#312e81`, `#059669`

**Recommendation:** Phase 10 — migrate top 20 shadow offenders (MonetizationHero, FullsizeTemplatePreview footer, StreakGoalCard dashboard).

### 4. Dual styling (NativeWind + StyleSheet duplication)

Pattern: same element gets both `className` and inline `style` with duplicated values. Increases drift risk and bundle size.

**Rule:** Layout → NativeWind; colors/typography/shadows/radius → theme tokens via `style` only (`docs/STYLE_CONVENTIONS.md`).

### 5. Web font stack mismatch (partially fixed)

- RN theme: Literata + DM Sans ✅
- `tailwind.config.js`: DMSans + Literata ✅
- `global.css`: was Source Sans / Plus Jakarta → now DM Sans / Literata ✅

### 6. Parallel color modules (intentional but drift-prone)

| File | Risk |
|------|------|
| `CreateHabitModal/.../CategoryFilters.colors.ts` | 57 local hex values |
| `screens/templates/categoryColors.*.ts` | Separate light/dark palettes |
| `MonetizationHero` | Indigo/gold premium styling vs warm minimal |

### 7. Typography off-scale values

Still common: `fontSize: 11, 15, 26` in StreakGoalCard dashboard styles. Consider adding `bodyMedium: 15` token or aligning to 14/17.

**Cluster fix:** HabitDetailScreen Goal* components (7 of 13 raw fontWeight offenders).

### 8. Documentation drift

- `src/theme/README.md` still references SF Pro
- `DESIGN-CONSISTENCY-09.md` lists WelcomeScreen as needing migration — already done
- `tests/unit/theme/fontfamily-tokens.test.ts` expects SF Pro — tests outdated vs typography.ts

---

## Screen-by-Screen Comparison Matrix

| Surface | Colors | Typography | Radius | Shadows | Notes |
|---------|--------|------------|--------|---------|-------|
| HabitsApp / HabitCard | ✅ | ✅ | ✅ | ⚠️ | Core loop solid |
| WelcomeScreen | ✅ | ✅ | ✅ | ✅ | Fully migrated |
| Onboarding v2 | ✅ | ⚠️ | ✅ | ⚠️ | PrimaryCTA now uses Button |
| CreateHabitModal | ❌ | ⚠️ | ⚠️ | ❌ | CategoryFilters.colors hotspot |
| HabitDetailScreen | ⚠️ | ⚠️ | ✅ | ⚠️ | Goal tab off-token |
| HabitEditScreen | ⚠️ | ⚠️ | ✅ | ⚠️ | Mix Tailwind + hex |
| TemplatesScreen | ✅ | ✅ | ✅ | ✅ | Recent polish pass |
| SettingsModal | ✅ | ✅ | ✅ | ✅ | Reference implementation |
| MonetizationHero | ❌ | ⚠️ | ⚠️ | ❌ | Premium indigo/gold diverges |
| AnalyticsScreen | ✅ | ✅ | ✅ | ✅ | Migrated |
| App web (expo web) | ✅ | ✅ | — | — | global.css aligned today |
| Marketing website | ❌ | ❌ | ❌ | ❌ | Separate neutral palette |

---

## Prioritized Improvement Roadmap

### Quick wins (1–2 sessions)

1. ✅ Fix Button/Card/PrimaryCTA/global.css primitives
2. Migrate HabitDetailScreen Goal* fontWeight cluster (13 occurrences → 99%+ adoption)
3. Update stale tests/docs (fontfamily-tokens, theme README, DESIGN-CONSISTENCY-09)

### Medium effort (3–5 sessions)

4. Shadow migration pass on MonetizationHero, StreakGoalCard, FullsizeTemplatePreview
5. CreateHabitModal CategoryFilters → theme colors
6. Replace auth screen custom buttons with `Button` primitive
7. Add `bodyMedium: 15` typography token for chip labels

### Larger initiatives

8. Consolidate duplicate UI clusters (EmojiPicker v1/v2, calendar variants)
9. Align marketing `website/` with warm-minimal brand
10. ESLint rule: warn on raw hex outside `*.colors.ts` whitelist

---

## Changes Applied (2026-05-25 cron review)

| File | Change |
|------|--------|
| `src/components/Button/Button.tsx` | Button radius 8px → 12px (`borderRadius.button`) |
| `src/components/Card/Card.tsx` | Theme `borderRadius.card` + `shadows.card`; spacing tokens for padding |
| `src/screens/onboarding-v2/components/PrimaryCTA.tsx` | Delegates to shared `Button` (large, fullWidth) |
| `global.css` | DM Sans/Literata fonts; warm card CSS variable |
| `src/components/Button/tests/Button.test.tsx` | Updated radius comment |

---

## Visual QA Checklist

Compare these side-by-side after changes:

- [ ] WelcomeScreen sign-in button vs onboarding PrimaryCTA vs Settings save button
- [ ] HabitCard vs Card primitive vs TemplateListCard
- [ ] Light mode vs dark mode on HabitsApp, Settings, CreateHabitModal
- [ ] Web export (`expo export -p web`) font rendering
- [ ] MonetizationHero vs rest of home screen (intentional premium contrast?)

---

*Next scheduled review: align with DESIGN-CONSISTENCY phase 10 (shadows + CreateHabitModal colors).*
