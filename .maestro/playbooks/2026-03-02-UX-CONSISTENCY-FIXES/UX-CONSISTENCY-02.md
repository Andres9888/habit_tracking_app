# Phase 2: Create Shared ScreenHeader Component

## Context

Every screen in the app builds its own header with different safe-area padding formulas:

- AnalyticsHeader: `Math.max(insets.top + 8, 16)`
- HabitDetailScreen: `Math.max(insets.top + 4, 12)`
- CharacterScreen: `insets.top + 12` (no guard)
- SeeAllView: bare `insets.top` (no offset)
- SignInScreen: `insets.top + 40`
- TemplatePreviewModal: `insets.top > 0 ? insets.top : 12`

A shared `ScreenHeader` component will unify safe-area handling, back button behavior, and layout.

## Tasks

- [x] Create `src/components/ScreenHeader/` with these files:
  - `ScreenHeader.tsx` — Main component accepting: `title?: string`, `leftAction?: 'back' | 'close' | ReactNode`, `rightAction?: ReactNode`, `variant?: 'default' | 'transparent'`, `onBack?: () => void`. Uses `useSafeAreaInsets()` with the canonical formula: `Math.max(insets.top + 8, 16)`. Renders with `lucide-react-native` icons (ChevronLeft for back, X for close). Includes press animation via the shared `usePressAnimation` hook.
  - `ScreenHeader.types.ts` — TypeScript types.
  - `index.ts` — Barrel export.
    Keep each file under 100 lines per the Code Readability Initiative.
    **Done** — 4 files created (97 code lines in main component), 9 tests passing, zero tsc errors. Commit 0d973eee2.

- [x] Migrate `src/screens/AnalyticsScreen/` header to use the new `ScreenHeader` component. Remove the local `AnalyticsHeader` component if it becomes a thin wrapper. Verify the screen looks identical by running on device/simulator.
      **Done** — Extended ScreenHeader with `subtitle` prop and auto-detecting layout (navigation bar vs screen-title mode). Deleted AnalyticsHeader, replaced with `<ScreenHeader leftAction={null} subtitle="Track your habit journey" title="Analytics" />`. Extracted styles to ScreenHeader.styles.ts. Updated safe-area tests. All 31 tests pass, zero tsc errors. Commit 3a543eac1.

- [x] Migrate `src/screens/HabitDetailScreen/` and `src/screens/CharacterScreen/` headers to use `ScreenHeader`. Remove their local header implementations. Verify with tsc.
      **Done** — CharacterScreen: replaced local ScreenHeader (48 lines) with shared `<ScreenHeader title="Character" onBack={onBack} />`, removed manual safe-area padding. HabitDetailScreen: split DetailHeader (112 lines) into shared `<ScreenHeader variant="transparent" leftAction="close" rightAction={<HeaderButton .../>} />` + new DetailHero.tsx (88 lines, icon/name/streak). Deleted both local header files. Added 8 new tests (6 DetailHero + 2 ScreenHeader integration). All 57 tests pass, zero new tsc errors. Commit da911e724.

- [x] Migrate `src/screens/TemplatesScreen/components/BrowseHeader.tsx` and any SeeAllView/CategoryDrillView inline headers to use `ScreenHeader`. Verify with tsc and test navigation behavior.
      **Done** — Migrated 3 headers: (1) BrowseHeader deleted (54 lines), replaced with `<ScreenHeader leftAction={null} title="Import Habits" subtitle="..." />` in MainBrowseView; removed headerAnimatedStyle prop-drilling chain (4 files); cleaned up useEntranceAnimations. (2) SeeAllView: replaced inline header (ChevronLeft + title/subtitle row + bare `paddingTop: insets.top`) with `<ScreenHeader title="All Popular Templates" subtitle={dynamic count} onBack>`. (3) CategoryDrillView: same migration with dynamic category title. Added 10 new tests (5 per view) verifying ScreenHeader integration, back navigation, dynamic subtitles, and container testIDs. All 30 related tests pass, zero new tsc errors. Net -98 lines. Commit 2de592584.
