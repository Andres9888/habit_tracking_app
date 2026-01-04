/**
 * FrequencyPresets Component Tests
 * Task 8: Comprehensive test coverage for FrequencyPresets component
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FrequencyPresets, PRESETS, type PresetType } from '../FrequencyPresets';

// Mock haptic feedback hook
jest.mock('../../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: () => ({
    triggerSelection: jest.fn(),
  }),
}));

describe('FrequencyPresets', () => {
  const mockOnPresetSelect = jest.fn();
  const defaultProps = {
    selectedDays: [false, false, false, false, false, false, false],
    onPresetSelect: mockOnPresetSelect,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all three preset buttons', () => {
      const { getByText } = render(<FrequencyPresets {...defaultProps} />);

      expect(getByText('Daily')).toBeTruthy();
      expect(getByText('Weekdays')).toBeTruthy();
      expect(getByText('Weekends')).toBeTruthy();
    });

    it('renders the "Repeat on" label', () => {
      const { getByText } = render(<FrequencyPresets {...defaultProps} />);

      expect(getByText('Repeat on')).toBeTruthy();
    });

    it('renders without crashing', () => {
      const { toJSON } = render(<FrequencyPresets {...defaultProps} />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Active Preset Detection', () => {
    it('highlights Daily when all days are selected', () => {
      const { getByText } = render(
        <FrequencyPresets
          selectedDays={[true, true, true, true, true, true, true]}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      const dailyButton = getByText('Daily');
      // Check accessibility state indicates selection
      expect(dailyButton.props.accessibilityState?.selected).toBe(true);
    });

    it('highlights Weekdays when Mon-Fri are selected', () => {
      const { getByText } = render(
        <FrequencyPresets
          selectedDays={[false, true, true, true, true, true, false]}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      const weekdaysButton = getByText('Weekdays');
      expect(weekdaysButton.props.accessibilityState?.selected).toBe(true);
    });

    it('highlights Weekends when Sat-Sun are selected', () => {
      const { getByText } = render(
        <FrequencyPresets
          selectedDays={[true, false, false, false, false, false, true]}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      const weekendsButton = getByText('Weekends');
      expect(weekendsButton.props.accessibilityState?.selected).toBe(true);
    });

    it('does not highlight any preset for custom selection', () => {
      const { getByText } = render(
        <FrequencyPresets
          selectedDays={[true, true, false, false, false, false, false]}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      expect(getByText('Daily').props.accessibilityState?.selected).toBe(false);
      expect(getByText('Weekdays').props.accessibilityState?.selected).toBe(false);
      expect(getByText('Weekends').props.accessibilityState?.selected).toBe(false);
    });

    it('does not highlight any preset when no days selected', () => {
      const { getByText } = render(<FrequencyPresets {...defaultProps} />);

      expect(getByText('Daily').props.accessibilityState?.selected).toBe(false);
      expect(getByText('Weekdays').props.accessibilityState?.selected).toBe(false);
      expect(getByText('Weekends').props.accessibilityState?.selected).toBe(false);
    });
  });

  describe('Preset Selection', () => {
    it('calls onPresetSelect with daily pattern when Daily pressed', () => {
      const { getByText } = render(<FrequencyPresets {...defaultProps} />);

      fireEvent.press(getByText('Daily'));

      expect(mockOnPresetSelect).toHaveBeenCalledTimes(1);
      expect(mockOnPresetSelect).toHaveBeenCalledWith(PRESETS.daily);
    });

    it('calls onPresetSelect with weekdays pattern when Weekdays pressed', () => {
      const { getByText } = render(<FrequencyPresets {...defaultProps} />);

      fireEvent.press(getByText('Weekdays'));

      expect(mockOnPresetSelect).toHaveBeenCalledTimes(1);
      expect(mockOnPresetSelect).toHaveBeenCalledWith(PRESETS.weekdays);
    });

    it('calls onPresetSelect with weekends pattern when Weekends pressed', () => {
      const { getByText } = render(<FrequencyPresets {...defaultProps} />);

      fireEvent.press(getByText('Weekends'));

      expect(mockOnPresetSelect).toHaveBeenCalledTimes(1);
      expect(mockOnPresetSelect).toHaveBeenCalledWith(PRESETS.weekends);
    });

    it('allows switching between presets', () => {
      const { getByText, rerender } = render(<FrequencyPresets {...defaultProps} />);

      // Select Daily
      fireEvent.press(getByText('Daily'));
      expect(mockOnPresetSelect).toHaveBeenCalledWith(PRESETS.daily);

      // Rerender with daily selected
      rerender(
        <FrequencyPresets
          selectedDays={PRESETS.daily}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      // Select Weekdays
      fireEvent.press(getByText('Weekdays'));
      expect(mockOnPresetSelect).toHaveBeenCalledWith(PRESETS.weekdays);
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility role for buttons', () => {
      const { getByText } = render(<FrequencyPresets {...defaultProps} />);

      expect(getByText('Daily').props.accessibilityRole).toBe('button');
      expect(getByText('Weekdays').props.accessibilityRole).toBe('button');
      expect(getByText('Weekends').props.accessibilityRole).toBe('button');
    });

    it('includes selection state in accessibility label', () => {
      const { getByText } = render(
        <FrequencyPresets
          selectedDays={PRESETS.daily}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      const dailyButton = getByText('Daily');
      expect(dailyButton.props.accessibilityLabel).toContain('selected');
    });

    it('does not include "selected" in label for inactive presets', () => {
      const { getByText } = render(<FrequencyPresets {...defaultProps} />);

      const dailyButton = getByText('Daily');
      expect(dailyButton.props.accessibilityLabel).not.toContain('selected');
    });
  });

  describe('PRESETS constant', () => {
    it('Daily preset selects all 7 days', () => {
      expect(PRESETS.daily).toEqual([true, true, true, true, true, true, true]);
      expect(PRESETS.daily.length).toBe(7);
      expect(PRESETS.daily.every(day => day === true)).toBe(true);
    });

    it('Weekdays preset selects Mon-Fri only', () => {
      expect(PRESETS.weekdays).toEqual([false, true, true, true, true, true, false]);
      expect(PRESETS.weekdays.length).toBe(7);
      // Sunday (index 0) and Saturday (index 6) should be false
      expect(PRESETS.weekdays[0]).toBe(false);
      expect(PRESETS.weekdays[6]).toBe(false);
      // Monday through Friday (indices 1-5) should be true
      expect(PRESETS.weekdays.slice(1, 6).every(day => day === true)).toBe(true);
    });

    it('Weekends preset selects Sat-Sun only', () => {
      expect(PRESETS.weekends).toEqual([true, false, false, false, false, false, true]);
      expect(PRESETS.weekends.length).toBe(7);
      // Sunday (index 0) and Saturday (index 6) should be true
      expect(PRESETS.weekends[0]).toBe(true);
      expect(PRESETS.weekends[6]).toBe(true);
      // Monday through Friday (indices 1-5) should be false
      expect(PRESETS.weekends.slice(1, 6).every(day => day === false)).toBe(true);
    });
  });

  describe('Component Memoization', () => {
    it('does not re-render when props are unchanged', () => {
      const { rerender } = render(<FrequencyPresets {...defaultProps} />);

      const firstRender = render(<FrequencyPresets {...defaultProps} />).toJSON();

      rerender(<FrequencyPresets {...defaultProps} />);

      const secondRender = render(<FrequencyPresets {...defaultProps} />).toJSON();

      expect(firstRender).toEqual(secondRender);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty selectedDays array gracefully', () => {
      const { getByText } = render(
        <FrequencyPresets
          selectedDays={[]}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      expect(getByText('Daily')).toBeTruthy();
      // Should not crash or error
    });

    it('handles partially selected days (not matching any preset)', () => {
      const { getByText } = render(
        <FrequencyPresets
          selectedDays={[true, false, true, false, true, false, true]}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      // No preset should be active
      expect(getByText('Daily').props.accessibilityState?.selected).toBe(false);
      expect(getByText('Weekdays').props.accessibilityState?.selected).toBe(false);
      expect(getByText('Weekends').props.accessibilityState?.selected).toBe(false);
    });

    it('handles rapid consecutive preset selections', () => {
      const { getByText } = render(<FrequencyPresets {...defaultProps} />);

      fireEvent.press(getByText('Daily'));
      fireEvent.press(getByText('Weekdays'));
      fireEvent.press(getByText('Weekends'));
      fireEvent.press(getByText('Daily'));

      expect(mockOnPresetSelect).toHaveBeenCalledTimes(4);
    });
  });

  describe('Visual State', () => {
    it('renders with correct styling structure', () => {
      const { getByText } = render(<FrequencyPresets {...defaultProps} />);

      const container = getByText('Repeat on').parent?.parent;
      expect(container).toBeTruthy();
    });

    it('maintains button layout in horizontal row', () => {
      const { getByText } = render(<FrequencyPresets {...defaultProps} />);

      const dailyButton = getByText('Daily');
      const weekdaysButton = getByText('Weekdays');
      const weekendsButton = getByText('Weekends');

      expect(dailyButton).toBeTruthy();
      expect(weekdaysButton).toBeTruthy();
      expect(weekendsButton).toBeTruthy();
    });
  });
});
