# Story 1.4: Streak Visual Indicators

**Epic:** Epic 1.1 - Habit Home Screen
**Priority:** High
**Status:** 🔴 TODO
**Estimated Effort:** 6-8 hours

---

## User Story

**As a** user viewing my habits
**I want to** see my current and best streaks displayed visually
**So that** I'm motivated to maintain consistency

---

## Prerequisites

- Story 1.3 complete (streak tracking system) - TODO
- Story 1.2 in progress (habit display on home screen)

---

## Acceptance Criteria

1. [ ] Each habit card displays: 🔥 fire emoji + current streak number
2. [ ] Badge/icon shown for milestone streaks: 7-day (⭐), 30-day (🏆), 100-day (💎)
3. [ ] Best streak displayed in compact format: "Best: 45 days"
4. [ ] Streak count updates immediately after completion
5. [ ] Streak badge animates when milestone reached (celebration effect)
6. [ ] Compact view for habit list (fire emoji + number)
7. [ ] Full view in habit detail screen (current streak, best streak, milestone badges)
8. [ ] Accessibility: Screen reader announces "Meditation habit, 12-day streak, best 45 days"

---

## Technical Notes

**Implementation:**

- Create new `StreakIndicator` component
- Animation library: Reanimated for milestone celebrations
- Color scheme: Fire gradient (orange/red) for active streaks, gray for 0 streaks
- Component props: `currentStreak`, `bestStreak`, `compact` (boolean)

**Milestone Badges:**

```typescript
const MILESTONE_BADGES = {
  7: { emoji: '⭐', label: '7-Day Streak' },
  30: { emoji: '🏆', label: '30-Day Streak' },
  100: { emoji: '💎', label: '100-Day Streak' },
};
```

**Component API:**

```typescript
interface StreakIndicatorProps {
  currentStreak: number; // Current consecutive days
  bestStreak: number; // All-time best
  compact?: boolean; // Compact vs. full view
  onMilestone?: (streak: number) => void; // Celebration callback
}
```

**Visual Design:**

- **0 streak:** Gray fire emoji + "Start your streak!"
- **1-6 days:** 🔥 + number (orange)
- **7-29 days:** 🔥⭐ + number (orange with star badge)
- **30-99 days:** 🔥🏆 + number (gold with trophy badge)
- **100+ days:** 🔥💎 + number (diamond with gem badge)

---

## Testing Strategy

**Unit Tests:**

- [ ] Correct emoji shown for streak count
- [ ] Milestone badges appear at right thresholds
- [ ] Best streak displayed correctly
- [ ] Compact vs. full view rendering

**Visual Tests:**

- [ ] Screenshot tests for streak levels (0, 1, 7, 30, 100)
- [ ] Milestone animation smoothness
- [ ] Color gradients

**Accessibility Tests:**

- [ ] VoiceOver announces streak count and milestone
- [ ] Contrast ratios (WCAG AA)
- [ ] Touch target sizes

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Unit tests passing (>90% coverage)
- [ ] Visual regression tests passing
- [ ] Accessibility tests passing
- [ ] Milestone celebration animation smooth (60fps)
- [ ] Code reviewed
- [ ] Integrated into habit cards on home screen

---

**Created:** 2025-10-27
**Last Updated:** 2025-10-27
