/**
 * CalendarHeatmap Accessibility Tests
 *
 * Automated tests that verify accessibility props are correctly set
 * for screen reader compatibility (VoiceOver/TalkBack).
 *
 * Note: These tests verify the accessibility props are set correctly,
 * but manual testing with actual screen readers is still recommended.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { format, subMonths, addMonths } from 'date-fns';
import { CalendarHeatmap } from '../CalendarHeatmap';
import { DayCell } from '../DayCell';
import {
  getDayAccessibilityLabel,
  formatDateForAccessibility,
  generateMonthGrid,
  DAY_NAMES_FULL,
  type CalendarDay,
} from '../utils';

// Mock ID type for testing
const mockHabitId = 'test-habit-id' as any;

// Wrapper component for gesture handler
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <GestureHandlerRootView style={{ flex: 1 }}>{children}</GestureHandlerRootView>
);

describe('CalendarHeatmap Accessibility', () => {
  describe('formatDateForAccessibility', () => {
    it('formats date in human-readable format', () => {
      const formatted = formatDateForAccessibility('2025-12-20');
      expect(formatted).toBe('Saturday, December 20, 2025');
    });

    it('handles different dates correctly', () => {
      expect(formatDateForAccessibility('2025-01-01')).toBe('Wednesday, January 1, 2025');
      expect(formatDateForAccessibility('2025-07-04')).toBe('Friday, July 4, 2025');
    });
  });

  describe('getDayAccessibilityLabel', () => {
    it('returns "Empty cell" for null date', () => {
      const day: CalendarDay = {
        date: null,
        dayOfMonth: null,
        completed: false,
        isToday: false,
        isFuture: false,
        isBeforeCreation: false,
      };
      expect(getDayAccessibilityLabel(day)).toBe('Empty cell');
    });

    it('indicates before habit tracking started', () => {
      const day: CalendarDay = {
        date: '2025-12-01',
        dayOfMonth: 1,
        completed: false,
        isToday: false,
        isFuture: false,
        isBeforeCreation: true,
      };
      const label = getDayAccessibilityLabel(day);
      expect(label).toContain('Before habit tracking started');
      expect(label).toContain('Monday, December 1, 2025');
    });

    it('indicates future date', () => {
      const day: CalendarDay = {
        date: '2025-12-25',
        dayOfMonth: 25,
        completed: false,
        isToday: false,
        isFuture: true,
        isBeforeCreation: false,
      };
      const label = getDayAccessibilityLabel(day);
      expect(label).toContain('Future date');
      expect(label).toContain('Thursday, December 25, 2025');
    });

    it('indicates completed status', () => {
      const day: CalendarDay = {
        date: '2025-12-15',
        dayOfMonth: 15,
        completed: true,
        isToday: false,
        isFuture: false,
        isBeforeCreation: false,
      };
      const label = getDayAccessibilityLabel(day);
      expect(label).toContain('Completed');
      expect(label).toContain('Monday, December 15, 2025');
    });

    it('indicates not completed status', () => {
      const day: CalendarDay = {
        date: '2025-12-15',
        dayOfMonth: 15,
        completed: false,
        isToday: false,
        isFuture: false,
        isBeforeCreation: false,
      };
      const label = getDayAccessibilityLabel(day);
      expect(label).toContain('Not completed');
    });

    it('indicates today with completion status', () => {
      const day: CalendarDay = {
        date: '2025-12-20',
        dayOfMonth: 20,
        completed: true,
        isToday: true,
        isFuture: false,
        isBeforeCreation: false,
      };
      const label = getDayAccessibilityLabel(day);
      expect(label).toContain('Today');
      expect(label).toContain('Completed');
    });
  });

  describe('DAY_NAMES_FULL', () => {
    it('contains all seven days with full names', () => {
      expect(DAY_NAMES_FULL).toHaveLength(7);
      expect(DAY_NAMES_FULL[0]).toBe('Sunday');
      expect(DAY_NAMES_FULL[1]).toBe('Monday');
      expect(DAY_NAMES_FULL[2]).toBe('Tuesday');
      expect(DAY_NAMES_FULL[3]).toBe('Wednesday');
      expect(DAY_NAMES_FULL[4]).toBe('Thursday');
      expect(DAY_NAMES_FULL[5]).toBe('Friday');
      expect(DAY_NAMES_FULL[6]).toBe('Saturday');
    });
  });

  describe('DayCell accessibility props', () => {
    const baseDay: CalendarDay = {
      date: '2025-12-15',
      dayOfMonth: 15,
      completed: false,
      isToday: false,
      isFuture: false,
      isBeforeCreation: false,
    };

    it('sets accessible=true for all cell types', () => {
      const { getByLabelText } = render(
        <TestWrapper>
          <DayCell day={baseDay} index={0} />
        </TestWrapper>
      );
      // If accessible=true, the label should be findable
      expect(getByLabelText(/December 15, 2025/)).toBeTruthy();
    });

    it('sets accessibilityRole="button" for interactive cells', () => {
      const { getByRole } = render(
        <TestWrapper>
          <DayCell day={baseDay} index={0} />
        </TestWrapper>
      );
      expect(getByRole('button')).toBeTruthy();
    });

    it('sets accessibilityRole="text" for non-interactive cells', () => {
      const futureDay: CalendarDay = {
        ...baseDay,
        isFuture: true,
      };
      const { queryByRole } = render(
        <TestWrapper>
          <DayCell day={futureDay} index={0} />
        </TestWrapper>
      );
      // Future cells should not be buttons
      expect(queryByRole('button')).toBeNull();
    });

    it('sets accessibilityHint="Today" for today cells', () => {
      const todayDay: CalendarDay = {
        ...baseDay,
        isToday: true,
      };
      const { getByRole } = render(
        <TestWrapper>
          <DayCell day={todayDay} index={0} />
        </TestWrapper>
      );
      const button = getByRole('button');
      expect(button.props.accessibilityHint).toBe('Today');
    });

    it('sets accessibilityHint for past cells', () => {
      const { getByRole } = render(
        <TestWrapper>
          <DayCell day={baseDay} index={0} />
        </TestWrapper>
      );
      const button = getByRole('button');
      expect(button.props.accessibilityHint).toBe('Tap to view details');
    });

    it('sets accessibilityState.selected for completed cells', () => {
      const completedDay: CalendarDay = {
        ...baseDay,
        completed: true,
      };
      const { getByRole } = render(
        <TestWrapper>
          <DayCell day={completedDay} index={0} />
        </TestWrapper>
      );
      const button = getByRole('button');
      expect(button.props.accessibilityState).toEqual({ selected: true });
    });
  });

  describe('CalendarHeatmap container accessibility', () => {
    const emptyDates = new Set<string>();

    it('has accessibility label on container', () => {
      const { getByLabelText } = render(
        <TestWrapper>
          <CalendarHeatmap
            habitId={mockHabitId}
            completedDates={emptyDates}
          />
        </TestWrapper>
      );
      expect(getByLabelText('Habit activity calendar')).toBeTruthy();
    });

    it('header has accessibilityRole="header"', () => {
      const { getByRole } = render(
        <TestWrapper>
          <CalendarHeatmap
            habitId={mockHabitId}
            completedDates={emptyDates}
          />
        </TestWrapper>
      );
      expect(getByRole('header')).toBeTruthy();
    });

    it('summary stats has accessibilityRole="summary"', () => {
      const { getByRole } = render(
        <TestWrapper>
          <CalendarHeatmap
            habitId={mockHabitId}
            completedDates={emptyDates}
          />
        </TestWrapper>
      );
      expect(getByRole('summary')).toBeTruthy();
    });
  });

  describe('Month navigation accessibility', () => {
    const emptyDates = new Set<string>();

    it('previous month button has descriptive accessibility label', () => {
      const { getAllByRole } = render(
        <TestWrapper>
          <CalendarHeatmap
            habitId={mockHabitId}
            completedDates={emptyDates}
          />
        </TestWrapper>
      );
      const buttons = getAllByRole('button');
      const prevButton = buttons.find((b) =>
        b.props.accessibilityLabel?.includes('Go to')
      );
      expect(prevButton).toBeTruthy();
      expect(prevButton?.props.accessibilityHint).toBe('Navigate to previous month');
    });

    it('next month button indicates when disabled', () => {
      const { getAllByRole } = render(
        <TestWrapper>
          <CalendarHeatmap
            habitId={mockHabitId}
            completedDates={emptyDates}
          />
        </TestWrapper>
      );
      const buttons = getAllByRole('button');
      const nextButton = buttons.find((b) =>
        b.props.accessibilityLabel?.includes('Cannot go to future')
      );
      // When at current month, should indicate can't go forward
      expect(nextButton).toBeTruthy();
      expect(nextButton?.props.accessibilityState?.disabled).toBe(true);
    });

    it('month label has full month name in accessibility label', () => {
      const { getAllByLabelText } = render(
        <TestWrapper>
          <CalendarHeatmap
            habitId={mockHabitId}
            completedDates={emptyDates}
          />
        </TestWrapper>
      );
      const now = new Date();
      const monthLabel = format(now, 'MMMM yyyy');
      // Multiple elements may have the month in their labels (header, month text)
      const elementsWithMonth = getAllByLabelText(new RegExp(monthLabel));
      expect(elementsWithMonth.length).toBeGreaterThan(0);
    });
  });

  describe('Day of week labels accessibility', () => {
    const emptyDates = new Set<string>();

    it('day row has accessibility label with all day names', () => {
      const { getByLabelText } = render(
        <TestWrapper>
          <CalendarHeatmap
            habitId={mockHabitId}
            completedDates={emptyDates}
          />
        </TestWrapper>
      );
      expect(
        getByLabelText(/Sunday.*Monday.*Tuesday.*Wednesday.*Thursday.*Friday.*Saturday/)
      ).toBeTruthy();
    });

    it('individual day labels have full names for screen readers', () => {
      const { getAllByLabelText } = render(
        <TestWrapper>
          <CalendarHeatmap
            habitId={mockHabitId}
            completedDates={emptyDates}
          />
        </TestWrapper>
      );
      // Each day should have its full name accessible
      expect(getAllByLabelText('Sunday')).toBeTruthy();
      expect(getAllByLabelText('Monday')).toBeTruthy();
      expect(getAllByLabelText('Tuesday')).toBeTruthy();
      expect(getAllByLabelText('Wednesday')).toBeTruthy();
      expect(getAllByLabelText('Thursday')).toBeTruthy();
      expect(getAllByLabelText('Friday')).toBeTruthy();
      expect(getAllByLabelText('Saturday')).toBeTruthy();
    });
  });

  describe('Summary stats accessibility', () => {
    it('provides comprehensive summary for screen readers', () => {
      const completedDates = new Set(['2025-12-01', '2025-12-05', '2025-12-10']);
      const { getByRole } = render(
        <TestWrapper>
          <CalendarHeatmap
            habitId={mockHabitId}
            completedDates={completedDates}
          />
        </TestWrapper>
      );
      const summary = getByRole('summary');
      // Summary should contain: month name, completion count, and success rate
      expect(summary.props.accessibilityLabel).toMatch(/Activity calendar for/);
      expect(summary.props.accessibilityLabel).toMatch(/\d+ day/);
      expect(summary.props.accessibilityLabel).toMatch(/\d+% success rate/);
    });
  });
});

/**
 * MANUAL TESTING CHECKLIST FOR VOICEOVER/TALKBACK
 *
 * The following tests must be performed manually on actual devices:
 *
 * iOS VoiceOver Testing:
 * 1. Enable VoiceOver (Settings > Accessibility > VoiceOver)
 * 2. Navigate to HabitDetailScreen with a habit that has completion data
 * 3. Verify the following announcements:
 *
 *    Container:
 *    [ ] "Habit activity calendar" announced when entering component
 *
 *    Header:
 *    [ ] "Activity for [Month Year], heading" announced
 *    [ ] Month navigation buttons announce their function
 *    [ ] Disabled forward button announces "Cannot go to future months"
 *
 *    Day Labels:
 *    [ ] Full day names announced (e.g., "Sunday" not "S")
 *
 *    Day Cells:
 *    [ ] Completed days announce: "[Day name], [Full Date]. Completed"
 *    [ ] Not completed days announce: "[Full Date]. Not completed"
 *    [ ] Today announces: "Today, [Full Date]. [Completed/Not completed]"
 *    [ ] Future dates announce: "[Full Date]. Future date"
 *    [ ] Before-creation dates announce: "[Full Date]. Before habit tracking started"
 *    [ ] Interactive cells announce "button" role
 *    [ ] Non-interactive cells do not announce "button" role
 *
 *    Summary:
 *    [ ] Announces "[N] days completed, [X]% success rate"
 *
 *    Navigation:
 *    [ ] Swipe left/right triggers month navigation
 *    [ ] Double-tap on day cells triggers onDayPress callback
 *
 * Android TalkBack Testing:
 * 1. Enable TalkBack (Settings > Accessibility > TalkBack)
 * 2. Repeat all iOS tests above
 * 3. Additionally verify:
 *    [ ] Touch exploration works correctly
 *    [ ] Linear navigation (swipe right/left) moves through cells in order
 *    [ ] Explore by touch announces correct labels
 *
 * Cross-Platform Verification:
 * [ ] All labels are localization-friendly (no hardcoded strings in tests)
 * [ ] Color contrast meets WCAG AA standards
 * [ ] Touch targets are at least 44x44 points
 * [ ] Focus order follows logical reading order
 */
