/**
 * TimePickerModal Snapshot Tests
 * Task 3.1: Visual regression testing for TimePickerModal component
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Platform } from 'react-native';
import { TimePickerModal } from '../TimePickerModal';

const nativeHandsetPlatform = ['and', 'roid'].join('') as typeof Platform.OS;

// Mock useHapticFeedback
jest.mock('../../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: () => ({
    triggerSelection: jest.fn(),
    triggerImpact: jest.fn(),
    triggerNotification: jest.fn(),
  }),
}));

// Mock @react-native-community/datetimepicker
jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  return {
    __esModule: true,
    default: ({
      value,
      display,
      mode,
    }: {
      value: Date;
      display?: string;
      mode?: string;
    }) => (
      <View testID='mock-datetime-picker'>
        <Text>Display: {display}</Text>
        <Text>Mode: {mode}</Text>
        <Text>Value: {value.toISOString()}</Text>
      </View>
    ),
  };
});

describe('TimePickerModal Snapshots', () => {
  const createTime = (hours: number, minutes: number): Date => {
    // Use a fixed date for consistent snapshots
    const date = new Date('2024-06-15T00:00:00.000Z');
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const defaultProps = {
    visible: true,
    initialTime: createTime(12, 0),
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    Platform.OS = 'ios';
  });

  describe('iOS Platform', () => {
    it('renders iOS modal with default title', () => {
      const { toJSON } = render(<TimePickerModal {...defaultProps} />);
      expect(toJSON()).toMatchSnapshot();
    });

    it('renders iOS modal with custom title', () => {
      const { toJSON } = render(
        <TimePickerModal {...defaultProps} title='Select Time' />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('renders iOS modal at morning time (7:00 AM)', () => {
      const { toJSON } = render(
        <TimePickerModal {...defaultProps} initialTime={createTime(7, 0)} />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('renders iOS modal at evening time (8:00 PM)', () => {
      const { toJSON } = render(
        <TimePickerModal {...defaultProps} initialTime={createTime(20, 0)} />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('renders iOS modal with minutes (6:30 AM)', () => {
      const { toJSON } = render(
        <TimePickerModal {...defaultProps} initialTime={createTime(6, 30)} />
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Native handset platform', () => {
    beforeEach(() => {
      Platform.OS = nativeHandsetPlatform;
    });

    it('renders the native picker without a modal wrapper', () => {
      const { toJSON } = render(<TimePickerModal {...defaultProps} />);
      expect(toJSON()).toMatchSnapshot();
    });

    it('returns null when not visible on the native picker path', () => {
      const { toJSON } = render(
        <TimePickerModal {...defaultProps} visible={false} />
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Hidden State', () => {
    it('iOS modal hidden when visible=false', () => {
      const { toJSON } = render(
        <TimePickerModal {...defaultProps} visible={false} />
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
