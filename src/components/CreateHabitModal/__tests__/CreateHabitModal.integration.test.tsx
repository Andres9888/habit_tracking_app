/**
 * Integration coverage for the current centered create-habit flow.
 *
 * These tests intentionally exercise the modal through its public controls:
 * name validation, icon/color customization, reminders, advanced options,
 * create submission, and edit-mode persistence.
 */

import React from 'react';
import {
  act,
  fireEvent,
  render,
  type RenderAPI,
} from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import type { HabitDoc } from '../types';

const mockCreateHabit = jest.fn(() => Promise.resolve('new-habit-id'));
const mockUpdateHabit = jest.fn(() => Promise.resolve());
const mockEnsureNotificationPermissions = jest.fn(() => Promise.resolve(true));
const mockScheduleHabitReminder = jest.fn(() => Promise.resolve(true));
const mockCancelHabitReminder = jest.fn(() => Promise.resolve());
const mockGetPermissionsAsync = jest.fn(() =>
  Promise.resolve({ status: 'granted' })
);
const mockTriggerWarning = jest.fn();
const mockTriggerSelection = jest.fn();
const mockTriggerSuccess = jest.fn();

jest.mock('convex/react', () => ({
  useMutation: (mutation: string) =>
    mutation === 'habits:update' ? mockUpdateHabit : mockCreateHabit,
  useQuery: () => undefined,
}));

jest.mock('../../../../convex/_generated/api', () => ({
  api: {
    habits: {
      create: 'habits:create',
      list: 'habits:list',
      update: 'habits:update',
    },
    settings: {
      get: 'settings:get',
    },
    templates: {
      list: 'templates:list',
    },
  },
}));

jest.mock('expo-notifications', () => ({
  getPermissionsAsync: () => mockGetPermissionsAsync(),
}));

jest.mock('../../../utils/notifications', () => {
  const format12Hour = (date: Date) => {
    const hour = date.getHours();
    const minute = String(date.getMinutes()).padStart(2, '0');
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute} ${suffix}`;
  };

  return {
    cancelHabitReminder: (...args: unknown[]) =>
      mockCancelHabitReminder(...args),
    createDateFromTimeString: (timeString?: string, defaultDate?: Date) => {
      const date = new Date(defaultDate ?? new Date(2026, 0, 15, 14, 0));
      if (timeString) {
        const [hour, minute] = timeString.split(':').map(Number);
        date.setHours(hour, minute, 0, 0);
      }
      return date;
    },
    ensureNotificationPermissions: () => mockEnsureNotificationPermissions(),
    formatReminderTime: format12Hour,
    formatReminderTime24: (date: Date) =>
      `${String(date.getHours()).padStart(2, '0')}:${String(
        date.getMinutes()
      ).padStart(2, '0')}`,
    getDefaultReminderTime: () => new Date(2026, 0, 15, 14, 0),
    scheduleHabitReminder: (...args: unknown[]) =>
      mockScheduleHabitReminder(...args),
  };
});

jest.mock(
  '../../../hooks/useStreakReminders/useStreakReminderSettings',
  () => ({
    markFirstHabitCreated: jest.fn(() => Promise.resolve()),
  })
);

jest.mock('../../../hooks/useProgressEmojis', () => {
  const defaults = {
    automatic: '💎',
    building: '🥈',
    developing: '🥇',
    starting: '🥉',
    strong: '🏆',
  };

  return {
    useUserCustomProgressEmojis: () => undefined,
    useUserDefaultProgressEmojis: () => defaults,
  };
});

jest.mock('../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: () => ({
    triggerImpact: jest.fn(),
    triggerNotification: jest.fn(),
    triggerSelection: mockTriggerSelection,
    triggerSuccess: mockTriggerSuccess,
    triggerWarning: mockTriggerWarning,
  }),
}));

jest.mock('../../../hooks/useReduceMotion', () => ({
  __esModule: true,
  default: () => false,
  useReduceMotion: () => false,
}));

jest.mock('react-native-reanimated', () => {
  const { Text, View } = require('react-native');
  const reanimatedMock = jest.requireActual('react-native-reanimated/mock');

  return {
    ...reanimatedMock,
    FadeIn: { duration: () => ({ delay: () => ({}) }) },
    FadeInUp: { duration: () => ({ delay: () => ({}) }) },
    FadeOut: { duration: () => ({}) },
    LinearTransition: {
      duration: () => ({}),
      springify: () => ({
        damping: () => ({
          stiffness: () => ({}),
        }),
      }),
    },
    addWhitelistedNativeProps: jest.fn(),
    default: {
      View,
      Text,
      addWhitelistedNativeProps: jest.fn(),
      createAnimatedComponent: (Component: React.ComponentType<unknown>) =>
        Component,
    },
  };
});

jest.mock('../../EmojiPickerV2', () => {
  const { Pressable, Text, View } = require('react-native');

  return {
    EmojiPickerSheet: ({
      onClose,
      onSelect,
      visible,
    }: {
      onClose: () => void;
      onSelect: (emoji: string | null) => void;
      visible: boolean;
    }) =>
      visible ? (
        <View testID='emoji-picker-sheet'>
          <Pressable
            accessibilityLabel='Choose rocket emoji'
            onPress={() => onSelect('🚀')}
          >
            <Text>🚀</Text>
          </Pressable>
          <Pressable accessibilityLabel='Close emoji picker' onPress={onClose}>
            <Text>Close picker</Text>
          </Pressable>
        </View>
      ) : null,
  };
});

jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return { LinearGradient: View };
});

jest.mock('reanimated-color-picker', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    BrightnessSlider: View,
    Preview: View,
    default: View,
  };
});

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ bottom: 0, left: 0, right: 0, top: 0 }),
}));

jest.mock('@react-native-community/datetimepicker', () => {
  return jest.fn(() => null);
});

jest
  .spyOn(AccessibilityInfo, 'announceForAccessibility')
  .mockImplementation(jest.fn());

import CreateHabitModal from '../CreateHabitModalCentered';

const mockOnClose = jest.fn();
const defaultProps = {
  onClose: mockOnClose,
  visible: true,
};

const renderModal = (
  props: Partial<React.ComponentProps<typeof CreateHabitModal>> = {}
) => render(<CreateHabitModal {...defaultProps} {...props} />);

const getCreateButton = (screen: RenderAPI) =>
  screen.getByLabelText('Create Habit');

const enterName = (screen: RenderAPI, name: string) => {
  fireEvent.changeText(screen.getByLabelText('Habit name'), name);
};

const flushAsyncPress = async (element: ReactTestInstance) => {
  await act(async () => {
    fireEvent.press(element);
    await Promise.resolve();
    await Promise.resolve();
  });
};

describe('CreateHabitModalCentered integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 0, 15, 12, 30));
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('current centered form', () => {
    it('renders the current customization sections without legacy quick picks', () => {
      const screen = renderModal();

      expect(screen.getByText('Name your new habit')).toBeTruthy();
      expect(screen.getByText('Choose an icon')).toBeTruthy();
      expect(screen.getByText('Pick a color')).toBeTruthy();
      expect(screen.getByText('Daily Reminder')).toBeTruthy();
      expect(screen.getByText('More to customize')).toBeTruthy();
      expect(screen.queryByText(/Quick pick/i)).toBeNull();
    });

    it('closes from the header action', () => {
      const screen = renderModal();

      fireEvent.press(screen.getByLabelText('Close'));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('starts with an unavailable create action and a useful hint', () => {
      const screen = renderModal();
      const createButton = getCreateButton(screen);

      expect(createButton.props.accessibilityState).toEqual(
        expect.objectContaining({ disabled: true })
      );
      expect(createButton.props.accessibilityHint).toBe(
        'Enter a habit name first'
      );
    });

    it('exposes the primary customization controls accessibly', () => {
      const screen = renderModal();

      expect(screen.getByLabelText('Browse more emojis')).toBeTruthy();
      expect(screen.getByLabelText('Enable reminder')).toBeTruthy();
      expect(
        screen.getByLabelText('More to customize, 3 options').props
          .accessibilityState
      ).toEqual({ expanded: false });
    });
  });

  describe('name entry and validation', () => {
    it('enables creation for a one-character non-whitespace name', () => {
      const screen = renderModal();

      enterName(screen, 'R');

      expect(getCreateButton(screen).props.accessibilityState.disabled).toBe(
        false
      );
    });

    it('keeps creation unavailable for whitespace-only input', () => {
      const screen = renderModal();

      enterName(screen, '   ');

      expect(getCreateButton(screen).props.accessibilityState.disabled).toBe(
        true
      );
    });

    it('keeps the controlled input synchronized with typed text', () => {
      const screen = renderModal();
      const input = screen.getByLabelText('Habit name');

      fireEvent.changeText(input, 'Morning walk');

      expect(screen.getByLabelText('Habit name').props.value).toBe(
        'Morning walk'
      );
      expect(screen.getByLabelText('Habit name').props.maxLength).toBe(50);
    });

    it('shows a name error and warning feedback after an invalid save press', () => {
      const screen = renderModal();

      fireEvent.press(getCreateButton(screen));

      expect(screen.getByRole('alert').props.children).toBe(
        'Give your habit a name'
      );
      expect(mockTriggerWarning).toHaveBeenCalledTimes(1);
    });

    it('clears the visible name error as soon as valid text is entered', () => {
      const screen = renderModal();
      fireEvent.press(getCreateButton(screen));

      enterName(screen, 'Read');

      expect(screen.queryByText('Give your habit a name')).toBeNull();
    });
  });

  describe('icon and color customization', () => {
    it('shows nine default icon suggestions with none selected', () => {
      const screen = renderModal();
      const iconButtons = screen.getAllByLabelText(/^Select emoji /);

      expect(iconButtons).toHaveLength(9);
      expect(
        iconButtons.every(
          (button) => button.props.accessibilityState.selected === false
        )
      ).toBe(true);
    });

    it('selects an icon and announces the change', () => {
      const screen = renderModal();

      fireEvent.press(screen.getByLabelText('Select emoji 📖'));

      expect(
        screen.getByLabelText('Select emoji 📖').props.accessibilityState
          .selected
      ).toBe(true);
      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
        'Selected emoji 📖'
      );
    });

    it('keeps a chosen icon locked while the committed name changes', () => {
      const screen = renderModal();
      const input = screen.getByLabelText('Habit name');
      fireEvent.press(screen.getByLabelText('Select emoji 📖'));

      fireEvent.changeText(input, 'Morning workout');
      fireEvent(input, 'blur');
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(
        screen.getByLabelText('Select emoji 📖').props.accessibilityState
          .selected
      ).toBe(true);
      expect(screen.queryByLabelText('Select emoji 🏋️')).toBeNull();
    });

    it('accepts an icon selected from the full picker sheet', () => {
      const screen = renderModal();

      fireEvent.press(screen.getByLabelText('Browse more emojis'));
      expect(screen.getByTestId('emoji-picker-sheet')).toBeTruthy();
      fireEvent.press(screen.getByLabelText('Choose rocket emoji'));

      expect(
        screen.getByLabelText('Select emoji 🚀').props.accessibilityState
          .selected
      ).toBe(true);
    });

    it('moves color selection from the default emerald to teal', () => {
      const screen = renderModal();

      expect(
        screen.getByTestId('color-swatch-10B981').props.accessibilityState
          .selected
      ).toBe(true);
      fireEvent.press(screen.getByTestId('color-swatch-14B8A6'));

      expect(
        screen.getByTestId('color-swatch-10B981').props.accessibilityState
          .selected
      ).toBe(false);
      expect(
        screen.getByTestId('color-swatch-14B8A6').props.accessibilityState
          .selected
      ).toBe(true);
    });
  });

  describe('daily reminder flow', () => {
    it('starts disabled with reminder-time controls collapsed', () => {
      const screen = renderModal();

      expect(screen.getByTestId('reminder-toggle').props.value).toBe(false);
      expect(screen.queryByTestId('preset-buttons')).toBeNull();
      expect(screen.queryByTestId('custom-time-button')).toBeNull();
    });

    it('enables reminders and reveals all three presets', async () => {
      const screen = renderModal();

      await flushAsyncPress(screen.getByLabelText('Enable reminder'));

      expect(screen.getByTestId('reminder-toggle').props.value).toBe(true);
      expect(screen.getByTestId('preset-morning')).toBeTruthy();
      expect(screen.getByTestId('preset-midday')).toBeTruthy();
      expect(screen.getByTestId('preset-evening')).toBeTruthy();
      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
        'Reminders enabled'
      );
    });

    it('snaps the untouched fallback time to the nearest visible preset', async () => {
      const screen = renderModal();

      await flushAsyncPress(screen.getByLabelText('Enable reminder'));

      expect(
        screen.getByTestId('preset-midday').props.accessibilityState.selected
      ).toBe(true);
      expect(
        screen.getByTestId('preset-morning').props.accessibilityState.selected
      ).toBe(false);
    });

    it('selects a morning reminder and announces it', async () => {
      const screen = renderModal();
      await flushAsyncPress(screen.getByLabelText('Enable reminder'));

      fireEvent.press(screen.getByTestId('preset-morning'));

      expect(
        screen.getByTestId('preset-morning').props.accessibilityState.selected
      ).toBe(true);
      expect(
        screen.getByTestId('preset-midday').props.accessibilityState.selected
      ).toBe(false);
      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
        'Reminder set for Morning'
      );
    });

    it('shows the inline permission warning when system access is denied', async () => {
      mockGetPermissionsAsync.mockResolvedValueOnce({ status: 'denied' });
      const screen = renderModal();

      await flushAsyncPress(screen.getByLabelText('Enable reminder'));

      expect(
        screen.getByLabelText(
          'Notifications are disabled. Tap to open Settings.'
        )
      ).toBeTruthy();
    });

    it('disables reminders and collapses their controls again', async () => {
      const screen = renderModal();
      await flushAsyncPress(screen.getByLabelText('Enable reminder'));

      await flushAsyncPress(screen.getByLabelText('Disable reminder'));

      expect(screen.getByTestId('reminder-toggle').props.value).toBe(false);
      expect(screen.queryByTestId('preset-buttons')).toBeNull();
      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
        'Reminders disabled'
      );
    });
  });

  describe('advanced options integration', () => {
    it('summarizes the current defaults while collapsed', () => {
      const screen = renderModal();

      expect(screen.getByText('No goal set')).toBeTruthy();
      expect(screen.getByText('Average')).toBeTruthy();
      expect(screen.getByText('Ranks')).toBeTruthy();
      expect(
        screen.getByLabelText('More to customize, 3 options').props
          .accessibilityState.expanded
      ).toBe(false);
    });

    it('expands into streak, strength, and growth-icon controls', () => {
      const screen = renderModal();

      fireEvent.press(screen.getByLabelText('More to customize, 3 options'));

      expect(screen.getByLabelText('No streak goal')).toBeTruthy();
      expect(
        screen.getByLabelText(/Strength Curve, Growth rate, Average/)
      ).toBeTruthy();
      expect(screen.getByText('Growth Icons')).toBeTruthy();
    });

    it('persists a seven-day streak goal into the collapsed summary', () => {
      const screen = renderModal();
      fireEvent.press(screen.getByLabelText('More to customize, 3 options'));

      fireEvent.press(screen.getByLabelText('7 day streak goal, STARTER'));
      fireEvent.press(screen.getByLabelText('More to customize, 3 options'));

      expect(screen.getByText('7-day')).toBeTruthy();
    });

    it('changes the strength curve from average to complex', () => {
      const screen = renderModal();
      fireEvent.press(screen.getByLabelText('More to customize, 3 options'));
      fireEvent.press(
        screen.getByLabelText(/Strength Curve, Growth rate, Average/)
      );
      const curveOptions = screen.getAllByRole('radio');

      expect(curveOptions).toHaveLength(3);
      expect(curveOptions[1].props.accessibilityState.checked).toBe(true);
      fireEvent.press(curveOptions[2]);

      expect(
        screen.getByLabelText(
          'Strength Curve, Growth rate, Complex · +1% per check-in'
        )
      ).toBeTruthy();
    });
  });

  describe('create and edit persistence', () => {
    it('creates a trimmed habit with current default settings', async () => {
      const screen = renderModal();
      enterName(screen, '  Read daily  ');

      await flushAsyncPress(getCreateButton(screen));

      expect(mockCreateHabit).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: undefined,
          iconColor: '#10B981',
          name: 'Read daily',
          remindersEnabled: false,
          reminderTime: undefined,
          strengthAlgorithm: 'balanced',
        })
      );
      expect(mockScheduleHabitReminder).not.toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('persists the selected icon and color in the create payload', async () => {
      const screen = renderModal();
      enterName(screen, 'Deep work');
      fireEvent.press(screen.getByLabelText('Select emoji 🎯'));
      fireEvent.press(screen.getByTestId('color-swatch-8B5CF6'));

      await flushAsyncPress(getCreateButton(screen));

      expect(mockCreateHabit).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: '🎯',
          iconColor: '#8B5CF6',
          name: '🎯 Deep work',
        })
      );
    });

    it('persists and schedules an enabled morning reminder', async () => {
      const screen = renderModal();
      enterName(screen, 'Morning walk');
      await flushAsyncPress(screen.getByLabelText('Enable reminder'));
      fireEvent.press(screen.getByTestId('preset-morning'));

      await flushAsyncPress(getCreateButton(screen));

      expect(mockEnsureNotificationPermissions).toHaveBeenCalledTimes(1);
      expect(mockCreateHabit).toHaveBeenCalledWith(
        expect.objectContaining({
          reminderTime: '07:00',
          remindersEnabled: true,
        })
      );
      expect(mockScheduleHabitReminder).toHaveBeenCalledWith(
        expect.objectContaining({
          habitId: 'new-habit-id',
          title: 'Morning walk',
        })
      );
      const scheduledTime =
        mockScheduleHabitReminder.mock.calls[0][0].reminderTime;
      expect(scheduledTime.getHours()).toBe(7);
      expect(scheduledTime.getMinutes()).toBe(0);
    });

    it('prefills and saves the current edit-mode habit contract', async () => {
      const habitToEdit = {
        _creationTime: 1,
        _id: 'habit-1',
        color: '#14B8A6',
        daysOfWeek: [1, 2, 3, 4, 5],
        frequency: 'weekdays',
        goalDuration: 30,
        iconColor: '#14B8A6',
        name: '📖 Read nightly',
        notes: 'Keep this note',
        remindersEnabled: false,
        strengthAlgorithm: 'strict',
        userId: 'user-1',
      } as HabitDoc;
      const screen = renderModal({ habitToEdit });

      expect(screen.getByLabelText('Habit name').props.value).toBe(
        'Read nightly'
      );
      expect(
        screen.getByLabelText('Select emoji 📖').props.accessibilityState
          .selected
      ).toBe(true);
      expect(
        screen.getByTestId('color-swatch-14B8A6').props.accessibilityState
          .selected
      ).toBe(true);

      await flushAsyncPress(screen.getByLabelText('Save habit changes'));

      expect(mockUpdateHabit).toHaveBeenCalledWith(
        expect.objectContaining({
          habitId: 'habit-1',
          name: '📖 Read nightly',
          notes: 'Keep this note',
          remindersEnabled: false,
          strengthAlgorithm: 'strict',
        })
      );
      expect(mockCreateHabit).not.toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
