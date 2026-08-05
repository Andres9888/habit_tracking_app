/**
 * EnhancedReminderSelector Snapshot Tests
 * Task 3.1: Visual regression testing for EnhancedReminderSelector component
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { EnhancedReminderSelector } from '../EnhancedReminderSelector';

// Mock useHapticFeedback
jest.mock('../../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: () => ({
    triggerSelection: jest.fn(),
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
jest.mock('../TimePickerModal', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  return {
    __esModule: true,
    TimePickerModal: ({ visible }: { visible: boolean }) => {
      if (!visible) return null;
      return (
        <View testID='time-picker-modal'>
          <Text>Time Picker Mock</Text>
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

describe('EnhancedReminderSelector Snapshots', () => {
  const createTime = (hours: number, minutes: number): Date => {
    const date = new Date('2024-06-15T00:00:00.000Z');
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const defaultProps = {
    enabled: true,
    reminderTime: createTime(12, 0),
    onToggle: jest.fn(),
    onTimeChange: jest.fn(),
  };

  describe('Enabled State', () => {
    it('renders with midday preset selected', () => {
      const { toJSON } = render(
        <EnhancedReminderSelector
          {...defaultProps}
          reminderTime={createTime(12, 0)}
        />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('renders with morning preset selected', () => {
      const { toJSON } = render(
        <EnhancedReminderSelector
          {...defaultProps}
          reminderTime={createTime(7, 0)}
        />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('renders with evening preset selected', () => {
      const { toJSON } = render(
        <EnhancedReminderSelector
          {...defaultProps}
          reminderTime={createTime(20, 0)}
        />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('renders with custom time (no preset selected)', () => {
      const { toJSON } = render(
        <EnhancedReminderSelector
          {...defaultProps}
          reminderTime={createTime(6, 30)}
        />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('renders with custom time at midnight', () => {
      const { toJSON } = render(
        <EnhancedReminderSelector
          {...defaultProps}
          reminderTime={createTime(0, 0)}
        />
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Disabled State', () => {
    it('renders in disabled state (collapsed)', () => {
      const { toJSON } = render(
        <EnhancedReminderSelector {...defaultProps} enabled={false} />
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Optional Props', () => {
    it('renders without next reminder badge', () => {
      const { toJSON } = render(
        <EnhancedReminderSelector {...defaultProps} showNextReminder={false} />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('renders with custom presets', () => {
      const customPresets = [
        { id: 'early', label: '5 AM', emoji: '🌄', hour: 5, minute: 0 },
        { id: 'late', label: '11 PM', emoji: '🌃', hour: 23, minute: 0 },
      ];

      const { toJSON } = render(
        <EnhancedReminderSelector
          {...defaultProps}
          presets={customPresets}
          reminderTime={createTime(5, 0)}
        />
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
