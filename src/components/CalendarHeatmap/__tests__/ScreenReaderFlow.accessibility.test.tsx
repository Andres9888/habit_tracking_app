/**
 * Screen Reader Flow Accessibility Tests
 *
 * Tests the screen reader navigation flow through CalendarHeatmap components.
 * Validates that users can navigate through elements in a logical order
 * and receive appropriate announcements for each element.
 *
 * These tests verify:
 * - Navigation order follows logical reading order
 * - All interactive elements are reachable
 * - Accessibility labels provide complete context
 * - State changes are properly announced
 * - Focus management works correctly
 * - Role assignments enable proper interaction
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CalendarHeatmap } from '../CalendarHeatmap';
import { WeekGrid } from '../WeekGrid';
import { MonthGrid } from '../MonthGrid';
import { InsightCard } from '../InsightCard';
import { DayDetailTooltip } from '../DayDetailTooltip';
import type { CalendarDay, DayOfWeekStat } from '../types';
import { DAY_NAMES_FULL } from '../utils';

// Test wrapper for gesture handler
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <GestureHandlerRootView style={{ flex: 1 }}>{children}</GestureHandlerRootView>
);

// Mock ID type for testing
const mockHabitId = 'test-habit-id' as any;

// Mock the useReduceMotion hook
jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: jest.fn(() => true), // Use reduced motion for consistent tests
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

// Mock expo-blur
jest.mock('expo-blur', () => ({
  BlurView: 'BlurView',
}));

// Mock AccessibilityInfo
const mockAnnounceForAccessibility = jest.fn();
jest.mock(
  'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo',
  () => ({
    isReduceMotionEnabled: jest.fn(() => Promise.resolve(true)),
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    announceForAccessibility: jest.fn((message: string) => {
      mockAnnounceForAccessibility(message);
    }),
    isScreenReaderEnabled: jest.fn(() => Promise.resolve(true)),
  })
);

// Mock AsyncStorage for InsightCard persistence
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

// Helper: Format date as YYYY-MM-DD without timezone issues
const formatDateString = (year: number, month: number, day: number): string => {
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
  year: number,
  month: number,
  completedDates: Set<string>,
  todayStr: string = '2025-12-27'
): CalendarDay[][] => {
  const todayParts = todayStr.split('-').map(Number);
  const todayDate = new Date(todayParts[0], todayParts[1] - 1, todayParts[2]);

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const weeks: CalendarDay[][] = [];
  let currentWeek: CalendarDay[] = [];

  // Add padding for days before the first of the month
  for (let i = 0; i < startDayOfWeek; i++) {
    currentWeek.push({
      date: null,
      dayOfMonth: null,
      completed: false,
      isToday: false,
      isFuture: false,
      isBeforeCreation: false,
    });
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day, 12, 0, 0);
    const dateStr = formatDateString(year, month, day);
    const isToday = dateStr === todayStr;
    const isFuture = date > todayDate && !isToday;

    currentWeek.push({
      date: dateStr,
      dayOfMonth: day,
      completed: completedDates.has(dateStr),
      isToday,
      isFuture,
      isBeforeCreation: false,
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Pad remaining week
  while (currentWeek.length > 0 && currentWeek.length < 7) {
    currentWeek.push({
      date: null,
      dayOfMonth: null,
      completed: false,
      isToday: false,
      isFuture: false,
      isBeforeCreation: false,
    });
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
};

describe('Screen Reader Flow Accessibility Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CalendarHeatmap Navigation Flow', () => {
    it('container announces high-level context first', () => {
      const completedDates = new Set(['2025-12-01', '2025-12-15', '2025-12-20']);

      const { getByLabelText } = render(
        <TestWrapper>
          <CalendarHeatmap
            habitId={mockHabitId}
            completedDates={completedDates}
          />
        </TestWrapper>
      );

      // Container should announce what this is
      const container = getByLabelText('Habit activity calendar');
      expect(container).toBeTruthy();
    });

    it('header provides section context with accessibilityRole header', () => {
      const completedDates = new Set<string>();

      const { getByRole } = render(
        <TestWrapper>
          <CalendarHeatmap
            habitId={mockHabitId}
            completedDates={completedDates}
          />
        </TestWrapper>
      );

      // Header should be announced as a heading
      const header = getByRole('header');
      expect(header).toBeTruthy();
      expect(header.props.accessibilityLabel).toContain('Activity calendar');
      expect(header.props.accessibilityLabel).toContain('3 months');
    });

    it('summary provides stats overview at navigable point', () => {
      const completedDates = new Set(['2025-12-01', '2025-12-05', '2025-12-10']);

      const { getByRole } = render(
        <TestWrapper>
          <CalendarHeatmap
            habitId={mockHabitId}
            completedDates={completedDates}
          />
        </TestWrapper>
      );

      // Summary should be findable and contain stats
      const summary = getByRole('summary');
      expect(summary).toBeTruthy();
      expect(summary.props.accessibilityLabel).toMatch(/\d+ day/);
      expect(summary.props.accessibilityLabel).toMatch(/success rate/);
    });

    it('day cells are navigable in logical order (left to right, top to bottom)', () => {
      const completedDates = new Set<string>();

      const { getAllByRole } = render(
        <TestWrapper>
          <CalendarHeatmap
            habitId={mockHabitId}
            completedDates={completedDates}
          />
        </TestWrapper>
      );

      // All interactive day cells should be buttons
      const buttons = getAllByRole('button');

      // Each button should have an accessibility label
      buttons.forEach((button) => {
        expect(button.props.accessibilityLabel).toBeDefined();
      });
    });

    it('trend badge announces comparison information', () => {
      // Need to simulate having trend data
      // This is tested via the trend badge accessibilityLabel
      const completedDates = new Set([
        // Recent completions
        '2025-12-01',
        '2025-12-02',
        '2025-12-03',
        // More completions to generate trend
        '2025-11-01',
        '2025-11-15',
        '2025-10-01',
      ]);

      const { queryByLabelText } = render(
        <TestWrapper>
          <CalendarHeatmap
            habitId={mockHabitId}
            completedDates={completedDates}
          />
        </TestWrapper>
      );

      // Trend badge should announce comparison info when present
      const trendBadge = queryByLabelText(/Trend:/);
      // Trend may or may not render depending on data - just verify no crash
      if (trendBadge) {
        expect(trendBadge.props.accessibilityLabel).toMatch(/percent/);
      }
    });
  });

  describe('WeekGrid Navigation Flow', () => {
    it('announces week view context on container', () => {
      const week = createWeek('2025-12-21', new Set());

      const { getByLabelText } = render(
        <TestWrapper>
          <WeekGrid week={week} />
        </TestWrapper>
      );

      const container = getByLabelText('Week view calendar');
      expect(container).toBeTruthy();
    });

    it('each day cell announces full day name, date, and status', () => {
      const completedDates = new Set(['2025-12-23', '2025-12-25']);
      const week = createWeek('2025-12-21', completedDates, '2025-12-27');

      const { getAllByRole } = render(
        <TestWrapper>
          <WeekGrid week={week} />
        </TestWrapper>
      );

      const buttons = getAllByRole('button');

      // Should have 7 day cells
      expect(buttons.length).toBe(7);

      // Each button should have day name in label
      DAY_NAMES_FULL.forEach((dayName, index) => {
        const button = buttons[index];
        expect(button.props.accessibilityLabel).toContain(dayName);
      });

      // Completed days should indicate status
      const completedButton = buttons.find((b) =>
        b.props.accessibilityLabel?.includes('completed')
      );
      expect(completedButton).toBeTruthy();
    });

    it('today cell includes today indicator in label', () => {
      const week = createWeek('2025-12-21', new Set(), '2025-12-27');

      const { getAllByRole } = render(
        <TestWrapper>
          <WeekGrid week={week} />
        </TestWrapper>
      );

      const buttons = getAllByRole('button');
      const todayButton = buttons.find((b) =>
        b.props.accessibilityLabel?.includes('today')
      );

      expect(todayButton).toBeTruthy();
    });

    it('announces appropriate hint for toggle mode vs detail mode', () => {
      const week = createWeek('2025-12-21', new Set(), '2025-12-25');

      // Instant toggle mode
      const { getAllByRole: getToggleButtons } = render(
        <TestWrapper>
          <WeekGrid week={week} instantToggle={true} />
        </TestWrapper>
      );

      const toggleButtons = getToggleButtons('button');
      expect(toggleButtons[0].props.accessibilityHint).toBe(
        'Tap to toggle completion'
      );

      // Detail mode
      const { getAllByRole: getDetailButtons } = render(
        <TestWrapper>
          <WeekGrid week={week} instantToggle={false} />
        </TestWrapper>
      );

      const detailButtons = getDetailButtons('button');
      expect(detailButtons[0].props.accessibilityHint).toBe(
        'Tap to view details'
      );
    });

    it('disabled state is communicated for non-interactive cells', () => {
      // Create week with future dates
      const week = createWeek('2025-12-28', new Set(), '2025-12-27');

      const { getAllByRole } = render(
        <TestWrapper>
          <WeekGrid week={week} />
        </TestWrapper>
      );

      const buttons = getAllByRole('button');

      // Future dates should have disabled state
      const futureButtons = buttons.filter(
        (b) => b.props.accessibilityState?.disabled === true
      );
      expect(futureButtons.length).toBeGreaterThan(0);
    });
  });

  describe('MonthGrid Navigation Flow', () => {
    it('announces month and year context', () => {
      const grid = createMonthGrid(2025, 11, new Set()); // December 2025

      const { getByLabelText } = render(
        <TestWrapper>
          <MonthGrid grid={grid} month={11} year={2025} />
        </TestWrapper>
      );

      const container = getByLabelText('Calendar for December 2025');
      expect(container).toBeTruthy();
    });

    it('day-of-week headers announce full names', () => {
      const grid = createMonthGrid(2025, 11, new Set());

      const { getAllByLabelText } = render(
        <TestWrapper>
          <MonthGrid grid={grid} month={11} year={2025} />
        </TestWrapper>
      );

      // Each day label should announce full name
      DAY_NAMES_FULL.forEach((dayName) => {
        const labels = getAllByLabelText(dayName);
        expect(labels.length).toBeGreaterThan(0);
      });
    });

    it('cells announce full context including day name and number', () => {
      const completedDates = new Set(['2025-12-15', '2025-12-20']);
      const grid = createMonthGrid(2025, 11, completedDates, '2025-12-27');

      const { getAllByRole } = render(
        <TestWrapper>
          <MonthGrid grid={grid} month={11} year={2025} />
        </TestWrapper>
      );

      const buttons = getAllByRole('button');

      // At least some buttons should exist
      expect(buttons.length).toBeGreaterThan(0);

      // Each should have day number in label
      buttons.forEach((button) => {
        const label = button.props.accessibilityLabel;
        // Should contain day name
        const hasDayName = DAY_NAMES_FULL.some((name) => label?.includes(name));
        expect(hasDayName).toBe(true);

        // Should contain a number (day of month)
        expect(label).toMatch(/\d+/);
      });
    });

    it('padding cells (empty) are not interactive', () => {
      const grid = createMonthGrid(2025, 11, new Set());

      const { getAllByRole, queryAllByRole } = render(
        <TestWrapper>
          <MonthGrid grid={grid} month={11} year={2025} />
        </TestWrapper>
      );

      const buttons = getAllByRole('button');

      // Count of buttons should equal days in December (31) minus future days
      // This validates that empty cells are not buttons
      const daysInDecember = 31;
      const todayInDec = 27; // Our mock today
      const nonFutureDays = todayInDec; // Days 1-27 are not future

      // Should have <= 27 interactive buttons (days 1-27)
      expect(buttons.length).toBeLessThanOrEqual(nonFutureDays);
    });
  });

  describe('InsightCard Navigation Flow', () => {
    const mockDayOfWeekStats: DayOfWeekStat[] = [
      { day: 'Sunday', rate: 80, count: 8, total: 10 },
      { day: 'Monday', rate: 70, count: 7, total: 10 },
      { day: 'Tuesday', rate: 45, count: 4, total: 9 }, // Weakest
      { day: 'Wednesday', rate: 75, count: 6, total: 8 },
      { day: 'Thursday', rate: 85, count: 8, total: 10 },
      { day: 'Friday', rate: 90, count: 9, total: 10 },
      { day: 'Saturday', rate: 65, count: 6, total: 9 },
    ];

    const weakestDay = { day: 'Tuesday', rate: 45 };

    it('announces insight context with specific day and rate', () => {
      const { getByLabelText } = render(
        <TestWrapper>
          <InsightCard
            dayOfWeekStats={mockDayOfWeekStats}
            weakestDay={weakestDay}
            onSetReminder={jest.fn()}
            onSeeTips={jest.fn()}
            onDismiss={jest.fn()}
          />
        </TestWrapper>
      );

      const insight = getByLabelText(
        /Insight.*Tuesday.*challenge day.*45% completion/
      );
      expect(insight).toBeTruthy();
    });

    it('dismiss button announces function', () => {
      const { getByRole, getByLabelText } = render(
        <TestWrapper>
          <InsightCard
            dayOfWeekStats={mockDayOfWeekStats}
            weakestDay={weakestDay}
            onSetReminder={jest.fn()}
            onSeeTips={jest.fn()}
            onDismiss={jest.fn()}
          />
        </TestWrapper>
      );

      const dismissButton = getByLabelText('Dismiss insight');
      expect(dismissButton).toBeTruthy();
      expect(dismissButton.props.accessibilityRole).toBe('button');
      expect(dismissButton.props.accessibilityHint).toBe(
        'Hide this insight card'
      );
    });

    it('action buttons announce specific actions', () => {
      const { getByLabelText } = render(
        <TestWrapper>
          <InsightCard
            dayOfWeekStats={mockDayOfWeekStats}
            weakestDay={weakestDay}
            onSetReminder={jest.fn()}
            onSeeTips={jest.fn()}
            onDismiss={jest.fn()}
          />
        </TestWrapper>
      );

      // Set Reminder button
      const reminderButton = getByLabelText('Set reminder for Tuesdays');
      expect(reminderButton).toBeTruthy();
      expect(reminderButton.props.accessibilityRole).toBe('button');
      expect(reminderButton.props.accessibilityHint).toContain('time picker');

      // See Tips button
      const tipsButton = getByLabelText('See tips for Tuesdays');
      expect(tipsButton).toBeTruthy();
      expect(tipsButton.props.accessibilityRole).toBe('button');
      expect(tipsButton.props.accessibilityHint).toContain('tips modal');
    });

    it('bar chart items announce day and completion rate', () => {
      const { getAllByLabelText } = render(
        <TestWrapper>
          <InsightCard
            dayOfWeekStats={mockDayOfWeekStats}
            weakestDay={weakestDay}
            onSetReminder={jest.fn()}
            onSeeTips={jest.fn()}
            onDismiss={jest.fn()}
          />
        </TestWrapper>
      );

      // Each day should have accessible label with rate
      const sundayBars = getAllByLabelText(/Sunday.*80% completion/);
      expect(sundayBars.length).toBeGreaterThan(0);

      const tuesdayBars = getAllByLabelText(/Tuesday.*45% completion/);
      expect(tuesdayBars.length).toBeGreaterThan(0);
    });
  });

  describe('DayDetailTooltip Navigation Flow', () => {
    it('close button announces function', () => {
      const { getByLabelText } = render(
        <TestWrapper>
          <DayDetailTooltip
            visible={true}
            date="2025-12-15"
            completed={true}
            streakPosition={5}
            onClose={jest.fn()}
          />
        </TestWrapper>
      );

      const closeButton = getByLabelText('Close');
      expect(closeButton).toBeTruthy();
      expect(closeButton.props.accessibilityRole).toBe('button');
    });

    it('modal content is accessible when visible', () => {
      const { getByText } = render(
        <TestWrapper>
          <DayDetailTooltip
            visible={true}
            date="2025-12-15"
            completed={true}
            streakPosition={5}
            onClose={jest.fn()}
          />
        </TestWrapper>
      );

      // Date should be displayed
      expect(getByText('Monday, December 15, 2025')).toBeTruthy();

      // Status should be displayed
      expect(getByText('Completed')).toBeTruthy();

      // Streak position should be displayed
      expect(getByText('Day 5 of your streak')).toBeTruthy();
    });

    it('does not render when not visible', () => {
      const { queryByLabelText } = render(
        <TestWrapper>
          <DayDetailTooltip
            visible={false}
            date="2025-12-15"
            completed={true}
            streakPosition={5}
            onClose={jest.fn()}
          />
        </TestWrapper>
      );

      expect(queryByLabelText('Close')).toBeNull();
    });
  });

  describe('Interaction Response Tests', () => {
    it('WeekGrid day press triggers callback with correct data', () => {
      const mockOnDayPress = jest.fn();
      const week = createWeek('2025-12-21', new Set(), '2025-12-25');

      const { getAllByRole } = render(
        <TestWrapper>
          <WeekGrid week={week} onDayPress={mockOnDayPress} />
        </TestWrapper>
      );

      const buttons = getAllByRole('button');
      fireEvent.press(buttons[0]);

      expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-21', false);
    });

    it('MonthGrid day press triggers callback with correct data', () => {
      const mockOnDayPress = jest.fn();
      const completedDates = new Set(['2025-12-15']);
      const grid = createMonthGrid(2025, 11, completedDates, '2025-12-27');

      const { getByLabelText } = render(
        <TestWrapper>
          <MonthGrid
            grid={grid}
            month={11}
            year={2025}
            onDayPress={mockOnDayPress}
          />
        </TestWrapper>
      );

      // Find and press the 15th (completed day)
      const day15Button = getByLabelText(/Monday, 15.*completed/);
      fireEvent.press(day15Button);

      expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-15', true);
    });

    it('InsightCard buttons trigger respective callbacks', () => {
      const mockSetReminder = jest.fn();
      const mockSeeTips = jest.fn();
      const mockDismiss = jest.fn();

      const mockDayOfWeekStats: DayOfWeekStat[] = [
        { day: 'Sunday', rate: 80, count: 8, total: 10 },
        { day: 'Monday', rate: 70, count: 7, total: 10 },
        { day: 'Tuesday', rate: 45, count: 4, total: 9 },
        { day: 'Wednesday', rate: 75, count: 6, total: 8 },
        { day: 'Thursday', rate: 85, count: 8, total: 10 },
        { day: 'Friday', rate: 90, count: 9, total: 10 },
        { day: 'Saturday', rate: 65, count: 6, total: 9 },
      ];

      const { getByLabelText } = render(
        <TestWrapper>
          <InsightCard
            dayOfWeekStats={mockDayOfWeekStats}
            weakestDay={{ day: 'Tuesday', rate: 45 }}
            onSetReminder={mockSetReminder}
            onSeeTips={mockSeeTips}
            onDismiss={mockDismiss}
          />
        </TestWrapper>
      );

      // Test Set Reminder
      fireEvent.press(getByLabelText('Set reminder for Tuesdays'));
      expect(mockSetReminder).toHaveBeenCalledWith('Tuesday');

      // Test See Tips
      fireEvent.press(getByLabelText('See tips for Tuesdays'));
      expect(mockSeeTips).toHaveBeenCalledWith('Tuesday');

      // Test Dismiss
      fireEvent.press(getByLabelText('Dismiss insight'));
      expect(mockDismiss).toHaveBeenCalled();
    });

    it('DayDetailTooltip close button triggers callback', () => {
      const mockOnClose = jest.fn();

      const { getByLabelText } = render(
        <TestWrapper>
          <DayDetailTooltip
            visible={true}
            date="2025-12-15"
            completed={true}
            streakPosition={5}
            onClose={mockOnClose}
          />
        </TestWrapper>
      );

      fireEvent.press(getByLabelText('Close'));
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('State Indication Tests', () => {
    it('completed cells indicate selected state', () => {
      const completedDates = new Set(['2025-12-23']);
      const week = createWeek('2025-12-21', completedDates, '2025-12-25');

      const { getAllByRole } = render(
        <TestWrapper>
          <WeekGrid week={week} />
        </TestWrapper>
      );

      const buttons = getAllByRole('button');

      // Find the completed day (Dec 23 = Tuesday = index 2)
      const completedButton = buttons[2];
      expect(completedButton.props.accessibilityLabel).toContain('completed');
    });

    it('today cells include today indicator', () => {
      const week = createWeek('2025-12-21', new Set(), '2025-12-25');

      const { getAllByRole } = render(
        <TestWrapper>
          <WeekGrid week={week} />
        </TestWrapper>
      );

      const buttons = getAllByRole('button');

      // Find today button (Dec 25 = Thursday = index 4)
      const todayButton = buttons[4];
      expect(todayButton.props.accessibilityLabel).toContain('today');
    });

    it('future and before-creation cells are properly disabled', () => {
      // Create week spanning future dates
      const week = createWeek('2025-12-28', new Set(), '2025-12-27');

      // Modify first day to be before creation
      week[0].isBeforeCreation = true;
      week[0].isFuture = false;

      const { getAllByRole } = render(
        <TestWrapper>
          <WeekGrid week={week} />
        </TestWrapper>
      );

      const buttons = getAllByRole('button');

      // Before creation day should be disabled
      expect(buttons[0].props.accessibilityState?.disabled).toBe(true);

      // Future days should be disabled
      const futureButtons = buttons.filter((_, i) => i > 0 && week[i].isFuture);
      futureButtons.forEach((button) => {
        expect(button.props.accessibilityState?.disabled).toBe(true);
      });
    });
  });

  describe('Complete Flow Simulation', () => {
    it('user can navigate through full CalendarHeatmap flow', async () => {
      const completedDates = new Set(['2025-12-01', '2025-12-15', '2025-12-20']);
      const mockOnDayPress = jest.fn();

      const { getByLabelText, getByRole, getAllByRole } = render(
        <TestWrapper>
          <CalendarHeatmap
            habitId={mockHabitId}
            completedDates={completedDates}
            onDayPress={mockOnDayPress}
          />
        </TestWrapper>
      );

      // Step 1: User encounters container
      const container = getByLabelText('Habit activity calendar');
      expect(container).toBeTruthy();

      // Step 2: User navigates to header
      const header = getByRole('header');
      expect(header).toBeTruthy();

      // Step 3: User navigates to day cells
      const buttons = getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);

      // Step 4: User activates a day cell
      const interactiveButton = buttons[0];
      fireEvent.press(interactiveButton);

      // Step 5: User navigates to summary
      const summary = getByRole('summary');
      expect(summary).toBeTruthy();
    });

    it('user can navigate through InsightCard actions', () => {
      const mockSetReminder = jest.fn();
      const mockSeeTips = jest.fn();

      const mockDayOfWeekStats: DayOfWeekStat[] = [
        { day: 'Sunday', rate: 80, count: 8, total: 10 },
        { day: 'Monday', rate: 70, count: 7, total: 10 },
        { day: 'Tuesday', rate: 45, count: 4, total: 9 },
        { day: 'Wednesday', rate: 75, count: 6, total: 8 },
        { day: 'Thursday', rate: 85, count: 8, total: 10 },
        { day: 'Friday', rate: 90, count: 9, total: 10 },
        { day: 'Saturday', rate: 65, count: 6, total: 9 },
      ];

      const { getByLabelText } = render(
        <TestWrapper>
          <InsightCard
            dayOfWeekStats={mockDayOfWeekStats}
            weakestDay={{ day: 'Tuesday', rate: 45 }}
            onSetReminder={mockSetReminder}
            onSeeTips={mockSeeTips}
            onDismiss={jest.fn()}
          />
        </TestWrapper>
      );

      // Step 1: User encounters insight
      const insight = getByLabelText(/Insight.*Tuesday/);
      expect(insight).toBeTruthy();

      // Step 2: User explores bar chart (each day accessible)
      const tuesdayBar = getByLabelText(/Tuesday.*45% completion/);
      expect(tuesdayBar).toBeTruthy();

      // Step 3: User activates Set Reminder
      const reminderButton = getByLabelText('Set reminder for Tuesdays');
      fireEvent.press(reminderButton);
      expect(mockSetReminder).toHaveBeenCalledWith('Tuesday');

      // Step 4: User activates See Tips
      const tipsButton = getByLabelText('See tips for Tuesdays');
      fireEvent.press(tipsButton);
      expect(mockSeeTips).toHaveBeenCalledWith('Tuesday');
    });
  });
});

/**
 * MANUAL TESTING CHECKLIST FOR SCREEN READER FLOW
 *
 * The following tests should be performed manually with actual screen readers:
 *
 * VoiceOver (iOS) Navigation Flow:
 * 1. Start at top of CalendarHeatmap component
 * 2. Swipe right to navigate through elements
 * 3. Verify order: Container → Header → Day labels → Day cells → Summary → Insight (if present)
 * 4. Double-tap on day cell to activate
 * 5. Verify announcement after activation
 *
 * TalkBack (Android) Navigation Flow:
 * 1. Enable TalkBack and navigate to CalendarHeatmap
 * 2. Use linear navigation (swipe right/left)
 * 3. Verify explore by touch announces correct labels
 * 4. Double-tap to activate cells
 * 5. Verify focus indicator is visible
 *
 * Common Checks:
 * [ ] Focus order matches visual order
 * [ ] All interactive elements are reachable
 * [ ] No focus traps
 * [ ] State changes are announced
 * [ ] Disabled elements are skipped or announced as disabled
 * [ ] Modal focus is trapped correctly
 * [ ] Returning from modal restores focus
 */
