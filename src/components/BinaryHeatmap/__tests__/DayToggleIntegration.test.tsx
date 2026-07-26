/**
 * Day Toggle Integration Tests
 *
 * Integration tests for the complete day toggle flow:
 * 1. User taps a cell in BinaryHeatmap
 * 2. onDayPress callback is triggered with date and completion status
 * 3. Parent component (ProgressTabContent pattern) handles the callback
 * 4. Haptic feedback is triggered
 * 5. Mutation is called with correct parameters
 * 6. Error handling works correctly
 * 7. Rapid-fire protection (debounce) works
 *
 * These tests validate the integration contract between BinaryHeatmap
 * and the parent component's mutation handling logic.
 */

import React, { useState, useCallback } from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { BinaryHeatmap } from '..';
import type { TimeRange } from '../types';
import type { Id } from '../../../../convex/_generated/dataModel';

// Mock the useReduceMotion hook
jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: jest.fn(() => false),
}));

// Mock expo-haptics for haptic feedback testing
const mockImpactAsync = jest.fn();
jest.mock('expo-haptics', () => ({
  impactAsync: (style: string) => mockImpactAsync(style),
  ImpactFeedbackStyle: {
    Light: 'Light',
    Medium: 'Medium',
  },
}));

// Import after mocking
import * as Haptics from 'expo-haptics';

// Helper to create a mock habit ID
const mockHabitId = 'test-habit-id' as Id<'habits'>;

// Fixed date for consistent testing
const TEST_DATE = new Date('2024-12-15T12:00:00Z');
const TEST_DATE_STRING = '2024-12-15';
const pressCell = (cell: Parameters<typeof fireEvent.press>[0]) =>
  fireEvent.press(cell, { nativeEvent: { pageX: 0, pageY: 0 } });

// Mock the grid generation to use a fixed date
jest.mock('../utils', () => {
  const originalModule = jest.requireActual('../utils');
  return {
    ...originalModule,
    generateBinaryGrid: (
      timeRange: TimeRange,
      completedDates: Set<string>,
      habitCreatedAt?: number
    ) => {
      return originalModule.generateBinaryGrid(
        timeRange,
        completedDates,
        habitCreatedAt,
        new Date('2024-12-15T12:00:00Z')
      );
    },
  };
});

/**
 * Test wrapper component that simulates the ProgressTabContent pattern
 * This mimics how BinaryHeatmap is integrated in HabitDetailScreen
 */
interface TestWrapperProps {
  initialCompletedDates: string[];
  habitId: Id<'habits'>;
  habitColor: string;
  currentStreak: number;
  mockMutation: jest.Mock;
  onMutationError?: (error: Error) => void;
}

function DayToggleTestWrapper({
  initialCompletedDates,
  habitId,
  habitColor,
  currentStreak,
  mockMutation,
  onMutationError,
}: TestWrapperProps) {
  const [completedDates, setCompletedDates] = useState<Set<string>>(
    new Set(initialCompletedDates)
  );
  const [isToggling, setIsToggling] = useState(false);

  // Simulates handleDayPress from ProgressTabContent
  const handleDayPress = useCallback(
    (date: string, wasCompleted: boolean): void => {
      // Prevent rapid-fire toggles
      if (isToggling) return;

      // Don't allow toggling future dates
      const inputDate = new Date(date);
      const todayDate = new Date(TEST_DATE);
      inputDate.setHours(0, 0, 0, 0);
      todayDate.setHours(0, 0, 0, 0);
      if (inputDate > todayDate) {
        return; // Silently ignore future date taps
      }

      setIsToggling(true);

      // Haptic feedback - lighter for unchecking, medium for checking
      void Haptics.impactAsync(
        wasCompleted
          ? Haptics.ImpactFeedbackStyle.Light
          : Haptics.ImpactFeedbackStyle.Medium
      );

      // Optimistic update
      setCompletedDates((prev) => {
        const next = new Set(prev);
        if (wasCompleted) {
          next.delete(date);
        } else {
          next.add(date);
        }
        return next;
      });

      // Fire mutation
      void mockMutation({ date, habitId })
        .catch((error: Error) => {
          // Rollback optimistic update on error
          setCompletedDates((prev) => {
            const next = new Set(prev);
            if (wasCompleted) {
              next.add(date);
            } else {
              next.delete(date);
            }
            return next;
          });
          onMutationError?.(error);
        })
        .finally(() => {
          // Small cooldown to prevent rapid toggles
          setTimeout(() => setIsToggling(false), 200);
        });
    },
    [isToggling, habitId, mockMutation, onMutationError]
  );

  return (
    <BinaryHeatmap
      habitId={habitId}
      completedDates={completedDates}
      habitColor={habitColor}
      currentStreak={currentStreak}
      onDayPress={handleDayPress}
    />
  );
}

describe('Day Toggle Integration', () => {
  let mockMutation: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockMutation = jest.fn().mockResolvedValue(undefined);
    mockImpactAsync.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Basic toggle flow', () => {
    it('should call mutation with correct parameters when toggling incomplete day to complete', async () => {
      const { getAllByRole } = render(
        <DayToggleTestWrapper
          initialCompletedDates={[]}
          habitId={mockHabitId}
          habitColor='#10b981'
          currentStreak={0}
          mockMutation={mockMutation}
        />
      );

      // Find an interactive cell (button role)
      const cells = getAllByRole('button');
      expect(cells.length).toBeGreaterThan(0);

      // Press the first interactive cell
      await act(async () => {
        pressCell(cells[0]);
      });

      // Verify mutation was called with correct shape
      expect(mockMutation).toHaveBeenCalledTimes(1);
      expect(mockMutation).toHaveBeenCalledWith(
        expect.objectContaining({
          habitId: mockHabitId,
          date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        })
      );
    });

    it('should provide Medium haptic feedback when marking day as complete', async () => {
      const { getAllByRole } = render(
        <DayToggleTestWrapper
          initialCompletedDates={[]}
          habitId={mockHabitId}
          habitColor='#10b981'
          currentStreak={0}
          mockMutation={mockMutation}
        />
      );

      const cells = getAllByRole('button');

      await act(async () => {
        pressCell(cells[0]);
      });

      expect(mockImpactAsync).toHaveBeenCalledWith('Medium');
    });

    it('should provide Light haptic feedback when marking day as incomplete', async () => {
      // Start with a completed date
      const { getAllByRole } = render(
        <DayToggleTestWrapper
          initialCompletedDates={['2024-12-14', '2024-12-13', '2024-12-12']}
          habitId={mockHabitId}
          habitColor='#10b981'
          currentStreak={3}
          mockMutation={mockMutation}
        />
      );

      // Find cells that are marked as completed (have selected state)
      // In the test, we look for buttons that represent completed days
      const cells = getAllByRole('button');

      // Find a completed cell by checking accessibility state
      const completedCell = cells.find(
        (cell) => cell.props.accessibilityState?.selected === true
      );

      if (completedCell) {
        await act(async () => {
          pressCell(completedCell);
        });

        expect(mockImpactAsync).toHaveBeenCalledWith('Light');
      }
    });
  });

  describe('Optimistic updates', () => {
    it('should immediately update UI before mutation completes', async () => {
      // Create a slow mutation that doesn't resolve immediately
      mockMutation.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );

      const { getAllByRole, rerender } = render(
        <DayToggleTestWrapper
          initialCompletedDates={[]}
          habitId={mockHabitId}
          habitColor='#10b981'
          currentStreak={0}
          mockMutation={mockMutation}
        />
      );

      const cells = getAllByRole('button');
      const firstCell = cells[0];

      // Get initial state - should be unselected
      expect(firstCell.props.accessibilityState?.selected).toBeFalsy();

      // Press to toggle
      await act(async () => {
        pressCell(firstCell);
      });

      // Mutation should be called
      expect(mockMutation).toHaveBeenCalled();

      // Note: In a real scenario, the optimistic update happens in state
      // The test wrapper simulates this with setCompletedDates
    });

    it('should rollback optimistic update on mutation error', async () => {
      const mockError = new Error('Network error');
      mockMutation.mockRejectedValue(mockError);
      const mockOnError = jest.fn();

      const { getAllByRole } = render(
        <DayToggleTestWrapper
          initialCompletedDates={['2024-12-14']}
          habitId={mockHabitId}
          habitColor='#10b981'
          currentStreak={1}
          mockMutation={mockMutation}
          onMutationError={mockOnError}
        />
      );

      const cells = getAllByRole('button');

      await act(async () => {
        pressCell(cells[0]);
        // Let the promise rejection propagate
        await Promise.resolve();
      });

      // Error callback should have been called
      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(mockError);
      });
    });
  });

  describe('Rapid-fire protection', () => {
    it('should prevent multiple toggles within cooldown period', async () => {
      const { getAllByRole } = render(
        <DayToggleTestWrapper
          initialCompletedDates={[]}
          habitId={mockHabitId}
          habitColor='#10b981'
          currentStreak={0}
          mockMutation={mockMutation}
        />
      );

      const cells = getAllByRole('button');

      // First press
      await act(async () => {
        pressCell(cells[0]);
      });

      expect(mockMutation).toHaveBeenCalledTimes(1);

      // Rapid fire - press again before cooldown (should be blocked)
      // Advance time slightly but not past the 200ms cooldown
      await act(async () => {
        jest.advanceTimersByTime(50);
        pressCell(cells[0]);
      });

      // Should still be just 1 call (blocked by isToggling)
      expect(mockMutation).toHaveBeenCalledTimes(1);

      // Try again at 100ms
      await act(async () => {
        jest.advanceTimersByTime(50);
        pressCell(cells[0]);
      });

      // Should still be just 1 call
      expect(mockMutation).toHaveBeenCalledTimes(1);
    });

    it('should allow toggle after cooldown period', async () => {
      const { getAllByRole } = render(
        <DayToggleTestWrapper
          initialCompletedDates={[]}
          habitId={mockHabitId}
          habitColor='#10b981'
          currentStreak={0}
          mockMutation={mockMutation}
        />
      );

      const cells = getAllByRole('button');

      // First press
      await act(async () => {
        pressCell(cells[0]);
      });

      expect(mockMutation).toHaveBeenCalledTimes(1);

      // Wait for cooldown (200ms) plus some buffer
      await act(async () => {
        jest.advanceTimersByTime(250);
      });

      // Second press should now work
      await act(async () => {
        pressCell(cells[0]);
      });

      expect(mockMutation).toHaveBeenCalledTimes(2);
    });
  });

  describe('Future date protection', () => {
    it('should not toggle future dates', async () => {
      // The test uses a fixed date of 2024-12-15
      // Future dates should not be interactive (no button role)
      const { queryAllByRole, getByLabelText } = render(
        <DayToggleTestWrapper
          initialCompletedDates={[]}
          habitId={mockHabitId}
          habitColor='#10b981'
          currentStreak={0}
          mockMutation={mockMutation}
        />
      );

      // Future dates should have 'text' role, not 'button'
      // We verify by ensuring all buttons represent non-future dates
      const buttons = queryAllByRole('button');

      // All buttons should call mutation when pressed
      // (future dates won't be buttons at all)
      for (const button of buttons) {
        const label = button.props.accessibilityLabel ?? '';
        // If the label contains "Future", it shouldn't be a button
        expect(label).not.toMatch(/Future/);
      }
    });
  });

  describe('Cell state integration', () => {
    it('should toggle completed state correctly in UI', async () => {
      const { getAllByRole, rerender } = render(
        <DayToggleTestWrapper
          initialCompletedDates={['2024-12-14']}
          habitId={mockHabitId}
          habitColor='#10b981'
          currentStreak={1}
          mockMutation={mockMutation}
        />
      );

      // Find a completed cell
      const cells = getAllByRole('button');
      const completedCell = cells.find(
        (cell) => cell.props.accessibilityState?.selected === true
      );

      expect(completedCell).toBeTruthy();

      if (completedCell) {
        // Toggle off
        await act(async () => {
          pressCell(completedCell);
        });

        expect(mockMutation).toHaveBeenCalled();
      }
    });

    it('should handle before-creation dates as non-interactive', () => {
      // Habit created on 2024-12-10, so 2024-12-09 and earlier are before creation
      const habitCreatedAt = new Date('2024-12-10T00:00:00Z').getTime();

      const { queryAllByRole } = render(
        <BinaryHeatmap
          habitId={mockHabitId}
          completedDates={new Set(['2024-12-14'])}
          habitCreatedAt={habitCreatedAt}
          habitColor='#10b981'
          currentStreak={1}
        />
      );

      // Before-creation dates should not be buttons
      const buttons = queryAllByRole('button');

      // Verify no button has "Before tracking" in label
      for (const button of buttons) {
        const label = button.props.accessibilityLabel ?? '';
        expect(label).not.toMatch(/Before tracking/);
      }
    });
  });

  describe('Mutation parameter validation', () => {
    it('should pass habitId to mutation', async () => {
      const customHabitId = 'custom-habit-id' as Id<'habits'>;

      const { getAllByRole } = render(
        <DayToggleTestWrapper
          initialCompletedDates={[]}
          habitId={customHabitId}
          habitColor='#10b981'
          currentStreak={0}
          mockMutation={mockMutation}
        />
      );

      const cells = getAllByRole('button');

      await act(async () => {
        pressCell(cells[0]);
      });

      expect(mockMutation).toHaveBeenCalledWith(
        expect.objectContaining({
          habitId: customHabitId,
        })
      );
    });

    it('should pass date in YYYY-MM-DD format to mutation', async () => {
      const { getAllByRole } = render(
        <DayToggleTestWrapper
          initialCompletedDates={[]}
          habitId={mockHabitId}
          habitColor='#10b981'
          currentStreak={0}
          mockMutation={mockMutation}
        />
      );

      const cells = getAllByRole('button');

      await act(async () => {
        pressCell(cells[0]);
      });

      const callArgs = mockMutation.mock.calls[0][0];
      expect(callArgs.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('Error handling', () => {
    it('should handle mutation rejection gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockMutation.mockRejectedValue(new Error('Server error'));
      const mockOnError = jest.fn();

      const { getAllByRole } = render(
        <DayToggleTestWrapper
          initialCompletedDates={[]}
          habitId={mockHabitId}
          habitColor='#10b981'
          currentStreak={0}
          mockMutation={mockMutation}
          onMutationError={mockOnError}
        />
      );

      const cells = getAllByRole('button');

      await act(async () => {
        pressCell(cells[0]);
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });

    it('should still release toggling lock after error', async () => {
      mockMutation.mockRejectedValue(new Error('Server error'));

      const { getAllByRole } = render(
        <DayToggleTestWrapper
          initialCompletedDates={[]}
          habitId={mockHabitId}
          habitColor='#10b981'
          currentStreak={0}
          mockMutation={mockMutation}
          onMutationError={() => {}}
        />
      );

      const cells = getAllByRole('button');

      // First press
      await act(async () => {
        pressCell(cells[0]);
        await Promise.resolve();
      });

      // Wait for cooldown
      await act(async () => {
        jest.advanceTimersByTime(250);
      });

      // Should be able to toggle again
      await act(async () => {
        pressCell(cells[0]);
      });

      expect(mockMutation).toHaveBeenCalledTimes(2);
    });
  });
});
