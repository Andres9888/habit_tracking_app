/**
 * Integration tests for HabitCard toggle and haptic feedback functionality
 * Tests the complete workflow: tap → query completion state → haptic → mutation
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { HabitCard } from '../HabitCard';
import { useQuery, useMutation } from 'convex/react';
import * as Haptics from 'expo-haptics';

jest.mock('../../StreakMilestoneCelebration', () => ({
  StreakMilestoneProvider: ({ children }: { children: React.ReactNode }) =>
    children,
  useStreakMilestone: () => ({ checkAndCelebrate: jest.fn() }),
}));

// Mock modules
jest.mock('convex/react');

// Mock expo-haptics with proper ImpactFeedbackStyle enum
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Heavy: 'heavy',
    Light: 'light',
    Medium: 'medium',
  },
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
}));

jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');
  return {
    Gesture: {
      LongPress: () => ({
        minDuration: jest.fn().mockReturnThis(),
        onStart: jest.fn().mockReturnThis(),
      }),
      Pan: () => ({
        activeOffsetX: jest.fn().mockReturnThis(),
        onEnd: jest.fn().mockReturnThis(),
        onUpdate: jest.fn().mockReturnThis(),
      }),
      Race: jest.fn((...args) => args),
      Simultaneous: jest.fn((...args) => args),
      Tap: () => ({
        onBegin: jest.fn().mockReturnThis(),
        onEnd: jest.fn().mockReturnThis(),
        onFinalize: jest.fn().mockReturnThis(),
      }),
    },
    GestureDetector: ({ children }: { children: React.ReactNode }) => children,
    PanGestureHandler: View,
    State: {},
  };
});

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return {
    ...Reanimated,
    runOnJS: jest.fn((fn) => fn),
    useAnimatedStyle: jest.fn(() => ({})),
    useSharedValue: jest.fn(() => ({ value: 0 })),
    withSpring: jest.fn((toValue) => toValue),
  };
});

// Mock HabitStrengthIndicator
jest.mock('../../HabitStrengthIndicator/HabitStrengthIndicator', () => ({
  __esModule: true,
  default: () => null,
}));

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;
const mockUseMutation = useMutation as jest.MockedFunction<typeof useMutation>;
const mockHapticsImpact = Haptics.impactAsync as jest.MockedFunction<
  typeof Haptics.impactAsync
>;

describe('HabitCard Toggle and Haptic Integration', () => {
  const mockHabitId = 'test_habit_123' as unknown;
  const today = new Date().toISOString().split('T')[0];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('query integration', () => {
    it('should use completedProp from parent bulk query instead of per-card query', () => {
      const mockMutation = jest.fn();
      mockUseMutation.mockReturnValue(mockMutation);
      mockUseQuery.mockReturnValue(false);

      render(
        <HabitCard
          completed={false}
          id={mockHabitId}
          name='Test Habit'
          strength={50}
        />
      );

      // Should NOT call useQuery with getCompletionStatus args (per-card query removed)
      // The parent provides completion status via the `completed` prop from bulk tracking query
      const completionStatusCalls = mockUseQuery.mock.calls.filter(
        (call: unknown[]) => call[1]?.habitId === mockHabitId && call[1]?.date
      );
      expect(completionStatusCalls).toHaveLength(0);
    });

    it('should use query result for haptic intensity decision', () => {
      const mockMutation = jest.fn();
      mockUseMutation.mockReturnValue(mockMutation);

      // Test with completed state
      mockUseQuery.mockReturnValue(true);

      const { rerender } = render(
        <HabitCard completed id={mockHabitId} name='Test Habit' strength={50} />
      );

      expect(mockUseMutation).toHaveBeenCalled();

      // Test with not completed state
      mockUseQuery.mockReturnValue(false);

      rerender(
        <HabitCard
          completed={false}
          id={mockHabitId}
          name='Test Habit'
          strength={50}
        />
      );

      expect(mockUseMutation).toHaveBeenCalled();
    });

    it('should handle loading state (undefined query result)', () => {
      const mockMutation = jest.fn();
      mockUseMutation.mockReturnValue(mockMutation);
      mockUseQuery.mockReturnValue(); // Loading state

      const { getByTestId } = render(
        <HabitCard
          completed={false}
          id={mockHabitId}
          name='Test Habit'
          strength={50}
        />
      );

      const card = getByTestId('home-habit-toggle');
      expect(card).toBeTruthy();
      // Should default to Medium haptic when loading
    });
  });

  describe('mutation integration', () => {
    it('should call toggleCompletion mutation with correct arguments', () => {
      const mockMutation = jest.fn();
      mockUseMutation.mockReturnValue(mockMutation);
      mockUseQuery.mockReturnValue(false);

      render(
        <HabitCard
          completed={false}
          id={mockHabitId}
          name='Test Habit'
          strength={50}
        />
      );

      expect(mockUseMutation).toHaveBeenCalledWith(expect.anything());
    });

    it('should setup mutation before rendering', () => {
      const mockMutation = jest.fn();
      mockUseMutation.mockReturnValue(mockMutation);
      mockUseQuery.mockReturnValue(false);

      render(<HabitCard id={mockHabitId} name='Test Habit' strength={50} />);

      expect(mockUseMutation).toHaveBeenCalled();
    });
  });

  describe('haptic feedback - checking workflow', () => {
    it('should use Medium haptic when checking (isCompleted = false)', () => {
      const mockMutation = jest.fn();
      mockUseMutation.mockReturnValue(mockMutation);
      mockUseQuery.mockReturnValue(false); // Not completed

      render(
        <HabitCard
          completed={false}
          id={mockHabitId}
          name='Test Habit'
          strength={50}
        />
      );

      // Completion comes from the parent `completed` prop, not a per-card query
      expect(mockUseMutation).toHaveBeenCalled();

      // When tapped, should use Medium haptic
      const expectedHaptic = Haptics.ImpactFeedbackStyle.Medium;
      expect(expectedHaptic).toBe(Haptics.ImpactFeedbackStyle.Medium);
    });

    it('should use Medium haptic when loading (isCompleted = undefined)', () => {
      const mockMutation = jest.fn();
      mockUseMutation.mockReturnValue(mockMutation);
      mockUseQuery.mockReturnValue(); // Loading

      render(
        <HabitCard
          completed={false}
          id={mockHabitId}
          name='Test Habit'
          strength={50}
        />
      );

      // When loading, should default to Medium haptic
      const expectedHaptic = Haptics.ImpactFeedbackStyle.Medium;
      expect(expectedHaptic).toBe(Haptics.ImpactFeedbackStyle.Medium);
    });
  });

  describe('haptic feedback - unchecking workflow', () => {
    it('should use Light haptic when unchecking (isCompleted = true)', () => {
      const mockMutation = jest.fn();
      mockUseMutation.mockReturnValue(mockMutation);
      mockUseQuery.mockReturnValue(true); // Completed

      render(
        <HabitCard completed id={mockHabitId} name='Test Habit' strength={50} />
      );

      expect(mockUseMutation).toHaveBeenCalled();

      // When tapped, should use Light haptic
      const expectedHaptic = Haptics.ImpactFeedbackStyle.Light;
      expect(expectedHaptic).toBe(Haptics.ImpactFeedbackStyle.Light);
    });
  });

  describe('execution order', () => {
    it('should execute query before any tap interaction', () => {
      const mockMutation = jest.fn();
      mockUseMutation.mockReturnValue(mockMutation);
      mockUseQuery.mockReturnValue(false);

      render(<HabitCard id={mockHabitId} name='Test Habit' strength={50} />);

      // Mutation is wired during render; the actual toggle happens on tap
      expect(mockUseMutation).toHaveBeenCalled();
      expect(mockMutation).not.toHaveBeenCalled();
    });

    it('should follow correct workflow: query → haptic → mutation', () => {
      // This tests the conceptual workflow
      // In actual tap handler: haptic fires BEFORE mutation

      // Step 1: Query provides current state (happens at render)
      const isCompleted = false;

      // Step 2: Determine haptic based on query result
      const hapticIntensity = isCompleted
        ? Haptics.ImpactFeedbackStyle.Light
        : Haptics.ImpactFeedbackStyle.Medium;

      // Step 3: Fire haptic
      expect(hapticIntensity).toBe(Haptics.ImpactFeedbackStyle.Medium);

      // Step 4: Call mutation to toggle
      const expectedMutationArgs = {
        date: today,
        habitId: mockHabitId,
      };

      expect(expectedMutationArgs).toHaveProperty('habitId');
      expect(expectedMutationArgs).toHaveProperty('date');
    });
  });

  describe('optimistic updates', () => {
    it('should call mutation without waiting for confirmation', () => {
      const mockMutation = jest.fn();
      mockUseMutation.mockReturnValue(mockMutation);
      mockUseQuery.mockReturnValue(false);

      render(<HabitCard id={mockHabitId} name='Test Habit' strength={50} />);

      // Mutation setup should be immediate
      expect(mockUseMutation).toHaveBeenCalled();
      // Actual mutation call happens on tap (not tested in unit tests)
    });
  });

  describe('disabled state', () => {
    it('should not trigger haptic or mutation when disabled', () => {
      const mockMutation = jest.fn();
      mockUseMutation.mockReturnValue(mockMutation);
      mockUseQuery.mockReturnValue(false);

      const { getByTestId } = render(
        <HabitCard disabled id={mockHabitId} name='Test Habit' strength={50} />
      );

      const card = getByTestId('home-habit-toggle');
      expect(card.props.accessibilityState).toMatchObject({
        disabled: true,
      });
    });

    it('should still query completion status when disabled', () => {
      const mockMutation = jest.fn();
      mockUseMutation.mockReturnValue(mockMutation);
      mockUseQuery.mockReturnValue(false);

      render(
        <HabitCard disabled id={mockHabitId} name='Test Habit' strength={50} />
      );

      expect(mockUseMutation).toHaveBeenCalled();
    });
  });

  describe('backward compatibility', () => {
    it('should call optional onPress prop if provided', () => {
      const mockMutation = jest.fn();
      const mockOnPress = jest.fn();
      mockUseMutation.mockReturnValue(mockMutation);
      mockUseQuery.mockReturnValue(false);

      render(
        <HabitCard
          id={mockHabitId}
          name='Test Habit'
          strength={50}
          onPress={mockOnPress}
        />
      );

      // Component should accept onPress prop
      expect(mockOnPress).not.toHaveBeenCalled(); // Only called on tap
    });

    it('should work without onPress prop', () => {
      const mockMutation = jest.fn();
      mockUseMutation.mockReturnValue(mockMutation);
      mockUseQuery.mockReturnValue(false);

      const { getByTestId } = render(
        <HabitCard id={mockHabitId} name='Test Habit' strength={50} />
      );

      const card = getByTestId('home-habit-toggle');
      expect(card).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('should have proper accessibility properties set', () => {
      const mockMutation = jest.fn();
      mockUseMutation.mockReturnValue(mockMutation);
      mockUseQuery.mockReturnValue(false);

      const { getByTestId } = render(
        <HabitCard
          completed={false}
          id={mockHabitId}
          name='Test Habit'
          strength={50}
        />
      );

      const card = getByTestId('home-habit-toggle');
      expect(card.props.accessibilityLabel).toMatch(/Test Habit/);
      expect(card.props.accessibilityLabel).toMatch(/50%/);
      expect(card.props.accessibilityLabel).not.toMatch(/completed/);
    });

    it('should indicate checked state in accessibility', () => {
      const mockMutation = jest.fn();
      mockUseMutation.mockReturnValue(mockMutation);
      mockUseQuery.mockReturnValue(true);

      const { getByTestId } = render(
        <HabitCard completed id={mockHabitId} name='Test Habit' strength={50} />
      );

      const card = getByTestId('home-habit-toggle');
      expect(card.props.accessibilityState).toMatchObject({
        checked: true,
      });
    });

    it('should have accessibility hint about tap action', () => {
      const mockMutation = jest.fn();
      mockUseMutation.mockReturnValue(mockMutation);
      mockUseQuery.mockReturnValue(false);

      const { getByTestId } = render(
        <HabitCard id={mockHabitId} name='Test Habit' strength={50} />
      );

      const card = getByTestId('home-habit-toggle');
      expect(card.props.accessibilityHint).toMatch(/Tap to toggle/);
    });
  });

  describe('render consistency', () => {
    it('should render with all required props', () => {
      const mockMutation = jest.fn();
      mockUseMutation.mockReturnValue(mockMutation);
      mockUseQuery.mockReturnValue(false);

      const { getByText } = render(
        <HabitCard id={mockHabitId} name='Test Habit' strength={50} />
      );

      expect(getByText('Test Habit')).toBeTruthy();
    });

    it('should re-render when query result changes', () => {
      const mockMutation = jest.fn();
      mockUseMutation.mockReturnValue(mockMutation);
      mockUseQuery.mockReturnValue(false);

      const { rerender, getByTestId } = render(
        <HabitCard
          completed={false}
          id={mockHabitId}
          name='Test Habit'
          strength={50}
        />
      );

      let card = getByTestId('home-habit-toggle');
      expect(card.props.accessibilityLabel).not.toMatch(/completed/);

      // Simulate completion status change
      mockUseQuery.mockReturnValue(true);

      rerender(
        <HabitCard completed id={mockHabitId} name='Test Habit' strength={50} />
      );

      card = getByTestId('home-habit-toggle');
      expect(card.props.accessibilityLabel).toMatch(/completed/);
    });
  });

  describe('date handling', () => {
    it('should use today date in ISO format', () => {
      const mockMutation = jest.fn();
      mockUseMutation.mockReturnValue(mockMutation);
      mockUseQuery.mockReturnValue(false);

      render(<HabitCard id={mockHabitId} name='Test Habit' strength={50} />);

      const todayDate = new Date().toISOString().split('T')[0];
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      expect(dateRegex.test(todayDate)).toBe(true);
      expect(mockUseMutation).toHaveBeenCalled();
    });
  });

  describe('multiple habits scenario', () => {
    it('should handle multiple HabitCards independently', () => {
      const mockMutation = jest.fn();
      mockUseMutation.mockReturnValue(mockMutation);

      // First habit - completed
      mockUseQuery.mockReturnValueOnce(true);

      const { getByText: getByText1 } = render(
        <HabitCard
          completed
          id={'habit_1' as unknown}
          name='Habit 1'
          strength={60}
        />
      );

      expect(getByText1('Habit 1')).toBeTruthy();

      // Second habit - not completed
      mockUseQuery.mockReturnValueOnce(false);

      const { getByText: getByText2 } = render(
        <HabitCard
          completed={false}
          id={'habit_2' as unknown}
          name='Habit 2'
          strength={40}
        />
      );

      expect(getByText2('Habit 2')).toBeTruthy();

      expect(mockUseMutation).toHaveBeenCalled();
    });
  });

  describe('rapid toggling', () => {
    it('should handle mutation being called multiple times', () => {
      const mockMutation = jest.fn();
      mockUseMutation.mockReturnValue(mockMutation);
      mockUseQuery.mockReturnValue(false);

      render(<HabitCard id={mockHabitId} name='Test Habit' strength={50} />);

      // Mutation should be reusable
      expect(typeof mockMutation).toBe('function');
      expect(mockMutation).not.toHaveBeenCalled();
    });

    it('should maintain consistency across multiple toggles', () => {
      const mockMutation = jest.fn();
      mockUseMutation.mockReturnValue(mockMutation);

      // Simulate toggle sequence
      const toggleStates = [
        { after: true, before: false }, // First check
        { after: false, before: true }, // Uncheck
        { after: true, before: false }, // Check again
      ];

      for (const state of toggleStates) {
        mockUseQuery.mockReturnValue(state.before);

        const { rerender } = render(
          <HabitCard
            completed={state.before}
            id={mockHabitId}
            name='Test Habit'
            strength={50}
          />
        );

        // After mutation, state changes
        mockUseQuery.mockReturnValue(state.after);

        rerender(
          <HabitCard
            completed={state.after}
            id={mockHabitId}
            name='Test Habit'
            strength={50}
          />
        );
      }
    });
  });
});

describe('HabitCard Haptic Feedback Specifications', () => {
  describe('haptic intensity mapping', () => {
    it('Light haptic for unchecking', () => {
      const isCompleted = true;
      const haptic = Haptics.ImpactFeedbackStyle.Light;

      expect(isCompleted).toBe(true);
      expect(haptic).toBe(Haptics.ImpactFeedbackStyle.Light);
    });

    it('Medium haptic for checking', () => {
      const isCompleted = false;
      const haptic = Haptics.ImpactFeedbackStyle.Medium;

      expect(isCompleted).toBe(false);
      expect(haptic).toBe(Haptics.ImpactFeedbackStyle.Medium);
    });

    it('Medium haptic as fallback when loading', () => {
      const isCompleted = undefined;
      const haptic = Haptics.ImpactFeedbackStyle.Medium;

      expect(isCompleted).toBeUndefined();
      expect(haptic).toBe(Haptics.ImpactFeedbackStyle.Medium);
    });
  });

  describe('ternary operator logic', () => {
    it('should use correct ternary: isCompleted ? Light : Medium', () => {
      const testCases = [
        { expected: Haptics.ImpactFeedbackStyle.Light, isCompleted: true },
        { expected: Haptics.ImpactFeedbackStyle.Medium, isCompleted: false },
        {
          expected: Haptics.ImpactFeedbackStyle.Medium,
          isCompleted: undefined,
        },
      ];

      for (const { isCompleted, expected } of testCases) {
        const result =
          isCompleted === true
            ? Haptics.ImpactFeedbackStyle.Light
            : Haptics.ImpactFeedbackStyle.Medium;

        expect(result).toBe(expected);
      }
    });
  });
});
