# Phase 3: Standardize Spacing, Border Radius & Card Consistency

**Goal:** Align all component spacing to the 8pt grid, standardize border radius values, and ensure card styling is consistent across the app.

**Context:** The theme defines an 8pt grid (`xs:4, sm:8, md:12, base:16, lg:24, xl:32, 2xl:48, 3xl:64`) and border radius tokens (`small:8, medium:12, large:16, xl:20, full:9999`). However, many components use non-standard values like 3, 5, 6, 7, 9, 10, 14, 15, 20px for spacing, and border radius values like 14, 24, 9 that don't match tokens.

**Rule of thumb:** Map non-standard values to nearest grid value:

- 3→4 (xs), 5→4 (xs), 6→8 (sm), 7→8 (sm), 9→8 (sm), 10→8 (sm) or 12 (md)
- 14→12 (medium) or 16 (large), 15→16 (base), 20→20 (xl)

---

- [x] **Fix HabitCard border radius and spacing.** HabitCard uses `borderRadius: 14` which doesn't match any theme token. In the HabitCard style files (`HabitCard.styles.ts`, `HabitCard.streakStyles.ts`, `HabitCard.statusStyles.ts`, `HabitCard.actionStyles.ts`):
  - Replace `borderRadius: 14` with `borderRadius.medium` (12) — import `{ borderRadius }` from `@/theme`
  - Replace `paddingVertical: 3` with `spacing.xs` (4)
  - Replace `paddingHorizontal: 10` with `spacing.sm` (8) or `spacing.md` (12) depending on visual intent
  - Replace any other non-standard spacing values with nearest theme token
  - Import `{ spacing, borderRadius }` from `@/theme/spacing` at the top of each file
  - Run `npx eslint src/components/HabitCard/ --fix` to verify
    > **Completed:** Replaced all hardcoded borderRadius and spacing in 3 style files (HabitCard.styles.ts, HabitCard.streakStyles.ts, HabitCard.statusStyles.ts). `actionStyles.ts` had no non-standard values. checkCircle/checkmark `borderRadius: 14` mapped to `borderRadius.full` (9999) since they are 28x28 circular elements. 26 new tests pass.

- [x] **Standardize card shadows across components.** The theme defines `shadows.card` with `elevation: 2, shadowOffset: {height: 2}, shadowOpacity: 0.1, shadowRadius: 8`. Audit and fix these files to use the theme shadow:
  - Search for `shadowOffset`, `shadowOpacity`, `shadowRadius`, `elevation` in `src/components/` (excluding PerformanceDashboard and test files)
  - Replace custom shadow definitions with `...shadows.card` spread from `@/theme/spacing`
  - For components that intentionally need stronger shadows (like FABs or modals), use `shadows.floatingActionButton` or `shadows.modal` respectively
  - For `ArchiveUndoToast` and `DeleteUndoToast` (which use unusual `elevation: 8`), standardize to `shadows.modal` (elevation: 4)
  - Run lint to verify
    > **Completed:** Added `shadows.subtle` token (elevation:1, opacity:0.05, radius:3) for lightweight UI elements. Replaced hardcoded shadows across 43 source files using `...shadows.card` (cards, badges, sections), `...shadows.modal` (toasts, tooltips, skeleton, buttons), `...shadows.floatingActionButton` (SpotlightHero), and `...shadows.subtle` (chips, toggles, confetti, connectors). Custom `shadowColor`/`shadowOpacity` overrides preserved via spread-then-override pattern. Skipped animated shadows (useSharedValue/interpolate), decorative glows, and PerformanceDashboard. 32 new tests pass.

- [x] **Fix TemplateCard spacing violations.** In the TemplateCard component files:
  - `src/components/TemplateCard/components/CategoryBadge.tsx`: Replace `paddingVertical: 5` with `spacing.xs` (4)
  - `src/components/TemplateCard/components/MetadataPills.tsx`: Replace `paddingVertical: 4` with `spacing.xs` (4) — this one is actually correct as 4 matches xs
  - Check all other spacing values in `src/components/TemplateCard/` and align to grid
  - Run lint on the directory
    > **Completed:** Replaced hardcoded spacing and borderRadius across 7 TemplateCard files: `TemplateCard.styles.ts` (card borderRadius→large, margins→lg/sm, accentBar radii→large), `CategoryBadge.tsx` (gap/margin→sm, padding→sm/xs, borderRadius→small), `MetadataPills.tsx` (borderRadius→full, padding→sm/xs, gap/margin→sm), `ActionButtons.tsx` (gap→sm, borderRadius→medium, padding→md/base), `ScienceBox.tsx` (borderRadius→medium, gap→sm, margin/padding→md/sm), `TemplateIcon.tsx` (container borderRadius→medium, glow borderRadius→full), `TemplateCardContent.tsx` (padding→base, margins→sm/md/base, gap→sm). Exported styles from 6 component files for testability. 42 new tests pass.

- [x] **Fix EmojiPickerV2 hardcoded spacing and colors.** In `src/components/EmojiPickerV2/`:
  - `EmojiPickerSheet/SearchBar.tsx`: Replace `'#3b82f6'` focus border with `colors.secondary[500]`, replace `'#a8a29e'` placeholder with `colors.gray[400]`
  - `EmojiGrid/styles.ts`: Replace hardcoded border colors and gray values with theme tokens
  - Check all spacing values (padding, margin, gap) and align to 8pt grid
  - Run `npx eslint src/components/EmojiPickerV2/ --fix`
    > **Completed:** Replaced hardcoded hex colors and spacing across 7 files: `CategoryPills.styles.ts` (gray/inverse colors, spacing, borderRadius.full), `EmojiGrid/styles.ts` (surface/gray colors, secondary[500] selection border, spacing, borderRadius.medium), `EmojiPickerSheet.styles.ts` (gray/surface/border colors, spacing, borderRadius tokens, shadows.modal spread), `SearchBar.tsx` (secondary[500] focus, gray[400] placeholder/clear icon), `SuggestionsSection.tsx` (warning colors, spacing, borderRadius.large), `SuggestionEmojiCell.tsx` (surface color, secondary[500] selection, borderRadius.large), `EmptyState.tsx` (gray[400] icon). Non-standard `paddingHorizontal: 20` → `spacing.lg` (24). Sheet `borderTopRadius: 32` → `borderRadius.xl` (20). Amber `#fef3c7`/`#fcd34d` kept as literals (no warning.100/300 tokens). `#dbeafe` (blue-100) kept as literal (no secondary.100 token). 59 new tests pass.

- [x] **Standardize non-theme border radius values across remaining components.** Search all `.styles.ts` and `.tsx` files in `src/components/` for `borderRadius` values that don't match theme tokens (8, 12, 16, 20, 9999). Fix by mapping to nearest token:
  - `borderRadius: 4` → `borderRadius.small` (8) — unless it's intentionally small (chips/pills), in which case add `borderRadius.xs = 4` to the theme
  - `borderRadius: 6` → `borderRadius.small` (8)
  - `borderRadius: 9` → `borderRadius.small` (8)
  - `borderRadius: 14` → `borderRadius.medium` (12)
  - `borderRadius: 24` → `borderRadius.xl` (20)
  - Skip PerformanceDashboard (debug component) and test files
  - If `borderRadius: 4` is used in 5+ places, add `xs: 4` to `borderRadius` in `src/theme/spacing.ts` first, then reference the token
  - Run full lint: `npx eslint src/components/ --fix`
    > **Completed:** Added `borderRadius.xs` (4) to theme — 13 instances found (11 excl. PerformanceDashboard). Replaced non-standard borderRadius across 41 source files: 4→xs (progress bars, badges, chips, confetti), 6→small (legend dots, containers, buttons), 9/18/28/32/48→full (circular badges, day circles, icon glows where borderRadius=width/2), 10→medium (icon containers, undo buttons, research links), 14→medium (category icon badges), 24→xl (toast containers, icon containers, glow effects). Corner-specific properties (borderTopLeftRadius, etc.) also tokenized. Values 2, 2.5, 3 left as micro-radii literals. 41 new tests pass.
