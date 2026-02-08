/**
 * FontWeight Type Safety Tests
 *
 * Verifies that fontWeights from typography.ts are properly typed
 * and compatible with React Native Paper's configureFonts without
 * requiring `as any` casts. See CODE-AUDIT-06 task 8.
 */

import { describe, it, expect } from 'vitest';
import { fontWeights } from '@/theme/typography';

/** Valid Paper fontWeight values (matches react-native-paper Font['fontWeight']) */
const VALID_FONT_WEIGHTS = [
  'normal',
  'bold',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
];

describe('FontWeight Type Safety', () => {
  describe('fontWeights values are valid Paper Font weights', () => {
    it.each(Object.entries(fontWeights))(
      '%s (%s) should be a valid font weight string',
      (_name, value) => {
        expect(VALID_FONT_WEIGHTS).toContain(value);
      }
    );
  });

  describe('fontWeights are string literals, not numbers', () => {
    it.each(Object.entries(fontWeights))(
      '%s should be a string, not a number',
      (_name, value) => {
        expect(typeof value).toBe('string');
      }
    );
  });

  describe('specific fontWeight values', () => {
    it('regular should be 400', () => {
      expect(fontWeights.regular).toBe('400');
    });

    it('medium should be 500', () => {
      expect(fontWeights.medium).toBe('500');
    });

    it('semibold should be 600', () => {
      expect(fontWeights.semibold).toBe('600');
    });

    it('bold should be 700', () => {
      expect(fontWeights.bold).toBe('700');
    });
  });

  describe('no as-any casts in theme/index.ts', () => {
    it('should not contain "as any" in theme index source', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const themeIndexPath = path.resolve(
        __dirname,
        '../../../src/theme/index.ts'
      );
      const content = fs.readFileSync(themeIndexPath, 'utf-8');
      expect(content).not.toContain('as any');
    });
  });
});
