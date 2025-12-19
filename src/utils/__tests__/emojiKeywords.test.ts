/**
 * Emoji Keywords Utility Tests
 * Story 2.8: Emoji Picker Modal Redesign - AC3
 */

import { EMOJI_KEYWORDS, searchEmojisByKeyword } from '../emojiKeywords';

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
});
