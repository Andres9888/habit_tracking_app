# Stats Components Redesign Specification

## Overview

This spec details improvements for each stats component while maintaining the unified design system established in the overall layout plan.

---

## Unified Design System Reference

| Section | Primary Color | Accent | Gradient |
|---------|--------------|--------|----------|
| Streak | orange-500 | amber-500 | from-orange-50/30 via-white to-amber-50/30 |
| Strength | teal-500 | emerald-500 | from-teal-50/30 via-white to-emerald-50/30 |
| Insights | violet-500 | blue-500 | from-violet-50/30 via-white to-blue-50/30 |

### Shared Patterns
```tsx
// Container with gradient
<View className="overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50">
  <View className="absolute inset-0 bg-gradient-to-br from-{color}-50/30 via-white to-{accent}-50/30" />
  <View className="p-5">...</View>
</View>

// Header with icon container
<View className="flex-row items-center gap-2">
  <View className="h-8 w-8 items-center justify-center rounded-lg bg-{color}-100">
    <Icon className="text-{color}-500" size={16} />
  </View>
  <Text className="text-lg font-bold text-stone-800">{title}</Text>
</View>
```

---

## Component 1: StreakChainSection

### Current State Analysis

**File:** `src/components/StreakChainSection/StreakChainSection.tsx`

**Strengths:**
- Tier progression system (Day 3 → 5 → 7 → 14 → 21 → 30 → 60)
- 7-day chain visualization with animated connectors
- Best streak comparison with "New Best!" celebration
- Pulsing animation for incomplete "today" circle

**Issues:**
- No gradient background (doesn't match Why/Identity design language)
- Header is centered but should have icon container pattern
- Progress bar lacks context (what tier am I progressing to?)
- Missing "days to beat best" motivation text

### Proposed Improvements

#### 1. Add Gradient Background
```tsx
// Before
<View className="rounded-2xl bg-white/90 p-5 shadow-sm shadow-stone-200/50">

// After
<View className="overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50">
  <View className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-white to-amber-50/30" />
  <View className="p-5">...</View>
</View>
```

#### 2. Update Header to Match Design System
```tsx
// Before
<View className="mb-3 flex-row items-center justify-center gap-2">
  <Flame ... />
  <Text>Streak</Text>
  {current.icon}
</View>

// After
<View className="mb-4 flex-row items-center justify-center gap-2">
  <View className="h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
    <Flame className="text-orange-500" size={16} />
  </View>
  <Text className="text-lg font-bold text-stone-800">Streak</Text>
  {current.icon && <Text className="text-lg">{current.icon}</Text>}
</View>
```

#### 3. Enhanced Progress Bar with Context
```tsx
// Add label showing next tier target
{next && (
  <View className="mb-4 px-2">
    <View className="flex-row items-center justify-between mb-1.5">
      <Text className="text-xs font-medium text-stone-600">
        Progress to {next.icon} Day {next.days}
      </Text>
      <Text className="text-xs font-bold text-orange-600">
        {daysToNext} {daysToNext === 1 ? 'day' : 'days'}
      </Text>
    </View>
    <View className="h-2 overflow-hidden rounded-full bg-stone-100">
      <Animated.View
        className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-400"
        style={barAnimatedStyle}
      />
    </View>
  </View>
)}
```

#### 4. Enhanced Best Streak Badge
```tsx
// Add "X to beat!" motivation when not a new record
{bestStreak > 0 && !isNewRecord && (
  <View className="flex-row items-center justify-center gap-2 rounded-xl py-2.5 bg-amber-50 border border-amber-200">
    <Trophy className="text-amber-500" size={16} />
    <Text className="text-sm text-stone-600">
      Best: <Text className="font-bold text-amber-700">{bestStreak}</Text>
    </Text>
    <Text className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
      {bestStreak - currentStreak} to beat!
    </Text>
  </View>
)}
```

### Tasks

- [x] **STREAK-1**: Add gradient background layer matching orange/amber theme
  - Added `overflow-hidden` wrapper with absolute positioned gradient background using `from-orange-50/30 via-white to-amber-50/30`
- [x] **STREAK-2**: Update header to use icon container pattern (h-8 w-8 rounded-lg bg-orange-100)
  - Updated header with icon container pattern, changed font-semibold to font-bold, mb-3 to mb-4
- [x] **STREAK-3**: Add tier context label above progress bar
  - Added flex-row with "Progress to {icon} Day {days}" label and "{daysToNext} day(s)" count
- [x] **STREAK-4**: Add "X to beat!" badge when not at new record
  - Added pill badge showing "{bestStreak - currentStreak} to beat!" in amber-100/amber-700 styling
- [x] **STREAK-5**: Increase connector line visibility (h-1 → h-1.5)
  - Updated ConnectorLine component from h-1 to h-1.5

---

## Component 2: HabitStrengthSection

### Current State Analysis

**File:** `src/components/HabitStrengthSection/HabitStrengthSection.tsx`

**Strengths:**
- Beautiful level-up animation (🌱 → 🌿 → 🌳 → 💪 → ⚡)
- Animated SVG progress ring
- Weekly trend indicator badge
- Contextual tips based on level

**Issues:**
- **MAJOR:** Breakdown section duplicates data shown elsewhere (streak, success rate, days tracking)
- No gradient background
- Header icon is not in a container
- Ring is 120px which is large; could be 96px for better balance

### Proposed Improvements

#### 1. Remove Breakdown Section (Eliminates Duplication)
The breakdown section shows:
- Current Streak (already in StreakChainSection)
- Success Rate (will be in InsightsSection)
- Days Tracking (will be in InsightsSection)

**Remove entirely.** Replace with progress to next level visualization.

#### 2. Add Gradient Background
```tsx
// Wrap in gradient container
<View className="overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50">
  <View className="absolute inset-0 bg-gradient-to-br from-teal-50/30 via-white to-emerald-50/30" />
  <Animated.View className="p-5" entering={FadeInDown.delay(200).springify()}>
    ...
  </Animated.View>
</View>
```

#### 3. Update Header to Match Design System
```tsx
// Before
<View className="flex-row items-center gap-2">
  <Zap className="text-amber-500" fill="#fbbf24" size={22} />
  <Text>Habit Strength</Text>
</View>

// After
<View className="flex-row items-center gap-2">
  <View className="h-8 w-8 items-center justify-center rounded-lg bg-teal-100">
    <Zap className="text-teal-500" size={16} />
  </View>
  <Text className="text-lg font-bold text-stone-800">Strength</Text>
</View>
```

#### 4. Replace Breakdown with Level Progress
```tsx
// Instead of breakdown items, show level journey
<View className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-3">
  <View className="flex-row items-center justify-between mb-2">
    <Text className="text-xs font-medium text-stone-600">
      Progress to {nextLevel.emoji} {nextLevel.label}
    </Text>
    <Text className="text-xs font-bold text-teal-600">
      {Math.round(nextLevel.minThreshold - clampedStrength)}% to go
    </Text>
  </View>
  <View className="h-2 bg-stone-100 rounded-full overflow-hidden">
    <View
      className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full"
      style={{ width: `${(clampedStrength / 100) * 100}%` }}
    />
  </View>
  <View className="flex-row justify-between mt-2">
    {['🌱', '🌿', '🌳', '💪', '⚡'].map((emoji, i) => (
      <Text key={i} className="text-[10px]">{emoji}</Text>
    ))}
  </View>
</View>
```

### Tasks

- [x] **STRENGTH-1**: Remove StrengthBreakdownItem component and breakdown section
  - Removed StrengthBreakdownItem component entirely
  - Removed "What builds strength:" section with breakdown items (currentStreak, successRate, daysTracking)
  - Updated HabitStrengthSectionProps to remove currentStreak, daysTracking, successRate props
  - Updated HabitDetailScreen to not pass removed props
- [x] **STRENGTH-2**: Add gradient background layer matching teal/emerald theme
  - Added overflow-hidden wrapper with absolute positioned gradient background
  - Uses `from-teal-50/30 via-white to-emerald-50/30`
- [x] **STRENGTH-3**: Update header to use icon container pattern
  - Added h-8 w-8 rounded-lg bg-teal-100 icon container
  - Changed Zap icon color from amber-500 to teal-500, size from 22 to 16
  - Changed title from "Habit Strength" to "Strength" with font-bold
- [x] **STRENGTH-4**: Add level journey progress visualization
  - Added progress bar showing progress to next level
  - Added emoji markers showing all 5 levels (🌱🌿🌳💪⚡)
  - Shows "Progress to {emoji} {label}" and "X% to go" labels
  - Uses teal/emerald gradient for the progress bar
- [x] **STRENGTH-5**: Reduce ring size from 120px to 96px
  - Changed ringSize from 120 to 96
  - Reduced strokeWidth from 10 to 8
  - Adjusted center content text sizes (text-3xl to text-2xl for emoji, text-2xl to text-xl for percentage)
- [x] **STRENGTH-6**: Keep tip section but move above level progress
  - Moved tip section to appear before the level journey progress visualization

---

## Component 3: StatsGrid (TO BE DEPRECATED)

### Current State Analysis

**File:** `src/components/StatsGrid/StatsGrid.tsx`

**Purpose:** Shows 4 stat cards in 2x2 grid
- Total Completions
- Success Rate
- Current Streak
- Days Tracking

**Issue:** ALL metrics are duplicated elsewhere
- Current Streak → StreakChainSection
- Success Rate → HabitStrengthSection breakdown
- Days Tracking → HabitStrengthSection breakdown
- Total Completions → Nowhere else (only unique metric)

### Migration Plan

1. **Move Total Completions to InsightsSection** as a "Journey Stats" row
2. **Move Success Rate to InsightsSection** alongside Total Completions
3. **Deprecate StatsGrid component** entirely

### New "Journey Stats" for InsightsSection
```tsx
// Add to InsightsSection at the top
<View className="flex-row gap-3 mb-5">
  <View className="flex-1 bg-white/60 border border-emerald-100 rounded-xl p-3 text-center">
    <View className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
      <CheckCircle2 className="text-emerald-600" size={16} />
    </View>
    <Text className="text-2xl font-bold text-emerald-700">{totalCompletions}</Text>
    <Text className="text-[10px] text-stone-500">completed</Text>
  </View>
  <View className="flex-1 bg-white/60 border border-blue-100 rounded-xl p-3 text-center">
    <View className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
      <Percent className="text-blue-600" size={16} />
    </View>
    <Text className="text-2xl font-bold text-blue-700">{successRate}%</Text>
    <Text className="text-[10px] text-stone-500">success rate</Text>
  </View>
</View>
```

### Tasks

- [x] **STATS-1**: Add totalCompletions and successRate props to InsightsSection
  - Added totalCompletions, successRate, and daysTracking props to InsightsSectionProps interface
  - Added CheckCircle2 and Percent icon imports
- [x] **STATS-2**: Create "Journey Stats" row in InsightsSection
  - Created "Your Journey" section with three stat cards: completed, success rate, days tracking
  - Used icon container pattern (h-8 w-8 rounded-lg bg-violet-100) for header
  - Cards use rounded-full icons and centered layout with emerald/blue/violet color theming
- [x] **STATS-3**: Remove StatsGrid from HabitDetailScreen imports
  - Removed StatsGrid import from HabitDetailScreen.tsx
  - Removed StatsGrid component usage from the JSX
- [x] **STATS-4**: Mark StatsGrid.tsx as deprecated with comment
  - Added JSDoc @deprecated comment to file header explaining migration to InsightsSection
  - Added @deprecated annotation to StatsGrid function export
- [x] **STATS-5**: Update HabitDetailScreen to pass new props to InsightsSection
  - Updated InsightsSection usage to include totalCompletions, successRate, and daysTracking props

---

## Component 4: InsightsSection

### Current State Analysis

**File:** `src/components/InsightsSection/InsightsSection.tsx`

**Strengths:**
- Best days bar chart with animated bars
- Streak records leaderboard with medals
- Monthly trend comparison
- Best/Worst day callout cards

**Issues:**
- No gradient background
- Headers don't use icon container pattern
- Streak records overlap with StreakChainSection's best streak
- Missing Total Completions and Success Rate (from deprecated StatsGrid)

### Proposed Improvements

#### 1. Add Gradient Background
```tsx
<View className="overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50">
  <View className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-white to-blue-50/30" />
  <Animated.View className="p-5">...</Animated.View>
</View>
```

#### 2. Add Journey Stats from StatsGrid
Add new props and "Your Journey" section at the top.

#### 3. Update Headers to Match Design System
```tsx
<View className="flex-row items-center justify-center gap-2 mb-4">
  <View className="h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
    <BarChart3 className="text-violet-500" size={16} />
  </View>
  <Text className="text-lg font-bold text-stone-800">Insights</Text>
</View>
```

#### 4. Simplify Streak Records to Top 3 Medals
Instead of full leaderboard, show compact medal display:
```tsx
<View className="flex-row gap-2">
  {streakRecords.slice(0, 3).map((record, i) => (
    <View key={i} className={`flex-1 rounded-xl p-2.5 text-center ${
      i === 0 ? 'bg-amber-50 border border-amber-200' :
      i === 1 ? 'bg-stone-50 border border-stone-200' :
      'bg-orange-50 border border-orange-200'
    }`}>
      <Text className="text-base mb-0.5">{['🥇', '🥈', '🥉'][i]}</Text>
      <Text className="text-lg font-bold">{record.days}</Text>
      <Text className="text-[9px] text-stone-500">days</Text>
    </View>
  ))}
</View>
```

#### 5. Add Section Labels
Use uppercase tracking labels for visual hierarchy:
```tsx
<Text className="text-[10px] font-bold uppercase tracking-widest text-violet-500 mb-3">
  Best Days
</Text>
```

### Tasks

- [x] **INSIGHTS-1**: Add gradient background layer matching violet/blue theme
  - Added `overflow-hidden` wrapper with absolute positioned gradient background using `from-violet-50/30 via-white to-blue-50/30` to all four sections (Journey Stats, Best Days, Streak Records, Monthly Trend)
  - Also updated the "not enough data" empty state to use the same gradient pattern
- [x] **INSIGHTS-2**: Update all headers to use icon container pattern
  - Updated all section headers with h-8 w-8 rounded-lg bg-violet-100 icon containers
  - Changed icon colors to text-violet-500 and reduced size from 18 to 16
  - Changed font-semibold to font-bold across all headers
- [x] **INSIGHTS-3**: Add totalCompletions and successRate props
  - Props were already added in previous implementation (STATS-1), verified interface includes totalCompletions, successRate, daysTracking
- [x] **INSIGHTS-4**: Add "Journey Stats" row at top
  - "Your Journey" section was already implemented in previous work (STATS-2), now updated with gradient background and section label
- [x] **INSIGHTS-5**: Replace streak records leaderboard with compact top-3 medals
  - Replaced StreakRecordRow-based leaderboard with compact inline medal cards (🥇🥈🥉)
  - Cards show days count with amber/stone/orange color theming
  - Added "NOW" badge for current streak inline within medal card
- [x] **INSIGHTS-6**: Add uppercase tracking section labels
  - Added `text-[10px] font-bold uppercase tracking-widest text-violet-500` section labels
  - Labels: "Overall Progress", "Performance by Day", "Top Performances", "Month Comparison"
- [x] **INSIGHTS-7**: Remove StreakRecordRow component (simplify to medal cards)
  - Deleted StreakRecordRow function component entirely
  - Removed unused `Flame` import and `formatDateShort` helper function

---

## Implementation Order

### Phase 1: Foundation (No Breaking Changes)
1. **STREAK-1, STREAK-2**: Add gradient and update header
2. **STRENGTH-2, STRENGTH-3**: Add gradient and update header
3. **INSIGHTS-1, INSIGHTS-2**: Add gradient and update header

### Phase 2: Data Migration
4. **STATS-1, STATS-2, INSIGHTS-3, INSIGHTS-4**: Move StatsGrid metrics to Insights
5. **STATS-3, STATS-5**: Update HabitDetailScreen to use new props

### Phase 3: Cleanup
6. **STRENGTH-1, STRENGTH-4**: Remove breakdown, add level progress
7. **INSIGHTS-5, INSIGHTS-7**: Simplify streak records
8. **STATS-4**: Mark StatsGrid as deprecated

### Phase 4: Polish
9. **STREAK-3, STREAK-4**: Enhanced progress bar and best streak badge
10. **STRENGTH-5, STRENGTH-6**: Ring size and tip reorder
11. **INSIGHTS-6**: Section labels
12. **STREAK-5**: Connector line visibility

---

## Props Changes Summary

### StreakChainSection (No changes)
```tsx
interface StreakChainSectionProps {
  bestStreak: number;
  currentStreak: number;
  lastSevenDays: boolean[];
  todayCompleted: boolean;
}
```

### HabitStrengthSection (Remove props)
```tsx
// BEFORE
interface HabitStrengthSectionProps {
  strength: number;
  weeklyChange?: number;
  currentStreak?: number;   // REMOVE
  daysTracking?: number;    // REMOVE
  successRate?: number;     // REMOVE
  onInfoPress?: () => void;
}

// AFTER
interface HabitStrengthSectionProps {
  strength: number;
  weeklyChange?: number;
  onInfoPress?: () => void;
}
```

### InsightsSection (Add props)
```tsx
// BEFORE
interface InsightsSectionProps {
  habitId: Id<'habits'>;
  tracking: HabitTrackingEntry[];
  habitCreatedAt?: number;
}

// AFTER
interface InsightsSectionProps {
  habitId: Id<'habits'>;
  tracking: HabitTrackingEntry[];
  habitCreatedAt?: number;
  totalCompletions: number;    // NEW
  successRate: number;         // NEW
  daysTracking: number;        // NEW
}
```

### StatsGrid (DEPRECATED)
```tsx
// Mark as deprecated, remove from HabitDetailScreen
/** @deprecated Use InsightsSection for metrics display */
```
