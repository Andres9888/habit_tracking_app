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
  describe('streak badge rendering', () => {
    it('shows fire badge when streak is 2-6', () => {
      const { getByText } = render(
        <ProgressGreeting {...baseProps} currentStreak={3} />
      );
      expect(getByText('3-day streak')).toBeTruthy();
      expect(getByText(/🔥.*Keep it going!/)).toBeTruthy();
    });

    it('shows lightning badge when streak >= 7', () => {
      const { getByText } = render(
        <ProgressGreeting {...baseProps} currentStreak={14} />
      );
      expect(getByText('14-day streak')).toBeTruthy();
      expect(getByText(/⚡.*On fire!/)).toBeTruthy();
    });

    it('shows no badge when streak is 0', () => {
      const { queryByText } = render(
        <ProgressGreeting {...baseProps} currentStreak={0} />
      );
      expect(queryByText(/🔥/)).toBeNull();
      expect(queryByText(/⚡/)).toBeNull();
    });

    it('shows no badge when streak is 1', () => {
      const { getByText, queryByText } = render(
        <ProgressGreeting {...baseProps} currentStreak={1} />
      );
      expect(getByText('Great start!')).toBeTruthy();
      expect(queryByText(/🔥/)).toBeNull();
    });

    it('defaults to time-of-day greeting when currentStreak prop is omitted', () => {
      const { queryByText } = render(<ProgressGreeting {...baseProps} />);
      expect(queryByText(/🔥/)).toBeNull();
      expect(queryByText(/⚡/)).toBeNull();
    });
  });

  describe('perfect day priority', () => {
    it('shows "Perfect day" when all habits completed, even with streak', () => {
      const { getByText, queryByText } = render(
        <ProgressGreeting
          {...baseProps}
          completedToday={5}
          totalHabits={5}
          currentStreak={10}
        />
      );
      expect(getByText('Perfect day')).toBeTruthy();
      expect(queryByText(/⚡/)).toBeNull();
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
