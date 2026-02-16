/**
 * ActivationModal Tests
 * Story T7.1 - Create ActivationModal component
 *
 * Tests:
 * - Modal visibility and close behavior
 * - Habit card rendering with streak/completion stats
 * - Your Why section display
 * - WOOP IF-THEN reminder display
 * - Cue/trigger reminder display
 * - Start Now button interaction
 * - Quick actions (Snooze, Just 2 Min)
 * - Accessibility labels
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ActivationModal, type ActivationHabitData } from '../ActivationModal';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  Heart: () => null,
  Play: () => null,
  Clock: () => null,
  Flame: () => null,
  Target: () => null,
  ChevronRight: () => null,
  Zap: () => null,
  X: () => null,
}));

// Mock clsx
jest.mock('clsx', () => ({
  clsx: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

// Mock react-native-reanimated
// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

// Mock the Modal component
jest.mock('../../../Modal', () => ({
  Modal: ({ children, visible, onClose }: unknown) =>
    visible ? <>{children}</> : null,
}));

// Mock the motion constants
jest.mock('../../../../constants/motion', () => ({
  Springs: {
    sheet: { damping: 32, stiffness: 180, mass: 1.3 },
    gentle: { damping: 28, stiffness: 180, mass: 1.2 },
    button: { damping: 15, stiffness: 300 },
    bouncy: { damping: 8, stiffness: 300 },
  },
}));

describe('ActivationModal', () => {
  const mockHabit: ActivationHabitData = {
    id: 'habit-1',
    name: 'Morning Exercise',
    icon: '🏃',
    currentStreak: 7,
    totalCompletions: 42,
    why: 'To be healthy and energized for my family',
    woopObstacle: 'I feel too tired',
    woopPlan: "I'll just do 5 minutes of stretching",
    cueTime: '7:00 AM',
    cueLocation: 'Living room',
    cueAfterBehavior: 'After morning coffee',
  };

  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    habit: mockHabit,
    onStartNow: jest.fn(),
    onSnooze: jest.fn(),
    onJustTwoMin: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('T7.1: Modal visibility', () => {
    it('renders when visible is true', () => {
      const { getByText } = render(<ActivationModal {...defaultProps} />);

      expect(getByText('Time to Build')).toBeTruthy();
    });

    it('does not render when visible is false', () => {
      const { queryByText } = render(
        <ActivationModal {...defaultProps} visible={false} />
      );

      expect(queryByText('Time to Build')).toBeNull();
    });

    it('does not render when habit is null', () => {
      const { queryByText } = render(
        <ActivationModal {...defaultProps} habit={null} />
      );

      expect(queryByText('Time to Build')).toBeNull();
    });
  });

  describe('T7.2: Habit card with stats', () => {
    it('displays habit name', () => {
      const { getByText } = render(<ActivationModal {...defaultProps} />);

      expect(getByText('Morning Exercise')).toBeTruthy();
    });

    it('displays habit icon', () => {
      const { getByText } = render(<ActivationModal {...defaultProps} />);

      expect(getByText('🏃')).toBeTruthy();
    });

    it('displays streak count', () => {
      const { getByText } = render(<ActivationModal {...defaultProps} />);

      expect(getByText('7 day streak')).toBeTruthy();
    });

    it('displays total completions', () => {
      const { getByText } = render(<ActivationModal {...defaultProps} />);

      expect(getByText('42 total')).toBeTruthy();
    });

    it('handles missing streak gracefully', () => {
      const habitWithoutStreak = { ...mockHabit, currentStreak: undefined };
      const { queryByText } = render(
        <ActivationModal {...defaultProps} habit={habitWithoutStreak} />
      );

      expect(queryByText(/day streak/)).toBeNull();
    });

    it('handles zero streak', () => {
      const habitWithZeroStreak = { ...mockHabit, currentStreak: 0 };
      const { queryByText } = render(
        <ActivationModal {...defaultProps} habit={habitWithZeroStreak} />
      );

      expect(queryByText(/day streak/)).toBeNull();
    });
  });

  describe('T7.3: Featured Your Why display', () => {
    it('displays Your Why section when why exists', () => {
      const { getByText } = render(<ActivationModal {...defaultProps} />);

      expect(getByText('Your Why')).toBeTruthy();
      expect(
        getByText('"To be healthy and energized for my family"')
      ).toBeTruthy();
    });

    it('does not show Your Why when why is missing', () => {
      const habitWithoutWhy = { ...mockHabit, why: undefined };
      const { queryByText } = render(
        <ActivationModal {...defaultProps} habit={habitWithoutWhy} />
      );

      expect(queryByText('Your Why')).toBeNull();
    });
  });

  describe('T7.4: WOOP IF-THEN reminder', () => {
    it('displays WOOP reminder when both obstacle and plan exist', () => {
      const { getByText } = render(<ActivationModal {...defaultProps} />);

      expect(getByText('Your Plan')).toBeTruthy();
      expect(getByText(/If/)).toBeTruthy();
      expect(getByText(/I feel too tired/)).toBeTruthy();
      expect(getByText(/then/)).toBeTruthy();
    });

    it('does not show WOOP when obstacle is missing', () => {
      const habitWithoutObstacle = { ...mockHabit, woopObstacle: undefined };
      const { queryByText } = render(
        <ActivationModal {...defaultProps} habit={habitWithoutObstacle} />
      );

      expect(queryByText('Your Plan')).toBeNull();
    });

    it('does not show WOOP when plan is missing', () => {
      const habitWithoutPlan = { ...mockHabit, woopPlan: undefined };
      const { queryByText } = render(
        <ActivationModal {...defaultProps} habit={habitWithoutPlan} />
      );

      expect(queryByText('Your Plan')).toBeNull();
    });
  });

  describe('T7.5: Cue/Trigger reminder', () => {
    it('displays cue section when time exists', () => {
      const { getByText, queryByText } = render(
        <ActivationModal {...defaultProps} />
      );

      expect(getByText('Your Cue')).toBeTruthy();
      // Text is nested in React Native, use queryByText with the exact time
      expect(queryByText(/7:00 AM/)).toBeTruthy();
    });

    it('displays cue location', () => {
      const { queryByText } = render(<ActivationModal {...defaultProps} />);

      // Text is nested in React Native
      expect(queryByText(/Living room/)).toBeTruthy();
    });

    it('displays after behavior cue', () => {
      const { queryByText } = render(<ActivationModal {...defaultProps} />);

      // Text is nested in React Native
      expect(queryByText(/After morning coffee/)).toBeTruthy();
    });

    it('does not show cue section when all cue fields are missing', () => {
      const habitWithoutCue = {
        ...mockHabit,
        cueTime: undefined,
        cueLocation: undefined,
        cueAfterBehavior: undefined,
      };
      const { queryByText } = render(
        <ActivationModal {...defaultProps} habit={habitWithoutCue} />
      );

      expect(queryByText('Your Cue')).toBeNull();
    });
  });

  describe('T7.6: Start Now button', () => {
    it('renders Start Now button', () => {
      const { getByText } = render(<ActivationModal {...defaultProps} />);

      expect(getByText('Start Now')).toBeTruthy();
    });

    it('calls onStartNow and onClose when pressed', () => {
      const onStartNow = jest.fn();
      const onClose = jest.fn();
      const { getByLabelText } = render(
        <ActivationModal
          {...defaultProps}
          onStartNow={onStartNow}
          onClose={onClose}
        />
      );

      fireEvent.press(getByLabelText('Start habit now'));

      expect(onStartNow).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('has correct accessibility label', () => {
      const { getByLabelText } = render(<ActivationModal {...defaultProps} />);

      expect(getByLabelText('Start habit now')).toBeTruthy();
    });
  });

  describe('T7.7: Quick actions', () => {
    it('renders Snooze button', () => {
      const { getByText } = render(<ActivationModal {...defaultProps} />);

      expect(getByText('Snooze')).toBeTruthy();
    });

    it('calls onSnooze and onClose when Snooze is pressed', () => {
      const onSnooze = jest.fn();
      const onClose = jest.fn();
      const { getByLabelText } = render(
        <ActivationModal
          {...defaultProps}
          onSnooze={onSnooze}
          onClose={onClose}
        />
      );

      fireEvent.press(getByLabelText('Snooze'));

      expect(onSnooze).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('renders Just 2 Min button', () => {
      const { getByText } = render(<ActivationModal {...defaultProps} />);

      expect(getByText('Just 2 Min')).toBeTruthy();
    });

    it('calls onJustTwoMin and onClose when Just 2 Min is pressed', () => {
      const onJustTwoMin = jest.fn();
      const onClose = jest.fn();
      const { getByLabelText } = render(
        <ActivationModal
          {...defaultProps}
          onJustTwoMin={onJustTwoMin}
          onClose={onClose}
        />
      );

      fireEvent.press(getByLabelText('Just 2 Min'));

      expect(onJustTwoMin).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Close button', () => {
    it('renders close button', () => {
      const { getByLabelText } = render(<ActivationModal {...defaultProps} />);

      expect(getByLabelText('Close activation modal')).toBeTruthy();
    });

    it('calls onClose when close button is pressed', () => {
      const onClose = jest.fn();
      const { getByLabelText } = render(
        <ActivationModal {...defaultProps} onClose={onClose} />
      );

      fireEvent.press(getByLabelText('Close activation modal'));

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has accessible button roles for all buttons', () => {
      const { getAllByRole } = render(<ActivationModal {...defaultProps} />);

      const buttons = getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(4); // Close, Start Now, Snooze, Just 2 Min
    });

    it('accepts reduceMotion prop', () => {
      const { getByText } = render(
        <ActivationModal {...defaultProps} reduceMotion={true} />
      );

      expect(getByText('Time to Build')).toBeTruthy();
    });
  });

  describe('Minimal habit data', () => {
    it('renders with only required fields', () => {
      const minimalHabit: ActivationHabitData = {
        id: 'habit-2',
        name: 'Read',
      };
      const { getByText, queryByText } = render(
        <ActivationModal {...defaultProps} habit={minimalHabit} />
      );

      expect(getByText('Read')).toBeTruthy();
      expect(getByText('✨')).toBeTruthy(); // Default icon
      expect(queryByText('Your Why')).toBeNull();
      expect(queryByText('Your Plan')).toBeNull();
      expect(queryByText('Your Cue')).toBeNull();
    });
  });
});
