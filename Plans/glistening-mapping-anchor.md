# Design Consistency Audit

## Context

This is a design consistency review of the habit tracking app. The app has a **well-architected design system** in `src/theme/` — the foundation is excellent. The issues below are places where components bypass the theme tokens with hardcoded values, creating drift that compounds over time.

**Overall health: Strong.** Typography, spacing grid, and animation springs are used consistently. The main gaps are hardcoded colors, border radii, and icon sizes.

---

## Issue 1: Hardcoded Colors (~30 files)

**Severity: Medium** — Breaks dark mode in some places, creates maintenance burden.

### 1a. White (#FFFFFF) used instead of theme tokens

| File | Line | Current | Should Be |
|------|------|---------|-----------|
| `src/features/habits/components/BottomActionBar/ProgressRingFAB.tsx` | — | `color='#ffffff'` | `colors.text.inverse` |
| `src/screens/auth/components/SocialSignInButton/SocialSignInButton.tsx` | 93-95 | `color='#FFFFFF'` | `colors.text.inverse` |
| `src/components/QuickCompleteButton/QuickCompleteButton.tsx` | — | `#FFFFFF` | `colors.text.inverse` |
| `src/components/SwipeableActionButton/ButtonContent.tsx` | — | `#FFFFFF` | `colors.text.inverse` |
| `src/components/StreakMilestoneCelebration/styles.ts` | — | `#FFFFFF` | `colors.text.inverse` |
| `src/components/StreakChain/StreakChain.tsx` | — | `#FFFFFF` | `colors.text.inverse` |
| `src/components/TemplateAddedToast/styles.ts` | — | `#FFFFFF` | `colors.text.inverse` |
| `src/screens/HabitEditScreen/NameInputSection.tsx` | 54 | `'#FFFFFF'` | `colors.card` or `colors.background` |
| `src/screens/HabitEditScreen/EditHeader.tsx` | — | `#FFFFFF` | theme token |
| `src/screens/TemplatesScreen/components/FeaturedCollection/HeroFooter.tsx` | — | `#FFFFFF` | `colors.text.inverse` |
| ~20 more files | — | Various `#FFFFFF` | Appropriate theme token |

### 1b. Hardcoded rgba() for status colors (dark mode gap)

| File | Current | Should Be |
|------|---------|-----------|
| `src/screens/HabitEditScreen/DangerZone.tsx:64-67` | `rgba(146,64,14,0.15)`, `'#FFFBEB'`, `'#FDE68A'`, `'#FEF2F2'`, `'#FECACA'` | Semantic status tokens (e.g., `colors.status.warningLight`, `colors.status.errorLight`) |

### 1c. Data files with hardcoded color palettes

| File | Issue |
|------|-------|
| `src/screens/TemplatesScreen/data/goalCollections.ts` | `bgColor: '#EFF6FF'`, `textColor: '#1E3A5F'` etc. — no dark mode support |
| `src/features/habits/components/SortBottomSheet/constants.ts` | `iconBgColors: ['#78716c', '#57534e']` — hardcoded grays |
| `src/screens/TemplatesScreen/components/FeaturedCollection/featuredCollections.ts` | Mixed hardcoded hex + theme tokens in gradient arrays |

---

## Issue 2: Hardcoded Border Radius (37 occurrences across 30 files)

**Severity: Low-Medium** — Values happen to match tokens today, but bypassing tokens means a future theme change won't propagate.

Most common: `borderRadius: 12` (should be `borderRadius.button` or `borderRadius.medium`).

**Sample files:**
- `src/screens/templates/styles/previewStyles.ts` (3 occurrences)
- `src/screens/templates/styles/tabStyles.ts` (3 occurrences)
- `src/components/FullsizeTemplatePreview/components/PairsWellWith.tsx` (2)
- `src/components/StrengthHistoryChart/components/EmptyState.tsx` (2)
- `src/components/HabitStrengthHistory/StrengthTimelineChart/EmptyStates.tsx` (2)
- `src/lib/sentry/ErrorBoundary/ErrorFallback.styles.ts` (1)
- 24 more files with 1 occurrence each

---

## Issue 3: Hardcoded Icon Sizes (pervasive)

**Severity: Medium** — The theme defines `iconSizes` tokens (`micro:10, small:16, medium:20, large:24, xl:32, xxl:48`) but most components use raw numbers.

**Examples of hardcoded sizes that have an exact token match:**
| Hardcoded | Token | Example Files |
|-----------|-------|---------------|
| `size={12}` | `iconSizes.micro` (close, but token is 10) | `CompletionCheckmark.tsx`, `CardFooterMeta.tsx` |
| `size={14}` | No token (gap between micro:10 and small:16) | `ArchiveUndoToast.tsx`, `DeleteUndoToast.tsx`, `StatusDisplay.tsx`, `ListCardAddButton.tsx` |
| `size={16}` | `iconSizes.small` | `DraftRecoveryBanner.tsx`, `SuggestedActions.tsx`, `VisualizationGuide.tsx`, `SummarySection.tsx` |
| `size={18}` | No token (gap between small:16 and medium:20) | `ArchiveUndoToast.tsx`, `DraftRecoveryBanner.tsx`, `DeleteUndoToast.tsx` |
| `size={20}` | `iconSizes.medium` | `FeedbackModal.tsx`, `ReminderTimePicker.tsx`, `WeeklyInsightsCard.tsx`, many more |
| `size={24}` | `iconSizes.large` | `ModalHeader.tsx`, `GuideHeader.tsx` |
| `size={28}` | No token (gap between large:24 and xl:32) | `UnsavedChangesAlert.tsx` |

**Two sub-issues:**
1. Components that use sizes matching existing tokens (16, 20, 24) should reference `iconSizes.*` instead of raw numbers
2. Sizes 12, 14, 18, 28 have no matching token — consider whether to add tokens or round to nearest

---

## Issue 4: Animation Damping Hardcoded vs Token Reference

**Severity: Low** — Values are correct (18), but some components hardcode `.damping(18)` instead of `.damping(springs.standard.damping)`. If the standard spring ever changes, these won't update.

This is a minor consistency nit — the values are functionally correct today.

---

## What's Working Well

| Area | Score | Notes |
|------|-------|-------|
| **Theme Architecture** | 95% | Excellent layered system: static colors, semantic tokens, component tokens |
| **Typography** | 98% | Near-universal use of `typography.*` tokens via theme |
| **Spacing Grid** | 95% | 8px grid consistently applied, `spacing.*` tokens used throughout |
| **Animation Springs** | 95% | Standard spring (damping 18, stiffness 150) used everywhere |
| **Shadow Hierarchy** | 90% | 5-level warm shadow system, mostly used via `shadows.*` tokens |
| **Screen Headers** | 100% | Shared `ScreenHeader` component used across all screens |
| **Modal System** | 95% | Unified `Modal` with bottomSheet/fullScreen/centerAlert variants |
| **Empty States** | 95% | Shared `EmptyState` component with multiple variants |
| **Skeleton Loaders** | 95% | Shared `SkeletonLoader` with screen-specific compositions |
| **Dark Mode** | 85% | `useThemeColors()` hook works well; gaps are the hardcoded colors above |

---

## Recommended Fixes (Priority Order)

### P1 — Hardcoded white (#FFFFFF) replacement
- ~30 files, mechanical find-and-replace
- Each `#FFFFFF` or `#ffffff` becomes the appropriate semantic token (`colors.text.inverse`, `colors.background`, or `colors.card`)
- Biggest dark mode improvement for least effort

### P2 — Data file color tokens
- `goalCollections.ts`, `featuredCollections.ts`, `SortBottomSheet/constants.ts`
- Create theme-aware color mapping functions or add semantic tokens
- Fixes dark mode for templates/collections screens

### P3 — Border radius token adoption
- 37 occurrences of `borderRadius: 12` → `borderRadius.button`
- Mechanical replacement, low risk

### P4 — Icon size token adoption
- Replace `size={16}` → `iconSizes.small`, `size={20}` → `iconSizes.medium`, `size={24}` → `iconSizes.large`
- Consider adding `iconSizes.xs: 14` and `iconSizes.md_lg: 18` tokens for the gap sizes, or standardize to nearest token

### P5 — DangerZone.tsx status color tokens
- Create `colors.status.warningLight` / `colors.status.errorLight` semantic tokens for both light and dark mode
- Replace hardcoded rgba() values

---

## Files to Modify

### Theme (new tokens needed)
- `src/theme/iconSizes.ts` — potentially add 14px and 18px tokens
- `src/theme/darkColors.ts` / light colors — add `status.warningLight`, `status.errorLight` semantic tokens

### Components (token adoption)
- ~30 files for #FFFFFF replacement
- ~30 files for borderRadius hardcoding
- ~40+ files for icon size tokens
- 3 data files for dark-mode-aware colors
- 1 file (DangerZone.tsx) for status color tokens
