/**
 * CreateHabitFormCentered Component Tests
 * Tests for the centered habit creation form layout
 *
 * Tests:
 * - Component renders correctly with all sections
 * - Name input updates state
 * - Character counter shows correct count
 * - Submit validation works (minimum 2 characters)
 * - Enter key triggers submit when name is valid
 * - Character limit enforced (50 max)
 * - Optional sections render correctly
 * - Accessibility labels present
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CreateHabitFormCentered } from '../CreateHabitFormCentered';
import STRINGS from '../../../../constants/strings';

// Mock dependencies
jest.mock('../../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: () => ({
    triggerSelection: jest.fn(),
    triggerWarning: jest.fn(),
    triggerImpact: jest.fn(),
    triggerNotification: jest.fn(),
  }),
}));

jest.mock('../../../../hooks/useReduceMotion', () => ({
  useReduceMotion: () => false,
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const { View, Text } = require('react-native');
  return {
    ...jest.requireActual('react-native-reanimated/mock'),
    default: {
      View,
      Text,
      createAnimatedComponent: (Component: any) => Component,
    },
    FadeIn: { duration: () => ({}) },
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
  };
});

// Mock EmojiPickerSheet
jest.mock('../../../EmojiPickerV2', () => ({
  EmojiPickerSheet: () => null,
}));

describe('CreateHabitFormCentered', () => {
  const mockOnHabitNameChange = jest.fn();
  const mockOnEmojiSelect = jest.fn();
  const mockOnColorSelect = jest.fn();
  const mockOnCustomColorPress = jest.fn();
  const mockOnReminderOptionSelect = jest.fn();
  const mockOnSubmit = jest.fn();

  const defaultProps = {
    habitName: '',
    onHabitNameChange: mockOnHabitNameChange,
    selectedEmoji: null,
    onEmojiSelect: mockOnEmojiSelect,
    colors: ['#EF4444', '#F97316', '#F59E0B'] as const,
    selectedColor: '#EF4444',
    onColorSelect: mockOnColorSelect,
    onCustomColorPress: mockOnCustomColorPress,
    reminderOption: 'none' as const,
    onReminderOptionSelect: mockOnReminderOptionSelect,
    onSubmit: mockOnSubmit,
    autoFocus: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render centered heading', () => {
      const { getByText } = render(<CreateHabitFormCentered {...defaultProps} />);
      expect(getByText(/What habit do you/i)).toBeTruthy();
      expect(getByText(/want to build\?/i)).toBeTruthy();
    });

    it('should render name input with placeholder', () => {
      const { getByPlaceholderText } = render(
        <CreateHabitFormCentered {...defaultProps} />
      );
      expect(
        getByPlaceholderText('e.g., Read for 20 minutes')
      ).toBeTruthy();
    });

    it('should render character counter', () => {
      const { getByText } = render(<CreateHabitFormCentered {...defaultProps} />);
      expect(getByText('0/50 characters')).toBeTruthy();
    });

    it('should render "CUSTOMIZE (OPTIONAL)" section label', () => {
      const { getByText } = render(<CreateHabitFormCentered {...defaultProps} />);
      expect(getByText('Customize (Optional)')).toBeTruthy();
    });

    it('should render submit button', () => {
      const { getByText } = render(<CreateHabitFormCentered {...defaultProps} />);
      expect(getByText(STRINGS.CREATE_HABIT.createAction)).toBeTruthy();
    });
  });

  describe('Name Input Behavior', () => {
    it('should update name when typing', () => {
      const { getByTestId } = render(<CreateHabitFormCentered {...defaultProps} />);
      const input = getByTestId('habit-name-input');

      fireEvent.changeText(input, 'Read books');

      expect(mockOnHabitNameChange).toHaveBeenCalledWith('Read books');
    });

    it('should update character counter', () => {
      const { getByText } = render(
        <CreateHabitFormCentered {...defaultProps} habitName='Test' />
      );
      expect(getByText('4/50 characters')).toBeTruthy();
    });

    it('should enforce 50 character limit', () => {
      const longText = 'a'.repeat(51);
      const { getByTestId } = render(<CreateHabitFormCentered {...defaultProps} />);
      const input = getByTestId('habit-name-input');

      fireEvent.changeText(input, longText);

      // Should not call with text longer than 50 chars
      expect(mockOnHabitNameChange).not.toHaveBeenCalledWith(longText);
    });

    it('should allow text up to 50 characters', () => {
      const maxText = 'a'.repeat(50);
      const { getByTestId } = render(<CreateHabitFormCentered {...defaultProps} />);
      const input = getByTestId('habit-name-input');

      fireEvent.changeText(input, maxText);

      expect(mockOnHabitNameChange).toHaveBeenCalledWith(maxText);
    });
  });

  describe('Submit Validation', () => {
    it('should disable submit when name is empty', () => {
      const { getByTestId } = render(<CreateHabitFormCentered {...defaultProps} />);
      const button = getByTestId('create-habit-button');

      expect(button.props.accessibilityState.disabled).toBe(true);
    });

    it('should disable submit when name has 1 character', () => {
      const { getByTestId } = render(
        <CreateHabitFormCentered {...defaultProps} habitName='a' />
      );
      const button = getByTestId('create-habit-button');

      expect(button.props.accessibilityState.disabled).toBe(true);
    });

    it('should enable submit when name has 2 characters', () => {
      const { getByTestId } = render(
        <CreateHabitFormCentered {...defaultProps} habitName='ab' />
      );
      const button = getByTestId('create-habit-button');

      expect(button.props.accessibilityState.disabled).toBe(false);
    });

    it('should enable submit when name has valid length', () => {
      const { getByTestId } = render(
        <CreateHabitFormCentered {...defaultProps} habitName='Read books' />
      );
      const button = getByTestId('create-habit-button');

      expect(button.props.accessibilityState.disabled).toBe(false);
    });

    it('should call onSubmit when button pressed with valid name', () => {
      const { getByTestId } = render(
        <CreateHabitFormCentered {...defaultProps} habitName='Read' />
      );
      const button = getByTestId('create-habit-button');

      fireEvent.press(button);

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it('should not call onSubmit when disabled', () => {
      const { getByTestId } = render(<CreateHabitFormCentered {...defaultProps} />);
      const button = getByTestId('create-habit-button');

      fireEvent.press(button);

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Handling', () => {
    it('should call onSubmit when Enter pressed with valid name', () => {
      const { getByTestId } = render(
        <CreateHabitFormCentered {...defaultProps} habitName='Read' />
      );
      const input = getByTestId('habit-name-input');

      fireEvent(input, 'onSubmitEditing');

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it('should not call onSubmit when Enter pressed with invalid name', () => {
      const { getByTestId } = render(
        <CreateHabitFormCentered {...defaultProps} habitName='a' />
      );
      const input = getByTestId('habit-name-input');

      fireEvent(input, 'onSubmitEditing');

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should have returnKeyType "done" for input', () => {
      const { getByTestId } = render(<CreateHabitFormCentered {...defaultProps} />);
      const input = getByTestId('habit-name-input');

      expect(input.props.returnKeyType).toBe('done');
    });
  });

  describe('Accessibility', () => {
    it('should have accessibility label for heading', () => {
      const { getByText } = render(<CreateHabitFormCentered {...defaultProps} />);
      const heading = getByText(/What habit do you/i);

      expect(heading.props.accessibilityRole).toBe('header');
    });

    it('should have accessibility label for name input', () => {
      const { getByTestId } = render(<CreateHabitFormCentered {...defaultProps} />);
      const input = getByTestId('habit-name-input');

      expect(input.props.accessibilityLabel).toBe('Habit name');
      expect(input.props.accessibilityHint).toBe(
        'Enter the name of your new habit'
      );
    });

    it('should have accessibility hint for character counter', () => {
      const { getByText } = render(
        <CreateHabitFormCentered {...defaultProps} habitName='Test' />
      );
      const counter = getByText('4/50 characters');

      expect(counter.props.accessibilityHint).toBe(
        '4 of 50 characters used'
      );
    });

    it('should have accessibility labels for submit button', () => {
      const { getByTestId } = render(
        <CreateHabitFormCentered {...defaultProps} habitName='Read' />
      );
      const button = getByTestId('create-habit-button');

      expect(button.props.accessibilityLabel).toBe(
        STRINGS.CREATE_HABIT.createAction
      );
      expect(button.props.accessibilityHint).toBe('Creates your new habit');
      expect(button.props.accessibilityRole).toBe('button');
    });

    it('should announce disabled state for submit button', () => {
      const { getByTestId } = render(<CreateHabitFormCentered {...defaultProps} />);
      const button = getByTestId('create-habit-button');

      expect(button.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should trim whitespace for validation', () => {
      const { getByTestId } = render(
        <CreateHabitFormCentered {...defaultProps} habitName='  a  ' />
      );
      const button = getByTestId('create-habit-button');

      // "  a  " trimmed is "a" which is 1 character, should be disabled
      expect(button.props.accessibilityState.disabled).toBe(true);
    });

    it('should handle special characters in name', () => {
      const { getByTestId } = render(<CreateHabitFormCentered {...defaultProps} />);
      const input = getByTestId('habit-name-input');

      fireEvent.changeText(input, 'Read! 📚');

      expect(mockOnHabitNameChange).toHaveBeenCalledWith('Read! 📚');
    });

    it('should handle emoji in name', () => {
      const { getByTestId } = render(<CreateHabitFormCentered {...defaultProps} />);
      const input = getByTestId('habit-name-input');

      fireEvent.changeText(input, 'Read 📚 daily');

      expect(mockOnHabitNameChange).toHaveBeenCalledWith('Read 📚 daily');
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot with default props', () => {
      const { toJSON } = render(<CreateHabitFormCentered {...defaultProps} />);
      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with filled form', () => {
      const { toJSON } = render(
        <CreateHabitFormCentered
          {...defaultProps}
          habitName='Read for 20 minutes'
          selectedEmoji='📚'
          selectedColor='#8B5CF6'
          reminderOption='morning'
        />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with disabled submit button', () => {
      const { toJSON } = render(
        <CreateHabitFormCentered {...defaultProps} habitName='a' />
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
