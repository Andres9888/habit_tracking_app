/**
 * Current CreateHabitModalCentered integration coverage.
 *
 * The original V11 suite described a retired preview card, character counter,
 * and test-id based emoji UI. These tests exercise the current centered modal
 * through its public, accessible controls and verify the state transitions
 * users rely on.
 */

import React from 'react';
import {
  act,
  fireEvent,
  render,
  waitFor,
  type RenderAPI,
} from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';

jest.mock('convex/react', () => ({
  useMutation: () => jest.fn(() => Promise.resolve('new-habit-id')),
  useQuery: () => [],
}));

jest.mock('../../../../convex/_generated/api', () => ({
  api: {
    habits: {
      create: 'habits:create',
      update: 'habits:update',
    },
    templates: {
      list: 'templates:list',
    },
    categories: {
      list: 'categories:list',
    },
    settings: {
      get: 'settings:get',
    },
  },
}));

jest.mock('../../../utils/notifications', () => ({
  cancelHabitReminder: jest.fn(),
  ensureNotificationPermissions: jest.fn(() => Promise.resolve(true)),
  formatReminderTime: jest.fn((date: Date) => date.toISOString()),
  scheduleHabitReminder: jest.fn(() => Promise.resolve(true)),
  getDefaultReminderTime: jest.fn(() => new Date()),
  createDateFromTimeString: jest.fn(
    (timeString?: string, defaultDate?: Date) => defaultDate || new Date()
  ),
}));

jest.mock('../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: () => ({
    triggerImpact: jest.fn(),
    triggerNotification: jest.fn(),
    triggerSelection: jest.fn(),
    triggerSuccess: jest.fn(),
    triggerWarning: jest.fn(),
  }),
}));

jest.mock('../hooks/useHabitNamePlaceholder', () => ({
  useHabitNamePlaceholder: () => ({
    isReady: true,
    placeholder: 'Build a habit',
  }),
}));

jest.mock('react-native-reanimated', () => {
  const { Text, View } = require('react-native');

  return {
    ...jest.requireActual('react-native-reanimated/mock'),
    FadeIn: { duration: () => ({ easing: () => ({}) }) },
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
    default: {
      View,
      Text,
      createAnimatedComponent: (Component: React.ComponentType<unknown>) =>
        Component,
      addWhitelistedNativeProps: jest.fn(),
    },
    addWhitelistedNativeProps: jest.fn(),
    useSharedValue: (initial: unknown) => ({ value: initial }),
    useAnimatedStyle: (callback: () => unknown) => callback(),
    runOnJS: (fn: (...args: unknown[]) => unknown) => fn,
    withSpring: (value: unknown) => value,
    withTiming: (value: unknown) => value,
  };
});

jest.mock('../../EmojiPickerV2', () => ({
  EmojiPickerSheet: jest.fn(() => null),
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: require('react-native').View,
}));

jest.mock('reanimated-color-picker', () => {
  const View = require('react-native').View;
  return {
    __esModule: true,
    default: View,
    BrightnessSlider: View,
    Preview: View,
  };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@react-native-community/datetimepicker', () =>
  jest.fn(() => null)
);

jest
  .spyOn(AccessibilityInfo, 'announceForAccessibility')
  .mockImplementation(jest.fn());

import CreateHabitModal from '../CreateHabitModalCentered';

const mockOnClose = jest.fn();
const defaultProps = {
  visible: true,
  onClose: mockOnClose,
};

function renderModal() {
  return render(<CreateHabitModal {...defaultProps} />);
}

function enterName(result: RenderAPI, name: string) {
  const input = result.getByLabelText('Habit name');
  fireEvent.changeText(input, name);
  return input;
}

function commitNameForSuggestions(result: RenderAPI, name: string) {
  const input = enterName(result, name);
  fireEvent(input, 'blur');
  act(() => {
    jest.advanceTimersByTime(301);
  });
}

describe('CreateHabitModalCentered integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('controlled form state', () => {
    it('reflects habit name changes in the controlled input', () => {
      const result = renderModal();
      enterName(result, 'Morning Jog');
      expect(result.getByDisplayValue('Morning Jog')).toBeDefined();
    });

    it('starts with an empty name and the current prompt', () => {
      const result = renderModal();
      expect(result.getByLabelText('Habit name').props.value).toBe('');
      expect(result.getByText('Name your new habit')).toBeDefined();
    });

    it('marks a selected emoji through accessibility state', () => {
      const result = renderModal();
      fireEvent.press(result.getByLabelText('Select emoji 📖'));
      expect(
        result.getByLabelText('Select emoji 📖').props.accessibilityState
          ?.selected
      ).toBe(true);
    });

    it('marks a selected color through accessibility state', () => {
      const result = renderModal();
      fireEvent.press(result.getByTestId('color-swatch-14B8A6'));
      expect(
        result.getByTestId('color-swatch-14B8A6').props.accessibilityState
          ?.selected
      ).toBe(true);
    });

    it('keeps name, emoji, and color choices in sync', () => {
      const result = renderModal();
      enterName(result, 'Read Daily');
      fireEvent.press(result.getByLabelText('Select emoji 📖'));
      fireEvent.press(result.getByTestId('color-swatch-8B5CF6'));

      expect(result.getByDisplayValue('Read Daily')).toBeDefined();
      expect(
        result.getByLabelText('Select emoji 📖').props.accessibilityState
          ?.selected
      ).toBe(true);
      expect(
        result.getByTestId('color-swatch-8B5CF6').props.accessibilityState
          ?.selected
      ).toBe(true);
    });

    it('settles on the latest value after rapid input changes', () => {
      const result = renderModal();
      enterName(result, 'R');
      enterName(result, 'Re');
      enterName(result, 'Read');
      expect(result.getByDisplayValue('Read')).toBeDefined();
    });
  });

  describe('create button validation', () => {
    it('is disabled when the habit name is empty', () => {
      const result = renderModal();
      expect(
        result.getByLabelText('Create Habit').props.accessibilityState?.disabled
      ).toBe(true);
    });

    it('accepts a single non-whitespace character', () => {
      const result = renderModal();
      enterName(result, 'A');
      expect(
        result.getByLabelText('Create Habit').props.accessibilityState?.disabled
      ).toBe(false);
    });

    it('is enabled for a multi-character name', () => {
      const result = renderModal();
      enterName(result, 'AB');
      expect(
        result.getByLabelText('Create Habit').props.accessibilityState?.disabled
      ).toBe(false);
    });

    it('stays disabled for whitespace-only input', () => {
      const result = renderModal();
      enterName(result, '   ');
      expect(
        result.getByLabelText('Create Habit').props.accessibilityState?.disabled
      ).toBe(true);
    });

    it('becomes disabled again when the name is cleared', () => {
      const result = renderModal();
      enterName(result, 'Valid');
      enterName(result, '');
      expect(
        result.getByLabelText('Create Habit').props.accessibilityState?.disabled
      ).toBe(true);
    });
  });

  describe('contextual emoji suggestions', () => {
    it('suggests a book for a reading habit after name commit', () => {
      const result = renderModal();
      commitNameForSuggestions(result, 'read every day');
      expect(result.getByLabelText('Select emoji 📖')).toBeDefined();
    });

    it('suggests strength for a workout habit after name commit', () => {
      const result = renderModal();
      commitNameForSuggestions(result, 'workout');
      expect(result.getByLabelText('Select emoji 💪')).toBeDefined();
    });

    it('suggests meditation for a mindfulness habit after name commit', () => {
      const result = renderModal();
      commitNameForSuggestions(result, 'meditate');
      expect(result.getByLabelText('Select emoji 🧘')).toBeDefined();
    });

    it('suggests a water drop for a hydration habit after name commit', () => {
      const result = renderModal();
      commitNameForSuggestions(result, 'water');
      expect(result.getByLabelText('Select emoji 💧')).toBeDefined();
    });

    it('retains default choices when the name has no keyword match', () => {
      const result = renderModal();
      commitNameForSuggestions(result, 'xyzzy');
      expect(result.getByLabelText('Select emoji 🎯')).toBeDefined();
    });

    it('does not reshuffle suggestions until the edited name is committed', () => {
      const result = renderModal();
      enterName(result, 'run');
      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(result.getByLabelText('Select emoji 🎯')).toBeDefined();

      fireEvent(result.getByLabelText('Habit name'), 'blur');
      act(() => {
        jest.advanceTimersByTime(301);
      });
      expect(result.getByLabelText('Select emoji 🏃')).toBeDefined();
    });

    it('updates suggestions when a committed name changes category', () => {
      const result = renderModal();
      commitNameForSuggestions(result, 'read');
      expect(result.getByLabelText('Select emoji 📖')).toBeDefined();

      commitNameForSuggestions(result, 'workout');
      expect(result.getByLabelText('Select emoji 💪')).toBeDefined();
    });

    it('matches suggestion keywords case-insensitively', () => {
      const result = renderModal();
      commitNameForSuggestions(result, 'READ');
      expect(result.getByLabelText('Select emoji 📖')).toBeDefined();
    });
  });

  describe('current input constraints and validation feedback', () => {
    it('does not render the retired character counter for an empty name', () => {
      const result = renderModal();
      expect(result.queryByText(/0\/40/)).toBeNull();
    });

    it('does not render the retired character counter while typing', () => {
      const result = renderModal();
      enterName(result, '12345678901234567890');
      expect(result.queryByText(/20\/40/)).toBeNull();
    });

    it('exposes the current 50-character native input limit', () => {
      const result = renderModal();
      expect(result.getByLabelText('Habit name').props.maxLength).toBe(50);
    });

    it('accepts a name at the 50-character boundary', () => {
      const result = renderModal();
      const name = 'a'.repeat(50);
      enterName(result, name);
      expect(result.getByDisplayValue(name)).toBeDefined();
    });

    it('shows and clears the inline name validation message', async () => {
      const result = renderModal();
      fireEvent.press(result.getByLabelText('Create Habit'));
      expect(await result.findByText('Give your habit a name')).toBeDefined();

      enterName(result, 'Walk');
      await waitFor(() => {
        expect(result.queryByText('Give your habit a name')).toBeNull();
      });
    });
  });

  describe('layout and lifecycle', () => {
    it('renders the current centered form sections', () => {
      const result = renderModal();
      expect(result.getByText('Name your new habit')).toBeDefined();
      expect(result.getByText('Choose an icon')).toBeDefined();
      expect(result.getByText('Pick a color')).toBeDefined();
      expect(result.getByLabelText('Enable reminder')).toBeDefined();
    });

    it('preserves an in-progress draft across a visibility toggle', () => {
      const result = renderModal();
      enterName(result, 'Test Habit');
      fireEvent.press(result.getByLabelText('Select emoji 📖'));

      result.rerender(<CreateHabitModal {...defaultProps} visible={false} />);
      act(() => {
        jest.advanceTimersByTime(400);
      });
      result.rerender(<CreateHabitModal {...defaultProps} visible />);

      expect(result.getByLabelText('Habit name').props.value).toBe('Test Habit');
      expect(
        result.getByLabelText('Select emoji 📖').props.accessibilityState
          ?.selected
      ).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('labels the primary modal controls and their roles', () => {
      const result = renderModal();
      expect(result.getByLabelText('Close').props.accessibilityRole).toBe(
        'button'
      );
      expect(
        result.getByLabelText('Create Habit').props.accessibilityRole
      ).toBe('button');
      expect(result.getByLabelText('Habit name')).toBeDefined();
      expect(result.getByLabelText('Browse more emojis')).toBeDefined();
      expect(result.getByLabelText(/Emerald color/)).toBeDefined();
    });

    it('announces emoji and color selections', () => {
      const result = renderModal();
      fireEvent.press(result.getByLabelText('Select emoji 📖'));
      fireEvent.press(result.getByTestId('color-swatch-14B8A6'));

      expect(
        AccessibilityInfo.announceForAccessibility
      ).toHaveBeenCalledWith('Selected emoji 📖');
      expect(
        AccessibilityInfo.announceForAccessibility
      ).toHaveBeenCalledWith('Selected Teal color');
    });
  });

  describe('edge cases', () => {
    it('preserves punctuation and special characters in the controlled name', () => {
      const result = renderModal();
      enterName(result, 'Test@#$%^&*()');
      expect(result.getByDisplayValue('Test@#$%^&*()')).toBeDefined();
    });

    it('preserves emoji characters in the controlled name', () => {
      const result = renderModal();
      enterName(result, 'Test 🎯 Habit');
      expect(result.getByDisplayValue('Test 🎯 Habit')).toBeDefined();
    });

    it('preserves surrounding whitespace while validating trimmed content', () => {
      const result = renderModal();
      enterName(result, '  Walk  ');
      expect(result.getByDisplayValue('  Walk  ')).toBeDefined();
      expect(
        result.getByLabelText('Create Habit').props.accessibilityState?.disabled
      ).toBe(false);
    });

    it('settles on the final emoji after rapid selection changes', () => {
      const result = renderModal();
      fireEvent.press(result.getByLabelText('Select emoji 🎯'));
      fireEvent.press(result.getByLabelText('Select emoji 📖'));
      fireEvent.press(result.getByLabelText('Select emoji 💧'));

      expect(
        result.getByLabelText('Select emoji 💧').props.accessibilityState
          ?.selected
      ).toBe(true);
    });

    it('settles on the final color after rapid selection changes', () => {
      const result = renderModal();
      fireEvent.press(result.getByTestId('color-swatch-10B981'));
      fireEvent.press(result.getByTestId('color-swatch-14B8A6'));
      fireEvent.press(result.getByTestId('color-swatch-8B5CF6'));

      expect(
        result.getByTestId('color-swatch-8B5CF6').props.accessibilityState
          ?.selected
      ).toBe(true);
    });
  });
});
