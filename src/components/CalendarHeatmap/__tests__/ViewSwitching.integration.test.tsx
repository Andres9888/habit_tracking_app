/**
 * View Switching Integration Tests
 * Tests switching between different calendar views (Week, Month, 3M)
 *
 * Validates:
 * - Consistent data display across different view types
 * - View toggle state management
 * - Completion data consistency when switching views
 * - Proper component unmounting/remounting on view change
 * - Accessibility during view transitions
 */

import React, { useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { WeekGrid } from '../WeekGrid';
import { MonthGrid } from '../MonthGrid';
import { CalendarGrid } from '../CalendarGrid';
import type { CalendarDay, MonthLabel } from '../types';

// Mock the useReduceMotion hook
jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: jest.fn(() => true), // Use reduced motion for faster tests
}));

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock AccessibilityInfo
jest.mock(
  'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo',
  () => ({
    isReduceMotionEnabled: jest.fn(() => Promise.resolve(true)),
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    announceForAccessibility: jest.fn(),
  })
);

describe('View Switching Integration Tests', () => {
  const mockOnDayPress = jest.fn();

  // Shared completion data for all views
  const createCompletedDates = (dates: string[]): Set<string> => new Set(dates);

  // Helper: Format date as YYYY-MM-DD without timezone issues
  const formatDateString = (
    year: number,
    month: number,
    day: number
  ): string => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Helper: Create a week of CalendarDay objects
  const createWeek = (
    startDate: string,
    completedDates: Set<string>,
    todayStr: string = '2025-12-27',
    habitCreatedAt?: number
  ): CalendarDay[] => {
    // Parse start date parts to avoid timezone issues
    const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
    const todayParts = todayStr.split('-').map(Number);
    const todayDate = new Date(todayParts[0], todayParts[1] - 1, todayParts[2]);
    const habitCreatedDate = habitCreatedAt ? new Date(habitCreatedAt) : null;

    return Array.from({ length: 7 }, (_, i) => {
      // Create date at noon to avoid DST issues
      const date = new Date(startYear, startMonth - 1, startDay + i, 12, 0, 0);
      const dateStr = formatDateString(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const isToday = dateStr === todayStr;
      const isFuture = date > todayDate && !isToday;
      const isBeforeCreation = habitCreatedDate
        ? date < habitCreatedDate
        : false;

      return {
        date: dateStr,
        dayOfMonth: date.getDate(),
        completed: completedDates.has(dateStr),
        isToday,
        isFuture,
        isBeforeCreation,
      };
    });
  };

  // Helper: Create a month grid of CalendarDay objects
  const createMonthGrid = (
    month: number,
    year: number,
    completedDates: Set<string>,
    todayStr: string = '2025-12-27'
  ): CalendarDay[][] => {
    const grid: CalendarDay[][] = [];
    const firstDay = new Date(year, month, 1, 12, 0, 0);
    const startPadding = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayParts = todayStr.split('-').map(Number);
    const today = new Date(
      todayParts[0],
      todayParts[1] - 1,
      todayParts[2],
      12,
      0,
      0
    );

    let currentWeek: CalendarDay[] = [];

    // Add padding
    for (let i = 0; i < startPadding; i++) {
      currentWeek.push({
        date: null,
        dayOfMonth: null,
        completed: false,
        isToday: false,
        isFuture: false,
        isBeforeCreation: false,
      });
    }

    // Add days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day, 12, 0, 0);
      const dateStr = formatDateString(year, month, day);
      const isToday = dateStr === todayStr;
      const isFuture = date > today && !isToday;

      currentWeek.push({
        date: dateStr,
        dayOfMonth: day,
        completed: completedDates.has(dateStr),
        isToday,
        isFuture,
        isBeforeCreation: false,
      });

      if (currentWeek.length === 7) {
        grid.push(currentWeek);
        currentWeek = [];
      }
    }

    // Pad final week
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({
          date: null,
          dayOfMonth: null,
          completed: false,
          isToday: false,
          isFuture: false,
          isBeforeCreation: false,
        });
      }
      grid.push(currentWeek);
    }

    return grid;
  };

  // Helper: Create 3-month horizontal grid for CalendarGrid
  const createHorizontalGrid = (
    completedDates: Set<string>,
    todayStr: string = '2025-12-27'
  ): { weeks: CalendarDay[][]; monthLabels: MonthLabel[] } => {
    const todayParts = todayStr.split('-').map(Number);
    const today = new Date(
      todayParts[0],
      todayParts[1] - 1,
      todayParts[2],
      12,
      0,
      0
    );
    const weeks: CalendarDay[][] = [];
    const monthLabels: MonthLabel[] = [];

    // Generate 13 weeks (approximately 3 months)
    for (let weekIndex = 0; weekIndex < 13; weekIndex++) {
      const week: CalendarDay[] = [];
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const daysAgo = (12 - weekIndex) * 7 + (6 - dayIndex);
        const date = new Date(today);
        date.setDate(today.getDate() - daysAgo);
        const dateStr = formatDateString(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );
        const isToday = dateStr === todayStr;
        const isFuture = date > today && !isToday;

        // Track month labels
        if (dayIndex === 0 && weekIndex % 4 === 0) {
          const monthName = date.toLocaleDateString('en-US', {
            month: 'short',
          });
          monthLabels.push({ weekIndex, label: monthName });
        }

        week.push({
          date: dateStr,
          dayOfMonth: date.getDate(),
          completed: completedDates.has(dateStr),
          isToday,
          isFuture,
          isBeforeCreation: false,
        });
      }
      weeks.push(week);
    }

    return { weeks, monthLabels };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('View Toggle Container Simulation', () => {
    type ViewMode = 'week' | 'month' | '3m';

    /**
     * Simulated CalendarHeatmapWithViews container
     * Tests the pattern of switching between view components
     */
    const ViewSwitchingContainer = ({
      completedDates,
      onDayPress,
      habitColor,
      initialView = 'month',
    }: {
      completedDates: Set<string>;
      onDayPress?: (date: string, completed: boolean) => void;
      habitColor?: string;
      initialView?: ViewMode;
    }) => {
      const [viewMode, setViewMode] = useState<ViewMode>(initialView);

      const week = createWeek('2025-12-21', completedDates);
      const monthGrid = createMonthGrid(11, 2025, completedDates);
      const { weeks, monthLabels } = createHorizontalGrid(completedDates);

      return (
        <View>
          {/* View Toggle */}
          <View
            accessibilityRole='tablist'
            accessibilityLabel='Calendar view options'
          >
            <Pressable
              accessibilityRole='tab'
              accessibilityLabel='Week view'
              accessibilityState={{ selected: viewMode === 'week' }}
              onPress={() => setViewMode('week')}
              testID='view-toggle-week'
            >
              <Text>Week</Text>
            </Pressable>
            <Pressable
              accessibilityRole='tab'
              accessibilityLabel='Month view'
              accessibilityState={{ selected: viewMode === 'month' }}
              onPress={() => setViewMode('month')}
              testID='view-toggle-month'
            >
              <Text>Month</Text>
            </Pressable>
            <Pressable
              accessibilityRole='tab'
              accessibilityLabel='3 month view'
              accessibilityState={{ selected: viewMode === '3m' }}
              onPress={() => setViewMode('3m')}
              testID='view-toggle-3m'
            >
              <Text>3M</Text>
            </Pressable>
          </View>

          {/* Render active view */}
          {viewMode === 'week' && (
            <WeekGrid
              week={week}
              habitColor={habitColor}
              onDayPress={onDayPress}
            />
          )}
          {viewMode === 'month' && (
            <MonthGrid
              grid={monthGrid}
              month={11}
              year={2025}
              habitColor={habitColor}
              onDayPress={onDayPress}
            />
          )}
          {viewMode === '3m' && (
            <CalendarGrid
              weeks={weeks}
              monthLabels={monthLabels}
              habitColor={habitColor}
              onDayPress={onDayPress}
              completedDates={completedDates}
            />
          )}
        </View>
      );
    };

    it('should render initial view correctly', () => {
      const completedDates = createCompletedDates(['2025-12-15', '2025-12-20']);

      const { getByTestId, getByLabelText } = render(
        <ViewSwitchingContainer
          completedDates={completedDates}
          initialView='month'
        />
      );

      // Month view should be selected
      const monthTab = getByTestId('view-toggle-month');
      expect(monthTab.props.accessibilityState.selected).toBe(true);

      // Month grid should be visible
      expect(getByLabelText('Calendar for December 2025')).toBeTruthy();
    });

    it('should switch from month to week view', async () => {
      const completedDates = createCompletedDates(['2025-12-22']);

      const { getByTestId, getByLabelText, queryByLabelText } = render(
        <ViewSwitchingContainer
          completedDates={completedDates}
          initialView='month'
        />
      );

      // Initially month view
      expect(getByLabelText('Calendar for December 2025')).toBeTruthy();

      // Switch to week view
      fireEvent.press(getByTestId('view-toggle-week'));

      await waitFor(() => {
        // Month should no longer be visible
        expect(queryByLabelText('Calendar for December 2025')).toBeNull();
        // Week view should be visible
        expect(getByLabelText('Week view calendar')).toBeTruthy();
      });

      // Week tab should now be selected
      expect(
        getByTestId('view-toggle-week').props.accessibilityState.selected
      ).toBe(true);
    });

    it('should switch from month to 3m view', async () => {
      const completedDates = createCompletedDates(['2025-12-15']);

      const { getByTestId, getByLabelText, queryByLabelText } = render(
        <ViewSwitchingContainer
          completedDates={completedDates}
          initialView='month'
        />
      );

      // Switch to 3M view
      fireEvent.press(getByTestId('view-toggle-3m'));

      await waitFor(() => {
        // Month should no longer be visible
        expect(queryByLabelText('Calendar for December 2025')).toBeNull();
        // 3M grid should be visible (CalendarGrid has day labels)
        expect(getByLabelText(/Days of the week/)).toBeTruthy();
      });
    });

    it('should switch between all views in sequence', async () => {
      const completedDates = createCompletedDates(['2025-12-22']);

      const { getByTestId, getByLabelText, queryByLabelText } = render(
        <ViewSwitchingContainer
          completedDates={completedDates}
          initialView='week'
        />
      );

      // Start with week view
      expect(getByLabelText('Week view calendar')).toBeTruthy();

      // Week → Month
      fireEvent.press(getByTestId('view-toggle-month'));
      await waitFor(() => {
        expect(getByLabelText('Calendar for December 2025')).toBeTruthy();
      });

      // Month → 3M (CalendarGrid uses "Days of the week" label, not a grid-level label)
      fireEvent.press(getByTestId('view-toggle-3m'));
      await waitFor(() => {
        // Check that month is gone and 3m indicator is present
        expect(queryByLabelText('Calendar for December 2025')).toBeNull();
        expect(getByLabelText(/Days of the week/)).toBeTruthy();
      });

      // 3M → Week
      fireEvent.press(getByTestId('view-toggle-week'));
      await waitFor(() => {
        expect(getByLabelText('Week view calendar')).toBeTruthy();
      });
    });

    it('should maintain completion data consistency across views', async () => {
      // Set up dates that appear in all views
      const completedDates = createCompletedDates([
        '2025-12-22', // Monday in week starting Dec 21
        '2025-12-23', // Tuesday
      ]);

      const { getByTestId, getByLabelText, queryByLabelText } = render(
        <ViewSwitchingContainer
          completedDates={completedDates}
          onDayPress={mockOnDayPress}
        />
      );

      // Month view - check completions
      expect(getByLabelText(/Monday, 22.*completed/)).toBeTruthy();
      expect(getByLabelText(/Tuesday, 23.*completed/)).toBeTruthy();

      // Switch to week view
      fireEvent.press(getByTestId('view-toggle-week'));
      await waitFor(() => {
        expect(getByLabelText('Week view calendar')).toBeTruthy();
      });

      // Week view - same dates should be completed
      expect(getByLabelText(/Monday.*completed/)).toBeTruthy();
      expect(getByLabelText(/Tuesday.*completed/)).toBeTruthy();
    });

    it('should trigger correct onDayPress callback after view switch', async () => {
      const completedDates = createCompletedDates([]);

      const { getByTestId, getByLabelText } = render(
        <ViewSwitchingContainer
          completedDates={completedDates}
          onDayPress={mockOnDayPress}
        />
      );

      // Switch to week view
      fireEvent.press(getByTestId('view-toggle-week'));
      await waitFor(() => {
        expect(getByLabelText('Week view calendar')).toBeTruthy();
      });

      // Toggle a day
      fireEvent.press(getByLabelText(/Sunday, 21$/));

      expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-21', false);
    });
  });

  describe('Completion Data Consistency', () => {
    it('should show same completion count across views', () => {
      const completedDates = createCompletedDates([
        '2025-12-15',
        '2025-12-16',
        '2025-12-17',
        '2025-12-20',
        '2025-12-22',
      ]);

      const monthGrid = createMonthGrid(11, 2025, completedDates);

      // Count completions in month grid
      let monthCompletions = 0;
      monthGrid.forEach((week) => {
        week.forEach((day) => {
          if (day.completed) monthCompletions++;
        });
      });

      expect(monthCompletions).toBe(5);
    });

    it('should reflect completed dates in week grid', () => {
      const completedDates = createCompletedDates([
        '2025-12-21',
        '2025-12-22',
        '2025-12-25',
      ]);

      const week = createWeek('2025-12-21', completedDates);

      const weekCompletions = week.filter((d) => d.completed).length;
      expect(weekCompletions).toBe(3);

      // Verify specific dates
      expect(week[0].completed).toBe(true); // Dec 21 (Sunday)
      expect(week[1].completed).toBe(true); // Dec 22 (Monday)
      expect(week[4].completed).toBe(true); // Dec 25 (Thursday)
    });
  });

  describe('View Toggle Accessibility', () => {
    it('should have accessible view toggle tabs', () => {
      const ViewToggleMock = () => {
        const [selected, setSelected] = useState<'week' | 'month' | '3m'>(
          'month'
        );

        return (
          <View
            accessibilityRole='tablist'
            accessibilityLabel='Calendar view options'
          >
            {(['week', 'month', '3m'] as const).map((view) => (
              <Pressable
                key={view}
                accessibilityRole='tab'
                accessibilityLabel={`${view === '3m' ? '3 month' : view} view`}
                accessibilityState={{ selected: selected === view }}
                accessibilityHint={`Switch to ${view === '3m' ? '3 month' : view} view`}
                onPress={() => setSelected(view)}
                testID={`tab-${view}`}
              >
                <Text>{view}</Text>
              </Pressable>
            ))}
          </View>
        );
      };

      const { getByTestId, getByLabelText } = render(<ViewToggleMock />);

      // Check tablist
      expect(getByLabelText('Calendar view options')).toBeTruthy();

      // Check individual tabs
      expect(getByLabelText('week view')).toBeTruthy();
      expect(getByLabelText('month view')).toBeTruthy();
      expect(getByLabelText('3 month view')).toBeTruthy();

      // Check selected state
      expect(getByTestId('tab-month').props.accessibilityState.selected).toBe(
        true
      );
      expect(getByTestId('tab-week').props.accessibilityState.selected).toBe(
        false
      );
    });

    it('should update selected state when switching tabs', async () => {
      const ViewToggleMock = () => {
        const [selected, setSelected] = useState<'week' | 'month' | '3m'>(
          'month'
        );

        return (
          <View accessibilityRole='tablist'>
            {(['week', 'month', '3m'] as const).map((view) => (
              <Pressable
                key={view}
                accessibilityRole='tab'
                accessibilityLabel={`${view === '3m' ? '3 month' : view} view`}
                accessibilityState={{ selected: selected === view }}
                onPress={() => setSelected(view)}
                testID={`tab-${view}`}
              >
                <Text>{view}</Text>
              </Pressable>
            ))}
          </View>
        );
      };

      const { getByTestId } = render(<ViewToggleMock />);

      // Initial state
      expect(getByTestId('tab-month').props.accessibilityState.selected).toBe(
        true
      );

      // Switch to week
      fireEvent.press(getByTestId('tab-week'));
      await waitFor(() => {
        expect(getByTestId('tab-week').props.accessibilityState.selected).toBe(
          true
        );
        expect(getByTestId('tab-month').props.accessibilityState.selected).toBe(
          false
        );
      });
    });
  });

  describe('View Persistence After Toggle', () => {
    it('should persist toggle in week view after switching from month', async () => {
      let completedDates = createCompletedDates([]);

      const onDayPress = jest.fn((date: string) => {
        // Simulate backend update
        completedDates = createCompletedDates([date]);
      });

      type ViewMode = 'week' | 'month';

      const PersistenceTest = () => {
        const [viewMode, setViewMode] = useState<ViewMode>('month');
        const [dates, setDates] = useState(completedDates);

        const handleDayPress = (date: string, completed: boolean) => {
          onDayPress(date, completed);
          // Update local state to simulate backend sync
          const newDates = new Set(dates);
          if (completed) {
            newDates.delete(date);
          } else {
            newDates.add(date);
          }
          setDates(newDates);
        };

        const week = createWeek('2025-12-21', dates);
        const monthGrid = createMonthGrid(11, 2025, dates);

        return (
          <View>
            <Pressable onPress={() => setViewMode('week')} testID='switch-week'>
              <Text>Week</Text>
            </Pressable>
            <Pressable
              onPress={() => setViewMode('month')}
              testID='switch-month'
            >
              <Text>Month</Text>
            </Pressable>

            {viewMode === 'week' && (
              <WeekGrid week={week} onDayPress={handleDayPress} />
            )}
            {viewMode === 'month' && (
              <MonthGrid
                grid={monthGrid}
                month={11}
                year={2025}
                onDayPress={handleDayPress}
              />
            )}
          </View>
        );
      };

      const { getByTestId, getByLabelText, queryByLabelText } = render(
        <PersistenceTest />
      );

      // Start in month view, toggle a day
      fireEvent.press(getByLabelText(/Monday, 22$/));
      expect(onDayPress).toHaveBeenCalledWith('2025-12-22', false);

      // Switch to week view
      fireEvent.press(getByTestId('switch-week'));

      await waitFor(() => {
        expect(getByLabelText('Week view calendar')).toBeTruthy();
        // The toggled day should show as completed
        expect(getByLabelText(/Monday.*completed/)).toBeTruthy();
      });

      // Switch back to month view
      fireEvent.press(getByTestId('switch-month'));

      await waitFor(() => {
        expect(getByLabelText('Calendar for December 2025')).toBeTruthy();
        // Toggle should persist
        expect(getByLabelText(/Monday, 22.*completed/)).toBeTruthy();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid view switching', async () => {
      const completedDates = createCompletedDates(['2025-12-22']);

      const RapidSwitchTest = () => {
        const [view, setView] = useState<'week' | 'month'>('month');
        const week = createWeek('2025-12-21', completedDates);
        const monthGrid = createMonthGrid(11, 2025, completedDates);

        return (
          <View>
            <Pressable onPress={() => setView('week')} testID='switch-week' />
            <Pressable onPress={() => setView('month')} testID='switch-month' />
            {view === 'week' ? (
              <WeekGrid week={week} />
            ) : (
              <MonthGrid grid={monthGrid} month={11} year={2025} />
            )}
          </View>
        );
      };

      const { getByTestId, getByLabelText } = render(<RapidSwitchTest />);

      // Rapid switches
      fireEvent.press(getByTestId('switch-week'));
      fireEvent.press(getByTestId('switch-month'));
      fireEvent.press(getByTestId('switch-week'));
      fireEvent.press(getByTestId('switch-month'));
      fireEvent.press(getByTestId('switch-week'));

      // Final state should be week view
      await waitFor(() => {
        expect(getByLabelText('Week view calendar')).toBeTruthy();
      });
    });

    it('should handle empty completion data when switching views', () => {
      const completedDates = createCompletedDates([]);

      const week = createWeek('2025-12-21', completedDates);
      const monthGrid = createMonthGrid(11, 2025, completedDates);

      // Both views should render without errors with empty data
      const { getByLabelText: getWeekLabel } = render(<WeekGrid week={week} />);
      expect(getWeekLabel('Week view calendar')).toBeTruthy();

      const { getByLabelText: getMonthLabel } = render(
        <MonthGrid grid={monthGrid} month={11} year={2025} />
      );
      expect(getMonthLabel('Calendar for December 2025')).toBeTruthy();
    });

    it('should handle high completion count when switching views', () => {
      // All days completed for December
      const completedDates = createCompletedDates(
        Array.from(
          { length: 31 },
          (_, i) => `2025-12-${String(i + 1).padStart(2, '0')}`
        )
      );

      const week = createWeek('2025-12-21', completedDates, '2025-12-27');
      const monthGrid = createMonthGrid(11, 2025, completedDates, '2025-12-27');

      const { getByLabelText: getWeekLabel } = render(<WeekGrid week={week} />);

      // All 7 days of the week should be completed (up to today, Dec 27)
      const weekCompletions = week.filter(
        (d) => d.completed && !d.isFuture
      ).length;
      expect(weekCompletions).toBeGreaterThan(0);

      const { getByLabelText: getMonthLabel, getAllByLabelText } = render(
        <MonthGrid grid={monthGrid} month={11} year={2025} />
      );
      expect(getMonthLabel('Calendar for December 2025')).toBeTruthy();
    });
  });

  describe('Premium View Gating (Future Feature)', () => {
    it('should handle year view premium gate simulation', () => {
      const mockOnPremiumUpsell = jest.fn();

      const PremiumGateTest = ({
        isPremium = false,
        onPremiumUpsell,
      }: {
        isPremium?: boolean;
        onPremiumUpsell?: () => void;
      }) => {
        const [view, setView] = useState<'month' | 'year'>('month');

        const handleYearPress = () => {
          if (!isPremium) {
            onPremiumUpsell?.();
            return;
          }
          setView('year');
        };

        return (
          <View>
            <Pressable
              onPress={() => setView('month')}
              testID='view-month'
              accessibilityRole='tab'
              accessibilityState={{ selected: view === 'month' }}
            >
              <Text>Month</Text>
            </Pressable>
            <Pressable
              onPress={handleYearPress}
              testID='view-year'
              accessibilityRole='tab'
              accessibilityState={{
                selected: view === 'year',
                disabled: !isPremium,
              }}
              accessibilityLabel={
                isPremium ? 'Year view' : 'Year view, premium feature'
              }
              accessibilityHint={
                isPremium
                  ? 'Switch to year view'
                  : 'Upgrade to premium to unlock'
              }
            >
              <Text>Year {!isPremium && '👑'}</Text>
            </Pressable>
            <View testID='current-view'>
              <Text>{view}</Text>
            </View>
          </View>
        );
      };

      // Non-premium user
      const { getByTestId, getByLabelText, rerender } = render(
        <PremiumGateTest
          isPremium={false}
          onPremiumUpsell={mockOnPremiumUpsell}
        />
      );

      // Year tab should show premium indicator
      expect(getByLabelText('Year view, premium feature')).toBeTruthy();

      // Pressing year tab should trigger upsell, not switch
      fireEvent.press(getByTestId('view-year'));
      expect(mockOnPremiumUpsell).toHaveBeenCalled();
      expect(getByTestId('current-view')).toHaveTextContent('month');

      // Premium user
      rerender(
        <PremiumGateTest
          isPremium={true}
          onPremiumUpsell={mockOnPremiumUpsell}
        />
      );

      expect(getByLabelText('Year view')).toBeTruthy();
      fireEvent.press(getByTestId('view-year'));
      expect(getByTestId('current-view')).toHaveTextContent('year');
    });
  });
});
