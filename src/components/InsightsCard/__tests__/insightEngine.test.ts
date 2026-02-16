import { generateInsights } from '../insightEngine';
import { format, subDays, addDays } from 'date-fns';

function makeTracking(dates: string[], habitId = 'h1') {
  return dates.map((date) => ({ completed: true, date, habitId }));
}

function consecutiveDates(count: number, endDate = new Date()): string[] {
  const dates: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    dates.push(format(subDays(endDate, i), 'yyyy-MM-dd'));
  }
  return dates;
}

describe('insightEngine', () => {
  describe('generateInsights', () => {
    it('returns empty array for insufficient data', () => {
      const result = generateInsights({
        currentStreak: 0,
        habitName: 'Exercise',
        tracking: [],
      });
      expect(result).toEqual([]);
    });

    it('generates streak break insight when streak is broken', () => {
      const today = new Date();
      // Completed 5 days in a row ending 3 days ago
      const dates = consecutiveDates(5, subDays(today, 3));
      const result = generateInsights({
        currentStreak: 0,
        habitName: 'Meditate',
        tracking: makeTracking(dates),
      });
      const breakInsight = result.find((i) => i.type === 'streak_break');
      expect(breakInsight).toBeDefined();
      expect(breakInsight!.message).toContain('5-day streak');
      expect(breakInsight!.message).toContain('Meditate');
    });

    it('generates historical benchmark when chasing personal best', () => {
      const today = new Date();
      // Past streak of 10 days (ending 20 days ago)
      const pastDates = consecutiveDates(10, subDays(today, 20));
      // Current streak of 5 days
      const currentDates = consecutiveDates(5, today);
      const result = generateInsights({
        currentStreak: 5,
        habitName: 'Read',
        tracking: makeTracking([...pastDates, ...currentDates]),
      });
      const benchmark = result.find((i) => i.type === 'historical_benchmark');
      expect(benchmark).toBeDefined();
      expect(benchmark!.message).toContain('10 days');
      expect(benchmark!.message).toContain('50%');
    });

    it('generates new record insight at personal best', () => {
      const today = new Date();
      const dates = consecutiveDates(15, today);
      const result = generateInsights({
        currentStreak: 15,
        habitName: 'Run',
        tracking: makeTracking(dates),
      });
      const benchmark = result.find((i) => i.type === 'historical_benchmark');
      expect(benchmark).toBeDefined();
      expect(benchmark!.message).toContain('ALL-TIME BEST');
    });

    it('generates streak prediction for active streaks', () => {
      const today = new Date();
      // 5-day active streak with good history
      const dates = consecutiveDates(20, today);
      const result = generateInsights({
        currentStreak: 5,
        habitName: 'Code',
        tracking: makeTracking(dates),
      });
      const prediction = result.find((i) => i.type === 'streak_prediction');
      expect(prediction).toBeDefined();
      expect(prediction!.message).toContain('7-day streak');
    });

    it('sorts insights by priority (highest first)', () => {
      const today = new Date();
      const dates = consecutiveDates(20, today);
      const result = generateInsights({
        currentStreak: 5,
        habitName: 'Test',
        tracking: makeTracking(dates),
      });
      for (let i = 1; i < result.length; i++) {
        expect(result[i - 1].priority).toBeGreaterThanOrEqual(result[i].priority);
      }
    });
  });
});
