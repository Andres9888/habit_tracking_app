# Story 1.9: Habit Detail Layout + Quick Complete

**Epic:** Epic 1 - MVP Foundation
**Priority:** High
**Status:** 🔴 TODO
**Estimated Effort:** 6-8 hours

---

## User Story

**As a** user trying to build a habit
**I want to** open a Habit Detail Page where I can immediately complete today's habit and navigate between organized sections
**So that** I reduce friction, reinforce my daily tracking ritual, and easily find related information

---

## Design Mockup

**Reference:** `.superdesign/design_iterations/habit_details_tabbed_1.html`

### Layout Structure

```
┌─────────────────────────────────────┐
│  ←       Habit Name            ✏️   │  Header
├─────────────────────────────────────┤
│         🧘  (icon)                  │
│    ┌─────────────────────────┐      │
│    │   ✓  COMPLETE TODAY     │      │  Hero Section
│    └─────────────────────────┘      │  (Sticky)
│   🔥 12     │  💪 68%  │  ✓ 89%    │  Quick Stats Strip
│   streak    │ strength │  success   │
├─────────────────────────────────────┤
│  [Progress]  [Motivation]  [Manage] │  Tab Bar
├─────────────────────────────────────┤
│                                     │
│  Tab Content Area                   │  Scrollable
│  (scrollable within tab)            │
│                                     │
└─────────────────────────────────────┘
```

### Tab Organization

| Tab | Contents | Purpose |
|-----|----------|---------|
| **Progress** | Streak chain, Calendar heatmap, Habit Strength, Insights | Track & analyze |
| **Motivation** | Why, Identity, Cue, Vision board, Affirmations, Mental exercises | Build commitment |
| **Manage** | Reminders, Frequency, Notes, Pause, Archive, Delete | Settings & actions |

---

## Placement Decision (What goes where)

This story establishes the **complete layout structure**:

1. **Header** (close button, edit button)
2. **Hero Section** (icon, name, description) - sticky
3. **Quick Complete Button** (primary CTA, above the fold) - sticky
4. **Quick Stats Strip** (streak, strength, success rate) - sticky
5. **Tab Navigation** (Progress, Motivation, Manage)
6. **Tab Content Area** (scrollable within selected tab)

Follow-up stories add content to each tab:

- Stats content in Progress tab (Story 1.9.1)
- Why + Vision Board in Motivation tab (Story 1.9.2)
- Notes in Manage tab (Story 1.9.3)
- Manage actions polish (Story 1.9.4)

---

## References

- **Design Mockup:** `.superdesign/design_iterations/habit_details_tabbed_1.html`
- Current screen: `src/screens/HabitDetailScreen.tsx`
- Existing component: `src/components/QuickCompleteButton/QuickCompleteButton.tsx`

---

## Prerequisites

- Habit creation exists (Story 1.1) ✅
- Completion tracking exists (Story 1.2) ✅

---

## Acceptance Criteria

### Header & Hero Section
1. [ ] Header shows:
   - a) Close button (left)
   - b) Edit button (right)
2. [ ] Hero section displays:
   - a) Large habit icon with color background
   - b) Habit name (bold, prominent)
   - c) Optional description/notes preview

### Quick Complete & Stats Strip
3. [ ] **Quick Complete** button is prominent and sticky:
   - a) Full-width button with "Complete Today" label
   - b) Pulse animation when incomplete
   - c) Check icon + green gradient when complete
   - d) Haptic feedback (light for undo, medium for complete)
4. [ ] **Quick Stats Strip** shows 3 key metrics:
   - a) Current streak with fire emoji
   - b) Habit strength percentage
   - c) Success rate percentage
   - d) Each stat is tappable (navigates to relevant detail)
5. [ ] Completion toggling uses optimistic UI:
   - a) Update immediately
   - b) Revert on failure with toast message
   - c) Prevent rapid double-taps (debounce/cooldown)

### Tabbed Navigation
6. [ ] **Tab Bar** with 3 tabs:
   - a) "Progress" tab (default selected)
   - b) "Motivation" tab
   - c) "Manage" tab
   - d) Active tab has underline indicator + color change
7. [ ] Tab switching:
   - a) Smooth fade/slide animation on content change
   - b) Preserves scroll position within each tab
   - c) Tab bar stays visible (sticky below hero)

### Tab Content Structure
8. [ ] **Progress tab** contains placeholders for:
   - a) Streak chain section
   - b) Calendar heatmap section
   - c) Habit strength section
   - d) Insights section
9. [ ] **Motivation tab** contains placeholders for:
   - a) Your Why section
   - b) Your Identity section
   - c) Your Cue section
   - d) Vision Board section
   - e) Affirmations section
   - f) Mental Exercises section
10. [ ] **Manage tab** contains placeholders for:
    - a) Reminders settings
    - b) Frequency settings
    - c) Notes access
    - d) Pause Habit action
    - e) Archive action
    - f) Delete action (destructive styling)

### Accessibility
11. [ ] All interactive elements:
    - a) Have accessibilityLabel/Role/State
    - b) Touch targets meet minimum sizing (44×44pt)
    - c) Tab navigation works with screen readers

---

## Technical Notes

### Existing Components to Reuse
- `QuickCompleteButton` - calls `api.tracking.toggleCompletion`
- `StreakChainSection` - streak visualization
- `CalendarHeatmap` - month heatmap
- `HabitStrengthSection` - strength ring
- `InsightsSection` - analytics

### New Components to Create
- `HabitDetailTabs` - Tab bar navigation component
- `QuickStatsStrip` - 3-stat horizontal strip
- `TabContent` wrapper - manages tab state and animations

### Implementation Approach
1. Refactor `HabitDetailScreen.tsx` to use new tabbed layout
2. Extract sticky hero section as separate component
3. Implement tab navigation with React state or react-native-tab-view
4. Move existing sections into appropriate tabs
5. Current file is 2,221 lines - this refactor should reduce complexity

---

## Out of Scope (for this story)

- Actual content implementation within tabs (handled by Stories 1.9.1-1.9.4)
- Deep linking to specific tabs
- Tab state persistence across sessions

---

## Testing Strategy

### Manual Testing

- Toggle complete/uncomplete repeatedly (ensure debounce)
- Simulate network failure (ensure optimistic revert + user feedback)
- VoiceOver labels for tabs and navigation buttons
- Switch between tabs rapidly (no crashes/glitches)
- Scroll within tabs, switch tabs, verify scroll position preserved
- Verify sticky header stays fixed during scroll

### Device Testing
- Test on iOS and Android
- Test on small screens (iPhone SE) and large screens (iPad)

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Design matches mockup (`.superdesign/design_iterations/habit_details_tabbed_1.html`)
- [ ] No major regressions in Habit Detail screen
- [ ] Smooth 60fps animations on tab switch
- [ ] Works on both iOS and Android

---

**Created:** 2025-12-14
**Updated:** 2025-12-20
**Target Start:** Week 2
**Target Complete:** Week 2




