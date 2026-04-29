# Design Consistency Review

**Date:** 2026-04-05
**Scope:** Full codebase — all screens, shared components, theme system
**Prior audits:** Feb 3 UI Consistency Audit, Mar 19 UI Review (19/24)
**Commits since last audit:** 26 (many targeting design token remediation)

---

## Overall Score: 21/24

| Pillar | Mar 19 | Now | Delta |
|--------|--------|-----|-------|
| Copywriting | 4/4 | 4/4 | -- |
| Visuals | 3/4 | 3/4 | -- |
| Color | 3/4 | 3.5/4 | +0.5 |
| Typography | 2/4 | 2.5/4 | +0.5 |
| Spacing | 3/4 | 3/4 | -- |
| Experience Design | 4/4 | 4/4 | -- |

---

## What Improved (Delta from Prior Audits)

### Fully Remediated
- **fontWeight: '800'**: 19 occurrences (Mar 19) -> **0** (now). Completely eliminated.
- **fontWeight: 'bold'**: Previously scattered -> **0** occurrences. All converted to numeric weights.
- **padding: 20 off-grid**: Previously in EmptyState.tsx production code -> now only in CelebrationExample.tsx (example file). Production clean.
- **Hardcoded '#ffffff'** in SuccessContent: Flagged Mar 19 -> resolved in PR #1223.
- **Settings screens**: PR #1227 and #1231 applied theme tokens, shadows, and aligned patterns across settings.
- **Create habit modal**: PR #1215 aligned typography to design system tokens.
- **Habit detail screen**: PR #1207 replaced hardcoded colors with theme tokens.
- **873 hardcoded color classes**: PR #1202 replaced with theme-aware tokens.
- **Dark mode disabled**: PR #1229 force-locks light mode until dark mode is ready — eliminating dark mode inconsistency bugs.

### Partially Improved
- **Color token adoption**: `useThemeColors` hook now used in **467 files** — strong foundation.
- **Shadow token adoption**: 77 files use `shadows.*` tokens vs 427 files with inline shadow properties — ~15% token adoption (up from near-zero).

---

## Current Findings

### 1. Typography Token Bypass — CRITICAL

**Severity:** Critical
**Impact:** Typographic inconsistency across screens; design system exists but is widely bypassed

| Metric | Count |
|--------|-------|
| Raw `fontSize: N` (excl. theme/test files) | **328** across ~130 files |
| `typography.*` token references | **277** across 118 files |
| Raw `fontWeight: 'N'` (excl. theme/test) | **229** across ~120 files |
| `fontWeights.*` token references | **56** across ~40 files |

**Token adoption rate:**
- fontSize: **46%** token, 54% raw
- fontWeight: **20%** token, 80% raw

**Key offenders (highest raw value density):**
- `src/components/ErrorBoundary/` — 7 raw fontSize + 4 raw fontWeight in errorFallbackStyles.ts alone
- `src/components/ProgressSectionConsolidated/TodaysFocusCard/styles/elementStyles.ts` — 6 raw fontWeight
- `src/components/CalendarTimeline/components/` — multiple files with raw values
- `src/screens/templates/styles/` — 7 style files using raw fontSize/fontWeight
- `src/components/FullsizeTemplatePreview/styles/` — multiple raw values
- `src/components/BinaryHeatmap/MonthlyCalendarGrid/styles.ts` — 4 raw fontWeight
- `src/components/ErrorBoundary/ScreenErrorFallback.tsx` — 7 raw fontSize, 3 raw fontWeight
- `src/components/NextHabitSuggestion/styles.ts` — 8 raw fontSize

**Specific type scale deviations still present:**
- 11px font sizes (below `tabBar` at 10px) — in FeaturedCollection badge
- 15px font sizes (no token exists) — in template styles
- Custom font sizes like 9px, 11px not in the type scale

---

### 2. Icon Size Token Non-Adoption — HIGH

**Severity:** High
**Impact:** `iconSizes` token system defined in theme but used in 0 components

| Metric | Count |
|--------|-------|
| Raw `size={N}` props on icons | **460** across 258 files |
| `iconSizes.*` token references | **0** (only in barrel export) |

**Token adoption rate: 0%**

The token system defines: micro(10), small(16), medium(20), large(24), xl(32), xxl(48). All 460 icon size references use hardcoded numbers.

**Distribution of raw icon sizes:**
- size={20}: Most common (standard inline)
- size={16}: Second most common (caption-level)
- size={14}: 74+ instances — **not in the token scale** (between micro=10 and small=16)
- size={18}: 68+ instances — **not in the token scale** (between small=16 and medium=20)
- size={12}: 37+ instances — **not in the token scale**
- size={22}: occasional — **not in the token scale**
- size={28}: occasional — **not in the token scale**

Over 180 icon size references use values **not defined in the token system** (12, 14, 18, 22, 28).

---

### 3. Hardcoded Hex Colors in Components — MEDIUM

**Severity:** Medium (improved from High)
**Impact:** Colors that won't adapt to dark mode; palette drift risk

| Metric | Count |
|--------|-------|
| `colors.*` theme references (excl. theme/test) | **2,029** |
| Raw `#NNNNNN` hex values (excl. theme/test/data) | **~1,101** |

**Token adoption rate: ~65%** (up from ~50% estimated at Feb 3)

The `useThemeColors` hook is in 467 files, so the color system has strong structural adoption. However, 1,101 raw hex values persist. Many are in:

**Legitimate uses (constants, data, configs):**
- `src/screens/CharacterScreen/constants.ts` (15 hex values — achievement colors, by design)
- `src/screens/templates/categoryColors.light.ts` / `categoryColors.dark.ts` (30 values — category palette)
- `src/components/ProgressSectionConsolidated/TodaysFocusCard/TodaysFocusCard.constants.ts` (27 values)
- `src/components/DraggableHabit/colorUtils.ts` (24 values — color computation)
- `src/components/CelebrationSystem/confetti/configs/` (41 values — confetti particle colors)
- `src/components/ProgressSectionConsolidated/WeeklySummaryStrip/dayStateConfigs.ts` (18 values)

**Violations (should be tokens):**
- `src/components/SettingsModal/SortPicker.constants.ts` — 7 hex values for sort icons
- `src/components/SettingsModal/SettingsRow.colors.ts` — 8 hex values
- `src/components/ArchiveUndoToast/` — hardcoded colors in styles
- `src/components/SyncStatus/*/styles.ts` — multiple hex values in toast/indicator styles
- `src/components/ErrorBoundary/errorFallbackStyles.ts` — 2 hex values
- `src/components/CalendarTimeline/components/MiniCalendarGrid.helpers.ts` — 6 hex values

---

### 4. NativeWind className + StyleSheet Mixing — MEDIUM

**Severity:** Medium
**Impact:** Two styling systems creating dual source of truth; maintenance complexity

| Metric | Count |
|--------|-------|
| Files using `className=` with rounded values | **303** |
| Files mixing `className=` AND `style={{`/`StyleSheet` | **382** |

This is a systemic architectural pattern, not isolated incidents. The app uses NativeWind (Tailwind for RN) alongside React Native's `StyleSheet.create`. While this is common in RN apps with NativeWind, the inconsistency creates:

1. **Value duplication**: `rounded-xl` (12px via Tailwind) alongside `borderRadius: borderRadius.medium` (12px via theme) — same value, two systems
2. **Semantic mismatch risk**: Tailwind's spacing scale differs from theme tokens (see Finding #7)
3. **Dark mode complexity**: className colors don't adapt to `useThemeColors()` — forces inline `style` overrides

**Not a bug to fix globally** — this is architectural. But new code should prefer StyleSheet + theme tokens over className for consistency with the design system.

---

### 5. Spacing Token Adoption Gap — MEDIUM

**Severity:** Medium
**Impact:** On-grid values bypass tokens; will drift when grid changes

| Metric | Count |
|--------|-------|
| `spacing.*` / `screenMargins.*` / `componentSpacing.*` references | **419** across 87 files |
| Raw `borderRadius: N` (excl. theme/test) | **~180** across ~100 files |
| `borderRadius.*` token references | **193** across 88 files |

**Spacing token adoption: ~50%** for border radius. Raw pixel padding/margin numbers are extremely common in StyleSheet files.

---

### 6. Shadow Token Adoption — MEDIUM

**Severity:** Medium
**Impact:** Inconsistent elevation language; shadows that drift from design intent

| Metric | Count |
|--------|-------|
| `shadows.*` token references | **77** across 72 files |
| Inline `shadowColor`/`shadowOffset`/`shadowRadius`/`elevation` | **427** across 125 files |

**Token adoption rate: ~15%**

The 5-level shadow system (subtle, card, FAB, modal, alert) is well-designed but most components define shadows inline. Many inline shadows use the correct warm `#2D2A26` tint, which is good — but they define opacity, offset, and radius individually rather than referencing the token.

---

### 7. Tailwind Config vs Theme Token Mismatch — MEDIUM

**Severity:** Medium
**Impact:** NativeWind classes produce different values than theme tokens for the same semantic name

| Token | Tailwind Config | Theme Token | Mismatch |
|-------|----------------|-------------|----------|
| `md` spacing | 12px (config) | 12px (theme) | Aligned |
| `card` color | `#EDEAE5` (config) | `#EDEAE5` (light.card) | Aligned (fixed since Mar 19) |
| `accent` color | `#10B981` (config) | `primary[600]` = `#059669` | **Different green** |
| `card.foreground` | `#2D2A26` (config) | `colors.gray[800]` = `#2D2A26` | Aligned |
| `borderRadius.card` | 12px (config) | 16px (theme) | **Mismatch** |

**Fixed since Mar 19:** `card.DEFAULT` was `#FFFFFF`, now `#EDEAE5` — matches theme.
**Still mismatched:** `accent` color and `borderRadius.card` diverge.

---

### 8. borderRadius: 999 Bug (Should Be 9999) — HIGH

**Severity:** High (visual bug)
**Impact:** Pill shapes may not render as fully circular on large elements

3 files use `borderRadius: 999` instead of `borderRadius: 9999` (or `borderRadius.full`):
- `src/components/CreateHabitModal/components/ColorPickerSection/ColorButton.tsx:70`
- `src/components/CreateHabitModal/components/ColorPickerSection/CustomColorButton.tsx:59`
- `src/components/CreateHabitModal/components/ColorPickerSection/ColorSwatch.tsx:26, 85, 92` (3 instances)

While 999 is likely large enough in practice, the theme defines `full: 9999`. This is a copy-paste divergence from the token.

---

### 9. SyncStatus Components Use Zero Theme Tokens — MEDIUM

**Severity:** Medium
**Impact:** Entire SyncStatus module (5 components) bypasses theme system

Files with fully hardcoded Tailwind-style colors:
- `src/components/SyncStatus/ConflictNotification/styles.ts` — `#fffbeb`, `#fef3c7`, `#fcd34d`, `#92400e`, `#d97706`
- `src/components/SyncStatus/SyncingIndicator/styles.ts` — `#fffbeb`, `#f59e0b`, `#fef3c7`
- `src/components/SyncStatus/OfflineIndicator/styles.ts` — `#fafaf9`, `#f5f5f4`, `#78716c`, `#e7e5e4`
- `src/components/SyncStatus/SyncedToast/styles.ts` — `#f0fdf4`, `#dcfce7`
- `src/components/SyncStatus/PendingSyncBadge/styles.ts` — `#fef3c7`

These are standard Tailwind amber/stone/green palette colors with no connection to the app's warm stone neutral system. They'll look wrong if dark mode is ever enabled.

---

### 10. strokeWidth Variant Sprawl — LOW

**Severity:** Low
**Impact:** Inconsistent visual weight of icons

| strokeWidth | Occurrences | Status |
|-------------|-------------|--------|
| 2 | Standard default | OK |
| 2.5 | Standard emphasis | OK |
| 2.25 | 6 occurrences | **Non-standard** — SearchBar, SwipeableActionButton, TemplatePreviewModal, AnimatedCompletionIcon, ScrollShadows |
| 3 | 17 occurrences | **Context-dependent** — mostly Check icons in checkboxes/completion states |

**2.25 should be eliminated** (6 files). `strokeWidth={3}` is acceptable for Check icons in small containers (12-14px) where 2 or 2.5 would appear too thin.

---

### 11. Button Padding Variant Sprawl — LOW

**Severity:** Low (slightly improved from Feb 3)
**Impact:** Inconsistent button sizing

| Pattern | Occurrences |
|---------|-------------|
| `px-4` | 106 |
| `px-3` | 44 |
| `py-3` | 48 |
| `py-2` | 32 |
| `py-4` | 30 |
| `py-0.5` | 29 |
| `px-2` | 27 |
| `px-5` | 19 |
| `px-6` | 18 |
| Other variants | 40+ |

Still 10+ distinct padding combinations. The Feb 3 audit recommended 3 tiers (small/medium/large) — not yet implemented as a component abstraction.

---

### 12. Custom Text Size Classes — LOW

**Severity:** Low
**Impact:** Bypasses Tailwind's standard text scale

| Metric | Count |
|--------|-------|
| `text-[Npx]` custom classes | **192** across 95 files |

Common custom sizes: `text-[10px]` (badges), `text-[13px]` (captions), `text-[15px]` (body), `text-[11px]` (micro labels). These should map to the typography token scale but are specified as arbitrary values.

---

## Screens with Zero Typography Token Usage

Based on grep analysis, these screen-level files use only raw fontSize/fontWeight with no `typography.*` references:

1. `src/screens/templates/styles/` — All 7 style files (scrollStyles, customizeStyles, previewStyles, controlStyles, browseStyles, sortStyles, searchStyles, formStyles, categoryStyles, tabStyles) use raw values exclusively
2. `src/screens/HabitEditScreen/EditHeader.tsx` — raw fontSize
3. `src/screens/HabitEditScreen/DangerZone.tsx` — raw fontSize + fontWeight

CharacterScreen and AnalyticsScreen now use typography tokens (improved since Mar 19).

---

## Prioritized Remediation

### Wave 1: Highest ROI (Medium effort, biggest visual impact)

1. **Fix `borderRadius: 999` -> `borderRadius.full`** — 5 instances in ColorPickerSection. Potential visual bug. 5-minute fix.

2. **Adopt `iconSizes.*` tokens** — 0% adoption, defined but unused. Create an ESLint rule or codemod to replace the top 5 raw values (20, 16, 24, 14->16, 18->20) with `iconSizes.medium`, `.small`, `.large`, `.small`, `.medium`. Estimate: ~200 replacements get you to 50% adoption.

3. **Refactor SyncStatus component colors** — 5 files using hardcoded Tailwind hex instead of theme tokens. Fully isolated module, low risk.

4. **Typography token adoption in new TemplatesScreen styles** — The 7 template style files (`src/screens/templates/styles/`) all use raw values. These were written recently (PR #1228). Convert to `typography.*` tokens.

5. **Eliminate `strokeWidth={2.25}`** — Only 6 files. Replace with 2 or 2.5. Quick win.

### Wave 2: Systematic Token Migration

4. **Shadow token adoption** — At 15%, this is the lowest-adopted token category. Start with the 5 highest-traffic components (HabitCard, CalendarTimeline, BottomActionBar are already tokenized — extend to DraggableHabit, BinaryHeatmap, StreakMilestoneCelebration).

5. **fontWeight token migration** — 229 raw usages vs 56 token usages. Most are `'600'` or `'700'` which map to `fontWeights.semibold` and `fontWeights.bold`. A search-and-replace codemod could handle the majority.

6. **Fix Tailwind config borderRadius.card** — Change from `12px` to `16px` to match `borderRadius.large` in theme.

### Wave 3: Long-tail Cleanup

7. **fontSize token migration** — 328 raw usages. Larger effort, but would bring typography to >80% token adoption.

8. **Custom text-[Npx] migration** — 192 occurrences across 95 files. Map to nearest standard Tailwind text size or typography token.

9. **Button padding standardization** — Requires a Button component with size variants (sm/md/lg). Larger architectural change.

---

## Summary

The design system is **well-designed** — token definitions for colors, typography, spacing, shadows, icons, and border radius are all thoughtful and comprehensive. The gap is **adoption**:

| Token System | Definition Quality | Adoption Rate | Grade |
|-------------|-------------------|---------------|-------|
| Colors (`useThemeColors`) | Excellent | ~65% | B |
| Typography (`typography.*`) | Excellent | ~46% fontSize, ~20% fontWeight | C- |
| Spacing (`spacing.*`) | Solid | ~50% borderRadius | C |
| Shadows (`shadows.*`) | Solid | ~15% | D |
| Icons (`iconSizes.*`) | Good | **0%** | F |
| Border Radius (`borderRadius.*`) | Good | ~50% | C |

**Trajectory:** Improving. 26 commits since Mar 19 have moved the needle, especially on color consistency and eliminating the worst offenders (fontWeight: 800, padding: 20 off-grid, hardcoded '#ffffff'). The score moved from 19/24 to 21/24.

**Quickest win:** Fix `borderRadius: 999` in ColorPickerSection (5 instances, 5 minutes, potential visual bug).

**Biggest systemic win:** Adopting `iconSizes.*` tokens — it's a defined system that no component uses. A simple find-and-replace would immediately bring 258 files into compliance.
