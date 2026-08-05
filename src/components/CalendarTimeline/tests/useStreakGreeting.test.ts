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
      expect(result.variant).toBe('success');
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

  describe('almost done (1 remaining)', () => {
    it('returns "Just 1 left!" when 1 habit remains of many', () => {
      const result = getStreakGreeting({
        ...base,
        completedToday: 4,
        totalHabits: 5,
        currentStreak: 3,
        hour: 10,
      });
      expect(result.greeting).toBe('Just 1 left!');
      expect(result.badge).toBeUndefined();
      expect(result.variant).toBe('almostDone');
    });

    it('returns "Just 1 left!" when totalHabits is 1 and 0 completed', () => {
      const result = getStreakGreeting({
        ...base,
        completedToday: 0,
        totalHabits: 1,
        currentStreak: 0,
        hour: 10,
      });
      expect(result.greeting).toBe('Just 1 left!');
    });

    it('has higher priority than streak at risk', () => {
      const result = getStreakGreeting({
        ...base,
        completedToday: 4,
        totalHabits: 5,
        currentStreak: 5,
        hour: 21,
      });
      expect(result.greeting).toBe('Just 1 left!');
    });
  });

  describe('streak at risk (evening + 0 done + has streak)', () => {
    it('returns "Streak at risk" at 8pm with streak and 0 completed', () => {
      const result = getStreakGreeting({
        ...base,
        completedToday: 0,
        totalHabits: 5,
        currentStreak: 5,
        hour: 20,
      });
      expect(result.greeting).toBe('Streak at risk');
      expect(result.badge).toEqual({ emoji: '⚠️', text: '5 days at stake' });
      expect(result.variant).toBe('risk');
    });

    it('does not trigger before 8pm', () => {
      const result = getStreakGreeting({
        ...base,
        completedToday: 0,
        totalHabits: 5,
        currentStreak: 5,
        hour: 19,
      });
      expect(result.greeting).not.toBe('Streak at risk');
    });

    it('does not trigger when streak is 0', () => {
      const result = getStreakGreeting({
        ...base,
        completedToday: 0,
        totalHabits: 5,
        currentStreak: 0,
        hour: 21,
      });
      expect(result.greeting).not.toBe('Streak at risk');
    });

    it('does not trigger when some habits are completed', () => {
      const result = getStreakGreeting({
        ...base,
        completedToday: 1,
        totalHabits: 5,
        currentStreak: 5,
        hour: 21,
      });
      expect(result.greeting).not.toBe('Streak at risk');
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
