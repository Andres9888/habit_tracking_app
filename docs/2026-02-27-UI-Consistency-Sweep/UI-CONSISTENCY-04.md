# Phase 04: Spacing Grid Alignment

**Priority:** P2
**Scope:** Fix off-grid spacing values and standardize card margins
**Context:** The app uses an 8px grid defined in `src/theme/spacing.ts` (xs:4, sm:8, md:12, base:16, lg:24, xl:32, 2xl:48, 3xl:64). Several components use off-grid values like 6px, 2px, 14px, 18px, 20px that break visual rhythm.

## Rules

- All spacing values should be multiples of 4px (matching the grid: 4, 8, 12, 16, 24, 32, 48, 64)
- Import from `src/theme/spacing.ts` using named tokens: `spacing.xs` (4), `spacing.sm` (8), `spacing.md` (12), `spacing.base` (16), `spacing.lg` (24), `spacing.xl` (32)
- Card standard: padding `spacing.base` (16), vertical margin `spacing.sm` (8), horizontal margin `spacing.base` (16)
- Values of 2px should become 4px (spacing.xs), values of 6px should become 8px (spacing.sm)
- Values of 14px should become 12px (spacing.md) or 16px (spacing.base)
- Values of 18px/20px should become 16px (spacing.base) or 24px (spacing.lg)
- Do NOT change spacing inside SVG/canvas rendering (like CompletionRing) where pixel-exact positioning is required

---

- [ ] **Fix HabitCard off-grid margins.** In `src/components/HabitCard/HabitCard.styles.ts`: (1) Line 47: change `marginVertical: 6` to `marginVertical: spacing.sm` (8px), (2) Line 26: change `marginTop: 2` to `marginTop: spacing.xs` (4px), (3) Line 65: change `marginTop: 2` to `marginTop: spacing.xs` (4px). Import `spacing` from `src/theme/spacing.ts`. These are the most visible off-grid values since HabitCard is the main list item.

- [ ] **Fix FeedbackModal off-grid padding.** In `src/components/FeedbackModal/FeedbackModal.styles.ts`: (1) Line 17: change `padding: 20` to `padding: spacing.lg` (24px) - modals should use 24px padding per component spacing standard, (2) Line 108: change `marginTop: 4` to `marginTop: spacing.xs` (4px) - already on grid, just use the token. Import spacing from theme.

- [ ] **Fix TemplateScienceModal off-grid values.** In `src/components/TemplateScienceModal/styles/science.styles.ts`: (1) Line 41: change `marginTop: 14` to `marginTop: spacing.md` (12px) or `spacing.base` (16px), (2) Line 53: change `padding: 18` to `padding: spacing.base` (16px). In `src/components/TemplateScienceModal/styles/section.styles.ts`: (1) Line 46: change `padding: 20` to `padding: spacing.lg` (24px). In `src/components/TemplateScienceModal/styles/skeleton.styles.ts`: (1) Line 15: change `padding: 20` to `padding: spacing.lg` (24px).

- [ ] **Fix CelebrationOverlay off-grid values.** In `src/components/TemplateAddedToast/CelebrationOverlay.styles.ts`: (1) Line 29: `marginTop: 36` - change to `marginTop: spacing.xl` (32px), (2) Line 91: `marginTop: 28` - change to `marginTop: spacing.lg` (24px) or `spacing.xl` (32px). Leave lines 16 (`marginTop: 12` = spacing.md) and 83 (`marginTop: 8` = spacing.sm) as they're on-grid but should use tokens.

- [ ] **Fix MilestoneProgress off-grid values.** In `src/components/ProgressSectionConsolidated/MilestoneProgress/styles/progress.styles.ts`: (1) Line 80: change `marginTop: 6` to `marginTop: spacing.sm` (8px). In `src/components/ProgressSectionConsolidated/MilestoneProgress/styles/noStreak.styles.ts`: (1) Line 17: change `marginTop: 2` to `marginTop: spacing.xs` (4px).

- [ ] **Fix StreakIndicator off-grid values.** In `src/components/StreakIndicator/StreakIndicator.styles.ts`: (1) Line 85: change `marginTop: 2` to `marginTop: spacing.xs` (4px). Line 80 (`marginTop: 4` = spacing.xs) is on-grid but should use the token.

- [ ] **Fix SignInScreen off-grid values.** In `src/screens/auth/SignInScreen.styles.ts`: (1) Line 63: change `marginTop: 6` to `marginTop: spacing.sm` (8px), (2) Line 133: change `marginTop: 6` to `marginTop: spacing.sm` (8px). Lines 21 and 94 (`marginTop: 32` = spacing.xl) are on-grid but should use tokens.

- [ ] **Verify all changes compile.** After all spacing fixes, run `npx tsc --noEmit` across the changed files to ensure no type errors. Also run `npx eslint src/components/HabitCard/HabitCard.styles.ts src/components/FeedbackModal/FeedbackModal.styles.ts` to check for any lint issues introduced.
