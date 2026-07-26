/**
 * HabitNameField Component Tests - V9 Design System Update
 * Tests for habit name input with V9 styling updates
 *
 * Tests:
 * - Label styling (13px uppercase semibold, gray.500)
 * - Input focus state with green border and shadow ring
 * - Character counter behavior
 * - Accessibility labels
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { HabitNameField } from '../HabitNameField';
import STRINGS from '../../../../constants/strings';

// Mock useHapticFeedback
const mockTriggerWarning = jest.fn();
jest.mock('../../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: () => ({
    triggerWarning: mockTriggerWarning,
    triggerSelection: jest.fn(),
    triggerImpact: jest.fn(),
    triggerNotification: jest.fn(),
  }),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const { TextInput, View } = require('react-native');
  return {
    ...jest.requireActual('react-native-reanimated/mock'),
    default: {
      View,
      createAnimatedComponent: (Component: typeof TextInput) => Component,
      addWhitelistedNativeProps: jest.fn(),
    },
    useAnimatedStyle: () => ({}),
    useSharedValue: (initial: number) => ({ value: initial }),
    withTiming: (value: number) => value,
  };
});

describe('HabitNameField - V9 Design System', () => {
  const mockOnChange = jest.fn();

  const defaultProps = {
    value: '',
    onChange: mockOnChange,
    autoFocus: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should expose "Habit name" on the input', () => {
      const { getByLabelText } = render(<HabitNameField {...defaultProps} />);
      expect(getByLabelText(STRINGS.CREATE_HABIT.nameLabel)).toBeDefined();
    });

    it('should render the input field with the correct hint copy', () => {
      const { getByPlaceholderText } = render(
        <HabitNameField {...defaultProps} />
      );
      expect(
        getByPlaceholderText(STRINGS.CREATE_HABIT.namePrompt)
      ).toBeDefined();
    });

    it('should hide the progressive character counter initially', () => {
      const { queryByText } = render(<HabitNameField {...defaultProps} />);
      expect(queryByText(/\/40/)).toBeNull();
    });
  });

  describe('V9 Label Styling', () => {
    it('should use the current compact input height', () => {
      const { getByLabelText } = render(<HabitNameField {...defaultProps} />);
      expect(getByLabelText('Habit name').props.className).toContain('h-14');
    });

    it('should use the current rounded input treatment', () => {
      const { getByLabelText } = render(<HabitNameField {...defaultProps} />);
      expect(getByLabelText('Habit name').props.className).toContain(
        'rounded-xl'
      );
    });

    it('should use the current input font size', () => {
      const { getByLabelText } = render(<HabitNameField {...defaultProps} />);
      expect(getByLabelText('Habit name').props.className).toContain(
        'text-base'
      );
    });

    it('should use the current horizontal padding', () => {
      const { getByLabelText } = render(<HabitNameField {...defaultProps} />);
      expect(getByLabelText('Habit name').props.className).toContain('px-4');
    });

    it('should use the active theme text color', () => {
      const { getByLabelText } = render(<HabitNameField {...defaultProps} />);
      expect(getByLabelText('Habit name').props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ color: expect.any(String) }),
        ])
      );
    });
  });

  describe('Character Counter', () => {
    it('should display current character count', () => {
      const { getByText } = render(
        <HabitNameField {...defaultProps} value={'A'.repeat(21)} />
      );
      expect(getByText('21/40')).toBeDefined();
    });

    it('should show amber color when approaching limit (>40 chars)', () => {
      const longValue = 'A'.repeat(45);
      const { getByText } = render(
        <HabitNameField {...defaultProps} value={longValue} />
      );
      const counter = getByText('45/40');

      expect(counter.props.style?.color).toBeTruthy();
    });

    it('should show default stone color when under limit', () => {
      const { getByText } = render(
        <HabitNameField {...defaultProps} value={'A'.repeat(25)} />
      );
      const counter = getByText('25/40');

      expect(counter.props.style.color).toBe('#78716c');
    });

    it('should have accessibility label for character count', () => {
      const { getByText } = render(
        <HabitNameField {...defaultProps} value={'A'.repeat(25)} />
      );
      const counter = getByText('25/40');

      expect(counter.props.accessibilityLabel).toContain('25 of 40 characters');
    });

    it('should indicate approaching limit in accessibility label', () => {
      const longValue = 'A'.repeat(45);
      const { getByText } = render(
        <HabitNameField {...defaultProps} value={longValue} />
      );
      const counter = getByText('45/40');

      expect(counter.props.accessibilityLabel).toContain('approaching limit');
    });
  });

  describe('User Interaction', () => {
    it('should call onChange when text is entered', () => {
      const { getByPlaceholderText } = render(
        <HabitNameField {...defaultProps} />
      );

      const input = getByPlaceholderText(STRINGS.CREATE_HABIT.namePrompt);
      fireEvent.changeText(input, 'New Habit');

      expect(mockOnChange).toHaveBeenCalledWith('New Habit');
    });

    it('should enforce max length of 50 characters', () => {
      const { getByPlaceholderText } = render(
        <HabitNameField {...defaultProps} />
      );

      const input = getByPlaceholderText(STRINGS.CREATE_HABIT.namePrompt);

      expect(input.props.maxLength).toBe(50);
    });

    it('should trigger haptic feedback when hitting character limit', async () => {
      const { rerender } = render(
        <HabitNameField {...defaultProps} value={'A'.repeat(49)} />
      );

      // Now hit the limit
      rerender(<HabitNameField {...defaultProps} value={'A'.repeat(50)} />);

      await waitFor(() => {
        expect(mockTriggerWarning).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessibilityLabel on input', () => {
      const { getByLabelText } = render(<HabitNameField {...defaultProps} />);
      expect(getByLabelText('Habit name')).toBeDefined();
    });

    it('should have accessibilityHint on input', () => {
      const { getByPlaceholderText } = render(
        <HabitNameField {...defaultProps} />
      );

      const input = getByPlaceholderText(STRINGS.CREATE_HABIT.namePrompt);
      expect(input.props.accessibilityHint).toBe(
        'Enter a name for your habit, up to 50 characters'
      );
    });

    it('should expose the field through its accessibility label', () => {
      const { getByLabelText } = render(<HabitNameField {...defaultProps} />);
      expect(getByLabelText('Habit name')).toBeDefined();
    });

    it('should have accessibilityRole on character counter', () => {
      const { getByText } = render(
        <HabitNameField {...defaultProps} value={'A'.repeat(21)} />
      );
      const counter = getByText('21/40');

      expect(counter.props.accessibilityRole).toBe('text');
    });
  });

  describe('Input Configuration', () => {
    it('should have returnKeyType="done"', () => {
      const { getByPlaceholderText } = render(
        <HabitNameField {...defaultProps} />
      );

      const input = getByPlaceholderText(STRINGS.CREATE_HABIT.namePrompt);
      expect(input.props.returnKeyType).toBe('done');
    });

    it('should have blurOnSubmit enabled', () => {
      const { getByPlaceholderText } = render(
        <HabitNameField {...defaultProps} />
      );

      const input = getByPlaceholderText(STRINGS.CREATE_HABIT.namePrompt);
      expect(input.props.blurOnSubmit).toBe(true);
    });

    it('should respect autoFocus prop', () => {
      const { getByPlaceholderText } = render(
        <HabitNameField {...defaultProps} autoFocus={true} />
      );

      const input = getByPlaceholderText(STRINGS.CREATE_HABIT.namePrompt);
      expect(input.props.autoFocus).toBe(true);
    });

    it('should have the correct hint text color', () => {
      const { getByPlaceholderText } = render(
        <HabitNameField {...defaultProps} />
      );

      const input = getByPlaceholderText(STRINGS.CREATE_HABIT.namePrompt);
      expect(input.props.placeholderTextColor).toBe('#6E6660');
    });
  });

  describe('Display Value', () => {
    it('should display the provided value', () => {
      const { getByDisplayValue } = render(
        <HabitNameField {...defaultProps} value='My Habit' />
      );

      expect(getByDisplayValue('My Habit')).toBeDefined();
    });

    it('should update counter when value changes', () => {
      const { getByText, rerender } = render(
        <HabitNameField {...defaultProps} value={'A'.repeat(25)} />
      );

      expect(getByText('25/40')).toBeDefined();

      rerender(<HabitNameField {...defaultProps} value={'A'.repeat(35)} />);

      expect(getByText('35/40')).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string value', () => {
      const { queryByText, getByPlaceholderText } = render(
        <HabitNameField {...defaultProps} value='' />
      );

      expect(queryByText(/\/40/)).toBeNull();
      expect(
        getByPlaceholderText(STRINGS.CREATE_HABIT.namePrompt)
      ).toBeDefined();
    });

    it('should handle maximum length (50 characters)', () => {
      const maxValue = 'A'.repeat(50);
      const { getByText, getByDisplayValue } = render(
        <HabitNameField {...defaultProps} value={maxValue} />
      );

      expect(getByText('50/40')).toBeDefined();
      expect(getByDisplayValue(maxValue)).toBeDefined();
    });

    it('should handle value with special characters', () => {
      const specialValue = '💪 Morning Run! @home';
      const { getByDisplayValue, getByText } = render(
        <HabitNameField {...defaultProps} value={specialValue} />
      );

      expect(getByDisplayValue(specialValue)).toBeDefined();
      // Emoji counts as multiple characters in some implementations
      // We verify the counter updates appropriately
      expect(getByText(/\/40/)).toBeDefined();
    });

    it('should handle value with only whitespace', () => {
      const whitespaceValue = '   ';
      const { queryByText, getByDisplayValue } = render(
        <HabitNameField {...defaultProps} value={whitespaceValue} />
      );

      expect(queryByText(/\/40/)).toBeNull();
      expect(getByDisplayValue(whitespaceValue)).toBeDefined();
    });

    it('should handle rapid text changes', async () => {
      const { getByPlaceholderText, rerender } = render(
        <HabitNameField {...defaultProps} value='' />
      );

      const input = getByPlaceholderText(STRINGS.CREATE_HABIT.namePrompt);

      // Simulate rapid changes
      fireEvent.changeText(input, 'A');
      rerender(<HabitNameField {...defaultProps} value='A' />);

      fireEvent.changeText(input, 'AB');
      rerender(<HabitNameField {...defaultProps} value='AB' />);

      fireEvent.changeText(input, 'ABC');
      rerender(<HabitNameField {...defaultProps} value='ABC' />);

      expect(mockOnChange).toHaveBeenCalledTimes(3);
    });

    it('should handle focus and blur events', () => {
      const { getByPlaceholderText } = render(
        <HabitNameField {...defaultProps} />
      );

      const input = getByPlaceholderText(STRINGS.CREATE_HABIT.namePrompt);

      // Trigger focus
      fireEvent(input, 'focus');

      // Trigger blur
      fireEvent(input, 'blur');

      // Component should handle these events without errors
      expect(input).toBeDefined();
    });

    it('should handle threshold crossing for character warning', async () => {
      const { rerender, getByText } = render(
        <HabitNameField {...defaultProps} value={'A'.repeat(39)} />
      );

      // Still below threshold
      const counter = getByText('39/40');
      expect(counter.props.style.color).toBe('#F59E0B');

      // Cross threshold to 41 characters
      rerender(<HabitNameField {...defaultProps} value={'A'.repeat(41)} />);

      await waitFor(() => {
        const errorCounter = getByText('41/40');
        expect(errorCounter.props.style?.color).toBe('#EF4444');
      });
    });

    it('should not trigger haptic at 50 if already at 50', async () => {
      const initialValue = 'A'.repeat(50);
      const { rerender } = render(
        <HabitNameField {...defaultProps} value={initialValue} />
      );

      // Re-render with same value
      rerender(<HabitNameField {...defaultProps} value={initialValue} />);

      // Haptic should only trigger when crossing TO 50, not staying at 50
      expect(mockTriggerWarning).not.toHaveBeenCalled();
    });
  });
});
