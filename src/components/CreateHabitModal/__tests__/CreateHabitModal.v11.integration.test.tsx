/**
 * CreateHabitModal integration tests for the current name + customize flow.
 */

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import STRINGS from '../../../constants/strings';

jest.mock('convex/react', () => ({
  useMutation: () => jest.fn(() => Promise.resolve('new-habit-id')),
  useQuery: () => [],
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
      getImportedTemplateIds: 'templates:getImportedTemplateIds',
      list: 'templates:list',
    },
    categories: {
      list: 'categories:list',
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
    triggerSelection: jest.fn(),
    triggerImpact: jest.fn(),
    triggerNotification: jest.fn(),
    triggerSuccess: jest.fn(),
  }),
}));

jest.mock('../../EmojiPickerV2', () => ({
  EmojiPickerSheet: jest.fn(() => null),
}));

jest.mock('expo-linear-gradient', () => {
  const View = require('react-native').View;
  return {
    LinearGradient: View,
  };
});

jest.mock('reanimated-color-picker', () => {
  const View = require('react-native').View;
  return {
    __esModule: true,
    default: View,
    BrightnessSlider: View,
    Preview: View,
  };
});

jest.mock(
  '../ColorPickerSheet',
  () => ({
    ColorPickerSheet: jest.fn(() => null),
  }),
  { virtual: true }
);

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@react-native-community/datetimepicker', () => {
  return jest.fn(() => null);
});

jest
  .spyOn(AccessibilityInfo, 'announceForAccessibility')
  .mockImplementation(jest.fn());

import CreateHabitModal from '../CreateHabitModalCentered';

describe('CreateHabitModal V11 Integration Tests', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    visible: true,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('updates the name input as the user types', async () => {
    const { getByLabelText } = render(<CreateHabitModal {...defaultProps} />);
    const input = getByLabelText('Habit name');

    fireEvent.changeText(input, 'Morning Jog');

    await waitFor(() => {
      expect(input.props.value).toBe('Morning Jog');
    });
  });

  it('disables create when the name is empty and enables after one character', () => {
    const { getByLabelText } = render(<CreateHabitModal {...defaultProps} />);
    const createButton = getByLabelText(STRINGS.CREATE_HABIT.createAction);

    expect(createButton.props.accessibilityState?.disabled).toBe(true);

    fireEvent.changeText(getByLabelText('Habit name'), 'R');
    expect(createButton.props.accessibilityState?.disabled).toBe(false);

    fireEvent.changeText(getByLabelText('Habit name'), '   ');
    expect(createButton.props.accessibilityState?.disabled).toBe(true);
  });

  it('selects an emoji chip by accessibility label', async () => {
    const { getByLabelText } = render(<CreateHabitModal {...defaultProps} />);

    fireEvent.press(getByLabelText('Select emoji 📖'));

    await waitFor(() => {
      expect(
        getByLabelText('Select emoji 📖').props.accessibilityState?.selected
      ).toBe(true);
    });
  });

  it('selects a color and keeps the name field usable', async () => {
    const { getByTestId, getByLabelText } = render(
      <CreateHabitModal {...defaultProps} />
    );

    fireEvent.changeText(getByLabelText('Habit name'), 'Read Daily');
    fireEvent.press(getByTestId('color-swatch-8B5CF6'));

    await waitFor(() => {
      expect(
        getByTestId('color-swatch-8B5CF6').props.accessibilityState?.selected
      ).toBe(true);
      expect(getByLabelText('Habit name').props.value).toBe('Read Daily');
    });
  });

  it('refreshes emoji suggestions after the name is committed on blur', async () => {
    const { getByLabelText } = render(<CreateHabitModal {...defaultProps} />);
    const input = getByLabelText('Habit name');

    fireEvent.changeText(input, 'Read daily');
    fireEvent(input, 'blur');
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(getByLabelText('Select emoji 📖')).toBeDefined();
    });
  });

  it('renders customize section labels without a live preview', () => {
    const { getByText, getByLabelText, queryByLabelText, queryByText } = render(
      <CreateHabitModal {...defaultProps} />
    );

    expect(getByText('Choose an icon')).toBeDefined();
    expect(getByText('Pick a color')).toBeDefined();
    expect(getByText('Daily Reminder')).toBeDefined();
    expect(getByLabelText(STRINGS.CREATE_HABIT.createAction)).toBeDefined();
    expect(queryByLabelText(/Preview:/)).toBeNull();
    expect(queryByText('Your new habit')).toBeNull();
  });

  it('handles special characters and emoji in the habit name', async () => {
    const { getByLabelText } = render(<CreateHabitModal {...defaultProps} />);
    const input = getByLabelText('Habit name');

    fireEvent.changeText(input, 'Test@#$ 🎯');

    await waitFor(() => {
      expect(input.props.value).toBe('Test@#$ 🎯');
    });
  });
});
