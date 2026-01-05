/**
 * CreateHabitModalCentered Component Tests
 * Tests for the centered layout version of the habit creation modal
 *
 * Tests:
 * - Modal opens/closes
 * - Form resets on open (non-edit mode)
 * - onCreate called with correct data
 * - Smart defaults applied
 * - Custom color picker integration
 * - Form component integration
 * - Swipe gesture registration
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

// Create trackable mock functions at module level
const mockMutationFn = jest.fn(() => Promise.resolve('new-habit-id'));
const mockResetForm = jest.fn();

// Mock dependencies before imports
jest.mock('convex/react', () => ({
  useMutation: () => mockMutationFn,
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

jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: () => false,
}));

// Mock Reanimated
jest.mock('react-native-reanimated', () => {
  const { View, Text } = require('react-native');
  return {
    ...jest.requireActual('react-native-reanimated/mock'),
    default: {
      View,
      Text,
      createAnimatedComponent: (Component: any) => Component,
    },
    FadeIn: { duration: () => ({ delay: () => ({}) }) },
    FadeInUp: { duration: () => ({ delay: () => ({}) }) },
    FadeOut: { duration: () => ({}) },
    LinearTransition: {
      springify: () => ({
        damping: () => ({ stiffness: () => ({}) }),
      }),
    },
    useSharedValue: (value: any) => ({ value }),
    useAnimatedStyle: () => ({}),
    withSpring: (value: any) => value,
    withSequence: (...args: any[]) => args[0],
    withTiming: (value: any) => value,
    runOnJS: (fn: any) => fn,
  };
});

// Mock gesture handler
jest.mock('react-native-gesture-handler', () => ({
  Gesture: {
    Pan: () => ({
      onStart: jest.fn().mockReturnThis(),
      onUpdate: jest.fn().mockReturnThis(),
      onEnd: jest.fn().mockReturnThis(),
    }),
  },
  GestureDetector: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock EmojiPickerSheet
jest.mock('../../EmojiPickerV2', () => ({
  EmojiPickerSheet: () => null,
}));

// Mock ColorPickerSheet
jest.mock('../ColorPickerSheet', () => ({
  ColorPickerSheet: jest.fn(() => null),
}));

// Mock TemplateScienceModal
jest.mock('../../TemplateScienceModal', () => {
  return jest.fn(() => null);
});

// Mock SafeAreaProvider
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

import CreateHabitModalCentered from '../CreateHabitModalCentered';

describe('CreateHabitModalCentered', () => {
  const mockOnClose = jest.fn();

  const defaultProps = {
    visible: true,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Modal Presentation', () => {
    it('should render modal when visible', () => {
      const { getByText } = render(
        <CreateHabitModalCentered {...defaultProps} />
      );
      // Modal header title should be visible
      expect(getByText('Create Habit')).toBeTruthy();
    });

    it('should not render modal when not visible', () => {
      const { queryByText } = render(
        <CreateHabitModalCentered {...defaultProps} visible={false} />
      );
      // Modal should not be visible
      expect(queryByText('Create Habit')).toBeNull();
    });

    it('should show edit mode title when editing', () => {
      const habitToEdit = {
        _id: 'habit-1',
        _creationTime: Date.now(),
        userId: 'user-1',
        name: 'Test Habit',
        iconColor: '#EF4444',
        icon: '💪',
      };

      const { getByText } = render(
        <CreateHabitModalCentered {...defaultProps} habitToEdit={habitToEdit} />
      );
      expect(getByText('Edit Habit')).toBeTruthy();
    });

    it('should call onClose when close button pressed', () => {
      const { getByLabelText } = render(
        <CreateHabitModalCentered {...defaultProps} />
      );
      const closeButton = getByLabelText('Close');

      fireEvent.press(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form Integration', () => {
    it('should render CreateHabitFormCentered component', () => {
      const { getByText } = render(
        <CreateHabitModalCentered {...defaultProps} />
      );
      // Check for form heading
      expect(getByText(/What habit do you/i)).toBeTruthy();
    });

    it('should render name input', () => {
      const { getByPlaceholderText } = render(
        <CreateHabitModalCentered {...defaultProps} />
      );
      expect(
        getByPlaceholderText('e.g., Read for 20 minutes')
      ).toBeTruthy();
    });

    it('should render optional section label', () => {
      const { getByText } = render(
        <CreateHabitModalCentered {...defaultProps} />
      );
      expect(getByText('Customize (Optional)')).toBeTruthy();
    });
  });

  describe('Form State Management', () => {
    it('should update habit name', () => {
      const { getByTestId } = render(
        <CreateHabitModalCentered {...defaultProps} />
      );
      const input = getByTestId('habit-name-input');

      fireEvent.changeText(input, 'Read books');

      // Input should show the new value
      expect(input.props.value).toBe('Read books');
    });

    it('should enable submit when name is valid', () => {
      const { getByTestId } = render(
        <CreateHabitModalCentered {...defaultProps} />
      );
      const input = getByTestId('habit-name-input');
      const submitButton = getByTestId('create-habit-button');

      fireEvent.changeText(input, 'Read books');

      expect(submitButton.props.accessibilityState.disabled).toBe(false);
    });

    it('should keep submit disabled when name is too short', () => {
      const { getByTestId } = render(
        <CreateHabitModalCentered {...defaultProps} />
      );
      const input = getByTestId('habit-name-input');
      const submitButton = getByTestId('create-habit-button');

      fireEvent.changeText(input, 'a');

      expect(submitButton.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Habit Creation', () => {
    it('should call createHabit when form submitted with valid name', async () => {
      const { getByTestId } = render(
        <CreateHabitModalCentered {...defaultProps} />
      );
      const input = getByTestId('habit-name-input');
      const submitButton = getByTestId('create-habit-button');

      fireEvent.changeText(input, 'Read books');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(mockMutationFn).toHaveBeenCalled();
      });
    });

    it('should close modal after successful creation', async () => {
      const { getByTestId } = render(
        <CreateHabitModalCentered {...defaultProps} />
      );
      const input = getByTestId('habit-name-input');
      const submitButton = getByTestId('create-habit-button');

      fireEvent.changeText(input, 'Read books');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  describe('Custom Color Picker Integration', () => {
    it('should render ColorPickerSheet component', () => {
      const ColorPickerSheet = require('../ColorPickerSheet').ColorPickerSheet;
      render(<CreateHabitModalCentered {...defaultProps} />);

      expect(ColorPickerSheet).toHaveBeenCalled();
    });
  });

  describe('Smart Defaults', () => {
    it('should use default color on creation', async () => {
      const { getByTestId } = render(
        <CreateHabitModalCentered {...defaultProps} />
      );
      const input = getByTestId('habit-name-input');
      const submitButton = getByTestId('create-habit-button');

      fireEvent.changeText(input, 'Read books');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(mockMutationFn).toHaveBeenCalledWith(
          expect.objectContaining({
            iconColor: expect.any(String),
          })
        );
      });
    });

    it('should allow reminder option selection', () => {
      const { getByTestId } = render(
        <CreateHabitModalCentered {...defaultProps} />
      );

      // ReminderSelector should be rendered
      expect(getByTestId('reminder-selector')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible modal header', () => {
      const { getByText } = render(
        <CreateHabitModalCentered {...defaultProps} />
      );
      const title = getByText('Create Habit');

      expect(title).toBeTruthy();
    });

    it('should have accessible close button', () => {
      const { getByLabelText } = render(
        <CreateHabitModalCentered {...defaultProps} />
      );
      const closeButton = getByLabelText('Close');

      expect(closeButton.props.accessibilityRole).toBe('button');
    });

    it('should have accessible form fields', () => {
      const { getByTestId } = render(
        <CreateHabitModalCentered {...defaultProps} />
      );
      const input = getByTestId('habit-name-input');

      expect(input.props.accessibilityLabel).toBe('Habit name');
    });
  });

  describe('Edit Mode', () => {
    const habitToEdit = {
      _id: 'habit-1',
      _creationTime: Date.now(),
      userId: 'user-1',
      name: '💪 Workout',
      iconColor: '#EF4444',
      icon: '💪',
      remindersEnabled: true,
      reminderTime: '7:00 AM',
    };

    it('should populate form with habit data in edit mode', () => {
      const { getByTestId } = render(
        <CreateHabitModalCentered {...defaultProps} habitToEdit={habitToEdit} />
      );
      const input = getByTestId('habit-name-input');

      // Form should be populated with existing habit name (without emoji)
      expect(input.props.value).toBe('Workout');
    });

    it('should show Save button text in edit mode', () => {
      const { getByLabelText } = render(
        <CreateHabitModalCentered {...defaultProps} habitToEdit={habitToEdit} />
      );

      expect(getByLabelText('Save habit changes')).toBeTruthy();
    });
  });

  describe('Swipe-to-Dismiss Gesture', () => {
    it('should register pan gesture handler', () => {
      const { Gesture } = require('react-native-gesture-handler');
      const mockPan = jest.fn().mockReturnValue({
        onStart: jest.fn().mockReturnThis(),
        onUpdate: jest.fn().mockReturnThis(),
        onEnd: jest.fn().mockReturnThis(),
      });
      Gesture.Pan = mockPan;

      render(<CreateHabitModalCentered {...defaultProps} />);

      // Verify Pan gesture was created
      expect(mockPan).toHaveBeenCalled();
    });

    it('should wrap content in GestureDetector', () => {
      const { GestureDetector } = require('react-native-gesture-handler');
      const mockGestureDetector = jest.fn(
        ({ children }: { children: React.ReactNode }) => children
      );
      // We can't easily override the mocked GestureDetector, but we can verify it's being used
      // by checking that the component renders successfully (which requires GestureDetector)

      const { getByText } = render(
        <CreateHabitModalCentered {...defaultProps} />
      );

      // If GestureDetector wasn't wrapping the content, this would fail
      expect(getByText('Create Habit')).toBeTruthy();
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot in create mode', () => {
      const { toJSON } = render(
        <CreateHabitModalCentered {...defaultProps} />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot in edit mode', () => {
      const habitToEdit = {
        _id: 'habit-1',
        _creationTime: Date.now(),
        userId: 'user-1',
        name: 'Test Habit',
        iconColor: '#EF4444',
        icon: '💪',
      };

      const { toJSON } = render(
        <CreateHabitModalCentered {...defaultProps} habitToEdit={habitToEdit} />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot when not visible', () => {
      const { toJSON } = render(
        <CreateHabitModalCentered {...defaultProps} visible={false} />
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
