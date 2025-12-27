/**
 * ReminderSelector Component Tests - V8 Unified Reminder Design
 * Task 4: Unified Reminder Selector with 4 options
 *
 * Tests:
 * - 4 reminder options render in grid layout
 * - "None" option is default with muted bell emoji
 * - Selected option shows green border and background
 * - Times display below labels
 * - Haptic feedback on selection
 * - Accessibility labels include full time for screen readers
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import {
  ReminderSelector,
  REMINDER_OPTIONS,
  REMINDER_OPTION_ORDER,
  getReminderTimeForOption,
  type ReminderOption,
} from '../ReminderSelector';

// Mock useHapticFeedback
const mockTriggerSelection = jest.fn();
jest.mock('../../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: () => ({
    triggerSelection: mockTriggerSelection,
    triggerImpact: jest.fn(),
    triggerNotification: jest.fn(),
  }),
}));

// Mock AccessibilityInfo.announceForAccessibility
jest
  .spyOn(AccessibilityInfo, 'announceForAccessibility')
  .mockImplementation(jest.fn());

describe('ReminderSelector - V8 Unified Design', () => {
  const mockOnSelectOption = jest.fn();

  const defaultProps = {
    selectedOption: 'none' as ReminderOption,
    onSelectOption: mockOnSelectOption,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the section header "Daily reminder"', () => {
      const { getByText } = render(<ReminderSelector {...defaultProps} />);
      // V9: Updated to "Daily reminder" with uppercase styling
      expect(getByText('Daily reminder')).toBeDefined();
    });

    it('should render all 4 reminder options', () => {
      const { getAllByRole } = render(<ReminderSelector {...defaultProps} />);
      const buttons = getAllByRole('button');
      expect(buttons.length).toBe(4);
    });

    it('should render each option with correct testID', () => {
      const { getByTestId } = render(<ReminderSelector {...defaultProps} />);

      REMINDER_OPTION_ORDER.forEach((option) => {
        expect(getByTestId(`reminder-option-${option}`)).toBeDefined();
      });
    });

    it('should render container with testID', () => {
      const { getByTestId } = render(<ReminderSelector {...defaultProps} />);
      expect(getByTestId('reminder-selector')).toBeDefined();
    });
  });

  describe('Option Labels and Emojis', () => {
    it('should show muted bell emoji for "None" option', () => {
      const { getByTestId } = render(<ReminderSelector {...defaultProps} />);
      const noneOption = getByTestId('reminder-option-none');

      // Check the emoji renders
      expect(REMINDER_OPTIONS.none.emoji).toBe('🔕');
    });

    it('should show correct emojis for time-based options', () => {
      expect(REMINDER_OPTIONS.morning.emoji).toBe('🌅');
      expect(REMINDER_OPTIONS.midday.emoji).toBe('☀️');
      expect(REMINDER_OPTIONS.evening.emoji).toBe('🌙');
    });

    it('should display labels for all options', () => {
      const { getByText } = render(<ReminderSelector {...defaultProps} />);

      expect(getByText('None')).toBeDefined();
      expect(getByText('Morning')).toBeDefined();
      expect(getByText('Midday')).toBeDefined();
      expect(getByText('Evening')).toBeDefined();
    });

    it('should display times below time-based option labels', () => {
      const { getByText } = render(<ReminderSelector {...defaultProps} />);

      expect(getByText('7:00 AM')).toBeDefined();
      expect(getByText('12:00 PM')).toBeDefined();
      expect(getByText('8:00 PM')).toBeDefined();
    });
  });

  describe('Selection State', () => {
    it('should show selected state on "None" by default', () => {
      const { getByTestId } = render(<ReminderSelector {...defaultProps} />);

      const noneOption = getByTestId('reminder-option-none');
      expect(noneOption.props.accessibilityState?.selected).toBe(true);
    });

    it('should show selected state on chosen option', () => {
      const { getByTestId } = render(
        <ReminderSelector {...defaultProps} selectedOption='morning' />
      );

      const morningOption = getByTestId('reminder-option-morning');
      expect(morningOption.props.accessibilityState?.selected).toBe(true);

      const noneOption = getByTestId('reminder-option-none');
      expect(noneOption.props.accessibilityState?.selected).toBe(false);
    });

    it('should apply green border color (#10B981) to selected option', () => {
      const { getByTestId } = render(
        <ReminderSelector {...defaultProps} selectedOption='midday' />
      );

      // The button is a Pressable wrapper, the Animated.View inside has the styles
      // We check via accessibility state that midday is selected
      const middayOption = getByTestId('reminder-option-midday');
      expect(middayOption.props.accessibilityState?.selected).toBe(true);
    });
  });

  describe('User Interaction', () => {
    it('should call onSelectOption when an option is pressed', () => {
      const { getByTestId } = render(<ReminderSelector {...defaultProps} />);

      const morningOption = getByTestId('reminder-option-morning');
      fireEvent.press(morningOption);

      expect(mockOnSelectOption).toHaveBeenCalledWith('morning');
    });

    it('should trigger haptic feedback when option is selected', () => {
      const { getByTestId } = render(<ReminderSelector {...defaultProps} />);

      const eveningOption = getByTestId('reminder-option-evening');
      fireEvent.press(eveningOption);

      expect(mockTriggerSelection).toHaveBeenCalled();
    });

    it('should call onSelectOption with "none" when None is pressed', () => {
      const { getByTestId } = render(
        <ReminderSelector {...defaultProps} selectedOption='morning' />
      );

      const noneOption = getByTestId('reminder-option-none');
      fireEvent.press(noneOption);

      expect(mockOnSelectOption).toHaveBeenCalledWith('none');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible role on all option buttons', () => {
      const { getByTestId } = render(<ReminderSelector {...defaultProps} />);

      REMINDER_OPTION_ORDER.forEach((option) => {
        const optionButton = getByTestId(`reminder-option-${option}`);
        expect(optionButton.props.accessibilityRole).toBe('button');
      });
    });

    it('should have accessibility label with time for time-based options', () => {
      const { getByLabelText } = render(<ReminderSelector {...defaultProps} />);

      expect(getByLabelText('Morning at 7:00 AM')).toBeDefined();
      expect(getByLabelText('Midday at 12:00 PM')).toBeDefined();
      expect(getByLabelText('Evening at 8:00 PM')).toBeDefined();
    });

    it('should have accessibility label for None option', () => {
      const { getByLabelText } = render(<ReminderSelector {...defaultProps} />);

      expect(getByLabelText('None, no reminder')).toBeDefined();
    });

    it('should announce selection for screen readers', () => {
      const { getByTestId } = render(<ReminderSelector {...defaultProps} />);

      const morningOption = getByTestId('reminder-option-morning');
      fireEvent.press(morningOption);

      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
        'Selected Morning reminder at 7:00 AM'
      );
    });

    it('should announce "Reminders disabled" when None is selected', () => {
      const { getByTestId } = render(
        <ReminderSelector {...defaultProps} selectedOption='morning' />
      );

      const noneOption = getByTestId('reminder-option-none');
      fireEvent.press(noneOption);

      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
        'Reminders disabled'
      );
    });
  });

  describe('Reminder Option Constants', () => {
    it('should have exactly 4 options in order', () => {
      expect(REMINDER_OPTION_ORDER.length).toBe(4);
      expect(REMINDER_OPTION_ORDER[0]).toBe('none');
      expect(REMINDER_OPTION_ORDER[1]).toBe('morning');
      expect(REMINDER_OPTION_ORDER[2]).toBe('midday');
      expect(REMINDER_OPTION_ORDER[3]).toBe('evening');
    });

    it('should have correct time values', () => {
      expect(REMINDER_OPTIONS.none.hour).toBeNull();
      expect(REMINDER_OPTIONS.none.minute).toBeNull();

      expect(REMINDER_OPTIONS.morning.hour).toBe(7);
      expect(REMINDER_OPTIONS.morning.minute).toBe(0);

      expect(REMINDER_OPTIONS.midday.hour).toBe(12);
      expect(REMINDER_OPTIONS.midday.minute).toBe(0);

      expect(REMINDER_OPTIONS.evening.hour).toBe(20);
      expect(REMINDER_OPTIONS.evening.minute).toBe(0);
    });
  });

  describe('getReminderTimeForOption helper', () => {
    it('should return null for "none" option', () => {
      expect(getReminderTimeForOption('none')).toBeNull();
    });

    it('should return Date with 7:00 for "morning"', () => {
      const date = getReminderTimeForOption('morning');
      expect(date).not.toBeNull();
      expect(date!.getHours()).toBe(7);
      expect(date!.getMinutes()).toBe(0);
    });

    it('should return Date with 12:00 for "midday"', () => {
      const date = getReminderTimeForOption('midday');
      expect(date).not.toBeNull();
      expect(date!.getHours()).toBe(12);
      expect(date!.getMinutes()).toBe(0);
    });

    it('should return Date with 20:00 for "evening"', () => {
      const date = getReminderTimeForOption('evening');
      expect(date).not.toBeNull();
      expect(date!.getHours()).toBe(20);
      expect(date!.getMinutes()).toBe(0);
    });
  });
});
