---
type: analysis
title: Raw Modal Import Audit - react-native Modal Bypass
created: 2026-03-02
tags:
  - ux-consistency
  - modal-migration
  - phase-5
related:
  - '[[UX-CONSISTENCY-05]]'
---

# Raw `Modal` Import Audit

## Summary

**30 files** import `Modal` from `react-native` instead of using the shared `Modal` component at `src/components/Modal/`. One additional file (`src/components/Modal/Modal.tsx`) legitimately wraps `RNModal` and is excluded.

## Classification by Recommended Variant

### bottomSheet (9 files)

Bottom sheet modals slide up from the bottom, often with gesture-to-dismiss.

| File                                                                 | Current Pattern                                           | Notes                                |
| -------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------ |
| `src/components/PackConfirmSheet/PackConfirmSheet.tsx`               | `animationType="slide"`, semi-transparent overlay         | List of habits to add from pack      |
| `src/components/PaywallSheet/PaywallSheet.tsx`                       | `animationType="slide"`, semi-transparent overlay         | Premium upgrade offer with CTA       |
| `src/features/habits/components/SortBottomSheet/SortBottomSheet.tsx` | Pan gesture + spring animations, animated backdrop        | Sort options with quick filter chips |
| `src/components/DayHabitsBottomSheet/DayHabitsBottomSheet.tsx`       | Pan gesture + spring animations, animated backdrop        | Habit list for a specific day        |
| `src/components/QuickActionsSheet/QuickActionsSheet.tsx`             | Spring entry/exit animations, fade overlay                | Habit action menu                    |
| `src/components/EmojiPickerV2/EmojiPickerSheet/EmojiPickerSheet.tsx` | Pan gesture, BlurView backdrop, search animations         | Emoji selection interface            |
| `src/components/EmojiPicker/EmojiPicker.tsx`                         | `animationType="slide"`, `transparent`, 85% height        | Emoji grid with categories/search    |
| `src/components/CreateHabitModal/CreateHabitModalCentered.tsx`       | `animationType="slide"`, swipe-to-dismiss gesture         | Habit creation form                  |
| `src/screens/HabitEditScreen/HabitEditScreen.tsx`                    | `animationType="slide"`, dark overlay, stagger animations | Edit form with sections              |

### fullScreen (12 files)

Full-screen modals take over the entire display, typically with slide or fade entry.

| File                                                                                                       | Current Pattern                                           | Notes                              |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ---------------------------------- |
| `src/screens/HabitDetailScreen/HabitDetailScreen.tsx`                                                      | `animationType='slide'`, dark overlay, rounded top        | Habit detail view with hero        |
| `src/components/SettingsModal/SettingsModal.tsx`                                                           | `animationType="slide"`, fills screen                     | Settings content with scrolling    |
| `src/components/StatsNotesModal/NotesList/components/VisualizationModal.tsx`                               | `animationType="slide"`, gradient background              | Visualization guide with scrolling |
| `src/components/HabitStrengthHistory/InfoModal/index.tsx`                                                  | `animationType="slide"`, `presentationStyle="pageSheet"`  | Information cards about strength   |
| `src/components/HabitCalendarModal/HabitCalendarModal.tsx`                                                 | `animationType="slide"`, fills screen                     | Calendar, stats, activity log      |
| `src/features/habits/components/HabitsModals/HapticTestModalSection.tsx`                                   | `animationType="slide"`, no backdrop                      | Haptic testing debug UI            |
| `src/components/VisionBoardPreview/VisionBoardPreview.tsx`                                                 | Full-screen with pan gestures (swipe left/right/down)     | Vision board image viewer          |
| `src/components/RevenueCatPaywall/RevenueCatPaywall.tsx`                                                   | `presentationStyle='fullScreen'`, `animationType='slide'` | RevenueCat native paywall          |
| `src/components/PremiumPaywall/BenefitsVariant.tsx`                                                        | `presentationStyle='pageSheet'`, `animationType='slide'`  | Premium benefits list              |
| `src/components/PremiumPaywall/BlurOverlayVariant.tsx`                                                     | `animationType='slide'`, BlurView + dark overlay          | Premium features with pricing      |
| `src/components/MotivationSystem/Workshop/AffirmationScheduleModal/AffirmationScheduleModal.tsx`           | `presentationStyle='pageSheet'`, `animationType='slide'`  | Schedule form                      |
| `src/components/MotivationSystem/Workshop/LettersSection/components/ReadLetterModal/ReadLetterModal.tsx`   | `presentationStyle='fullScreen'`, `animationType='fade'`  | Time capsule letter viewer         |
| `src/components/MotivationSystem/Workshop/LettersSection/components/WriteLetterModal/WriteLetterModal.tsx` | `presentationStyle='pageSheet'`, `animationType='slide'`  | Multi-step letter writing form     |

### centerAlert (9 files)

Centered dialog/alert modals appear in the center of the screen with a fade/scale animation.

| File                                                                                         | Current Pattern                                              | Notes                         |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------- |
| `src/components/StatsNotesModal/StatsNotesModal.tsx`                                         | `animationType="fade"`, semi-transparent overlay, inset card | Tabbed stats/notes content    |
| `src/components/CalendarTimeline/components/MiniCalendarPopup.tsx`                           | `animationType="fade"`, semi-transparent overlay, fixed card | Month calendar navigation     |
| `src/components/BinaryHeatmap/HeatmapTooltip.tsx`                                            | Scale + opacity animations, tooltip with arrow               | Single-line heatmap tooltip   |
| `src/screens/AnalyticsScreen/components/ExportMenu.tsx`                                      | `animationType="fade"`, semi-transparent overlay             | Export format options         |
| `src/components/CreateHabitModal/components/TimePickerModal/IOSTimePicker.tsx`               | `animationType='fade'`, centered, dark overlay               | Time picker spinner           |
| `src/components/CreateHabitModal/components/SuccessAnimation/SuccessAnimation.tsx`           | `animationType='none'`, confetti + success card              | Success celebration animation |
| `src/components/MotivationSystem/Workshop/DualVizSetup/components/DualVizExplainerModal.tsx` | `animationType='fade'`, centered card in dark overlay        | Educational explainer         |
| `src/components/MotivationSystem/Workshop/WOOPSection/WOOPExplainerModal.tsx`                | `animationType='fade'`, centered card in dark overlay        | WOOP method explainer         |
| `src/components/MotivationSystem/Workshop/VisionBoardSection/AddImageModal.tsx`              | `animationType='fade'`, centered card in dark overlay        | Image source selection        |

## Special Considerations

### Components Requiring Shared Modal API Extensions

1. **HeatmapTooltip** — Uses positioned tooltip with arrow pointer. May need a `tooltip` variant or custom positioning support in the shared Modal.

2. **VisionBoardPreview** — Uses custom horizontal swipe gestures (not just vertical dismiss). May need horizontal gesture support in fullScreen variant.

3. **RevenueCatPaywall** — Wraps a native RevenueCat component; migration may conflict with RevenueCat's own presentation logic.

4. **SuccessAnimation** — Uses `animationType='none'` and manages all animations internally (confetti particles, card reveal). The shared Modal's built-in animations would conflict unless bypassed with `skipAnimation`.

5. **EmojiPickerSheet** — Uses `BlurView` as backdrop instead of semi-transparent overlay. Shared Modal may need a `backdropBlur` prop.

### Components Already Using Good Patterns

- `SortBottomSheet`, `DayHabitsBottomSheet`, `QuickActionsSheet` — Already have gesture-based dismiss with spring animations, just not using the shared component.

### Low-Risk Migrations (Start Here)

These files use the simplest patterns (basic `animationType` + overlay) and would benefit most from migration:

1. **PackConfirmSheet** — Simple slide + overlay, no custom gestures
2. **PaywallSheet** — Simple slide + overlay, no custom gestures
3. **ExportMenu** — Simple fade + overlay, tap-to-dismiss
4. **IOSTimePicker** — Simple fade + centered card
5. **DualVizExplainerModal** — Simple fade + centered card
6. **WOOPExplainerModal** — Simple fade + centered card
7. **AddImageModal** — Simple fade + centered card

## Statistics

| Category                  | Count |
| ------------------------- | ----- |
| Total raw Modal imports   | 30    |
| Recommended: bottomSheet  | 9     |
| Recommended: fullScreen   | 12    |
| Recommended: centerAlert  | 9     |
| Low-risk (easy migration) | 7     |
| Needs API extension       | 5     |
