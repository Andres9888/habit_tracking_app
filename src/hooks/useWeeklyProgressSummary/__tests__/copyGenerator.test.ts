import {
  generateNotificationTitle,
  generateNotificationBody,
  generateShortSummary,
} from '../copyGenerator';

describe('Weekly Progress Copy Generator', () => {
  describe('generateNotificationTitle', () => {
    it('celebrates perfect week', () => {
      expect(generateNotificationTitle(100, 7)).toContain('Perfect Week');
    });

    it('encourages high completion', () => {
      expect(generateNotificationTitle(92, 5)).toContain('Incredible');
    });

    it('acknowledges solid progress', () => {
      expect(generateNotificationTitle(55, 1)).toContain('Solid');
    });

    it('is gentle for low completion', () => {
      expect(generateNotificationTitle(15, 0)).toContain('progress');
    });
  });

  describe('generateNotificationBody', () => {
    it('includes completion stats', () => {
      const body = generateNotificationBody({
        completionRate: 80,
        totalCompleted: 28,
        totalPossible: 35,
        perfectDays: 3,
        longestStreak: 10,
        habitsImproved: 2,
        bestDay: { dayName: 'Monday', completionRate: 100 },
      });

      expect(body).toContain('28 of 35');
      expect(body).toContain('80%');
      expect(body).toContain('3 perfect days');
      expect(body).toContain('10 days');
      expect(body).toContain('2 habits improved');
      expect(body).toContain('Monday');
    });
  });

  describe('generateShortSummary', () => {
    it('returns compact summary', () => {
      expect(generateShortSummary(75, 21)).toBe('75% · 21 habits completed');
    });
  });
});
