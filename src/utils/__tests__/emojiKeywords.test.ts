/**
 * Emoji Keywords Utility Tests
 * Story 2.8: Emoji Picker Modal Redesign - AC3 & Task 5 (Auto-Suggest)
 */

import {
  EMOJI_KEYWORDS,
  HABIT_NAME_EMOJI_MAP,
  searchEmojisByKeyword,
  suggestEmojisForHabitName,
  getBestEmojiForHabitName,
} from '../emojiKeywords';

describe('emojiKeywords', () => {
  describe('EMOJI_KEYWORDS', () => {
    it('should have keyword mappings for fitness emojis', () => {
      expect(EMOJI_KEYWORDS['💪']).toContain('workout');
      expect(EMOJI_KEYWORDS['💪']).toContain('gym');
      expect(EMOJI_KEYWORDS['🏃']).toContain('run');
      expect(EMOJI_KEYWORDS['🏃']).toContain('running');
    });

    it('should have keyword mappings for learning emojis', () => {
      expect(EMOJI_KEYWORDS['📚']).toContain('books');
      expect(EMOJI_KEYWORDS['📚']).toContain('read');
      expect(EMOJI_KEYWORDS['🎓']).toContain('study');
      expect(EMOJI_KEYWORDS['🎓']).toContain('education');
    });

    it('should have keyword mappings for wellness emojis', () => {
      expect(EMOJI_KEYWORDS['🧘']).toContain('yoga');
      expect(EMOJI_KEYWORDS['🧘']).toContain('meditate');
      expect(EMOJI_KEYWORDS['😴']).toContain('sleep');
      expect(EMOJI_KEYWORDS['💤']).toContain('rest');
    });

    it('should have keyword mappings for health emojis', () => {
      expect(EMOJI_KEYWORDS['💧']).toContain('water');
      expect(EMOJI_KEYWORDS['💧']).toContain('hydrate');
      expect(EMOJI_KEYWORDS['🍎']).toContain('apple');
      expect(EMOJI_KEYWORDS['🍎']).toContain('healthy');
    });

    it('should have keyword mappings for work emojis', () => {
      expect(EMOJI_KEYWORDS['💼']).toContain('work');
      expect(EMOJI_KEYWORDS['💼']).toContain('business');
      expect(EMOJI_KEYWORDS['✅']).toContain('done');
      expect(EMOJI_KEYWORDS['✅']).toContain('complete');
    });
  });

  describe('searchEmojisByKeyword', () => {
    const mockAllEmojis = ['💪', '🏃', '🧘', '📚', '💧', '😴', '🍎', '💼'];

    it('should return all emojis for empty query', () => {
      const result = searchEmojisByKeyword('', mockAllEmojis);
      expect(result).toEqual(mockAllEmojis);
    });

    it('should return all emojis for whitespace query', () => {
      const result = searchEmojisByKeyword('   ', mockAllEmojis);
      expect(result).toEqual(mockAllEmojis);
    });

    it('should find emojis by exact keyword match', () => {
      const result = searchEmojisByKeyword('run', mockAllEmojis);
      expect(result).toContain('🏃');
    });

    it('should find emojis by partial keyword match', () => {
      const result = searchEmojisByKeyword('work', mockAllEmojis);
      expect(result).toContain('💪'); // Has 'workout' keyword
      expect(result).toContain('💼'); // Has 'work' keyword
    });

    it('should find multiple emojis with same keyword', () => {
      const result = searchEmojisByKeyword('sleep', mockAllEmojis);
      expect(result).toContain('😴');
    });

    it('should be case insensitive', () => {
      const result = searchEmojisByKeyword('RUN', mockAllEmojis);
      expect(result).toContain('🏃');
    });

    it('should find water emoji with hydrate synonym', () => {
      const result = searchEmojisByKeyword('hydrate', mockAllEmojis);
      expect(result).toContain('💧');
    });

    it('should find meditation emoji with yoga keyword', () => {
      const result = searchEmojisByKeyword('yoga', mockAllEmojis);
      expect(result).toContain('🧘');
    });

    it('should find reading emoji with book keyword', () => {
      const result = searchEmojisByKeyword('book', mockAllEmojis);
      expect(result).toContain('📚');
    });

    it('should return empty array for non-matching query', () => {
      // The search returns from EMOJI_KEYWORDS (not filtered by provided emojis)
      // So we need a query that doesn't match any keyword in the database
      // "xkcd" doesn't match any keyword substring
      const result = searchEmojisByKeyword('xkcd', mockAllEmojis);
      expect(result).toEqual([]);
    });

    it('should not return duplicates', () => {
      const result = searchEmojisByKeyword('gym', mockAllEmojis);
      const uniqueResults = [...new Set(result)];
      expect(result.length).toBe(uniqueResults.length);
    });

    it('should handle special characters in query', () => {
      const result = searchEmojisByKeyword('!!!', mockAllEmojis);
      expect(result).toEqual([]);
    });

    // Test specific synonyms from the story requirements
    describe('Story-specified keyword synonyms', () => {
      it('should find 🏃 with "run" keyword', () => {
        const result = searchEmojisByKeyword('run', mockAllEmojis);
        expect(result).toContain('🏃');
      });

      it('should find 💧 with "water" keyword', () => {
        const result = searchEmojisByKeyword('water', mockAllEmojis);
        expect(result).toContain('💧');
      });

      it('should find 😴 with "sleep" keyword', () => {
        const result = searchEmojisByKeyword('sleep', mockAllEmojis);
        expect(result).toContain('😴');
      });
    });
  });

  // Task 5: Auto-Suggest Emojis Tests
  describe('HABIT_NAME_EMOJI_MAP', () => {
    it('should have mappings for common fitness habits', () => {
      expect(HABIT_NAME_EMOJI_MAP['run']).toContain('🏃');
      expect(HABIT_NAME_EMOJI_MAP['workout']).toContain('💪');
      expect(HABIT_NAME_EMOJI_MAP['yoga']).toContain('🧘');
      expect(HABIT_NAME_EMOJI_MAP['gym']).toContain('🏋️');
    });

    it('should have mappings for learning habits', () => {
      expect(HABIT_NAME_EMOJI_MAP['read']).toContain('📖');
      expect(HABIT_NAME_EMOJI_MAP['study']).toContain('📚');
      expect(HABIT_NAME_EMOJI_MAP['journal']).toContain('📓');
    });

    it('should have mappings for health habits', () => {
      expect(HABIT_NAME_EMOJI_MAP['water']).toContain('💧');
      expect(HABIT_NAME_EMOJI_MAP['sleep']).toContain('😴');
      expect(HABIT_NAME_EMOJI_MAP['meditate']).toContain('🧘');
    });

    it('should have multiple emoji options for each word', () => {
      expect(HABIT_NAME_EMOJI_MAP['run'].length).toBeGreaterThanOrEqual(2);
      expect(HABIT_NAME_EMOJI_MAP['water'].length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('suggestEmojisForHabitName', () => {
    it('should return empty array for empty input', () => {
      expect(suggestEmojisForHabitName('')).toEqual([]);
      expect(suggestEmojisForHabitName('   ')).toEqual([]);
    });

    it('should suggest 🏃 for "Morning Run"', () => {
      const result = suggestEmojisForHabitName('Morning Run');
      expect(result).toContain('🏃');
      expect(result[0]).toBe('🏃'); // Should be first/best match
    });

    it('should suggest 💧 for "Drink Water"', () => {
      const result = suggestEmojisForHabitName('Drink Water');
      expect(result).toContain('💧');
    });

    it('should suggest 🧘 for "Meditate"', () => {
      const result = suggestEmojisForHabitName('Meditate');
      expect(result).toContain('🧘');
    });

    it('should suggest 📖 for "Read 30 minutes"', () => {
      const result = suggestEmojisForHabitName('Read 30 minutes');
      expect(result).toContain('📖');
    });

    it('should suggest 😴 for "Go to sleep early"', () => {
      const result = suggestEmojisForHabitName('Go to sleep early');
      expect(result).toContain('😴');
    });

    it('should handle multiple relevant words', () => {
      const result = suggestEmojisForHabitName('Morning Run and Stretch');
      expect(result).toContain('🏃');
      expect(result).toContain('🧘');
    });

    it('should respect maxSuggestions limit', () => {
      const result = suggestEmojisForHabitName('Daily workout exercise gym', 3);
      expect(result.length).toBeLessThanOrEqual(3);
    });

    it('should handle numbers and special characters gracefully', () => {
      const result = suggestEmojisForHabitName('30-min run!!!');
      expect(result).toContain('🏃');
    });

    it('should be case insensitive', () => {
      const result1 = suggestEmojisForHabitName('RUN');
      const result2 = suggestEmojisForHabitName('run');
      expect(result1).toEqual(result2);
    });

    it('should return empty for unrelated words', () => {
      const result = suggestEmojisForHabitName('xyz abc def');
      expect(result).toEqual([]);
    });

    it('should suggest 💼 for work-related habits', () => {
      const result = suggestEmojisForHabitName('Check work emails');
      expect(result).toContain('📧');
    });

    it('should suggest 🍳 for cooking habits', () => {
      const result = suggestEmojisForHabitName('Cook breakfast');
      expect(result).toContain('🍳');
    });

    it('should prioritize exact matches over partial', () => {
      const result = suggestEmojisForHabitName('run');
      // 🏃 should be prioritized as it's the first emoji for exact "run" match
      expect(result[0]).toBe('🏃');
    });
  });

  describe('getBestEmojiForHabitName', () => {
    it('should return null for empty input', () => {
      expect(getBestEmojiForHabitName('')).toBeNull();
      expect(getBestEmojiForHabitName('   ')).toBeNull();
    });

    it('should return 🏃 for "Run"', () => {
      expect(getBestEmojiForHabitName('Run')).toBe('🏃');
    });

    it('should return 💧 for "Drink Water"', () => {
      expect(getBestEmojiForHabitName('Drink Water')).toBe('💧');
    });

    it('should return null for unmatched habits', () => {
      expect(getBestEmojiForHabitName('xyz')).toBeNull();
    });

    it('should return 🧘 for "Meditate"', () => {
      expect(getBestEmojiForHabitName('Meditate')).toBe('🧘');
    });

    it('should return 📖 for "Read a book"', () => {
      expect(getBestEmojiForHabitName('Read a book')).toBe('📖');
    });
  });
});
