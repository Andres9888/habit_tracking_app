# Phase 1: Unify Color Identity & Theme Tokens

**Goal:** Resolve the dual color identity (orange vs emerald) and ensure the theme files are the single source of truth for all design tokens.

**Context:** The app has two competing color palettes:

- `src/theme/colors.ts` defines emerald green (#10B981) as primary (used by 95%+ of components)
- `global.css` + `tailwind.config.js` define orange (#E85D3B) as `--primary` (CSS/Tailwind layer)
- `src/components/HabitCard/HabitCard.colors.ts` defines `REDESIGN_COLORS` with orange accent

The emerald green palette is dominant and should be the canonical primary. The Tailwind/CSS layer must be synchronized to match.

---

- [x] **Align `global.css` CSS variables with the emerald theme.** In `global.css`, update the `:root` CSS variables to match the emerald-based theme from `src/theme/colors.ts`. Specifically:
  - Change `--primary` from `13 77% 57%` (orange #E85D3B) to the HSL equivalent of emerald #10B981 (which is approximately `160 79% 40%`)
  - Change `--primary-foreground` to `0 0% 100%` (white, stays the same)
  - Change `--ring` from `13 77% 57%` to match the new primary (`160 79% 40%`)
  - Change `--accent` from `13 58% 90%` (#F5DDD6 peach) to the HSL equivalent of emerald-100 (`160 60% 90%`)
  - Keep `--background`, `--foreground`, `--card`, `--muted`, `--border`, `--destructive` as they are (warm stone palette is fine)
  - Verify the file still loads correctly by checking no syntax errors exist in the CSS
    > **Completed:** Updated `--primary` to `160 84% 39%`, `--accent` to `149 80% 90%`, and `--ring` to `160 84% 39%`. Precise HSL computed from #10B981 and #D1FAE5. CSS syntax validated (20 variable declarations, balanced braces). All warm stone palette variables preserved unchanged.

- [x] **Update `tailwind.config.js` accent color to match theme.** In `tailwind.config.js`, change the hardcoded accent color from `'#E85D3B'` to `colors.primary[500]` value (`'#10B981'`), and `accent-muted` from `'#F5DDD6'` to emerald-100 equivalent (`'#D1FAE5'`). The accent.foreground can stay `'#FFFFFF'`. Also verify that `card.foreground` (`#2D2A26`) and `dominant` (`#FAF8F5`) are consistent with `colors.ts` values (`colors.text.primary` is `#1F2937` and `colors.light.background` is `#faf9f7` — update to match if they differ, preferring the theme values).

  > **Completed:** Updated `accent.DEFAULT` from `#E85D3B` → `#10B981`, `accent-muted` from `#F5DDD6` → `#D1FAE5`, `card.foreground` from `#2D2A26` → `#1F2937` (matching `colors.text.primary`), `dominant` from `#FAF8F5` → `#faf9f7` (matching `colors.light.background`), and `secondary-text` from `#2D2A26` → `#1F2937`. No Tailwind utility classes reference these tokens in source, so zero downstream breakage. Pre-existing test failures (110 suites) unchanged.

- [x] **Migrate `HabitCard.colors.ts` to use theme tokens.** Replace the `REDESIGN_COLORS` object in `src/components/HabitCard/HabitCard.colors.ts` to import from `@/theme/colors` instead of hardcoding hex values. Map: `accent` → `colors.primary[500]`, `accentMuted` → `'#D1FAE5'` (emerald-100), `dominant` → `colors.light.background`, `cardSurface` → `colors.light.card`, `cardBg` → `colors.light.surfaceMuted` or `colors.gray[100]`, `secondaryText` → `colors.text.primary`, `metaText` → `colors.gray[500]`, `neutral` → `colors.gray[200]`, `streakText` → `colors.primary[700]`. Update the comment to say "Implements theme color palette" instead of "home-screen-redesign-spec.md". Ensure `REDESIGN_COLORS` is still exported with the same shape so downstream files don't break.

  > **Completed:** Replaced all 9 hardcoded hex values in `REDESIGN_COLORS` with imports from `../../theme/colors`. Mappings: `accent` → `colors.primary[500]` (#10B981), `accentMuted` → `'#D1FAE5'` (literal, no token yet), `cardBg` → `colors.light.surfaceMuted`, `cardSurface` → `colors.light.card`, `dominant` → `colors.light.background`, `metaText` → `colors.gray[500]`, `neutral` → `colors.gray[200]`, `secondaryText` → `colors.text.primary`, `streakText` → `colors.primary[700]`. Comment updated to "Implements theme color palette". Object shape preserved — `HabitCard.styles.ts` and `HabitCard.statusStyles.ts` compile without issues. Pre-existing test failures (110 suites) unchanged; 67/114 HabitCard tests pass (all failures pre-existing Reanimated/GestureHandler mock issues).

- [x] **Add missing theme tokens for milestone/badge colors.** In `src/theme/colors.ts`, add a `milestone` section to the colors object with the badge colors currently hardcoded in `StreakIndicator.constants.ts`: `{ amber: '#F59E0B', yellow: '#EAB308', violet: '#8B5CF6', amberLight: '#FEF9C3', amberBorder: '#FCD34D', amberDark: '#78350F', stone: '#A8A29E' }`. Also add a `serif` entry to `fontFamilies` in `src/theme/typography.ts` with value `'Georgia'` since `LettersSection` uses serif but no theme token exists. Ensure the `colors.ts` file stays under 100 lines by using the existing organization pattern (nested objects). If it would exceed 100 lines, extract the new `milestone` colors into a separate `src/theme/milestone-colors.ts` and re-export from `colors.ts`.

  > **Completed:** Created `src/theme/milestone-colors.ts` with all 7 badge colors (`amber`, `yellow`, `violet`, `amberLight`, `amberBorder`, `amberDark`, `stone`) extracted from `StreakIndicator.constants.ts`. Re-exported `milestoneColors` and `MilestoneColorKey` type from `colors.ts`. Added `serif: 'Georgia'` to `fontFamilies` in `typography.ts` (used by `LettersSection/LetterContent.tsx`). Fixed broken test imports (`../colors` → `@/theme/colors`, `../typography` → `@/theme/typography`). Added 9 new test cases for milestone colors and 1 for serif font — all pass. Pre-existing test failures (9 in colors.test.ts due to warm stone palette divergence from original UX spec) unchanged.

- [x] **Add a `warmPalette` section to `colors.ts` for the warm stone background colors.** The warm stone palette (`#FAF8F5`, `#2D2A26`, `#C4BFB7`, `#E5E2DE`, `#f0eeeb`) is used by HabitCard and the Tailwind config but isn't formally in the theme. Add these as `warm: { background: '#FAF8F5', foreground: '#2D2A26', neutral: '#C4BFB7', border: '#E5E2DE', cardBg: '#f0eeeb' }` inside the colors object. This way, both `REDESIGN_COLORS` and `tailwind.config.js` can reference the same tokens. If `colors.ts` would exceed 100 lines, split into `src/theme/colors/index.ts` (barrel), `src/theme/colors/core.ts`, and `src/theme/colors/semantic.ts`.
  > **Completed:** Split `src/theme/colors.ts` (93 code lines, at the 100-line limit) into `src/theme/colors/` directory: `core.ts` (76 code lines — main colors object), `semantic.ts` (warm palette with 5 tokens: `background` #FAF8F5, `foreground` #2D2A26, `neutral` #C4BFB7, `border` #E5E2DE, `cardBg` #f0eeeb), and `index.ts` (barrel re-exporting `colors`, `warmPalette`, `milestoneColors` + all types). All ~50 existing `from '../../theme/colors'` imports continue to resolve via directory-as-module pattern (no consumer changes needed). Added 8 new test cases for warm palette (7 value tests + 1 structural). Pre-existing test failures (9 in colors.test.ts, 2 broken import suites) unchanged. Updated `tailwind.config.js` comment to reference `src/theme/colors/semantic.ts`.
