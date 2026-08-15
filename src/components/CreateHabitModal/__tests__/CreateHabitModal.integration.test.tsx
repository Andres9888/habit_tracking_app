/**
 * CreateHabitModal integration tests for the current centered create flow.
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import STRINGS from '../../../constants/strings';

const mockMutationFn = jest.fn(() => Promise.resolve('new-habit-id'));

jest.mock('convex/react', () => ({
  useMutation: () => mockMutationFn,
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

describe('CreateHabitModal Integration', () => {
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

  it('renders the name title, input, and create action', () => {
    const { getByText, getByLabelText } = render(
      <CreateHabitModal {...defaultProps} />
    );

    expect(getByText(STRINGS.CREATE_HABIT.nameTitle)).toBeDefined();
    expect(getByLabelText('Habit name')).toBeDefined();
    expect(getByLabelText(STRINGS.CREATE_HABIT.createAction)).toBeDefined();
  });

  it('keeps create disabled until a name is entered', () => {
    const { getByLabelText } = render(<CreateHabitModal {...defaultProps} />);
    const createButton = getByLabelText(STRINGS.CREATE_HABIT.createAction);

    expect(createButton.props.accessibilityState?.disabled).toBe(true);

    fireEvent.changeText(getByLabelText('Habit name'), 'R');
    expect(createButton.props.accessibilityState?.disabled).toBe(false);
  });

  it('updates the name field as the user types', async () => {
    const { getByLabelText } = render(<CreateHabitModal {...defaultProps} />);
    const input = getByLabelText('Habit name');

    fireEvent.changeText(input, 'Morning Meditation');

    await waitFor(() => {
      expect(input.props.value).toBe('Morning Meditation');
    });
  });

  it('renders default emoji chips and color swatches', () => {
    const { getByLabelText, getByTestId } = render(
      <CreateHabitModal {...defaultProps} />
    );

    expect(getByLabelText('Select emoji 🎯')).toBeDefined();
    expect(getByLabelText('Browse more emojis')).toBeDefined();
    expect(getByTestId('color-swatch-14B8A6')).toBeDefined();
  });

  it('selects a color swatch', async () => {
    const { getByTestId } = render(<CreateHabitModal {...defaultProps} />);
    const tealSwatch = getByTestId('color-swatch-14B8A6');

    fireEvent.press(tealSwatch);

    await waitFor(() => {
      expect(tealSwatch.props.accessibilityState?.selected).toBe(true);
    });
  });

  it('enables reminder presets from the toggle', async () => {
    const { getByTestId, queryByTestId } = render(
      <CreateHabitModal {...defaultProps} />
    );

    expect(queryByTestId('preset-morning')).toBeNull();
    fireEvent(getByTestId('reminder-toggle'), 'valueChange', true);

    expect(getByTestId('preset-morning')).toBeDefined();
    fireEvent.press(getByTestId('preset-evening'));

    await waitFor(() => {
      expect(
        getByTestId('preset-evening').props.accessibilityState?.selected
      ).toBe(true);
    });
  });

  it('announces reminder preset selection', () => {
    const { getByTestId } = render(<CreateHabitModal {...defaultProps} />);

    fireEvent(getByTestId('reminder-toggle'), 'valueChange', true);
    fireEvent.press(getByTestId('preset-morning'));

    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
      expect.stringContaining('Morning')
    );
  });

  it('renders customize section copy', () => {
    const { getByText } = render(<CreateHabitModal {...defaultProps} />);

    expect(getByText('Choose an icon')).toBeDefined();
    expect(getByText('Pick a color')).toBeDefined();
    expect(getByText('Daily Reminder')).toBeDefined();
  });

  it('does not render removed quick-pick or live-preview chrome', () => {
    const { queryByText, queryByLabelText } = render(
      <CreateHabitModal {...defaultProps} />
    );

    expect(queryByText('Quick picks')).toBeNull();
    expect(queryByLabelText(/Preview:/)).toBeNull();
    expect(queryByText('Your new habit')).toBeNull();
  });

});
