# Phase 4: Typography, Font & Icon Consistency

**Goal:** Ensure all text rendering uses theme typography tokens and standardize icon usage across the app.

**Context:** The theme defines a complete typography scale (tabBar:10, caption:13, bodySmall:15, body/heading3/button:17, heading2:22, heading1:28, displayLarge:34) with SF Pro font families. However, components use non-standard font sizes (9, 11, 12, 14, 16, 20px), hardcoded font families ('System', 'monospace', 'serif'), and mix two icon libraries (lucide-react-native and @expo/vector-icons/Ionicons).

---

- [x] **Replace hardcoded font families with theme tokens.** Search for `fontFamily:` in `src/components/` (excluding theme/ and test files) and fix:
  - `'System'` → `fontFamilies.primary.text` (in `HabitCard.statusStyles.ts`)
  - `'monospace'` → `fontFamilies.monospace` (in PerformanceDashboard files — skip if debug-only)
  - `'serif'` → `fontFamilies.serif` (in LettersSection, using the new serif token from Phase 1)
  - Any bare `'Inter'` → `fontFamilies.primary.text`
  - Import `{ fontFamilies }` from `@/theme/typography`
  - Run lint to verify
    > **Completed:** Replaced hardcoded font families in 4 files: `HabitCard.statusStyles.ts` ('System' → token), `HabitCard.styles.ts` (3 Platform-conditional 'System'/'Roboto' → token, removed `Platform` import), `ErrorFallback.tsx` ('monospace' → token), `LetterContent.tsx` ('serif' → token). PerformanceDashboard 'monospace' (12 occurrences) intentionally skipped — debug-only component. No bare 'Inter' refs found. 10 new tests pass. Lint clean (only pre-existing warning).

- [x] **Standardize non-theme font sizes to nearest typography variant.** Search for `fontSize:` with non-standard values in `src/components/` (excluding PerformanceDashboard and test files). Map to nearest theme size:
  - `fontSize: 9` → 10 (tabBar) — only if used as a tab/label
  - `fontSize: 11` → 13 (caption) or 10 (tabBar) depending on context
  - `fontSize: 12` → 13 (caption)
  - `fontSize: 14` → 13 (caption) or 15 (bodySmall) depending on context
  - `fontSize: 16` → 15 (bodySmall) or 17 (body)
  - `fontSize: 20` → 22 (heading2)
  - For each change, also update `lineHeight` and `letterSpacing` to match the typography variant
  - Better yet, replace the entire text style block with a spread: `...typography.caption` or `...typography.bodySmall`
  - Run lint to verify no regressions
    > **Completed:** Replaced non-standard fontSize values across 65 component files with `typography.*.fontSize` token references. Mappings: 11→tabBar(10) for badges/compact text, 12→caption(13), 14→bodySmall(15), 16→body(17), 20→heading2(22). StrengthProgressBar SIZE_CONFIG also tokenized (compact/default→caption, large→bodySmall). PerformanceDashboard excluded (debug-only). 37 new tests pass. Lint clean (only pre-existing warnings).

- [x] **Audit and standardize icon sizes.** Establish a standard icon size set aligned with the typography scale. The most common icon sizes should be:
  - **Small (16px)**: Inline with caption text, metadata indicators
  - **Medium (20px)**: Standard inline icons, list items
  - **Large (24px)**: Primary action icons, navigation
  - **XL (32px)**: Feature icons, empty states
  - Search for icon size props (`size={...}`) in `src/components/` and `src/screens/`
  - Document which sizes are used and how many instances of each
  - For close/dismiss icons specifically, standardize to `size={24}` across all modals and sheets
  - This task is research + documentation only — create a list of non-standard icon sizes in a comment at the bottom of the task file, then fix the most egregious outliers (icons smaller than 16px or larger than 48px)
    > **Completed:** Audited ~500 icon size instances across `src/components/` and `src/screens/`. Created `iconSizes` token scale in `src/theme/iconSizes.ts` (micro:10, small:16, medium:20, large:24, xl:32, xxl:48) and re-exported from `src/theme/index.ts`. Standardized 28 close/dismiss X icons from non-standard sizes (22→24, 20→24, 16→24) across modal/sheet headers. Sub-16px icons (size 10/12/14) reviewed — all are intentional micro-badges paired with 10px text; no truly egregious outliers found. No icons > 48px in codebase. 30 new tests pass. See audit below.

- [x] **Standardize close/dismiss button pattern across modals.** Multiple modals implement their own close button with varying sizes (18-24px), colors, and positions. Create a shared pattern:
  - Check if `src/components/Modal/` already exports a close button sub-component
  - If not, the fix is simpler: just ensure all modal headers use consistent icon size (24px) and hit target (44x44pt per Apple HIG)
  - Search for `X` or `Close` icon imports from lucide-react-native in modal-related files
  - Standardize: `<X size={24} color={colors.gray[500]} />` wrapped in a `Pressable` with `{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }` hitSlop
  - Fix in: `CreateHabitModal`, `ArchivedHabitsModal`, `TemplateScienceModal`, `StatsNotesModal`, `SettingsModal`, `PauseHabitModal`
  - Run lint to verify
    > **Completed:** Standardized close/dismiss button pattern across 5 modal files. No shared CloseButton component existed in `src/components/Modal/` — used simpler in-place standardization. Changes: **StatsNotesModal** — replaced unicode ✕ with lucide `X`, expanded 32x32→44x44 hit target. **PausedHabitsModal** — replaced unicode ✕ and ← with lucide `X`/`ChevronLeft`, expanded 32x32→44x44. **CreateHabitModal** — replaced hardcoded `#44403c` → `colors.gray[500]`. **ArchivedHabitsModal** — replaced hardcoded `#78716c`/`#57534e` → `colors.gray[500]`. **TemplateScienceModal** — expanded 40x40→44x44 button size, fixed strokeWidth 2.5→2, replaced `#374151`→`colors.gray[500]`, `#F3F4F6`→`colors.gray[100]`, `#111827`→`colors.gray[900]`. **SettingsModal** skipped — uses ChevronLeft back button, not close/dismiss. **PauseHabitModal** skipped — center alert with Cancel/Confirm buttons, no close X by design. 30 new tests pass. Lint clean (pre-existing warnings only).

---

## Icon Size Audit (Task 3 Results)

### Standard Icon Size Scale (`src/theme/iconSizes.ts`)

| Token  | Size | Use Case                                                        |
| ------ | ---- | --------------------------------------------------------------- |
| micro  | 10px | Badge-inline icons (trend arrows, "PRO" badges, sparkle badges) |
| small  | 16px | Inline with caption text, metadata indicators, chevrons         |
| medium | 20px | Standard inline icons, list items, action buttons               |
| large  | 24px | Primary action icons, navigation, close/dismiss                 |
| xl     | 32px | Feature icons, hero illustrations, step indicators              |
| xxl    | 48px | Empty state illustrations                                       |

### Frequency Distribution

| Size | Count | Standard Token | Notes                                                            |
| ---- | ----- | -------------- | ---------------------------------------------------------------- |
| 10   | 9     | micro          | All intentional: badge-inline with 10px text                     |
| 12   | ~40   | —              | Section header "+Add" icons, trend indicators, badge decorations |
| 14   | ~94   | —              | Most common non-standard; metadata, compact inline icons         |
| 16   | ~131  | small          | Chevrons, settings row icons, metadata indicators                |
| 18   | ~79   | —              | Calendar nav, search icons, template card icons                  |
| 20   | ~143  | medium         | Action buttons, list icons, standard inline                      |
| 22   | 0     | —              | **Eliminated** — was used for close/dismiss, now all 24          |
| 24   | ~49   | large          | Close/dismiss, navigation, primary actions (increased from ~21)  |
| 28   | ~12   | —              | Alert icons, focus icons, back nav in SettingsHeader             |
| 32   | ~9    | xl             | Hero/step icons (Brain, Target, Flame, Sun, CloudRain)           |
| 36   | 1     | —              | LockedLetterView Lock icon                                       |
| 40   | 6     | —              | Feature hero icons (Crown, Link, Brain in auth/paywall)          |
| 48   | 3     | xxl            | Empty state illustrations (EmojiGrid, HabitRankingsList)         |

### Close/Dismiss Icons Fixed (28 files)

All modal/sheet close X icons standardized to `size={24}`:

**From size={22} (14 files):**
FullsizeTemplatePreview/ModalHeader, TemplateScienceModal/ModalHeader, CreateHabitModal/ModalHeader, ArchivedHabitsModal/ModalHeader, StatsNotesModal/VisualizationModal, VisionBoardPreview/PreviewHeader, MotivationPaywall/CloseButton, TemplatePreviewModal/ModalHeader, HabitEditScreen/EditHeader, HabitDetailScreen/DetailHeader, HabitDetailScreen/NotesListModal, HabitDetailScreen/NotesEditorModal, HabitsModals/TemplatesModalSection, HabitsModals/VisualizationModalSection

**From size={20} (11 files):**
QuickActionsSheet/SheetHeader, PremiumBenefitsModal/ModalHeader, CelebrationScreen/ModalHeader, ActivationModalHeader, RescueModeHeader, VisionBoardSection/ViewerHeader, AffirmationScheduleModal/ScheduleHeader, AffirmationEditorModal/EditorHeader, WriteLetterModal/WriteLetterHeader, ReadLetterModal/ReadLetterHeader, EmojiPicker/EmojiPickerHeader

**From size={16} (2 files):**
WOOPExplainerModal, DualVizSetup/ExplainerHeader

**Intentionally left as-is:**

- Search field clear X icons (size={18}): inline clear buttons, not modal dismiss
- DraftRecoveryBanner X (size={18}): inline dismiss, not modal

### Sub-16px Icons — All Intentional

All `size={10}` icons are micro-badges paired with `text-[10px]`: Sparkles in "Perfect!" badge, TrendingUp/Down in delta badges, Lock in "PRO" inline badge, FlaskConical in science badge, Flame in streak count badge, Bell in scheduled count badge, Info in compact info button.

All `size={12}` icons are small decorative elements: section header Plus icons ("+Add" pattern), Star rating icons, Sparkles accents, Lock badges, TrendingUp/Down indicators, schedule Clock icons, ZoomIn overlay icons.
