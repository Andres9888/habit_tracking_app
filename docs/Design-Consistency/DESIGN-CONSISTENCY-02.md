# Phase 2: Standardize Hardcoded Colors in Core Components

**Goal:** Replace hardcoded hex colors with theme token imports in the most visible and frequently-used components.

**Context:** After Phase 1 unified the theme tokens, this phase migrates the highest-impact components to use those tokens instead of raw hex values. We prioritize by visual prominence: HabitCard (main screen), CreateHabitModal (creation flow), StreakIndicator (gamification), and SettingsModal (settings).

**Pattern to follow:** Import `{ colors }` from `@/theme` or `@/theme/colors`, then replace hardcoded hex values with the matching token. For components using `useAppTheme()`, access via `theme.custom.colors.xxx`.

---

- [x] **Replace hardcoded colors in HabitCard style files.** These files contain hardcoded hex values that should reference `REDESIGN_COLORS` (which now uses theme tokens from Phase 1) or import `colors` directly from `@/theme`:
  - `src/components/HabitCard/HabitCard.statusStyles.ts`: Replace `'#FFFFFF'` with `colors.text.inverse`, and any other hardcoded hex values with their theme equivalents
  - `src/components/HabitCard/HabitCard.actionStyles.ts`: Replace `'#FFFFFF'` with `colors.text.inverse`
  - `src/components/HabitCard/HabitCard.streakStyles.ts`: Ensure all colors reference theme tokens
  - `src/components/HabitCard/components/StreakBadge.tsx`: Replace `'#FEF9C3'` with `colors.milestone.amberLight` (from Phase 1), `'#f5f5f4'` with `colors.gray[100]`
  - Run `npx eslint src/components/HabitCard/ --fix` to verify no lint errors
    > **Done:** Replaced `#FFFFFF` → `colors.text.inverse` in statusStyles & actionStyles, `#10B981` → `colors.primary[500]` in streakStyles, and 6 hardcoded hex values in StreakBadge.tsx with `milestoneColors.*` / `colors.gray[*]` / `colors.border` tokens. Added `milestoneColors.amberText` token for amber-on-amber text. ESLint passes (0 errors). 4 new tests in `habitcard-tokens.test.ts` all pass.

- [x] **Replace hardcoded blue (#3b82f6) in CreateHabitModal components.** The secondary blue color `#3b82f6` appears in ~35 files within CreateHabitModal. It should be `colors.secondary[500]`. Fix these files by importing `{ colors }` from `@/theme` and replacing all instances of `'#3b82f6'` or `'#3B82F6'`:
  - `src/components/CreateHabitModal/components/SimpleReminderSection/ReminderHeader.tsx`
  - `src/components/CreateHabitModal/components/SmartSuggestions/SuggestionChip.tsx`
  - `src/components/CreateHabitModal/components/HeroNameInput/HeroNameInput.tsx`
  - `src/components/CreateHabitModal/components/nameSuggestions.constants.ts`
  - Search for any other `#3b82f6` or `#3B82F6` references in `src/components/CreateHabitModal/` and replace all with `colors.secondary[500]`
  - Run `npx eslint src/components/CreateHabitModal/ --fix` to verify
    > **Done:** Replaced `#3b82f6` → `colors.secondary[500]` in 11 files: ReminderHeader (bell icon + switch track), SuggestionChip (highlighted border), HeroNameInput (active border), PhaseSelector (selected border/text/checkmark via style props), TemplateListItem (microscope icon), CategoryFilters.colors (productivity bgSelected), QuickPicksRow/constants (Read template), SuggestionChips (Drink water), nameSuggestions.constants (Learn something), SmartSuggestions/suggestions.data (Learn something), SuccessAnimation/constants (confetti). Also replaced `#e7e5e4` → `colors.border` in ReminderHeader and SuggestionChip. Left `HABIT_COLORS`/`COLOR_NAMES` (constants.ts) and ColorPickerSheet/colorNames.ts as-is — these are serialized data palette values with `as const`, not styling tokens. ESLint passes (0 errors). 7 new tests in `createhabitmodal-tokens.test.ts` all pass.

- [x] **Migrate StreakIndicator to use theme milestone colors.** In `src/components/StreakIndicator/StreakIndicator.constants.ts`, replace all hardcoded milestone badge colors with imports from the theme's new `milestone` tokens (added in Phase 1):
  - `'#f59e0b'` → `colors.milestone.amber`
  - `'#eab308'` → `colors.milestone.yellow`
  - `'#8b5cf6'` → `colors.milestone.violet`
  - `'#fef3c7'` → `colors.milestone.amberLight`
  - `'#fcd34d'` → `colors.milestone.amberBorder`
  - `'#78350f'` → `colors.milestone.amberDark`
  - `'#a8a29e'` → `colors.milestone.stone`
  - Run lint on the file to verify
    > **Done:** Replaced 10 hardcoded hex values with theme token references: 3 MILESTONE_BADGES colors → `milestoneColors.amber/yellow/violet`, 7 COLORS entries → `milestoneColors.amberLight/amberBorder/amberDark/stone` + `colors.gray[500]`. Kept `#92400e` (amber-800), `#f5f5f4` (stone-100), `#1c1917` (stone-900), `#57534e` (stone-600) as-is — no exact theme token exists for these. ESLint passes (0 errors). 10 new tests in `streakindicator-tokens.test.ts` all pass.

- [x] **Consolidate SettingsModal colors into theme.** The file `src/components/SettingsModal/colors.ts` defines its own color system (`HIGH_CONTRAST` and `DEFAULT` palettes). Replace DEFAULT colors with theme imports: `text` → `colors.text.primary`, `background` → `colors.gray[50]`, `secondaryText` → `colors.gray[500]`, `border` → `colors.gray[100]`. For `HIGH_CONTRAST`, these are accessibility-specific and can stay as-is but should import from a centralized location. Also fix `src/components/SettingsModal/SettingsRow.colors.ts` and `src/components/SettingsModal/SettingsSection.tsx` to use theme border colors. Run `npx eslint src/components/SettingsModal/ --fix`.

  > **Done:** Replaced all DEFAULT_COLORS in `colors.ts` with theme tokens: `accent`/`headerText`/`icon` → `colors.text.primary`, `background` → `colors.gray[50]`, `card` → `colors.light.card`, `cardBorder` → `colors.gray[100]`, `mutedText`/`versionText` → `colors.gray[500]`. Replaced all STANDARD_COLORS in `SettingsRow.colors.ts`: `background` → `colors.light.card`, `border` → `colors.gray[100]`, `chevron`/`value` → `colors.gray[500]`, `label`/`switchTrackTrue` → `colors.text.primary`, `switchThumb` → `colors.text.inverse`, `switchTrackFalse` → `colors.gray[300]`. Updated `SettingsSection.tsx` default branch: `background` → `themeColors.light.card`, `border` → `themeColors.gray[100]`, `title` → `themeColors.gray[500]`. HIGH_CONTRAST palettes left as-is (accessibility-specific). ESLint passes (0 errors). 19 new tests in `settingsmodal-tokens.test.ts` all pass.

- [x] **Replace hardcoded colors in StatsNotesModal.** Fix these files to use theme tokens:
  - `src/components/StatsNotesModal/HabitStats/WeeklyBarChart.tsx`: Replace `'#48bb78'` with `colors.primary[400]` (closest emerald equivalent)
  - `src/components/StatsNotesModal/HabitStats/TrendLineChart.tsx`: Replace green stroke/fill with `colors.primary[500]`, gray SVG fills like `'#78716c'` with `colors.gray[500]`
  - `src/components/StatsNotesModal/HabitStats/StreakCards.tsx`: Replace green text color with `colors.primary[500]`
  - `src/components/StatsNotesModal/NoteEditor/NoteEditor.tsx`: Replace `'#a8a29e'` placeholder color with `colors.gray[400]`
  - Run lint on the directory to verify
    > **Done:** Replaced all hardcoded hex colors in 4 files. WeeklyBarChart: `#48bb78` → `colors.primary[400]`, `#dde3ed` → `colors.gray[200]`, `#78716c` → `colors.gray[500]`. TrendLineChart: `#48bb78` → `colors.primary[400]`, `#dde3ed` → `colors.gray[200]`, `#78716c` → `colors.gray[500]`, `#e7e5e4` → `colors.border`, `#d6d3d1` → `colors.gray[300]`, `#a8a29e` → `colors.gray[400]`. StreakCards: Tailwind arbitrary `text-[#48bb78]` → `style={{ color: colors.primary[400] }}` (2 instances). NoteEditor: `#a8a29e` → `colors.gray[400]` for placeholderTextColor (2 instances). ESLint passes (0 errors). 30 new tests in `statsnotesmodal-tokens.test.ts` all pass.

- [x] **Replace hardcoded colors in StrengthProgressBar.** In `src/components/StrengthProgressBar/StrengthProgressBar.constants.ts`, the gradient colors (`#65a30d`, `#16a34a`, `#0d9488`, `#0891b2`, `#059669`) and their light backgrounds should be consolidated. These represent strength levels and should ideally reference `colors.strength.*` tokens. Map: `starting` → `colors.strength.starting`, `building` → `colors.strength.building`, `developing` → `colors.strength.developing`, `strong` → `colors.strength.strong`, `automatic` → `colors.strength.automatic`. For the light background variants, add them to the `strength` section in `colors.ts` if not already there (e.g., `startingLight: '#dcfce7'`, `buildingLight: '#d1fae5'`, etc.). Run lint to verify.
  > **Done:** Updated `colors.strength` tokens in `core.ts` to match actual StrengthProgressBar values (lime→green→teal→cyan→emerald gradient) and added 5 light background variants (`startingLight`, `buildingLight`, `developingLight`, `strongLight`, `automaticLight`). Replaced 10 hardcoded hex values in `StrengthProgressBar.constants.ts` → `colors.strength.*` tokens. Replaced `#9ca3af` → `colors.gray[400]` (2 instances) in `StrengthProgressBar.styles.ts`. Replaced `#e5e7eb` → `colors.gray[200]` and `'white'` → `colors.text.inverse` in `GradientBar.tsx`. Rebuilt gradient map in `ProgressBarRow.helpers.ts` with computed keys from `colors.strength.*` (old map keys didn't match any LEVELS — was dead code). Updated `colors.test.ts` strength expectations. ESLint passes (0 errors, pre-existing warnings only). 22 new tests in `strengthprogressbar-tokens.test.ts` all pass.
