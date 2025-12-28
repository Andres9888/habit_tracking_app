/**
 * Week Start Customization Tests
 * Progress Section Specification - Phase 8.3: Week Start Customization
 */

import {
  WeekStartDay,
  WeekStartDayName,
  WEEK_START_DAY_MAP,
  WEEK_START_DAY_NAMES,
  DEFAULT_WEEK_START,
  getRotatedDayLabels,
  getRotatedDayNamesFull,
} from '../types';

describe('Week Start Types and Utilities', () => {
  describe('WEEK_START_DAY_MAP', () => {
    it('should map sunday to 0', () => {
      expect(WEEK_START_DAY_MAP.sunday).toBe(0);
    });

    it('should map monday to 1', () => {
      expect(WEEK_START_DAY_MAP.monday).toBe(1);
    });

    it('should map tuesday to 2', () => {
      expect(WEEK_START_DAY_MAP.tuesday).toBe(2);
    });

    it('should map wednesday to 3', () => {
      expect(WEEK_START_DAY_MAP.wednesday).toBe(3);
    });

    it('should map thursday to 4', () => {
      expect(WEEK_START_DAY_MAP.thursday).toBe(4);
    });

    it('should map friday to 5', () => {
      expect(WEEK_START_DAY_MAP.friday).toBe(5);
    });

    it('should map saturday to 6', () => {
      expect(WEEK_START_DAY_MAP.saturday).toBe(6);
    });

    it('should have exactly 7 entries', () => {
      expect(Object.keys(WEEK_START_DAY_MAP)).toHaveLength(7);
    });
  });

  describe('WEEK_START_DAY_NAMES', () => {
    it('should map 0 to sunday', () => {
      expect(WEEK_START_DAY_NAMES[0]).toBe('sunday');
    });

    it('should map 1 to monday', () => {
      expect(WEEK_START_DAY_NAMES[1]).toBe('monday');
    });

    it('should map 2 to tuesday', () => {
      expect(WEEK_START_DAY_NAMES[2]).toBe('tuesday');
    });

    it('should map 3 to wednesday', () => {
      expect(WEEK_START_DAY_NAMES[3]).toBe('wednesday');
    });

    it('should map 4 to thursday', () => {
      expect(WEEK_START_DAY_NAMES[4]).toBe('thursday');
    });

    it('should map 5 to friday', () => {
      expect(WEEK_START_DAY_NAMES[5]).toBe('friday');
    });

    it('should map 6 to saturday', () => {
      expect(WEEK_START_DAY_NAMES[6]).toBe('saturday');
    });

    it('should have exactly 7 entries', () => {
      expect(Object.keys(WEEK_START_DAY_NAMES)).toHaveLength(7);
    });

    it('should be inverse of WEEK_START_DAY_MAP', () => {
      // For each named day, the reverse mapping should give the same name back
      for (const name of Object.keys(WEEK_START_DAY_MAP) as WeekStartDayName[]) {
        const dayNumber = WEEK_START_DAY_MAP[name];
        expect(WEEK_START_DAY_NAMES[dayNumber]).toBe(name);
      }
    });
  });

  describe('DEFAULT_WEEK_START', () => {
    it('should be 0 (Sunday)', () => {
      expect(DEFAULT_WEEK_START).toBe(0);
    });

    it('should be a valid WeekStartDay', () => {
      const validDays: WeekStartDay[] = [0, 1, 2, 3, 4, 5, 6];
      expect(validDays).toContain(DEFAULT_WEEK_START);
    });
  });

  describe('getRotatedDayLabels', () => {
    it('should return Sunday-first order for weekStartDay=0', () => {
      const result = getRotatedDayLabels(0);
      expect(result).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S']);
    });

    it('should return Monday-first order for weekStartDay=1', () => {
      const result = getRotatedDayLabels(1);
      expect(result).toEqual(['M', 'T', 'W', 'T', 'F', 'S', 'S']);
    });

    it('should return Tuesday-first order for weekStartDay=2', () => {
      const result = getRotatedDayLabels(2);
      expect(result).toEqual(['T', 'W', 'T', 'F', 'S', 'S', 'M']);
    });

    it('should return Wednesday-first order for weekStartDay=3', () => {
      const result = getRotatedDayLabels(3);
      expect(result).toEqual(['W', 'T', 'F', 'S', 'S', 'M', 'T']);
    });

    it('should return Thursday-first order for weekStartDay=4', () => {
      const result = getRotatedDayLabels(4);
      expect(result).toEqual(['T', 'F', 'S', 'S', 'M', 'T', 'W']);
    });

    it('should return Friday-first order for weekStartDay=5', () => {
      const result = getRotatedDayLabels(5);
      expect(result).toEqual(['F', 'S', 'S', 'M', 'T', 'W', 'T']);
    });

    it('should return Saturday-first order for weekStartDay=6', () => {
      const result = getRotatedDayLabels(6);
      expect(result).toEqual(['S', 'S', 'M', 'T', 'W', 'T', 'F']);
    });

    it('should always return exactly 7 labels', () => {
      for (let i = 0; i <= 6; i++) {
        const result = getRotatedDayLabels(i as WeekStartDay);
        expect(result).toHaveLength(7);
      }
    });

    it('should not modify the original base array (immutability)', () => {
      // Call multiple times with different values
      getRotatedDayLabels(0);
      getRotatedDayLabels(1);
      getRotatedDayLabels(3);

      // Default (Sunday) should still work correctly
      const result = getRotatedDayLabels(0);
      expect(result).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S']);
    });

    it('should preserve the cyclic property (same labels, different order)', () => {
      const baseLabels = getRotatedDayLabels(0).sort();

      for (let i = 1; i <= 6; i++) {
        const rotatedLabels = getRotatedDayLabels(i as WeekStartDay).sort();
        expect(rotatedLabels).toEqual(baseLabels);
      }
    });
  });

  describe('getRotatedDayNamesFull', () => {
    it('should return Sunday-first order for weekStartDay=0', () => {
      const result = getRotatedDayNamesFull(0);
      expect(result).toEqual([
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ]);
    });

    it('should return Monday-first order for weekStartDay=1', () => {
      const result = getRotatedDayNamesFull(1);
      expect(result).toEqual([
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ]);
    });

    it('should return Tuesday-first order for weekStartDay=2', () => {
      const result = getRotatedDayNamesFull(2);
      expect(result).toEqual([
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
        'Monday',
      ]);
    });

    it('should return Wednesday-first order for weekStartDay=3', () => {
      const result = getRotatedDayNamesFull(3);
      expect(result).toEqual([
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
        'Monday',
        'Tuesday',
      ]);
    });

    it('should return Thursday-first order for weekStartDay=4', () => {
      const result = getRotatedDayNamesFull(4);
      expect(result).toEqual([
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
      ]);
    });

    it('should return Friday-first order for weekStartDay=5', () => {
      const result = getRotatedDayNamesFull(5);
      expect(result).toEqual([
        'Friday',
        'Saturday',
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
      ]);
    });

    it('should return Saturday-first order for weekStartDay=6', () => {
      const result = getRotatedDayNamesFull(6);
      expect(result).toEqual([
        'Saturday',
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
      ]);
    });

    it('should always return exactly 7 names', () => {
      for (let i = 0; i <= 6; i++) {
        const result = getRotatedDayNamesFull(i as WeekStartDay);
        expect(result).toHaveLength(7);
      }
    });

    it('should not modify the original base array (immutability)', () => {
      // Call multiple times with different values
      getRotatedDayNamesFull(0);
      getRotatedDayNamesFull(1);
      getRotatedDayNamesFull(3);

      // Default (Sunday) should still work correctly
      const result = getRotatedDayNamesFull(0);
      expect(result[0]).toBe('Sunday');
      expect(result[6]).toBe('Saturday');
    });

    it('should preserve the cyclic property (same names, different order)', () => {
      const baseNames = getRotatedDayNamesFull(0).sort();

      for (let i = 1; i <= 6; i++) {
        const rotatedNames = getRotatedDayNamesFull(i as WeekStartDay).sort();
        expect(rotatedNames).toEqual(baseNames);
      }
    });

    it('should have first element match the weekStartDay name', () => {
      const dayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];

      for (let i = 0; i <= 6; i++) {
        const result = getRotatedDayNamesFull(i as WeekStartDay);
        expect(result[0]).toBe(dayNames[i]);
      }
    });
  });

  describe('consistency between getRotatedDayLabels and getRotatedDayNamesFull', () => {
    it('should have matching first letters for same weekStartDay', () => {
      for (let i = 0; i <= 6; i++) {
        const labels = getRotatedDayLabels(i as WeekStartDay);
        const names = getRotatedDayNamesFull(i as WeekStartDay);

        for (let j = 0; j < 7; j++) {
          expect(names[j][0]).toBe(labels[j]);
        }
      }
    });
  });

  describe('type safety', () => {
    it('WeekStartDay should accept valid values 0-6', () => {
      const validDays: WeekStartDay[] = [0, 1, 2, 3, 4, 5, 6];
      expect(validDays).toHaveLength(7);
    });

    it('WeekStartDayName should accept valid day names', () => {
      const validNames: WeekStartDayName[] = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ];
      expect(validNames).toHaveLength(7);
    });

    it('WEEK_START_DAY_MAP keys should match WeekStartDayName type', () => {
      const keys = Object.keys(WEEK_START_DAY_MAP);
      expect(keys).toEqual([
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ]);
    });
  });
});
