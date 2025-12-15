# Story 1.9: Habit Detail Layout + Quick Complete

**Epic:** Epic 1 - MVP Foundation
**Priority:** High
**Status:** 🔴 TODO
**Estimated Effort:** 4-6 hours

---

## User Story

**As a** user trying to build a habit
**I want to** open a Habit Detail Page where I can immediately complete today’s habit
**So that** I reduce friction and reinforce my daily tracking ritual

---

## Placement Decision (What goes where)

This story establishes the **top-of-screen** experience:

1. **Hero** (identity + optional “Why” teaser)
2. **Quick Complete** (primary CTA, above the fold)

Everything else is added in follow-up stories:

- Stats (Story 1.9.1)
- Why + Vision Board (Story 1.9.2)
- Notes (Story 1.9.3)
- Manage actions polish (Story 1.9.4)

---

## References

- UX/UI Spec (baseline): `docs/ux-habit-detail-redesign.md`
- Current screen: `src/screens/HabitDetailScreen.tsx`
- Existing component: `src/components/QuickCompleteButton/QuickCompleteButton.tsx`

---

## Prerequisites

- Habit creation exists (Story 1.1) ✅
- Completion tracking exists (Story 1.2) ✅

---

## Acceptance Criteria

1. [ ] Habit Detail screen shows:
   - a) Close button
   - b) Edit button
   - c) Hero section (icon, name, optional description)
2. [ ] Hero section includes a **reserved “Why” row**:
   - a) If habit has no “why”, show a subtle CTA (e.g., “Add your why”)
   - b) If habit has a “why”, show a one-line preview
3. [ ] A **Quick Complete** button is visible above the fold:
   - a) Mark complete/uncomplete for today
   - b) Haptic feedback (light for undo, medium for complete)
   - c) Animated state change
4. [ ] Completion toggling uses optimistic UI:
   - a) Update immediately
   - b) Revert on failure
   - c) Prevent rapid double-taps (debounce/cooldown)
5. [ ] The screen structure reserves/anchors section order so follow-up stories can plug in:
   - a) Stats placeholder
   - b) Motivation placeholder
   - c) Notes placeholder
   - d) Manage section remains available
6. [ ] Accessibility:
   - a) Buttons have accessibilityLabel/Role/State
   - b) Touch targets meet minimum sizing (44×44pt)

---

## Technical Notes

- The `QuickCompleteButton` component already exists and calls `api.tracking.toggleCompletion`.
- The screen currently shows strength and manage actions; this story focuses on **making Quick Complete the primary CTA** and establishing layout scaffolding.

---

## Out of Scope (for this story)

- Stats module integration (Story 1.9.1)
- Vision board + persistent “why” storage (Story 1.9.2)
- Notes integration (Story 1.9.3)

---

## Testing Strategy

### Manual Testing

- Toggle complete/uncomplete repeatedly (ensure debounce)
- Simulate network failure (ensure optimistic revert + user feedback)
- VoiceOver labels for CTA and navigation buttons

---

## Definition of Done

- [ ] Acceptance criteria met
- [ ] No major regressions in Habit Detail screen

---

**Created:** 2025-12-14
**Target Start:** Week 2
**Target Complete:** Week 2

