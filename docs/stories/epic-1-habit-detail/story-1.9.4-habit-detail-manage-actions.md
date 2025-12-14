# Story 1.9.4: Habit Detail Manage Actions + Safety

**Epic:** Epic 1 - MVP Foundation
**Priority:** Medium
**Status:** 🔴 TODO
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

1. [ ] Manage Habit section contains:
   - a) View Full Calendar
   - b) Pause Habit
   - c) Archive
   - d) Delete
2. [ ] Destructive/impactful actions require confirmation:
   - a) Pause
   - b) Archive
   - c) Delete
3. [ ] Copy is clear about consequences (especially delete)
4. [ ] Actions close the detail modal after success
5. [ ] Accessibility:
   - a) buttons have labels/roles
   - b) destructive actions are clearly conveyed

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

- [ ] Acceptance criteria met

---

**Created:** 2025-12-14
