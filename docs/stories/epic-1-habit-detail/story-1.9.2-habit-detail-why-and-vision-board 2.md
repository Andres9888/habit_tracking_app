# Story 1.9.2: Habit Detail Why + Vision Board (Motivation)

**Epic:** Epic 1 - MVP Foundation
**Priority:** High
**Status:** 🔴 TODO
**Estimated Effort:** 6-12 hours

---

## User Story

**As a** user trying to stay consistent
**I want to** record why I’m doing this habit and build a “vision board”
**So that** I can reconnect with motivation when willpower is low

---

## Placement Decision

- **“Why” teaser** lives in the **Hero** (top of page, always visible).
- **Vision Board** lives **below the Stats block**, as a dedicated Motivation section.

---

## References

- Current screen: `src/screens/HabitDetailScreen.tsx`
- Existing motivation flows already present:
  - `src/components/VisualizationExercise/VisualizationExercise.tsx`
  - `src/components/NotesSection/VisualizationGuide.tsx`

---

## Acceptance Criteria

1. [ ] Habit supports a **Why** value:
   - a) User can add/edit a one-line “Why” (max 120 chars)
   - b) Why is displayed in the Hero as a preview line
   - c) If empty, show an empty state CTA (“Add your why”)
2. [ ] Habit supports a **Vision Board** section:
   - a) Shows 0–6 “vision cards” (text-first MVP)
   - b) Add card flow supports quick entry (title + optional body)
   - c) Remove card supports confirmation
   - d) Empty state explains benefit and prompts adding first card
3. [ ] Motivation section provides access to **Mental Contrasting / Visualization**:
   - a) “Mental Contrasting” launches the existing exercise
   - b) Saved results appear as a vision card (MVP)
4. [ ] Accessibility:
   - a) All CTAs have labels/roles
   - b) Vision cards are readable with Dynamic Type

---

## Technical Notes (MVP guidance)

- Recommend storing motivation in backend:
  1. `why` string on habit document (or a dedicated table)
  2. `visionBoardItems`: array of text items (future: images)
  3. Optional: store mental contrasting outputs and render them as a “vision card”

---

## Out of Scope (for this story)

- Image uploads for vision board (can be Phase 2)
- Full “vision board editor” with drag-and-drop ordering

---

## Testing Strategy

- Verify adding/editing Why persists and renders
- Verify adding/removing vision cards
- Verify mental contrasting save path persists and shows in the vision board

---

## Definition of Done

- [ ] Acceptance criteria met
- [ ] Motivation content persists across app restarts

---

**Created:** 2025-12-14




