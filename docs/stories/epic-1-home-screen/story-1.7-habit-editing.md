# Story 1.7: Habit Editing & Management

**Epic:** Epic 1 - MVP Foundation
**Priority:** High
**Status:** 🟡 PARTIAL (update mutation exists, UI incomplete)
**Estimated Effort:** 20-25 hours

---

## User Story

**As a** user with existing habits
**I want to** edit, archive, and delete habits
**So that** I can maintain a clean, relevant habit list

---

## Prerequisites

- Story 1.1 complete (habits created) ✅
- Edit UI designed - PENDING

---

## Acceptance Criteria

1. [ ] Long-press habit card reveals context menu: Edit, Archive, Delete
2. [ ] Edit: Opens same form as creation, pre-filled with current values, "Save Changes" CTA
3. [ ] Archive: Removes from active list, preserves data, recoverable from "Archived" section
4. [ ] Delete: Shows confirmation dialog "Are you sure? This will delete all tracking history", requires second tap
5. [ ] Bulk operations: Select multiple habits (checkbox mode), batch archive/delete
6. [ ] Habit reordering: Long-press and drag to reorder list (persists order preference)
7. [ ] Filter view: All (active), Archived, By Category (if categories implemented)

---

## Technical Notes

**Current State:**
- ✅ `update` mutation exists in convex/habits.ts
- ✅ `archive` and `unarchive` mutations exist
- ✅ `delete` mutation exists
- ? Edit UI needs to be built
- ? Context menu needs implementation
- ? Bulk operations need implementation

**Implementation:**
- Mutations: updateHabit ✅, archiveHabit ✅, deleteHabit ✅
- Soft delete: archived flag instead of hard delete for data recovery
- Reordering: Use sortOrder field, update on drag-and-drop
- Animations: Smooth list reordering with LayoutAnimation
- Confirmation dialogs: React Native Alert API

**Key Files to Create/Modify:**
- `src/components/HabitCard/HabitCard.tsx` - Add long-press handler
- `src/components/ContextMenu/HabitContextMenu.tsx` - Context menu (create)
- `src/components/CreateHabitModal/CreateHabitModal.tsx` - Support edit mode ✅
- `src/screens/ArchivedHabitsScreen.tsx` - Archived view (create)
- `src/hooks/useHabitManagement.ts` - Management logic hook (create)

---

## Testing Strategy

**Unit Tests:**
- Edit mutation
- Archive/unarchive mutation
- Delete with confirmation
- Bulk operations logic
- Reordering logic

**Integration Tests:**
- Edit habit → save → verify update
- Archive habit → verify removed from active list
- Unarchive → verify restored
- Delete → verify removed from database
- Bulk delete multiple habits

**Manual Testing:**
- Long-press gesture on various devices
- Context menu usability
- Drag-and-drop reordering smoothness
- Confirmation dialog clarity

---

## Implementation Plan (Week 3)

### Day 12: Edit Habit Modal
- Refactor CreateHabitModal for edit mode
- Pass `habitToEdit` prop to pre-fill
- Change "Create" to "Save" button
- Integrate update mutation

### Day 13: Delete & Archive
- Add "Delete" button in edit modal
- Implement delete confirmation dialog
- Create archive/unarchive functionality
- Add "Archived Habits" section in settings

### Day 14: Habit Management UI
- Add long-press context menu
- Context menu: Edit, Archive, Delete
- Implement drag-to-reorder (optional)
- Add bulk selection mode

### Day 15: Testing & Bug Fixes
- Write integration tests
- Test edge cases
- Fix bugs
- Code review & refactoring

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Unit tests passing (>90% coverage)
- [ ] Integration tests passing
- [ ] Manual testing complete
- [ ] No data loss in edge cases
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Merged to main branch

---

## Sprint Planning

**Week:** Week 3 of Epic 1 Sprint
**Days:** Days 12-15 (Tuesday-Friday)
**Total Effort:** 20-25 hours
**Dependencies:** Story 1.1 (met)

---

## Notes

**UX Considerations:**
- Edit should feel familiar (same form as create)
- Delete should require explicit confirmation
- Archive should be reversible (not destructive)
- Bulk operations should have clear visual feedback

**Performance:**
- Reordering should be instant (optimistic update)
- Deleting 10+ habits should complete in <1 second
- No jank during list animations

---

**Created:** 2025-10-26
**Target Start:** Week 3, Day 2
**Target Complete:** Week 3, Day 5
