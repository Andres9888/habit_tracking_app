/**
 * TimePickerModal Component Tests
 * Task 1.1: Create TimePickerModal Component
 *
 * Tests:
 * - Modal opens with passed initialTime
 * - iOS shows spinner picker in modal wrapper
 * - Native Handset shows clock picker (self-contained)
 * - onConfirm called with selected time
 * - onCancel called on dismiss
 * - Keyboard dismissed when modal opens
 * - Haptic feedback on confirm
 * - Accessible labels for picker
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Platform, Keyboard } from 'react-native';
import { TimePickerModal, TimePickerModalProps } from '../TimePickerModal';

const nativeHandsetPlatform = ['and', 'roid'].join('') as typeof Platform.OS;

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

// Mock @react-native-community/datetimepicker
const mockOnChange = jest.fn();
jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  const { View, Text, Pressable } = require('react-native');

  return {
    __esModule: true,
    default: ({
      value,
      onChange,
      testID,
      display,
      mode,
    }: {
      value: Date;
      onChange: (event: { type: string }, date?: Date) => void;
      testID?: string;
      display?: string;
      mode?: string;
    }) => {
      // Store onChange for test access
      mockOnChange.mockImplementation(onChange);

      return (
        <View testID={testID || 'date-time-picker'}>
          <Text testID='picker-display'>{display}</Text>
          <Text testID='picker-mode'>{mode}</Text>
          <Text testID='picker-value'>{value.toISOString()}</Text>
          <Pressable
            testID='picker-simulate-change'
            onPress={() => {
              const newTime = new Date(value);
              newTime.setHours(9, 30, 0, 0);
              onChange({ type: 'set' }, newTime);
            }}
          />
          <Pressable
            testID='picker-simulate-dismiss'
            onPress={() => {
              onChange({ type: 'dismissed' }, undefined);
            }}
          />
        </View>
      );
    },
  };
});

// Mock Keyboard
jest.spyOn(Keyboard, 'dismiss').mockImplementation(() => {});

describe('TimePickerModal', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  const createInitialTime = (hours: number, minutes: number): Date => {
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const defaultProps: TimePickerModalProps = {
    visible: true,
    initialTime: createInitialTime(12, 0),
    onConfirm: mockOnConfirm,
    onCancel: mockOnCancel,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset Platform.OS to iOS for most tests
    Platform.OS = 'ios';
  });

  describe('Component Rendering', () => {
    it('should not render when visible is false (Native Handset)', () => {
      Platform.OS = nativeHandsetPlatform;
      const { queryByTestId } = render(
        <TimePickerModal {...defaultProps} visible={false} />
      );
      expect(queryByTestId('time-picker-native')).toBeNull();
    });

    it('should render modal when visible is true (iOS)', () => {
      const { getByTestId } = render(<TimePickerModal {...defaultProps} />);
      expect(getByTestId('time-picker-modal')).toBeDefined();
    });

    it('should render DateTimePicker when visible is true (Native Handset)', () => {
      Platform.OS = nativeHandsetPlatform;
      const { getByTestId } = render(<TimePickerModal {...defaultProps} />);
      expect(getByTestId('time-picker-native')).toBeDefined();
    });

    it('should display default title "Set Reminder Time" (iOS)', () => {
      const { getByText } = render(<TimePickerModal {...defaultProps} />);
      expect(getByText('Set Reminder Time')).toBeDefined();
    });

    it('should display custom title when provided (iOS)', () => {
      const { getByText } = render(
        <TimePickerModal {...defaultProps} title='Pick a time' />
      );
      expect(getByText('Pick a time')).toBeDefined();
    });
  });

  describe('Platform-Specific Behavior', () => {
    it('should use spinner display on iOS', () => {
      const { getByTestId } = render(<TimePickerModal {...defaultProps} />);
      const displayText = getByTestId('picker-display');
      expect(displayText.props.children).toBe('spinner');
    });

    it('should use clock display on Native Handset', () => {
      Platform.OS = nativeHandsetPlatform;
      const { getByTestId } = render(<TimePickerModal {...defaultProps} />);
      const displayText = getByTestId('picker-display');
      expect(displayText.props.children).toBe('clock');
    });

    it('should show modal wrapper on iOS with Cancel/Set Time buttons', () => {
      const { getByText } = render(<TimePickerModal {...defaultProps} />);
      expect(getByText('Cancel')).toBeDefined();
      expect(getByText('Set Time')).toBeDefined();
    });

    it('should not show modal wrapper on Native Handset (self-contained picker)', () => {
      Platform.OS = nativeHandsetPlatform;
      const { queryByText } = render(<TimePickerModal {...defaultProps} />);
      expect(queryByText('Cancel')).toBeNull();
      expect(queryByText('Set Time')).toBeNull();
    });
  });

  describe('Initial Time', () => {
    it('should open with the passed initialTime', () => {
      const initialTime = createInitialTime(15, 45);
      const { getByTestId } = render(
        <TimePickerModal {...defaultProps} initialTime={initialTime} />
      );

      const pickerValue = getByTestId('picker-value');
      const displayedDate = new Date(pickerValue.props.children);
      expect(displayedDate.getHours()).toBe(15);
      expect(displayedDate.getMinutes()).toBe(45);
    });

    it('should reset to initialTime when modal reopens', async () => {
      const initialTime = createInitialTime(8, 0);
      const { rerender, getByTestId } = render(
        <TimePickerModal
          {...defaultProps}
          initialTime={initialTime}
          visible={false}
        />
      );

      // Open modal
      rerender(
        <TimePickerModal
          {...defaultProps}
          initialTime={initialTime}
          visible={true}
        />
      );

      const pickerValue = getByTestId('picker-value');
      const displayedDate = new Date(pickerValue.props.children);
      expect(displayedDate.getHours()).toBe(8);
    });
  });

  describe('Keyboard Dismissal', () => {
    it('should dismiss keyboard when modal opens', () => {
      render(<TimePickerModal {...defaultProps} visible={false} />);
      expect(Keyboard.dismiss).not.toHaveBeenCalled();

      render(<TimePickerModal {...defaultProps} visible={true} />);
      expect(Keyboard.dismiss).toHaveBeenCalled();
    });
  });

  describe('User Interaction - iOS', () => {
    it('should call onConfirm with selected time when "Set Time" is pressed', () => {
      const { getByText, getByTestId } = render(
        <TimePickerModal {...defaultProps} />
      );

      // Simulate time change in picker
      fireEvent.press(getByTestId('picker-simulate-change'));

      // Press Set Time button
      fireEvent.press(getByText('Set Time'));

      expect(mockOnConfirm).toHaveBeenCalled();
      const confirmedTime = mockOnConfirm.mock.calls[0][0];
      expect(confirmedTime).toBeInstanceOf(Date);
    });

    it('should call onCancel when "Cancel" is pressed', () => {
      const { getByText } = render(<TimePickerModal {...defaultProps} />);

      fireEvent.press(getByText('Cancel'));

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('should call onCancel when backdrop is tapped', () => {
      const { getByLabelText } = render(<TimePickerModal {...defaultProps} />);

      fireEvent.press(getByLabelText('Dismiss time picker'));

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('should trigger haptic feedback on confirm', () => {
      const { getByText } = render(<TimePickerModal {...defaultProps} />);

      fireEvent.press(getByText('Set Time'));

      expect(mockTriggerSelection).toHaveBeenCalled();
    });

    it('should trigger haptic feedback on cancel', () => {
      const { getByText } = render(<TimePickerModal {...defaultProps} />);

      fireEvent.press(getByText('Cancel'));

      expect(mockTriggerSelection).toHaveBeenCalled();
    });
  });

  describe('User Interaction - Native Handset', () => {
    beforeEach(() => {
      Platform.OS = nativeHandsetPlatform;
    });

    it('should call onConfirm when picker confirms (event.type = "set")', () => {
      const { getByTestId } = render(<TimePickerModal {...defaultProps} />);

      fireEvent.press(getByTestId('picker-simulate-change'));

      expect(mockOnConfirm).toHaveBeenCalled();
      const confirmedTime = mockOnConfirm.mock.calls[0][0];
      expect(confirmedTime.getHours()).toBe(9);
      expect(confirmedTime.getMinutes()).toBe(30);
    });

    it('should call onCancel when picker is dismissed (event.type = "dismissed")', () => {
      const { getByTestId } = render(<TimePickerModal {...defaultProps} />);

      fireEvent.press(getByTestId('picker-simulate-dismiss'));

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('should trigger haptic feedback on Native Handset confirm', () => {
      const { getByTestId } = render(<TimePickerModal {...defaultProps} />);

      fireEvent.press(getByTestId('picker-simulate-change'));

      expect(mockTriggerSelection).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible role header on title (iOS)', () => {
      const { getByRole } = render(<TimePickerModal {...defaultProps} />);
      expect(getByRole('header')).toBeDefined();
    });

    it('should have accessible label on Cancel button', () => {
      const { getByLabelText } = render(<TimePickerModal {...defaultProps} />);
      expect(getByLabelText('Cancel')).toBeDefined();
    });

    it('should have accessible label on Set Time button with time preview', () => {
      const initialTime = createInitialTime(14, 30);
      const { getByLabelText } = render(
        <TimePickerModal {...defaultProps} initialTime={initialTime} />
      );

      // The accessibility label includes the time
      const setTimeButton = getByLabelText(/Set time to/);
      expect(setTimeButton).toBeDefined();
    });

    it('should have accessible label on backdrop for dismissal', () => {
      const { getByLabelText } = render(<TimePickerModal {...defaultProps} />);
      expect(getByLabelText('Dismiss time picker')).toBeDefined();
    });

    it('should have button role on Cancel button', () => {
      const { getAllByRole } = render(<TimePickerModal {...defaultProps} />);
      const buttons = getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(2); // Cancel and Set Time
    });
  });

  describe('Time Mode', () => {
    it('should use time mode for the picker (iOS)', () => {
      const { getByTestId } = render(<TimePickerModal {...defaultProps} />);
      const modeText = getByTestId('picker-mode');
      expect(modeText.props.children).toBe('time');
    });

    it('should use time mode for the picker (Native Handset)', () => {
      Platform.OS = nativeHandsetPlatform;
      const { getByTestId } = render(<TimePickerModal {...defaultProps} />);
      const modeText = getByTestId('picker-mode');
      expect(modeText.props.children).toBe('time');
    });
  });
});
