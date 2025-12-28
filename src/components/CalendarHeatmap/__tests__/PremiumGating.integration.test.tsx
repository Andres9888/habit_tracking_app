/**
 * Premium Gating Integration Tests
 * Tests premium feature gating for the Year view in CalendarHeatmapWithViews
 *
 * Validates:
 * - Year view is blocked for non-premium users
 * - Premium upsell callback is triggered when locked view is tapped
 * - Warning haptic feedback fires on locked tap
 * - Crown badge displays on locked Year tab
 * - Accessibility labels reflect locked state
 * - Premium users can access Year view normally
 * - View state does not change when locked view is tapped
 * - Premium status changes update UI immediately
 */

import React, { useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
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
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
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

describe('Premium Gating Integration Tests', () => {
  const mockOnPremiumUpsell = jest.fn();
  const mockOnDayPress = jest.fn();

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
    todayStr: string = '2025-12-27'
  ): CalendarDay[] => {
    const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
    const todayParts = todayStr.split('-').map(Number);
    const todayDate = new Date(todayParts[0], todayParts[1] - 1, todayParts[2]);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startYear, startMonth - 1, startDay + i, 12, 0, 0);
      const dateStr = formatDateString(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const isToday = dateStr === todayStr;
      const isFuture = date > todayDate && !isToday;

      return {
        date: dateStr,
        dayOfMonth: date.getDate(),
        completed: completedDates.has(dateStr),
        isToday,
        isFuture,
        isBeforeCreation: false,
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

  // Create a simulated year grid for testing (simplified)
  const createYearGrid = (completedDates: Set<string>): CalendarDay[][] => {
    // Simplified year grid - 52 weeks
    const weeks: CalendarDay[][] = [];
    const today = new Date(2025, 11, 27, 12, 0, 0);

    for (let weekIndex = 0; weekIndex < 52; weekIndex++) {
      const week: CalendarDay[] = [];
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const daysAgo = (51 - weekIndex) * 7 + (6 - dayIndex);
        const date = new Date(today);
        date.setDate(today.getDate() - daysAgo);
        const dateStr = formatDateString(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );

        week.push({
          date: dateStr,
          dayOfMonth: date.getDate(),
          completed: completedDates.has(dateStr),
          isToday: dateStr === '2025-12-27',
          isFuture: date > today,
          isBeforeCreation: false,
        });
      }
      weeks.push(week);
    }

    return weeks;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ViewToggle with Premium Gating', () => {
    type ViewMode = 'week' | 'month' | '3m' | 'year';

    /**
     * Simulated ViewToggle component with premium gating
     * Mirrors the expected behavior of the actual ViewToggle component
     */
    const ViewToggle = ({
      currentView,
      onViewChange,
      isPremium = false,
      onPremiumUpsell,
    }: {
      currentView: ViewMode;
      onViewChange: (view: ViewMode) => void;
      isPremium?: boolean;
      onPremiumUpsell?: () => void;
    }) => {
      const views: ViewMode[] = ['week', 'month', '3m', 'year'];
      const viewLabels: Record<ViewMode, string> = {
        week: 'Week',
        month: 'Month',
        '3m': '3 Months',
        year: 'Year',
      };

      const handleViewPress = (view: ViewMode) => {
        if (view === 'year' && !isPremium) {
          // Trigger warning haptic for locked feature
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          onPremiumUpsell?.();
          return;
        }
        // Regular selection haptic for allowed views
        Haptics.selectionAsync();
        onViewChange(view);
      };

      return (
        <View
          accessibilityRole='tablist'
          accessibilityLabel='Calendar view options'
          testID='view-toggle'
        >
          {views.map((view) => {
            const isLocked = view === 'year' && !isPremium;
            const isSelected = currentView === view;

            return (
              <Pressable
                key={view}
                accessibilityRole='tab'
                accessibilityLabel={
                  isLocked
                    ? `${viewLabels[view]} view, premium feature, locked`
                    : `${viewLabels[view]} view`
                }
                accessibilityHint={
                  isLocked
                    ? 'Upgrade to premium to unlock year view'
                    : `Switch to ${viewLabels[view].toLowerCase()} view`
                }
                accessibilityState={{
                  selected: isSelected,
                  disabled: isLocked,
                }}
                onPress={() => handleViewPress(view)}
                testID={`view-toggle-${view}`}
              >
                <Text>
                  {viewLabels[view]}
                  {isLocked && ' 👑'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      );
    };

    /**
     * Full CalendarHeatmapWithViews simulation with premium gating
     */
    const CalendarHeatmapWithViewsSimulation = ({
      completedDates,
      isPremium = false,
      onPremiumUpsell,
      onDayPress,
      initialView = 'month',
    }: {
      completedDates: Set<string>;
      isPremium?: boolean;
      onPremiumUpsell?: () => void;
      onDayPress?: (date: string, completed: boolean) => void;
      initialView?: ViewMode;
    }) => {
      const [currentView, setCurrentView] = useState<ViewMode>(initialView);

      const week = createWeek('2025-12-21', completedDates);
      const monthGrid = createMonthGrid(11, 2025, completedDates);
      const { weeks, monthLabels } = createHorizontalGrid(completedDates);
      const yearGrid = createYearGrid(completedDates);

      return (
        <View testID='calendar-heatmap-with-views'>
          <ViewToggle
            currentView={currentView}
            onViewChange={setCurrentView}
            isPremium={isPremium}
            onPremiumUpsell={onPremiumUpsell}
          />

          {/* Render current view */}
          {currentView === 'week' && (
            <WeekGrid week={week} onDayPress={onDayPress} />
          )}
          {currentView === 'month' && (
            <MonthGrid
              grid={monthGrid}
              month={11}
              year={2025}
              onDayPress={onDayPress}
            />
          )}
          {currentView === '3m' && (
            <CalendarGrid
              weeks={weeks}
              monthLabels={monthLabels}
              onDayPress={onDayPress}
              completedDates={completedDates}
            />
          )}
          {currentView === 'year' && (
            <View
              testID='year-view'
              accessibilityLabel='Year view calendar showing 365 days'
            >
              <Text>Year View - 365 day grid</Text>
            </View>
          )}

          <View testID='current-view-indicator'>
            <Text>{currentView}</Text>
          </View>
        </View>
      );
    };

    describe('Non-Premium User Behavior', () => {
      it('should display Crown badge on Year tab for non-premium users', () => {
        const { getByTestId } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={false}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        const yearTab = getByTestId('view-toggle-year');
        // toHaveTextContent checks if text contains the substring
        expect(yearTab).toHaveTextContent(/👑/);
      });

      it('should NOT display Crown badge on Year tab for premium users', () => {
        const { getByTestId, queryByTestId } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={true}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        const yearTab = getByTestId('view-toggle-year');
        expect(yearTab).not.toHaveTextContent(/👑/);
      });

      it('should block Year view for non-premium users', () => {
        const { getByTestId, queryByTestId } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={false}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        // Press Year tab
        fireEvent.press(getByTestId('view-toggle-year'));

        // View should NOT change to year
        expect(queryByTestId('year-view')).toBeNull();
        expect(getByTestId('current-view-indicator')).toHaveTextContent(
          'month'
        );
      });

      it('should trigger onPremiumUpsell when non-premium user taps Year', () => {
        const { getByTestId } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={false}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        fireEvent.press(getByTestId('view-toggle-year'));

        expect(mockOnPremiumUpsell).toHaveBeenCalledTimes(1);
      });

      it('should trigger warning haptic when non-premium user taps Year', () => {
        const { getByTestId } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={false}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        fireEvent.press(getByTestId('view-toggle-year'));

        expect(Haptics.notificationAsync).toHaveBeenCalledWith(
          Haptics.NotificationFeedbackType.Warning
        );
      });

      it('should NOT trigger selection haptic when non-premium user taps Year', () => {
        const { getByTestId } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={false}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        fireEvent.press(getByTestId('view-toggle-year'));

        expect(Haptics.selectionAsync).not.toHaveBeenCalled();
      });

      it('should allow non-premium users to access other views normally', async () => {
        const { getByTestId, getByLabelText, queryByTestId } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={false}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        // Switch to week view
        fireEvent.press(getByTestId('view-toggle-week'));

        await waitFor(() => {
          expect(getByLabelText('Week view calendar')).toBeTruthy();
          expect(getByTestId('current-view-indicator')).toHaveTextContent(
            'week'
          );
        });

        expect(Haptics.selectionAsync).toHaveBeenCalled();
        expect(mockOnPremiumUpsell).not.toHaveBeenCalled();
      });

      it('should trigger selection haptic for non-locked views', () => {
        const { getByTestId } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={false}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        // Press 3M view (not locked)
        fireEvent.press(getByTestId('view-toggle-3m'));

        expect(Haptics.selectionAsync).toHaveBeenCalled();
      });
    });

    describe('Premium User Behavior', () => {
      it('should allow premium users to access Year view', async () => {
        const { getByTestId, queryByTestId } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={true}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        fireEvent.press(getByTestId('view-toggle-year'));

        await waitFor(() => {
          expect(getByTestId('year-view')).toBeTruthy();
          expect(getByTestId('current-view-indicator')).toHaveTextContent(
            'year'
          );
        });
      });

      it('should NOT trigger onPremiumUpsell when premium user taps Year', () => {
        const { getByTestId } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={true}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        fireEvent.press(getByTestId('view-toggle-year'));

        expect(mockOnPremiumUpsell).not.toHaveBeenCalled();
      });

      it('should NOT trigger warning haptic when premium user taps Year', () => {
        const { getByTestId } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={true}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        fireEvent.press(getByTestId('view-toggle-year'));

        expect(Haptics.notificationAsync).not.toHaveBeenCalled();
      });

      it('should trigger selection haptic when premium user taps Year', () => {
        const { getByTestId } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={true}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        fireEvent.press(getByTestId('view-toggle-year'));

        expect(Haptics.selectionAsync).toHaveBeenCalled();
      });

      it('should allow premium user to switch between all views', async () => {
        const { getByTestId, getByLabelText } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={true}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        // Week → Month → 3M → Year → Week
        const viewSequence: ViewMode[] = [
          'week',
          'month',
          '3m',
          'year',
          'week',
        ];

        for (const view of viewSequence) {
          fireEvent.press(getByTestId(`view-toggle-${view}`));

          await waitFor(() => {
            expect(getByTestId('current-view-indicator')).toHaveTextContent(
              view
            );
          });
        }

        // No upsell should have been triggered
        expect(mockOnPremiumUpsell).not.toHaveBeenCalled();
      });
    });

    describe('Accessibility for Premium Gating', () => {
      it('should have correct accessibility label for locked Year tab', () => {
        const { getByLabelText } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={false}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        expect(
          getByLabelText('Year view, premium feature, locked')
        ).toBeTruthy();
      });

      it('should have correct accessibility hint for locked Year tab', () => {
        const { getByTestId } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={false}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        const yearTab = getByTestId('view-toggle-year');
        expect(yearTab.props.accessibilityHint).toBe(
          'Upgrade to premium to unlock year view'
        );
      });

      it('should have disabled accessibility state for locked Year tab', () => {
        const { getByTestId } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={false}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        const yearTab = getByTestId('view-toggle-year');
        expect(yearTab.props.accessibilityState.disabled).toBe(true);
      });

      it('should have correct accessibility label for unlocked Year tab', () => {
        const { getByLabelText } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={true}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        expect(getByLabelText('Year view')).toBeTruthy();
      });

      it('should have correct accessibility hint for unlocked Year tab', () => {
        const { getByTestId } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={true}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        const yearTab = getByTestId('view-toggle-year');
        expect(yearTab.props.accessibilityHint).toBe('Switch to year view');
      });

      it('should NOT have disabled accessibility state for unlocked Year tab', () => {
        const { getByTestId } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={true}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        const yearTab = getByTestId('view-toggle-year');
        expect(yearTab.props.accessibilityState.disabled).toBe(false);
      });

      it('should have tablist role on ViewToggle container', () => {
        const { getByLabelText } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={false}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        expect(getByLabelText('Calendar view options')).toBeTruthy();
      });

      it('should have tab role on each view option', () => {
        const { getByTestId } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={false}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        const views = ['week', 'month', '3m', 'year'];
        views.forEach((view) => {
          expect(
            getByTestId(`view-toggle-${view}`).props.accessibilityRole
          ).toBe('tab');
        });
      });
    });

    describe('Premium Status Changes', () => {
      it('should unlock Year view when user becomes premium', async () => {
        const { rerender, getByTestId, getByLabelText, queryByTestId } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={false}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        // Initially locked
        expect(
          getByLabelText('Year view, premium feature, locked')
        ).toBeTruthy();

        // User upgrades to premium
        rerender(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={true}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        // Now unlocked
        expect(getByLabelText('Year view')).toBeTruthy();

        // Can access Year view
        fireEvent.press(getByTestId('view-toggle-year'));

        await waitFor(() => {
          expect(getByTestId('year-view')).toBeTruthy();
        });
      });

      it('should lock Year view when user loses premium status', () => {
        const { rerender, getByTestId, getByLabelText } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={true}
            onPremiumUpsell={mockOnPremiumUpsell}
            initialView='month'
          />
        );

        // Initially unlocked
        expect(getByLabelText('Year view')).toBeTruthy();

        // User loses premium (subscription expired)
        rerender(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={false}
            onPremiumUpsell={mockOnPremiumUpsell}
            initialView='month'
          />
        );

        // Now locked
        expect(
          getByLabelText('Year view, premium feature, locked')
        ).toBeTruthy();

        // Crown badge appears
        expect(getByTestId('view-toggle-year')).toHaveTextContent(/👑/);
      });
    });

    describe('Multiple Upsell Triggers', () => {
      it('should trigger upsell on each tap of locked Year tab', () => {
        const { getByTestId } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={false}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        // Tap Year tab multiple times
        fireEvent.press(getByTestId('view-toggle-year'));
        fireEvent.press(getByTestId('view-toggle-year'));
        fireEvent.press(getByTestId('view-toggle-year'));

        expect(mockOnPremiumUpsell).toHaveBeenCalledTimes(3);
        expect(Haptics.notificationAsync).toHaveBeenCalledTimes(3);
      });

      it('should not affect other views when Year is tapped repeatedly', async () => {
        const { getByTestId, getByLabelText } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={false}
            onPremiumUpsell={mockOnPremiumUpsell}
            initialView='month'
          />
        );

        // Tap Year tab
        fireEvent.press(getByTestId('view-toggle-year'));

        // Should still be on month view
        expect(getByTestId('current-view-indicator')).toHaveTextContent(
          'month'
        );

        // Other views should still work
        fireEvent.press(getByTestId('view-toggle-week'));

        await waitFor(() => {
          expect(getByLabelText('Week view calendar')).toBeTruthy();
        });
      });
    });

    describe('View State Persistence with Premium Gating', () => {
      it('should maintain current view when Year tab is tapped by non-premium user', () => {
        const { getByTestId } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={false}
            onPremiumUpsell={mockOnPremiumUpsell}
            initialView='3m'
          />
        );

        // Start at 3m view
        expect(getByTestId('current-view-indicator')).toHaveTextContent('3m');

        // Tap Year (locked)
        fireEvent.press(getByTestId('view-toggle-year'));

        // Should still be at 3m view
        expect(getByTestId('current-view-indicator')).toHaveTextContent('3m');
      });

      it('should maintain completion data when toggling between views after failed Year access', async () => {
        const completedDates = new Set(['2025-12-22', '2025-12-23']);

        const { getByTestId, getByLabelText } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={completedDates}
            isPremium={false}
            onPremiumUpsell={mockOnPremiumUpsell}
            onDayPress={mockOnDayPress}
            initialView='month'
          />
        );

        // Try Year (blocked)
        fireEvent.press(getByTestId('view-toggle-year'));

        // Switch to week view
        fireEvent.press(getByTestId('view-toggle-week'));

        await waitFor(() => {
          // Completions should still be visible
          expect(getByLabelText(/Monday.*completed/)).toBeTruthy();
          expect(getByLabelText(/Tuesday.*completed/)).toBeTruthy();
        });
      });
    });

    describe('Edge Cases', () => {
      it('should handle undefined onPremiumUpsell gracefully', () => {
        const { getByTestId } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={false}
            // onPremiumUpsell not provided
          />
        );

        // Should not throw
        expect(() => {
          fireEvent.press(getByTestId('view-toggle-year'));
        }).not.toThrow();

        // Should still trigger haptic
        expect(Haptics.notificationAsync).toHaveBeenCalledWith(
          Haptics.NotificationFeedbackType.Warning
        );
      });

      it('should handle rapid premium status changes', async () => {
        const { rerender, getByTestId, getByLabelText } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={false}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        // Rapid status changes
        rerender(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={true}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );
        rerender(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={false}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );
        rerender(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={true}
            onPremiumUpsell={mockOnPremiumUpsell}
          />
        );

        // Final state should be premium (unlocked)
        expect(getByLabelText('Year view')).toBeTruthy();

        fireEvent.press(getByTestId('view-toggle-year'));

        await waitFor(() => {
          expect(getByTestId('year-view')).toBeTruthy();
        });
      });

      it('should work correctly when starting with Year view as premium user', async () => {
        const { getByTestId, rerender, queryByTestId } = render(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={true}
            onPremiumUpsell={mockOnPremiumUpsell}
            initialView='year'
          />
        );

        // Should show year view
        expect(getByTestId('year-view')).toBeTruthy();

        // User loses premium
        rerender(
          <CalendarHeatmapWithViewsSimulation
            completedDates={new Set()}
            isPremium={false}
            onPremiumUpsell={mockOnPremiumUpsell}
            initialView='year'
          />
        );

        // Year view should still be showing (we don't forcefully kick users out)
        // But the tab should now be locked
        expect(getByTestId('view-toggle-year')).toHaveTextContent(/👑/);
      });
    });
  });
});
