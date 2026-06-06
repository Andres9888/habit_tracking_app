import React from 'react';
import { render } from '@testing-library/react-native';
import { CalendarTabContent } from '../CalendarTabContent';

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  const createChainable = () => {
    const chain: Record<string, () => typeof chain> = {};
    ['delay', 'duration', 'springify', 'damping'].forEach((m) => {
      chain[m] = () => createChainable();
    });
    return chain;
  };
  return {
    __esModule: true,
    default: {
      View,
      createAnimatedComponent: (Component: unknown) => Component,
    },
    FadeIn: createChainable(),
    Easing: { out: (fn: unknown) => fn, cubic: (x: number) => x },
  };
});

jest.mock('../../../../components/ErrorBoundary', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../../../../components/BinaryHeatmap', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    MonthlyCalendarGrid: ({
      showStreakInInsights,
    }: {
      showStreakInInsights?: boolean;
    }) =>
      React.createElement(
        Text,
        { testID: 'month-grid' },
        showStreakInInsights ? 'with-streak' : 'no-streak'
      ),
  };
});

jest.mock('../YearHeatmapSection', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    YearHeatmapSection: ({ currentStreak }: { currentStreak?: number }) =>
      React.createElement(
        Text,
        { testID: 'year-heatmap' },
        `year-${currentStreak}`
      ),
  };
});

const mockHabit = {
  _id: 'habit-1' as never,
  name: 'Meditation',
  currentStreak: 14,
  createdAt: Date.now(),
} as never;

describe('CalendarTabContent', () => {
  it('renders year heatmap on top and month grid below with detail options', () => {
    const { getByTestId } = render(
      <CalendarTabContent
        completedDates={new Set(['2026-06-01'])}
        habit={mockHabit}
        habitColor='#0D9488'
        onDayPress={jest.fn()}
      />
    );

    expect(getByTestId('month-grid').props.children).toBe('no-streak');
    expect(getByTestId('year-heatmap').props.children).toBe('year-14');
  });
});
