# Story 1.9.1: Habit Detail Stats Module (Strength/Streak/Calendar)

**Epic:** Epic 1 - MVP Foundation
**Priority:** High
**Status:** 🔴 TODO
**Estimated Effort:** 6-10 hours

---

## User Story

**As a** user building a habit
**I want to** see clear stats (strength, streak, calendar history)
**So that** I understand my progress and stay engaged

---

## Placement Decision

This story implements the **Stats** block immediately below Quick Complete:

- Streak (last 7 days chain + current + best)
- Strength
- Calendar heatmap (last 30 days)
- Stats grid

---

## References

- UX/UI Spec: `docs/ux-habit-detail-redesign.md`
- Current screen: `src/screens/HabitDetailScreen.tsx`
- Components already available:
  - `src/components/StreakChainSection/StreakChainSection.tsx`
  - `src/components/CalendarHeatmap/CalendarHeatmap.tsx`
  - `src/components/StatsGrid/StatsGrid.tsx`
  - `src/components/HabitStrengthSection.tsx`

---

## Prerequisites

- Story 1.9 done (Layout + Quick Complete)
- Streak data exists on habit doc (Story 1.3) ✅

---

## Acceptance Criteria

1. [ ] **Streak section** displays:
   - a) current streak count
   - b) best streak count
   - c) last 7 days chain with “today” highlighted
2. [ ] **Strength section** displays:
   - a) habit strength + level
   - b) a short “what is this?” explainer
3. [ ] **Last 30 days heatmap** displays:
   - a) completed days visually distinct
   - b) missed days visually distinct
   - c) today highlighted
   - d) future days disabled
4. [ ] Tapping a heatmap cell shows **day details** (date + completed/not completed)
5. [ ] **Stats grid** displays:
   - a) total completions
   - b) success rate
   - c) current streak
   - d) days tracking
6. [ ] Stats update after toggling completion from detail screen (optimistic UI preferred)
7. [ ] Empty/fallback states are graceful if a metric is missing
8. [ ] Accessibility:
   - a) heatmap cells have labels describing day + status
   - b) sections have meaningful headings

---

## Data Requirements

- **Today completion**: boolean
- **Last 7 days completion**: boolean[] (oldest → newest)
- **Last 30 days completion**: `{ date: YYYY-MM-DD, completed: boolean }[]`
- **Stats**: totalCompletions, totalMisses (or successRate), createdAt

---

## Out of Scope (for this story)

- Editing/toggling historical days from the heatmap
- Deep drill-down “day detail” screens

---

## Testing Strategy

### Unit Tests

- Date-range utilities for last 7 / last 30
- Derived stats calculations (success rate, days tracking)

### Manual Testing

- Heatmap tap behavior (today vs past vs future)
- Verify stats refresh after completion toggle

---

## Definition of Done

- [ ] Acceptance criteria met
- [ ] Core calculations covered by unit tests

---

**Created:** 2025-12-14




