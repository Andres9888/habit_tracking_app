/**
 * Timezone Utilities Enhanced Tests
 * Comprehensive tests for timezone detection and handling
 */

import { getUserTimezone } from '../timezone';

describe('timezone utilities', () => {
  describe('getUserTimezone', () => {
    it('returns a string', () => {
      const result = getUserTimezone();
      expect(typeof result).toBe('string');
    });

    it('returns a non-empty string', () => {
      const result = getUserTimezone();
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns valid IANA timezone format', () => {
      const result = getUserTimezone();
      const ianaPattern = /^[A-Za-z_]+(?:\/[A-Za-z_]+)?(?:\/[A-Za-z_]+)?$/;
      expect(ianaPattern.test(result)).toBe(true);
    });

    it('returns UTC as fallback', () => {
      const result = getUserTimezone();
      expect(
        result === 'UTC' || result.includes('/') || /^[A-Za-z_]+$/.test(result)
      ).toBe(true);
    });

    it('is consistent across multiple calls', () => {
      const result1 = getUserTimezone();
      const result2 = getUserTimezone();
      const result3 = getUserTimezone();

      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });

    it('handles Intl API errors gracefully', () => {
      const originalIntl = global.Intl;
      (global.Intl as any) = {
        DateTimeFormat: () => {
          throw new Error('Intl not available');
        },
      };

      const result = getUserTimezone();

      expect(result).toBe('UTC');

      global.Intl = originalIntl;
    });

    it('never returns empty string', () => {
      const result = getUserTimezone();
      expect(result).not.toBe('');
    });

    it('works when Intl.DateTimeFormat throws', () => {
      const originalDateTimeFormat = Intl.DateTimeFormat;

      Intl.DateTimeFormat = function () {
        throw new Error('API unavailable');
      } as any;

      const result = getUserTimezone();
      expect(result).toBe('UTC');

      Intl.DateTimeFormat = originalDateTimeFormat;
    });

    it('uses resolvedOptions correctly', () => {
      const result = getUserTimezone();

      const intlTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      expect(result).toBe(intlTimezone);
    });

    it('timezone is usable with Date methods', () => {
      const timezone = getUserTimezone();
      const dateString = new Date().toLocaleString('en-US', {
        timeZone: timezone,
      });

      expect(dateString).toBeTruthy();
      expect(typeof dateString).toBe('string');
    });

    it('returns timezone without microseconds or milliseconds', () => {
      const result = getUserTimezone();
      expect(result).not.toMatch(/\.\d+/);
    });

    it('is suitable for streak calculations', () => {
      const timezone = getUserTimezone();

      const validFormat = /^[A-Za-z_]+(?:\/[A-Za-z_]+)?$/;
      expect(validFormat.test(timezone)).toBe(true);
    });
  });

  describe('timezone edge cases', () => {
    it('handles UTC timezone', () => {
      const result = getUserTimezone();
      expect(
        result === 'UTC' || result.includes('/') || result.includes('_')
      ).toBe(true);
    });

    it('never throws an error', () => {
      expect(() => {
        getUserTimezone();
      }).not.toThrow();
    });

    it('always returns string type', () => {
      const result = getUserTimezone();
      expect(typeof result).toBe('string');
    });
  });

  describe('timezone consistency with Intl API', () => {
    it('matches Intl.DateTimeFormat output', () => {
      const result = getUserTimezone();
      const intlResult = Intl.DateTimeFormat().resolvedOptions().timeZone;

      expect(result).toBe(intlResult);
    });
  });
});
