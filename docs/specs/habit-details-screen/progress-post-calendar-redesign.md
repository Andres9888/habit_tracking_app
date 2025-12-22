# Progress Page Post-Calendar Redesign

## Overview

Redesign the Progress tab content after the CalendarHeatmap to consolidate 4+ expandable cards into 3 focused, actionable sections with improved visual hierarchy and reduced cognitive load.

## Current State

The existing implementation has:
- **HabitStrengthSection** (collapsible) - Ring + levels + tips
- **InsightsSection** (collapsible) with 4 sub-cards:
  - Your Journey (completions, success rate, days tracking)
  - Best Days (bar chart by day of week)
  - Streak Records (top 3 medals)
  - Monthly Trend (this month vs last month)

### Problems
| Issue | Impact |
|-------|--------|
| Visual overload | 4+ cards = excessive scrolling |
| Redundancy | "Your Journey" duplicates header stats |
| No actionability | Data shown without guidance |
| Inconsistent density | Some cards sparse, others cramped |
| Collapsed by default | Key insights hidden behind taps |

## Proposed Design

Consolidate into **3 always-visible sections**:

### Section 1: Your Progress
Combines Habit Strength + actionable guidance.

**Components:**
- Progress ring (88px) with emoji + percentage
- Level badge with trend indicator (+X%)
- Progress bar to next level with emoji markers
- **Actionable tip** based on weak days pattern

**Mockup Reference:** `.superdesign/design_iterations/progress_post_calendar_1.html`

### Section 2: Personal Bests
Combines Streak Records + Best/Worst Days.

**Components:**
- Top 3 streak medals (compact horizontal layout)
- Current streak highlighted with pulse animation + "NOW 🔥" badge
- Best day card (emerald theme)
- "Focus On" card for worst day (amber theme, tappable for tips)

### Section 3: This Month
Combines Best Days chart + Monthly Trend.

**Components:**
- Animated bar chart (7 days, staggered animation)
- Best day highlighted (emerald), worst day highlighted (amber)
- Summary row: "+X% vs last month" + "Y/Z days completed"
- "See All" link for full analytics

## Visual Design

### Color Palette
| Section | Primary | Accent |
|---------|---------|--------|
| Your Progress | Teal-500 | Emerald-400 |
| Personal Bests | Amber-500 | Orange-400 |
| This Month | Violet-500 | Blue-400 |

### Animations
| Element | Animation | Duration |
|---------|-----------|----------|
| Progress ring | Fill from 0 | 1200ms ease-out |
| Bar chart | Scale Y from 0 | 600ms staggered (50ms delay each) |
| Current streak | Pulse glow | 2000ms infinite |
| Tip card | Shake on hover | 500ms |

### Card Style
```css
/* Gradient background */
background: linear-gradient(135deg,
  rgba(primary, 0.08) 0%,
  rgba(255,255,255,0.02) 50%,
  rgba(accent, 0.06) 100%
);
border: 1px solid rgba(primary, 0.2);
border-radius: 16px;
```

## Files to Modify

| File | Changes |
|------|---------|
| `src/screens/HabitDetailScreen.tsx` | Remove collapsible wrappers, integrate new sections |
| `src/components/InsightsSection/InsightsSection.tsx` | Major refactor or replace |
| `src/components/HabitStrengthSection/HabitStrengthSection.tsx` | Extract to new unified component |
| `src/components/ProgressSection/` (new) | Create new consolidated components |

## API/Data Requirements

No new API calls needed. Reuse existing:
- `tracking: HabitTrackingEntry[]`
- `habitCreatedAt: number`
- `totalCompletions: number`
- `successRate: number`
- `daysTracking: number`
- Strength calculation from existing hook

### New Computed Values
```typescript
// Actionable tip generation
function generateActionableTip(dayStats: DayStats[], currentStreak: number): string {
  const weakDays = dayStats
    .filter(d => d.rate < 70)
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 2);

  if (weakDays.length > 0) {
    return `Complete ${weakDays.map(d => d.day).join(' & ')} to level up!`;
  }
  return 'Keep your streak going!';
}
```

---

## Tasks

### Phase 1: Component Architecture

- [x] **T1.1** Create `src/components/ProgressSection/` directory structure ✅ COMPLETED
  - `ProgressSection.tsx` (main container)
  - `YourProgressCard.tsx`
  - `PersonalBestsCard.tsx`
  - `ThisMonthCard.tsx`
  - `index.ts` (exports)
  - **Note:** All files created with full implementation scaffolding including imports, component logic, animations, and accessibility support.

- [x] **T1.2** Extract shared types to `src/components/ProgressSection/types.ts` ✅ COMPLETED
  - `DayStats` interface
  - `StreakRecord` interface
  - `ProgressSectionProps` interface
  - **Note:** Also added `LevelConfig`, `TrendComparison`, `YourProgressCardProps`, `PersonalBestsCardProps`, `ThisMonthCardProps` interfaces for complete type coverage.

- [x] **T1.3** Move calculation functions to `src/components/ProgressSection/utils.ts` ✅ COMPLETED
  - `calculateDayOfWeekStats()`
  - `calculateStreakRecords()`
  - `calculateTrendComparison()`
  - `generateActionableTip()` (new)
  - **Note:** Also added `calculateCurrentStreak()` and `getBestAndWorstDays()` helper functions. All functions include JSDoc documentation.

### Phase 2: YourProgressCard Component

- [ ] **T2.1** Create `YourProgressCard.tsx` with props interface
  ```typescript
  interface YourProgressCardProps {
    strength: number;
    weeklyChange: number;
    actionableTip: string;
    onInfoPress?: () => void;
  }
  ```

- [ ] **T2.2** Implement progress ring (88px) with animated fill
  - Use existing `AnimatedCircle` pattern from HabitStrengthSection
  - 1200ms fill animation with ease-out easing

- [ ] **T2.3** Implement level badge with trend indicator
  - Reuse `getStrengthLevel()` logic
  - Show "+X%" trend with TrendingUp/Down icon

- [ ] **T2.4** Implement progress bar to next level
  - Emoji markers: 🌱 🌿 🌳 💪 ⚡
  - "X% to go" label

- [ ] **T2.5** Implement actionable tip component
  - Teal gradient background
  - 💡 icon + dynamic tip text
  - Chevron for expansion (future)

- [ ] **T2.6** Add gradient background styling
  - `from-teal-50/30 via-white to-emerald-50/30`
  - Border: `border-teal-500/20`

### Phase 3: PersonalBestsCard Component

- [ ] **T3.1** Create `PersonalBestsCard.tsx` with props interface
  ```typescript
  interface PersonalBestsCardProps {
    streakRecords: StreakRecord[];
    currentStreak: number;
    bestDay: DayStats | null;
    worstDay: DayStats | null;
    onWorstDayPress?: () => void;
  }
  ```

- [ ] **T3.2** Implement medal row (top 3 streaks)
  - Horizontal layout with 🥇 🥈 🥉
  - Date labels below each medal
  - Compact card style

- [ ] **T3.3** Implement current streak pulse animation
  - "NOW 🔥" badge
  - 2000ms infinite pulse glow
  - Respect `reduceMotion` preference

- [ ] **T3.4** Implement Best Day card
  - Emerald theme
  - Trophy icon + day name + percentage

- [ ] **T3.5** Implement "Focus On" (worst day) card
  - Amber theme
  - AlertTriangle icon
  - "tap for tips →" hint
  - `onPress` handler for tips modal

- [ ] **T3.6** Add gradient background styling
  - `from-amber-50/30 via-white to-orange-50/30`

### Phase 4: ThisMonthCard Component

- [ ] **T4.1** Create `ThisMonthCard.tsx` with props interface
  ```typescript
  interface ThisMonthCardProps {
    dayStats: DayStats[];
    thisMonthRate: number;
    lastMonthRate: number;
    completedDays: number;
    totalDays: number;
    onSeeAllPress?: () => void;
  }
  ```

- [ ] **T4.2** Implement animated bar chart
  - 7 bars for each day of week
  - Staggered scaleY animation (50ms delay each)
  - 600ms duration

- [ ] **T4.3** Implement bar color coding
  - Best day: `emerald-500`
  - Worst day: `amber-500`
  - Above 70%: `emerald-500/70`
  - 50-70%: `blue-500/60`
  - Below 50%: `amber-500/70`

- [ ] **T4.4** Implement summary row
  - TrendingUp/Down icon with "+X% vs last month"
  - Divider
  - CheckCircle2 icon with "Y/Z days"

- [ ] **T4.5** Implement "See All" button
  - Right-aligned in header
  - Links to full analytics (future)

- [ ] **T4.6** Add gradient background styling
  - `from-violet-50/30 via-white to-blue-50/30`

### Phase 5: Integration

- [ ] **T5.1** Create main `ProgressSection.tsx` container
  - Combine all 3 cards
  - Handle data fetching/computation
  - Pass props to child components

- [ ] **T5.2** Update `HabitDetailScreen.tsx` Progress tab
  - Remove `isStrengthExpanded` and `isInsightsExpanded` states
  - Remove `SectionCard` wrappers for these sections
  - Replace with single `<ProgressSection />` component

- [ ] **T5.3** Remove or deprecate old components
  - Mark `InsightsSection` as deprecated (or delete if unused elsewhere)
  - Keep `HabitStrengthSection` for now (may be used elsewhere)

- [ ] **T5.4** Update imports in `HabitDetailScreen.tsx`
  - Add `ProgressSection` import
  - Remove unused imports

### Phase 6: Polish & Accessibility

- [ ] **T6.1** Add accessibility labels to all interactive elements
  - Cards, buttons, tip areas
  - Announce dynamic values

- [ ] **T6.2** Implement `reduceMotion` support
  - Skip ring fill animation
  - Skip bar chart animation
  - Skip pulse glow

- [ ] **T6.3** Add haptic feedback
  - Light impact on info button press
  - Light impact on "Focus On" card press

- [ ] **T6.4** Test on iOS and Android
  - Verify animations perform well
  - Check color contrast
  - Test with VoiceOver/TalkBack

### Phase 7: Testing

- [ ] **T7.1** Create unit tests for utility functions
  - `calculateDayOfWeekStats()` with edge cases
  - `calculateStreakRecords()` with various patterns
  - `generateActionableTip()` output

- [ ] **T7.2** Create component tests
  - Render tests for each card
  - Props validation
  - Interaction tests for tappable elements

- [ ] **T7.3** Create integration test
  - Full ProgressSection with mock data
  - Verify all sections render correctly

---

## Success Criteria

- [ ] 4+ collapsible cards → 3 always-visible sections
- [ ] Actionable tip displayed based on user patterns
- [ ] Current streak visually highlighted with animation
- [ ] Worst day tappable with clear affordance
- [ ] All animations respect `reduceMotion`
- [ ] No performance regression on scroll
- [ ] Accessibility audit passes

## References

- Mockup: `.superdesign/design_iterations/progress_post_calendar_1.html`
- Current InsightsSection: `src/components/InsightsSection/InsightsSection.tsx`
- Current HabitStrengthSection: `src/components/HabitStrengthSection/HabitStrengthSection.tsx`
