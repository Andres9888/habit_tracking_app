# Progress Section - Unified Feature Specification

## Document Overview

**Feature Area:** Habit Detail Screen → Progress Tab
**Status:** Active Development
**Version:** 3.0
**Last Updated:** 2024-12-28

This document consolidates all Progress section features including the calendar heatmap, stats displays, insights, and planned enhancements.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Feature Inventory](#2-feature-inventory)
3. [Calendar Heatmap System](#3-calendar-heatmap-system)
4. [Progress Stats & Insights](#4-progress-stats--insights)
5. [Technical Architecture](#5-technical-architecture)
6. [API Reference](#6-api-reference)
7. [Design Mockups](#7-design-mockups)
8. [Future Roadmap](#8-future-roadmap)

---

## 1. Executive Summary

### Purpose

The Progress section provides users with comprehensive habit tracking analytics through:
- **Visual history** via interactive calendar heatmaps
- **Performance metrics** including streaks, completion rates, and trends
- **Behavioral insights** identifying patterns and focus areas
- **Actionable guidance** with tips and reminders

### Key Differentiators vs Competitors

| Feature | Habit Hard | HabitKit | Streaks | Done |
|---------|------------|----------|---------|------|
| Multi-view calendar | ✅ 4 views | ✅ 3 views | ❌ 1 view | ❌ 1 view |
| Instant tap-toggle | ✅ Animated | ✅ Basic | ✅ Basic | ❌ No |
| Streak visualization | ✅ Records + Current | ✅ Current only | ✅ Current | ❌ None |
| Day-of-week analysis | ✅ Full chart | ❌ None | ❌ None | ❌ None |
| Actionable insights | ✅ AI-powered tips | ❌ None | ❌ None | ❌ None |
| Premium year view | ✅ Gated | ✅ Gated | ❌ N/A | ❌ N/A |

---

## 2. Feature Inventory

### 2.1 Implemented Features ✅

| Feature | Component | Status | Spec Reference |
|---------|-----------|--------|----------------|
| Calendar Heatmap (3M default) | `CalendarHeatmapWithViews` | ✅ Complete | §3.1 |
| View Toggle (Week/Month/3M/Year) | `ViewToggle` | ✅ Complete | §3.2 |
| Instant Tap-Toggle | `DayCell`, `WeekGrid`, `MonthGrid` | ✅ Complete | §3.3 |
| Completion Animations | `DayCell` | ✅ Complete | §3.3 |
| Today Indicator (Pulsing) | `DayCell` | ✅ Complete | §3.3 |
| Stats Summary Bar | `CalendarHeatmapWithViews` | ✅ Complete | §4.1 |
| Weekly Pattern Chart | `WeeklyPatternChart` | ✅ Complete | §4.2 |
| Insight Card (Weak Day) | `InsightCard` | ✅ Complete | §4.3 |
| Streak Records Accordion | `StreakRecordsAccordion` | ✅ Complete | §4.4 |
| Premium Year View Gate | `ViewToggle` | ✅ Complete | §3.2 |
| Day Detail Tooltip | `DayDetailTooltip` | ✅ Complete | §3.4 |

### 2.2 Planned Features 🔜

| Feature | Priority | Status | Spec Reference |
|---------|----------|--------|----------------|
| Streak Chain Visualization | P1 | 📋 Planned | §8.1 |
| Grid Theme Options | P2 | 📋 Planned | §8.2 |
| Week Start Customization | P2 | 📋 Planned | §8.3 |
| Quick Month Navigation | P3 | 📋 Planned | §8.4 |
| Consistency Index Card | P2 | 🚧 In Progress | §4.5 |
| Weekly Comparison Card | P2 | 🚧 In Progress | §4.6 |

---

## 3. Calendar Heatmap System

### 3.1 CalendarHeatmapWithViews

The main container component orchestrating all calendar views.

**File:** `src/components/CalendarHeatmap/CalendarHeatmapWithViews.tsx`

```typescript
interface CalendarHeatmapWithViewsProps {
  habitId: string;
  completedDates: Set<string>;
  habitCreatedAt?: number;
  habitColor?: string;
  onDayPress?: (date: string, completed: boolean) => void;
  isPremium?: boolean;
  onPremiumUpsell?: () => void;
  initialView?: CalendarViewMode; // 'week' | 'month' | '3m' | 'year'
  currentStreak?: number;
  bestStreak?: number;
  onDayToggle?: (date: string, newCompleted: boolean) => void;
  instantToggle?: boolean; // default: true
}
```

**Features:**
- Manages view state (week/month/3m/year)
- Calculates stats per view period
- Handles day press/toggle events
- Displays trend badge (+/-% vs previous period)
- Shows stats summary bar
- Renders appropriate grid component

### 3.2 ViewToggle

Segmented control for switching calendar views.

**File:** `src/components/CalendarHeatmap/ViewToggle.tsx`

**Views:**
| View | Label | Description | Premium |
|------|-------|-------------|---------|
| `week` | Week | Current 7 days with large cells | No |
| `month` | Month | Traditional calendar grid | No |
| `3m` | 3M | GitHub-style horizontal heatmap | No |
| `year` | Year | Full 365-day heatmap | **Yes** |

**Premium Gating:**
- Year view shows crown badge for non-premium users
- Tapping triggers `onPremiumUpsell` callback
- Warning haptic feedback on locked tap

### 3.3 Instant Toggle System (HabitKit-Inspired)

**Components:** `DayCell`, `WeekGrid`, `MonthGrid`

#### Animation Sequence

**On Complete:**
```
T+0ms   Haptic: Medium Impact
T+0ms   Fill: scale 0→1 (spring: damping 12, stiffness 200)
T+100ms Check: scale 0→1.3→1, rotate -45°→0° (spring pop)
```

**On Uncomplete:**
```
T+0ms   Haptic: Medium Impact
T+0ms   Check: scale 1→0, rotate 0°→-45° (150ms timing)
T+100ms Fill: scale 1→0 (200ms timing)
```

#### State Synchronization

Critical pattern for optimistic UI:

```typescript
// Initialize animation state from data
const fillScale = useSharedValue(day.completed ? 1 : 0);

// Sync when backend updates (Convex reactive)
useEffect(() => {
  if (instantToggle && fillScale.value !== (day.completed ? 1 : 0)) {
    fillScale.value = day.completed ? 1 : 0;
    // ... sync other values
  }
}, [day.completed]);
```

#### Cell Size Options

```typescript
type CellSize = 'compact' | 'comfortable' | 'large';

const CELL_SIZES = {
  compact:     { cell: 20, check: 10, radius: 'rounded-sm' },
  comfortable: { cell: 28, check: 14, radius: 'rounded-md' },
  large:       { cell: 36, check: 18, radius: 'rounded-lg' },
};
```

#### Today Indicator

Enhanced pulsing glow for today (when incomplete):
- Scale animation: 1.0 → 1.5 → 1.2 (repeating)
- Opacity animation: 0.3 → 0.8 → 0.6 (repeating)
- Amber shadow glow (8px radius)
- Cancels on completion

### 3.4 Day Detail Tooltip

Modal overlay showing day details (legacy mode when `instantToggle=false`).

**File:** `src/components/CalendarHeatmap/DayDetailTooltip.tsx`

**Displays:**
- Date and day name
- Completion status
- Streak position
- Toggle action button

---

## 4. Progress Stats & Insights

### 4.1 Stats Summary Bar

Inline stats display in calendar header.

**Metrics Shown:**
| Stat | Icon | Description |
|------|------|-------------|
| Current Streak | 🔥 Flame | Consecutive days completed |
| Best Streak | 🏆 Trophy | All-time record streak |
| Perfect Weeks | 👑 Crown | Weeks with 7/7 completion |
| Period Completions | 🎯 Target | Completions in current view period |
| Best Day | ⭐ Star | Highest completion rate day |
| Focus Day | ⚡ Zap | Lowest completion rate day |

### 4.2 Weekly Pattern Chart

**File:** `src/components/ProgressSectionConsolidated/WeeklyPatternChart.tsx`

7-bar chart showing day-of-week completion rates.

**Features:**
- Bars scaled to max rate
- Best day highlighted (emerald)
- Worst day highlighted (amber, only if <70%)
- Legend with color coding
- "Details" link to expanded view

### 4.3 Insight Card

**File:** `src/components/CalendarHeatmap/InsightCard.tsx`

AI-powered insight identifying weak day patterns.

**Triggers when:**
- A day has completion rate significantly below average
- User has sufficient data (>2 weeks)

**Actions:**
- Set Reminder → Opens time picker
- See Tips → Shows strategy modal
- Dismiss → Persists to AsyncStorage

### 4.4 Streak Records Accordion

**File:** `src/components/ProgressSectionConsolidated/StreakRecordsAccordion.tsx`

Collapsible section showing:
- Current streak with live counter
- Best streak record
- Streak history timeline

### 4.5 Consistency Index Card (In Progress)

**File:** `src/components/ProgressSectionConsolidated/ConsistencyIndexCard.tsx`

**Planned Features:**
- Rolling 30-day consistency score (0-100)
- Trend arrow vs previous 30 days
- Mini sparkline

### 4.6 Weekly Comparison Card (In Progress)

**File:** `src/components/ProgressSectionConsolidated/WeeklyComparisonCard.tsx`

**Planned Features:**
- This week vs last week comparison
- Visual diff indicator
- Completion count comparison

---

## 5. Technical Architecture

### 5.1 Component Hierarchy

```
HabitDetailScreen
└── ProgressTabContent
    ├── CalendarHeatmapWithViews
    │   ├── ViewToggle
    │   ├── Stats Summary Bar
    │   ├── WeekGrid ──────► WeekDayCell
    │   ├── MonthGrid ─────► MonthDayCell
    │   ├── CalendarGrid ──► DayCell
    │   ├── YearlyCalendarGrid
    │   ├── WeeklyPatternChart
    │   ├── InsightCard
    │   └── DayDetailTooltip
    │
    └── ProgressSectionConsolidated
        ├── StatsGrid
        ├── MilestoneProgress
        ├── WeeklyPatternChart
        ├── ActionableTipCard
        └── StreakRecordsAccordion
```

### 5.2 Data Flow

```
Convex Backend
    │
    ▼
useQuery(api.habits.getHabit)
    │
    ├─► completedDates: Set<string>
    ├─► habitCreatedAt: number
    └─► habitColor: string
          │
          ▼
    CalendarHeatmapWithViews
          │
          ├─► generateWeekGrid()
          ├─► generateMonthGrid()
          ├─► generateHorizontalGrid()
          └─► generateYearGrid()
                │
                ▼
          Grid Components → DayCell → onDayToggle()
                                          │
                                          ▼
                                    toggleHabitMutation()
                                          │
                                          ▼
                                    Convex (reactive update)
```

### 5.3 Key Dependencies

| Package | Version | Usage |
|---------|---------|-------|
| `react-native-reanimated` | ^3.x | All animations |
| `expo-haptics` | ^13.x | Touch feedback |
| `date-fns` | ^2.x | Date calculations |
| `lucide-react-native` | ^0.x | Icons |

---

## 6. API Reference

### 6.1 Calendar Types

```typescript
type CalendarViewMode = 'week' | 'month' | '3m' | 'year';

interface CalendarDay {
  date: string | null;       // YYYY-MM-DD or null for padding
  dayOfMonth: number;
  completed: boolean;
  isToday: boolean;
  isFuture: boolean;
  isBeforeCreation: boolean;
}

type CellSize = 'compact' | 'comfortable' | 'large';
```

### 6.2 Utility Functions

**File:** `src/components/CalendarHeatmap/utils.ts`

| Function | Description |
|----------|-------------|
| `generateWeekGrid()` | Creates 7-day array for current week |
| `generateMonthGrid()` | Creates 2D array for calendar month |
| `generateHorizontalGrid()` | Creates 3-month horizontal heatmap |
| `generateYearGrid()` | Creates 365-day heatmap |
| `calculateWeekStats()` | Stats for week view |
| `calculateMonthStats()` | Stats for month view |
| `calculate3MonthStats()` | Stats for 3M view |
| `calculateYearStats()` | Stats for year view |
| `calculateDayOfWeekStats()` | Day-of-week analysis |
| `detectWeakDay()` | Find lowest performing day |
| `calculateStreakPosition()` | Position in current streak |

### 6.3 Convex Mutations

```typescript
// Toggle habit completion for a date
api.habits.toggleHabit({ habitId: Id<"habits">, date: string })

// Returns: { success: boolean, completed: boolean }
```

---

## 7. Design Mockups

### 7.1 Available Mockups

Located in `.superdesign/design_iterations/`:

| File | Description |
|------|-------------|
| `calendar_habitkit_style_1.html` | HabitKit-inspired instant toggle |
| `calendar_insights_v2_complete.html` | Full insights integration |
| `progress_page_reworked_1.html` | Progress section redesign |
| `progress_features_value_1.html` | Feature value proposition |
| `calendar_premium_streak_2.html` | Premium streak visualization |

### 7.2 HabitKit Comparison (8 Features)

| # | Feature | Status | Mockup |
|---|---------|--------|--------|
| 1 | Instant tap-toggle | ✅ Implemented | `calendar_habitkit_style_1.html` |
| 2 | Completion animations | ✅ Implemented | `calendar_habitkit_style_1.html` |
| 3 | Pulsing today indicator | ✅ Implemented | `calendar_habitkit_style_1.html` |
| 4 | Configurable cell sizes | ✅ Implemented | `calendar_habitkit_style_1.html` |
| 5 | Streak chain visualization | ❌ Not implemented | `calendar_premium_streak_2.html` |
| 6 | Grid theme options | ❌ Not implemented | — |
| 7 | Week start customization | ❌ Not implemented | — |
| 8 | Quick month navigation | ❌ Not implemented | — |

---

## 8. Future Roadmap

### 8.1 Streak Chain Visualization (P1)

**Goal:** Visual connection between consecutive completed days

**Design:**
- Gradient line connecting completed cells
- Intensity increases with streak length
- Break indicators for missed days

**Implementation Notes:**
- Use SVG or Canvas overlay
- Calculate connection points between cells
- Consider performance with 365 cells

### 8.2 Grid Theme Options (P2)

**Goal:** Customizable heatmap appearance

**Themes:**
| Theme | Description |
|-------|-------------|
| GitHub | Green intensity gradient |
| Tiles | Solid colored squares |
| Dots | Circular cells |
| Pixels | Retro pixelated style |

**Storage:** AsyncStorage preference per habit or global

### 8.3 Week Start Customization (P2)

**Goal:** Allow Sunday or Monday as week start

**Impact:**
- `generateWeekGrid()` - offset calculation
- `generateMonthGrid()` - first day alignment
- `DAY_LABELS` ordering

**Storage:** Global user preference

### 8.4 Quick Month Navigation (P3)

**Goal:** Swipe or tap to navigate months

**Gestures:**
- Swipe left/right for month change
- Pinch to zoom between views
- Tap month header for picker

---

## 9. Accessibility Checklist

| Requirement | Status |
|-------------|--------|
| All interactive elements have roles | ✅ |
| Screen reader labels accurate | ✅ |
| Reduce motion respected | ✅ |
| Color contrast meets WCAG AA | ✅ |
| Touch targets ≥44px | ✅ |
| Focus indicators visible | ⚠️ Partial |

---

## 10. Performance Considerations

| Concern | Mitigation |
|---------|------------|
| 365 animated cells (year view) | Year view is read-only (no toggle) |
| SharedValue memory | ~3-4 per cell × view size |
| Re-renders on toggle | Animations run on UI thread |
| Large completion sets | Set<string> for O(1) lookup |

---

## Changelog

### v3.0 (2024-12-28)
- Added HabitKit-style instant toggle to all grids
- Enhanced today indicator with pulsing glow
- Added configurable cell sizes
- Created unified spec document

### v2.0 (2024-12-26)
- Implemented multi-view calendar (Week/Month/3M/Year)
- Added premium gating for year view
- Added stats summary bar
- Integrated WeeklyPatternChart

### v1.0 (Initial)
- Basic calendar heatmap
- Streak display
- Completion tracking
