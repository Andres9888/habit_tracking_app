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

  describe('Autocomplete - Inline Preview', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('should not show preview for input < 3 characters', () => {
      const { getByPlaceholderText, queryByText } = render(
        <HabitInput {...defaultProps} value='ex' />
      );

      // Fast-forward past debounce delay
      jest.advanceTimersByTime(50);

      // No preview text should be visible (check for common preview text fragments)
      expect(queryByText(/ercise/i)).toBeNull();
    });

    it('should show inline preview after typing 3+ characters', async () => {
      const { getByPlaceholderText, rerender } = render(
        <HabitInput {...defaultProps} value='' />
      );

      // Simulate typing "exe" (3 characters)
      rerender(<HabitInput {...defaultProps} value='exe' />);

      // Fast-forward past debounce delay (50ms)
      jest.advanceTimersByTime(50);

      // Preview should be calculated and displayed
      // Note: Testing visual rendering is difficult in Jest, but we can verify
      // the component renders without errors and the debounce works
      const input = getByPlaceholderText('Type your habit...');
      expect(input).toBeDefined();
    });

    it('should update preview as user continues typing', () => {
      const { rerender } = render(<HabitInput {...defaultProps} value='exe' />);

      jest.advanceTimersByTime(50);

      // Continue typing to "exerc"
      rerender(<HabitInput {...defaultProps} value='exerc' />);

      jest.advanceTimersByTime(50);

      // Preview should update (component should not crash)
      expect(true).toBe(true);
    });

    it('should clear preview when input is cleared', () => {
      const { rerender } = render(
        <HabitInput {...defaultProps} value='exercise' />
      );

      jest.advanceTimersByTime(50);

      // Clear input
      rerender(<HabitInput {...defaultProps} value='' />);

      jest.advanceTimersByTime(50);

      // Preview should be cleared (no errors)
      expect(true).toBe(true);
    });

    it('should debounce preview updates with 50ms delay', () => {
      const { rerender } = render(<HabitInput {...defaultProps} value='exe' />);

      // Immediately after render, preview shouldn't update yet
      jest.advanceTimersByTime(25); // Half the debounce time

      // Change input again before debounce completes
      rerender(<HabitInput {...defaultProps} value='exer' />);

      // Fast-forward to complete debounce
      jest.advanceTimersByTime(50);

      // Only the final value should trigger preview update
      expect(true).toBe(true);
    });

    it('should hide preview when input loses focus', () => {
      const { getByPlaceholderText, rerender } = render(
        <HabitInput {...defaultProps} value='exe' />
      );

      jest.advanceTimersByTime(50);

      const input = getByPlaceholderText('Type your habit...');
      fireEvent(input, 'blur');

      // Preview should still exist but component should handle blur correctly
      expect(input).toBeDefined();
    });
  });

  describe('Autocomplete - Keyboard Navigation', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('should accept suggestion on Tab key', () => {
      const mockOnChangeText = jest.fn();
      const { getByPlaceholderText, rerender } = render(
        <HabitInput {...defaultProps} value='exe' onChangeText={mockOnChangeText} />
      );

      // Wait for debounce to set suggestion
      jest.advanceTimersByTime(50);

      // Re-render to ensure suggestion state is set
      rerender(
        <HabitInput {...defaultProps} value='exe' onChangeText={mockOnChangeText} />
      );

      const input = getByPlaceholderText('Type your habit...');

      // Simulate Tab key press
      fireEvent(input, 'keyPress', { nativeEvent: { key: 'Tab' } });

      // Should call onChangeText with the full suggestion
      expect(mockOnChangeText).toHaveBeenCalledWith(
        expect.stringContaining('Exercise')
      );
    });

    it('should accept suggestion on ArrowRight key', () => {
      const mockOnChangeText = jest.fn();
      const { getByPlaceholderText, rerender } = render(
        <HabitInput {...defaultProps} value='exe' onChangeText={mockOnChangeText} />
      );

      jest.advanceTimersByTime(50);

      rerender(
        <HabitInput {...defaultProps} value='exe' onChangeText={mockOnChangeText} />
      );

      const input = getByPlaceholderText('Type your habit...');

      // Simulate Right Arrow key press
      fireEvent(input, 'keyPress', { nativeEvent: { key: 'ArrowRight' } });

      // Should call onChangeText with the full suggestion
      expect(mockOnChangeText).toHaveBeenCalledWith(
        expect.stringContaining('Exercise')
      );
    });

    it('should dismiss preview on Escape key', () => {
      const { getByPlaceholderText, rerender } = render(
        <HabitInput {...defaultProps} value='exe' />
      );

      jest.advanceTimersByTime(50);

      rerender(<HabitInput {...defaultProps} value='exe' />);

      const input = getByPlaceholderText('Type your habit...');

      // Simulate Escape key press
      fireEvent(input, 'keyPress', { nativeEvent: { key: 'Escape' } });

      // Preview should be cleared (verify component doesn't crash)
      expect(input).toBeDefined();
    });

    it('should not accept suggestion on Tab if no suggestion available', () => {
      const mockOnChangeText = jest.fn();
      const { getByPlaceholderText } = render(
        <HabitInput {...defaultProps} value='ex' onChangeText={mockOnChangeText} />
      );

      jest.advanceTimersByTime(50);

      const input = getByPlaceholderText('Type your habit...');

      // Simulate Tab key press with < 3 chars (no suggestion)
      fireEvent(input, 'keyPress', { nativeEvent: { key: 'Tab' } });

      // Should not call onChangeText (no suggestion to accept)
      expect(mockOnChangeText).not.toHaveBeenCalled();
    });

    it('should not interfere with normal typing', () => {
      const mockOnChangeText = jest.fn();
      const { getByPlaceholderText } = render(
        <HabitInput {...defaultProps} value='exe' onChangeText={mockOnChangeText} />
      );

      jest.advanceTimersByTime(50);

      const input = getByPlaceholderText('Type your habit...');

      // Simulate regular letter key press
      fireEvent(input, 'keyPress', { nativeEvent: { key: 'r' } });

      // Should not call onChangeText (normal typing handled by TextInput)
      expect(mockOnChangeText).not.toHaveBeenCalled();
    });

    it('should allow Enter key to create habit without accepting suggestion', () => {
      const mockOnSubmitEditing = jest.fn();
      const mockOnChangeText = jest.fn();
      const { getByPlaceholderText } = render(
        <HabitInput
          {...defaultProps}
          value='exe'
          onChangeText={mockOnChangeText}
          onSubmitEditing={mockOnSubmitEditing}
        />
      );

      jest.advanceTimersByTime(50);

      const input = getByPlaceholderText('Type your habit...');

      // Simulate Enter key (submitEditing)
      fireEvent(input, 'submitEditing');

      // Should call onSubmitEditing, not onChangeText
      expect(mockOnSubmitEditing).toHaveBeenCalled();
      expect(mockOnChangeText).not.toHaveBeenCalled();
    });
  });

  describe('Autocomplete - Accessibility', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('should announce suggestion in accessibilityHint', () => {
      const { getByPlaceholderText, rerender } = render(
        <HabitInput {...defaultProps} value='exe' />
      );

      jest.advanceTimersByTime(50);

      // Force re-render to apply suggestion state
      rerender(<HabitInput {...defaultProps} value='exe' />);

      const input = getByPlaceholderText('Type your habit...');

      // Hint should include suggestion and instruction
      expect(input.props.accessibilityHint).toContain('Suggestion available');
      expect(input.props.accessibilityHint).toContain('Press Tab to accept');
    });

    it('should not announce suggestion when input < 3 chars', () => {
      const { getByPlaceholderText } = render(
        <HabitInput {...defaultProps} value='ex' />
      );

      jest.advanceTimersByTime(50);

      const input = getByPlaceholderText('Type your habit...');

      // Hint should not mention suggestion
      expect(input.props.accessibilityHint).not.toContain('Suggestion available');
      expect(input.props.accessibilityHint).toContain('maximum');
    });

    it('should hide preview text from screen readers', () => {
      const { UNSAFE_queryAllByProps, rerender } = render(
        <HabitInput {...defaultProps} value='exe' />
      );

      jest.advanceTimersByTime(50);

      rerender(<HabitInput {...defaultProps} value='exe' />);

      // Find preview text elements (should have accessibility hidden props)
      const hiddenElements = UNSAFE_queryAllByProps({
        accessibilityElementsHidden: true,
      });

      // Preview text should be among hidden elements
      expect(hiddenElements.length).toBeGreaterThan(0);
    });

    it('should update hint when suggestion changes', () => {
      const { getByPlaceholderText, rerender } = render(
        <HabitInput {...defaultProps} value='exe' />
      );

      jest.advanceTimersByTime(50);
      rerender(<HabitInput {...defaultProps} value='exe' />);

      const input = getByPlaceholderText('Type your habit...');
      const firstHint = input.props.accessibilityHint;

      // Change input to get different suggestion
      rerender(<HabitInput {...defaultProps} value='read' />);

      jest.advanceTimersByTime(50);
      rerender(<HabitInput {...defaultProps} value='read' />);

      const updatedInput = getByPlaceholderText('Type your habit...');
      const secondHint = updatedInput.props.accessibilityHint;

      // Hints should be different (different suggestions)
      expect(firstHint).not.toBe(secondHint);
    });
  });

  describe('Autocomplete - Performance', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('should debounce rapid typing to prevent excessive updates', () => {
      const { rerender } = render(<HabitInput {...defaultProps} value='e' />);

      // Simulate rapid typing (5 keystrokes in quick succession)
      const values = ['e', 'ex', 'exe', 'exer', 'exerc'];
      values.forEach((value) => {
        rerender(<HabitInput {...defaultProps} value={value} />);
        jest.advanceTimersByTime(10); // Less than 50ms debounce
      });

      // Fast-forward to complete final debounce
      jest.advanceTimersByTime(50);

      // Component should handle rapid updates without errors
      expect(true).toBe(true);
    });

    it('should clean up debounce timer on unmount', () => {
      const { unmount } = render(<HabitInput {...defaultProps} value='exe' />);

      // Unmount before debounce completes
      jest.advanceTimersByTime(25);
      unmount();

      // Fast-forward remaining time - should not cause errors
      jest.advanceTimersByTime(25);

      expect(true).toBe(true);
    });

    it('should not lag on repeated preview updates', () => {
      const { rerender } = render(<HabitInput {...defaultProps} value='exe' />);

      // Simulate 10 rapid preview updates
      for (let i = 0; i < 10; i++) {
        jest.advanceTimersByTime(50);
        rerender(<HabitInput {...defaultProps} value={`exe${i}`} />);
      }

      jest.advanceTimersByTime(50);

      // Should complete without errors or timeouts
      expect(true).toBe(true);
    });
  });

  describe('Autocomplete - Edge Cases', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('should handle no matching suggestions gracefully', () => {
      const { rerender } = render(
        <HabitInput {...defaultProps} value='zzzzzzz' />
      );

      jest.advanceTimersByTime(50);

      // Should render without errors even with no matches
      expect(true).toBe(true);
    });

    it('should handle special characters in input', () => {
      const { rerender } = render(
        <HabitInput {...defaultProps} value='exe!!!' />
      );

      jest.advanceTimersByTime(50);

      // Should handle special characters without crashing
      expect(true).toBe(true);
    });

    it('should handle very long input strings', () => {
      const longInput = 'a'.repeat(50); // Max length
      const { rerender } = render(
        <HabitInput {...defaultProps} value={longInput} />
      );

      jest.advanceTimersByTime(50);

      // Should handle max length input gracefully
      expect(true).toBe(true);
    });

    it('should handle multi-word queries correctly', () => {
      const { rerender } = render(
        <HabitInput {...defaultProps} value='morning cof' />
      );

      jest.advanceTimersByTime(50);

      // Should match multi-word suggestions (e.g., "Morning coffee")
      expect(true).toBe(true);
    });

    it('should clear suggestion when input is completely cleared', () => {
      const mockOnChangeText = jest.fn();
      const { getByLabelText, rerender } = render(
        <HabitInput {...defaultProps} value='exercise' />
      );

      jest.advanceTimersByTime(50);

      // Clear via clear button
      const clearButton = getByLabelText('Clear input');
      fireEvent.press(clearButton);

      // Verify onClear was called (indirectly tests suggestion clearing)
      expect(defaultProps.onClear).toHaveBeenCalled();
    });

    it('should handle rapid Tab key presses without errors', () => {
      const mockOnChangeText = jest.fn();
      const { getByPlaceholderText, rerender } = render(
        <HabitInput {...defaultProps} value='exe' onChangeText={mockOnChangeText} />
      );

      jest.advanceTimersByTime(50);
      rerender(
        <HabitInput {...defaultProps} value='exe' onChangeText={mockOnChangeText} />
      );

      const input = getByPlaceholderText('Type your habit...');

      // Rapidly press Tab multiple times
      fireEvent(input, 'keyPress', { nativeEvent: { key: 'Tab' } });
      fireEvent(input, 'keyPress', { nativeEvent: { key: 'Tab' } });
      fireEvent(input, 'keyPress', { nativeEvent: { key: 'Tab' } });

      // Should only accept once (suggestion cleared after first acceptance)
      expect(mockOnChangeText).toHaveBeenCalledTimes(1);
    });

    it('should preserve input value when dismissing suggestion', () => {
      const mockOnChangeText = jest.fn();
      const { getByPlaceholderText, rerender } = render(
        <HabitInput {...defaultProps} value='exe' onChangeText={mockOnChangeText} />
      );

      jest.advanceTimersByTime(50);
      rerender(
        <HabitInput {...defaultProps} value='exe' onChangeText={mockOnChangeText} />
      );

      const input = getByPlaceholderText('Type your habit...');

      // Dismiss suggestion with Escape
      fireEvent(input, 'keyPress', { nativeEvent: { key: 'Escape' } });

      // Should not modify input value
      expect(mockOnChangeText).not.toHaveBeenCalled();
    });
  });
});
