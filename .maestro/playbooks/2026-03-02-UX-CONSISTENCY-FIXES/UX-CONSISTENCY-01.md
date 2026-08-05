# Phase 1: Migrate @expo/vector-icons → lucide-react-native (18 files)

## Context

The app uses `lucide-react-native` as its primary icon library (~130+ files), but 18 files in `src/` still import from `@expo/vector-icons` (Ionicons/Feather). This creates visual inconsistency (different icon weights/styles) and bloats the bundle with two icon libraries.

## Icon Mapping Reference

Common Ionicons → lucide equivalents:

- `Ionicons: chevron-down` → `lucide: ChevronDown`
- `Ionicons: chevron-up` → `lucide: ChevronUp`
- `Ionicons: chevron-forward` → `lucide: ChevronRight`
- `Ionicons: checkmark-circle` → `lucide: CheckCircle2`
- `Ionicons: close` → `lucide: X`
- `Ionicons: share-outline` → `lucide: Share2`
- `Ionicons: download-outline` → `lucide: Download`
- `Ionicons: trophy-outline` → `lucide: Trophy`
- `Ionicons: flame-outline` → `lucide: Flame`
- `Ionicons: trending-up` → `lucide: TrendingUp`
- `Ionicons: trending-down` → `lucide: TrendingDown`
- `Ionicons: star` → `lucide: Star`
- `Ionicons: alert-circle` → `lucide: AlertCircle`
- `Ionicons: information-circle` → `lucide: Info`
- `Ionicons: lock-closed` → `lucide: Lock`
- `Feather: check` → `lucide: Check`

## Tasks

- [x] Migrate `src/components/WeeklyInsightsCard/` (5 files: WeeklyInsightsCard.tsx, SummarySection.tsx, HabitListSection.tsx, SuggestedActions.tsx, HabitItem.tsx). Replace `import { Ionicons } from '@expo/vector-icons'` with the equivalent lucide-react-native icons. Check which specific Ionicons icons are used in each file, find the lucide equivalent, update imports and JSX. Run `npx tsc --noEmit` on these files to verify types.

  > ✅ Completed: Migrated all 5 files. Icon mappings: archive→Archive, calendar→Calendar, chevron-up/down→ChevronUp/Down, trending-up/down→TrendingUp/Down, arrow-up-circle→ArrowUpCircle, arrow-down-circle→ArrowDownCircle, warning→AlertTriangle, notifications→Bell, bulb→Lightbulb. Changed HabitListSection `iconName: string` prop to `Icon: LucideIcon` component prop. tsc --noEmit passes with zero errors.

- [x] Migrate `src/components/ProgressSectionConsolidated/` (6 files: StreakRecordsAccordion/AccordionHeader.tsx, MilestoneProgress/NoStreakState.tsx, WeeklySummaryStrip/CardContent.tsx, WeeklySummaryStrip/DayCell.tsx, TodaysFocusCard/components/FocusIcon.tsx, TodaysFocusCard/components/ShareButton.tsx, ActionableTipCard/TipCardContent.tsx). Replace all `@expo/vector-icons` imports with lucide equivalents. Verify with tsc.

  > ✅ Completed: Migrated 7 component files plus 5 supporting type/config files (12 files total). Required architectural changes from string-based to component-based icons in two type systems: (1) WeeklySummaryStrip: `IconName` type → `LucideIcon`, updated `DayStateConfig.icon`, `dayStateConfigs.ts` (checkmark→Check, close→X), `getTrendIcon()` returns (ArrowUp/ArrowDown/Minus), CardContent and DayCell renderers. (2) TodaysFocusCard: `IconName` → `LucideIcon`, updated 7 focus state configs (TrendingUp, Trophy, CheckCircle2, RefreshCw, Sparkles, Heart, Crosshair), FocusIcon renderer. Simple migrations: AccordionHeader (ChevronDown), NoStreakState (CircleArrowRight), ShareButton (Share2), TipCardContent (ChevronRight). tsc --noEmit passes with zero errors in all migrated files.

- [x] Migrate `src/components/StreakChain/StreakChain.tsx` — uses `Feather` icons. Replace with lucide equivalents. Migrate `src/components/HabitRankingsList/HabitRankingItem.tsx` and `src/components/PremiumPaywall/BlurOverlayFeatureList.tsx` and `src/components/PremiumPaywall/BlurOverlayHeader.tsx`. Verify with tsc.

  > ✅ Completed: Migrated 4 component files plus 2 supporting files (types + data). Icon mappings: StreakChain: Feather `link-2`→`Link2`; HabitRankingItem: `warning`→`AlertTriangle`, `flame`→`Flame`, `trophy`→`Trophy`; BlurOverlayHeader: `close`→`X`; BlurOverlayFeatureList: `checkmark-circle`→`CheckCircle2`. Architectural change in PremiumPaywall: removed `IconName` string type and Ionicons import from `PremiumPaywall.types.ts`, changed `AnalyticsFeatureItem.icon` from `IconName` to `LucideIcon`. Updated `analyticsFeatures.ts` from string-based to component-based icons (`infinite`→`Infinity`, `stats-chart`→`BarChart3`, `calendar`→`Calendar`, `bulb`→`Lightbulb`, `trending-up`→`TrendingUp`, `download`→`Download`). tsc confirms zero new errors from migration.

- [x] Migrate `src/screens/AnalyticsScreen/components/ExportButton.tsx` and `src/screens/AnalyticsScreen/components/ExportMenu.tsx`. Replace Ionicons with lucide equivalents. Verify with tsc.

  > ✅ Completed: Migrated 2 files. Icon mappings: ExportButton: `download-outline`→`Download`; ExportMenu: `document-text-outline`→`FileText`, `code-outline`→`Code`. Simple import swap from `@expo/vector-icons` (Ionicons) to `lucide-react-native`. No architectural changes needed — both files used icons directly in JSX with no string-based type system. tsc --noEmit passes with zero errors.

- [x] After all migrations, run `npx tsc --noEmit 2>&1 | grep "vector-icons"` to verify zero remaining imports in `src/`. Run the app's test suite to catch any regressions.
  > ✅ Completed: Zero `@expo/vector-icons` references remain in `src/`. Updated 6 test files in `ProgressSectionConsolidated/__tests__/` that still mocked `@expo/vector-icons`: replaced dead Ionicons mocks with lucide-react-native mocks and updated all `ionicons-*` testID assertions to `lucide-*` equivalents. Icon testID mappings: `ionicons-locate-outline`→`lucide-Crosshair`, `ionicons-trending-up-outline`→`lucide-TrendingUp`, `ionicons-sparkles-outline`→`lucide-Sparkles`, `ionicons-heart-outline`→`lucide-Heart`, `ionicons-refresh-outline`→`lucide-RefreshCw`, `ionicons-checkmark-circle-outline`→`lucide-CheckCircle2`, `ionicons-chevron-forward`→`lucide-ChevronRight`, `ionicons-checkmark`→`lucide-Check`, `ionicons-close`→`lucide-X`, `ionicons-arrow-up`→`lucide-ArrowUp`, `ionicons-arrow-down`→`lucide-ArrowDown`, `ionicons-remove`→`lucide-Minus`, `ionicons-chevron-down`→`lucide-ChevronDown`. Test suite: 4/6 suites pass, 2 pre-existing failures confirmed (WeeklySummaryStrip date-flaky tests, StreakRecordsAccordion reanimated mock issue — both fail identically on unmodified main branch).
