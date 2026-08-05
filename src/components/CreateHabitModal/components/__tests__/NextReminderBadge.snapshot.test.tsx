/**
 * NextReminderBadge Snapshot Tests
 * Task 3.1: Visual regression testing for NextReminderBadge component
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { NextReminderBadge } from '../NextReminderBadge';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    __esModule: true,
    default: {
      View: View,
    },
    FadeIn: {
      duration: () => ({
        delay: () => ({}),
      }),
    },
    FadeOut: {
      duration: () => ({}),
    },
  };
});

// Mock lucide-react-native Clock icon
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    __esModule: true,
    Clock: ({ size, color }: { size: number; color: string }) => (
      <View
        testID='clock-icon'
        accessibilityLabel={`Clock ${size}px ${color}`}
      />
    ),
  };
});

describe('NextReminderBadge Snapshots', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Fixed time: 10:00 AM on June 15, 2024
    jest.setSystemTime(new Date('2024-06-15T10:00:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const createTime = (hours: number, minutes: number): Date => {
    const date = new Date('2024-06-15T00:00:00');
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  describe('Enabled State', () => {
    it('renders badge for future time today', () => {
      const { toJSON } = render(
        <NextReminderBadge reminderTime={createTime(14, 0)} enabled />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('renders badge for past time (shows tomorrow)', () => {
      const { toJSON } = render(
        <NextReminderBadge reminderTime={createTime(8, 0)} enabled />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('renders badge showing hours and minutes', () => {
      const { toJSON } = render(
        <NextReminderBadge reminderTime={createTime(14, 30)} enabled />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('renders badge showing only hours', () => {
      const { toJSON } = render(
        <NextReminderBadge reminderTime={createTime(13, 0)} enabled />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('renders badge showing only minutes', () => {
      const { toJSON } = render(
        <NextReminderBadge reminderTime={createTime(10, 30)} enabled />
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Time Formats', () => {
    it('renders morning preset time (7:00 AM)', () => {
      const { toJSON } = render(
        <NextReminderBadge reminderTime={createTime(7, 0)} enabled />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('renders midday preset time (12:00 PM)', () => {
      const { toJSON } = render(
        <NextReminderBadge reminderTime={createTime(12, 0)} enabled />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('renders evening preset time (8:00 PM)', () => {
      const { toJSON } = render(
        <NextReminderBadge reminderTime={createTime(20, 0)} enabled />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('renders custom time with minutes (6:30 AM)', () => {
      const { toJSON } = render(
        <NextReminderBadge reminderTime={createTime(6, 30)} enabled />
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Disabled State', () => {
    it('returns null when disabled', () => {
      const { toJSON } = render(
        <NextReminderBadge reminderTime={createTime(14, 0)} enabled={false} />
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
