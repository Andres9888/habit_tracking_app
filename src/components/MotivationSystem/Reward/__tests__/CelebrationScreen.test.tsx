/**
 * CelebrationScreen Tests
 * Story T9.1-T9.7 - Create Reward/Celebration Screen
 *
 * Tests:
 * - T9.1: Modal visibility and component creation
 * - T9.2: Confetti/celebration animation
 * - T9.3: Updated streak display with flame
 * - T9.4: Stats cards (completion rate, best streak, total)
 * - T9.5: Quick Reflection integration
 * - T9.6: "Capture this feeling" prompt buttons
 * - T9.7: Done button
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import {
  CelebrationScreen,
  type CelebrationHabitData,
} from '../CelebrationScreen';

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
  PartyPopper: () => null,
  Flame: () => null,
  Target: () => null,
  TrendingUp: () => null,
  Trophy: () => null,
  Mic: () => null,
  Mail: () => null,
  Check: () => null,
  X: () => null,
  Sparkles: () => null,
  Crown: () => null,
  Smile: () => null,
  Plus: () => null,
  MessageSquare: () => null,
}));

// Mock clsx
jest.mock('clsx', () => ({
  clsx: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;
  return {
    default: {
      View,
      createAnimatedComponent: (Component: React.ComponentType<unknown>) => Component,
    },
    useSharedValue: (initial: unknown) => ({ value: initial }),
    useAnimatedStyle: () => ({}),
    withSpring: (value: unknown) => value,
    withTiming: (value: unknown, _config?: unknown, _callback?: unknown) => value,
    withDelay: (_delay: unknown, value: unknown) => value,
    withSequence: (...values: unknown[]) => values[values.length - 1],
    withRepeat: (value: unknown) => value,
    runOnJS: (fn: (...args: unknown[]) => unknown) => fn,
    Extrapolation: { CLAMP: 'clamp' },
    interpolate: (value: unknown, inputRange: unknown, outputRange: unknown) =>
      outputRange[0],
    Easing: {
      out: (fn: (...args: unknown[]) => unknown) => fn,
      in: (fn: (...args: unknown[]) => unknown) => fn,
      cubic: (x: number) => x,
    },
    View,
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

// Mock the Modal component
jest.mock('../../../Modal', () => ({
  Modal: ({ children, visible, onClose }: unknown) =>
    visible ? <>{children}</> : null,
}));

// Mock QuickReflection to isolate CelebrationScreen tests
jest.mock('../QuickReflection', () => ({
  QuickReflection: ({ selectedEmoji, onEmojiSelect, onNoteChange }: unknown) => {
    const { View, Text, Pressable, TextInput } = require('react-native');
    return (
      <View testID='quick-reflection'>
        <Text>Quick Reflection</Text>
        <Pressable
          testID='emoji-happy'
          onPress={() => onEmojiSelect?.('happy')}
        >
          <Text>😊</Text>
        </Pressable>
        <Pressable testID='emoji-fire' onPress={() => onEmojiSelect?.('fire')}>
          <Text>🔥</Text>
        </Pressable>
        <TextInput
          testID='reflection-note-input'
          onChangeText={(text: string) => onNoteChange?.(text)}
        />
        {selectedEmoji && <Text testID='selected-emoji'>{selectedEmoji}</Text>}
      </View>
    );
  },
}));

describe('CelebrationScreen', () => {
  const mockHabit: CelebrationHabitData = {
    id: 'habit-1',
    name: 'Morning Exercise',
    icon: '🏃',
    currentStreak: 14,
    bestStreak: 21,
    totalCompletions: 42,
    completionRate: 87,
    isStreakMilestone: false,
  };

  const milestoneHabit: CelebrationHabitData = {
    ...mockHabit,
    currentStreak: 30,
    isStreakMilestone: true,
    milestoneNumber: 30,
  };

  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    habit: mockHabit,
    onEmojiSelect: jest.fn(),
    onNoteChange: jest.fn(),
    onReflectionSubmit: jest.fn(),
    onRecordVoice: jest.fn(),
    onWriteLetter: jest.fn(),
    onDone: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('T9.1: CelebrationScreen component creation', () => {
    it('renders when visible is true', () => {
      const { getByText } = render(<CelebrationScreen {...defaultProps} />);

      expect(getByText('Celebration')).toBeTruthy();
    });

    it('does not render when visible is false', () => {
      const { queryByText } = render(
        <CelebrationScreen {...defaultProps} visible={false} />
      );

      expect(queryByText('Celebration')).toBeNull();
    });

    it('does not render when habit is null', () => {
      const { queryByText } = render(
        <CelebrationScreen {...defaultProps} habit={null} />
      );

      expect(queryByText('Celebration')).toBeNull();
    });

    it('renders close button', () => {
      const { getByLabelText } = render(
        <CelebrationScreen {...defaultProps} />
      );

      expect(getByLabelText('Close celebration')).toBeTruthy();
    });

    it('calls onClose when close button is pressed', () => {
      const onClose = jest.fn();
      const { getByLabelText } = render(
        <CelebrationScreen {...defaultProps} onClose={onClose} />
      );

      fireEvent.press(getByLabelText('Close celebration'));

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('T9.2: Celebration header and animation', () => {
    it('displays "You Did It!" for regular completion', () => {
      const { getByText } = render(<CelebrationScreen {...defaultProps} />);

      expect(getByText('You Did It!')).toBeTruthy();
    });

    it('displays habit name in completion message', () => {
      const { getByText } = render(<CelebrationScreen {...defaultProps} />);

      expect(getByText('"Morning Exercise" completed')).toBeTruthy();
    });

    it('displays milestone message for streak milestones', () => {
      const { getByText } = render(
        <CelebrationScreen {...defaultProps} habit={milestoneHabit} />
      );

      expect(getByText('30 Day Milestone!')).toBeTruthy();
    });

    it('displays dedication message for milestones', () => {
      const { getByText } = render(
        <CelebrationScreen {...defaultProps} habit={milestoneHabit} />
      );

      expect(
        getByText('Incredible dedication to "Morning Exercise"!')
      ).toBeTruthy();
    });
  });

  describe('T9.3: Streak display with flame', () => {
    it('displays current streak count', () => {
      const { getByText } = render(<CelebrationScreen {...defaultProps} />);

      expect(getByText('14')).toBeTruthy();
      expect(getByText('Day Streak')).toBeTruthy();
    });

    it('hides streak display when streak is 0', () => {
      const habitNoStreak = { ...mockHabit, currentStreak: 0 };
      const { queryByText } = render(
        <CelebrationScreen {...defaultProps} habit={habitNoStreak} />
      );

      expect(queryByText('Day Streak')).toBeNull();
    });

    it('hides streak display when streak is undefined', () => {
      const habitNoStreak = { ...mockHabit, currentStreak: undefined };
      const { queryByText } = render(
        <CelebrationScreen {...defaultProps} habit={habitNoStreak} />
      );

      expect(queryByText('Day Streak')).toBeNull();
    });
  });

  describe('T9.4: Stats cards', () => {
    it('displays completion rate', () => {
      const { getByText } = render(<CelebrationScreen {...defaultProps} />);

      expect(getByText('87%')).toBeTruthy();
      expect(getByText('Completion')).toBeTruthy();
    });

    it('displays best streak', () => {
      const { getByText } = render(<CelebrationScreen {...defaultProps} />);

      expect(getByText('21')).toBeTruthy();
      expect(getByText('Best Streak')).toBeTruthy();
    });

    it('displays total completions', () => {
      const { getByText } = render(<CelebrationScreen {...defaultProps} />);

      expect(getByText('42')).toBeTruthy();
      expect(getByText('Total')).toBeTruthy();
    });

    it('rounds completion rate percentage', () => {
      const habitWithDecimal = { ...mockHabit, completionRate: 87.6 };
      const { getByText } = render(
        <CelebrationScreen {...defaultProps} habit={habitWithDecimal} />
      );

      expect(getByText('88%')).toBeTruthy();
    });

    it('does not show stats section when no stats provided', () => {
      const habitNoStats = {
        id: 'habit-1',
        name: 'Test',
      };
      const { queryByText } = render(
        <CelebrationScreen {...defaultProps} habit={habitNoStats} />
      );

      expect(queryByText('Completion')).toBeNull();
      expect(queryByText('Best Streak')).toBeNull();
      expect(queryByText('Total')).toBeNull();
    });
  });

  describe('T9.5: Quick Reflection integration', () => {
    it('renders QuickReflection component', () => {
      const { getByTestId } = render(<CelebrationScreen {...defaultProps} />);

      expect(getByTestId('quick-reflection')).toBeTruthy();
    });

    it('passes emoji select callback', () => {
      const onEmojiSelect = jest.fn();
      const { getByTestId } = render(
        <CelebrationScreen {...defaultProps} onEmojiSelect={onEmojiSelect} />
      );

      fireEvent.press(getByTestId('emoji-happy'));

      expect(onEmojiSelect).toHaveBeenCalledWith('happy');
    });

    it('passes note change callback', () => {
      const onNoteChange = jest.fn();
      const { getByTestId } = render(
        <CelebrationScreen {...defaultProps} onNoteChange={onNoteChange} />
      );

      fireEvent.changeText(
        getByTestId('reflection-note-input'),
        'Great session!'
      );

      expect(onNoteChange).toHaveBeenCalledWith('Great session!');
    });

    it('displays selected emoji from props', () => {
      const { getByTestId } = render(
        <CelebrationScreen {...defaultProps} selectedEmoji='fire' />
      );

      expect(getByTestId('selected-emoji')).toBeTruthy();
    });
  });

  describe('T9.6: Capture this feeling prompts', () => {
    it('displays "Capture This Feeling" section header', () => {
      const { getByText } = render(<CelebrationScreen {...defaultProps} />);

      expect(getByText('Capture This Feeling')).toBeTruthy();
    });

    it('renders Record Voice button', () => {
      const { getByText, getByLabelText } = render(
        <CelebrationScreen {...defaultProps} />
      );

      expect(getByText('Record Voice')).toBeTruthy();
      expect(getByLabelText('Record Voice')).toBeTruthy();
    });

    it('renders Write Letter button', () => {
      const { getByText, getByLabelText } = render(
        <CelebrationScreen {...defaultProps} />
      );

      expect(getByText('Write Letter')).toBeTruthy();
      expect(getByLabelText('Write Letter')).toBeTruthy();
    });

    it('shows PRO badge on Record Voice', () => {
      const { getAllByText } = render(<CelebrationScreen {...defaultProps} />);

      // Should show PRO badge for premium features
      const proBadges = getAllByText('PRO');
      expect(proBadges.length).toBe(2); // Both Voice and Letter are premium
    });

    it('calls onRecordVoice when Record Voice is pressed', () => {
      const onRecordVoice = jest.fn();
      const { getByLabelText } = render(
        <CelebrationScreen {...defaultProps} onRecordVoice={onRecordVoice} />
      );

      fireEvent.press(getByLabelText('Record Voice'));

      expect(onRecordVoice).toHaveBeenCalledTimes(1);
    });

    it('calls onWriteLetter when Write Letter is pressed', () => {
      const onWriteLetter = jest.fn();
      const { getByLabelText } = render(
        <CelebrationScreen {...defaultProps} onWriteLetter={onWriteLetter} />
      );

      fireEvent.press(getByLabelText('Write Letter'));

      expect(onWriteLetter).toHaveBeenCalledTimes(1);
    });

    it('displays description for Record Voice', () => {
      const { getByText } = render(<CelebrationScreen {...defaultProps} />);

      expect(getByText('Record how you feel right now')).toBeTruthy();
    });

    it('displays description for Write Letter', () => {
      const { getByText } = render(<CelebrationScreen {...defaultProps} />);

      expect(getByText('Write to your future self')).toBeTruthy();
    });
  });

  describe('T9.7: Done button', () => {
    it('renders Done button', () => {
      const { getByText, getByLabelText } = render(
        <CelebrationScreen {...defaultProps} />
      );

      expect(getByText('Done')).toBeTruthy();
      expect(getByLabelText('Done')).toBeTruthy();
    });

    it('calls onDone and onClose when Done is pressed', () => {
      const onDone = jest.fn();
      const onClose = jest.fn();
      const { getByLabelText } = render(
        <CelebrationScreen
          {...defaultProps}
          onDone={onDone}
          onClose={onClose}
        />
      );

      fireEvent.press(getByLabelText('Done'));

      expect(onDone).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('has correct accessibility hint', () => {
      const { getByLabelText } = render(
        <CelebrationScreen {...defaultProps} />
      );

      const button = getByLabelText('Done');
      expect(button.props.accessibilityHint).toBe(
        'Close celebration and continue'
      );
    });
  });

  describe('Science tip', () => {
    it('displays BJ Fogg research tip', () => {
      const { getByText } = render(<CelebrationScreen {...defaultProps} />);

      expect(
        getByText(/BJ Fogg \(Stanford\): Celebration immediately/)
      ).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has accessible button roles for all buttons', () => {
      const { getAllByRole } = render(<CelebrationScreen {...defaultProps} />);

      const buttons = getAllByRole('button');
      // Close, Done, Record Voice, Write Letter, Emoji buttons
      expect(buttons.length).toBeGreaterThanOrEqual(4);
    });

    it('accepts reduceMotion prop', () => {
      const { getByText } = render(
        <CelebrationScreen {...defaultProps} reduceMotion={true} />
      );

      expect(getByText('Celebration')).toBeTruthy();
    });
  });

  describe('Minimal habit data', () => {
    it('renders with only required fields', () => {
      const minimalHabit: CelebrationHabitData = {
        id: 'habit-2',
        name: 'Read',
      };
      const { getByText, queryByText } = render(
        <CelebrationScreen {...defaultProps} habit={minimalHabit} />
      );

      expect(getByText('Celebration')).toBeTruthy();
      expect(getByText('You Did It!')).toBeTruthy();
      expect(getByText('"Read" completed')).toBeTruthy();
      expect(queryByText('Day Streak')).toBeNull();
      expect(queryByText('Completion')).toBeNull();
    });
  });

  describe('State management', () => {
    it('maintains emoji selection state', () => {
      const { getByTestId, rerender } = render(
        <CelebrationScreen {...defaultProps} />
      );

      // Select emoji
      fireEvent.press(getByTestId('emoji-fire'));

      // Re-render with same props should maintain state
      rerender(<CelebrationScreen {...defaultProps} />);

      // The onEmojiSelect should have been called
      expect(defaultProps.onEmojiSelect).toHaveBeenCalledWith('fire');
    });

    it('syncs with selectedEmoji prop changes', () => {
      const { rerender, getByTestId } = render(
        <CelebrationScreen {...defaultProps} selectedEmoji={undefined} />
      );

      rerender(<CelebrationScreen {...defaultProps} selectedEmoji='happy' />);

      expect(getByTestId('selected-emoji')).toBeTruthy();
    });
  });
});
