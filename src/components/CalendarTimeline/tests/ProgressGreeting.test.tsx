import React from 'react';
import { render } from '@testing-library/react-native';

import { ProgressGreeting } from '../components/ProgressGreeting';

const baseProps = {
  completedToday: 2,
  totalHabits: 5,
  currentDate: new Date(2024, 9, 14),
  dateRangeText: 'Oct 14 – 20',
  isViewingPast: false,
};

describe('ProgressGreeting', () => {
  describe('greeting rendering', () => {
    it('shows streak greeting for streak 2-6', () => {
      const { getByText } = render(
        <ProgressGreeting {...baseProps} currentStreak={3} />
      );
      expect(getByText('3-day streak')).toBeTruthy();
    });

    it('shows streak greeting for streak >= 7', () => {
      const { getByText } = render(
        <ProgressGreeting {...baseProps} currentStreak={14} />
      );
      expect(getByText('14-day streak')).toBeTruthy();
    });

    it('shows no greeting when streak is 0 (collapsed)', () => {
      const { queryByText } = render(
        <ProgressGreeting {...baseProps} currentStreak={0} />
      );
      expect(queryByText(/streak/i)).toBeNull();
    });

    it('shows no greeting when streak is 1 (collapsed)', () => {
      const { queryByText } = render(
        <ProgressGreeting {...baseProps} currentStreak={1} />
      );
      expect(queryByText(/streak/i)).toBeNull();
    });

    it('defaults to collapsed when currentStreak prop is omitted', () => {
      const { queryByText } = render(<ProgressGreeting {...baseProps} />);
      expect(queryByText(/streak/i)).toBeNull();
    });
  });

  describe('perfect day priority', () => {
    it('shows "Perfect day" when all habits completed, even with streak', () => {
      const { getByText } = render(
        <ProgressGreeting
          {...baseProps}
          completedToday={5}
          totalHabits={5}
          currentStreak={10}
        />
      );
      expect(getByText('Perfect day')).toBeTruthy();
    });
  });

  describe('progress text', () => {
    it('shows completion count', () => {
      const { getByText } = render(
        <ProgressGreeting {...baseProps} currentStreak={0} />
      );
      expect(getByText(/2.*of.*5/)).toBeTruthy();
    });
  });
});
