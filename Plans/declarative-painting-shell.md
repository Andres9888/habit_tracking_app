# UX Consistency Review: Design Token Remediation

## Context

The app's UI-REVIEW.md (2026-03-19) scores the design system at **19/24** across 6 pillars. Recent commits (#1200, #1207, #1209, #1212, #1215, #1218) fixed 873+ hardcoded color classes and aligned typography in several components. However, significant violations remain in typography (2/4), spacing (3/4), color (3/4), and visuals (3/4). This plan systematically fixes all remaining violations to reach 24/24.

## Verified Current Violations

| Category | Count | Source |
|----------|-------|--------|
| `fontWeight: 'bold'` (should be `fontWeights.bold` = `'700'`) | 7 occurrences in 5 files | grep verified |
| `fontWeight: '800'` | 0 (already fixed) | grep verified |
| `padding: 20` (off 8pt grid) | 12 non-test files | grep verified |
| Hardcoded hex in `.styles.ts` files | 23 files | grep verified |
| Hardcoded hex in `.tsx` component files | ~250 files (many are theme-aware via `useThemeColors`) | estimated |
| Raw `fontSize` without typography token | ~160 files | from UI-REVIEW |
| Tailwind config mismatches | `card.foreground`, `fontFamily.sans/heading` | from UI-REVIEW |

---

## Wave 1: Tailwind Config Alignment

**Files:** `tailwind.config.js`

**Changes:**
- `card.foreground`: `'#1F2937'` -> `'#2D2A26'` (match `colors.text.primary`)
- `fontFamily.sans`: `['Inter', ...]` -> `['DMSans', ...]` (match theme)
- `fontFamily.heading`: `['Inter', ...]` -> `['Literata', ...]` (match theme)
- Verify `accent.DEFAULT` (`#10B981`) alignment with `colors.primary[500]`

**Verification:** App builds. NativeWind-styled components render correctly.

---

## Wave 2: fontWeight: 'bold' -> fontWeights.bold (5 files)

Replace `fontWeight: 'bold'` with `fontWeight: fontWeights.bold` (= `'700'`):

1. `src/components/Toast/styles.ts` (lines 32, 37)
2. `src/components/HabitCard/HabitCard.statusStyles.ts` (line 49)
3. `src/components/StrengthRing/StrengthRing.styles.ts` (line 47)
4. `src/screens/auth/components/SuccessOverlay/styles.ts` (line 17)
5. `src/components/HapticTest.tsx` (lines 224, 235)

Each file adds `import { fontWeights } from '@/theme';` (or extends existing import).

---

## Wave 3: Hardcoded Hex in .styles.ts Files (23 files)

Replace hardcoded hex values with theme token imports. Key token mappings:

| Hex value | Token replacement |
|-----------|------------------|
| `'#ffffff'` / `'#FFFFFF'` | `colors.light.surfaceMuted` or param from component |
| `'#1c1917'` / `'#1f2937'` | `colors.gray[900]` / `colors.gray[800]` |
| `'#FCD34D'` / `'#fbbf24'` / `'#f59e0b'` | `colors.streak[300]` |
| `'#D97706'` / `'#b45309'` / `'#92400e'` | `colors.warning` |
| `'#fef3c7'` / `'#fefce8'` | `colors.warningLight` |
| `'#059669'` | `colors.primary[600]` |
| `'#065f46'` | `colors.primary[700]` |
| `'#ecfdf5'` | `colors.primary[100]` |
| `'#10b981'` / `'#22c55e'` | `colors.primary[500]` |
| `'#0EA5E9'` | `colors.info` |
| `'#4B5563'` / `'#6b7280'` / `'#71717A'` | `colors.gray[500]` |
| `'#78716c'` / `'#a8a29e'` | `colors.gray[400]` / `colors.gray[300]` |
| `'#E4E4E7'` / `'#e5e7eb'` | `colors.gray[200]` |
| `'#f5f5f4'` / `'#fafaf9'` | `colors.gray[50]` |
| `'#8b5cf6'` | `colors.premium[400]` |
| `'#000'` shadow color | `'#2D2A26'` (warm shadow) |

**Dark mode note:** Static `.styles.ts` files using `StyleSheet.create` run at module load and can't use `useThemeColors()`. For these, either:
- Use static `colors.*` from `core.ts` (acceptable for fixed-color elements)
- Accept color as a function parameter (for theme-aware styles, use the `useThemedStyles()` pattern already in `BinaryHeatmap/StatsRow.styles.ts`)

Priority files (most user-facing):
1. `src/features/habits/components/BottomActionBar/BottomActionBar.styles.ts`
2. `src/features/habits/components/BottomActionBar/ProgressRingFAB.styles.ts`
3. `src/components/HabitCard/HabitCard.styles.ts`
4. `src/components/NextHabitSuggestion/NextHabitSuggestion.styles.ts`
5. `src/screens/TemplatesScreen/components/FeaturedCollection/FeaturedCollection.styles.ts`
6. `src/screens/TemplatesScreen/components/TrendingCard/TrendingCard.styles.ts`
7. `src/components/ProgressSectionConsolidated/MilestoneProgress/styles/*.styles.ts` (3 files)
8. `src/components/OfflinePendingBanner/styles/*.styles.ts` (3 files)
9. `src/components/FullsizeTemplatePreview/styles/*.styles.ts` (4 files)
10. `src/components/TemplateAddedToast/CelebrationOverlay.styles.ts`
11. Remaining 8 files

---

## Wave 4: Hardcoded Hex in .tsx Component Files (critical paths)

### Wave 4A: Auth + Onboarding
- `src/screens/auth/components/SuccessOverlay/styles.ts` — `#10b981` -> `colors.primary[500]`, `#ffffff` -> `colors.text.inverse`

### Wave 4B: Daily-use components
- `src/components/DraggableHabit/` family — `#a855f7`/`#8b5cf6` -> `colors.premium[400]`, `#D97706` -> `colors.warning`, `#dc2626` -> `colors.error`
- `src/components/FloatingXPText/FloatingXPText.tsx` — `#F59E0B` -> `colors.streak[300]`, `#047857` -> `colors.primary[700]`
- `src/components/InsightsSection/components/DayBar.tsx` — 8 hex colors -> theme tokens

### Wave 4C: Analytics + Character screens
- `src/screens/AnalyticsScreen/components/EmptyState.tsx` — all inline hex -> tokens
- `src/screens/CharacterScreen/components/*.tsx` — hex + inline shadows -> tokens

### Wave 4D: Remaining components
- `src/components/PremiumBadge.tsx`, `src/components/EmojiPicker/`, other scattered files

---

## Wave 5: padding: 20 and Off-Grid Spacing (12 files)

Replace `padding: 20` with `padding: spacing.lg` (24) in:

1. `src/components/InsightsSection/components/EmptyInsightsState.tsx`
2. `src/components/ProgressSectionConsolidated/StreakRecordsAccordion/StreakEmptyState.tsx`
3. `src/components/FullsizeTemplatePreview/styles/tips.styles.ts`
4. `src/components/FullsizeTemplatePreview/styles/science.styles.ts`
5. `src/screens/AnalyticsScreen/components/EmptyState.tsx`
6. `src/screens/templates/styles/skeletonStyles.ts`
7. `src/components/HabitStrengthSection/components/EmptyState.tsx`
8. `src/components/NextHabitSuggestion/NextHabitSuggestion.styles.ts`
9. `src/components/NextHabitSuggestion/styles.ts`
10. `src/components/HapticTest.tsx`

Each file adds `import { spacing } from '@/theme';` and replaces `20` with `spacing.lg`.

Also fix other off-grid values:
- `paddingVertical: 10` -> `spacing.sm` (8) or `spacing.md` (12) — case by case
- `paddingHorizontal: 14` -> `spacing.base` (16)
- `gap: 10` -> `spacing.md` (12)

---

## Wave 6: Raw fontSize/fontWeight -> typography.* tokens (high-impact files)

Priority files with most raw typography values:

1. **CharacterScreen components** (~8 raw fontSize each):
   - `CharacterCard.tsx`, `StatCard.tsx`, `AchievementCard.tsx`, `AttributeCard.tsx`
2. **AnalyticsScreen EmptyState** (~5 raw fontSize)
3. **Templates styles** (~25 raw values across 10+ style files)
4. **ErrorBoundary components** (~20 raw values across 6 files)
5. **HabitsEmptyStateMinimal sub-components** (9+ raw fontSize — critical first-time path)

Token mapping:
| Raw | Token |
|-----|-------|
| `fontSize: 34` | `typography.displayLarge` |
| `fontSize: 22, fontWeight: '700'` | `typography.heading1` |
| `fontSize: 22, fontWeight: '600'` | `typography.heading2` |
| `fontSize: 20, fontWeight: '600'` | `typography.heading3` |
| `fontSize: 17` | `typography.body` |
| `fontSize: 17, fontWeight: '600'` | `typography.button` |
| `fontSize: 14` | `typography.bodySmall` |
| `fontSize: 13, fontWeight: '500'` | `typography.caption` |
| `fontSize: 10, fontWeight: '500'` | `typography.tabBar` |

For off-scale values (e.g., `fontSize: 15`, `fontSize: 11`, `fontSize: 28`), snap to nearest token or add the value to the typography scale if it serves a genuine need.

---

## Wave 7: Shadow Token Replacement

Replace inline `shadowOffset`/`shadowOpacity`/`shadowRadius` with `...shadows.card` or `...shadows.floatingActionButton` spreads.

Key files: CharacterScreen components, AnalyticsScreen EmptyState, auth screen components, SortBottomSheet.

---

## Verification

After each wave:
1. `npx tsc --noEmit` — TypeScript compiles
2. `npm run lint` — ESLint passes
3. Visual check on 6 main screens (Welcome, Habits, Analytics, Character, Templates, Settings) in light + dark mode

After all waves:
- Re-run audit greps to confirm zero violations outside `src/theme/`, tests, and `settingsColors.ts`
- Update `UI-REVIEW.md` with new scores

**Expected result: 19/24 -> 24/24**

---

## Critical Files Reference

| Purpose | Path |
|---------|------|
| Color tokens | `src/theme/colors/core.ts` |
| Semantic colors | `src/theme/colors/semantic.ts` |
| Dark/light palettes | `src/theme/darkColors.ts` |
| Typography tokens | `src/theme/typography.ts` |
| Spacing + shadows | `src/theme/spacing.ts` |
| Animation tokens | `src/theme/animations.ts` |
| Theme context | `src/theme/ThemeContext.tsx` |
| Main theme export | `src/theme/index.ts` |
| Tailwind config | `tailwind.config.js` |
| Existing UI review | `UI-REVIEW.md` |
