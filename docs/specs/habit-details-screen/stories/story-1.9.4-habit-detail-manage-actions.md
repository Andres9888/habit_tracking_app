# Story 1.9.4: Habit Detail Manage Actions + Safety

**Epic:** Epic 1 - MVP Foundation
**Priority:** Medium
**Status:** 🟢 DONE
**Estimated Effort:** 3-6 hours

---

## User Story

**As a** user
**I want to** manage my habit safely from the detail page
**So that** I can edit, pause, archive, or delete without mistakes

---

## Placement Decision

Manage actions are the **last** section on the page (lowest frequency, highest risk).

---

## References

- Current screen: `src/screens/HabitDetailScreen.tsx`

---

## Acceptance Criteria

1. [x] Manage Habit section contains:
   - a) View Full Calendar ✅ Added ActionButton with Calendar icon
   - b) Pause Habit ✅
   - c) Archive ✅
   - d) Delete ✅
2. [x] Destructive/impactful actions require confirmation:
   - a) Pause ✅ Alert.alert with clear messaging
   - b) Archive ✅ Alert.alert with clear messaging
   - c) Delete ✅ Alert.alert with clear messaging
3. [x] Copy is clear about consequences (especially delete)
   - Pause: "This habit will be hidden from your daily list. You can unpause it anytime from Settings."
   - Archive: "Archived habits are moved to your archive but keep their history."
   - Delete: "This will permanently delete this habit and all its history. This cannot be undone."
4. [x] Actions close the detail modal after success
   - All actions call onClose() after their respective callbacks
5. [x] Accessibility:
   - a) buttons have labels/roles ✅ accessibilityLabel and accessibilityRole="button"
   - b) destructive actions are clearly conveyed ✅ Enhanced accessibility labels include "This is a destructive action." for destructive variants

---

## Out of Scope (for this story)

- Bulk operations (multi-select)
- Drag-and-drop reorder

---

## Testing Strategy

- Verify confirmation dialogs appear
- Verify actions execute and the detail modal closes

---

## Definition of Done

- [x] Acceptance criteria met

---

## Implementation Notes

**Completed:** 2025-12-20

### Changes Made:
1. **Added View Full Calendar action** (`src/screens/HabitDetailScreen.tsx:791-798`)
   - Added ActionButton with Calendar icon before the divider
   - Uses existing `onOpenCalendar` handler which closes modal and navigates to calendar

2. **Enhanced accessibility for destructive actions** (`src/screens/HabitDetailScreen.tsx:162-165`)
   - ActionButton now builds descriptive accessibility labels that include subtitle text
   - Destructive actions explicitly announce "This is a destructive action." for screen readers

3. **Added test suite** (`src/screens/__tests__/HabitDetailScreen.ManageActions.test.tsx`)
   - 22 tests covering all acceptance criteria
   - Tests confirmation dialogs, copy clarity, modal close behavior, and accessibility

---

**Created:** 2025-12-14




