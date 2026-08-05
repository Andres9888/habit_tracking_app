# P3: Hardcoded Border Radius & Off-Grid Spacing

Replace raw numeric `borderRadius` values with tokens from `borderRadius.*` and fix off-grid spacing values to align with the 4px grid system.

## Context

Border radius tokens (`import { borderRadius } from '@/theme/spacing'`):

- `borderRadius.xs` = 4 (micro-rounding: progress bars, dots)
- `borderRadius.small` / `borderRadius.chip` = 8 (chips, badges, small elements)
- `borderRadius.medium` / `borderRadius.button` = 12 (buttons, tags, interactive elements)
- `borderRadius.large` / `borderRadius.card` = 16 (cards, containers, inputs)
- `borderRadius.xl` = 24 (modals, bottom sheets)
- `borderRadius.full` = 9999 (pills, avatars, circular buttons)

Spacing tokens (`import { spacing } from '@/theme/spacing'`):

- `spacing.xs` = 4, `spacing.sm` = 8, `spacing.md` = 12, `spacing.base` = 16
- `spacing.lg` = 24, `spacing.xl` = 32, `spacing['2xl']` = 48, `spacing['3xl']` = 64

Off-grid values to fix: `padding: 10` → 8 or 12, `padding: 14` → 12 or 16, `padding: 18` → 16, `padding: 20` → 24 or 16 (choose nearest semantic fit)

---

- [x] **Fix raw borderRadius in `FeedbackModal.styles.ts`.** ~~Read `src/components/FeedbackModal/FeedbackModal.styles.ts`.~~ **SKIPPED:** `FeedbackModal` component does not exist in the codebase. No `FeedbackModal` directory or style file found anywhere under `src/`. The component was likely removed or never created.

- [x] **Fix raw borderRadius in `ComplianceHeatmap/styles/` (2 files).** Read `src/components/ComplianceHeatmap/styles/grid.styles.ts` and `src/components/ComplianceHeatmap/styles/auxiliary.styles.ts`. Replace raw borderRadius: `2` → keep as `2` (sub-token, add comment `// Sub-token: 2px for micro elements`), `12` → `borderRadius.medium`. Add `import { borderRadius } from '@/theme/spacing'` if not present. Ensure TypeScript compiles cleanly. ✅ Replaced 2× `borderRadius: 12` → `borderRadius.medium` in auxiliary.styles.ts, added sub-token comments to 2px values in both files. 5 tests passing.

- [x] **Fix raw borderRadius and off-grid spacing in `CelebrationOverlay.styles.ts`.** ~~Read `src/components/TemplateAddedToast/CelebrationOverlay.styles.ts`.~~ **SKIPPED:** The entire `TemplateAddedToast` directory (including `CelebrationOverlay.styles.ts`) was deleted in a prior commit on the `design-consistency` branch. No files remain to modify.

- [x] **Fix raw borderRadius in `StreakIndicator.styles.ts`.** Read `src/components/StreakIndicator/StreakIndicator.styles.ts`. Replace: `8` → `borderRadius.small`, `12` → `borderRadius.medium`. Add import. Ensure TypeScript compiles cleanly. ✅ Replaced 2× raw borderRadius values with tokens. Added Phase 3 tests (3 new tests). All 13 tests passing.

- [x] **Fix raw borderRadius in `ShareCardGenerator/styles/` (3 files).** Read: `src/components/ShareCardGenerator/styles/container.styles.ts`, `controls.styles.ts`, `shareCardFooter.styles.ts`. Replace: `8` → `borderRadius.small`, `12` → `borderRadius.medium`, `16` → `borderRadius.large`. Also in `container.styles.ts`, replace `colors.light.card` with a theme-aware approach (convert to style-creator function or note for future dark-mode fix). Add imports. Ensure TypeScript compiles cleanly. ✅ Replaced 1× `borderRadius: 12` → `.medium` in container, 1× `12` → `.medium` + 2× `8` → `.small` in controls, 1× `20` → `.xl` in footer scienceBadge. Added TODO comment for `colors.light.card` dark-mode awareness. 5 new Phase 3 tests, 27 total passing.

- [x] **Fix raw borderRadius in `AnalyticsScreen/` (2 files).** Read `src/screens/AnalyticsScreen/AnalyticsScreen.styles.ts` and `src/screens/AnalyticsScreen/components/StatCard.styles.ts`. Replace: `4` → `borderRadius.xs`, `12` → `borderRadius.medium`, `16` → `borderRadius.large`. Add imports. Ensure TypeScript compiles cleanly. ✅ Replaced 1× `borderRadius: 12` → `.medium` in AnalyticsScreen.styles.ts, 3× `borderRadius: 4` → `.xs` + 1× `borderRadius: 16` → `.large` in StatCard.styles.ts. 8 new tests passing.

- [x] **Fix raw borderRadius in `BottomActionBar/BottomActionBar.styles.ts`.** ~~Read `src/features/habits/components/BottomActionBar/BottomActionBar.styles.ts`.~~ **SKIPPED:** `BottomActionBar` component does not exist in the codebase. No files or references found under `src/`. The component was likely removed or never created.

- [x] **Fix raw borderRadius in `WeeklyInsightsCard/` (2 files).** Read `src/components/WeeklyInsightsCard/SuggestedActions.styles.ts` and `src/components/WeeklyInsightsCard/SummarySection.styles.ts`. Replace `8` → `borderRadius.small`. Add import. Ensure TypeScript compiles cleanly. ✅ Replaced 1× `borderRadius: 8` → `borderRadius.small` in SuggestedActions.styles.ts, 1× in SummarySection.styles.ts. Added `borderRadius` to existing spacing imports. 4 new tests passing.

- [x] **Fix raw borderRadius in `TemplateScienceModal/styles/` (6 files).** Read all style files: `youtube.styles.ts`, `skeleton.styles.ts`, `layout.styles.ts`, `section.styles.ts`, `badge.styles.ts`, `header.styles.ts`. Replace: `4` → `borderRadius.xs`, `12` → `borderRadius.medium`, `16` → `borderRadius.large`, `24` → `borderRadius.xl`. Add `import { borderRadius } from '@/theme/spacing'` to each. Ensure TypeScript compiles cleanly. ✅ 3 of 6 files already migrated (youtube, skeleton, badge). Fixed section.styles.ts: 20→`borderRadius.xl`, 12→`borderRadius.medium`. Fixed header.styles.ts: 22→`borderRadius.full` (2× circular buttons). layout.styles.ts: added sub-token comment for 3px dismiss pill. Note: actual `borderRadius.xl` = 20 (not 24 as listed in context). 7 new tests, 27 total passing.

- [x] **Fix raw borderRadius in remaining files.** Read and fix these files: `src/components/Modal/Modal.styles.ts` (4→xs), `src/components/CategoryChip/CategoryChip.styles.ts` (999→`borderRadius.full`), `src/components/FullsizeTemplatePreview/styles/layout.styles.ts` (12→medium, 20→xl or large), `src/components/BinaryHeatmap/BinaryHeatmapNew.styles.ts` (2→keep as constant, 12→medium), `src/components/PredictionInsights/PredictionInsights.styles.ts` (4→xs), `src/screens/auth/components/HeroAnimation/HeroAnimation.styles.ts` (60→`borderRadius.full` if circular). Add imports. Ensure TypeScript compiles cleanly. ✅ Fixed 5 files: CategoryChip `999`→`borderRadius.full`, BinaryHeatmap `12`→`borderRadius.medium` (kept 2px sub-token), PredictionInsights `3`→`borderRadius.full` (circular bullet), HeroAnimation `60`→`borderRadius.full` (circular container), Modal `2`→kept with sub-token comment. FullsizeTemplatePreview layout.styles.ts was already migrated. 8 new tests, 92 total Phase 3 tests passing.
