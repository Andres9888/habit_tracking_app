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
      expect(result.greeting).toBe('');
    });
  });

  describe('almost done', () => {
    it('returns "Just 1 left!" with almostDone variant', () => {
      const result = getStreakGreeting({
        ...base,
        completedToday: 4,
        totalHabits: 5,
        currentStreak: 3,
        hour: 10,
      });
      expect(result.greeting).toBe('Just 1 left!');
      expect(result.variant).toBe('almostDone');
    });

    it('takes priority over streak display', () => {
      const result = getStreakGreeting({
        ...base,
        completedToday: 4,
        totalHabits: 5,
        currentStreak: 10,
        hour: 10,
      });
      expect(result.greeting).toBe('Just 1 left!');
      expect(result.variant).toBe('almostDone');
    });
  });

  describe('streak at risk', () => {
    it('shows streak count in risk message after 8pm', () => {
      const result = getStreakGreeting({
        ...base,
        currentStreak: 5,
        completedToday: 0,
        hour: 20,
      });
      expect(result.greeting).toBe('5-day streak at risk');
      expect(result.variant).toBe('risk');
    });

    it('does not trigger before 8pm', () => {
      const result = getStreakGreeting({
        ...base,
        currentStreak: 5,
        completedToday: 0,
        hour: 19,
      });
      expect(result.greeting).not.toContain('at risk');
    });

    it('does not trigger when streak is 0', () => {
      const result = getStreakGreeting({
        ...base,
        currentStreak: 0,
        completedToday: 0,
        hour: 21,
      });
      expect(result.greeting).not.toContain('at risk');
    });

    it('does not trigger when some habits completed', () => {
      const result = getStreakGreeting({
        ...base,
        currentStreak: 5,
        completedToday: 2,
        hour: 21,
      });
      expect(result.greeting).not.toContain('at risk');
    });
  });

  describe('streak === 0 (collapsed header)', () => {
    it('returns empty string for morning', () => {
      expect(getStreakGreeting({ ...base, hour: 0 }).greeting).toBe('');
      expect(getStreakGreeting({ ...base, hour: 9 }).greeting).toBe('');
      expect(getStreakGreeting({ ...base, hour: 11 }).greeting).toBe('');
    });

    it('returns empty string for afternoon', () => {
      expect(getStreakGreeting({ ...base, hour: 12 }).greeting).toBe('');
      expect(getStreakGreeting({ ...base, hour: 16 }).greeting).toBe('');
    });

    it('returns empty string for evening', () => {
      expect(getStreakGreeting({ ...base, hour: 17 }).greeting).toBe('');
      expect(getStreakGreeting({ ...base, hour: 19 }).greeting).toBe('');
    });
  });

  describe('streak === 1 (collapsed header)', () => {
    it('returns empty string', () => {
      const result = getStreakGreeting({
        ...base,
        currentStreak: 1,
        hour: 10,
      });
      expect(result.greeting).toBe('');
    });
  });

  describe('streak 2-6', () => {
    it.each([2, 3, 4, 5, 6])(
      'returns "%i-day streak" for streak=%i',
      (streak) => {
        const result = getStreakGreeting({
          ...base,
          currentStreak: streak,
          hour: 10,
        });
        expect(result.greeting).toBe(`${streak}-day streak`);
      }
    );
  });

  describe('streak >= 7', () => {
    it.each([7, 14, 30, 100])(
      'returns "%i-day streak" for streak=%i',
      (streak) => {
        const result = getStreakGreeting({
          ...base,
          currentStreak: streak,
          hour: 10,
        });
        expect(result.greeting).toBe(`${streak}-day streak`);
      }
    );
  });
});
