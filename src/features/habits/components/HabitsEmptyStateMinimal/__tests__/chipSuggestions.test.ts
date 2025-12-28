/**
 * chipSuggestions - Unit Tests
 *
 * Tests for time-based chip suggestion functionality:
 * - getTimeOfDay() returns correct period for all hours
 * - Edge cases at period boundaries
 * - Night period wrapping around midnight
 * - getChipSuggestionsForTime() returns correct suggestions
 * - Helper functions work correctly
 */

import {
  CHIP_SUGGESTIONS_BY_TIME,
  TIME_PERIOD_LABELS,
  TIME_PERIOD_GREETINGS,
  TIME_PERIOD_TINTS,
  getTimeOfDay,
  getChipSuggestionsForTime,
  getChipSuggestionsLabel,
  getTimePeriodTint,
} from '../chipSuggestions';

describe('chipSuggestions', () => {
  describe('getTimeOfDay', () => {
    describe('morning period (6:00 - 11:59)', () => {
      it('should return "morning" at 6:00', () => {
        const date = new Date('2024-01-15T06:00:00');
        expect(getTimeOfDay(date)).toBe('morning');
      });

      it('should return "morning" at 6:01', () => {
        const date = new Date('2024-01-15T06:01:00');
        expect(getTimeOfDay(date)).toBe('morning');
      });

      it('should return "morning" at 9:00 (mid-morning)', () => {
        const date = new Date('2024-01-15T09:00:00');
        expect(getTimeOfDay(date)).toBe('morning');
      });

      it('should return "morning" at 11:59', () => {
        const date = new Date('2024-01-15T11:59:00');
        expect(getTimeOfDay(date)).toBe('morning');
      });
    });

    describe('afternoon period (12:00 - 16:59)', () => {
      it('should return "afternoon" at 12:00', () => {
        const date = new Date('2024-01-15T12:00:00');
        expect(getTimeOfDay(date)).toBe('afternoon');
      });

      it('should return "afternoon" at 12:01', () => {
        const date = new Date('2024-01-15T12:01:00');
        expect(getTimeOfDay(date)).toBe('afternoon');
      });

      it('should return "afternoon" at 14:30 (mid-afternoon)', () => {
        const date = new Date('2024-01-15T14:30:00');
        expect(getTimeOfDay(date)).toBe('afternoon');
      });

      it('should return "afternoon" at 16:59', () => {
        const date = new Date('2024-01-15T16:59:00');
        expect(getTimeOfDay(date)).toBe('afternoon');
      });
    });

    describe('evening period (17:00 - 20:59)', () => {
      it('should return "evening" at 17:00', () => {
        const date = new Date('2024-01-15T17:00:00');
        expect(getTimeOfDay(date)).toBe('evening');
      });

      it('should return "evening" at 17:01', () => {
        const date = new Date('2024-01-15T17:01:00');
        expect(getTimeOfDay(date)).toBe('evening');
      });

      it('should return "evening" at 19:00 (mid-evening)', () => {
        const date = new Date('2024-01-15T19:00:00');
        expect(getTimeOfDay(date)).toBe('evening');
      });

      it('should return "evening" at 20:59', () => {
        const date = new Date('2024-01-15T20:59:00');
        expect(getTimeOfDay(date)).toBe('evening');
      });
    });

    describe('night period (21:00 - 5:59)', () => {
      it('should return "night" at 21:00', () => {
        const date = new Date('2024-01-15T21:00:00');
        expect(getTimeOfDay(date)).toBe('night');
      });

      it('should return "night" at 21:01', () => {
        const date = new Date('2024-01-15T21:01:00');
        expect(getTimeOfDay(date)).toBe('night');
      });

      it('should return "night" at 23:59', () => {
        const date = new Date('2024-01-15T23:59:00');
        expect(getTimeOfDay(date)).toBe('night');
      });

      it('should return "night" at midnight (00:00)', () => {
        const date = new Date('2024-01-15T00:00:00');
        expect(getTimeOfDay(date)).toBe('night');
      });

      it('should return "night" at 3:00 (late night)', () => {
        const date = new Date('2024-01-15T03:00:00');
        expect(getTimeOfDay(date)).toBe('night');
      });

      it('should return "night" at 5:59', () => {
        const date = new Date('2024-01-15T05:59:00');
        expect(getTimeOfDay(date)).toBe('night');
      });
    });

    describe('edge case transitions', () => {
      it('should transition from night to morning at 6:00', () => {
        const night = new Date('2024-01-15T05:59:00');
        const morning = new Date('2024-01-15T06:00:00');
        expect(getTimeOfDay(night)).toBe('night');
        expect(getTimeOfDay(morning)).toBe('morning');
      });

      it('should transition from morning to afternoon at 12:00', () => {
        const morning = new Date('2024-01-15T11:59:00');
        const afternoon = new Date('2024-01-15T12:00:00');
        expect(getTimeOfDay(morning)).toBe('morning');
        expect(getTimeOfDay(afternoon)).toBe('afternoon');
      });

      it('should transition from afternoon to evening at 17:00', () => {
        const afternoon = new Date('2024-01-15T16:59:00');
        const evening = new Date('2024-01-15T17:00:00');
        expect(getTimeOfDay(afternoon)).toBe('afternoon');
        expect(getTimeOfDay(evening)).toBe('evening');
      });

      it('should transition from evening to night at 21:00', () => {
        const evening = new Date('2024-01-15T20:59:00');
        const night = new Date('2024-01-15T21:00:00');
        expect(getTimeOfDay(evening)).toBe('evening');
        expect(getTimeOfDay(night)).toBe('night');
      });
    });

    describe('default behavior', () => {
      it('should use current time when no date provided', () => {
        const result = getTimeOfDay();
        expect(['morning', 'afternoon', 'evening', 'night']).toContain(result);
      });
    });
  });

  describe('CHIP_SUGGESTIONS_BY_TIME', () => {
    it('should have suggestions for all 4 time periods', () => {
      expect(CHIP_SUGGESTIONS_BY_TIME.morning).toBeDefined();
      expect(CHIP_SUGGESTIONS_BY_TIME.afternoon).toBeDefined();
      expect(CHIP_SUGGESTIONS_BY_TIME.evening).toBeDefined();
      expect(CHIP_SUGGESTIONS_BY_TIME.night).toBeDefined();
    });

    it('should have exactly 5 suggestions per period', () => {
      expect(CHIP_SUGGESTIONS_BY_TIME.morning).toHaveLength(5);
      expect(CHIP_SUGGESTIONS_BY_TIME.afternoon).toHaveLength(5);
      expect(CHIP_SUGGESTIONS_BY_TIME.evening).toHaveLength(5);
      expect(CHIP_SUGGESTIONS_BY_TIME.night).toHaveLength(5);
    });

    it('should have valid chip structure for all suggestions', () => {
      const allSuggestions = [
        ...CHIP_SUGGESTIONS_BY_TIME.morning,
        ...CHIP_SUGGESTIONS_BY_TIME.afternoon,
        ...CHIP_SUGGESTIONS_BY_TIME.evening,
        ...CHIP_SUGGESTIONS_BY_TIME.night,
      ];

      allSuggestions.forEach((chip) => {
        expect(chip.emoji).toBeDefined();
        expect(typeof chip.emoji).toBe('string');
        expect(chip.label).toBeDefined();
        expect(typeof chip.label).toBe('string');
        expect(chip.fullName).toBeDefined();
        expect(typeof chip.fullName).toBe('string');
      });
    });
  });

  describe('getChipSuggestionsForTime', () => {
    it('should return morning suggestions for morning period', () => {
      const result = getChipSuggestionsForTime('morning');
      expect(result).toEqual(CHIP_SUGGESTIONS_BY_TIME.morning);
    });

    it('should return afternoon suggestions for afternoon period', () => {
      const result = getChipSuggestionsForTime('afternoon');
      expect(result).toEqual(CHIP_SUGGESTIONS_BY_TIME.afternoon);
    });

    it('should return evening suggestions for evening period', () => {
      const result = getChipSuggestionsForTime('evening');
      expect(result).toEqual(CHIP_SUGGESTIONS_BY_TIME.evening);
    });

    it('should return night suggestions for night period', () => {
      const result = getChipSuggestionsForTime('night');
      expect(result).toEqual(CHIP_SUGGESTIONS_BY_TIME.night);
    });

    it('should auto-detect time period when no argument provided', () => {
      const result = getChipSuggestionsForTime();
      expect(result).toHaveLength(5);
      // The result should match one of the four periods
      const matchesSomePeriod = Object.values(CHIP_SUGGESTIONS_BY_TIME).some(
        (suggestions) => JSON.stringify(suggestions) === JSON.stringify(result)
      );
      expect(matchesSomePeriod).toBe(true);
    });
  });

  describe('getChipSuggestionsLabel', () => {
    it('should return correct label for morning', () => {
      expect(getChipSuggestionsLabel('morning')).toBe('Suggested for morning');
    });

    it('should return correct label for afternoon', () => {
      expect(getChipSuggestionsLabel('afternoon')).toBe(
        'Suggested for afternoon'
      );
    });

    it('should return correct label for evening', () => {
      expect(getChipSuggestionsLabel('evening')).toBe('Suggested for evening');
    });

    it('should return correct label for night', () => {
      expect(getChipSuggestionsLabel('night')).toBe('Suggested for night');
    });

    it('should auto-detect time period when no argument provided', () => {
      const result = getChipSuggestionsLabel();
      expect(result).toMatch(
        /^Suggested for (morning|afternoon|evening|night)$/
      );
    });
  });

  describe('getTimePeriodTint', () => {
    it('should return amber-300 (#FCD34D) for morning', () => {
      expect(getTimePeriodTint('morning')).toBe('#FCD34D');
    });

    it('should return emerald-500 (#10B981) for afternoon', () => {
      expect(getTimePeriodTint('afternoon')).toBe('#10B981');
    });

    it('should return violet-500 (#8B5CF6) for evening', () => {
      expect(getTimePeriodTint('evening')).toBe('#8B5CF6');
    });

    it('should return indigo-500 (#6366F1) for night', () => {
      expect(getTimePeriodTint('night')).toBe('#6366F1');
    });

    it('should auto-detect time period when no argument provided', () => {
      const result = getTimePeriodTint();
      expect(['#FCD34D', '#10B981', '#8B5CF6', '#6366F1']).toContain(result);
    });
  });

  describe('TIME_PERIOD_LABELS', () => {
    it('should have correct labels for all periods', () => {
      expect(TIME_PERIOD_LABELS.morning).toBe('Suggested for morning');
      expect(TIME_PERIOD_LABELS.afternoon).toBe('Suggested for afternoon');
      expect(TIME_PERIOD_LABELS.evening).toBe('Suggested for evening');
      expect(TIME_PERIOD_LABELS.night).toBe('Suggested for night');
    });
  });

  describe('TIME_PERIOD_GREETINGS', () => {
    it('should have correct greetings for all periods', () => {
      expect(TIME_PERIOD_GREETINGS.morning).toBe('Good morning');
      expect(TIME_PERIOD_GREETINGS.afternoon).toBe('Good afternoon');
      expect(TIME_PERIOD_GREETINGS.evening).toBe('Good evening');
      expect(TIME_PERIOD_GREETINGS.night).toBe('Good night');
    });
  });

  describe('TIME_PERIOD_TINTS', () => {
    it('should have valid hex colors for all periods', () => {
      const hexColorRegex = /^#[A-Fa-f0-9]{6}$/;
      expect(TIME_PERIOD_TINTS.morning).toMatch(hexColorRegex);
      expect(TIME_PERIOD_TINTS.afternoon).toMatch(hexColorRegex);
      expect(TIME_PERIOD_TINTS.evening).toMatch(hexColorRegex);
      expect(TIME_PERIOD_TINTS.night).toMatch(hexColorRegex);
    });
  });
});
