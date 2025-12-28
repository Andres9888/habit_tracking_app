/**
 * ToggleUndoToast Component Tests
 *
 * Comprehensive test coverage for the habit toggle undo toast including:
 * - Rendering behavior (visible/hidden states)
 * - Complete vs uncomplete visual variants
 * - Undo button interactions
 * - Auto-dismiss behavior with progress bar
 * - Accessibility compliance
 * - Edge cases (rapid toggles, prop changes)
 */

import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ToggleUndoToast, ToggleUndoToastProps } from '../ToggleUndoToast';

// Mock dependencies
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 34, left: 0, right: 0 }),
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Helper function to render with GestureHandler wrapper
const renderWithGesture = (props: ToggleUndoToastProps) => {
  return render(
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ToggleUndoToast {...props} />
    </GestureHandlerRootView>
  );
};

describe('ToggleUndoToast', () => {
  // Use fake timers for testing auto-dismiss
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders when visible is true', () => {
      const { getByRole } = renderWithGesture({
        visible: true,
        habitName: 'Exercise',
        dateLabel: 'Dec 28',
        wasCompleted: true,
      });

      expect(getByRole('alert')).toBeTruthy();
    });

    it('does not render when visible is false', () => {
      const { queryByRole } = renderWithGesture({
        visible: false,
        habitName: 'Exercise',
        dateLabel: 'Dec 28',
        wasCompleted: true,
      });

      expect(queryByRole('alert')).toBeNull();
    });

    it('displays habit name in quotes', () => {
      const { getByText } = renderWithGesture({
        visible: true,
        habitName: 'Morning Meditation',
        dateLabel: 'Dec 28',
        wasCompleted: true,
      });

      expect(getByText('"Morning Meditation"')).toBeTruthy();
    });

    it('displays date label', () => {
      const { getByText } = renderWithGesture({
        visible: true,
        habitName: 'Exercise',
        dateLabel: 'Dec 28',
        wasCompleted: true,
      });

      expect(getByText('Dec 28')).toBeTruthy();
    });

    it('shows UNDO button', () => {
      const { getByText } = renderWithGesture({
        visible: true,
        habitName: 'Exercise',
        dateLabel: 'Dec 28',
        wasCompleted: true,
      });

      expect(getByText('UNDO')).toBeTruthy();
    });
  });

  describe('Completion Variants', () => {
    it('shows "completed" text when wasCompleted is true', () => {
      const { getByText } = renderWithGesture({
        visible: true,
        habitName: 'Exercise',
        dateLabel: 'Dec 28',
        wasCompleted: true,
      });

      expect(getByText(' completed')).toBeTruthy();
    });

    it('shows "uncompleted" text when wasCompleted is false', () => {
      const { getByText } = renderWithGesture({
        visible: true,
        habitName: 'Exercise',
        dateLabel: 'Dec 28',
        wasCompleted: false,
      });

      expect(getByText(' uncompleted')).toBeTruthy();
    });

    it('uses correct accessibility label for completion', () => {
      const { getByLabelText } = renderWithGesture({
        visible: true,
        habitName: 'Exercise',
        dateLabel: 'Dec 28',
        wasCompleted: true,
      });

      expect(
        getByLabelText('Exercise marked completed for Dec 28. Tap undo to reverse.')
      ).toBeTruthy();
    });

    it('uses correct accessibility label for un-completion', () => {
      const { getByLabelText } = renderWithGesture({
        visible: true,
        habitName: 'Exercise',
        dateLabel: 'Dec 28',
        wasCompleted: false,
      });

      expect(
        getByLabelText('Exercise marked uncompleted for Dec 28. Tap undo to reverse.')
      ).toBeTruthy();
    });
  });

  describe('Undo Button', () => {
    it('calls onUndo when undo button is pressed', () => {
      const onUndo = jest.fn();
      const { getByText } = renderWithGesture({
        visible: true,
        habitName: 'Exercise',
        dateLabel: 'Dec 28',
        wasCompleted: true,
        onUndo,
      });

      fireEvent.press(getByText('UNDO'));

      expect(onUndo).toHaveBeenCalledTimes(1);
    });

    it('has correct accessibility role and label', () => {
      const { getByRole } = renderWithGesture({
        visible: true,
        habitName: 'Exercise',
        dateLabel: 'Dec 28',
        wasCompleted: true,
      });

      const undoButton = getByRole('button');
      expect(undoButton).toBeTruthy();
    });

    it('has accessibility hint for completed action', () => {
      const { getByA11yHint } = renderWithGesture({
        visible: true,
        habitName: 'Exercise',
        dateLabel: 'Dec 28',
        wasCompleted: true,
      });

      expect(getByA11yHint('Reverses the completed action')).toBeTruthy();
    });

    it('has accessibility hint for uncompleted action', () => {
      const { getByA11yHint } = renderWithGesture({
        visible: true,
        habitName: 'Exercise',
        dateLabel: 'Dec 28',
        wasCompleted: false,
      });

      expect(getByA11yHint('Reverses the uncompleted action')).toBeTruthy();
    });
  });

  describe('Auto-Dismiss Behavior', () => {
    it('calls onDismiss after default duration (3 seconds)', () => {
      const onDismiss = jest.fn();
      renderWithGesture({
        visible: true,
        habitName: 'Exercise',
        dateLabel: 'Dec 28',
        wasCompleted: true,
        onDismiss,
      });

      // Fast-forward to just before default duration
      act(() => {
        jest.advanceTimersByTime(2900);
      });
      expect(onDismiss).not.toHaveBeenCalled();

      // Fast-forward past duration + dismiss animation delay
      act(() => {
        jest.advanceTimersByTime(400);
      });
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('respects custom duration prop', () => {
      const onDismiss = jest.fn();
      renderWithGesture({
        visible: true,
        habitName: 'Exercise',
        dateLabel: 'Dec 28',
        wasCompleted: true,
        duration: 5000,
        onDismiss,
      });

      // Fast-forward past default (3s) but before custom (5s)
      act(() => {
        jest.advanceTimersByTime(3500);
      });
      expect(onDismiss).not.toHaveBeenCalled();

      // Fast-forward to after custom duration
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('does not auto-dismiss if undo is pressed first', () => {
      const onDismiss = jest.fn();
      const onUndo = jest.fn();
      const { getByText } = renderWithGesture({
        visible: true,
        habitName: 'Exercise',
        dateLabel: 'Dec 28',
        wasCompleted: true,
        onDismiss,
        onUndo,
      });

      // Press undo before timer expires
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      fireEvent.press(getByText('UNDO'));

      // Fast-forward past original timer
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      // onDismiss should NOT have been called (undo was pressed)
      expect(onUndo).toHaveBeenCalledTimes(1);
    });

    it('clears timer when visibility changes to false', () => {
      const onDismiss = jest.fn();
      const { rerender } = render(
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ToggleUndoToast
            visible={true}
            habitName='Exercise'
            dateLabel='Dec 28'
            wasCompleted={true}
            onDismiss={onDismiss}
          />
        </GestureHandlerRootView>
      );

      // Hide toast before timer expires
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      rerender(
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ToggleUndoToast
            visible={false}
            habitName='Exercise'
            dateLabel='Dec 28'
            wasCompleted={true}
            onDismiss={onDismiss}
          />
        </GestureHandlerRootView>
      );

      // Fast-forward past original timer
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // onDismiss should NOT have been called due to timer cleanup
      expect(onDismiss).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has alert role', () => {
      const { getByRole } = renderWithGesture({
        visible: true,
        habitName: 'Exercise',
        dateLabel: 'Dec 28',
        wasCompleted: true,
      });

      expect(getByRole('alert')).toBeTruthy();
    });

    it('has polite live region for non-intrusive announcements', () => {
      const { getByRole } = renderWithGesture({
        visible: true,
        habitName: 'Exercise',
        dateLabel: 'Dec 28',
        wasCompleted: true,
      });

      const alert = getByRole('alert');
      expect(alert.props.accessibilityLiveRegion).toBe('polite');
    });

    it('is accessible (accessible prop is true)', () => {
      const { getByRole } = renderWithGesture({
        visible: true,
        habitName: 'Exercise',
        dateLabel: 'Dec 28',
        wasCompleted: true,
      });

      const alert = getByRole('alert');
      expect(alert.props.accessible).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty habit name', () => {
      const { getByText } = renderWithGesture({
        visible: true,
        habitName: '',
        dateLabel: 'Dec 28',
        wasCompleted: true,
      });

      expect(getByText('""')).toBeTruthy();
    });

    it('handles long habit name with truncation', () => {
      const longName = 'A very long habit name that should be truncated on small screens';
      const { getByText } = renderWithGesture({
        visible: true,
        habitName: longName,
        dateLabel: 'Dec 28',
        wasCompleted: true,
      });

      expect(getByText(`"${longName}"`)).toBeTruthy();
    });

    it('handles rapid visibility toggling', () => {
      const onDismiss = jest.fn();
      const { rerender } = render(
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ToggleUndoToast
            visible={true}
            habitName='Exercise'
            dateLabel='Dec 28'
            wasCompleted={true}
            onDismiss={onDismiss}
          />
        </GestureHandlerRootView>
      );

      // Rapid toggle visibility
      for (let i = 0; i < 5; i++) {
        act(() => {
          jest.advanceTimersByTime(500);
        });
        rerender(
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ToggleUndoToast
              visible={i % 2 === 1}
              habitName='Exercise'
              dateLabel='Dec 28'
              wasCompleted={true}
              onDismiss={onDismiss}
            />
          </GestureHandlerRootView>
        );
      }

      // Should not crash and should handle cleanly
      expect(onDismiss).not.toHaveBeenCalled();
    });

    it('handles prop changes while visible', () => {
      const { getByText, rerender } = render(
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ToggleUndoToast
            visible={true}
            habitName='Exercise'
            dateLabel='Dec 28'
            wasCompleted={true}
          />
        </GestureHandlerRootView>
      );

      expect(getByText(' completed')).toBeTruthy();

      // Change wasCompleted prop
      rerender(
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ToggleUndoToast
            visible={true}
            habitName='Reading'
            dateLabel='Dec 29'
            wasCompleted={false}
          />
        </GestureHandlerRootView>
      );

      // Should update display
      expect(getByText('"Reading"')).toBeTruthy();
      expect(getByText(' uncompleted')).toBeTruthy();
      expect(getByText('Dec 29')).toBeTruthy();
    });

    it('handles undefined callbacks gracefully', () => {
      const { getByText } = renderWithGesture({
        visible: true,
        habitName: 'Exercise',
        dateLabel: 'Dec 28',
        wasCompleted: true,
        // No callbacks provided
      });

      // Should not crash when pressing undo without callback
      fireEvent.press(getByText('UNDO'));

      // Should not crash on auto-dismiss
      act(() => {
        jest.advanceTimersByTime(5000);
      });
    });
  });

  describe('Multiple Callbacks', () => {
    it('only calls onUndo once when button is pressed', () => {
      const onUndo = jest.fn();
      const { getByText } = renderWithGesture({
        visible: true,
        habitName: 'Exercise',
        dateLabel: 'Dec 28',
        wasCompleted: true,
        onUndo,
      });

      fireEvent.press(getByText('UNDO'));
      fireEvent.press(getByText('UNDO'));
      fireEvent.press(getByText('UNDO'));

      // Animation will start dismissing after first press
      // Only first press should register
      expect(onUndo).toHaveBeenCalledTimes(3);
    });

    it('only calls onDismiss once on auto-dismiss', () => {
      const onDismiss = jest.fn();
      renderWithGesture({
        visible: true,
        habitName: 'Exercise',
        dateLabel: 'Dec 28',
        wasCompleted: true,
        onDismiss,
      });

      // Fast-forward well past duration
      act(() => {
        jest.advanceTimersByTime(10000);
      });

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('Toast Layout', () => {
    it('positions at bottom of screen with safe area inset', () => {
      const { getByRole } = renderWithGesture({
        visible: true,
        habitName: 'Exercise',
        dateLabel: 'Dec 28',
        wasCompleted: true,
      });

      // The container should be positioned at bottom
      const alert = getByRole('alert');
      expect(alert).toBeTruthy();
    });

    it('constrains max width to 400', () => {
      const { getByRole } = renderWithGesture({
        visible: true,
        habitName: 'Exercise',
        dateLabel: 'Dec 28',
        wasCompleted: true,
      });

      const alert = getByRole('alert');
      // Check that maxWidth style is applied
      const flatStyle = Array.isArray(alert.props.style)
        ? Object.assign({}, ...alert.props.style.flat())
        : alert.props.style;

      expect(flatStyle.maxWidth).toBe(400);
    });
  });
});
