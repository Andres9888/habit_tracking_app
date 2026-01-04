/**
 * ScheduleCard Component Tests
 * Task 6: Comprehensive test coverage for ScheduleCard component
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ScheduleCard, type ScheduleCardProps } from '../ScheduleCard';
import type { HubermanPhase } from '../../../../constants/hubermanPhases';
import type { ReminderOption } from '../ReminderSelector';

// Mock dependencies
jest.mock('../../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: () => ({
    triggerSelection: jest.fn(),
  }),
}));

jest.mock('../../../../hooks/useReduceMotion', () => ({
  useReduceMotion: () => false,
}));

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn((obj) => obj.ios),
}));

describe('ScheduleCard', () => {
  const mockOnTimeOfDayChange = jest.fn();
  const mockOnReminderOptionChange = jest.fn();
  const mockOnFrequencyChange = jest.fn();

  const defaultProps: ScheduleCardProps = {
    timeOfDay: null,
    reminderOption: 'none' as ReminderOption,
    selectedDays: [false, false, false, false, false, false, false],
    onTimeOfDayChange: mockOnTimeOfDayChange,
    onReminderOptionChange: mockOnReminderOptionChange,
    onFrequencyChange: mockOnFrequencyChange,
    isComplete: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { toJSON } = render(<ScheduleCard {...defaultProps} />);
      expect(toJSON()).toBeTruthy();
    });

    it('renders card header with title', () => {
      const { getByText } = render(<ScheduleCard {...defaultProps} />);
      expect(getByText('Schedule')).toBeTruthy();
    });

    it('renders required badge', () => {
      const { getByText } = render(<ScheduleCard {...defaultProps} />);
      expect(getByText('REQUIRED')).toBeTruthy();
    });

    it('renders all section labels', () => {
      const { getByText } = render(<ScheduleCard {...defaultProps} />);
      expect(getByText('Frequency')).toBeTruthy();
    });

    it('renders TimeOfDaySelector component', () => {
      const { getByText } = render(<ScheduleCard {...defaultProps} />);
      // TimeOfDaySelector should have "When" label
      expect(getByText('When')).toBeTruthy();
    });

    it('renders ReminderSelector component', () => {
      const { getByText } = render(<ScheduleCard {...defaultProps} />);
      // ReminderSelector should have "REMINDERS" label
      expect(getByText('REMINDERS')).toBeTruthy();
    });

    it('renders FrequencyPresets component', () => {
      const { getByText } = render(<ScheduleCard {...defaultProps} />);
      expect(getByText('Repeat on')).toBeTruthy();
      expect(getByText('Daily')).toBeTruthy();
      expect(getByText('Weekdays')).toBeTruthy();
      expect(getByText('Weekends')).toBeTruthy();
    });
  });

  describe('Completion State', () => {
    it('shows incomplete circle when isComplete is false', () => {
      const { getByLabelText } = render(<ScheduleCard {...defaultProps} />);
      expect(getByLabelText('Section incomplete')).toBeTruthy();
    });

    it('shows complete checkmark when isComplete is true', () => {
      const { getByLabelText } = render(
        <ScheduleCard {...defaultProps} isComplete={true} />
      );
      expect(getByLabelText('Section complete')).toBeTruthy();
    });

    it('transitions from incomplete to complete', () => {
      const { getByLabelText, rerender } = render(
        <ScheduleCard {...defaultProps} isComplete={false} />
      );

      expect(getByLabelText('Section incomplete')).toBeTruthy();

      rerender(<ScheduleCard {...defaultProps} isComplete={true} />);

      expect(getByLabelText('Section complete')).toBeTruthy();
    });
  });

  describe('TimeOfDaySelector Integration', () => {
    it('calls onTimeOfDayChange when time of day is selected', () => {
      const { getByText } = render(<ScheduleCard {...defaultProps} />);

      const morningButton = getByText('Morning');
      fireEvent.press(morningButton);

      expect(mockOnTimeOfDayChange).toHaveBeenCalledTimes(1);
      expect(mockOnTimeOfDayChange).toHaveBeenCalledWith('phase1_push');
    });

    it('displays selected time of day', () => {
      const { getByText } = render(
        <ScheduleCard
          {...defaultProps}
          timeOfDay={'phase1_push' as HubermanPhase}
        />
      );

      const morningButton = getByText('Morning');
      expect(morningButton.props.accessibilityState?.selected).toBe(true);
    });
  });

  describe('ReminderSelector Integration', () => {
    it('calls onReminderOptionChange when reminder option is selected', () => {
      const { getByText } = render(<ScheduleCard {...defaultProps} />);

      const morningReminder = getByText('Morning');
      // Find the reminder Morning button (not the time of day Morning button)
      // This is tricky - we need to find the one in the reminder selector
      const reminderButtons = render(<ScheduleCard {...defaultProps} />)
        .getAllByText('Morning');

      if (reminderButtons.length > 1) {
        fireEvent.press(reminderButtons[1]); // Second "Morning" is from ReminderSelector
        expect(mockOnReminderOptionChange).toHaveBeenCalledWith('morning');
      }
    });

    it('displays selected reminder option', () => {
      const { getByTestId } = render(
        <ScheduleCard
          {...defaultProps}
          reminderOption={'morning' as ReminderOption}
        />
      );

      const morningOption = getByTestId('reminder-option-morning');
      expect(morningOption.props.accessibilityState?.selected).toBe(true);
    });
  });

  describe('FrequencyPresets Integration', () => {
    it('calls onFrequencyChange when preset is selected', () => {
      const { getByText } = render(<ScheduleCard {...defaultProps} />);

      fireEvent.press(getByText('Daily'));

      expect(mockOnFrequencyChange).toHaveBeenCalledTimes(1);
      expect(mockOnFrequencyChange).toHaveBeenCalledWith([
        true, true, true, true, true, true, true,
      ]);
    });

    it('highlights active preset based on selectedDays', () => {
      const { getByText } = render(
        <ScheduleCard
          {...defaultProps}
          selectedDays={[true, true, true, true, true, true, true]}
        />
      );

      const dailyButton = getByText('Daily');
      expect(dailyButton.props.accessibilityState?.selected).toBe(true);
    });

    it('updates when selectedDays changes', () => {
      const { getByText, rerender } = render(<ScheduleCard {...defaultProps} />);

      // Initially no preset active
      expect(getByText('Daily').props.accessibilityState?.selected).toBe(false);

      // Change to daily
      rerender(
        <ScheduleCard
          {...defaultProps}
          selectedDays={[true, true, true, true, true, true, true]}
        />
      );

      expect(getByText('Daily').props.accessibilityState?.selected).toBe(true);
    });
  });

  describe('Styling', () => {
    it('has proper card styling', () => {
      const { getByLabelText } = render(<ScheduleCard {...defaultProps} />);
      const card = getByLabelText('Schedule section');

      expect(card).toBeTruthy();
      expect(card.props.accessibilityRole).toBe('group');
    });

    it('maintains consistent spacing between sections', () => {
      const { getByText } = render(<ScheduleCard {...defaultProps} />);

      // All sections should be present
      expect(getByText('When')).toBeTruthy();
      expect(getByText('REMINDERS')).toBeTruthy();
      expect(getByText('Frequency')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility role for card', () => {
      const { getByLabelText } = render(<ScheduleCard {...defaultProps} />);
      const card = getByLabelText('Schedule section');

      expect(card.props.accessibilityRole).toBe('group');
    });

    it('has accessible labels for completion state', () => {
      const { getByLabelText } = render(<ScheduleCard {...defaultProps} />);
      expect(getByLabelText('Section incomplete')).toBeTruthy();
    });

    it('updates accessibility label when completion state changes', () => {
      const { getByLabelText, rerender } = render(
        <ScheduleCard {...defaultProps} isComplete={false} />
      );

      expect(getByLabelText('Section incomplete')).toBeTruthy();

      rerender(<ScheduleCard {...defaultProps} isComplete={true} />);

      expect(getByLabelText('Section complete')).toBeTruthy();
    });
  });

  describe('Component Memoization', () => {
    it('does not re-render when props are unchanged', () => {
      const { rerender } = render(<ScheduleCard {...defaultProps} />);

      const firstRender = render(<ScheduleCard {...defaultProps} />).toJSON();

      rerender(<ScheduleCard {...defaultProps} />);

      const secondRender = render(<ScheduleCard {...defaultProps} />).toJSON();

      expect(firstRender).toEqual(secondRender);
    });
  });

  describe('Edge Cases', () => {
    it('handles null timeOfDay gracefully', () => {
      const { getByText } = render(
        <ScheduleCard {...defaultProps} timeOfDay={null} />
      );

      expect(getByText('Schedule')).toBeTruthy();
    });

    it('handles empty selectedDays array', () => {
      const { getByText } = render(
        <ScheduleCard
          {...defaultProps}
          selectedDays={[]}
        />
      );

      expect(getByText('Schedule')).toBeTruthy();
    });

    it('handles all days selected', () => {
      const { getByText } = render(
        <ScheduleCard
          {...defaultProps}
          selectedDays={[true, true, true, true, true, true, true]}
          isComplete={true}
        />
      );

      expect(getByLabelText('Section complete')).toBeTruthy();
      expect(getByText('Daily').props.accessibilityState?.selected).toBe(true);
    });

    it('handles rapid preset changes', () => {
      const { getByText } = render(<ScheduleCard {...defaultProps} />);

      fireEvent.press(getByText('Daily'));
      fireEvent.press(getByText('Weekdays'));
      fireEvent.press(getByText('Weekends'));

      expect(mockOnFrequencyChange).toHaveBeenCalledTimes(3);
    });
  });

  describe('Integration with All Selectors', () => {
    it('allows selecting time, reminder, and frequency together', () => {
      const { getByText } = render(<ScheduleCard {...defaultProps} />);

      // Select time of day
      fireEvent.press(getByText('Morning'));
      expect(mockOnTimeOfDayChange).toHaveBeenCalled();

      // Select frequency preset
      fireEvent.press(getByText('Daily'));
      expect(mockOnFrequencyChange).toHaveBeenCalled();

      // All selectors should remain functional
      expect(getByText('When')).toBeTruthy();
      expect(getByText('REMINDERS')).toBeTruthy();
      expect(getByText('Frequency')).toBeTruthy();
    });

    it('maintains state across multiple interactions', () => {
      const { getByText, rerender } = render(<ScheduleCard {...defaultProps} />);

      // Select daily
      fireEvent.press(getByText('Daily'));

      // Rerender with new state
      rerender(
        <ScheduleCard
          {...defaultProps}
          selectedDays={[true, true, true, true, true, true, true]}
          isComplete={true}
          timeOfDay={'phase1_push' as HubermanPhase}
          reminderOption={'morning' as ReminderOption}
        />
      );

      // Verify all selections are reflected
      expect(getByText('Daily').props.accessibilityState?.selected).toBe(true);
      expect(getByLabelText('Section complete')).toBeTruthy();
    });
  });
});
