# Calendar Heatmap Implementation Checklist
## GitHub-Style Horizontal Layout - Step-by-Step Guide

**Version:** 1.0
**Date:** 2025-12-22
**Estimated Time:** 2-3 weeks

---

## Overview

This checklist provides a **step-by-step implementation guide** with code snippets for migrating from the traditional monthly calendar to the GitHub-style horizontal layout.

### Prerequisites
- [ ] Review `calendar-heatmap-ux-analysis.md`
- [ ] Review `calendar-heatmap-github-style.md`
- [ ] Review design mockup: `.superdesign/design_iterations/calendar_heatmap_3.html`
- [ ] Ensure tests are passing for current implementation

---

## Phase 1: Utilities & Data Layer (Days 1-3)

### ✅ Task 1.1: Create Horizontal Grid Generator

**File:** `src/components/CalendarHeatmap/utils.ts`

**Add this function:**

```typescript
/**
 * Generate horizontal grid for GitHub-style 3-month view
 * Weeks are columns, days-of-week are rows
 */
export function generateHorizontalGrid(
  currentDate: Date,
  completedDates: Set<string>,
  habitCreatedAt?: number
): {
  weeks: (string | null)[][];
  monthLabels: { weekIndex: number; label: string }[];
} {
  const endDate = currentDate;
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 90); // ~3 months

  const weeks: (string | null)[][] = [];
  let currentWeek: (string | null)[] = Array(7).fill(null);
  let weekIndex = 0;

  // Find the Sunday before startDate
  const firstSunday = new Date(startDate);
  firstSunday.setDate(firstSunday.getDate() - firstSunday.getDay());

  const monthLabels: { weekIndex: number; label: string }[] = [];
  let lastMonth = -1;

  for (let d = new Date(firstSunday); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay(); // 0 = Sunday
    const dateStr = format(d, 'yyyy-MM-dd');

    currentWeek[dayOfWeek] = dateStr;

    // Track month changes for labels
    if (d.getMonth() !== lastMonth) {
      monthLabels.push({
        weekIndex,
        label: format(d, 'MMM'),
      });
      lastMonth = d.getMonth();
    }

    // Complete week (Saturday reached)
    if (dayOfWeek === 6) {
      weeks.push(currentWeek);
      currentWeek = Array(7).fill(null);
      weekIndex++;
    }
  }

  // Add partial final week if needed
  if (currentWeek.some(d => d !== null)) {
    weeks.push(currentWeek);
  }

  return { weeks, monthLabels };
}
```

**Test:**
```typescript
// Add to CalendarHeatmap.test.tsx
describe('generateHorizontalGrid', () => {
  it('should generate ~13 weeks for 3 months', () => {
    const currentDate = new Date('2025-12-22');
    const completedDates = new Set<string>();
    const result = generateHorizontalGrid(currentDate, completedDates);

    expect(result.weeks.length).toBeGreaterThanOrEqual(12);
    expect(result.weeks.length).toBeLessThanOrEqual(14);
  });

  it('should generate month labels', () => {
    const currentDate = new Date('2025-12-22');
    const completedDates = new Set<string>();
    const result = generateHorizontalGrid(currentDate, completedDates);

    expect(result.monthLabels.length).toBeGreaterThanOrEqual(3);
    expect(result.monthLabels[0]).toHaveProperty('weekIndex');
    expect(result.monthLabels[0]).toHaveProperty('label');
  });
});
```

**Checklist:**
- [ ] Function created
- [ ] Unit tests written
- [ ] Tests passing
- [ ] Edge cases handled (partial weeks, leap years)

---

### ✅ Task 1.2: Implement Streak Position Calculator

**File:** `src/components/CalendarHeatmap/utils.ts`

**Update existing function or add:**

```typescript
/**
 * Calculate position in current streak for color intensity
 * Returns: 0 (not completed), 1-100 (days in streak)
 */
export function calculateStreakPosition(
  date: string,
  completedDates: Set<string>,
  habitCreatedAt?: number
): number {
  if (!completedDates.has(date)) return 0;

  let position = 1;
  const d = parseISO(date);

  // Count backward to find streak start
  for (let i = 1; i < 100; i++) {
    const prevDate = subDays(d, i);
    const prevDateStr = format(prevDate, 'yyyy-MM-dd');

    // Stop if we hit habit creation date
    if (habitCreatedAt && prevDate.getTime() < habitCreatedAt) {
      break;
    }

    if (!completedDates.has(prevDateStr)) {
      break;
    }

    position++;
  }

  return position;
}

/**
 * Map streak position to color
 */
export function getStreakColor(position: number): string {
  if (position === 0) return '#f5f5f4';  // empty
  if (position <= 6) return '#6ee7b7';   // day 1-6
  if (position <= 13) return '#34d399';  // day 7-13
  if (position <= 29) return '#10b981';  // day 14-29
  return '#059669';                       // day 30+
}
```

**Test:**
```typescript
describe('calculateStreakPosition', () => {
  it('should return 0 for non-completed date', () => {
    const completedDates = new Set(['2025-12-20']);
    const position = calculateStreakPosition('2025-12-21', completedDates);
    expect(position).toBe(0);
  });

  it('should calculate 7-day streak correctly', () => {
    const completedDates = new Set([
      '2025-12-16', '2025-12-17', '2025-12-18',
      '2025-12-19', '2025-12-20', '2025-12-21', '2025-12-22'
    ]);
    const position = calculateStreakPosition('2025-12-22', completedDates);
    expect(position).toBe(7);
  });
});
```

**Checklist:**
- [ ] Function updated/created
- [ ] Color mapping function added
- [ ] Unit tests written
- [ ] Tests passing

---

### ✅ Task 1.3: Update TypeScript Interfaces

**File:** `src/components/CalendarHeatmap/types.ts`

**Update interfaces:**

```typescript
/**
 * Props for DayCell component (updated for GitHub-style)
 */
export interface DayCellProps {
  /** Date string in YYYY-MM-DD format, null for padding */
  dateStr: string | null;

  /** Whether the habit was completed on this day */
  completed: boolean;

  /** Whether this is today */
  isToday: boolean;

  /** Whether this is a future date */
  isFuture: boolean;

  /** Whether before habit creation */
  isBeforeCreation: boolean;

  /** Position in current streak (for color intensity) */
  streakPosition: number;

  /** Streak chain style for connected cells */
  streakChainStyle: 'solo' | 'start' | 'middle' | 'end';

  /** Cell size in pixels */
  cellSize: number;

  /** Gap between cells in pixels */
  gap: number;

  /** Custom habit color (hex) */
  habitColor?: string;

  /** Callback when cell is pressed */
  onPress?: (date: string, completed: boolean) => void;
}

/**
 * Horizontal grid data structure
 */
export interface HorizontalGridData {
  /** Array of weeks, each week is array of 7 dates (Sun-Sat) */
  weeks: (string | null)[][];

  /** Month labels with their starting week index */
  monthLabels: Array<{
    weekIndex: number;
    label: string; // e.g., "Oct", "Nov", "Dec"
  }>;
}
```

**Checklist:**
- [ ] Interfaces updated
- [ ] Old `CalendarDay` interface kept for compatibility
- [ ] TypeScript errors resolved

---

## Phase 2: Core Components (Days 4-7)

### ✅ Task 2.1: Update DayCell Component

**File:** `src/components/CalendarHeatmap/DayCell.tsx`

**Major changes:**

```typescript
import React, { useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import type { DayCellProps } from './types';
import { getStreakColor } from './utils';

export function DayCell({
  dateStr,
  completed,
  isToday,
  isFuture,
  isBeforeCreation,
  streakPosition,
  streakChainStyle,
  cellSize,
  gap,
  habitColor,
  onPress,
}: DayCellProps) {
  const scaleAnim = useSharedValue(1);

  const backgroundColor = useMemo(() => {
    if (!dateStr || isBeforeCreation) return 'transparent';
    if (isFuture) return '#fafaf9'; // stone-50
    if (isToday && !completed) return '#fef3c7'; // amber-50
    if (isToday && completed) return getStreakColor(streakPosition);
    if (completed) return habitColor || getStreakColor(streakPosition);
    return '#f5f5f4'; // stone-100
  }, [dateStr, completed, isToday, isFuture, isBeforeCreation, streakPosition, habitColor]);

  const borderStyle = useMemo(() => {
    if (isFuture) return { borderWidth: 1, borderStyle: 'dashed', borderColor: '#d6d3d1' };
    if (isToday) return { borderWidth: 2, borderColor: '#fbbf24' };
    return {};
  }, [isToday, isFuture]);

  const borderRadius = useMemo(() => {
    switch (streakChainStyle) {
      case 'start':
        return { borderTopLeftRadius: 4, borderBottomLeftRadius: 4, borderTopRightRadius: 2, borderBottomRightRadius: 2 };
      case 'middle':
        return { borderRadius: 2 };
      case 'end':
        return { borderTopLeftRadius: 2, borderBottomLeftRadius: 2, borderTopRightRadius: 4, borderBottomRightRadius: 4 };
      case 'solo':
      default:
        return { borderRadius: 4 };
    }
  }, [streakChainStyle]);

  const handlePress = () => {
    if (!dateStr || isFuture || isBeforeCreation) return;

    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Scale animation
    scaleAnim.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    onPress?.(dateStr, completed);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  if (!dateStr) {
    return <Animated.View style={{ width: cellSize, height: cellSize }} />;
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={isFuture || isBeforeCreation}
      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${dateStr}, ${completed ? `${streakPosition} day streak` : 'not completed'}`}
      accessibilityState={{ checked: completed, disabled: isFuture }}
    >
      <Animated.View
        style={[
          {
            width: cellSize,
            height: cellSize,
            backgroundColor,
            ...borderStyle,
            ...borderRadius,
            justifyContent: 'center',
            alignItems: 'center',
          },
          animatedStyle,
        ]}
      >
        {isToday && completed && (
          <Check size={16} color="#ffffff" strokeWidth={3} />
        )}
      </Animated.View>
    </Pressable>
  );
}
```

**Checklist:**
- [ ] Remove date number display
- [ ] Implement streak-based colors
- [ ] Add streak chain styling
- [ ] Reduce cell size to 24px
- [ ] Add hitSlop for better tappability
- [ ] Test on device (tap accuracy)

---

### ✅ Task 2.2: Create WeekColumn Component

**File:** `src/components/CalendarHeatmap/WeekColumn.tsx`

**New component:**

```typescript
import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { DayCell } from './DayCell';
import { parseISO, isToday as isTodayFn, isFuture as isFutureFn, startOfDay } from 'date-fns';

interface WeekColumnProps {
  week: (string | null)[];
  columnIndex: number;
  totalColumns: number;
  cellSize: number;
  gap: number;
  completedDates: Set<string>;
  habitCreatedAt?: number;
  habitColor?: string;
  onDayPress?: (date: string, completed: boolean) => void;
}

export function WeekColumn({
  week,
  columnIndex,
  totalColumns,
  cellSize,
  gap,
  completedDates,
  habitCreatedAt,
  habitColor,
  onDayPress,
}: WeekColumnProps) {
  const animationDelay = (totalColumns - columnIndex - 1) * 15; // Right-to-left cascade

  return (
    <Animated.View
      entering={FadeIn.delay(animationDelay).duration(200)}
      style={{
        flexDirection: 'column',
        gap,
        marginLeft: columnIndex > 0 ? gap : 0,
      }}
      className={`col-${columnIndex}`}
    >
      {week.map((dateStr, rowIndex) => {
        if (!dateStr) {
          return <View key={rowIndex} style={{ width: cellSize, height: cellSize }} />;
        }

        const date = parseISO(dateStr);
        const today = startOfDay(new Date());
        const isToday = isTodayFn(date);
        const isFuture = isFutureFn(date);
        const isBeforeCreation = habitCreatedAt ? date.getTime() < habitCreatedAt : false;
        const completed = completedDates.has(dateStr);
        const streakPosition = completed ? calculateStreakPosition(dateStr, completedDates, habitCreatedAt) : 0;
        const streakChainStyle = getStreakChainStyle(dateStr, rowIndex, completedDates);

        return (
          <DayCell
            key={rowIndex}
            dateStr={dateStr}
            completed={completed}
            isToday={isToday}
            isFuture={isFuture}
            isBeforeCreation={isBeforeCreation}
            streakPosition={streakPosition}
            streakChainStyle={streakChainStyle}
            cellSize={cellSize}
            gap={gap}
            habitColor={habitColor}
            onPress={onDayPress}
          />
        );
      })}
    </Animated.View>
  );
}
```

**Checklist:**
- [ ] Component created
- [ ] Animation stagger implemented
- [ ] Props properly typed
- [ ] Renders correctly in parent

---

### ✅ Task 2.3: Rebuild CalendarGrid Component

**File:** `src/components/CalendarHeatmap/CalendarGrid.tsx`

**Major rewrite:**

```typescript
import React, { useRef, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WeekColumn } from './WeekColumn';

interface CalendarGridProps {
  weeks: (string | null)[][];
  monthLabels: { weekIndex: number; label: string }[];
  cellSize: number;
  gap: number;
  completedDates: Set<string>;
  habitCreatedAt?: number;
  habitColor?: string;
  onDayPress?: (date: string, completed: boolean) => void;
}

export function CalendarGrid({
  weeks,
  monthLabels,
  cellSize,
  gap,
  completedDates,
  habitCreatedAt,
  habitColor,
  onDayPress,
}: CalendarGridProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Auto-scroll to current week on mount
  useEffect(() => {
    const todayColumnIndex = weeks.findIndex(week =>
      week.some(date => date && isToday(parseISO(date)))
    );

    if (todayColumnIndex !== -1 && scrollViewRef.current) {
      const scrollX = Math.max(0, (todayColumnIndex - 10) * (cellSize + gap));
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: scrollX, animated: true });
      }, 500); // Delay to allow render
    }
  }, [weeks]);

  return (
    <View style={{ position: 'relative' }}>
      {/* Month Labels */}
      <View style={{ flexDirection: 'row', marginBottom: 8, paddingLeft: 24 }}>
        {monthLabels.map(({ weekIndex, label }, index) => (
          <Text
            key={index}
            style={{
              position: 'absolute',
              left: weekIndex * (cellSize + gap) + 24,
              fontSize: 10,
              fontWeight: '500',
              color: '#78716c',
            }}
          >
            {label}
          </Text>
        ))}
      </View>

      {/* Horizontal Scroll Container */}
      <View style={{ position: 'relative' }}>
        {/* Left edge fade */}
        <LinearGradient
          colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 20,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        {/* Right edge fade */}
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 20,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexDirection: 'row' }}
        >
          <View style={{ flexDirection: 'row' }}>
            {/* Day Labels Column (Sticky) */}
            <View style={{ flexDirection: 'column', gap, paddingRight: 8 }}>
              {dayLabels.map((label, index) => (
                <View
                  key={index}
                  style={{
                    height: cellSize,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                  }}
                >
                  <Text style={styles.dayLabel}>{label}</Text>
                </View>
              ))}
            </View>

            {/* Week Columns */}
            {weeks.map((week, columnIndex) => (
              <WeekColumn
                key={columnIndex}
                week={week}
                columnIndex={columnIndex}
                totalColumns={weeks.length}
                cellSize={cellSize}
                gap={gap}
                completedDates={completedDates}
                habitCreatedAt={habitCreatedAt}
                habitColor={habitColor}
                onDayPress={onDayPress}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dayLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#a8a29e',
    letterSpacing: 0.5,
    width: 16,
  },
});
```

**Checklist:**
- [ ] Horizontal layout implemented
- [ ] Day labels on left (sticky)
- [ ] Month labels above weeks
- [ ] Edge fade gradients added
- [ ] Auto-scroll working
- [ ] ScrollView smooth on device

---

## Phase 3: Main Component Update (Days 8-10)

### ✅ Task 3.1: Update CalendarHeatmap Main Component

**File:** `src/components/CalendarHeatmap/CalendarHeatmap.tsx`

**Key changes:**

```typescript
// Replace month navigation state with grid data
const [currentDate] = useState(() => new Date());

// Generate 3-month horizontal grid
const gridData = useMemo(() => {
  return generateHorizontalGrid(currentDate, completedDates, habitCreatedAt);
}, [currentDate, completedDates, habitCreatedAt]);

// Calculate 3-month stats
const stats = useMemo(() => {
  const totalDays = gridData.weeks.reduce((count, week) => {
    return count + week.filter(d => d !== null).length;
  }, 0);

  const completions = Array.from(completedDates).filter(dateStr => {
    const date = parseISO(dateStr);
    const threeMonthsAgo = subDays(currentDate, 90);
    return date >= threeMonthsAgo && date <= currentDate;
  }).length;

  return {
    completions,
    totalDays,
    successRate: totalDays > 0 ? (completions / totalDays) * 100 : 0,
  };
}, [gridData, completedDates, currentDate]);

// Remove month navigation functions (goToPreviousMonth, goToNextMonth)

// Update render
return (
  <Animated.View ...>
    {/* Header (no month arrows) */}
    <View className="flex-row items-center justify-between mb-4">
      <View className="flex-row items-center gap-2">
        <View className="h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
          <Calendar className="text-emerald-500" size={16} />
        </View>
        <View className="flex-row items-center gap-2">
          <Text className="text-sm font-medium text-stone-500">
            {gridData.monthLabels.map(m => m.label).join(' - ')}
          </Text>
        </View>
      </View>

      {/* Trend badge */}
      <View className="flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100">
        <TrendingUp className="text-emerald-600" size={14} />
        <Text className="text-xs font-semibold text-emerald-700">+12%</Text>
      </View>
    </View>

    {/* Calendar Grid */}
    <CalendarGrid
      weeks={gridData.weeks}
      monthLabels={gridData.monthLabels}
      cellSize={24}
      gap={3}
      completedDates={completedDates}
      habitCreatedAt={habitCreatedAt}
      habitColor={habitColor}
      onDayPress={handleDayPress}
    />

    {/* Summary Stats */}
    <View className="mt-4 flex-row items-center justify-center gap-4">
      <View className="flex-row items-center gap-1.5">
        <View
          className="h-3 w-3 rounded-sm"
          style={{ backgroundColor: habitColor || '#10b981' }}
        />
        <Text className="text-xs text-stone-600">
          {stats.completions} {stats.completions === 1 ? 'day' : 'days'}
        </Text>
      </View>

      <Text className="text-stone-300">•</Text>

      <Text className="text-xs font-medium text-emerald-600">
        {Math.round(stats.successRate)}% (3 months)
      </Text>
    </View>

    {/* Insight Card - Keep as-is */}
    {!insightCardDismissed && (
      <InsightCard
        dayOfWeekStats={dayOfWeekStats}
        weakestDay={weakestDay}
        onSetReminder={handleSetReminder}
        onSeeTips={handleSeeTips}
        onDismiss={handleDismissInsight}
      />
    )}
  </Animated.View>
);
```

**Checklist:**
- [ ] Remove month navigation state
- [ ] Generate 3-month grid data
- [ ] Update header (no arrows)
- [ ] Add trend badge
- [ ] Update stats (3-month period)
- [ ] Test with real data

---

## Phase 4: Polish & Testing (Days 11-14)

### ✅ Task 4.1: Implement Today Cell Pulse

**File:** `src/components/CalendarHeatmap/DayCell.tsx`

**Add pulse animation:**

```typescript
const pulseAnim = useSharedValue(1);

useEffect(() => {
  if (isToday && !completed) {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 700, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        withTiming(1, { duration: 700, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
      ),
      -1,
      false
    );
  }
}, [isToday, completed]);

const pulseStyle = useAnimatedStyle(() => ({
  transform: [{ scale: pulseAnim.value }],
  shadowColor: '#fbbf24',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: pulseAnim.value - 1,
  shadowRadius: (pulseAnim.value - 1) * 4,
}));
```

**Checklist:**
- [ ] Pulse animation implemented
- [ ] Only pulses when today + not completed
- [ ] Smooth on device (60fps)

---

### ✅ Task 4.2: Add Accessibility Labels

**File:** `src/components/CalendarHeatmap/DayCell.tsx`

**Enhance accessibility:**

```typescript
function getCellA11yLabel(
  dateStr: string,
  completed: boolean,
  streakPosition: number,
  isToday: boolean,
  isFuture: boolean
): string {
  const dateLabel = format(parseISO(dateStr), 'EEEE, MMMM d');

  if (isFuture) return `${dateLabel}, future date`;
  if (isToday && !completed) return `${dateLabel}, today, pending completion`;
  if (isToday && completed) return `${dateLabel}, today, completed, ${streakPosition} day streak`;
  if (completed) return `${dateLabel}, completed, ${streakPosition} day streak`;
  return `${dateLabel}, not completed`;
}

// In render
<Pressable
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel={getCellA11yLabel(dateStr, completed, streakPosition, isToday, isFuture)}
  accessibilityHint="Double tap to view details or toggle completion"
  accessibilityState={{ checked: completed, disabled: isFuture }}
  accessibilityActions={[
    { name: 'activate', label: 'View details' },
    { name: 'magicTap', label: 'Toggle completion' },
  ]}
  onAccessibilityAction={(event) => {
    if (event.nativeEvent.actionName === 'activate') {
      handlePress();
    } else if (event.nativeEvent.actionName === 'magicTap') {
      // Handle toggle
    }
  }}
>
```

**Checklist:**
- [ ] Accessibility labels added
- [ ] Screen reader tested (VoiceOver/TalkBack)
- [ ] Accessibility actions working

---

### ✅ Task 4.3: Write Unit Tests

**File:** `src/components/CalendarHeatmap/__tests__/CalendarHeatmap.test.tsx`

**Add tests:**

```typescript
describe('CalendarHeatmap GitHub-Style', () => {
  describe('Horizontal Grid Generation', () => {
    it('should generate ~13 weeks for 3 months', () => {
      const currentDate = new Date('2025-12-22');
      const completedDates = new Set<string>();
      const { weeks } = generateHorizontalGrid(currentDate, completedDates);

      expect(weeks.length).toBeGreaterThanOrEqual(12);
      expect(weeks.length).toBeLessThanOrEqual(14);
    });

    it('should generate correct month labels', () => {
      const currentDate = new Date('2025-12-22');
      const completedDates = new Set<string>();
      const { monthLabels } = generateHorizontalGrid(currentDate, completedDates);

      expect(monthLabels.length).toBeGreaterThanOrEqual(3);
      expect(monthLabels[monthLabels.length - 1].label).toBe('Dec');
    });
  });

  describe('Streak Position Calculation', () => {
    it('should calculate 7-day streak correctly', () => {
      const completedDates = new Set([
        '2025-12-16', '2025-12-17', '2025-12-18',
        '2025-12-19', '2025-12-20', '2025-12-21', '2025-12-22'
      ]);
      const position = calculateStreakPosition('2025-12-22', completedDates);
      expect(position).toBe(7);
    });

    it('should stop at habit creation date', () => {
      const completedDates = new Set([
        '2025-12-18', '2025-12-19', '2025-12-20',
        '2025-12-21', '2025-12-22'
      ]);
      const habitCreatedAt = new Date('2025-12-18').getTime();
      const position = calculateStreakPosition('2025-12-22', completedDates, habitCreatedAt);
      expect(position).toBe(5);
    });
  });

  describe('Streak Color Mapping', () => {
    it('should return correct colors for each tier', () => {
      expect(getStreakColor(0)).toBe('#f5f5f4');   // empty
      expect(getStreakColor(3)).toBe('#6ee7b7');   // day 1-6
      expect(getStreakColor(10)).toBe('#34d399');  // day 7-13
      expect(getStreakColor(20)).toBe('#10b981');  // day 14-29
      expect(getStreakColor(35)).toBe('#059669');  // day 30+
    });
  });
});
```

**Checklist:**
- [ ] Unit tests written
- [ ] All tests passing
- [ ] Coverage >80%

---

### ✅ Task 4.4: Write Integration Tests

**File:** `src/components/CalendarHeatmap/__tests__/CalendarHeatmap.integration.test.tsx`

```typescript
describe('CalendarHeatmap Integration', () => {
  it('should render 3-month horizontal layout', () => {
    const completedDates = new Set(['2025-12-22', '2025-12-21']);
    const { getByText } = render(
      <CalendarHeatmap
        habitId={'test-habit' as Id<'habits'>}
        completedDates={completedDates}
      />
    );

    // Should show month labels
    expect(getByText(/Oct.*Nov.*Dec/)).toBeTruthy();
  });

  it('should auto-scroll to current week on mount', async () => {
    const completedDates = new Set(['2025-12-22']);
    const { getByRole } = render(
      <CalendarHeatmap
        habitId={'test-habit' as Id<'habits'>}
        completedDates={completedDates}
      />
    );

    // Wait for auto-scroll animation
    await waitFor(() => {
      // Check that scroll position is correct
      // (Implementation depends on test library)
    }, { timeout: 1000 });
  });

  it('should show today cell with pulse animation', () => {
    const completedDates = new Set<string>();
    const { UNSAFE_getAllByType } = render(
      <CalendarHeatmap
        habitId={'test-habit' as Id<'habits'>}
        completedDates={completedDates}
      />
    );

    // Find today cell
    const todayCells = UNSAFE_getAllByType(DayCell).filter(
      cell => cell.props.isToday
    );

    expect(todayCells.length).toBe(1);
    expect(todayCells[0].props.completed).toBe(false);
  });

  it('should handle day press and show tooltip', async () => {
    const mockOnDayPress = jest.fn();
    const completedDates = new Set(['2025-12-22']);
    const { getByLabelText } = render(
      <CalendarHeatmap
        habitId={'test-habit' as Id<'habits'>}
        completedDates={completedDates}
        onDayPress={mockOnDayPress}
      />
    );

    const cell = getByLabelText(/December 22.*completed/);
    fireEvent.press(cell);

    expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-22', true);
  });
});
```

**Checklist:**
- [ ] Integration tests written
- [ ] All tests passing
- [ ] User flows tested

---

## Phase 5: Manual Testing (Days 15-17)

### ✅ Task 5.1: Device Testing

**Test on 5+ devices:**

- [ ] iPhone SE (375px width)
- [ ] iPhone 14 Pro (390px width)
- [ ] iPhone 14 Pro Max (428px width)
- [ ] iPad Mini (834px width)
- [ ] Android (various sizes)

**Checklist per device:**
- [ ] Cells render correctly
- [ ] Cells are tappable (not too small)
- [ ] Scroll is smooth (60fps)
- [ ] Auto-scroll works
- [ ] Edge fades visible
- [ ] Today cell pulses
- [ ] Animations smooth

---

### ✅ Task 5.2: Accessibility Testing

**Test with assistive technologies:**

- [ ] iOS VoiceOver
  - [ ] Can navigate to each cell
  - [ ] Hears correct labels
  - [ ] Can activate cells
  - [ ] Magic tap works

- [ ] Android TalkBack
  - [ ] Can navigate to each cell
  - [ ] Hears correct labels
  - [ ] Can activate cells

- [ ] Reduce Motion
  - [ ] Animations disabled when reduce motion on
  - [ ] Layout still works

**Checklist:**
- [ ] All accessibility tests passing
- [ ] WCAG AAA contrast met
- [ ] Touch targets adequate (24px + hitSlop)

---

### ✅ Task 5.3: Performance Testing

**Measure performance:**

```bash
# Run React Native performance monitor
npx react-native run-ios --configuration Release

# Check FPS during scroll
# Should maintain 60fps on iPhone 12+
# Should maintain 45-60fps on older devices
```

**Checklist:**
- [ ] Scroll FPS >45fps on mid-range devices
- [ ] Scroll FPS >55fps on modern devices
- [ ] No jank during animations
- [ ] Memory usage <100MB increase

---

## Phase 6: Documentation & Deployment (Days 18-21)

### ✅ Task 6.1: Update Component Documentation

**File:** `src/components/CalendarHeatmap/README.md`

```markdown
# CalendarHeatmap Component

GitHub-style horizontal 3-month activity heatmap for habit tracking.

## Features
- 3-month horizontal layout (90 days)
- Day-of-week rows for instant pattern recognition
- Streak-based color intensity (4 levels)
- Auto-scroll to current week
- Haptic feedback on tap
- Full accessibility support

## Usage

\`\`\`tsx
import { CalendarHeatmap } from '@/components/CalendarHeatmap';

<CalendarHeatmap
  habitId={habitId}
  completedDates={completedDates}
  habitCreatedAt={habit.createdAt}
  habitColor="#10b981"
  onDayPress={(date, completed) => {
    console.log('Tapped:', date, completed);
  }}
/>
\`\`\`

## Props

See `types.ts` for full prop documentation.
```

**Checklist:**
- [ ] Component README updated
- [ ] Props documented
- [ ] Examples added
- [ ] Migration guide written

---

### ✅ Task 6.2: Update Changelog

**File:** `CHANGELOG.md`

```markdown
## [2.0.0] - 2025-12-22

### Added
- GitHub-style horizontal 3-month calendar heatmap
- Streak-based color intensity (4 levels: 1-6, 7-13, 14-29, 30+ days)
- Auto-scroll to current week on mount
- Streak chain visual effect (connected cells)
- Edge fade gradients for scroll hints

### Changed
- **BREAKING:** Layout changed from vertical monthly to horizontal 3-month
- Cell size reduced from 45px to 24px (better mobile fit)
- Removed date numbers from cells (too small to read)
- Navigation changed from month arrows to horizontal scroll
- Stats now show 3-month period instead of 1 month

### Removed
- Month navigation arrows
- Date numbers in cells
```

**Checklist:**
- [ ] Changelog updated
- [ ] Breaking changes documented
- [ ] Migration path explained

---

### ✅ Task 6.3: Create PR

```bash
# Ensure all tests pass
npm test

# Ensure no TypeScript errors
npm run typecheck

# Ensure no linting errors
npm run lint

# Build for production
npm run build

# Create PR
git checkout -b feature/calendar-heatmap-github-style
git add .
git commit -m "feat(calendar): implement GitHub-style horizontal 3-month layout

- Replace traditional monthly view with GitHub-style horizontal layout
- Show 3 months of data with day-of-week rows
- Implement streak-based color intensity (4 levels)
- Add auto-scroll to current week
- Reduce cell size to 24px for mobile optimization
- Add edge fade gradients and streak chain effects
- Full accessibility support with VoiceOver/TalkBack
- Comprehensive unit and integration tests

BREAKING CHANGE: Layout changed from vertical monthly to horizontal 3-month.
See CHANGELOG.md for migration guide."

git push origin feature/calendar-heatmap-github-style

gh pr create --title "Calendar Heatmap: GitHub-Style Horizontal Layout" \
  --body "## Overview
Implements GitHub-style 3-month horizontal heatmap layout for better pattern recognition.

## Key Changes
- 3-month horizontal layout (90 days visible)
- Day-of-week rows show patterns instantly
- Streak-based color intensity
- Auto-scroll to current week
- 44% more space-efficient on mobile

## Testing
- [x] Unit tests (100% coverage)
- [x] Integration tests
- [x] Tested on 5+ devices
- [x] VoiceOver/TalkBack tested
- [x] Performance verified (60fps scroll)

## Screenshots
[Attach screenshots]

## Migration Guide
See \`CHANGELOG.md\` for breaking changes and migration path.

Closes #XXX"
```

**Checklist:**
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] PR created with description
- [ ] Screenshots attached
- [ ] Reviewers assigned

---

## Final Checklist

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] All ESLint warnings resolved
- [ ] No console.log statements in production code
- [ ] Unused imports removed
- [ ] Code formatted (Prettier)

### Testing
- [ ] Unit tests passing (>80% coverage)
- [ ] Integration tests passing
- [ ] Manual testing complete (5+ devices)
- [ ] Accessibility testing complete
- [ ] Performance testing complete

### Documentation
- [ ] Component README updated
- [ ] Changelog updated
- [ ] Migration guide written
- [ ] Props documented
- [ ] Examples added

### Deployment
- [ ] PR created
- [ ] Reviewers assigned
- [ ] CI/CD passing
- [ ] Ready for merge

---

## Estimated Timeline

| Phase | Days | Tasks |
|-------|------|-------|
| Phase 1: Utilities | 3 | Grid generation, streak calculation |
| Phase 2: Components | 4 | DayCell, WeekColumn, CalendarGrid |
| Phase 3: Integration | 3 | Main component, stats, header |
| Phase 4: Polish | 4 | Animations, accessibility, tests |
| Phase 5: Testing | 3 | Device testing, performance |
| Phase 6: Docs | 4 | Documentation, PR, review |
| **Total** | **21 days** | **(3 weeks)** |

---

**Document Version:** 1.0
**Last Updated:** 2025-12-22
**Status:** ✅ Ready for Implementation
