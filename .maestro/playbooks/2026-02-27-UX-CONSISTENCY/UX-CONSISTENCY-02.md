# UI/UX Consistency Playbook — Phase 02 (Dark-mode and theme adoption)

## Goal

Eliminate hardcoded light-mode color bypasses in known legacy surfaces and route them through existing theme contracts.

## Checklist

- [x] In `src/components/auth/LoadingTimeoutCard.tsx`, migrate all fixed colors to `useThemeColors()` values:
  - Completed using semantic tokens from `useThemeColors()`: `colors.card`, `colors.border`, `colors.text.primary`, `colors.text.secondary`, `colors.primary[600]`, and `colors.text.inverse`. Kept layout and button sizing intact.
  - Replace hardcoded container and text colors with `colors.card`, `colors.border`, `colors.text.primary`, and existing semantic tokens.
  - Preserve layout and button styling.

- [x] In `src/screens/templates/styles/skeletonStyles.ts`, replace all hardcoded background shades with theme-backed values:
  - Use `colors.border` for skeleton fill shades and card surface tokens where appropriate.
  - Kept `borderRadius`, `margin`, and spacing values unchanged.
  - Added `getSkeletonStyles(themeColors)` to support theme-aware style generation; retained default `skeletonStyles` export for compatibility.
  - Implementation details: imported `lightColors` and `SemanticColors`, mapped fill states to `themeColors.border`, and mapped card fill to `themeColors.surface`.

- [x] In `src/screens/templates/styles/previewStyles.ts`, replaced fixed green/YouTube preview hex values with theme token-backed styles:
  - Added `getPreviewStyles(themeColors)` using semantic tokens (`themeColors.primary[700]`, `colors.error`, `colors.errorLight`) and kept existing `previewStyles` as the light-theme compatibility export.
  - Kept layout, spacing, and sizing unchanged; only color sources were migrated.

- [x] In `src/screens/templates/categoryColors.ts`, add dark-theme-safe category colors:
  - Extended category token maps with `CATEGORY_COLORS_DARK` while preserving light-mode `CATEGORY_COLORS` coverage for all category ids.
  - Added `getCategoryColors(isDark: boolean)` and `getDefaultCategoryColors(isDark: boolean)` accessors plus `DEFAULT_CATEGORY_COLORS_DARK`.
  - Updated `src/screens/TemplatesScreen/components/CategoryHeader.tsx` to resolve `catColors` via `useThemeColors().isDark` and new mode-aware helpers.

- [x] In `src/components/SettingsModal/colors.ts`, remove duplicated literal dark-mode color values:
  - Reuse the same semantic values from canonical theme exports (`theme/colors`/`darkColors`) for `DARK_COLORS` and high-contrast text/icon variants.
  - Ensure `getSettingsColors` keeps the same return contracts.
  - Completed by mapping `DARK_COLORS` through `darkColors` tokens and replacing high-contrast text/icon accents with `colors.warning` to avoid literal values while preserving structure.

- [x] In `src/features/habits/components/HabitsEmptyStateMinimal/useEmptyStateColors.ts`, replace light-mode ternaries with token references where those values already exist in the shared palette (for example `colors.gray[100]`, `colors.gray[400]`, `colors.gray[500]`, and `colors.primary[...]`).
  - Completed in `useEmptyStateColors.ts` by replacing exact-match light values (`#D1FAE5`, `#3B82F6`, `#047857`, `#E7E5E4`, etc.) with shared theme tokens while leaving intentional custom values intact where no direct semantic equivalent exists.
  - Kept the existing API shape and visual behavior for intentional custom light-mode literals.

- [x] In `src/components/CalendarTimeline/theme.ts` and `src/components/CalendarTimeline/CalendarTimeline.styles.ts`, consolidate day timeline color sets behind one theme-aware source:
  - Do not maintain separate duplicated high-contrast literals when a single exported source already covers standard/dark/high-contrast mode.
  - Keep existing API stable for consumers.
  - Completed: `CalendarTimeline.styles` now delegates `DEFAULT_COLORS`, `HIGH_CONTRAST_COLORS`, and `getColors` to the centralized `getCalendarTimelineColors` in `CalendarTimeline/theme.ts`; theme source now uses theme tokens (`lightColors`, `darkColors`) and removes stale hardcoded/stale-source imports while preserving public exports/API used by callers.
