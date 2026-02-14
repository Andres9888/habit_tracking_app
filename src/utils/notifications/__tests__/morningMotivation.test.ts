import { getTodaysQuote } from '../morningMotivation';

describe('morningMotivation', () => {
  describe('getTodaysQuote', () => {
    it('returns an object with text and author', () => {
      const quote = getTodaysQuote();
      expect(quote).toHaveProperty('text');
      expect(quote).toHaveProperty('author');
      expect(typeof quote.text).toBe('string');
      expect(typeof quote.author).toBe('string');
      expect(quote.text.length).toBeGreaterThan(0);
    });

    it('returns the same quote when called twice on the same day', () => {
      const quote1 = getTodaysQuote();
      const quote2 = getTodaysQuote();
      expect(quote1).toEqual(quote2);
    });
  });
});
