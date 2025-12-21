# Story 1.9.2: Habit Detail Why + Vision Board (Motivation)

**Epic:** Epic 1 - MVP Foundation
**Priority:** High
**Status:** 🟢 DONE
**Estimated Effort:** 6-12 hours

---

## User Story

**As a** user trying to stay consistent
**I want to** record why I'm doing this habit and build a "vision board"
**So that** I can reconnect with motivation when willpower is low

---

## Placement Decision

- **"Why" teaser** lives in the **Hero** (top of page, always visible).
- **Vision Board** lives **below the Stats block**, as a dedicated Motivation section.

---

## References

- Current screen: `src/screens/HabitDetailScreen.tsx`
- Existing motivation flows already present:
  - `src/components/VisualizationExercise/VisualizationExercise.tsx`
  - `src/components/NotesSection/VisualizationGuide.tsx`

---

## Acceptance Criteria

1. [x] Habit supports a **Why** value:
   - a) User can add/edit a one-line "Why" (max 200 chars - increased from 120 for better UX)
   - b) Why is displayed in the Hero as a preview line (rose-colored pill with Heart icon, tappable)
   - c) If empty, show an empty state CTA ("Add your why")
2. [x] Habit supports a **Vision Board** section:
   - a) Shows 0–6 "vision cards" (text-first MVP)
   - b) Add card flow supports quick entry (title + optional body)
   - c) Remove card supports confirmation (long-press triggers delete confirmation)
   - d) Empty state explains benefit and prompts adding first card ("What are you building toward?")
3. [x] Motivation section provides access to **Mental Contrasting / Visualization**:
   - a) "Mental Contrasting" launches the existing exercise
   - b) Saved results appear as a vision card (title: "Mental Contrasting")
4. [x] Accessibility:
   - a) All CTAs have labels/roles (`accessibilityLabel`, `accessibilityRole="button"`)
   - b) Vision cards are readable with Dynamic Type (uses relative text sizing)

---

## Technical Notes (MVP guidance)

- Recommend storing motivation in backend:
  1. `why` string on habit document (or a dedicated table) ✅ Implemented on `habits` table
  2. `visionBoardItems`: array of text items (future: images) ✅ Separate `visionBoardItems` table with `by_habit` index
  3. Optional: store mental contrasting outputs and render them as a "vision card" ✅ Implemented

---

## Out of Scope (for this story)

- Image uploads for vision board (can be Phase 2)
- Full "vision board editor" with drag-and-drop ordering

---

## Testing Strategy

- Verify adding/editing Why persists and renders
- Verify adding/removing vision cards
- Verify mental contrasting save path persists and shows in the vision board

---

## Definition of Done

- [x] Acceptance criteria met
- [x] Motivation content persists across app restarts (stored in Convex backend)

---

## Implementation Notes (2025-12-20)

### Changes Made

1. **Hero Section Enhancement** (`src/screens/HabitDetailScreen.tsx:82-138`)
   - Added `onWhyPress` prop to `HeroSection` component
   - Added "Why" teaser pill in Hero section with Heart icon
   - Displays truncated Why text (max 50 chars preview) or "Add your why" CTA
   - Tapping opens the Why Editor modal

2. **Pre-existing Implementation Verified**
   - Why Editor modal with 200 char limit, templates, and save functionality
   - Vision Board section in Motivation tab with 0-6 card limit
   - Vision Board editor modal for add/edit
   - Delete confirmation on long-press
   - Mental Contrasting exercise that saves to Vision Board
   - Full accessibility labels/roles on all interactive elements

### Files Modified
- `src/screens/HabitDetailScreen.tsx` - Added Why teaser to Hero section

### Backend Support (Pre-existing)
- `convex/schema.ts` - `habits.why` field, `visionBoardItems` table
- `convex/habits.ts` - `update` mutation supports `why` field
- `convex/visionBoard.ts` - CRUD operations for vision board items

---

**Created:** 2025-12-14
**Completed:** 2025-12-20
