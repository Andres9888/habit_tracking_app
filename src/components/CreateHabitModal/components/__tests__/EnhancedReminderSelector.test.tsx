/**
 * EnhancedReminderSelector Component Tests
 * Task 1.3: Create EnhancedReminderSelector Component
 *
 * Tests:
 * - Toggle row with bell icon and switch
 * - Quick preset buttons (Morning/Midday/Evening)
 * - Custom time button that opens TimePickerModal
 * - Selected preset shows green border
 * - Custom time shows green border when has value
 * - Next reminder badge updates on time change
 * - Keyboard dismissed on any interaction
 * - All elements have accessibility labels
 * - Haptic feedback on selection
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo, Keyboard } from 'react-native';
import {
  EnhancedReminderSelector,
  EnhancedReminderSelectorProps,
  DEFAULT_PRESETS,
} from '../EnhancedReminderSelector';

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

// Mock useReduceMotion
jest.mock('../../../../hooks/useReduceMotion', () => ({
  __esModule: true,
  useReduceMotion: () => false,
}));

// Mock formatReminderTime
jest.mock('../../../../utils/notifications', () => ({
  formatReminderTime: (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  },
}));

// Mock TimePickerModal
let mockTimePickerOnConfirm: ((time: Date) => void) | null = null;
let mockTimePickerOnCancel: (() => void) | null = null;
jest.mock('../TimePickerModal', () => {
  const React = require('react');
  const { View, Pressable, Text } = require('react-native');

  return {
    __esModule: true,
    TimePickerModal: ({
      visible,
      onConfirm,
      onCancel,
      initialTime,
    }: {
      visible: boolean;
      onConfirm: (time: Date) => void;
      onCancel: () => void;
      initialTime: Date;
    }) => {
      mockTimePickerOnConfirm = onConfirm;
      mockTimePickerOnCancel = onCancel;

      if (!visible) return null;

      return (
        <View testID='time-picker-modal'>
          <Text testID='picker-initial-time'>{initialTime.toISOString()}</Text>
          <Pressable
            testID='picker-confirm'
            onPress={() => {
              const newTime = new Date();
              newTime.setHours(6, 30, 0, 0);
              onConfirm(newTime);
            }}
          />
          <Pressable testID='picker-cancel' onPress={onCancel} />
        </View>
      );
    },
  };
});

// Mock NextReminderBadge
jest.mock('../NextReminderBadge', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  return {
    __esModule: true,
    NextReminderBadge: ({
      enabled,
      reminderTime,
    }: {
      enabled: boolean;
      reminderTime: Date;
    }) => {
      if (!enabled) return null;

      const formatTime = (date: Date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');
        return `${displayHours}:${displayMinutes} ${ampm}`;
      };

      return (
        <View testID='next-reminder-badge'>
          <Text>Next: {formatTime(reminderTime)}</Text>
        </View>
      );
    },
  };
});

// Mock Keyboard
jest.spyOn(Keyboard, 'dismiss').mockImplementation(() => {});

// Mock AccessibilityInfo
jest
  .spyOn(AccessibilityInfo, 'announceForAccessibility')
  .mockImplementation(() => {});

describe('EnhancedReminderSelector', () => {
  const mockOnToggle = jest.fn();
  const mockOnTimeChange = jest.fn();

  const createTime = (hours: number, minutes: number): Date => {
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const defaultProps: EnhancedReminderSelectorProps = {
    enabled: true,
    reminderTime: createTime(12, 0), // Midday preset
    onToggle: mockOnToggle,
    onTimeChange: mockOnTimeChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockTimePickerOnConfirm = null;
    mockTimePickerOnCancel = null;
  });

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );
      expect(getByTestId('enhanced-reminder-selector')).toBeDefined();
    });

    it('should render the toggle switch', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );
      expect(getByTestId('reminder-toggle')).toBeDefined();
    });

    it('should render "Daily Reminder" label', () => {
      const { getByText } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );
      expect(getByText('Daily Reminder')).toBeDefined();
    });

    it('should render all three preset buttons when enabled', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );

      expect(getByTestId('preset-morning')).toBeDefined();
      expect(getByTestId('preset-midday')).toBeDefined();
      expect(getByTestId('preset-evening')).toBeDefined();
    });

    it('should render custom time button when enabled', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );
      expect(getByTestId('custom-time-button')).toBeDefined();
    });

    it('should render next reminder badge when enabled and showNextReminder is true', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );
      expect(getByTestId('next-reminder-badge')).toBeDefined();
    });
  });

  describe('Toggle Behavior', () => {
    it('should not render time selection UI when disabled', () => {
      const { queryByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} enabled={false} />
      );

      expect(queryByTestId('preset-buttons')).toBeNull();
      expect(queryByTestId('custom-time-button')).toBeNull();
      expect(queryByTestId('next-reminder-badge')).toBeNull();
    });

    it('should call onToggle when switch is toggled', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );

      fireEvent(getByTestId('reminder-toggle'), 'valueChange', false);

      expect(mockOnToggle).toHaveBeenCalledWith(false);
    });

    it('should trigger haptic feedback when toggling', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );

      fireEvent(getByTestId('reminder-toggle'), 'valueChange', false);

      expect(mockTriggerSelection).toHaveBeenCalled();
    });

    it('should dismiss keyboard when toggling', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );

      fireEvent(getByTestId('reminder-toggle'), 'valueChange', false);

      expect(Keyboard.dismiss).toHaveBeenCalled();
    });

    it('should announce toggle state for screen readers', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );

      fireEvent(getByTestId('reminder-toggle'), 'valueChange', false);

      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
        'Reminders disabled'
      );
    });
  });

  describe('Preset Selection', () => {
    it('should call onTimeChange with correct time when morning preset is selected', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );

      fireEvent.press(getByTestId('preset-morning'));

      const calledTime = mockOnTimeChange.mock.calls[0][0];
      expect(calledTime.getHours()).toBe(7);
      expect(calledTime.getMinutes()).toBe(0);
    });

    it('should call onTimeChange with correct time when midday preset is selected', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector
          {...defaultProps}
          reminderTime={createTime(7, 0)}
        />
      );

      fireEvent.press(getByTestId('preset-midday'));

      const calledTime = mockOnTimeChange.mock.calls[0][0];
      expect(calledTime.getHours()).toBe(12);
      expect(calledTime.getMinutes()).toBe(0);
    });

    it('should call onTimeChange with correct time when evening preset is selected', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );

      fireEvent.press(getByTestId('preset-evening'));

      const calledTime = mockOnTimeChange.mock.calls[0][0];
      expect(calledTime.getHours()).toBe(20);
      expect(calledTime.getMinutes()).toBe(0);
    });

    it('should trigger haptic feedback when selecting preset', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );

      fireEvent.press(getByTestId('preset-morning'));

      expect(mockTriggerSelection).toHaveBeenCalled();
    });

    it('should dismiss keyboard when selecting preset', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );

      fireEvent.press(getByTestId('preset-morning'));

      expect(Keyboard.dismiss).toHaveBeenCalled();
    });

    it('should announce preset selection for screen readers', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );

      fireEvent.press(getByTestId('preset-morning'));

      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
        'Reminder set for Morning'
      );
    });
  });

  describe('Preset Visual State', () => {
    it('should show midday preset as selected when reminderTime is 12:00 PM', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector
          {...defaultProps}
          reminderTime={createTime(12, 0)}
        />
      );

      // The preset-midday should be selected (check accessibility state)
      const middayButton = getByTestId('preset-midday');
      expect(middayButton.props.accessibilityState.selected).toBe(true);
    });

    it('should show morning preset as selected when reminderTime is 7:00 AM', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector
          {...defaultProps}
          reminderTime={createTime(7, 0)}
        />
      );

      const morningButton = getByTestId('preset-morning');
      expect(morningButton.props.accessibilityState.selected).toBe(true);
    });

    it('should show evening preset as selected when reminderTime is 8:00 PM', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector
          {...defaultProps}
          reminderTime={createTime(20, 0)}
        />
      );

      const eveningButton = getByTestId('preset-evening');
      expect(eveningButton.props.accessibilityState.selected).toBe(true);
    });

    it('should not show any preset as selected when time is custom', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector
          {...defaultProps}
          reminderTime={createTime(6, 30)} // Custom time
        />
      );

      expect(
        getByTestId('preset-morning').props.accessibilityState.selected
      ).toBe(false);
      expect(
        getByTestId('preset-midday').props.accessibilityState.selected
      ).toBe(false);
      expect(
        getByTestId('preset-evening').props.accessibilityState.selected
      ).toBe(false);
    });
  });

  describe('Custom Time Button', () => {
    it('should show "or pick a custom time" when no custom time is set', () => {
      const { getByText } = render(
        <EnhancedReminderSelector
          {...defaultProps}
          reminderTime={createTime(12, 0)} // Preset time
        />
      );

      expect(getByText('or pick a custom time')).toBeDefined();
    });

    it('should show formatted time when custom time is set', () => {
      const { getByText } = render(
        <EnhancedReminderSelector
          {...defaultProps}
          reminderTime={createTime(6, 30)} // Custom time
        />
      );

      expect(getByText('6:30 AM')).toBeDefined();
    });

    it('should open time picker when custom time button is pressed', () => {
      const { getByTestId, queryByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );

      // Initially modal should not be visible
      expect(queryByTestId('time-picker-modal')).toBeNull();

      // Press custom time button
      fireEvent.press(getByTestId('custom-time-button'));

      // Modal should now be visible
      expect(getByTestId('time-picker-modal')).toBeDefined();
    });

    it('should trigger haptic feedback when opening time picker', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );

      fireEvent.press(getByTestId('custom-time-button'));

      expect(mockTriggerSelection).toHaveBeenCalled();
    });

    it('should dismiss keyboard when opening time picker', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );

      fireEvent.press(getByTestId('custom-time-button'));

      expect(Keyboard.dismiss).toHaveBeenCalled();
    });
  });

  describe('Time Picker Modal Integration', () => {
    it('should call onTimeChange when time is confirmed in picker', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );

      // Open picker
      fireEvent.press(getByTestId('custom-time-button'));

      // Confirm time
      fireEvent.press(getByTestId('picker-confirm'));

      // Should call onTimeChange with the new time
      const calledTime = mockOnTimeChange.mock.calls[0][0];
      expect(calledTime.getHours()).toBe(6);
      expect(calledTime.getMinutes()).toBe(30);
    });

    it('should close picker when time is confirmed', () => {
      const { getByTestId, queryByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );

      // Open picker
      fireEvent.press(getByTestId('custom-time-button'));
      expect(getByTestId('time-picker-modal')).toBeDefined();

      // Confirm time
      fireEvent.press(getByTestId('picker-confirm'));

      // Picker should be closed
      expect(queryByTestId('time-picker-modal')).toBeNull();
    });

    it('should close picker when cancelled', () => {
      const { getByTestId, queryByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );

      // Open picker
      fireEvent.press(getByTestId('custom-time-button'));
      expect(getByTestId('time-picker-modal')).toBeDefined();

      // Cancel
      fireEvent.press(getByTestId('picker-cancel'));

      // Picker should be closed
      expect(queryByTestId('time-picker-modal')).toBeNull();
    });

    it('should not call onTimeChange when picker is cancelled', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );

      // Open picker
      fireEvent.press(getByTestId('custom-time-button'));

      // Clear mocks after opening (which triggers haptic)
      mockOnTimeChange.mockClear();

      // Cancel
      fireEvent.press(getByTestId('picker-cancel'));

      expect(mockOnTimeChange).not.toHaveBeenCalled();
    });

    it('should announce custom time for screen readers when confirmed', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );

      // Open picker
      fireEvent.press(getByTestId('custom-time-button'));

      // Confirm time
      fireEvent.press(getByTestId('picker-confirm'));

      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
        'Custom reminder set for 6:30 AM'
      );
    });
  });

  describe('Next Reminder Badge', () => {
    it('should show badge when enabled', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} enabled={true} />
      );

      expect(getByTestId('next-reminder-badge')).toBeDefined();
    });

    it('should hide badge when disabled', () => {
      const { queryByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} enabled={false} />
      );

      expect(queryByTestId('next-reminder-badge')).toBeNull();
    });

    it('should hide badge when showNextReminder is false', () => {
      const { queryByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} showNextReminder={false} />
      );

      expect(queryByTestId('next-reminder-badge')).toBeNull();
    });

    it('should pass correct time to badge', () => {
      const testTime = createTime(9, 45);
      const { getByText } = render(
        <EnhancedReminderSelector {...defaultProps} reminderTime={testTime} />
      );

      expect(getByText('Next: 9:45 AM')).toBeDefined();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible label on toggle', () => {
      const { getByLabelText } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );

      expect(getByLabelText('Disable reminder')).toBeDefined();
    });

    it('should have accessible label on toggle when disabled', () => {
      const { getByLabelText } = render(
        <EnhancedReminderSelector {...defaultProps} enabled={false} />
      );

      expect(getByLabelText('Enable reminder')).toBeDefined();
    });

    it('should have accessible labels on preset buttons', () => {
      const { getByLabelText } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );

      expect(getByLabelText('Set reminder for Morning at 7:00 AM')).toBeDefined();
      expect(getByLabelText('Set reminder for Midday at 12:00 PM')).toBeDefined();
      expect(getByLabelText('Set reminder for Evening at 8:00 PM')).toBeDefined();
    });

    it('should have accessible label on custom time button when no value', () => {
      const { getByLabelText } = render(
        <EnhancedReminderSelector
          {...defaultProps}
          reminderTime={createTime(12, 0)}
        />
      );

      expect(getByLabelText('Set a custom reminder time')).toBeDefined();
    });

    it('should have accessible label on custom time button when has value', () => {
      const { getByLabelText } = render(
        <EnhancedReminderSelector
          {...defaultProps}
          reminderTime={createTime(6, 30)}
        />
      );

      expect(
        getByLabelText('Custom time set to 6:30 AM. Double tap to change.')
      ).toBeDefined();
    });

    it('should have button role on preset buttons', () => {
      const { getAllByRole } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );

      const buttons = getAllByRole('button');
      // Should have 3 preset buttons + 1 custom time button = 4 buttons total
      expect(buttons.length).toBeGreaterThanOrEqual(4);
    });

    it('should have switch role on toggle', () => {
      const { getByRole } = render(
        <EnhancedReminderSelector {...defaultProps} />
      );

      expect(getByRole('switch')).toBeDefined();
    });
  });

  describe('Custom Presets', () => {
    const customPresets = [
      { id: 'early', label: '5 AM', emoji: '🌄', hour: 5, minute: 0 },
      { id: 'late', label: '11 PM', emoji: '🌃', hour: 23, minute: 0 },
    ];

    it('should render custom presets when provided', () => {
      const { getByTestId, queryByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} presets={customPresets} />
      );

      expect(getByTestId('preset-early')).toBeDefined();
      expect(getByTestId('preset-late')).toBeDefined();
      expect(queryByTestId('preset-morning')).toBeNull();
    });

    it('should call onTimeChange with custom preset time', () => {
      const { getByTestId } = render(
        <EnhancedReminderSelector {...defaultProps} presets={customPresets} />
      );

      fireEvent.press(getByTestId('preset-early'));

      const calledTime = mockOnTimeChange.mock.calls[0][0];
      expect(calledTime.getHours()).toBe(5);
      expect(calledTime.getMinutes()).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle midnight (0:00) correctly', () => {
      const { getByText } = render(
        <EnhancedReminderSelector
          {...defaultProps}
          reminderTime={createTime(0, 0)}
        />
      );

      expect(getByText('12:00 AM')).toBeDefined();
    });

    it('should handle noon (12:00) correctly', () => {
      const { getByText } = render(
        <EnhancedReminderSelector
          {...defaultProps}
          reminderTime={createTime(12, 0)}
        />
      );

      // Noon is a preset, so the custom-time CTA stays in its default state
      expect(getByText('or pick a custom time')).toBeDefined();
    });

    it('should handle times with non-zero minutes', () => {
      const { getByText } = render(
        <EnhancedReminderSelector
          {...defaultProps}
          reminderTime={createTime(14, 45)}
        />
      );

      expect(getByText('2:45 PM')).toBeDefined();
    });
  });

  describe('Export Constants', () => {
    it('should export DEFAULT_PRESETS', () => {
      expect(DEFAULT_PRESETS).toBeDefined();
      expect(DEFAULT_PRESETS.length).toBe(3);
    });

    it('should have morning preset at 7:00 AM', () => {
      const morning = DEFAULT_PRESETS.find((p) => p.id === 'morning');
      expect(morning).toBeDefined();
      expect(morning?.hour).toBe(7);
      expect(morning?.minute).toBe(0);
    });

    it('should have midday preset at 12:00 PM', () => {
      const midday = DEFAULT_PRESETS.find((p) => p.id === 'midday');
      expect(midday).toBeDefined();
      expect(midday?.hour).toBe(12);
      expect(midday?.minute).toBe(0);
    });

    it('should have evening preset at 8:00 PM', () => {
      const evening = DEFAULT_PRESETS.find((p) => p.id === 'evening');
      expect(evening).toBeDefined();
      expect(evening?.hour).toBe(20);
      expect(evening?.minute).toBe(0);
    });
  });
});
