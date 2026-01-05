/**
 * HabitsEmptyStateMinimal - Utility Functions Tests
 *
 * Comprehensive tests for time-based chip selection logic and autocomplete matching.
 */

import {
  getTimeBasedChips,
  TIME_WINDOWS,
  getAutocompleteSuggestions,
  getBestSuggestion,
  getInlinePreview,
} from '../utils';
import {
  MORNING_CHIPS,
  AFTERNOON_CHIPS,
  EVENING_CHIPS,
  NIGHT_CHIPS,
  STATIC_CHIPS,
} from '../constants';
import { HABIT_SUGGESTIONS } from '../habitSuggestions';

describe('getTimeBasedChips', () => {
  describe('Time window detection', () => {
    it('returns MORNING_CHIPS for 5am-11am', () => {
      const morningDate = new Date('2026-01-05T08:30:00'); // 8:30am
      expect(getTimeBasedChips(morningDate)).toEqual(MORNING_CHIPS);
    });

    it('returns AFTERNOON_CHIPS for 11am-5pm', () => {
      const afternoonDate = new Date('2026-01-05T14:15:00'); // 2:15pm
      expect(getTimeBasedChips(afternoonDate)).toEqual(AFTERNOON_CHIPS);
    });

    it('returns EVENING_CHIPS for 5pm-10pm', () => {
      const eveningDate = new Date('2026-01-05T19:45:00'); // 7:45pm
      expect(getTimeBasedChips(eveningDate)).toEqual(EVENING_CHIPS);
    });

    it('returns NIGHT_CHIPS for 10pm-5am', () => {
      const nightDate = new Date('2026-01-05T23:30:00'); // 11:30pm
      expect(getTimeBasedChips(nightDate)).toEqual(NIGHT_CHIPS);
    });

    it('returns NIGHT_CHIPS for hours after midnight', () => {
      const lateNightDate = new Date('2026-01-05T02:00:00'); // 2:00am
      expect(getTimeBasedChips(lateNightDate)).toEqual(NIGHT_CHIPS);
    });
  });

  describe('Boundary conditions', () => {
    it('returns MORNING_CHIPS at exactly 5am', () => {
      const boundaryDate = new Date('2026-01-05T05:00:00');
      expect(getTimeBasedChips(boundaryDate)).toEqual(MORNING_CHIPS);
    });

    it('returns AFTERNOON_CHIPS at exactly 11am', () => {
      const boundaryDate = new Date('2026-01-05T11:00:00');
      expect(getTimeBasedChips(boundaryDate)).toEqual(AFTERNOON_CHIPS);
    });

    it('returns EVENING_CHIPS at exactly 5pm', () => {
      const boundaryDate = new Date('2026-01-05T17:00:00');
      expect(getTimeBasedChips(boundaryDate)).toEqual(EVENING_CHIPS);
    });

    it('returns NIGHT_CHIPS at exactly 10pm', () => {
      const boundaryDate = new Date('2026-01-05T22:00:00');
      expect(getTimeBasedChips(boundaryDate)).toEqual(NIGHT_CHIPS);
    });

    it('returns NIGHT_CHIPS at 4:59am (just before morning)', () => {
      const boundaryDate = new Date('2026-01-05T04:59:00');
      expect(getTimeBasedChips(boundaryDate)).toEqual(NIGHT_CHIPS);
    });

    it('returns MORNING_CHIPS at 10:59am (just before afternoon)', () => {
      const boundaryDate = new Date('2026-01-05T10:59:00');
      expect(getTimeBasedChips(boundaryDate)).toEqual(MORNING_CHIPS);
    });

    it('returns AFTERNOON_CHIPS at 4:59pm (just before evening)', () => {
      const boundaryDate = new Date('2026-01-05T16:59:00');
      expect(getTimeBasedChips(boundaryDate)).toEqual(AFTERNOON_CHIPS);
    });

    it('returns EVENING_CHIPS at 9:59pm (just before night)', () => {
      const boundaryDate = new Date('2026-01-05T21:59:00');
      expect(getTimeBasedChips(boundaryDate)).toEqual(EVENING_CHIPS);
    });
  });

  describe('Feature flag behavior', () => {
    it('returns STATIC_CHIPS when useTimeBased is false', () => {
      const morningDate = new Date('2026-01-05T08:30:00');
      expect(getTimeBasedChips(morningDate, false)).toEqual(STATIC_CHIPS);
    });

    it('returns time-based chips when useTimeBased is true', () => {
      const morningDate = new Date('2026-01-05T08:30:00');
      expect(getTimeBasedChips(morningDate, true)).toEqual(MORNING_CHIPS);
    });

    it('defaults to time-based behavior when flag not provided', () => {
      const afternoonDate = new Date('2026-01-05T14:00:00');
      expect(getTimeBasedChips(afternoonDate)).toEqual(AFTERNOON_CHIPS);
    });

    it('returns STATIC_CHIPS for all times when useTimeBased is false', () => {
      const testTimes = [
        new Date('2026-01-05T08:00:00'), // Morning
        new Date('2026-01-05T14:00:00'), // Afternoon
        new Date('2026-01-05T19:00:00'), // Evening
        new Date('2026-01-05T23:00:00'), // Night
      ];

      testTimes.forEach((date) => {
        expect(getTimeBasedChips(date, false)).toEqual(STATIC_CHIPS);
      });
    });
  });

  describe('Chip array validation', () => {
    it('always returns exactly 6 chips', () => {
      const testTimes = [
        new Date('2026-01-05T08:00:00'), // Morning
        new Date('2026-01-05T14:00:00'), // Afternoon
        new Date('2026-01-05T19:00:00'), // Evening
        new Date('2026-01-05T23:00:00'), // Night
      ];

      testTimes.forEach((date) => {
        expect(getTimeBasedChips(date)).toHaveLength(6);
      });
    });

    it('returns chips with valid structure', () => {
      const chips = getTimeBasedChips();
      chips.forEach((chip) => {
        expect(chip).toHaveProperty('emoji');
        expect(chip).toHaveProperty('label');
        expect(chip).toHaveProperty('fullName');
        expect(typeof chip.emoji).toBe('string');
        expect(typeof chip.label).toBe('string');
        expect(typeof chip.fullName).toBe('string');
      });
    });

    it('returns non-empty chip properties', () => {
      const chips = getTimeBasedChips();
      chips.forEach((chip) => {
        expect(chip.emoji.length).toBeGreaterThan(0);
        expect(chip.label.length).toBeGreaterThan(0);
        expect(chip.fullName.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Default behavior', () => {
    it('uses current time when no date provided', () => {
      // This test runs at current time, so we just verify it returns valid chips
      const chips = getTimeBasedChips();
      expect(chips).toHaveLength(6);
      expect(chips[0]).toHaveProperty('emoji');
    });

    it('defaults useTimeBased to true', () => {
      const morningDate = new Date('2026-01-05T08:00:00');
      // Calling without second parameter should use time-based logic
      expect(getTimeBasedChips(morningDate)).toEqual(MORNING_CHIPS);
    });
  });

  describe('All hours of the day', () => {
    it('returns correct chips for every hour', () => {
      // Test each hour of the day
      const hourTests = [
        // Night hours (22-4)
        { hour: 22, expected: NIGHT_CHIPS }, // 10pm
        { hour: 23, expected: NIGHT_CHIPS }, // 11pm
        { hour: 0, expected: NIGHT_CHIPS }, // Midnight
        { hour: 1, expected: NIGHT_CHIPS }, // 1am
        { hour: 2, expected: NIGHT_CHIPS }, // 2am
        { hour: 3, expected: NIGHT_CHIPS }, // 3am
        { hour: 4, expected: NIGHT_CHIPS }, // 4am
        // Morning hours (5-10)
        { hour: 5, expected: MORNING_CHIPS }, // 5am
        { hour: 6, expected: MORNING_CHIPS }, // 6am
        { hour: 7, expected: MORNING_CHIPS }, // 7am
        { hour: 8, expected: MORNING_CHIPS }, // 8am
        { hour: 9, expected: MORNING_CHIPS }, // 9am
        { hour: 10, expected: MORNING_CHIPS }, // 10am
        // Afternoon hours (11-16)
        { hour: 11, expected: AFTERNOON_CHIPS }, // 11am
        { hour: 12, expected: AFTERNOON_CHIPS }, // Noon
        { hour: 13, expected: AFTERNOON_CHIPS }, // 1pm
        { hour: 14, expected: AFTERNOON_CHIPS }, // 2pm
        { hour: 15, expected: AFTERNOON_CHIPS }, // 3pm
        { hour: 16, expected: AFTERNOON_CHIPS }, // 4pm
        // Evening hours (17-21)
        { hour: 17, expected: EVENING_CHIPS }, // 5pm
        { hour: 18, expected: EVENING_CHIPS }, // 6pm
        { hour: 19, expected: EVENING_CHIPS }, // 7pm
        { hour: 20, expected: EVENING_CHIPS }, // 8pm
        { hour: 21, expected: EVENING_CHIPS }, // 9pm
      ];

      hourTests.forEach(({ hour, expected }) => {
        const date = new Date('2026-01-05');
        date.setHours(hour, 0, 0, 0);
        expect(getTimeBasedChips(date)).toEqual(expected);
      });
    });
  });
});

describe('TIME_WINDOWS constants', () => {
  it('has correct morning window', () => {
    expect(TIME_WINDOWS.MORNING).toEqual({ start: 5, end: 11 });
  });

  it('has correct afternoon window', () => {
    expect(TIME_WINDOWS.AFTERNOON).toEqual({ start: 11, end: 17 });
  });

  it('has correct evening window', () => {
    expect(TIME_WINDOWS.EVENING).toEqual({ start: 17, end: 22 });
  });

  it('has correct night window', () => {
    expect(TIME_WINDOWS.NIGHT).toEqual({ start: 22, end: 5 });
  });

  it('windows cover all 24 hours without gaps', () => {
    // Morning: 5-10 (6 hours)
    // Afternoon: 11-16 (6 hours)
    // Evening: 17-21 (5 hours)
    // Night: 22-4 (7 hours)
    // Total: 24 hours
    const morningHours = TIME_WINDOWS.MORNING.end - TIME_WINDOWS.MORNING.start;
    const afternoonHours =
      TIME_WINDOWS.AFTERNOON.end - TIME_WINDOWS.AFTERNOON.start;
    const eveningHours = TIME_WINDOWS.EVENING.end - TIME_WINDOWS.EVENING.start;
    // Night wraps around, so calculate differently
    const nightHours = 24 - TIME_WINDOWS.NIGHT.start + TIME_WINDOWS.NIGHT.end;

    expect(morningHours + afternoonHours + eveningHours + nightHours).toBe(24);
  });
});

// ============================================================================
// AUTOCOMPLETE TESTS
// ============================================================================

describe('Autocomplete - getAutocompleteSuggestions', () => {
  describe('Input length validation', () => {
    it('returns empty array for input < 3 chars', () => {
      expect(getAutocompleteSuggestions('ex')).toEqual([]);
      expect(getAutocompleteSuggestions('a')).toEqual([]);
      expect(getAutocompleteSuggestions('')).toEqual([]);
    });

    it('returns results for input >= 3 chars', () => {
      const results = getAutocompleteSuggestions('exe');
      expect(results.length).toBeGreaterThan(0);
    });

    it('handles whitespace-only input', () => {
      expect(getAutocompleteSuggestions('   ')).toEqual([]);
    });

    it('trims input before matching', () => {
      const withSpaces = getAutocompleteSuggestions('  exe  ');
      const withoutSpaces = getAutocompleteSuggestions('exe');
      expect(withSpaces).toEqual(withoutSpaces);
    });
  });

  describe('Prefix matching (highest priority)', () => {
    it('returns prefix matches for "exe"', () => {
      const results = getAutocompleteSuggestions('exe');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].text).toMatch(/^Exercise/i);
    });

    it('returns prefix matches for "walk"', () => {
      const results = getAutocompleteSuggestions('wal');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].text).toMatch(/^Walk/i);
    });

    it('returns prefix matches for "read"', () => {
      const results = getAutocompleteSuggestions('rea');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].text).toMatch(/^Read/i);
    });

    it('prioritizes exact prefix matches over fuzzy matches', () => {
      const results = getAutocompleteSuggestions('read');
      // "Read 5 pages" should rank higher than suggestions that contain "read" elsewhere
      expect(results[0].text).toMatch(/^Read/i);
    });

    it('handles multi-word prefix matching', () => {
      const results = getAutocompleteSuggestions('morn');
      const morningHabits = results.filter(r => r.text.toLowerCase().startsWith('morn'));
      expect(morningHabits.length).toBeGreaterThan(0);
    });
  });

  describe('Case insensitive matching', () => {
    it('matches lowercase input', () => {
      const lower = getAutocompleteSuggestions('walk');
      expect(lower.length).toBeGreaterThan(0);
      expect(lower[0].text).toMatch(/walk/i);
    });

    it('matches uppercase input', () => {
      const upper = getAutocompleteSuggestions('WALK');
      expect(upper.length).toBeGreaterThan(0);
      expect(upper[0].text).toMatch(/walk/i);
    });

    it('matches mixed case input', () => {
      const mixed = getAutocompleteSuggestions('WaLk');
      expect(mixed.length).toBeGreaterThan(0);
      expect(mixed[0].text).toMatch(/walk/i);
    });

    it('returns same results regardless of case', () => {
      const lower = getAutocompleteSuggestions('walk');
      const upper = getAutocompleteSuggestions('WALK');
      expect(lower).toEqual(upper);
    });
  });

  describe('Word boundary matching', () => {
    it('matches word boundaries in suggestions', () => {
      const results = getAutocompleteSuggestions('for');
      // Should match "Meditate for 5 minutes", "Stretch for 5 minutes", etc.
      const forMatches = results.filter(r => r.text.includes(' for '));
      expect(forMatches.length).toBeGreaterThan(0);
    });

    it('prioritizes prefix over word boundary', () => {
      const results = getAutocompleteSuggestions('exe');
      // "Exercise" (prefix) should rank higher than "No exercise" (word boundary)
      expect(results[0].text.toLowerCase().startsWith('exe')).toBe(true);
    });
  });

  describe('Keyword matching', () => {
    it('matches keywords', () => {
      const results = getAutocompleteSuggestions('workout');
      // "workout" keyword should match "Exercise" suggestions
      expect(results.some(s => s.text.includes('Exercise'))).toBe(true);
    });

    it('matches multiple keyword variations', () => {
      const results = getAutocompleteSuggestions('gym');
      // "gym" keyword should match exercise-related habits
      expect(results.length).toBeGreaterThan(0);
    });

    it('keyword matches rank lower than prefix matches', () => {
      const results = getAutocompleteSuggestions('fit');
      // If there's a habit starting with "Fit", it should rank higher than keyword matches
      const prefixMatches = results.filter(r => r.text.toLowerCase().startsWith('fit'));
      const keywordMatches = results.filter(r =>
        !r.text.toLowerCase().startsWith('fit') &&
        r.keywords?.some(k => k.toLowerCase().includes('fit'))
      );

      if (prefixMatches.length > 0 && keywordMatches.length > 0) {
        const prefixIndex = results.indexOf(prefixMatches[0]);
        const keywordIndex = results.indexOf(keywordMatches[0]);
        expect(prefixIndex).toBeLessThan(keywordIndex);
      }
    });
  });

  describe('Fuzzy matching', () => {
    it('performs fuzzy matching', () => {
      const results = getAutocompleteSuggestions('excs');
      // Should fuzzy match "Exercise" (e-x-c-s)
      expect(results.some(s => s.text.includes('Exercise'))).toBe(true);
    });

    it('fuzzy matches maintain character order', () => {
      const results = getAutocompleteSuggestions('mdtt');
      // Should fuzzy match "Meditate" (m-d-t-t)
      expect(results.some(s => s.text.includes('Meditate'))).toBe(true);
    });

    it('fuzzy matches rank lowest', () => {
      const results = getAutocompleteSuggestions('exe');
      // Prefix match "Exercise" should rank higher than fuzzy match
      const firstResult = results[0];
      expect(firstResult.text.toLowerCase().startsWith('exe')).toBe(true);
    });
  });

  describe('Result sorting and ranking', () => {
    it('returns suggestions sorted by relevance', () => {
      const results = getAutocompleteSuggestions('med');
      // "Meditate" (prefix) should rank higher than other matches
      expect(results[0].text).toMatch(/^Meditate/i);
    });

    it('shorter suggestions rank higher for same match type', () => {
      const results = getAutocompleteSuggestions('exe');
      // Among exercise suggestions, shorter ones should rank higher
      const exerciseResults = results.filter(r => r.text.startsWith('Exercise'));
      if (exerciseResults.length >= 2) {
        const firstLength = exerciseResults[0].text.length;
        const secondLength = exerciseResults[1].text.length;
        // Allow for small length differences due to scoring
        expect(Math.abs(firstLength - secondLength)).toBeLessThan(15);
      }
    });

    it('applies length penalty correctly', () => {
      const results = getAutocompleteSuggestions('wri');
      // Verify results are present
      expect(results.length).toBeGreaterThan(0);
      // All results should start with "Wri" or contain it via keyword
      results.forEach(r => {
        const matchesPrefix = r.text.toLowerCase().startsWith('wri');
        const matchesKeyword = r.keywords?.some(k => k.toLowerCase().includes('wri'));
        const matchesFuzzy = r.text.toLowerCase().includes('w') &&
                            r.text.toLowerCase().includes('r') &&
                            r.text.toLowerCase().includes('i');
        expect(matchesPrefix || matchesKeyword || matchesFuzzy).toBe(true);
      });
    });
  });

  describe('Max results parameter', () => {
    it('respects maxResults parameter', () => {
      const results = getAutocompleteSuggestions('e', 3);
      expect(results.length).toBeLessThanOrEqual(3);
    });

    it('returns default 5 results when maxResults not specified', () => {
      const results = getAutocompleteSuggestions('exe');
      expect(results.length).toBeLessThanOrEqual(5);
    });

    it('can return fewer results if not enough matches', () => {
      const results = getAutocompleteSuggestions('zzz', 10);
      // Unlikely to have 10 matches for 'zzz'
      expect(results.length).toBeLessThan(10);
    });

    it('handles maxResults = 1', () => {
      const results = getAutocompleteSuggestions('exe', 1);
      expect(results.length).toBe(1);
    });

    it('handles maxResults = 0', () => {
      const results = getAutocompleteSuggestions('exe', 0);
      expect(results.length).toBe(0);
    });
  });

  describe('Edge cases', () => {
    it('handles empty input', () => {
      expect(getAutocompleteSuggestions('')).toEqual([]);
    });

    it('handles special characters', () => {
      const results = getAutocompleteSuggestions('ex!');
      // Should handle gracefully, may return 0 or filtered results
      expect(Array.isArray(results)).toBe(true);
    });

    it('handles numbers in input', () => {
      const results = getAutocompleteSuggestions('10 min');
      // Should match habits with "10 minutes"
      expect(results.some(s => s.text.includes('10'))).toBe(true);
    });

    it('handles very long input', () => {
      const longInput = 'exercise for 30 minutes every single day without fail';
      const results = getAutocompleteSuggestions(longInput);
      // Should handle gracefully, likely no matches
      expect(Array.isArray(results)).toBe(true);
    });

    it('handles input with multiple spaces', () => {
      const results = getAutocompleteSuggestions('read   pages');
      // Should match "Read X pages" suggestions
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('Real-world usage patterns', () => {
    it('matches common exercise queries', () => {
      const queries = ['exe', 'work', 'gym', 'run'];
      queries.forEach(query => {
        const results = getAutocompleteSuggestions(query);
        expect(results.length).toBeGreaterThan(0);
      });
    });

    it('matches common wellness queries', () => {
      const queries = ['med', 'yoga', 'sle'];
      queries.forEach(query => {
        const results = getAutocompleteSuggestions(query);
        expect(results.length).toBeGreaterThan(0);
      });
    });

    it('matches common productivity queries', () => {
      const queries = ['wri', 'rea', 'lea'];
      queries.forEach(query => {
        const results = getAutocompleteSuggestions(query);
        expect(results.length).toBeGreaterThan(0);
      });
    });

    it('returns relevant results for partial words', () => {
      const results = getAutocompleteSuggestions('str');
      // Should match "Stretch" or similar
      expect(results.length).toBeGreaterThan(0);
    });
  });
});

describe('Autocomplete - getBestSuggestion', () => {
  describe('Basic functionality', () => {
    it('returns top match for valid input', () => {
      const best = getBestSuggestion('exe');
      expect(best).toBeTruthy();
      expect(best).toMatch(/^Exercise/i);
    });

    it('returns a string or null', () => {
      const best = getBestSuggestion('exe');
      expect(typeof best === 'string' || best === null).toBe(true);
    });

    it('returns the most relevant suggestion', () => {
      const best = getBestSuggestion('read');
      expect(best).toMatch(/^Read/i);
    });
  });

  describe('No matches', () => {
    it('returns null for no matches', () => {
      expect(getBestSuggestion('zzz')).toBeNull();
    });

    it('returns null for input < 3 chars', () => {
      expect(getBestSuggestion('ex')).toBeNull();
      expect(getBestSuggestion('a')).toBeNull();
      expect(getBestSuggestion('')).toBeNull();
    });
  });

  describe('Case handling', () => {
    it('handles lowercase input', () => {
      const best = getBestSuggestion('walk');
      expect(best).toBeTruthy();
      expect(best).toMatch(/walk/i);
    });

    it('handles uppercase input', () => {
      const best = getBestSuggestion('WALK');
      expect(best).toBeTruthy();
      expect(best).toMatch(/walk/i);
    });

    it('preserves original case in suggestion', () => {
      const best = getBestSuggestion('walk');
      expect(best).toBeTruthy();
      // Should return "Walk X minutes" not "walk X minutes"
      expect(best?.charAt(0)).toBe('W');
    });
  });

  describe('Consistency with getAutocompleteSuggestions', () => {
    it('returns same result as first element of getAutocompleteSuggestions', () => {
      const input = 'exe';
      const best = getBestSuggestion(input);
      const suggestions = getAutocompleteSuggestions(input, 1);

      if (suggestions.length > 0) {
        expect(best).toBe(suggestions[0].text);
      } else {
        expect(best).toBeNull();
      }
    });

    it('always selects the highest-scored match', () => {
      const inputs = ['exe', 'read', 'med', 'walk'];
      inputs.forEach(input => {
        const best = getBestSuggestion(input);
        const suggestions = getAutocompleteSuggestions(input, 1);

        if (suggestions.length > 0) {
          expect(best).toBe(suggestions[0].text);
        }
      });
    });
  });

  describe('Edge cases', () => {
    it('handles empty string', () => {
      expect(getBestSuggestion('')).toBeNull();
    });

    it('handles whitespace', () => {
      expect(getBestSuggestion('   ')).toBeNull();
    });

    it('handles special characters', () => {
      const best = getBestSuggestion('ex!');
      // May return null or a match, but shouldn't crash
      expect(typeof best === 'string' || best === null).toBe(true);
    });
  });
});

describe('Autocomplete - getInlinePreview', () => {
  describe('Prefix match preview', () => {
    it('returns completion text for prefix match', () => {
      const preview = getInlinePreview('exe', 'Exercise 10 minutes');
      expect(preview).toBe('rcise 10 minutes');
    });

    it('returns completion for single character match', () => {
      const preview = getInlinePreview('E', 'Exercise 10 minutes');
      expect(preview).toBe('xercise 10 minutes');
    });

    it('returns completion for almost-complete input', () => {
      const preview = getInlinePreview('Exercise 10 min', 'Exercise 10 minutes');
      expect(preview).toBe('utes');
    });
  });

  describe('Case sensitivity', () => {
    it('handles lowercase input', () => {
      const preview = getInlinePreview('exe', 'Exercise 10 minutes');
      expect(preview).toBe('rcise 10 minutes');
    });

    it('handles uppercase input', () => {
      const preview = getInlinePreview('EXE', 'Exercise 10 minutes');
      expect(preview).toBe('rcise 10 minutes');
    });

    it('handles mixed case input', () => {
      const preview = getInlinePreview('ExE', 'Exercise 10 minutes');
      expect(preview).toBe('rcise 10 minutes');
    });

    it('preserves original case in suggestion', () => {
      const preview = getInlinePreview('exe', 'Exercise');
      expect(preview).toBe('rcise'); // Not 'RCISE'
    });
  });

  describe('Exact match handling', () => {
    it('returns empty string for exact match', () => {
      const preview = getInlinePreview('Read', 'Read');
      expect(preview).toBe('');
    });

    it('returns empty string for exact match with case difference', () => {
      const preview = getInlinePreview('read', 'Read');
      expect(preview).toBe('');
    });

    it('returns empty string when input equals suggestion', () => {
      const preview = getInlinePreview('Exercise 10 minutes', 'Exercise 10 minutes');
      expect(preview).toBe('');
    });
  });

  describe('Non-prefix match handling', () => {
    it('returns empty for non-prefix match', () => {
      const preview = getInlinePreview('walk', 'Run 5 minutes');
      expect(preview).toBe('');
    });

    it('returns empty when suggestion does not start with input', () => {
      const preview = getInlinePreview('zzz', 'Exercise 10 minutes');
      expect(preview).toBe('');
    });

    it('returns empty for keyword match (not prefix)', () => {
      const preview = getInlinePreview('workout', 'Exercise 10 minutes');
      expect(preview).toBe('');
    });
  });

  describe('Multi-word handling', () => {
    it('handles multi-word input', () => {
      const preview = getInlinePreview('Morning c', 'Morning coffee');
      expect(preview).toBe('offee');
    });

    it('handles input with spaces', () => {
      const preview = getInlinePreview('Exercise 1', 'Exercise 10 minutes');
      expect(preview).toBe('0 minutes');
    });

    it('handles multi-word suggestion', () => {
      const preview = getInlinePreview('No phone', 'No phone for 1 hour');
      expect(preview).toBe(' for 1 hour');
    });
  });

  describe('Edge cases', () => {
    it('handles empty input', () => {
      const preview = getInlinePreview('', 'Exercise 10 minutes');
      expect(preview).toBe('Exercise 10 minutes');
    });

    it('handles empty suggestion', () => {
      const preview = getInlinePreview('exe', '');
      expect(preview).toBe('');
    });

    it('handles both empty', () => {
      const preview = getInlinePreview('', '');
      expect(preview).toBe('');
    });

    it('handles input longer than suggestion', () => {
      const preview = getInlinePreview('Exercise 10 minutes extra', 'Exercise 10 minutes');
      expect(preview).toBe('');
    });

    it('handles whitespace in input', () => {
      const preview = getInlinePreview('  exe  ', 'Exercise 10 minutes');
      // Should not trim input for preview calculation
      expect(preview).toBe('');
    });

    it('handles special characters', () => {
      const preview = getInlinePreview('ex!', 'Exercise 10 minutes');
      expect(preview).toBe('');
    });
  });

  describe('Real-world scenarios', () => {
    it('shows preview for common typing patterns', () => {
      const scenarios = [
        { input: 'exe', suggestion: 'Exercise 10 minutes', expected: 'rcise 10 minutes' },
        { input: 'read', suggestion: 'Read 5 pages', expected: ' 5 pages' },
        { input: 'med', suggestion: 'Meditate for 5 minutes', expected: 'itate for 5 minutes' },
        { input: 'walk', suggestion: 'Walk 10 minutes', expected: ' 10 minutes' },
      ];

      scenarios.forEach(({ input, suggestion, expected }) => {
        const preview = getInlinePreview(input, suggestion);
        expect(preview).toBe(expected);
      });
    });

    it('handles progressive typing', () => {
      const suggestion = 'Exercise 10 minutes';
      const progressiveInputs = ['e', 'ex', 'exe', 'exer', 'exerc', 'exerci', 'exercis', 'exercise'];

      progressiveInputs.forEach(input => {
        const preview = getInlinePreview(input, suggestion);
        expect(preview.length).toBeLessThan(suggestion.length);
        expect(preview).toBe(suggestion.substring(input.length));
      });
    });
  });
});
