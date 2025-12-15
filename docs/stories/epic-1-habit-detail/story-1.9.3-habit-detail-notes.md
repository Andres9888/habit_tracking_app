# Story 1.9.3: Habit Detail Notes Module

**Epic:** Epic 1 - MVP Foundation
**Priority:** Medium
**Status:** 🔴 TODO
**Estimated Effort:** 4-8 hours

---

## User Story

**As a** user building a habit
**I want to** add notes and quickly review my most recent note
**So that** I can learn what works and reinforce progress

---

## Placement Decision

Notes appear **after Motivation** and before Manage actions.

---

## References

- Existing Notes UI components:
  - `src/components/NotesSection/NotesSection.tsx`
  - `src/components/StatsNotesModal/NotesList.tsx`

---

## Acceptance Criteria

1. [ ] Habit detail shows a **Notes** section:
   - a) Most recent note preview (if exists)
   - b) Total note count badge
   - c) “Add Note” action
2. [ ] “Add Note” opens a note editor flow and saves successfully
3. [ ] If total notes > 1, “View All” is available and opens the full notes list filtered to this habit
4. [ ] Empty state for notes is friendly and prompts adding the first note
5. [ ] Accessibility:
   - a) Buttons have labels/roles
   - b) Content is readable with Dynamic Type

---

## Out of Scope (for this story)

- Rich media notes
- Tagging notes

---

## Testing Strategy

- Add a note and verify it appears as the “recent note”
- Add multiple notes and verify count + View All

---

## Definition of Done

- [ ] Acceptance criteria met

---

**Created:** 2025-12-14

