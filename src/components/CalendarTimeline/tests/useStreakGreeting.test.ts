import { getStreakGreeting } from '../hooks/useStreakGreeting';

describe('getStreakGreeting', () => {
  const base = { currentStreak: 0, completedToday: 0, totalHabits: 5 };

  describe('perfect day (highest priority)', () => {
    it('returns "Perfect day" when all habits complete', () => {
      const result = getStreakGreeting({
        ...base,
        completedToday: 5,
        totalHabits: 5,
        currentStreak: 3,
      });
      expect(result.greeting).toBe('Perfect day');
      expect(result.badge).toBeUndefined();
    });

    it('returns "Perfect day" even with high streak', () => {
      const result = getStreakGreeting({
        ...base,
        completedToday: 5,
        totalHabits: 5,
        currentStreak: 30,
      });
      expect(result.greeting).toBe('Perfect day');
    });

    it('does not trigger when totalHabits is 0', () => {
      const result = getStreakGreeting({
        ...base,
        completedToday: 0,
        totalHabits: 0,
        hour: 9,
      });
      expect(result.greeting).toBe('Good morning');
    });
  });

  describe('streak === 0 (time-of-day fallback)', () => {
    it('returns "Good morning" before noon', () => {
      expect(getStreakGreeting({ ...base, hour: 0 }).greeting).toBe(
        'Good morning'
      );
      expect(getStreakGreeting({ ...base, hour: 9 }).greeting).toBe(
        'Good morning'
      );
      expect(getStreakGreeting({ ...base, hour: 11 }).greeting).toBe(
        'Good morning'
      );
    });

    it('returns "Good afternoon" from noon to 5pm', () => {
      expect(getStreakGreeting({ ...base, hour: 12 }).greeting).toBe(
        'Good afternoon'
      );
      expect(getStreakGreeting({ ...base, hour: 16 }).greeting).toBe(
        'Good afternoon'
      );
    });

    it('returns "Good evening" after 5pm', () => {
      expect(getStreakGreeting({ ...base, hour: 17 }).greeting).toBe(
        'Good evening'
      );
      expect(getStreakGreeting({ ...base, hour: 23 }).greeting).toBe(
        'Good evening'
      );
    });

    it('has no badge', () => {
      expect(getStreakGreeting({ ...base, hour: 10 }).badge).toBeUndefined();
    });
  });

  describe('streak === 1', () => {
    it('returns "Great start!" with no badge', () => {
      const result = getStreakGreeting({ ...base, currentStreak: 1, hour: 10 });
      expect(result.greeting).toBe('Great start!');
      expect(result.badge).toBeUndefined();
    });
  });

  describe('streak 2-6 (fire badge)', () => {
    it.each([2, 3, 4, 5, 6])(
      'returns "%i-day streak" with fire badge for streak=%i',
      (streak) => {
        const result = getStreakGreeting({
          ...base,
          currentStreak: streak,
          hour: 10,
        });
        expect(result.greeting).toBe(`${streak}-day streak`);
        expect(result.badge).toEqual({ emoji: '🔥', text: 'Keep it going!' });
      }
    );
  });

  describe('streak >= 7 (lightning badge)', () => {
    it.each([7, 14, 30, 100])(
      'returns "%i-day streak" with lightning badge for streak=%i',
      (streak) => {
        const result = getStreakGreeting({
          ...base,
          currentStreak: streak,
          hour: 10,
        });
        expect(result.greeting).toBe(`${streak}-day streak`);
        expect(result.badge).toEqual({ emoji: '⚡', text: 'On fire!' });
      }
    );
  });
});
