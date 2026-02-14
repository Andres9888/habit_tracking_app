/**
 * Streak Analytics Tests
 * Tests for streak calculation in analytics
 *
 * Note: computeStreakFromDates is an internal function, so we test
 * the logic by extracting and testing the algorithm directly.
 */

// Copy of the internal algorithm for testing
interface StreakResult {
  currentStreak: number;
  longestStreak: number;
}

function computeStreakFromDates(sortedDates: string[]): StreakResult {
  if (sortedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  let tempStreak = 0;
  let longestStreak = 0;
  let lastDate: Date | null = null;

  for (const dateStr of sortedDates) {
    const trackingDate = new Date(dateStr);

    if (lastDate === null) {
      tempStreak = 1;
    } else {
      const daysDiff = Math.floor(
        (trackingDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysDiff === 1) {
        tempStreak++;
      } else if (daysDiff > 1) {
        tempStreak = 1;
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);
    lastDate = trackingDate;
  }

  // Check if streak is current (within last 2 days)
  const today = new Date();
  let currentStreak = 0;
  if (lastDate) {
    const daysSinceLastCompletion = Math.floor(
      (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    currentStreak = daysSinceLastCompletion <= 1 ? tempStreak : 0;
  }

  return { currentStreak, longestStreak };
}

describe('Analytics Streak Calculations', () => {
  describe('computeStreakFromDates - longestStreak (deterministic)', () => {
    it('should return 0 for empty array', () => {
      const result = computeStreakFromDates([]);
      expect(result.longestStreak).toBe(0);
    });

    it('should return streak of 1 for single completion', () => {
      const result = computeStreakFromDates(['2025-01-15']);
      expect(result.longestStreak).toBe(1);
    });

    it('should calculate consecutive day streak', () => {
      const dates = ['2025-01-10', '2025-01-11', '2025-01-12'];
      const result = computeStreakFromDates(dates);
      expect(result.longestStreak).toBe(3);
    });

    it('should handle gaps in dates', () => {
      const dates = ['2025-01-10', '2025-01-12', '2025-01-13'];
      const result = computeStreakFromDates(dates);
      expect(result.longestStreak).toBe(2);
    });

    it('should calculate longest streak with multiple runs', () => {
      const dates = [
        '2025-01-01',
        '2025-01-02',
        '2025-01-03', // 3-day streak
        '2025-01-10',
        '2025-01-11',
        '2025-01-12',
        '2025-01-13',
        '2025-01-14', // 5-day streak
      ];
      const result = computeStreakFromDates(dates);
      expect(result.longestStreak).toBe(5);
    });

    it('should process dates in order given (sorted input expected)', () => {
      // Note: computeStreakFromDates expects pre-sorted dates
      const sortedDates = ['2025-01-10', '2025-01-11', '2025-01-12'];
      const result = computeStreakFromDates(sortedDates);
      expect(result.longestStreak).toBe(3);
    });

    it('should handle month boundaries', () => {
      const dates = ['2025-01-31', '2025-02-01', '2025-02-02'];
      const result = computeStreakFromDates(dates);
      expect(result.longestStreak).toBe(3);
    });

    it('should handle year boundaries', () => {
      const dates = ['2024-12-31', '2025-01-01', '2025-01-02'];
      const result = computeStreakFromDates(dates);
      expect(result.longestStreak).toBe(3);
    });

    it('should handle leap year dates', () => {
      const dates = ['2024-02-28', '2024-02-29', '2024-03-01'];
      const result = computeStreakFromDates(dates);
      expect(result.longestStreak).toBe(3);
    });

    it('should handle duplicate dates', () => {
      const dates = ['2025-01-10', '2025-01-10', '2025-01-11'];
      const result = computeStreakFromDates(dates);
      expect(result.longestStreak).toBe(2);
    });

    it('should handle large gaps correctly', () => {
      const dates = [
        '2025-01-01',
        '2025-01-02', // 2-day streak
        '2025-02-01',
        '2025-02-02',
        '2025-02-03', // 3-day streak
      ];
      const result = computeStreakFromDates(dates);
      expect(result.longestStreak).toBe(3);
    });
  });

  describe('computeStreakFromDates - currentStreak (date-dependent)', () => {
    it('should have current streak for today/yesterday completions', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const dates = [
        yesterday.toISOString().split('T')[0],
        today.toISOString().split('T')[0],
      ];
      const result = computeStreakFromDates(dates);

      expect(result.longestStreak).toBe(2);
      expect(result.currentStreak).toBe(2);
    });

    it('should have 0 currentStreak for old dates', () => {
      const dates = ['2020-01-01', '2020-01-02'];
      const result = computeStreakFromDates(dates);

      expect(result.longestStreak).toBe(2);
      expect(result.currentStreak).toBe(0);
    });
  });
});
