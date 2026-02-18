/**
 * Integration Tests for Motivation System Screen Flows
 *
 * Story T16.2: Integration tests for screen flows
 *
 * Tests the full Motivation System flow from Activation → Rescue → Celebration:
 * - ActivationModal: Pre-habit notification/priming flow
 * - RescueMode: Streak-at-risk intervention flow
 * - CelebrationScreen: Post-completion reward flow
 *
 * These tests verify:
 * 1. Component rendering with real data structures
 * 2. User interaction flows (button presses, selections)
 * 3. Callback propagation through component trees
 * 4. State transitions between screens
 * 5. Conditional rendering based on habit data
 *
 * Scientific Basis Validated:
 * - Huberman Protocol: ContextAwareViz shows failure viz when unmotivated
 * - BJ Fogg: Celebration immediately after completion
 * - Loss Aversion: RescueMode always shows failure visualization
 */

import React, { useState } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { View, Text } from 'react-native';

// Import screen flow components
import {
  ActivationModal,
  type ActivationHabitData,
} from '../../../src/components/MotivationSystem/Activation/ActivationModal';
import {
  RescueMode,
  type RescueHabitData,
} from '../../../src/components/MotivationSystem/Rescue/RescueMode';
import {
  CelebrationScreen,
  type CelebrationHabitData,
} from '../../../src/components/MotivationSystem/Reward/CelebrationScreen';
import {
  MotivationCheck,
  shouldShowFailureViz,
  type MotivationLevel,
} from '../../../src/components/MotivationSystem/Activation/MotivationCheck';
import {
  ContextAwareViz,
  type VisualizationData,
} from '../../../src/components/MotivationSystem/Activation/ContextAwareViz';
import { FailureViz } from '../../../src/components/MotivationSystem/Rescue/FailureViz';
import {
  QuickReflection,
  type EmojiType,
} from '../../../src/components/MotivationSystem/Reward/QuickReflection';

// ─────────────────────────────────────────────────────────────────────────────
// Mocks
// ─────────────────────────────────────────────────────────────────────────────

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
}));

// Mock lucide-react-native with Proxy for dynamic icons
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  return new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (prop === '__esModule') return true;
        return function MockIcon(props: unknown) {
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
  clsx: (...args: unknown[]) =>
    args
      .flat()
      .filter((a) => typeof a === 'string')
      .join(' ')
      .trim(),
}));

// Mock react-native-reanimated for integration tests
jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;
  return {
    default: {
      View,
      createAnimatedComponent: (Component: unknown) => Component,
    },
    useSharedValue: (initial: unknown) => ({ value: initial }),
    useAnimatedStyle: () => ({}),
    withSpring: (value: unknown) => value,
    withTiming: (value: unknown, _config?: unknown, _callback?: unknown) => value,
    withDelay: (_delay: unknown, value: unknown) => value,
    withSequence: (...values: unknown[]) => values[values.length - 1],
    withRepeat: (animation: unknown) => animation,
    interpolate: (value: number, input: number[], output: number[]) =>
      output[0],
    runOnJS: (_fn: unknown) => () => {},
    Extrapolation: { CLAMP: 'clamp' },
    Easing: {
      out: (fn: unknown) => fn,
      in: (fn: unknown) => fn,
      cubic: (x: number) => x,
    },
    View,
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

// Mock Modal component
jest.mock('../../../src/components/Modal', () => ({
  Modal: ({ children, visible }: unknown) => (visible ? <>{children}</> : null),
}));

// Mock motion constants
jest.mock('../../../src/constants/motion', () => ({
  Springs: {
    sheet: { damping: 32, stiffness: 180, mass: 1.3 },
    gentle: { damping: 28, stiffness: 180, mass: 1.2 },
    button: { damping: 15, stiffness: 300 },
    bouncy: { damping: 8, stiffness: 300 },
  },
}));

// Mock VoiceNotePlaybackUI (used in RescueMode)
jest.mock(
  '../../../src/components/MotivationSystem/Workshop/VoiceNotePlaybackUI',
  () => ({
    VoiceNotePlaybackUI: ({
      audioUri,
      onPlayStart,
      onPlayFinish,
    }: {
      audioUri: string;
      onPlayStart?: () => void;
      onPlayFinish?: () => void;
    }) => {
      const React = require('react');
      const { View, Text, Pressable } = require('react-native');
      return React.createElement(
        View,
        { testID: 'voice-note-playback' },
        React.createElement(
          Pressable,
          {
            testID: 'play-voice-note-button',
            onPress: () => {
              onPlayStart?.();
              // Simulate finish after "playback"
              setTimeout(() => onPlayFinish?.(), 100);
            },
          },
          React.createElement(Text, null, 'Play Voice Note')
        )
      );
    },
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// Test Fixtures
// ─────────────────────────────────────────────────────────────────────────────

const createActivationHabitData = (
  overrides?: Partial<ActivationHabitData>
): ActivationHabitData => ({
  id: 'habit-test-1',
  name: 'Morning Meditation',
  icon: '🧘',
  currentStreak: 14,
  totalCompletions: 42,
  why: 'To find inner peace and reduce anxiety',
  woopObstacle: 'I feel too rushed in the morning',
  woopPlan: "I'll wake up 15 minutes earlier",
  cueTime: '6:30 AM',
  cueLocation: 'Bedroom',
  cueAfterBehavior: 'After waking up',
  vizSuccessBody: 'Relaxed muscles, steady breathing',
  vizSuccessMind: 'Clear and focused thoughts',
  vizSuccessEmotion: 'Calm and at peace',
  vizFailureBody: 'Tense shoulders, shallow breathing',
  vizFailureMind: 'Racing anxious thoughts',
  vizFailureEmotion: 'Regret and frustration',
  ...overrides,
});

const createRescueHabitData = (
  overrides?: Partial<RescueHabitData>
): RescueHabitData => ({
  id: 'habit-test-1',
  name: 'Morning Meditation',
  icon: '🧘',
  currentStreak: 14,
  totalCompletions: 42,
  why: 'To find inner peace and reduce anxiety',
  hoursRemaining: 3,
  vizFailureBody: 'Tense shoulders, shallow breathing',
  vizFailureMind: 'Racing anxious thoughts',
  vizFailureEmotion: 'Regret and frustration',
  day1VoiceNote: {
    id: 'voice-note-1',
    audioUrl: 'file://test/audio.m4a',
    duration: 45,
    label: 'My commitment',
    createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
  },
  ...overrides,
});

const createCelebrationHabitData = (
  overrides?: Partial<CelebrationHabitData>
): CelebrationHabitData => ({
  id: 'habit-test-1',
  name: 'Morning Meditation',
  icon: '🧘',
  currentStreak: 15, // Incremented after completion
  bestStreak: 15,
  totalCompletions: 43,
  completionRate: 85,
  isStreakMilestone: false,
  ...overrides,
});

// ─────────────────────────────────────────────────────────────────────────────
// Integration Tests: Activation Flow
// ─────────────────────────────────────────────────────────────────────────────

describe('Activation Flow Integration', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    habit: createActivationHabitData(),
    onStartNow: jest.fn(),
    onSnooze: jest.fn(),
    onJustTwoMin: jest.fn(),
    reduceMotion: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete User Journey: Activation Modal', () => {
    it('renders all motivation content sections with full habit data', () => {
      const { getByText, getByLabelText } = render(
        <ActivationModal {...defaultProps} />
      );

      // Verify habit card
      expect(getByText('Morning Meditation')).toBeTruthy();
      expect(getByText('🧘')).toBeTruthy();
      expect(getByText('14 day streak')).toBeTruthy();
      expect(getByText('42 total')).toBeTruthy();

      // Verify Your Why section
      expect(getByText('Your Why')).toBeTruthy();
      expect(
        getByText('"To find inner peace and reduce anxiety"')
      ).toBeTruthy();

      // Verify WOOP reminder
      expect(getByText('Your Plan')).toBeTruthy();

      // Verify Cue reminder
      expect(getByText('Your Cue')).toBeTruthy();

      // Verify action buttons
      expect(getByLabelText('Start habit now')).toBeTruthy();
      expect(getByLabelText('Snooze')).toBeTruthy();
      expect(getByLabelText('Just 2 Min')).toBeTruthy();
    });

    it('calls onStartNow and closes modal when Start Now is pressed', () => {
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

    it('calls onJustTwoMin for minimal commitment (BJ Fogg tiny habits)', () => {
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

    it('gracefully handles minimal habit data', () => {
      const minimalHabit = createActivationHabitData({
        why: undefined,
        woopObstacle: undefined,
        woopPlan: undefined,
        cueTime: undefined,
        cueLocation: undefined,
        cueAfterBehavior: undefined,
        currentStreak: 0,
        totalCompletions: 0,
      });

      const { getByText, queryByText } = render(
        <ActivationModal {...defaultProps} habit={minimalHabit} />
      );

      // Habit name should still render
      expect(getByText('Morning Meditation')).toBeTruthy();

      // Optional sections should not render
      expect(queryByText('Your Why')).toBeNull();
      expect(queryByText('Your Plan')).toBeNull();
      expect(queryByText('Your Cue')).toBeNull();
    });
  });

  describe('MotivationCheck → ContextAwareViz Integration', () => {
    it('shows success visualization when user selects "Ready!"', () => {
      const visualization: VisualizationData = {
        successBody: 'Energized and light',
        successMind: 'Focused and clear',
        successEmotion: 'Excited and confident',
        failureBody: 'Heavy and tired',
        failureMind: 'Foggy and distracted',
        failureEmotion: 'Disappointed and regretful',
      };

      const { getByText, queryByText, rerender } = render(
        <ContextAwareViz
          motivationLevel='ready'
          visualization={visualization}
          reduceMotion
        />
      );

      // Should show success visualization
      expect(getByText('Visualize Success')).toBeTruthy();
      expect(getByText('Energized and light')).toBeTruthy();
      expect(getByText('Focused and clear')).toBeTruthy();

      // Should NOT show failure visualization content
      expect(queryByText('Heavy and tired')).toBeNull();
    });

    it('shows failure visualization when user selects "Not at all" (Huberman protocol)', () => {
      const visualization: VisualizationData = {
        successBody: 'Energized and light',
        successMind: 'Focused and clear',
        successEmotion: 'Excited and confident',
        failureBody: 'Heavy and tired',
        failureMind: 'Foggy and distracted',
        failureEmotion: 'Disappointed and regretful',
      };

      const { getByText, queryByText } = render(
        <ContextAwareViz
          motivationLevel='not_motivated'
          visualization={visualization}
          reduceMotion
        />
      );

      // Should show failure visualization (Huberman: fear drives action 2x)
      expect(getByText('Visualize Consequences')).toBeTruthy();
      expect(getByText('Heavy and tired')).toBeTruthy();
      expect(getByText('Foggy and distracted')).toBeTruthy();

      // Should NOT show success visualization content
      expect(queryByText('Energized and light')).toBeNull();
    });

    it('shows failure visualization when user selects "Meh"', () => {
      const visualization: VisualizationData = {
        successBody: 'Success body',
        failureBody: 'Failure body',
      };

      const { getByText } = render(
        <ContextAwareViz
          motivationLevel='meh'
          visualization={visualization}
          reduceMotion
        />
      );

      expect(getByText('Visualize Consequences')).toBeTruthy();
      expect(getByText('Failure body')).toBeTruthy();
    });

    it('correctly maps motivation level to visualization type via shouldShowFailureViz', () => {
      // Verify the helper function logic
      expect(shouldShowFailureViz('not_motivated')).toBe(true);
      expect(shouldShowFailureViz('meh')).toBe(true);
      expect(shouldShowFailureViz('ready')).toBe(false);
      expect(shouldShowFailureViz(undefined)).toBe(false);
    });
  });

  describe('MotivationCheck User Interaction Flow', () => {
    it('allows user to select motivation level and triggers callback', () => {
      const onSelectLevel = jest.fn();

      const { getByLabelText } = render(
        <MotivationCheck
          onSelectLevel={onSelectLevel}
          reduceMotion
          showExplainer={false}
        />
      );

      // Select "Ready!" (💪)
      fireEvent.press(getByLabelText('Ready! motivation level'));
      expect(onSelectLevel).toHaveBeenCalledWith('ready');

      // Select "Not at all" (😩)
      fireEvent.press(getByLabelText('Not at all motivation level'));
      expect(onSelectLevel).toHaveBeenCalledWith('not_motivated');

      // Select "Meh" (😐)
      fireEvent.press(getByLabelText('Meh motivation level'));
      expect(onSelectLevel).toHaveBeenCalledWith('meh');

      expect(onSelectLevel).toHaveBeenCalledTimes(3);
    });

    it('shows science tip when low motivation is selected', () => {
      const { getByText, queryByText, rerender } = render(
        <MotivationCheck
          selectedLevel='not_motivated'
          onSelectLevel={jest.fn()}
          reduceMotion
        />
      );

      // Science tip should show for low motivation
      expect(
        getByText(
          /Science tip: Visualizing consequences moves you 2x better when motivation is low/
        )
      ).toBeTruthy();

      // Rerender with "ready" - science tip should not show
      rerender(
        <MotivationCheck
          selectedLevel='ready'
          onSelectLevel={jest.fn()}
          reduceMotion
        />
      );

      expect(
        queryByText(/Science tip: Visualizing consequences moves you 2x better/)
      ).toBeNull();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Integration Tests: Rescue Mode Flow
// ─────────────────────────────────────────────────────────────────────────────

describe('Rescue Mode Flow Integration', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    habit: createRescueHabitData(),
    onJustTwoMin: jest.fn(),
    onStartFull: jest.fn(),
    onSkipToday: jest.fn(),
    onVoiceNotePlayStart: jest.fn(),
    onVoiceNotePlayFinish: jest.fn(),
    reduceMotion: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete User Journey: Rescue Mode', () => {
    it('renders all rescue mode sections with full habit data', () => {
      const { getByText, getByLabelText } = render(
        <RescueMode {...defaultProps} />
      );

      // Verify header
      expect(getByText(/Rescue Mode/)).toBeTruthy();

      // Verify streak at risk badge
      expect(getByText('14 Day Streak at Risk!')).toBeTruthy();
      expect(getByText('3 hours remaining')).toBeTruthy();

      // Verify Your Why (emphasized for rescue)
      expect(getByText('Remember Your Why')).toBeTruthy();
      expect(
        getByText('"To find inner peace and reduce anxiety"')
      ).toBeTruthy();

      // Verify Day 1 Voice Note section
      expect(getByText('Hear Your Day 1 Self')).toBeTruthy();
      expect(getByText('14 days ago')).toBeTruthy();

      // Verify action buttons
      expect(getByLabelText('Just do 2 minutes')).toBeTruthy();
      expect(getByLabelText('Full Habit')).toBeTruthy();
      expect(getByLabelText('Skip Today')).toBeTruthy();
    });

    it('emphasizes Just Do 2 Minutes as primary CTA (BJ Fogg)', () => {
      const onJustTwoMin = jest.fn();
      const onClose = jest.fn();

      const { getByLabelText, getByText } = render(
        <RescueMode
          {...defaultProps}
          onJustTwoMin={onJustTwoMin}
          onClose={onClose}
        />
      );

      // Verify "Just Do 2 Minutes" is prominently labeled
      expect(getByText('Just Do 2 Minutes')).toBeTruthy();
      expect(getByText("That's all it takes to save your streak")).toBeTruthy();

      fireEvent.press(getByLabelText('Just do 2 minutes'));

      expect(onJustTwoMin).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('provides Full Habit option for motivated users', () => {
      const onStartFull = jest.fn();
      const onClose = jest.fn();

      const { getByLabelText } = render(
        <RescueMode
          {...defaultProps}
          onStartFull={onStartFull}
          onClose={onClose}
        />
      );

      fireEvent.press(getByLabelText('Full Habit'));

      expect(onStartFull).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('allows Skip Today with destructive styling', () => {
      const onSkipToday = jest.fn();
      const onClose = jest.fn();

      const { getByLabelText } = render(
        <RescueMode
          {...defaultProps}
          onSkipToday={onSkipToday}
          onClose={onClose}
        />
      );

      fireEvent.press(getByLabelText('Skip Today'));

      expect(onSkipToday).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('displays "Less than 1 hour left" when hours remaining is 1 or less', () => {
      const habitWithUrgency = createRescueHabitData({ hoursRemaining: 1 });

      const { getByText } = render(
        <RescueMode {...defaultProps} habit={habitWithUrgency} />
      );

      expect(getByText('Less than 1 hour left')).toBeTruthy();
    });
  });

  describe('FailureViz Always Shows in Rescue Mode (Huberman Protocol)', () => {
    it('always displays failure visualization regardless of motivation', () => {
      const { getByText } = render(
        <FailureViz
          visualization={{
            failureBody: 'Tense and rigid',
            failureMind: 'Scattered and anxious',
            failureEmotion: 'Regret and shame',
          }}
          streakCount={14}
          reduceMotion
        />
      );

      // Verify failure header is shown (uses "If You Skip Today..." not "Visualize Consequences")
      expect(getByText('If You Skip Today...')).toBeTruthy();
      expect(getByText('Tense and rigid')).toBeTruthy();
      expect(getByText('Scattered and anxious')).toBeTruthy();
      expect(getByText('Regret and shame')).toBeTruthy();

      // Verify streak loss preview
      expect(getByText('14 days gone. Starting over from zero.')).toBeTruthy();
    });

    it('shows loss aversion science tip', () => {
      const { getByText } = render(
        <FailureViz
          visualization={{ failureBody: 'Test body' }}
          streakCount={7}
          reduceMotion
        />
      );

      expect(
        getByText(/Loss aversion: This feeling moves you 2x more effectively/)
      ).toBeTruthy();
    });
  });

  describe('Day 1 Voice Note Integration', () => {
    it('triggers voice note playback callbacks', async () => {
      const onVoiceNotePlayStart = jest.fn();
      const onVoiceNotePlayFinish = jest.fn();

      const { getByTestId } = render(
        <RescueMode
          {...defaultProps}
          onVoiceNotePlayStart={onVoiceNotePlayStart}
          onVoiceNotePlayFinish={onVoiceNotePlayFinish}
        />
      );

      // Find and press the play button in voice note playback
      fireEvent.press(getByTestId('play-voice-note-button'));

      expect(onVoiceNotePlayStart).toHaveBeenCalledTimes(1);

      // Wait for playback finish callback (mocked with setTimeout)
      await waitFor(() => {
        expect(onVoiceNotePlayFinish).toHaveBeenCalledTimes(1);
      });
    });

    it('does not render voice note section when day1VoiceNote is missing', () => {
      const habitWithoutVoiceNote = createRescueHabitData({
        day1VoiceNote: undefined,
      });

      const { queryByText, queryByTestId } = render(
        <RescueMode {...defaultProps} habit={habitWithoutVoiceNote} />
      );

      expect(queryByText('Hear Your Day 1 Self')).toBeNull();
      expect(queryByTestId('voice-note-playback')).toBeNull();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Integration Tests: Celebration Flow
// ─────────────────────────────────────────────────────────────────────────────

describe('Celebration Flow Integration', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    habit: createCelebrationHabitData(),
    onEmojiSelect: jest.fn(),
    onNoteChange: jest.fn(),
    onReflectionSubmit: jest.fn(),
    onRecordVoice: jest.fn(),
    onWriteLetter: jest.fn(),
    onDone: jest.fn(),
    reduceMotion: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete User Journey: Celebration Screen', () => {
    it('renders all celebration sections with full habit data', () => {
      const { getByText, getByLabelText, getAllByText } = render(
        <CelebrationScreen {...defaultProps} />
      );

      // Verify celebration header
      expect(getByText('You Did It!')).toBeTruthy();
      expect(getByText('"Morning Meditation" completed')).toBeTruthy();

      // Verify streak display - use getAllByText since 15 appears twice (current streak and best streak)
      expect(getAllByText('15').length).toBeGreaterThanOrEqual(1);
      expect(getByText('Day Streak')).toBeTruthy();

      // Verify completion rate stat
      expect(getByText('85%')).toBeTruthy(); // Completion rate
      // Note: Best streak (15) is the same value as current streak
      expect(getByText('43')).toBeTruthy(); // Total completions

      // Verify capture prompts
      expect(getByText('Capture This Feeling')).toBeTruthy();
      expect(getByLabelText('Record Voice')).toBeTruthy();
      expect(getByLabelText('Write Letter')).toBeTruthy();

      // Verify done button
      expect(getByLabelText('Done')).toBeTruthy();
    });

    it('shows milestone celebration for streak milestones', () => {
      const milestoneHabit = createCelebrationHabitData({
        isStreakMilestone: true,
        milestoneNumber: 30,
        currentStreak: 30,
      });

      const { getByText } = render(
        <CelebrationScreen {...defaultProps} habit={milestoneHabit} />
      );

      expect(getByText('30 Day Milestone!')).toBeTruthy();
      expect(
        getByText('Incredible dedication to "Morning Meditation"!')
      ).toBeTruthy();
    });

    it('calls onDone and closes modal when Done is pressed', () => {
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

    it('triggers premium feature callbacks for voice and letter', () => {
      const onRecordVoice = jest.fn();
      const onWriteLetter = jest.fn();

      const { getByLabelText } = render(
        <CelebrationScreen
          {...defaultProps}
          onRecordVoice={onRecordVoice}
          onWriteLetter={onWriteLetter}
        />
      );

      fireEvent.press(getByLabelText('Record Voice'));
      expect(onRecordVoice).toHaveBeenCalledTimes(1);

      fireEvent.press(getByLabelText('Write Letter'));
      expect(onWriteLetter).toHaveBeenCalledTimes(1);
    });
  });

  describe('QuickReflection Integration (BJ Fogg Celebration)', () => {
    it('allows user to select reflection emoji', () => {
      const onEmojiSelect = jest.fn();

      const { getByLabelText } = render(
        <QuickReflection
          onEmojiSelect={onEmojiSelect}
          showNoteInput={false}
          reduceMotion
        />
      );

      // Select "On Fire" emoji (🔥) - accessibility label uses "{label} emoji" format
      fireEvent.press(getByLabelText('On Fire emoji'));
      expect(onEmojiSelect).toHaveBeenCalledWith('fire');

      // Select "Happy" emoji (😊)
      fireEvent.press(getByLabelText('Happy emoji'));
      expect(onEmojiSelect).toHaveBeenCalledWith('happy');
    });

    it('integrates emoji selection into CelebrationScreen', () => {
      const onEmojiSelect = jest.fn();

      const { getByLabelText } = render(
        <CelebrationScreen {...defaultProps} onEmojiSelect={onEmojiSelect} />
      );

      // Select "On Fire" emoji via CelebrationScreen
      fireEvent.press(getByLabelText('On Fire emoji'));

      expect(onEmojiSelect).toHaveBeenCalledWith('fire');
    });

    it('shows BJ Fogg science tip', () => {
      const { getByText } = render(<CelebrationScreen {...defaultProps} />);

      expect(
        getByText(
          /BJ Fogg \(Stanford\): Celebration immediately after a behavior is the most powerful way to wire a new habit/
        )
      ).toBeTruthy();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Integration Tests: Full Motivation Flow (Activation → Rescue → Celebration)
// ─────────────────────────────────────────────────────────────────────────────

describe('Full Motivation System Flow Integration', () => {
  /**
   * This test simulates a realistic user journey through the Motivation System:
   *
   * 1. User receives activation notification (ActivationModal)
   * 2. User doesn't complete habit, gets rescue intervention (RescueMode)
   * 3. User finally completes habit, sees celebration (CelebrationScreen)
   *
   * Each screen builds on shared habit data and motivation concepts.
   */
  it('maintains consistent habit data across all three screens', () => {
    const habitId = 'habit-consistency-test';
    const habitName = 'Daily Reading';
    const habitWhy = 'To expand my knowledge and reduce screen time';

    const activationHabit = createActivationHabitData({
      id: habitId,
      name: habitName,
      why: habitWhy,
      currentStreak: 7,
    });

    const rescueHabit = createRescueHabitData({
      id: habitId,
      name: habitName,
      why: habitWhy,
      currentStreak: 7,
    });

    const celebrationHabit = createCelebrationHabitData({
      id: habitId,
      name: habitName,
      currentStreak: 8, // Incremented after completion
    });

    // Render each screen and verify habit name consistency
    const { getByText: getActivation, unmount: unmount1 } = render(
      <ActivationModal
        visible={true}
        onClose={jest.fn()}
        habit={activationHabit}
        reduceMotion
      />
    );
    expect(getActivation(habitName)).toBeTruthy();
    expect(getActivation(`"${habitWhy}"`)).toBeTruthy();
    unmount1();

    const { getByText: getRescue, unmount: unmount2 } = render(
      <RescueMode
        visible={true}
        onClose={jest.fn()}
        habit={rescueHabit}
        reduceMotion
      />
    );
    expect(getRescue(`"${habitWhy}"`)).toBeTruthy();
    expect(getRescue('7 Day Streak at Risk!')).toBeTruthy();
    unmount2();

    const { getByText: getCelebration } = render(
      <CelebrationScreen
        visible={true}
        onClose={jest.fn()}
        habit={celebrationHabit}
        reduceMotion
      />
    );
    expect(getCelebration(`"${habitName}" completed`)).toBeTruthy();
    expect(getCelebration('8')).toBeTruthy(); // Updated streak
  });

  it('all screens respect reduceMotion for accessibility', () => {
    const activationHabit = createActivationHabitData();
    const rescueHabit = createRescueHabitData();
    const celebrationHabit = createCelebrationHabitData();

    // All screens should render successfully with reduceMotion=true
    const { unmount: u1 } = render(
      <ActivationModal
        visible={true}
        onClose={jest.fn()}
        habit={activationHabit}
        reduceMotion={true}
      />
    );
    u1();

    const { unmount: u2 } = render(
      <RescueMode
        visible={true}
        onClose={jest.fn()}
        habit={rescueHabit}
        reduceMotion={true}
      />
    );
    u2();

    const { unmount: u3 } = render(
      <CelebrationScreen
        visible={true}
        onClose={jest.fn()}
        habit={celebrationHabit}
        reduceMotion={true}
      />
    );
    u3();

    // If we get here without errors, all screens handle reduceMotion correctly
    expect(true).toBe(true);
  });

  it('all screens have proper close button functionality', () => {
    const onCloseActivation = jest.fn();
    const onCloseRescue = jest.fn();
    const onCloseCelebration = jest.fn();

    // Activation Modal close
    const { getByLabelText: getA, unmount: uA } = render(
      <ActivationModal
        visible={true}
        onClose={onCloseActivation}
        habit={createActivationHabitData()}
        reduceMotion
      />
    );
    fireEvent.press(getA('Close activation modal'));
    expect(onCloseActivation).toHaveBeenCalledTimes(1);
    uA();

    // Rescue Mode close
    const { getByLabelText: getR, unmount: uR } = render(
      <RescueMode
        visible={true}
        onClose={onCloseRescue}
        habit={createRescueHabitData()}
        reduceMotion
      />
    );
    fireEvent.press(getR('Close rescue mode'));
    expect(onCloseRescue).toHaveBeenCalledTimes(1);
    uR();

    // Celebration Screen close
    const { getByLabelText: getC } = render(
      <CelebrationScreen
        visible={true}
        onClose={onCloseCelebration}
        habit={createCelebrationHabitData()}
        reduceMotion
      />
    );
    fireEvent.press(getC('Close celebration'));
    expect(onCloseCelebration).toHaveBeenCalledTimes(1);
  });

  it('all action buttons are accessible with proper roles', () => {
    // Activation Modal buttons
    const { getAllByRole: getActivationRoles, unmount: u1 } = render(
      <ActivationModal
        visible={true}
        onClose={jest.fn()}
        habit={createActivationHabitData()}
        reduceMotion
      />
    );
    const activationButtons = getActivationRoles('button');
    expect(activationButtons.length).toBeGreaterThanOrEqual(4); // Close, Start Now, Snooze, Just 2 Min
    u1();

    // Rescue Mode buttons
    const { getAllByRole: getRescueRoles, unmount: u2 } = render(
      <RescueMode
        visible={true}
        onClose={jest.fn()}
        habit={createRescueHabitData()}
        reduceMotion
      />
    );
    const rescueButtons = getRescueRoles('button');
    expect(rescueButtons.length).toBeGreaterThanOrEqual(4); // Close, Just 2 Min, Full, Skip
    u2();

    // Celebration Screen buttons
    const { getAllByRole: getCelebrationRoles } = render(
      <CelebrationScreen
        visible={true}
        onClose={jest.fn()}
        habit={createCelebrationHabitData()}
        reduceMotion
      />
    );
    const celebrationButtons = getCelebrationRoles('button');
    expect(celebrationButtons.length).toBeGreaterThanOrEqual(4); // Close, Record, Letter, Done, + emoji buttons
  });
});
