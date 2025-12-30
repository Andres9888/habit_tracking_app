# ProgressSectionConsolidated

A consolidated progress section component that unifies habit strength, insights, weekly patterns, and streak records into a single, visually cohesive card.

## Overview

This component replaces the previous 3-card design (`YourProgressCard`, `PersonalBestsCard`, `ThisMonthCard`) with a single unified component that provides:

- **~35% reduction in vertical space** compared to the 3-card layout
- **Clear visual hierarchy**: Hero → Insights → Pattern → Action
- **Horizontal scroll insight chips** for key metrics
- **Collapsible streak records** for progressive disclosure
- **Single neutral gradient theme** (vs. 3 different gradients)

### Progress Tab Redesign (Phase 1-3)

The Progress tab has been redesigned with the following new components:

- **TodaysFocusCard** - Contextual motivation at top (7 states: thriving/building/starting/struggling/recovering/completed/celebrating)
- **WeeklySummaryStrip** - Visual 7-day progress view with trend comparison
- **StatsGrid** - Compact 2x2 stats layout with embedded strength ring (replaces HeroStrengthSection + InsightChips)
- **MilestoneProgress** - Gamification component with 9 milestone tiers (3→365 days)
- **TipQuickActionsSheet** - Bottom sheet with contextual quick actions for tips
- **BinaryHeatmap** - GitHub-style binary (on/off) heatmap for habit completion visualization

See: `docs/specs/habit-details-screen/progress-tab-improvements-spec.md`

## Component Structure

```
ProgressSectionConsolidated/
├── ProgressSectionConsolidated.tsx  # Main container
├── TodaysFocusCard.tsx              # Contextual motivation (7 states)
├── TodaysFocusCardTypes.ts          # Focus card types + celebration milestones
├── WeeklySummaryStrip/              # 7-day visual progress
│   ├── index.tsx                    # Main component
│   ├── CardContent.tsx              # Content layout
│   ├── DayCell.tsx                  # Individual day cell
│   ├── WeeklySummaryStripStyles.ts  # Styling constants
│   └── WeeklySummaryStripUtils.ts   # Utility functions
├── WeeklySummaryStripTypes.ts       # Weekly strip types
├── StatsGrid.tsx                    # Compact 2x2 stats layout
├── StatsGridTypes.ts                # Stats grid types
├── CompactStrengthRing.tsx          # 56px strength ring
├── StatCard.tsx                     # Individual stat card
├── MilestoneProgress.tsx            # Gamification progress bar
├── MilestoneProgressTypes.ts        # Milestone types + calculations
├── HeroStrengthSection.tsx          # Progress ring + level info (legacy)
├── InsightChips.tsx                 # Horizontal scroll chips (legacy)
├── WeeklyPatternChart.tsx           # Compact 7-day bar chart
├── ActionableTipCard.tsx            # CTA with personalized tip
├── TipQuickActionsSheet.tsx         # Bottom sheet for quick actions
├── TipQuickActionsSheetTypes.ts     # Quick action types
├── StreakRecordsAccordion.tsx       # Collapsible streak medals
├── TrendIndicator.tsx               # Weekly change indicator
├── AnimatedPercentageText.tsx       # Animated percentage display
├── DayBar.tsx                       # Individual bar in chart
├── types.ts                         # TypeScript interfaces
├── index.ts                         # Module exports
└── __tests__/                       # Unit and integration tests (454+ tests)
```

## Usage

```tsx
import { ProgressSectionConsolidated } from '@/components/ProgressSectionConsolidated';

<ProgressSectionConsolidated
  tracking={habitTracking}
  habitCreatedAt='2024-01-01T00:00:00Z'
  strength={75}
  weeklyChange={5.2}
  onInfoPress={() => showInfoModal()}
  onFocusDayPress={() => showFocusDayTips()}
  onSeeAllPress={() => navigateToAnalytics()}
  onTipPress={() => handleTipAction()}
/>;
```

## Props

| Prop              | Type                   | Required | Description                          |
| ----------------- | ---------------------- | -------- | ------------------------------------ |
| `tracking`        | `HabitTrackingEntry[]` | Yes      | Habit tracking entries               |
| `habitCreatedAt`  | `string`               | Yes      | ISO timestamp when habit was created |
| `strength`        | `number`               | Yes      | Current habit strength (0-100)       |
| `weeklyChange`    | `number`               | No       | Weekly change in strength (+/-)      |
| `onInfoPress`     | `() => void`           | No       | Callback when info button pressed    |
| `onFocusDayPress` | `() => void`           | No       | Callback when focus day chip pressed |
| `onSeeAllPress`   | `() => void`           | No       | Callback when "Details" pressed      |
| `onTipPress`      | `() => void`           | No       | Callback when tip card pressed       |

## Sub-Components

### HeroStrengthSection

Displays the main progress ring (100px) with:

- Animated ring fill (1200ms ease-out)
- Level emoji and badge (Starting Out → Unbreakable)
- Trend indicator showing weekly change
- Progress bar to next level

### InsightChips

Horizontal scroll container with 4 insight chips:

- **Current Streak** 🔥 - Pulse animation when active
- **Best Day** 🏆 - Highest performing day of week
- **Focus Day** ⚡ - Lowest performing day (tappable)
- **Monthly** 📅 - Days completed this month

### WeeklyPatternChart

Compact 7-day bar chart (56px height) with:

- Color-coded bars (emerald=best, amber=focus, stone=normal)
- Staggered bar animations (50ms delay per bar)
- "Details" button for full analytics

### ActionableTipCard

Personalized tip card with:

- Violet gradient background
- Lightbulb icon and tip text
- Optional subtitle for additional context
- Press animation with haptic feedback

### StreakRecordsAccordion

Collapsible section showing:

- Preview text with medal counts (🥇6 🥈5 🥉3)
- Expanded view with full medal details
- Current streak highlighting with "NOW 🔥" badge
- 250ms expand/collapse animation

## Animations

| Element          | Animation             | Duration        | Easing              |
| ---------------- | --------------------- | --------------- | ------------------- |
| Progress Ring    | strokeDashoffset fill | 1200ms          | ease-out (cubic)    |
| Emoji Scale      | scale 0→1             | 300ms + delay   | spring (damping: 8) |
| Insight Chips    | FadeInRight staggered | 50ms delay each | ease-out            |
| Bar Chart        | scaleY 0→1 staggered  | 600ms total     | spring              |
| Streak Accordion | height + opacity      | 250ms           | ease-out            |
| Current Streak   | pulse scale 1→1.05    | 2000ms infinite | ease-in-out         |

All animations respect the `reduceMotion` accessibility preference.

## Accessibility

- All interactive elements have 44x44px minimum touch targets
- Comprehensive VoiceOver/TalkBack labels on all elements
- Accordion state announced to screen readers
- Decorative elements hidden from accessibility tree
- Color contrast ratio ≥ 4.5:1

## Performance

- All components wrapped with `React.memo`
- Module-level constants for animation values
- `useMemo` hooks for derived calculations
- Native thread animations via Reanimated worklets

## Migration from ProgressSection

```tsx
// Old (deprecated)
import { ProgressSection } from '@/components/ProgressSection';
<ProgressSection
  tracking={tracking}
  habitCreatedAt={1704067200000} // Unix timestamp
  strength={75}
  weeklyChange={5.2}
  onInfoPress={handleInfo}
  onWorstDayPress={handleWorstDay} // Renamed
  onSeeAllPress={handleSeeAll}
/>;

// New
import { ProgressSectionConsolidated } from '@/components/ProgressSectionConsolidated';
<ProgressSectionConsolidated
  tracking={tracking}
  habitCreatedAt='2024-01-01T00:00:00Z' // ISO string
  strength={75}
  weeklyChange={5.2}
  onInfoPress={handleInfo}
  onFocusDayPress={handleWorstDay} // Renamed
  onSeeAllPress={handleSeeAll}
  onTipPress={handleTip} // New callback
/>;
```

Key differences:

- `habitCreatedAt` now expects ISO string format (not Unix timestamp)
- `onWorstDayPress` renamed to `onFocusDayPress`
- New `onTipPress` callback for actionable tip interaction

## New Phase Components

### TodaysFocusCard

Contextual motivation card at the top of Progress tab with 7 distinct states:

| State       | Condition                             | Gradient      | Icon         |
| ----------- | ------------------------------------- | ------------- | ------------ |
| Thriving    | streak ≥ 7, weekly ≥ 5                | emerald→teal  | target       |
| Building    | streak 3-6                            | teal→cyan     | trending-up  |
| Starting    | habitAge < 7                          | blue→indigo   | sparkles     |
| Struggling  | streak = 0, weekly < 3                | amber→orange  | heart        |
| Recovering  | streak = 0, bestStreak > 7            | violet→purple | refresh-cw   |
| Completed   | isCompletedToday = true               | green→emerald | check-circle |
| Celebrating | on milestone + completed + first view | amber→gold    | trophy + 🎉  |

Features: Shimmer animation, confetti burst on milestones, goal counting animation, share button.

### WeeklySummaryStrip

Visual 7-day view with states per day:

- **Complete**: `bg-emerald-500` with check icon
- **Missed**: `bg-stone-200` with X icon
- **Today (incomplete)**: `bg-amber-100` with pulsing border
- **Today (complete)**: `bg-emerald-500` with ring highlight
- **Perfect Week (7/7)**: Gradient background + trophy emoji + "Perfect!" badge + sparkle animation

### StatsGrid

Compact 2x2 grid layout with embedded 56px strength ring:

```
┌─────────────┬─────────────────────────────┐
│             │  🔥 14      │  📅 18/21    │
│  Strength   │  Day Streak │  This Month  │
│    Ring     ├─────────────┼──────────────┤
│   (56px)    │  🏆 Tue     │  ⚡ Sat      │
│             │  Best Day   │  Focus Day   │
└─────────────┴─────────────────────────────┘
```

Stat card colors: Streak (orange-50), Monthly (violet-50), Best Day (emerald-50), Focus Day (amber-50)

### MilestoneProgress

Gamification progress bar with 9 milestone tiers:

| Days | Badge | Name              |
| ---- | ----- | ----------------- |
| 3    | ⚡    | Habit Starter     |
| 7    | ⭐    | Week Warrior      |
| 14   | 🔥    | Two Week Titan    |
| 21   | 🏅    | Habit Builder     |
| 30   | 🏆    | Monthly Master    |
| 60   | 💎    | Two Month Diamond |
| 90   | 🌟    | Quarterly Legend  |
| 100  | 💯    | Century Club      |
| 365  | 👑    | Year Hero         |

States: In-progress (with "X days away"), Just-hit (celebration), No-streak (CTA)

### TipQuickActionsSheet

Bottom sheet with contextual quick actions for tips:

- **Focus Day tip**: Set reminder, Edit habit, View history
- **Low streak tip**: Set daily reminder, Make smaller, Review why
- **Good streak tip**: Celebrate, Share progress

## Testing

Run tests with:

```bash
npm test -- --testPathPattern="ProgressSectionConsolidated"
```

Coverage includes:

- **454+ unit tests** for all components
- Integration tests for full component render
- Edge cases (empty data, partial data, power users)
- Accessibility verification
- Animation configuration tests
- Reduce motion preference compliance

## Related Files

- **Spec**: `docs/specs/habit-details-screen/progress-consolidated-redesign.md`
- **Design Mock**: `.superdesign/design_iterations/progress_consolidated_1.html`
- **Previous Implementation**: `src/components/ProgressSection/` (deprecated)
