/**
 * detectStreakSegments Algorithm Tests
 * Tests streak segment detection from completion data
 */

import { detectStreakSegments, getStrengthTier } from '../utils';

describe('detectStreakSegments', () => {
  // Fixed reference date for consistent testing
  const referenceDate = new Date('2025-12-28');

  describe('basic functionality', () => {
    it('should return empty array for empty completions', () => {
      const completedDates = new Set<string>();
      const result = detectStreakSegments(completedDates, undefined, referenceDate);
      expect(result).toEqual([]);
    });

    it('should create single segment for one completed day', () => {
      const completedDates = new Set(['2025-12-25']);
      const result = detectStreakSegments(completedDates, undefined, referenceDate);

      expect(result).toHaveLength(1);
      expect(result[0].length).toBe(1);
      expect(result[0].dates).toEqual(['2025-12-25']);
      expect(result[0].startDate).toBe('2025-12-25');
      expect(result[0].endDate).toBe('2025-12-25');
    });

    it('should create single segment for consecutive days', () => {
      const completedDates = new Set([
        '2025-12-20',
        '2025-12-21',
        '2025-12-22',
        '2025-12-23',
      ]);
      const result = detectStreakSegments(completedDates, undefined, referenceDate);

      expect(result).toHaveLength(1);
      expect(result[0].length).toBe(4);
      expect(result[0].dates).toEqual([
        '2025-12-20',
        '2025-12-21',
        '2025-12-22',
        '2025-12-23',
      ]);
    });

    it('should create multiple segments for gaps in dates', () => {
      const completedDates = new Set([
        '2025-12-10',
        '2025-12-11',
        // Gap
        '2025-12-15',
        '2025-12-16',
        '2025-12-17',
      ]);
      const result = detectStreakSegments(completedDates, undefined, referenceDate);

      expect(result).toHaveLength(2);
      expect(result[0].dates).toEqual(['2025-12-10', '2025-12-11']);
      expect(result[1].dates).toEqual(['2025-12-15', '2025-12-16', '2025-12-17']);
    });
  });

  describe('active streak detection', () => {
    it('should mark streak as active if it ends today', () => {
      const completedDates = new Set([
        '2025-12-26',
        '2025-12-27',
        '2025-12-28', // Today
      ]);
      const result = detectStreakSegments(completedDates, undefined, referenceDate);

      expect(result).toHaveLength(1);
      expect(result[0].isActive).toBe(true);
    });

    it('should mark streak as active if it ends yesterday', () => {
      const completedDates = new Set([
        '2025-12-25',
        '2025-12-26',
        '2025-12-27', // Yesterday
      ]);
      const result = detectStreakSegments(completedDates, undefined, referenceDate);

      expect(result).toHaveLength(1);
      expect(result[0].isActive).toBe(true);
    });

    it('should mark streak as inactive if it ends before yesterday', () => {
      const completedDates = new Set([
        '2025-12-20',
        '2025-12-21',
        '2025-12-22',
      ]);
      const result = detectStreakSegments(completedDates, undefined, referenceDate);

      expect(result).toHaveLength(1);
      expect(result[0].isActive).toBe(false);
    });

    it('should only mark the last segment as active when multiple segments exist', () => {
      const completedDates = new Set([
        '2025-12-10',
        '2025-12-11',
        // Gap
        '2025-12-26',
        '2025-12-27',
        '2025-12-28', // Today
      ]);
      const result = detectStreakSegments(completedDates, undefined, referenceDate);

      expect(result).toHaveLength(2);
      expect(result[0].isActive).toBe(false);
      expect(result[1].isActive).toBe(true);
    });
  });

  describe('habit creation boundary', () => {
    it('should skip dates before habit creation', () => {
      const completedDates = new Set([
        '2025-12-01', // Before creation
        '2025-12-10', // After creation
        '2025-12-11',
      ]);
      const habitCreatedAt = new Date('2025-12-05').getTime();
      const result = detectStreakSegments(completedDates, habitCreatedAt, referenceDate);

      expect(result).toHaveLength(1);
      expect(result[0].dates).toEqual(['2025-12-10', '2025-12-11']);
    });

    it('should include habit creation date', () => {
      const completedDates = new Set([
        '2025-12-05', // Creation date
        '2025-12-06',
      ]);
      const habitCreatedAt = new Date('2025-12-05').getTime();
      const result = detectStreakSegments(completedDates, habitCreatedAt, referenceDate);

      expect(result).toHaveLength(1);
      expect(result[0].dates).toEqual(['2025-12-05', '2025-12-06']);
    });
  });

  describe('future date handling', () => {
    it('should skip future dates', () => {
      const completedDates = new Set([
        '2025-12-27',
        '2025-12-28', // Reference date (today)
        '2025-12-29', // Future
        '2025-12-30', // Future
      ]);
      const result = detectStreakSegments(completedDates, undefined, referenceDate);

      expect(result).toHaveLength(1);
      expect(result[0].dates).toEqual(['2025-12-27', '2025-12-28']);
    });
  });

  describe('unique IDs', () => {
    it('should generate unique IDs for each segment', () => {
      const completedDates = new Set([
        '2025-12-05',
        '2025-12-10',
        '2025-12-11',
        '2025-12-20',
      ]);
      const result = detectStreakSegments(completedDates, undefined, referenceDate);

      const ids = result.map((s) => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('edge cases', () => {
    it('should handle unordered input dates', () => {
      const completedDates = new Set([
        '2025-12-23',
        '2025-12-20',
        '2025-12-22',
        '2025-12-21',
      ]);
      const result = detectStreakSegments(completedDates, undefined, referenceDate);

      expect(result).toHaveLength(1);
      expect(result[0].dates).toEqual([
        '2025-12-20',
        '2025-12-21',
        '2025-12-22',
        '2025-12-23',
      ]);
    });

    it('should handle single day gaps correctly', () => {
      const completedDates = new Set([
        '2025-12-10',
        // Gap on 11th
        '2025-12-12',
        // Gap on 13th
        '2025-12-14',
      ]);
      const result = detectStreakSegments(completedDates, undefined, referenceDate);

      expect(result).toHaveLength(3);
      expect(result[0].length).toBe(1);
      expect(result[1].length).toBe(1);
      expect(result[2].length).toBe(1);
    });

    it('should handle long streaks spanning months', () => {
      const dates: string[] = [];
      for (let i = 1; i <= 31; i++) {
        dates.push(`2025-10-${String(i).padStart(2, '0')}`);
      }
      for (let i = 1; i <= 30; i++) {
        dates.push(`2025-11-${String(i).padStart(2, '0')}`);
      }

      const completedDates = new Set(dates);
      const result = detectStreakSegments(completedDates, undefined, referenceDate);

      expect(result).toHaveLength(1);
      expect(result[0].length).toBe(61); // 31 + 30
    });
  });
});

describe('getStrengthTier', () => {
  it('should return subtle for 1-2 days', () => {
    expect(getStrengthTier(1)).toBe('subtle');
    expect(getStrengthTier(2)).toBe('subtle');
  });

  it('should return growing for 3-4 days', () => {
    expect(getStrengthTier(3)).toBe('growing');
    expect(getStrengthTier(4)).toBe('growing');
  });

  it('should return strong for 5-6 days', () => {
    expect(getStrengthTier(5)).toBe('strong');
    expect(getStrengthTier(6)).toBe('strong');
  });

  it('should return very-strong for 7-13 days', () => {
    expect(getStrengthTier(7)).toBe('very-strong');
    expect(getStrengthTier(10)).toBe('very-strong');
    expect(getStrengthTier(13)).toBe('very-strong');
  });

  it('should return legendary for 14-20 days', () => {
    expect(getStrengthTier(14)).toBe('legendary');
    expect(getStrengthTier(17)).toBe('legendary');
    expect(getStrengthTier(20)).toBe('legendary');
  });

  it('should return legendary-plus for 21+ days', () => {
    expect(getStrengthTier(21)).toBe('legendary-plus');
    expect(getStrengthTier(30)).toBe('legendary-plus');
    expect(getStrengthTier(100)).toBe('legendary-plus');
  });
});
