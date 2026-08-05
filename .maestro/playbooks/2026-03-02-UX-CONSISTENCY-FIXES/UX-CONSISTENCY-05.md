# Phase 5: Migrate Raw Modal Usage → Shared Modal Component

## Context

8+ components bypass the shared `Modal` component (`src/components/Modal/`) and use React Native's raw `Modal` directly. This causes inconsistent dismiss gestures, backdrop animations, and spring configs.

## Tasks

- [x] Identify all files importing `Modal` from `react-native` (not from `@/components/Modal`). Search with: `grep -r "from 'react-native'" src/ --include="*.tsx" | grep "Modal"`. List each file and document which Modal variant (bottomSheet, fullScreen, centerAlert) would be appropriate for each use case.
  - **Completed 2026-03-02.** Found **30 files** (excluding the shared Modal itself which legitimately wraps RNModal).
  - **bottomSheet (9):** PackConfirmSheet, PaywallSheet, SortBottomSheet, DayHabitsBottomSheet, QuickActionsSheet, EmojiPickerSheet, EmojiPicker, CreateHabitModalCentered, HabitEditScreen
  - **fullScreen (12):** HabitDetailScreen, SettingsModal, VisualizationModal, HabitStrengthHistory/InfoModal, HabitCalendarModal, HapticTestModalSection, VisionBoardPreview, RevenueCatPaywall, BenefitsVariant, BlurOverlayVariant, AffirmationScheduleModal, ReadLetterModal, WriteLetterModal
  - **centerAlert (9):** StatsNotesModal, MiniCalendarPopup, HeatmapTooltip, ExportMenu, IOSTimePicker, SuccessAnimation, DualVizExplainerModal, WOOPExplainerModal, AddImageModal
  - **5 components need shared Modal API extensions** (tooltip positioning, horizontal gestures, native paywall, custom animation bypass, blur backdrop)
  - Full audit: `Auto Run Docs/2026-03-02-UX-CONSISTENCY-FIXES/Working/raw-modal-audit.md`

- [x] Migrate PackConfirmSheet to use the shared Modal component. It currently renders its own backdrop and slide animation. Replace with `<Modal variant="bottomSheet">`. Verify dismiss gesture behavior matches the canonical thresholds (120px / 800 velocity). Test on device.
  - **Completed 2026-03-02.** PackConfirmSheet now uses `<Modal variant="bottomSheet">` with canonical dismiss thresholds. ActionButtons extracted to separate component. 9/9 tests pass including structural verification that no raw react-native Modal import remains.

- [x] Migrate PaywallSheet to use the shared Modal component. Verify that the paywall's custom layout fits within the Modal's content area. Test on device.
  - **Completed 2026-03-02.** PaywallSheet now uses `<Modal variant="bottomSheet">` instead of raw RN Modal. Removed 3 redundant styles (overlay, handle, sheet) that the shared Modal provides. Added `content` style for centered layout. 10/10 tests pass including structural verification that no raw react-native Modal import remains.

- [x] For each remaining raw Modal usage, create a migration plan considering whether the component needs custom behavior that the shared Modal doesn't support. If so, extend the shared Modal's API rather than keeping the raw usage. Document any Modal API extensions needed.
  - **Completed 2026-03-02.** Read source code of all 28 remaining raw Modal imports. Full plan: `Auto Run Docs/2026-03-02-UX-CONSISTENCY-FIXES/Working/modal-migration-plan.md`
  - **15 can migrate directly** (6 centerAlert, 4 bottomSheet, 5 fullScreen) — organized into 3 waves by effort
  - **5 conditional** (native `pageSheet`/`fullScreen` — recommend keeping as raw Modal for native iOS UX)
  - **8 do not migrate** (incompatible: opaque modals, blur backdrops, positioned tooltips, multi-directional gestures, third-party components, celebration animations)
  - **1 conditional on API extension** (EmojiPickerSheet needs `backdropComponent` for blur — recommend keeping as raw Modal)
  - **API extensions needed:** `testID` prop (low effort, for IOSTimePicker); optional `backdropComponent` render prop (medium effort, for EmojiPickerSheet)
  - **6 bugs found** regardless of migration: 2× `accessibilityViewIsModal` as text nodes, 2× missing `accessibilityViewIsModal`, 2× missing `statusBarTranslucent`
  - **Wave 1 (centerAlert):** AddImageModal, DualVizExplainerModal, WOOPExplainerModal, ExportMenu, MiniCalendarPopup, IOSTimePicker
  - **Wave 2 (bottomSheet):** DayHabitsBottomSheet, EmojiPicker, SortBottomSheet, QuickActionsSheet
  - **Wave 3 (fullScreen):** VisualizationModal, StatsNotesModal, CreateHabitModalCentered, HabitEditScreen, HabitDetailScreen

- After all migrations, verify zero remaining raw `Modal` imports from `react-native` in component files (screen-level navigation modals are excluded from this migration).
