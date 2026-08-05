/**
 * TimeRangeToggle Component Tests
 *
 * Tests for time range selection, interactions, animations, and accessibility.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TimeRangeToggle } from '../TimeRangeToggle';
import type { TimeRange } from '../types';

// Mock the useReduceMotion hook
jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: jest.fn(() => false),
}));

describe('TimeRangeToggle', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all three time range options', () => {
      const { getByText } = render(
        <TimeRangeToggle value='3m' onChange={mockOnChange} />
      );

      expect(getByText('3m')).toBeTruthy();
      expect(getByText('6m')).toBeTruthy();
      expect(getByText('1y')).toBeTruthy();
    });

    it('should render with 3m as initial value', () => {
      const { getByLabelText } = render(
        <TimeRangeToggle value='3m' onChange={mockOnChange} />
      );

      const button3m = getByLabelText('3 months');
      expect(button3m.props.accessibilityState.selected).toBe(true);
    });

    it('should render with 6m as initial value', () => {
      const { getByLabelText } = render(
        <TimeRangeToggle value='6m' onChange={mockOnChange} />
      );

      const button6m = getByLabelText('6 months');
      expect(button6m.props.accessibilityState.selected).toBe(true);
    });

    it('should render with 1y as initial value', () => {
      const { getByLabelText } = render(
        <TimeRangeToggle value='1y' onChange={mockOnChange} />
      );

      const button1y = getByLabelText('1 year');
      expect(button1y.props.accessibilityState.selected).toBe(true);
    });

    it('should only have one active button at a time', () => {
      const { getByLabelText } = render(
        <TimeRangeToggle value='6m' onChange={mockOnChange} />
      );

      const button3m = getByLabelText('3 months');
      const button6m = getByLabelText('6 months');
      const button1y = getByLabelText('1 year');

      expect(button3m.props.accessibilityState.selected).toBe(false);
      expect(button6m.props.accessibilityState.selected).toBe(true);
      expect(button1y.props.accessibilityState.selected).toBe(false);
    });
  });

  describe('Interactions', () => {
    it('should call onChange when pressing inactive 3m button', () => {
      const { getByLabelText } = render(
        <TimeRangeToggle value='6m' onChange={mockOnChange} />
      );

      fireEvent.press(getByLabelText('3 months'));

      expect(mockOnChange).toHaveBeenCalledWith('3m');
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('should call onChange when pressing inactive 6m button', () => {
      const { getByLabelText } = render(
        <TimeRangeToggle value='3m' onChange={mockOnChange} />
      );

      fireEvent.press(getByLabelText('6 months'));

      expect(mockOnChange).toHaveBeenCalledWith('6m');
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('should call onChange when pressing inactive 1y button', () => {
      const { getByLabelText } = render(
        <TimeRangeToggle value='3m' onChange={mockOnChange} />
      );

      fireEvent.press(getByLabelText('1 year'));

      expect(mockOnChange).toHaveBeenCalledWith('1y');
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('should NOT call onChange when pressing already active button', () => {
      const { getByLabelText } = render(
        <TimeRangeToggle value='3m' onChange={mockOnChange} />
      );

      fireEvent.press(getByLabelText('3 months'));

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should handle rapid successive presses', () => {
      const { getByLabelText, rerender } = render(
        <TimeRangeToggle value='3m' onChange={mockOnChange} />
      );

      // Press 6m (not currently active) - should fire
      fireEvent.press(getByLabelText('6 months'));
      expect(mockOnChange).toHaveBeenLastCalledWith('6m');

      // Simulate parent updating value
      rerender(<TimeRangeToggle value='6m' onChange={mockOnChange} />);

      // Press 1y (not currently active) - should fire
      fireEvent.press(getByLabelText('1 year'));
      expect(mockOnChange).toHaveBeenLastCalledWith('1y');

      // Simulate parent updating value
      rerender(<TimeRangeToggle value='1y' onChange={mockOnChange} />);

      // Press 3m (not currently active) - should fire
      fireEvent.press(getByLabelText('3 months'));

      expect(mockOnChange).toHaveBeenCalledTimes(3);
      expect(mockOnChange).toHaveBeenNthCalledWith(1, '6m');
      expect(mockOnChange).toHaveBeenNthCalledWith(2, '1y');
      expect(mockOnChange).toHaveBeenNthCalledWith(3, '3m');
    });
  });

  describe('Value updates', () => {
    it('should update active state when value prop changes', () => {
      const { getByLabelText, rerender } = render(
        <TimeRangeToggle value='3m' onChange={mockOnChange} />
      );

      // Initially 3m is active
      expect(getByLabelText('3 months').props.accessibilityState.selected).toBe(
        true
      );
      expect(getByLabelText('6 months').props.accessibilityState.selected).toBe(
        false
      );

      // Rerender with new value
      rerender(<TimeRangeToggle value='6m' onChange={mockOnChange} />);

      // Now 6m is active
      expect(getByLabelText('3 months').props.accessibilityState.selected).toBe(
        false
      );
      expect(getByLabelText('6 months').props.accessibilityState.selected).toBe(
        true
      );
    });

    it('should handle all value transitions correctly', () => {
      const timeRanges: TimeRange[] = ['3m', '6m', '1y'];
      const { getByLabelText, rerender } = render(
        <TimeRangeToggle value='3m' onChange={mockOnChange} />
      );

      for (const range of timeRanges) {
        rerender(<TimeRangeToggle value={range} onChange={mockOnChange} />);

        const labels = {
          '3m': '3 months',
          '6m': '6 months',
          '1y': '1 year',
        };

        // Check that only the current range is selected
        for (const checkRange of timeRanges) {
          const button = getByLabelText(labels[checkRange]);
          expect(button.props.accessibilityState.selected).toBe(
            checkRange === range
          );
        }
      }
    });
  });

  describe('Accessibility', () => {
    it('should have tablist role on container', () => {
      const { getByLabelText } = render(
        <TimeRangeToggle value='3m' onChange={mockOnChange} />
      );

      const container = getByLabelText('Time range selector');
      expect(container.props.accessibilityRole).toBe('tablist');
    });

    it('should have tab role on each button', () => {
      const { getByLabelText } = render(
        <TimeRangeToggle value='3m' onChange={mockOnChange} />
      );

      expect(getByLabelText('3 months').props.accessibilityRole).toBe('tab');
      expect(getByLabelText('6 months').props.accessibilityRole).toBe('tab');
      expect(getByLabelText('1 year').props.accessibilityRole).toBe('tab');
    });

    it('should have correct accessibility labels for screen readers', () => {
      const { getByLabelText } = render(
        <TimeRangeToggle value='3m' onChange={mockOnChange} />
      );

      // Labels should be human-readable, not abbreviated
      expect(getByLabelText('3 months')).toBeTruthy();
      expect(getByLabelText('6 months')).toBeTruthy();
      expect(getByLabelText('1 year')).toBeTruthy();
    });

    it('should have selected state on active button', () => {
      const { getByLabelText } = render(
        <TimeRangeToggle value='6m' onChange={mockOnChange} />
      );

      const activeButton = getByLabelText('6 months');
      expect(activeButton.props.accessibilityState.selected).toBe(true);
    });

    it('should have non-selected state on inactive buttons', () => {
      const { getByLabelText } = render(
        <TimeRangeToggle value='6m' onChange={mockOnChange} />
      );

      expect(getByLabelText('3 months').props.accessibilityState.selected).toBe(
        false
      );
      expect(getByLabelText('1 year').props.accessibilityState.selected).toBe(
        false
      );
    });

    it('should be accessible for each button', () => {
      const { getByLabelText } = render(
        <TimeRangeToggle value='3m' onChange={mockOnChange} />
      );

      // All buttons should be accessible
      expect(getByLabelText('3 months').props.accessible).toBe(true);
      expect(getByLabelText('6 months').props.accessible).toBe(true);
      expect(getByLabelText('1 year').props.accessible).toBe(true);
    });
  });

  describe('Animations', () => {
    it('should render without errors when reduceMotion is disabled', () => {
      const { getByLabelText } = render(
        <TimeRangeToggle value='3m' onChange={mockOnChange} />
      );

      // Should render successfully
      expect(getByLabelText('3 months')).toBeTruthy();
    });

    it('should render without errors when reduceMotion is enabled', () => {
      const { useReduceMotion } = require('../../../hooks/useReduceMotion');
      useReduceMotion.mockReturnValue(true);

      const { getByLabelText } = render(
        <TimeRangeToggle value='3m' onChange={mockOnChange} />
      );

      // Should render successfully with reduced motion
      expect(getByLabelText('3 months')).toBeTruthy();

      // Reset mock
      useReduceMotion.mockReturnValue(false);
    });

    it('should handle pressIn and pressOut events', () => {
      const { getByLabelText } = render(
        <TimeRangeToggle value='3m' onChange={mockOnChange} />
      );

      const button = getByLabelText('6 months');

      // These should not throw
      expect(() => {
        fireEvent(button, 'pressIn');
        fireEvent(button, 'pressOut');
      }).not.toThrow();
    });
  });

  describe('Display text', () => {
    it('should show abbreviated labels (3m, 6m, 1y)', () => {
      const { getByText } = render(
        <TimeRangeToggle value='3m' onChange={mockOnChange} />
      );

      // Visual labels should be abbreviated
      expect(getByText('3m')).toBeTruthy();
      expect(getByText('6m')).toBeTruthy();
      expect(getByText('1y')).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    it('should handle onChange being called multiple times with same value', () => {
      // This tests that the parent component handles state correctly
      const { getByLabelText, rerender } = render(
        <TimeRangeToggle value='3m' onChange={mockOnChange} />
      );

      fireEvent.press(getByLabelText('6 months'));

      // Parent would typically update state here
      rerender(<TimeRangeToggle value='6m' onChange={mockOnChange} />);

      // Pressing the now-active button should not trigger onChange
      fireEvent.press(getByLabelText('6 months'));

      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });
  });
});
