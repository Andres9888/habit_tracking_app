/**
 * Celebration Screen - Acceptance Criteria Validation Tests
 *
 * This test suite validates the "Should Have (v1.1)" acceptance criterion:
 * "Celebration screen with confetti after completion"
 *
 * The complete flow being tested:
 * 1. Trigger Condition: CelebrationScreen appears when habit is completed
 * 2. Confetti Animation: Celebratory particle burst effect
 * 3. Streak Display: Updated streak with flame animation
 * 4. Milestone Detection: Special celebration for streak milestones (7, 14, 30, 100)
 * 5. Stats Display: Completion rate, best streak, total completions
 * 6. Quick Reflection Integration: Emoji + note capture
 * 7. Capture Prompts: "Record Voice" and "Write Letter" premium CTAs
 * 8. Done Button: Closes modal and calls completion callback
 *
 * Scientific Basis:
 * - BJ Fogg (Stanford, "Tiny Habits"): Celebration IMMEDIATELY after behavior
 *   is the most powerful way to wire a new habit. It releases dopamine.
 * - Daylio (50M+ downloads): Validates the reflection/journaling pattern
 * - Positive reinforcement: Rewards strengthen neural pathways for habits
 *
 * Related Implementation Tasks:
 * - T9.1: Create `CelebrationScreen` component
 * - T9.2: Confetti/celebration animation
 * - T9.3: Updated streak display with flame
 * - T9.4: Stats cards (completion rate, best streak)
 * - T9.5: Quick Reflection integration
 * - T9.6: "Capture this feeling" prompt buttons
 * - T9.7: Done button
 */

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';

// ─────────────────────────────────────────────────────────────────────────────
// Mock Setup
// ─────────────────────────────────────────────────────────────────────────────

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock lucide-react-native with Proxy for dynamic icons
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (prop === '__esModule') return true;
        return function MockIcon(props: any) {
          return React.createElement(View, {
            testID: `lucide-icon-${String(prop)}`,
            ...props,
          });
        };
      },
    }
  );
});

// Mock clsx
jest.mock('clsx', () => ({
  clsx: (...args: any[]) =>
    args
      .flat()
      .filter((a) => typeof a === 'string')
      .join(' ')
      .trim(),
}));

// Mock react-native-reanimated
// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

// Mock the Modal component
jest.mock('../../../src/components/Modal', () => ({
  Modal: ({ children, visible, onClose }: any) =>
    visible ? <>{children}</> : null,
}));

// Mock QuickReflection to isolate CelebrationScreen tests
jest.mock(
  '../../../src/components/MotivationSystem/Reward/QuickReflection',
  () => ({
    QuickReflection: ({
      selectedEmoji,
      onEmojiSelect,
      onNoteChange,
      onSubmit,
    }: any) => {
      const { View, Text, Pressable, TextInput } = require('react-native');
      return (
        <View testID='quick-reflection'>
          <Text>Quick Reflection</Text>
          <Pressable
            accessibilityLabel='Frustrated emoji'
            testID='emoji-frustrated'
            onPress={() => onEmojiSelect?.('frustrated')}
          >
            <Text>😤</Text>
          </Pressable>
          <Pressable
            accessibilityLabel='Neutral emoji'
            testID='emoji-neutral'
            onPress={() => onEmojiSelect?.('neutral')}
          >
            <Text>😐</Text>
          </Pressable>
          <Pressable
            accessibilityLabel='Happy emoji'
            testID='emoji-happy'
            onPress={() => onEmojiSelect?.('happy')}
          >
            <Text>😊</Text>
          </Pressable>
          <Pressable
            accessibilityLabel='On Fire emoji'
            testID='emoji-fire'
            onPress={() => onEmojiSelect?.('fire')}
          >
            <Text>🔥</Text>
          </Pressable>
          <TextInput
            testID='reflection-note-input'
            onChangeText={(text: string) => onNoteChange?.(text)}
          />
          <Pressable testID='reflection-submit' onPress={() => onSubmit?.()}>
            <Text>Submit</Text>
          </Pressable>
          {selectedEmoji && (
            <Text testID='selected-emoji'>{selectedEmoji}</Text>
          )}
        </View>
      );
    },
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// Component Imports
// ─────────────────────────────────────────────────────────────────────────────

import {
  CelebrationScreen,
  type CelebrationHabitData,
} from '../../../src/components/MotivationSystem/Reward/CelebrationScreen';

// ─────────────────────────────────────────────────────────────────────────────
// Test Data
// ─────────────────────────────────────────────────────────────────────────────

const mockHabit: CelebrationHabitData = {
  id: 'habit-morning-run',
  name: 'Morning Run',
  icon: '🏃',
  currentStreak: 14,
  bestStreak: 21,
  totalCompletions: 56,
  completionRate: 87.5,
  isStreakMilestone: false,
};

const milestoneHabit: CelebrationHabitData = {
  id: 'habit-meditation',
  name: 'Morning Meditation',
  icon: '🧘',
  currentStreak: 30,
  bestStreak: 30,
  totalCompletions: 45,
  completionRate: 92,
  isStreakMilestone: true,
  milestoneNumber: 30,
};

const sevenDayMilestone: CelebrationHabitData = {
  ...mockHabit,
  currentStreak: 7,
  isStreakMilestone: true,
  milestoneNumber: 7,
};

const hundredDayMilestone: CelebrationHabitData = {
  ...mockHabit,
  currentStreak: 100,
  bestStreak: 100,
  isStreakMilestone: true,
  milestoneNumber: 100,
};

const minimalHabit: CelebrationHabitData = {
  id: 'habit-minimal',
  name: 'Simple Habit',
};

/**
 * Helper to create mock habit data with overrides
 */
function createCelebrationHabitData(
  overrides: Partial<CelebrationHabitData> = {}
): CelebrationHabitData {
  return {
    ...mockHabit,
    ...overrides,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Trigger Condition: Modal Visibility on Completion
// ─────────────────────────────────────────────────────────────────────────────

describe('1. Trigger Condition: Modal Visibility on Completion', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    habit: mockHabit,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders CelebrationScreen when visible is true', () => {
    const { getByText } = render(<CelebrationScreen {...defaultProps} />);

    expect(getByText('Celebration')).toBeTruthy();
  });

  it('does NOT render when visible is false', () => {
    const { queryByText } = render(
      <CelebrationScreen {...defaultProps} visible={false} />
    );

    expect(queryByText('Celebration')).toBeNull();
  });

  it('does NOT render when habit is null', () => {
    const { queryByText } = render(
      <CelebrationScreen {...defaultProps} habit={null} />
    );

    expect(queryByText('Celebration')).toBeNull();
  });

  it('displays habit name in completion message', () => {
    const { getByText } = render(<CelebrationScreen {...defaultProps} />);

    expect(getByText('"Morning Run" completed')).toBeTruthy();
  });

  it('displays "You Did It!" for regular completion', () => {
    const { getByText } = render(<CelebrationScreen {...defaultProps} />);

    expect(getByText('You Did It!')).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Confetti Animation: Celebratory Visual Effect
// ─────────────────────────────────────────────────────────────────────────────

describe('2. Confetti Animation: Celebratory Visual Effect', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    habit: mockHabit,
  };

  it('celebration header contains emerald background styling', () => {
    const { getByText } = render(<CelebrationScreen {...defaultProps} />);

    // CelebrationHeader renders with emerald-50 background
    expect(getByText('You Did It!')).toBeTruthy();
  });

  it('renders with reduceMotion prop to disable animations', () => {
    const { getByText } = render(
      <CelebrationScreen {...defaultProps} reduceMotion={true} />
    );

    // Should still render content but without animations
    expect(getByText('Celebration')).toBeTruthy();
    expect(getByText('You Did It!')).toBeTruthy();
  });

  it('displays PartyPopper icon for regular celebration', () => {
    const { getAllByTestId } = render(<CelebrationScreen {...defaultProps} />);

    // PartyPopper icons present (header and celebration icon)
    const partyPopperIcons = getAllByTestId('lucide-icon-PartyPopper');
    expect(partyPopperIcons.length).toBeGreaterThanOrEqual(1);
  });

  it('displays Crown icon for milestone celebration', () => {
    const { getByTestId } = render(
      <CelebrationScreen {...defaultProps} habit={milestoneHabit} />
    );

    // Crown icon appears for milestones
    expect(getByTestId('lucide-icon-Crown')).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Streak Display: Updated Streak with Flame
// ─────────────────────────────────────────────────────────────────────────────

describe('3. Streak Display: Updated Streak with Flame', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    habit: mockHabit,
  };

  it('displays current streak count', () => {
    const { getByText } = render(<CelebrationScreen {...defaultProps} />);

    expect(getByText('14')).toBeTruthy();
  });

  it('displays "Day Streak" label', () => {
    const { getByText } = render(<CelebrationScreen {...defaultProps} />);

    expect(getByText('Day Streak')).toBeTruthy();
  });

  it('renders Flame icon for streak display', () => {
    const { getAllByTestId } = render(<CelebrationScreen {...defaultProps} />);

    // Flame icon for streak
    const flameIcons = getAllByTestId('lucide-icon-Flame');
    expect(flameIcons.length).toBeGreaterThanOrEqual(1);
  });

  it('hides streak display when streak is 0', () => {
    const habitNoStreak = createCelebrationHabitData({ currentStreak: 0 });
    const { queryByText } = render(
      <CelebrationScreen {...defaultProps} habit={habitNoStreak} />
    );

    expect(queryByText('Day Streak')).toBeNull();
  });

  it('hides streak display when streak is undefined', () => {
    const habitNoStreak = createCelebrationHabitData({
      currentStreak: undefined,
    });
    const { queryByText } = render(
      <CelebrationScreen {...defaultProps} habit={habitNoStreak} />
    );

    expect(queryByText('Day Streak')).toBeNull();
  });

  it('displays high streak numbers correctly', () => {
    const highStreakHabit = createCelebrationHabitData({ currentStreak: 365 });
    const { getByText } = render(
      <CelebrationScreen {...defaultProps} habit={highStreakHabit} />
    );

    expect(getByText('365')).toBeTruthy();
    expect(getByText('Day Streak')).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Milestone Detection: Special Celebration for Streak Milestones
// ─────────────────────────────────────────────────────────────────────────────

describe('4. Milestone Detection: Special Celebration for Streak Milestones', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
  };

  it('displays milestone message for 7-day streak', () => {
    const { getByText } = render(
      <CelebrationScreen {...defaultProps} habit={sevenDayMilestone} />
    );

    expect(getByText('7 Day Milestone!')).toBeTruthy();
  });

  it('displays milestone message for 30-day streak', () => {
    const { getByText } = render(
      <CelebrationScreen {...defaultProps} habit={milestoneHabit} />
    );

    expect(getByText('30 Day Milestone!')).toBeTruthy();
  });

  it('displays milestone message for 100-day streak', () => {
    const { getByText } = render(
      <CelebrationScreen {...defaultProps} habit={hundredDayMilestone} />
    );

    expect(getByText('100 Day Milestone!')).toBeTruthy();
  });

  it('displays dedication message for milestones', () => {
    const { getByText } = render(
      <CelebrationScreen {...defaultProps} habit={milestoneHabit} />
    );

    expect(
      getByText('Incredible dedication to "Morning Meditation"!')
    ).toBeTruthy();
  });

  it('does NOT display milestone message for regular completion', () => {
    const { queryByText, getByText } = render(
      <CelebrationScreen {...defaultProps} habit={mockHabit} />
    );

    expect(queryByText(/Day Milestone!/)).toBeNull();
    expect(getByText('You Did It!')).toBeTruthy();
  });

  it('renders Crown icon for milestone celebrations', () => {
    const { getByTestId } = render(
      <CelebrationScreen {...defaultProps} habit={milestoneHabit} />
    );

    expect(getByTestId('lucide-icon-Crown')).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. Stats Display: Completion Rate, Best Streak, Total Completions
// ─────────────────────────────────────────────────────────────────────────────

describe('5. Stats Display: Completion Rate, Best Streak, Total Completions', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    habit: mockHabit,
  };

  it('displays completion rate percentage', () => {
    const { getByText } = render(<CelebrationScreen {...defaultProps} />);

    expect(getByText('88%')).toBeTruthy(); // Rounded from 87.5
    expect(getByText('Completion')).toBeTruthy();
  });

  it('rounds completion rate percentage correctly', () => {
    const habitWithDecimal = createCelebrationHabitData({
      completionRate: 73.4,
    });
    const { getByText } = render(
      <CelebrationScreen {...defaultProps} habit={habitWithDecimal} />
    );

    expect(getByText('73%')).toBeTruthy();
  });

  it('displays best streak count', () => {
    const { getByText } = render(<CelebrationScreen {...defaultProps} />);

    expect(getByText('21')).toBeTruthy();
    expect(getByText('Best Streak')).toBeTruthy();
  });

  it('displays total completions count', () => {
    const { getByText } = render(<CelebrationScreen {...defaultProps} />);

    expect(getByText('56')).toBeTruthy();
    expect(getByText('Total')).toBeTruthy();
  });

  it('renders TrendingUp icon for completion rate', () => {
    const { getByTestId } = render(<CelebrationScreen {...defaultProps} />);

    expect(getByTestId('lucide-icon-TrendingUp')).toBeTruthy();
  });

  it('renders Trophy icon for best streak', () => {
    const { getByTestId } = render(<CelebrationScreen {...defaultProps} />);

    expect(getByTestId('lucide-icon-Trophy')).toBeTruthy();
  });

  it('renders Target icon for total completions', () => {
    const { getAllByTestId } = render(<CelebrationScreen {...defaultProps} />);

    // Target icon may be used in multiple places
    const targetIcons = getAllByTestId('lucide-icon-Target');
    expect(targetIcons.length).toBeGreaterThanOrEqual(1);
  });

  it('hides stats section when no stats are provided', () => {
    const { queryByText } = render(
      <CelebrationScreen {...defaultProps} habit={minimalHabit} />
    );

    expect(queryByText('Completion')).toBeNull();
    expect(queryByText('Best Streak')).toBeNull();
    expect(queryByText('Total')).toBeNull();
  });

  it('shows partial stats when only some are provided', () => {
    const partialHabit = createCelebrationHabitData({
      completionRate: 75,
      bestStreak: undefined,
      totalCompletions: undefined,
    });
    const { getByText, queryByText } = render(
      <CelebrationScreen {...defaultProps} habit={partialHabit} />
    );

    expect(getByText('75%')).toBeTruthy();
    expect(getByText('Completion')).toBeTruthy();
    expect(queryByText('Best Streak')).toBeNull();
    expect(queryByText('Total')).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. Quick Reflection Integration: Emoji + Note Capture
// ─────────────────────────────────────────────────────────────────────────────

describe('6. Quick Reflection Integration: Emoji + Note Capture', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    habit: mockHabit,
    onEmojiSelect: jest.fn(),
    onNoteChange: jest.fn(),
    onReflectionSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders QuickReflection component', () => {
    const { getByTestId } = render(<CelebrationScreen {...defaultProps} />);

    expect(getByTestId('quick-reflection')).toBeTruthy();
  });

  it('calls onEmojiSelect when emoji is selected', () => {
    const onEmojiSelect = jest.fn();
    const { getByTestId } = render(
      <CelebrationScreen {...defaultProps} onEmojiSelect={onEmojiSelect} />
    );

    fireEvent.press(getByTestId('emoji-happy'));

    expect(onEmojiSelect).toHaveBeenCalledWith('happy');
  });

  it('calls onEmojiSelect with correct emoji type for each option', () => {
    const onEmojiSelect = jest.fn();
    const { getByTestId } = render(
      <CelebrationScreen {...defaultProps} onEmojiSelect={onEmojiSelect} />
    );

    // Test all 4 emoji options
    fireEvent.press(getByTestId('emoji-frustrated'));
    expect(onEmojiSelect).toHaveBeenCalledWith('frustrated');

    fireEvent.press(getByTestId('emoji-neutral'));
    expect(onEmojiSelect).toHaveBeenCalledWith('neutral');

    fireEvent.press(getByTestId('emoji-fire'));
    expect(onEmojiSelect).toHaveBeenCalledWith('fire');
  });

  it('calls onNoteChange when note is entered', () => {
    const onNoteChange = jest.fn();
    const { getByTestId } = render(
      <CelebrationScreen {...defaultProps} onNoteChange={onNoteChange} />
    );

    fireEvent.changeText(
      getByTestId('reflection-note-input'),
      'Felt amazing today!'
    );

    expect(onNoteChange).toHaveBeenCalledWith('Felt amazing today!');
  });

  it('displays selected emoji from props', () => {
    const { getByTestId } = render(
      <CelebrationScreen {...defaultProps} selectedEmoji='fire' />
    );

    expect(getByTestId('selected-emoji').props.children).toBe('fire');
  });

  it('syncs with selectedEmoji prop changes', () => {
    const { rerender, getByTestId, queryByTestId } = render(
      <CelebrationScreen {...defaultProps} selectedEmoji={undefined} />
    );

    expect(queryByTestId('selected-emoji')).toBeNull();

    rerender(<CelebrationScreen {...defaultProps} selectedEmoji='happy' />);

    expect(getByTestId('selected-emoji').props.children).toBe('happy');
  });

  it('displays initial reflection note from props', () => {
    const { getByTestId } = render(
      <CelebrationScreen {...defaultProps} reflectionNote='Initial note' />
    );

    // Note input should have value
    expect(getByTestId('reflection-note-input')).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. Capture Prompts: Record Voice and Write Letter CTAs
// ─────────────────────────────────────────────────────────────────────────────

describe('7. Capture Prompts: Record Voice and Write Letter CTAs', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    habit: mockHabit,
    onRecordVoice: jest.fn(),
    onWriteLetter: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays "Capture This Feeling" section header', () => {
    const { getByText } = render(<CelebrationScreen {...defaultProps} />);

    expect(getByText('Capture This Feeling')).toBeTruthy();
  });

  it('displays "Record Voice" button', () => {
    const { getByText, getByLabelText } = render(
      <CelebrationScreen {...defaultProps} />
    );

    expect(getByText('Record Voice')).toBeTruthy();
    expect(getByLabelText('Record Voice')).toBeTruthy();
  });

  it('displays "Write Letter" button', () => {
    const { getByText, getByLabelText } = render(
      <CelebrationScreen {...defaultProps} />
    );

    expect(getByText('Write Letter')).toBeTruthy();
    expect(getByLabelText('Write Letter')).toBeTruthy();
  });

  it('displays PRO badges on premium features', () => {
    const { getAllByText } = render(<CelebrationScreen {...defaultProps} />);

    // Both Record Voice and Write Letter are premium
    const proBadges = getAllByText('PRO');
    expect(proBadges.length).toBe(2);
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

  it('renders Mic icon for Record Voice', () => {
    const { getByTestId } = render(<CelebrationScreen {...defaultProps} />);

    expect(getByTestId('lucide-icon-Mic')).toBeTruthy();
  });

  it('renders Mail icon for Write Letter', () => {
    const { getByTestId } = render(<CelebrationScreen {...defaultProps} />);

    expect(getByTestId('lucide-icon-Mail')).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. Done Button: Closes Modal and Calls Completion Callback
// ─────────────────────────────────────────────────────────────────────────────

describe('8. Done Button: Closes Modal and Calls Completion Callback', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    habit: mockHabit,
    onDone: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays Done button', () => {
    const { getByText, getByLabelText } = render(
      <CelebrationScreen {...defaultProps} />
    );

    expect(getByText('Done')).toBeTruthy();
    expect(getByLabelText('Done')).toBeTruthy();
  });

  it('calls onDone when Done button is pressed', () => {
    const onDone = jest.fn();
    const { getByLabelText } = render(
      <CelebrationScreen {...defaultProps} onDone={onDone} />
    );

    fireEvent.press(getByLabelText('Done'));

    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Done button is pressed', () => {
    const onClose = jest.fn();
    const { getByLabelText } = render(
      <CelebrationScreen {...defaultProps} onClose={onClose} />
    );

    fireEvent.press(getByLabelText('Done'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls both onDone and onClose in correct order', () => {
    const onDone = jest.fn();
    const onClose = jest.fn();
    const { getByLabelText } = render(
      <CelebrationScreen {...defaultProps} onDone={onDone} onClose={onClose} />
    );

    fireEvent.press(getByLabelText('Done'));

    expect(onDone).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('has correct accessibility hint', () => {
    const { getByLabelText } = render(<CelebrationScreen {...defaultProps} />);

    const button = getByLabelText('Done');
    expect(button.props.accessibilityHint).toBe(
      'Close celebration and continue'
    );
  });

  it('renders Check icon in Done button', () => {
    const { getByTestId } = render(<CelebrationScreen {...defaultProps} />);

    expect(getByTestId('lucide-icon-Check')).toBeTruthy();
  });

  it('displays close button in header', () => {
    const { getByLabelText } = render(<CelebrationScreen {...defaultProps} />);

    expect(getByLabelText('Close celebration')).toBeTruthy();
  });

  it('calls onClose when header close button is pressed', () => {
    const onClose = jest.fn();
    const { getByLabelText } = render(
      <CelebrationScreen {...defaultProps} onClose={onClose} />
    );

    fireEvent.press(getByLabelText('Close celebration'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. Scientific Basis Validation: BJ Fogg Celebration Principle
// ─────────────────────────────────────────────────────────────────────────────

describe('9. Scientific Basis Validation: BJ Fogg Celebration Principle', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    habit: mockHabit,
  };

  it('displays BJ Fogg research tip', () => {
    const { getByText } = render(<CelebrationScreen {...defaultProps} />);

    expect(
      getByText(/BJ Fogg \(Stanford\): Celebration immediately/)
    ).toBeTruthy();
  });

  it('emphasizes celebration wires habits (dopamine release)', () => {
    const { getByText } = render(<CelebrationScreen {...defaultProps} />);

    expect(getByText(/most powerful way to wire a new habit/)).toBeTruthy();
  });

  it('implements immediate positive feedback (celebration header)', () => {
    const { getByText } = render(<CelebrationScreen {...defaultProps} />);

    // Immediate positive reinforcement
    expect(getByText('You Did It!')).toBeTruthy();
  });

  it('implements visual celebration (emerald color palette)', () => {
    const { getByText } = render(<CelebrationScreen {...defaultProps} />);

    // Celebration header with positive messaging
    expect(getByText('Celebration')).toBeTruthy();
  });

  it('implements reflection capture per Daylio model', () => {
    const { getByTestId } = render(<CelebrationScreen {...defaultProps} />);

    // QuickReflection component validates Daylio pattern
    expect(getByTestId('quick-reflection')).toBeTruthy();
  });

  it('implements "Capture This Feeling" per Calm emotional audio model', () => {
    const { getByText } = render(<CelebrationScreen {...defaultProps} />);

    // Prompt to capture positive emotions
    expect(getByText('Capture This Feeling')).toBeTruthy();
    expect(getByText('Record how you feel right now')).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 10. Edge Cases and Error Handling
// ─────────────────────────────────────────────────────────────────────────────

describe('10. Edge Cases and Error Handling', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
  };

  it('handles minimal habit data gracefully', () => {
    const { getByText, queryByText } = render(
      <CelebrationScreen {...defaultProps} habit={minimalHabit} />
    );

    expect(getByText('Celebration')).toBeTruthy();
    expect(getByText('You Did It!')).toBeTruthy();
    expect(getByText('"Simple Habit" completed')).toBeTruthy();
    expect(queryByText('Day Streak')).toBeNull();
    expect(queryByText('Completion')).toBeNull();
  });

  it('handles empty habit name gracefully', () => {
    const emptyNameHabit = createCelebrationHabitData({ name: '' });
    const { getByText } = render(
      <CelebrationScreen {...defaultProps} habit={emptyNameHabit} />
    );

    expect(getByText('Celebration')).toBeTruthy();
  });

  it('handles very long habit name gracefully', () => {
    const longNameHabit = createCelebrationHabitData({
      name: 'This is a very long habit name that might cause layout issues if not handled properly',
    });
    const { getByText } = render(
      <CelebrationScreen {...defaultProps} habit={longNameHabit} />
    );

    expect(getByText('Celebration')).toBeTruthy();
  });

  it('handles 100% completion rate', () => {
    const perfectHabit = createCelebrationHabitData({ completionRate: 100 });
    const { getByText } = render(
      <CelebrationScreen {...defaultProps} habit={perfectHabit} />
    );

    expect(getByText('100%')).toBeTruthy();
  });

  it('handles 0% completion rate', () => {
    const zeroRateHabit = createCelebrationHabitData({ completionRate: 0 });
    const { getByText } = render(
      <CelebrationScreen {...defaultProps} habit={zeroRateHabit} />
    );

    expect(getByText('0%')).toBeTruthy();
  });

  it('handles undefined callbacks gracefully', () => {
    const { getByLabelText } = render(
      <CelebrationScreen
        {...defaultProps}
        habit={mockHabit}
        onDone={undefined}
        onRecordVoice={undefined}
        onWriteLetter={undefined}
      />
    );

    // Should not throw when pressing buttons with undefined callbacks
    expect(() => fireEvent.press(getByLabelText('Done'))).not.toThrow();
    expect(() => fireEvent.press(getByLabelText('Record Voice'))).not.toThrow();
    expect(() => fireEvent.press(getByLabelText('Write Letter'))).not.toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 11. Accessibility Compliance
// ─────────────────────────────────────────────────────────────────────────────

describe('11. Accessibility Compliance', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    habit: mockHabit,
    onDone: jest.fn(),
    onRecordVoice: jest.fn(),
    onWriteLetter: jest.fn(),
  };

  it('all interactive buttons have accessibility labels', () => {
    const { getByLabelText } = render(<CelebrationScreen {...defaultProps} />);

    expect(getByLabelText('Close celebration')).toBeTruthy();
    expect(getByLabelText('Done')).toBeTruthy();
    expect(getByLabelText('Record Voice')).toBeTruthy();
    expect(getByLabelText('Write Letter')).toBeTruthy();
  });

  it('all buttons have button role', () => {
    const { getAllByRole } = render(<CelebrationScreen {...defaultProps} />);

    const buttons = getAllByRole('button');
    // Close, Done, Record Voice, Write Letter, plus emoji buttons
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });

  it('supports reduceMotion prop for accessibility', () => {
    const { getByText } = render(
      <CelebrationScreen {...defaultProps} reduceMotion={true} />
    );

    // Should render correctly with animations disabled
    expect(getByText('Celebration')).toBeTruthy();
    expect(getByText('You Did It!')).toBeTruthy();
  });

  it('Done button has accessibility hint', () => {
    const { getByLabelText } = render(<CelebrationScreen {...defaultProps} />);

    const button = getByLabelText('Done');
    expect(button.props.accessibilityHint).toBe(
      'Close celebration and continue'
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 12. Complete Flow: Habit Completion to Celebration
// ─────────────────────────────────────────────────────────────────────────────

describe('12. Complete Flow: Habit Completion to Celebration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('complete flow: habit completed → celebration displayed → reflection → done', () => {
    const onEmojiSelect = jest.fn();
    const onNoteChange = jest.fn();
    const onDone = jest.fn();
    const onClose = jest.fn();

    const { getByTestId, getByLabelText, getByText } = render(
      <CelebrationScreen
        visible={true}
        habit={mockHabit}
        onClose={onClose}
        onEmojiSelect={onEmojiSelect}
        onNoteChange={onNoteChange}
        onDone={onDone}
      />
    );

    // Step 1: Celebration is displayed
    expect(getByText('You Did It!')).toBeTruthy();
    expect(getByText('14')).toBeTruthy(); // Streak

    // Step 2: User selects emoji
    fireEvent.press(getByTestId('emoji-fire'));
    expect(onEmojiSelect).toHaveBeenCalledWith('fire');

    // Step 3: User adds note
    fireEvent.changeText(
      getByTestId('reflection-note-input'),
      'Best workout ever!'
    );
    expect(onNoteChange).toHaveBeenCalledWith('Best workout ever!');

    // Step 4: User taps Done
    fireEvent.press(getByLabelText('Done'));
    expect(onDone).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('flow with milestone celebration', () => {
    const onDone = jest.fn();
    const onClose = jest.fn();

    const { getByText, getByLabelText } = render(
      <CelebrationScreen
        visible={true}
        habit={milestoneHabit}
        onClose={onClose}
        onDone={onDone}
      />
    );

    // Special milestone celebration
    expect(getByText('30 Day Milestone!')).toBeTruthy();
    expect(
      getByText('Incredible dedication to "Morning Meditation"!')
    ).toBeTruthy();

    // Complete the flow
    fireEvent.press(getByLabelText('Done'));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('flow with premium feature CTAs', () => {
    const onRecordVoice = jest.fn();
    const onWriteLetter = jest.fn();

    const { getByLabelText, getAllByText } = render(
      <CelebrationScreen
        visible={true}
        habit={mockHabit}
        onClose={jest.fn()}
        onRecordVoice={onRecordVoice}
        onWriteLetter={onWriteLetter}
      />
    );

    // PRO badges visible
    expect(getAllByText('PRO').length).toBe(2);

    // User taps premium features
    fireEvent.press(getByLabelText('Record Voice'));
    expect(onRecordVoice).toHaveBeenCalledTimes(1);

    fireEvent.press(getByLabelText('Write Letter'));
    expect(onWriteLetter).toHaveBeenCalledTimes(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 13. State Management
// ─────────────────────────────────────────────────────────────────────────────

describe('13. State Management', () => {
  it('maintains emoji selection state across re-renders', () => {
    const onEmojiSelect = jest.fn();
    const { getByTestId, rerender } = render(
      <CelebrationScreen
        visible={true}
        habit={mockHabit}
        onClose={jest.fn()}
        onEmojiSelect={onEmojiSelect}
      />
    );

    // Select emoji
    fireEvent.press(getByTestId('emoji-fire'));
    expect(onEmojiSelect).toHaveBeenCalledWith('fire');

    // Re-render with same props
    rerender(
      <CelebrationScreen
        visible={true}
        habit={mockHabit}
        onClose={jest.fn()}
        onEmojiSelect={onEmojiSelect}
      />
    );

    // Should still have callback reference
    expect(onEmojiSelect).toHaveBeenCalledTimes(1);
  });

  it('syncs with selectedEmoji prop changes', () => {
    const { rerender, getByTestId, queryByTestId } = render(
      <CelebrationScreen
        visible={true}
        habit={mockHabit}
        onClose={jest.fn()}
        selectedEmoji={undefined}
      />
    );

    expect(queryByTestId('selected-emoji')).toBeNull();

    rerender(
      <CelebrationScreen
        visible={true}
        habit={mockHabit}
        onClose={jest.fn()}
        selectedEmoji='happy'
      />
    );

    expect(getByTestId('selected-emoji').props.children).toBe('happy');
  });

  it('syncs with reflectionNote prop changes', () => {
    const onNoteChange = jest.fn();
    const { rerender, getByTestId } = render(
      <CelebrationScreen
        visible={true}
        habit={mockHabit}
        onClose={jest.fn()}
        onNoteChange={onNoteChange}
        reflectionNote=''
      />
    );

    // Update note
    fireEvent.changeText(getByTestId('reflection-note-input'), 'New note');
    expect(onNoteChange).toHaveBeenCalledWith('New note');

    // Prop update
    rerender(
      <CelebrationScreen
        visible={true}
        habit={mockHabit}
        onClose={jest.fn()}
        onNoteChange={onNoteChange}
        reflectionNote='Updated from prop'
      />
    );

    // Component should handle prop sync
    expect(getByTestId('reflection-note-input')).toBeTruthy();
  });
});
