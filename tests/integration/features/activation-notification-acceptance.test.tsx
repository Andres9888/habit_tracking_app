/**
 * Activation Modal at Notification Time - Acceptance Criteria Validation Tests
 *
 * This test suite validates the "Should Have (v1.1)" acceptance criterion:
 * "Activation modal appears at habit notification time"
 *
 * The complete flow being tested:
 * 1. Habit notification is scheduled with correct data (habitId)
 * 2. Notification fires at scheduled time with habit data payload
 * 3. User taps notification → useNotificationResponse extracts habitId
 * 4. App routes habitId to openActivationModalById handler
 * 5. ActivationModal opens with correct habit data
 *
 * Scientific Basis:
 * - Implementation intentions (Gollwitzer, 1999): 2-3x follow-through when prompted at right moment
 * - Context-aware intervention: Showing motivation content when user is primed to act
 *
 * Related Implementation Tasks:
 * - T7.1: ActivationModal component
 * - T7.8: Trigger from notification tap
 */

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { View, Text, Pressable } from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────
// Mock Setup
// ─────────────────────────────────────────────────────────────────────────────

// Mock expo-notifications
const mockScheduleNotificationAsync = jest.fn();
const mockGetAllScheduledNotificationsAsync = jest.fn();
const mockCancelScheduledNotificationAsync = jest.fn();
const mockAddNotificationResponseReceivedListener = jest.fn();
const mockGetLastNotificationResponseAsync = jest.fn();
const mockGetPermissionsAsync = jest.fn();
const mockRequestPermissionsAsync = jest.fn();
const mockSetNotificationChannelAsync = jest.fn();
const mockListenerRemove = jest.fn();

jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: (...args: unknown[]) =>
    mockScheduleNotificationAsync(...args),
  getAllScheduledNotificationsAsync: () =>
    mockGetAllScheduledNotificationsAsync(),
  cancelScheduledNotificationAsync: (...args: unknown[]) =>
    mockCancelScheduledNotificationAsync(...args),
  addNotificationResponseReceivedListener: (handler: unknown) => {
    mockAddNotificationResponseReceivedListener(handler);
    return { remove: mockListenerRemove };
  },
  getLastNotificationResponseAsync: () =>
    mockGetLastNotificationResponseAsync(),
  getPermissionsAsync: () => mockGetPermissionsAsync(),
  requestPermissionsAsync: () => mockRequestPermissionsAsync(),
  setNotificationChannelAsync: (...args: unknown[]) =>
    mockSetNotificationChannelAsync(...args),
  setNotificationHandler: jest.fn(),
  AndroidImportance: {
    HIGH: 4,
  },
  SchedulableTriggerInputTypes: {
    DAILY: 'daily',
    DATE: 'date',
  },
}));

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

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');
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

// Mock the Modal component
jest.mock('../../../src/components/Modal', () => ({
  Modal: ({ children, visible, onClose }: unknown) =>
    visible ? <>{children}</> : null,
}));

// Mock the motion constants
jest.mock('../../../src/constants/motion', () => ({
  Springs: {
    sheet: { damping: 32, stiffness: 180, mass: 1.3 },
    gentle: { damping: 28, stiffness: 180, mass: 1.2 },
    button: { damping: 15, stiffness: 300 },
    bouncy: { damping: 8, stiffness: 300 },
  },
}));

// ─────────────────────────────────────────────────────────────────────────────
// Component Imports
// ─────────────────────────────────────────────────────────────────────────────

import {
  ActivationModal,
  type ActivationHabitData,
} from '../../../src/components/MotivationSystem/Activation/ActivationModal';
import { useNotificationResponse } from '../../../src/hooks/useNotificationResponse';
import {
  scheduleHabitReminder,
  cancelHabitReminder,
} from '../../../src/utils/notifications';
import type { NotificationResponse } from 'expo-notifications';
import { renderHook } from '@testing-library/react-native';

// ─────────────────────────────────────────────────────────────────────────────
// Test Data
// ─────────────────────────────────────────────────────────────────────────────

const mockHabit: ActivationHabitData = {
  id: 'habit-morning-run',
  name: 'Morning Run',
  icon: '🏃',
  currentStreak: 14,
  totalCompletions: 56,
  why: 'To be healthy and have energy for my kids',
  woopObstacle: 'Feeling tired when alarm goes off',
  woopPlan: 'Put running shoes by the bed',
  cueTime: '6:30 AM',
  cueLocation: 'Bedroom',
  cueAfterBehavior: 'After brushing teeth',
  vizSuccessBody: 'Energized, light, powerful',
  vizSuccessMind: 'Clear, focused, proud',
  vizSuccessEmotion: 'Joyful, accomplished',
  vizFailureBody: 'Heavy, sluggish, tired',
  vizFailureMind: 'Foggy, full of excuses',
  vizFailureEmotion: 'Disappointed, regretful',
};

/**
 * Helper to create a mock notification response
 */
function createMockNotificationResponse(habitId: string): NotificationResponse {
  return {
    notification: {
      request: {
        content: {
          data: { habitId },
          title: `Time for your habit!`,
          body: 'Morning Run',
          sound: 'default',
          badge: null,
          subtitle: null,
          launchImageName: null,
          attachments: [],
          summaryArgument: null,
          summaryArgumentCount: 0,
          categoryIdentifier: null,
          threadIdentifier: null,
          targetContentIdentifier: null,
        },
        identifier: `notification-${habitId}`,
        trigger: {
          type: 'daily',
          repeats: true,
        } as unknown,
      },
      date: Date.now(),
    },
    actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Notification Scheduling with Correct Data
// ─────────────────────────────────────────────────────────────────────────────

describe('1. Notification Scheduling with Correct Habit Data', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetPermissionsAsync.mockResolvedValue({ granted: true });
    mockRequestPermissionsAsync.mockResolvedValue({ granted: true });
    mockGetAllScheduledNotificationsAsync.mockResolvedValue([]);
    mockScheduleNotificationAsync.mockResolvedValue('notification-id-123');
  });

  it('schedules notification with habitId in data payload', async () => {
    const reminderTime = new Date();
    reminderTime.setHours(7, 0, 0, 0);

    await scheduleHabitReminder({
      habitId: 'habit-morning-run',
      title: 'Time for Morning Run!',
      body: 'Start your day right',
      reminderTime,
    });

    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(1);
    const [scheduleCall] = mockScheduleNotificationAsync.mock.calls[0];

    // Verify habitId is in the notification data
    expect(scheduleCall.content.data).toEqual({
      habitId: 'habit-morning-run',
    });
  });

  it('schedules notification with correct title and body', async () => {
    const reminderTime = new Date();
    reminderTime.setHours(6, 30, 0, 0);

    await scheduleHabitReminder({
      habitId: 'habit-123',
      title: 'Time for Morning Run!',
      body: '🏃 Build your streak',
      reminderTime,
    });

    const [scheduleCall] = mockScheduleNotificationAsync.mock.calls[0];

    expect(scheduleCall.content.title).toBe('Time for Morning Run!');
    expect(scheduleCall.content.body).toBe('🏃 Build your streak');
  });

  it('schedules notification at correct time', async () => {
    const reminderTime = new Date();
    reminderTime.setHours(6, 30, 0, 0);

    await scheduleHabitReminder({
      habitId: 'habit-123',
      title: 'Habit Reminder',
      body: 'Time to build',
      reminderTime,
    });

    const [scheduleCall] = mockScheduleNotificationAsync.mock.calls[0];

    expect(scheduleCall.trigger.hour).toBe(6);
    expect(scheduleCall.trigger.minute).toBe(30);
    expect(scheduleCall.trigger.type).toBe('daily');
  });

  it('cancels existing notifications before scheduling new one', async () => {
    // Simulate existing notification
    mockGetAllScheduledNotificationsAsync.mockResolvedValue([
      {
        identifier: 'old-notification-123',
        content: { data: { habitId: 'habit-morning-run' } },
      },
    ]);

    const reminderTime = new Date();
    await scheduleHabitReminder({
      habitId: 'habit-morning-run',
      title: 'Reminder',
      body: 'Do it!',
      reminderTime,
    });

    // Should cancel the old notification
    expect(mockCancelScheduledNotificationAsync).toHaveBeenCalledWith(
      'old-notification-123'
    );
    // Then schedule the new one
    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(1);
  });

  it('returns false when permissions are denied', async () => {
    mockGetPermissionsAsync.mockResolvedValue({ granted: false });
    mockRequestPermissionsAsync.mockResolvedValue({ granted: false });

    const result = await scheduleHabitReminder({
      habitId: 'habit-123',
      title: 'Reminder',
      body: 'Do it!',
      reminderTime: new Date(),
    });

    expect(result).toBe(false);
    expect(mockScheduleNotificationAsync).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Notification Response Handler (useNotificationResponse)
// ─────────────────────────────────────────────────────────────────────────────

describe('2. Notification Response Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetLastNotificationResponseAsync.mockResolvedValue(null);
  });

  it('sets up listener on mount', () => {
    const onHabitNotificationTap = jest.fn();
    renderHook(() => useNotificationResponse({ onHabitNotificationTap }));

    expect(mockAddNotificationResponseReceivedListener).toHaveBeenCalledTimes(
      1
    );
    expect(mockAddNotificationResponseReceivedListener).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });

  it('removes listener on unmount', () => {
    const onHabitNotificationTap = jest.fn();
    const { unmount } = renderHook(() =>
      useNotificationResponse({ onHabitNotificationTap })
    );

    unmount();

    expect(mockListenerRemove).toHaveBeenCalledTimes(1);
  });

  it('extracts habitId from notification data and calls handler', () => {
    const onHabitNotificationTap = jest.fn();
    const { result } = renderHook(() =>
      useNotificationResponse({ onHabitNotificationTap })
    );

    const mockResponse = createMockNotificationResponse('habit-morning-run');

    act(() => {
      result.current._triggerResponse(mockResponse);
    });

    expect(onHabitNotificationTap).toHaveBeenCalledTimes(1);
    expect(onHabitNotificationTap).toHaveBeenCalledWith('habit-morning-run');
  });

  it('handles cold start notification (app launched from notification)', async () => {
    const mockResponse = createMockNotificationResponse('habit-cold-start');
    mockGetLastNotificationResponseAsync.mockResolvedValue(mockResponse);

    const onHabitNotificationTap = jest.fn();
    renderHook(() => useNotificationResponse({ onHabitNotificationTap }));

    await waitFor(() => {
      expect(onHabitNotificationTap).toHaveBeenCalledWith('habit-cold-start');
    });
  });

  it('ignores notifications without habitId', () => {
    const onHabitNotificationTap = jest.fn();
    const { result } = renderHook(() =>
      useNotificationResponse({ onHabitNotificationTap })
    );

    const mockResponse: NotificationResponse = {
      notification: {
        request: {
          content: {
            data: { someOtherKey: 'value' }, // No habitId
            title: 'Generic notification',
            body: null,
            sound: 'default',
            badge: null,
            subtitle: null,
            launchImageName: null,
            attachments: [],
            summaryArgument: null,
            summaryArgumentCount: 0,
            categoryIdentifier: null,
            threadIdentifier: null,
            targetContentIdentifier: null,
          },
          identifier: 'notification-1',
          trigger: { type: 'push', payload: {} } as unknown,
        },
        date: Date.now(),
      },
      actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
    };

    act(() => {
      result.current._triggerResponse(mockResponse);
    });

    expect(onHabitNotificationTap).not.toHaveBeenCalled();
  });

  it('ignores notifications with empty habitId', () => {
    const onHabitNotificationTap = jest.fn();
    const { result } = renderHook(() =>
      useNotificationResponse({ onHabitNotificationTap })
    );

    const mockResponse: NotificationResponse = {
      notification: {
        request: {
          content: {
            data: { habitId: '' },
            title: null,
            body: null,
            sound: 'default',
            badge: null,
            subtitle: null,
            launchImageName: null,
            attachments: [],
            summaryArgument: null,
            summaryArgumentCount: 0,
            categoryIdentifier: null,
            threadIdentifier: null,
            targetContentIdentifier: null,
          },
          identifier: 'notification-1',
          trigger: { type: 'push', payload: {} } as unknown,
        },
        date: Date.now(),
      },
      actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
    };

    act(() => {
      result.current._triggerResponse(mockResponse);
    });

    expect(onHabitNotificationTap).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. ActivationModal Display with Habit Data
// ─────────────────────────────────────────────────────────────────────────────

describe('3. ActivationModal Display with Habit Data', () => {
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

  it('displays when visible is true with habit data', () => {
    const { getByText } = render(<ActivationModal {...defaultProps} />);

    expect(getByText('Time to Build')).toBeTruthy();
    expect(getByText('Morning Run')).toBeTruthy();
  });

  it('displays habit icon', () => {
    const { getByText } = render(<ActivationModal {...defaultProps} />);

    expect(getByText('🏃')).toBeTruthy();
  });

  it('displays current streak', () => {
    const { getByText } = render(<ActivationModal {...defaultProps} />);

    expect(getByText('14 day streak')).toBeTruthy();
  });

  it('displays total completions', () => {
    const { getByText } = render(<ActivationModal {...defaultProps} />);

    expect(getByText('56 total')).toBeTruthy();
  });

  it('displays Your Why section', () => {
    const { getByText } = render(<ActivationModal {...defaultProps} />);

    expect(getByText('Your Why')).toBeTruthy();
    expect(
      getByText('"To be healthy and have energy for my kids"')
    ).toBeTruthy();
  });

  it('displays WOOP IF-THEN plan', () => {
    const { getByText } = render(<ActivationModal {...defaultProps} />);

    expect(getByText('Your Plan')).toBeTruthy();
    expect(getByText(/Feeling tired when alarm goes off/)).toBeTruthy();
    expect(getByText(/Put running shoes by the bed/)).toBeTruthy();
  });

  it('displays Cue/Trigger information', () => {
    const { getByText, queryByText } = render(
      <ActivationModal {...defaultProps} />
    );

    expect(getByText('Your Cue')).toBeTruthy();
    expect(queryByText(/6:30 AM/)).toBeTruthy();
    expect(queryByText(/Bedroom/)).toBeTruthy();
    expect(queryByText(/After brushing teeth/)).toBeTruthy();
  });

  it('provides Start Now primary action', () => {
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

  it('provides Snooze quick action', () => {
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

  it('provides Just 2 Min quick action (Tiny Habits principle)', () => {
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

  it('allows closing modal via close button', () => {
    const onClose = jest.fn();
    const { getByLabelText } = render(
      <ActivationModal {...defaultProps} onClose={onClose} />
    );

    fireEvent.press(getByLabelText('Close activation modal'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Complete Flow: Notification → Handler → Modal
// ─────────────────────────────────────────────────────────────────────────────

describe('4. Complete Flow: Notification to Modal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetLastNotificationResponseAsync.mockResolvedValue(null);
  });

  it('complete flow: notification tap → handler → opens modal with habit', async () => {
    // Simulate the app state that would manage the modal
    let modalVisible = false;
    let activationHabitId: string | null = null;

    const openActivationModalById = (habitId: string) => {
      modalVisible = true;
      activationHabitId = habitId;
    };

    // Set up notification response handler
    const { result } = renderHook(() =>
      useNotificationResponse({
        onHabitNotificationTap: openActivationModalById,
      })
    );

    // Simulate notification tap
    const mockResponse = createMockNotificationResponse('habit-morning-run');

    act(() => {
      result.current._triggerResponse(mockResponse);
    });

    // Verify handler was called and state updated
    expect(activationHabitId).toBe('habit-morning-run');
    expect(modalVisible).toBe(true);
  });

  it('maintains correct habit data through the flow', () => {
    // Track what habit data is passed to the modal
    let receivedHabitId: string | null = null;

    const { result } = renderHook(() =>
      useNotificationResponse({
        onHabitNotificationTap: (habitId) => {
          receivedHabitId = habitId;
        },
      })
    );

    // Simulate notification with specific habitId
    const mockResponse = createMockNotificationResponse('habit-meditation');

    act(() => {
      result.current._triggerResponse(mockResponse);
    });

    // Verify the habitId is preserved through the handler
    expect(receivedHabitId).toBe('habit-meditation');

    // In the actual app, this habitId would be used to fetch full habit data
    // and pass it to ActivationModal
  });

  it('handles multiple sequential notification taps', () => {
    const receivedHabitIds: string[] = [];

    const { result } = renderHook(() =>
      useNotificationResponse({
        onHabitNotificationTap: (habitId) => {
          receivedHabitIds.push(habitId);
        },
      })
    );

    // First notification tap
    act(() => {
      result.current._triggerResponse(
        createMockNotificationResponse('habit-1')
      );
    });

    // Second notification tap
    act(() => {
      result.current._triggerResponse(
        createMockNotificationResponse('habit-2')
      );
    });

    expect(receivedHabitIds).toEqual(['habit-1', 'habit-2']);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. Edge Cases and Error Handling
// ─────────────────────────────────────────────────────────────────────────────

describe('5. Edge Cases and Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ActivationModal handles minimal habit data gracefully', () => {
    const minimalHabit: ActivationHabitData = {
      id: 'habit-minimal',
      name: 'Quick Habit',
    };

    const { getByText, queryByText } = render(
      <ActivationModal
        visible={true}
        onClose={jest.fn()}
        habit={minimalHabit}
      />
    );

    expect(getByText('Quick Habit')).toBeTruthy();
    expect(getByText('✨')).toBeTruthy(); // Default icon
    expect(queryByText('Your Why')).toBeNull();
    expect(queryByText('Your Plan')).toBeNull();
    expect(queryByText('Your Cue')).toBeNull();
  });

  it('ActivationModal does not render when habit is null', () => {
    const { queryByText } = render(
      <ActivationModal visible={true} onClose={jest.fn()} habit={null} />
    );

    expect(queryByText('Time to Build')).toBeNull();
  });

  it('ActivationModal does not render when visible is false', () => {
    const { queryByText } = render(
      <ActivationModal visible={false} onClose={jest.fn()} habit={mockHabit} />
    );

    expect(queryByText('Time to Build')).toBeNull();
  });

  it('notification handler ignores null data payload', () => {
    const onHabitNotificationTap = jest.fn();
    const { result } = renderHook(() =>
      useNotificationResponse({ onHabitNotificationTap })
    );

    const mockResponse: NotificationResponse = {
      notification: {
        request: {
          content: {
            data: null as unknown,
            title: null,
            body: null,
            sound: 'default',
            badge: null,
            subtitle: null,
            launchImageName: null,
            attachments: [],
            summaryArgument: null,
            summaryArgumentCount: 0,
            categoryIdentifier: null,
            threadIdentifier: null,
            targetContentIdentifier: null,
          },
          identifier: 'notification-1',
          trigger: { type: 'push', payload: {} } as unknown,
        },
        date: Date.now(),
      },
      actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
    };

    act(() => {
      result.current._triggerResponse(mockResponse);
    });

    expect(onHabitNotificationTap).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. Accessibility Compliance
// ─────────────────────────────────────────────────────────────────────────────

describe('6. Accessibility Compliance', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    habit: mockHabit,
    onStartNow: jest.fn(),
    onSnooze: jest.fn(),
    onJustTwoMin: jest.fn(),
  };

  it('all buttons have accessible labels', () => {
    const { getByLabelText } = render(<ActivationModal {...defaultProps} />);

    expect(getByLabelText('Start habit now')).toBeTruthy();
    expect(getByLabelText('Snooze')).toBeTruthy();
    expect(getByLabelText('Just 2 Min')).toBeTruthy();
    expect(getByLabelText('Close activation modal')).toBeTruthy();
  });

  it('all buttons have button role', () => {
    const { getAllByRole } = render(<ActivationModal {...defaultProps} />);

    const buttons = getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });

  it('supports reduceMotion prop for accessibility', () => {
    const { getByText } = render(
      <ActivationModal {...defaultProps} reduceMotion={true} />
    );

    // Modal should render correctly with animations disabled
    expect(getByText('Time to Build')).toBeTruthy();
    expect(getByText('Morning Run')).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. Scientific Basis Validation
// ─────────────────────────────────────────────────────────────────────────────

describe('7. Scientific Basis Validation', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    habit: mockHabit,
  };

  it('implements Implementation Intentions (Gollwitzer): shows IF-THEN plan', () => {
    const { getByText } = render(<ActivationModal {...defaultProps} />);

    // Implementation intentions show the IF-THEN structure
    expect(getByText('Your Plan')).toBeTruthy();
    expect(getByText(/If/)).toBeTruthy();
    expect(getByText(/then/)).toBeTruthy();
  });

  it('implements Tiny Habits (BJ Fogg): provides "Just 2 Min" option', () => {
    const { getByText } = render(<ActivationModal {...defaultProps} />);

    // "Just 2 Min" reduces activation energy per BJ Fogg's research
    expect(getByText('Just 2 Min')).toBeTruthy();
  });

  it('implements Habit Loop (Duhigg): displays cue/trigger', () => {
    const { getByText, queryByText } = render(
      <ActivationModal {...defaultProps} />
    );

    // Cue is the first part of Duhigg's Habit Loop (Cue → Routine → Reward)
    expect(getByText('Your Cue')).toBeTruthy();
    expect(queryByText(/6:30 AM/)).toBeTruthy();
    expect(queryByText(/Bedroom/)).toBeTruthy();
  });

  it('implements Self-Determination Theory: shows intrinsic motivation (Why)', () => {
    const { getByText } = render(<ActivationModal {...defaultProps} />);

    // "Your Why" connects to intrinsic motivation (Deci & Ryan's SDT)
    expect(getByText('Your Why')).toBeTruthy();
    expect(
      getByText('"To be healthy and have energy for my kids"')
    ).toBeTruthy();
  });
});
