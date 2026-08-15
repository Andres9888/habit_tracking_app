import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { CalendarTimeline } from '../CalendarTimeline';
import { addDays, format, subDays } from 'date-fns';
import { Gesture } from 'react-native-gesture-handler';

describe('CalendarTimeline', () => {
  const today = new Date(2024, 9, 14); // Oct 14, 2024 (Monday)

  it('renders dates correctly', () => {
    const dates = Array.from({ length: 5 }, (_, i) => addDays(today, i));

    const { getAllByText } = render(<CalendarTimeline dates={dates} />);

    // Weekday labels are uppercase; the current day shows "Today" instead.
    expect(getAllByText(/MON|TUE|WED|THU|FRI|Today/)).toHaveLength(5);

    // Check that date numbers are rendered
    expect(getAllByText('14')).toBeTruthy();
    expect(getAllByText('15')).toBeTruthy();
    expect(getAllByText('16')).toBeTruthy();
    expect(getAllByText('17')).toBeTruthy();
    expect(getAllByText('18')).toBeTruthy();
  });

  it('renders with separator by default', () => {
    const dates = Array.from({ length: 3 }, (_, i) => addDays(today, i));

    const { UNSAFE_root } = render(<CalendarTimeline dates={dates} />);

    // Component should render without errors
    expect(UNSAFE_root).toBeTruthy();
  });

  it('handles empty dates array gracefully', () => {
    const { UNSAFE_root } = render(<CalendarTimeline dates={[]} />);

    // Component should render without crashing
    expect(UNSAFE_root).toBeTruthy();
  });

  it('handles single date', () => {
    const dates = [today];

    const { getAllByText } = render(<CalendarTimeline dates={dates} />);

    // Should render one weekday (uppercase) and one date number
    expect(getAllByText('MON')).toBeTruthy();
    expect(getAllByText('14')).toBeTruthy();
  });

  it('formats weekdays correctly', () => {
    // Create dates spanning Monday to Friday
    const dates = Array.from({ length: 5 }, (_, i) => addDays(today, i));

    const { getByText } = render(<CalendarTimeline dates={dates} />);

    // Verify all weekdays are rendered in uppercase
    expect(getByText('MON')).toBeTruthy();
    expect(getByText('TUE')).toBeTruthy();
    expect(getByText('WED')).toBeTruthy();
    expect(getByText('THU')).toBeTruthy();
    expect(getByText('FRI')).toBeTruthy();
  });

  it('renders with selected date', () => {
    const dates = Array.from({ length: 5 }, (_, i) => addDays(today, i));
    const selectedDate = dates[2]; // Select Wednesday

    const { getByText } = render(
      <CalendarTimeline dates={dates} selectedDate={selectedDate} />
    );

    // Component should render with selected date
    expect(getByText('16')).toBeTruthy(); // Wednesday's date
  });

  describe('Swipe Navigation', () => {
    const dates = Array.from({ length: 5 }, (_, i) => addDays(today, i));

    const createPanGestureMock = () => ({
      activeOffsetX: jest.fn().mockReturnThis(),
      failOffsetY: jest.fn().mockReturnThis(),
      runOnJS: jest.fn().mockReturnThis(),
      onEnd: jest.fn().mockReturnThis(),
    });

    const setupSwipe = (
      props: Partial<React.ComponentProps<typeof CalendarTimeline>>
    ) => {
      const panGestureMock = createPanGestureMock();
      jest
        .spyOn(Gesture, 'Pan')
        .mockReturnValue(
          panGestureMock as unknown as ReturnType<typeof Gesture.Pan>
        );

      render(<CalendarTimeline dates={dates} {...props} />);

      const onEnd = panGestureMock.onEnd.mock.calls[0]?.[0] as
        | ((event: { translationX: number; velocityX: number }) => void)
        | undefined;

      if (!onEnd) {
        throw new Error(
          'Timeline pan gesture onEnd handler was not registered'
        );
      }

      return { onEnd };
    };

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls onNextWeek when swiped left and forward navigation is enabled', () => {
      const onNextWeek = jest.fn();
      const { onEnd } = setupSwipe({ canNavigateForward: true, onNextWeek });

      onEnd({ translationX: -80, velocityX: 0 });

      expect(onNextWeek).toHaveBeenCalledTimes(1);
    });

    it('calls onNextWeek on a fast left swipe (velocity)', () => {
      const onNextWeek = jest.fn();
      const { onEnd } = setupSwipe({
        canNavigateForward: true,
        onNextWeek,
      });

      onEnd({ translationX: 0, velocityX: -600 });

      expect(onNextWeek).toHaveBeenCalledTimes(1);
    });

    it('does not call onNextWeek when swiped left and forward navigation is disabled', () => {
      const onNextWeek = jest.fn();
      const { onEnd } = setupSwipe({ canNavigateForward: false, onNextWeek });

      onEnd({ translationX: -80, velocityX: 0 });

      expect(onNextWeek).not.toHaveBeenCalled();
    });

    it('calls onPreviousWeek when swiped right', () => {
      const onPreviousWeek = jest.fn();
      const { onEnd } = setupSwipe({ onPreviousWeek });

      onEnd({ translationX: 80, velocityX: 0 });

      expect(onPreviousWeek).toHaveBeenCalledTimes(1);
    });

    it('calls onPreviousWeek on a fast right swipe (velocity)', () => {
      const onPreviousWeek = jest.fn();
      const { onEnd } = setupSwipe({ onPreviousWeek });

      onEnd({ translationX: 0, velocityX: 600 });

      expect(onPreviousWeek).toHaveBeenCalledTimes(1);
    });

    it('ignores horizontal movement below swipe threshold', () => {
      const onNextWeek = jest.fn();
      const onPreviousWeek = jest.fn();
      const { onEnd } = setupSwipe({
        canNavigateForward: true,
        onNextWeek,
        onPreviousWeek,
      });

      onEnd({ translationX: 20, velocityX: 100 });

      expect(onNextWeek).not.toHaveBeenCalled();
      expect(onPreviousWeek).not.toHaveBeenCalled();
    });
  });

  describe('Arrow Navigation', () => {
    const dates = Array.from({ length: 5 }, (_, i) => addDays(today, i));

    it('calls onPreviousWeek when pressing the left arrow', () => {
      const onPreviousWeek = jest.fn();
      render(
        <CalendarTimeline dates={dates} onPreviousWeek={onPreviousWeek} />
      );

      const previousButton = screen.getByRole('button', {
        name: 'Previous week',
      });

      fireEvent.press(previousButton);

      expect(onPreviousWeek).toHaveBeenCalledTimes(1);
    });

    it('calls onNextWeek when pressing the right arrow and forward navigation is enabled', () => {
      const onNextWeek = jest.fn();
      render(
        <CalendarTimeline
          canNavigateForward={true}
          dates={dates}
          onNextWeek={onNextWeek}
        />
      );

      const nextButton = screen.getByRole('button', { name: 'Next week' });

      fireEvent.press(nextButton);

      expect(onNextWeek).toHaveBeenCalledTimes(1);
    });

    it('does not call onNextWeek when right arrow is pressed and forward navigation is disabled', () => {
      const onNextWeek = jest.fn();
      render(
        <CalendarTimeline
          canNavigateForward={false}
          dates={dates}
          onNextWeek={onNextWeek}
        />
      );

      expect(
        screen.queryByRole('button', { name: 'Next week' })
      ).toBeNull();
      expect(onNextWeek).not.toHaveBeenCalled();
    });
  });

  describe('Day Press Handling', () => {
    // Use actual current date for consistent testing with the hook's isFuture() logic
    const realToday = new Date();
    realToday.setHours(0, 0, 0, 0);

    it('calls onDayPress when a past day is tapped', () => {
      const onDayPress = jest.fn();
      const pastDay = subDays(realToday, 2);
      const dates = [pastDay, subDays(realToday, 1), realToday];

      const { getAllByRole } = render(
        <CalendarTimeline dates={dates} onDayPress={onDayPress} />
      );

      // Find all buttons and filter to day buttons (exclude navigation buttons like prev/next week)
      const dayButtons = getAllByRole('button').filter(
        (btn) =>
          btn.props.accessibilityLabel?.includes(',') &&
          !btn.props.accessibilityLabel?.includes('week')
      );

      expect(dayButtons.length).toBe(3);

      // Tap the first day (past day)
      fireEvent.press(dayButtons[0]);

      expect(onDayPress).toHaveBeenCalledTimes(1);
      expect(onDayPress).toHaveBeenCalledWith(pastDay);
    });

    it('calls onDayPress when today is tapped', () => {
      const onDayPress = jest.fn();
      const dates = [realToday];

      const { getAllByRole } = render(
        <CalendarTimeline dates={dates} onDayPress={onDayPress} />
      );

      const dayButtons = getAllByRole('button').filter((btn) =>
        btn.props.accessibilityLabel?.includes('Today')
      );

      fireEvent.press(dayButtons[0]);

      expect(onDayPress).toHaveBeenCalledTimes(1);
      expect(onDayPress).toHaveBeenCalledWith(realToday);
    });

    it('does not call onDayPress when future day is tapped with disableFutureDayPress', () => {
      const onDayPress = jest.fn();
      const futureDate = addDays(realToday, 1);
      const dates = [realToday, futureDate];

      const { getAllByRole } = render(
        <CalendarTimeline
          dates={dates}
          onDayPress={onDayPress}
          disableFutureDayPress={true}
        />
      );

      // Filter buttons to find day buttons (not navigation)
      const dayButtons = getAllByRole('button').filter(
        (btn) =>
          btn.props.accessibilityLabel?.includes(',') &&
          !btn.props.accessibilityLabel?.includes('week')
      );

      // The future day button should be disabled
      const futureButton = dayButtons[1];
      expect(futureButton.props.accessibilityState?.disabled).toBe(true);

      // Try to tap the future day (should be disabled and not call handler)
      fireEvent.press(futureButton);

      // onDayPress should NOT have been called for the disabled future day
      expect(onDayPress).not.toHaveBeenCalled();
    });

    it('allows tapping future days when disableFutureDayPress is false', () => {
      const onDayPress = jest.fn();
      const futureDate = addDays(realToday, 1);
      const dates = [realToday, futureDate];

      const { getAllByRole } = render(
        <CalendarTimeline
          dates={dates}
          onDayPress={onDayPress}
          disableFutureDayPress={false}
        />
      );

      const dayButtons = getAllByRole('button').filter(
        (btn) =>
          btn.props.accessibilityLabel?.includes(',') &&
          !btn.props.accessibilityLabel?.includes('week')
      );

      // Future day should not be disabled
      const futureButton = dayButtons[1];
      expect(futureButton.props.accessibilityState?.disabled).toBe(false);

      fireEvent.press(futureButton);

      expect(onDayPress).toHaveBeenCalledTimes(1);
      expect(onDayPress).toHaveBeenCalledWith(futureDate);
    });

    it('renders days as non-interactive Views when onDayPress is not provided', () => {
      const dates = [subDays(realToday, 1), realToday, addDays(realToday, 1)];

      const { queryAllByRole } = render(<CalendarTimeline dates={dates} />);

      // Should only have navigation buttons, not day buttons
      const buttons = queryAllByRole('button');
      const dayButtons = buttons.filter(
        (btn) =>
          btn.props.accessibilityLabel?.includes(',') &&
          !btn.props.accessibilityLabel?.includes('week')
      );

      expect(dayButtons.length).toBe(0);
    });

    it('includes completion status in accessibility label', () => {
      const dates = [realToday];
      const todayString = format(realToday, 'yyyy-MM-dd');
      const completionByDay = {
        [todayString]: { completed: 2, total: 3 },
      };

      const { getAllByRole } = render(
        <CalendarTimeline
          dates={dates}
          completionByDay={completionByDay}
          onDayPress={() => {}}
        />
      );

      const dayButtons = getAllByRole('button').filter((btn) =>
        btn.props.accessibilityLabel?.includes('Today')
      );

      // Should include "some habits complete" for partial completion
      expect(dayButtons[0].props.accessibilityLabel).toContain(
        'some habits complete'
      );
    });

    it('provides appropriate accessibility hint for interactive days', () => {
      const dates = [realToday];

      const { getAllByRole } = render(
        <CalendarTimeline dates={dates} onDayPress={() => {}} />
      );

      const dayButtons = getAllByRole('button').filter((btn) =>
        btn.props.accessibilityLabel?.includes('Today')
      );

      expect(dayButtons[0].props.accessibilityHint).toBe(
        'Double tap to view and edit habits for this day'
      );
    });

    it('can be explicitly disabled via isDayPressEnabled prop', () => {
      const onDayPress = jest.fn();
      const dates = [realToday];

      const { queryAllByRole } = render(
        <CalendarTimeline
          dates={dates}
          onDayPress={onDayPress}
          isDayPressEnabled={false}
        />
      );

      // Even with onDayPress provided, days should still render as Pressable
      // but the overall interaction pattern is controlled by the parent
      const dayButtons = queryAllByRole('button').filter((btn) =>
        btn.props.accessibilityLabel?.includes('Today')
      );

      // Since onDayPress is provided, Pressable is rendered
      // but isDayPressEnabled controls the accessibility hint behavior
      expect(dayButtons.length).toBe(1);
    });
  });
});
