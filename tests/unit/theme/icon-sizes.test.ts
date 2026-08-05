/**
 * Icon Size Token Tests (Phase 4)
 * Verifies that the iconSizes scale exists with correct values
 * and that close/dismiss icons use the standard large (24px) size.
 */

import { iconSizes } from '@/theme/iconSizes';

describe('Icon Size Tokens', () => {
  describe('iconSizes scale exists with correct values', () => {
    it('micro should be 10', () => {
      expect(iconSizes.micro).toBe(10);
    });

    it('small should be 16', () => {
      expect(iconSizes.small).toBe(16);
    });

    it('medium should be 20', () => {
      expect(iconSizes.medium).toBe(20);
    });

    it('large should be 24', () => {
      expect(iconSizes.large).toBe(24);
    });

    it('xl should be 32', () => {
      expect(iconSizes.xl).toBe(32);
    });

    it('xxl should be 48', () => {
      expect(iconSizes.xxl).toBe(48);
    });
  });

  describe('scale has exactly 6 sizes', () => {
    it('should have micro, small, medium, large, xl, xxl', () => {
      const keys = Object.keys(iconSizes).sort();
      expect(keys).toEqual(['large', 'medium', 'micro', 'small', 'xl', 'xxl']);
    });
  });

  describe('scale values are in ascending order', () => {
    it('micro < small < medium < large < xl < xxl', () => {
      expect(iconSizes.micro).toBeLessThan(iconSizes.small);
      expect(iconSizes.small).toBeLessThan(iconSizes.medium);
      expect(iconSizes.medium).toBeLessThan(iconSizes.large);
      expect(iconSizes.large).toBeLessThan(iconSizes.xl);
      expect(iconSizes.xl).toBeLessThan(iconSizes.xxl);
    });
  });
});
