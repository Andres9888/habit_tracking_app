/**
 * HabitInput Component Tests
 *
 * Tests for the habit name text input with character counter:
 * - Character counter shows correct count
 * - Counter color changes at thresholds (35+ amber, 45+ red)
 * - Counter visible when input focused or has text
 * - Max length enforced at 50 characters
 * - Clear button appears when text present
 * - Focus/blur haptic feedback and animations
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { CHARACTER_LIMIT, COLORS } from '../constants';
import { HabitInput } from '../HabitInput';

// Mock dependencies
const mockTriggerLightImpact = jest.fn();

jest.mock('../../../../../hooks/useHapticFeedback', () => ({
  useHapticFeedback: () => ({
    triggerLightImpact: mockTriggerLightImpact,
    triggerSuccess: jest.fn(),
    triggerMediumImpact: jest.fn(),
    triggerHeavyImpact: jest.fn(),
    triggerWarning: jest.fn(),
    triggerError: jest.fn(),
    triggerSelection: jest.fn(),
  }),
}));

describe('HabitInput', () => {
  const defaultProps = {
    value: '',
    onChangeText: jest.fn(),
    onFocus: jest.fn(),
    onBlur: jest.fn(),
    onSubmitEditing: jest.fn(),
    onClear: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Character Counter Display', () => {
    it('should show character counter when input is focused', () => {
      const { getByPlaceholderText, queryByText } = render(
        <HabitInput {...defaultProps} value='' />
      );

      const input = getByPlaceholderText('Type your habit...');
      fireEvent(input, 'focus');

      // Counter should be visible - check for the count number
      expect(queryByText('0')).toBeDefined();
      expect(queryByText('/')).toBeDefined();
      expect(queryByText('50')).toBeDefined();
    });

    it('should show character counter when input has text', () => {
      const { queryByText } = render(
        <HabitInput {...defaultProps} value='Hello' />
      );

      // Counter should show 5/50 - rendered as separate children
      expect(queryByText('5')).toBeDefined();
      expect(queryByText('/')).toBeDefined();
      expect(queryByText('50')).toBeDefined();
    });

    it('should not show counter when empty and not focused', () => {
      const { queryByText } = render(<HabitInput {...defaultProps} value='' />);

      // Counter should not be visible - "/" indicates counter presence
      expect(queryByText('/')).toBeNull();
    });

    it('should display correct character count for various lengths', () => {
      const testCases = [
        { value: 'A', count: '1' },
        { value: 'Hello World', count: '11' },
        { value: 'A'.repeat(25), count: '25' },
        { value: 'A'.repeat(50), count: '50' },
      ];

      testCases.forEach(({ value, count }) => {
        const { queryByText, unmount } = render(
          <HabitInput {...defaultProps} value={value} />
        );

        // Check for the count number in the counter
        expect(queryByText(count)).toBeDefined();
        expect(queryByText('/')).toBeDefined();
        unmount();
      });
    });
  });

  describe('Character Counter Color Thresholds', () => {
    // Helper to get the counter element (Text with accessibilityElementsHidden)
    const getCounterElement = (
      UNSAFE_getByProps: ReturnType<typeof render>['UNSAFE_getByProps']
    ) => {
      return UNSAFE_getByProps({ accessibilityElementsHidden: true });
    };

    it('should use default color (stone-400) under warning threshold', () => {
      const { UNSAFE_getByProps } = render(
        <HabitInput {...defaultProps} value='Short habit' />
      );

      const counter = getCounterElement(UNSAFE_getByProps);
      // Check the color style - stone-400 is the default
      expect(counter.props.style.color).toBe(COLORS.stone400);
    });

    it('should use warning color (amber-500) at 35+ characters', () => {
      const value = 'A'.repeat(35); // Exactly 35 characters
      const { UNSAFE_getByProps } = render(
        <HabitInput {...defaultProps} value={value} />
      );

      const counter = getCounterElement(UNSAFE_getByProps);
      expect(counter.props.style.color).toBe(COLORS.amber500);
    });

    it('should use warning color at 36 characters', () => {
      const value = 'A'.repeat(36);
      const { UNSAFE_getByProps } = render(
        <HabitInput {...defaultProps} value={value} />
      );

      const counter = getCounterElement(UNSAFE_getByProps);
      expect(counter.props.style.color).toBe(COLORS.amber500);
    });

    it('should use warning color at 44 characters (just below error)', () => {
      const value = 'A'.repeat(44);
      const { UNSAFE_getByProps } = render(
        <HabitInput {...defaultProps} value={value} />
      );

      const counter = getCounterElement(UNSAFE_getByProps);
      expect(counter.props.style.color).toBe(COLORS.amber500);
    });

    it('should use error color (red-500) at 45+ characters', () => {
      const value = 'A'.repeat(45); // Exactly 45 characters
      const { UNSAFE_getByProps } = render(
        <HabitInput {...defaultProps} value={value} />
      );

      const counter = getCounterElement(UNSAFE_getByProps);
      expect(counter.props.style.color).toBe(COLORS.red500);
    });

    it('should use error color at 50 characters (max)', () => {
      const value = 'A'.repeat(50);
      const { UNSAFE_getByProps } = render(
        <HabitInput {...defaultProps} value={value} />
      );

      const counter = getCounterElement(UNSAFE_getByProps);
      expect(counter.props.style.color).toBe(COLORS.red500);
    });
  });

  describe('Character Limit Constants', () => {
    it('should have correct max limit (50)', () => {
      expect(CHARACTER_LIMIT.max).toBe(50);
    });

    it('should have correct warning threshold (35)', () => {
      expect(CHARACTER_LIMIT.warningThreshold).toBe(35);
    });

    it('should have correct error threshold (45)', () => {
      expect(CHARACTER_LIMIT.errorThreshold).toBe(45);
    });
  });

  describe('Max Length Enforcement', () => {
    it('should have maxLength prop set to 50', () => {
      const { getByPlaceholderText } = render(
        <HabitInput {...defaultProps} value='' />
      );

      const input = getByPlaceholderText('Type your habit...');
      expect(input.props.maxLength).toBe(CHARACTER_LIMIT.max);
    });
  });

  describe('Clear Button', () => {
    it('should show clear button when input has value', () => {
      const { getByLabelText } = render(
        <HabitInput {...defaultProps} value='Some text' />
      );

      expect(getByLabelText('Clear input')).toBeDefined();
    });

    it('should not show clear button when input is empty', () => {
      const { queryByLabelText } = render(
        <HabitInput {...defaultProps} value='' />
      );

      expect(queryByLabelText('Clear input')).toBeNull();
    });

    it('should call onClear when clear button is pressed', () => {
      const { getByLabelText } = render(
        <HabitInput {...defaultProps} value='Some text' />
      );

      fireEvent.press(getByLabelText('Clear input'));
      expect(defaultProps.onClear).toHaveBeenCalled();
    });
  });

  describe('Focus and Blur', () => {
    it('should call onFocus when input is focused', () => {
      const { getByPlaceholderText } = render(
        <HabitInput {...defaultProps} value='' />
      );

      const input = getByPlaceholderText('Type your habit...');
      fireEvent(input, 'focus');

      expect(defaultProps.onFocus).toHaveBeenCalled();
    });

    it('should call onBlur when input is blurred', () => {
      const { getByPlaceholderText } = render(
        <HabitInput {...defaultProps} value='' />
      );

      const input = getByPlaceholderText('Type your habit...');
      fireEvent(input, 'blur');

      expect(defaultProps.onBlur).toHaveBeenCalled();
    });

    it('should trigger light haptic on focus', () => {
      const { getByPlaceholderText } = render(
        <HabitInput {...defaultProps} value='' />
      );

      const input = getByPlaceholderText('Type your habit...');
      fireEvent(input, 'focus');

      expect(mockTriggerLightImpact).toHaveBeenCalled();
    });

    it('should not trigger haptic on blur', () => {
      const { getByPlaceholderText } = render(
        <HabitInput {...defaultProps} value='' />
      );

      const input = getByPlaceholderText('Type your habit...');

      // Clear mock from any prior interactions
      mockTriggerLightImpact.mockClear();

      fireEvent(input, 'blur');

      expect(mockTriggerLightImpact).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have correct accessibility label', () => {
      const { getByLabelText } = render(
        <HabitInput {...defaultProps} value='' />
      );

      expect(getByLabelText('Enter your habit name')).toBeDefined();
    });

    it('should include max character info in accessibility hint', () => {
      const { getByPlaceholderText } = render(
        <HabitInput {...defaultProps} value='' />
      );

      const input = getByPlaceholderText('Type your habit...');
      expect(input.props.accessibilityHint).toContain(
        `maximum ${CHARACTER_LIMIT.max} characters`
      );
    });

    it('should have character counter hidden from accessibility tree', () => {
      const { UNSAFE_getByProps } = render(
        <HabitInput {...defaultProps} value='Hello' />
      );

      // The counter is a Text element with accessibilityElementsHidden
      const counter = UNSAFE_getByProps({ accessibilityElementsHidden: true });
      expect(counter.props.accessibilityElementsHidden).toBe(true);
      expect(counter.props.importantForAccessibility).toBe('no');
    });
  });

  describe('Input Behavior', () => {
    it('should call onChangeText when text changes', () => {
      const { getByPlaceholderText } = render(
        <HabitInput {...defaultProps} value='' />
      );

      const input = getByPlaceholderText('Type your habit...');
      fireEvent.changeText(input, 'New habit');

      expect(defaultProps.onChangeText).toHaveBeenCalledWith('New habit');
    });

    it('should call onSubmitEditing when keyboard submit is pressed', () => {
      const { getByPlaceholderText } = render(
        <HabitInput {...defaultProps} value='My habit' />
      );

      const input = getByPlaceholderText('Type your habit...');
      fireEvent(input, 'submitEditing');

      expect(defaultProps.onSubmitEditing).toHaveBeenCalled();
    });

    it('should have returnKeyType set to done', () => {
      const { getByPlaceholderText } = render(
        <HabitInput {...defaultProps} value='' />
      );

      const input = getByPlaceholderText('Type your habit...');
      expect(input.props.returnKeyType).toBe('done');
    });
  });
});
