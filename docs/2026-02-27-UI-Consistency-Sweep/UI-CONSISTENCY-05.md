# Phase 05: Haptic Feedback & Interaction Polish

**Priority:** P2
**Scope:** Add missing haptic feedback to interactive elements and standardize patterns
**Context:** The app has a well-designed haptics system (`src/utils/haptics/`) with 10 named patterns (tap, toggle, heavy, success, error, warning, selection, streak, celebration, celebrationMajor). However, several interactive elements are missing haptic feedback that similar elements already have.

## Rules

- Import `useHaptics` from `src/utils/haptics/useHaptics.ts`
- Use named patterns from `src/utils/haptics/patterns.ts` - never call expo-haptics directly
- Haptics respect `useReduceMotion()` automatically - no need to check
- `tap` = light impact for button presses
- `selection` = ultra-light for picker scrolling, filter chips
- `toggle` = medium impact for state changes
- Do NOT add haptics to scroll events or continuous gestures
- Every tappable element that triggers a state change should have haptic feedback

---

- [ ] **Add haptic feedback to CalendarTimeline day selection.** In `src/components/CalendarTimeline/components/DayCell.tsx` (or `DayCellContent.tsx`), when a user taps a day cell, trigger `haptics.tap()`. Read the component to find the onPress handler, then add `const { triggerHaptic } = useHaptics();` and call `triggerHaptic('tap')` at the start of the press handler. This matches the feedback pattern used by HabitCard taps.

- [ ] **Standardize category filter chip haptics.** Search the template/filter components for chip/filter interactions: `src/screens/TemplatesScreen/components/FilterControls.tsx` and `src/screens/TemplatesScreen/components/ResearchFilterButton.tsx`. Verify each filter chip tap triggers `triggerHaptic('selection')`. If any are missing the haptic call, add it. The pattern should match the sort chip which already uses selection haptic in `src/features/habits/components/SortChip/SortChip.tsx`.

- [ ] **Add haptic to bottom sheet dismissal.** In `src/features/habits/components/SortBottomSheet/SortBottomSheet.tsx` and `src/components/DayHabitsBottomSheet/` components, when the sheet is dismissed (either by swipe or backdrop tap), trigger `triggerHaptic('tap')`. Find the dismiss/close handler and add the haptic call. Also check `src/components/StatsNotesModal/StatsNotesModal.tsx` for the same pattern.

- [ ] **Fix celebration haptic inconsistency.** In `src/components/HabitCard/`, verify that unchecking a habit (marking incomplete) triggers the `warning` haptic and that checking it triggers `celebration` or `success`. Read the toggle handler code path to ensure the haptic fires on the gesture event, not just on the animation. If the haptic only fires via tapGesture but not via the animation callback, the timing may be off - ensure the haptic fires immediately on the press, before the animation begins.

- [ ] **Add haptic to template import action.** When a user imports a habit template (via the "Add" or "Import" button on template cards/preview), trigger `triggerHaptic('success')`. Check `src/components/TemplateCard/` and `src/screens/TemplatesScreen/` for the import handler and add the haptic call if missing.
