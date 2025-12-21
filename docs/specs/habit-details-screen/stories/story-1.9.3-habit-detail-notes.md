# Story 1.9.3: Habit Detail Notes Module

**Epic:** Epic 1 - MVP Foundation
**Priority:** Medium
**Status:** DONE
**Estimated Effort:** 4-8 hours

---

## User Story

**As a** user building a habit
**I want to** add notes and quickly review my most recent note
**So that** I can learn what works and reinforce progress

---

## Placement Decision

Notes appear **after Motivation** (in the Motivation tab, after Mental Exercises section) and before Manage actions.

---

## References

- Existing Notes UI components:
  - `src/components/StatsNotesModal/NotesList.tsx`
  - `src/components/StatsNotesModal/NoteEditor.tsx`
- New component:
  - `src/components/HabitNotesSection/HabitNotesSection.tsx`

---

## Acceptance Criteria

1. [x] Habit detail shows a **Notes** section:
   - a) Most recent note preview (if exists) - Shows the note body truncated to 3 lines with date
   - b) Total note count badge - Amber badge showing count next to "Notes" title
   - c) "Add Note" action - Amber button in header with Plus icon
2. [x] "Add Note" opens a note editor flow and saves successfully
   - Uses existing NoteEditor component with habit pre-selected
   - Supports both creating new notes and editing existing ones
3. [x] If total notes > 1, "View All" is available and opens the full notes list filtered to this habit
   - "View All (n)" button appears below the most recent note preview
   - Opens NotesList modal filtered to this habit
4. [x] Empty state for notes is friendly and prompts adding the first note
   - Shows StickyNote icon with "Record insights to learn what works best"
   - "Add your first note" link is tappable
5. [x] Accessibility:
   - a) Buttons have labels/roles - All buttons have accessibilityLabel and accessibilityRole
   - b) Content is readable with Dynamic Type - Uses system font sizes via NativeWind

---

## Implementation Notes

### New Files Created
- `src/components/HabitNotesSection/HabitNotesSection.tsx` - Main component
- `src/components/HabitNotesSection/index.ts` - Export file
- `src/components/HabitNotesSection/__tests__/HabitNotesSection.test.tsx` - 17 passing tests

### Modified Files
- `src/screens/HabitDetailScreen.tsx`:
  - Added import for HabitNotesSection
  - Added editingNoteId state for editing notes
  - Added handlers: handleOpenNotesEditor, handleOpenNotesList, handleEditNote, handleCloseNotesEditor
  - Updated MotivationTabContent to include habitNotes, onAddNote, onEditNote, onViewAllNotes props
  - Added HabitNotesSection to MotivationTabContent after Mental Exercises section
  - Updated Notes Editor modal to support editing existing notes

### UI Design
- Amber accent color (consistent with notes theme)
- Border-left accent similar to other motivation sections
- Card-based layout with consistent styling

---

## Out of Scope (for this story)

- Rich media notes
- Tagging notes

---

## Testing Strategy

- [x] Add a note and verify it appears as the "recent note"
- [x] Add multiple notes and verify count + View All
- [x] Unit tests: 17 tests covering all acceptance criteria

---

## Definition of Done

- [x] Acceptance criteria met

---

**Created:** 2025-12-14
**Completed:** 2025-12-20
