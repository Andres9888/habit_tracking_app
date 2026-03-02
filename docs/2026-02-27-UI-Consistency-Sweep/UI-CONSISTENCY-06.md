# Phase 06: Token Migration (Fonts, Colors, High Contrast)

**Priority:** P2
**Scope:** Replace remaining hardcoded font weights, text colors, and centralize high contrast colors
**Context:** Several components use hardcoded `fontWeight: '600'` instead of `fontWeights.semibold` from theme, use `colors.gray[600]` instead of semantic `colors.text.secondary`, and high contrast colors are scattered across 2+ files with no central definition.

## Rules

- Font weights should use tokens from `src/theme/typography.ts`: `fontWeights.regular` (400), `fontWeights.medium` (500), `fontWeights.semibold` (600), `fontWeights.bold` (700)
- Text colors should prefer semantic tokens: `colors.text.primary`, `colors.text.secondary`, `colors.text.tertiary`, `colors.text.inverse` over direct palette references like `colors.gray[600]`
- High contrast colors should be defined once and imported everywhere
- Do NOT change colors that are intentionally using specific palette shades for visual design (e.g., strength level colors, milestone badge colors)

---

- [ ] **Centralize high contrast colors.** Create `src/theme/highContrastColors.ts` that exports a single `HIGH_CONTRAST_COLORS` object with all the high-contrast values currently scattered across files. Read the current definitions from `src/components/CalendarTimeline/CalendarTimeline.styles.ts` and `src/components/SettingsModal/colors.ts` to collect all high-contrast values (accent: '#facc15', background: '#000000', text: '#111111', etc.). Create the centralized file, then update both CalendarTimeline.styles.ts and SettingsModal/colors.ts to import from the new file instead of declaring locally. The SemanticColors interface pattern should be followed.

- [ ] **Replace hardcoded fontWeight strings in HabitCard.** Search `src/components/HabitCard/` for hardcoded `fontWeight: '600'` or `fontWeight: '700'` strings. Replace with `fontWeight: fontWeights.semibold` or `fontWeight: fontWeights.bold` from `src/theme/typography.ts`. Check files: `HabitCard.styles.ts`, any sub-component style files.

- [ ] **Replace hardcoded fontWeight strings across components.** Search the codebase for `fontWeight: '600'` and `fontWeight: '700'` in style files (exclude theme definition files). For each occurrence, replace with the appropriate `fontWeights.*` token import. Focus on `.styles.ts` files and inline style objects in `.tsx` files. Run: search for pattern `fontWeight: ['"]6` and `fontWeight: ['"]7` in src/ directory (excluding theme/ and node_modules/). Fix each occurrence to use the theme token.

- [ ] **Migrate direct gray palette text colors to semantic tokens.** Search for `colors.gray[500]`, `colors.gray[600]`, `colors.gray[700]`, `colors.gray[800]` used as text colors (e.g., `color: colors.gray[600]`). In most cases these should be replaced with semantic tokens: `colors.gray[800]` -> `colors.text.primary`, `colors.gray[600]`/`colors.gray[500]` -> `colors.text.secondary`, `colors.gray[400]` -> `colors.text.tertiary`. Only change text color usages, NOT background or border usages of gray palette. Focus on the most visible components first: HabitCard, CalendarTimeline, ProgressSection components.

- [ ] **Fix scrollStyles hardcoded shadow color.** In `src/screens/templates/styles/scrollStyles.ts` (line 29), the shadow color `'#2D2A26'` is the correct theme value but hardcoded. Replace with an import: either use `shadows.card` spread from theme, or import the shadow color constant. This is a minor fix but prevents future drift if the shadow color ever changes.

- [ ] **Final type-check and lint verification.** After all Phase 06 changes, run: (1) `npx tsc --noEmit` to verify all files compile, (2) `npx eslint --max-warnings=0` on all changed files to ensure no new lint warnings. Fix any issues found. Create a brief summary of all files changed in this phase.
