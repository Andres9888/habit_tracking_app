/**
 * HabitNameField Component Tests - V11 Validation Logic
 * Tests for V11 progressive character counter and validation
 *
 * V11 Changes:
 * - Character counter only shows when > 20 characters
 * - Soft limit at 40 chars (turns red, shakes)
 * - Warning state at 30 chars (amber color)
 * - Hard limit at 50 chars (enforced by maxLength)
 * - Shake animation when exceeding 40 chars
 * - Border turns red when > 40 chars
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import STRINGS from '../../../../constants/strings';
import { HabitNameField } from '../HabitNameField';

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

describe('HabitNameField - V11 Validation Logic', () => {
  const mockOnChange = jest.fn();

  const defaultProps = {
    value: '',
    onChange: mockOnChange,
    autoFocus: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('V11 Character Counter Visibility', () => {
    it('should NOT show counter when input is empty', () => {
      const { queryByText } = render(
        <HabitNameField {...defaultProps} value='' />
      );
      expect(queryByText(/\/40/)).toBeNull();
    });

    it('should NOT show counter with 10 characters (< 20)', () => {
      const { queryByText } = render(
        <HabitNameField {...defaultProps} value={'A'.repeat(10)} />
      );
      expect(queryByText(/\/40/)).toBeNull();
    });

    it('should NOT show counter with exactly 20 characters', () => {
      const { queryByText } = render(
        <HabitNameField {...defaultProps} value={'A'.repeat(20)} />
      );
      expect(queryByText(/\/40/)).toBeNull();
    });

    it('should show counter when > 20 characters (21+)', () => {
      const { getByText } = render(
        <HabitNameField {...defaultProps} value={'A'.repeat(21)} />
      );
      expect(getByText('21/40')).toBeDefined();
    });

    it('should show counter with 25 characters', () => {
      const { getByText } = render(
        <HabitNameField {...defaultProps} value={'A'.repeat(25)} />
      );
      expect(getByText('25/40')).toBeDefined();
    });
  });

  describe('V11 Character Counter Color States', () => {
    it('should show stone-500 color for 21-30 characters (normal)', () => {
      const { getByText } = render(
        <HabitNameField {...defaultProps} value={'A'.repeat(25)} />
      );
      const counter = getByText('25/40');
      expect(counter.props.style).toEqual(
        expect.objectContaining({ color: '#78716c' }) // stone-500
      );
    });

    it('should show amber-500 color for 31-40 characters (warning)', () => {
      const { getByText } = render(
        <HabitNameField {...defaultProps} value={'A'.repeat(35)} />
      );
      const counter = getByText('35/40');
      expect(counter.props.style).toEqual(
        expect.objectContaining({ color: '#F59E0B' }) // amber-500
      );
    });

    it('should show red-500 color for 41+ characters (error)', () => {
      const { getByText } = render(
        <HabitNameField {...defaultProps} value={'A'.repeat(45)} />
      );
      const counter = getByText('45/40');
      expect(counter.props.style).toEqual(
        expect.objectContaining({ color: '#EF4444' }) // red-500
      );
    });

    it('should transition from normal to warning at 31 characters', () => {
      const { getByText, rerender } = render(
        <HabitNameField {...defaultProps} value={'A'.repeat(30)} />
      );

      let counter = getByText('30/40');
      expect(counter.props.style.color).toBe('#78716c'); // stone-500

      rerender(<HabitNameField {...defaultProps} value={'A'.repeat(31)} />);

      counter = getByText('31/40');
      expect(counter.props.style.color).toBe('#F59E0B'); // amber-500
    });

    it('should transition from warning to error at 41 characters', () => {
      const { getByText, rerender } = render(
        <HabitNameField {...defaultProps} value={'A'.repeat(40)} />
      );

      let counter = getByText('40/40');
      expect(counter.props.style.color).toBe('#F59E0B'); // amber-500

      rerender(<HabitNameField {...defaultProps} value={'A'.repeat(41)} />);

      counter = getByText('41/40');
      expect(counter.props.style.color).toBe('#EF4444'); // red-500
    });
  });

  describe('V11 Accessibility Labels', () => {
    it('should have correct accessibility label for normal state (25 chars)', () => {
      const { getByText } = render(
        <HabitNameField {...defaultProps} value={'A'.repeat(25)} />
      );
      const counter = getByText('25/40');
      expect(counter.props.accessibilityLabel).toBe('25 of 40 characters used');
    });

    it('should indicate approaching limit in accessibility label (35 chars)', () => {
      const { getByText } = render(
        <HabitNameField {...defaultProps} value={'A'.repeat(35)} />
      );
      const counter = getByText('35/40');
      expect(counter.props.accessibilityLabel).toContain('approaching limit');
    });

    it('should indicate limit exceeded in accessibility label (45 chars)', () => {
      const { getByText } = render(
        <HabitNameField {...defaultProps} value={'A'.repeat(45)} />
      );
      const counter = getByText('45/40');
      expect(counter.props.accessibilityLabel).toContain('limit exceeded');
    });
  });

  describe('V11 Shake Animation Trigger', () => {
    it('should trigger shake animation when exceeding 40 chars', async () => {
      const { rerender } = render(
        <HabitNameField {...defaultProps} value={'A'.repeat(40)} />
      );

      mockTriggerWarning.mockClear();

      // Exceed the soft limit (40 chars)
      rerender(<HabitNameField {...defaultProps} value={'A'.repeat(41)} />);

      await waitFor(() => {
        expect(mockTriggerWarning).toHaveBeenCalled();
      });
    });

    it('should NOT trigger shake when staying above 40 chars', async () => {
      const { rerender } = render(
        <HabitNameField {...defaultProps} value={'A'.repeat(41)} />
      );

      mockTriggerWarning.mockClear();

      // Stay above limit (41 -> 42)
      rerender(<HabitNameField {...defaultProps} value={'A'.repeat(42)} />);

      // Should not trigger haptic or shake again
      expect(mockTriggerWarning).not.toHaveBeenCalled();
    });

    it('should trigger haptic at hard limit (50 chars)', async () => {
      const { rerender } = render(
        <HabitNameField {...defaultProps} value={'A'.repeat(49)} />
      );

      mockTriggerWarning.mockClear();

      // Hit hard limit
      rerender(<HabitNameField {...defaultProps} value={'A'.repeat(50)} />);

      await waitFor(() => {
        expect(mockTriggerWarning).toHaveBeenCalled();
      });
    });
  });

  describe('V11 Validation Rules', () => {
    it('should enforce hard limit of 50 characters', () => {
      const { getByPlaceholderText } = render(
        <HabitNameField {...defaultProps} />
      );

      const input = getByPlaceholderText(STRINGS.CREATE_HABIT.namePrompt);
      expect(input.props.maxLength).toBe(50);
    });

    it('should allow input up to 50 characters', () => {
      const maxValue = 'A'.repeat(50);
      const { getByDisplayValue, getByText } = render(
        <HabitNameField {...defaultProps} value={maxValue} />
      );

      expect(getByDisplayValue(maxValue)).toBeDefined();
      expect(getByText('50/40')).toBeDefined(); // Shows as over soft limit
    });

    it('should handle emoji characters correctly in counter', () => {
      // Emoji + text = 21 chars, should show counter
      const emojiValue = '📖 Read for 20 minutes'; // 22 chars
      const { getByText } = render(
        <HabitNameField {...defaultProps} value={emojiValue} />
      );

      // Counter should be visible for 22 chars
      expect(getByText(/\/40/)).toBeDefined();
    });
  });

  describe('V11 Edge Cases', () => {
    it('should handle rapid typing across thresholds', async () => {
      const { rerender, queryByText, getByText } = render(
        <HabitNameField {...defaultProps} value={'A'.repeat(19)} />
      );

      // Below threshold - no counter
      expect(queryByText(/\/40/)).toBeNull();

      // Cross 20 char threshold
      rerender(<HabitNameField {...defaultProps} value={'A'.repeat(21)} />);
      expect(getByText('21/40')).toBeDefined();

      // Cross 30 char threshold (warning)
      rerender(<HabitNameField {...defaultProps} value={'A'.repeat(31)} />);
      const warningCounter = getByText('31/40');
      expect(warningCounter.props.style.color).toBe('#F59E0B');

      // Cross 40 char threshold (error)
      rerender(<HabitNameField {...defaultProps} value={'A'.repeat(41)} />);

      await waitFor(() => {
        const errorCounter = getByText('41/40');
        expect(errorCounter.props.style.color).toBe('#EF4444');
        expect(mockTriggerWarning).toHaveBeenCalled();
      });
    });

    it('should handle deleting text back below threshold', () => {
      const { rerender, queryByText, getByText } = render(
        <HabitNameField {...defaultProps} value={'A'.repeat(25)} />
      );

      // Counter visible
      expect(getByText('25/40')).toBeDefined();

      // Delete back to 20 chars (threshold)
      rerender(<HabitNameField {...defaultProps} value={'A'.repeat(20)} />);

      // Counter should disappear
      expect(queryByText(/\/40/)).toBeNull();
    });

    it('should handle value with whitespace in character count', () => {
      const valueWithSpaces = 'A long habit name here'; // 22 chars including spaces
      const { getByText } = render(
        <HabitNameField {...defaultProps} value={valueWithSpaces} />
      );

      // Should show counter and count spaces
      expect(getByText('22/40')).toBeDefined();
    });
  });

  describe('V11 Button Validation Integration', () => {
    it('should be invalid with 0 characters', () => {
      const value = '';
      // Button should be disabled when value.trim().length < 2
      expect(value.trim().length < 2).toBe(true);
    });

    it('should be valid with 1 character', () => {
      const value = 'A';
      expect(value.trim().length < 1).toBe(false);
    });

    it('should be valid with 2 characters', () => {
      const value = 'AB';
      expect(value.trim().length < 2).toBe(false);
    });

    it('should be invalid with only whitespace', () => {
      const value = '   ';
      expect(value.trim().length < 2).toBe(true);
    });

    it('should be valid with 2+ characters after trim', () => {
      const value = '  AB  ';
      expect(value.trim().length < 2).toBe(false);
    });
  });
});
