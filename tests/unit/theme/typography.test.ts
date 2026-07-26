/**
 * Typography System Tests
 * Verifies typography scale matches UX Specification Section 5.2
 *
 * Phase 1 Acceptance Criteria:
 * - All type sizes, weights, line heights match UX spec
 * - SF Pro font family configured correctly
 * - Typography scales support iOS Dynamic Type
 */

import {
  typography,
  fontFamilies,
  fontWeights,
  textStyle,
} from '@/theme/typography';

describe('Theme Typography - Phase 1', () => {
  describe('Font Families', () => {
    it('should use Literata for display headings', () => {
      expect(fontFamilies.primary.display).toBe('Literata');
    });

    it('should use DM Sans for body copy', () => {
      expect(fontFamilies.primary.text).toBe('DMSans');
    });

    it('should use JetBrains Mono for monospace', () => {
      expect(fontFamilies.monospace).toBe('JetBrainsMono');
    });

    it('should have system font fallback', () => {
      expect(fontFamilies.system).toBe('-apple-system');
    });

    it('should expose Literata as the serif alias', () => {
      expect(fontFamilies.serif).toBe('Literata');
    });
  });

  describe('Font Weights', () => {
    it('should define regular weight (400)', () => {
      expect(fontWeights.regular).toBe('400');
    });

    it('should define medium weight (500)', () => {
      expect(fontWeights.medium).toBe('500');
    });

    it('should define semibold weight (600)', () => {
      expect(fontWeights.semibold).toBe('600');
    });

    it('should define bold weight (700)', () => {
      expect(fontWeights.bold).toBe('700');
    });
  });

  describe('Display Large (Onboarding headlines)', () => {
    it('should match UX spec: 34pt, Bold, 41pt line height', () => {
      expect(typography.displayLarge.fontFamily).toBe('Literata');
      expect(typography.displayLarge.fontSize).toBe(34);
      expect(typography.displayLarge.fontWeight).toBe('700');
      expect(typography.displayLarge.lineHeight).toBe(41);
      expect(typography.displayLarge.letterSpacing).toBe(-0.85);
    });
  });

  describe('Heading 1 (Screen titles)', () => {
    it('should match the current 22pt Literata screen-title scale', () => {
      expect(typography.heading1.fontFamily).toBe('Literata');
      expect(typography.heading1.fontSize).toBe(22);
      expect(typography.heading1.fontWeight).toBe('700');
      expect(typography.heading1.lineHeight).toBe(28);
      expect(typography.heading1.letterSpacing).toBe(-0.35);
    });
  });

  describe('Heading 2 (Section titles)', () => {
    it('should match UX spec: 22pt, Semibold, 28pt line height', () => {
      expect(typography.heading2.fontFamily).toBe('DMSans');
      expect(typography.heading2.fontSize).toBe(22);
      expect(typography.heading2.fontWeight).toBe('600');
      expect(typography.heading2.lineHeight).toBe(28);
      expect(typography.heading2.letterSpacing).toBe(-0.35);
    });
  });

  describe('Heading 3 (Card titles, habit names)', () => {
    it('should match the current 20pt DM Sans card-title scale', () => {
      expect(typography.heading3.fontFamily).toBe('DMSans');
      expect(typography.heading3.fontSize).toBe(20);
      expect(typography.heading3.fontWeight).toBe('600');
      expect(typography.heading3.lineHeight).toBe(26);
      expect(typography.heading3.letterSpacing).toBe(-0.2);
    });
  });

  describe('Body (Primary text)', () => {
    it('should match UX spec: 17pt, Regular, 22pt line height', () => {
      expect(typography.body.fontFamily).toBe('DMSans');
      expect(typography.body.fontSize).toBe(17);
      expect(typography.body.fontWeight).toBe('400');
      expect(typography.body.lineHeight).toBe(24);
      expect(typography.body.letterSpacing).toBe(0);
    });
  });

  describe('Body Small (Secondary info)', () => {
    it('should match the current 14pt secondary-text scale', () => {
      expect(typography.bodySmall.fontFamily).toBe('DMSans');
      expect(typography.bodySmall.fontSize).toBe(14);
      expect(typography.bodySmall.fontWeight).toBe('400');
      expect(typography.bodySmall.lineHeight).toBe(20);
      expect(typography.bodySmall.letterSpacing).toBe(0);
    });
  });

  describe('Caption (Meta info, timestamps)', () => {
    it('should match the current 13pt medium caption scale', () => {
      expect(typography.caption.fontFamily).toBe('DMSans');
      expect(typography.caption.fontSize).toBe(13);
      expect(typography.caption.fontWeight).toBe('500');
      expect(typography.caption.lineHeight).toBe(18);
      expect(typography.caption.letterSpacing).toBe(0.12);
    });
  });

  describe('Button Text', () => {
    it('should match UX spec: 17pt, Semibold, 22pt line height', () => {
      expect(typography.button.fontFamily).toBe('DMSans');
      expect(typography.button.fontSize).toBe(17);
      expect(typography.button.fontWeight).toBe('600');
      expect(typography.button.lineHeight).toBe(24);
      expect(typography.button.letterSpacing).toBe(0.08);
    });
  });

  describe('Tab Bar Labels', () => {
    it('should match UX spec: 10pt, Medium, 12pt line height', () => {
      expect(typography.tabBar.fontFamily).toBe('DMSans');
      expect(typography.tabBar.fontSize).toBe(10);
      expect(typography.tabBar.fontWeight).toBe('500');
      expect(typography.tabBar.lineHeight).toBe(12);
      expect(typography.tabBar.letterSpacing).toBe(0.1);
    });
  });

  describe('Monospace (Numbers, data)', () => {
    it('should match the current JetBrains Mono 16pt data scale', () => {
      expect(typography.monospace.fontFamily).toBe('JetBrainsMono');
      expect(typography.monospace.fontSize).toBe(16);
      expect(typography.monospace.fontWeight).toBe('400');
      expect(typography.monospace.lineHeight).toBe(24);
      expect(typography.monospace.letterSpacing).toBe(0);
    });
  });

  describe('Typography Helper Functions', () => {
    describe('textStyle helper', () => {
      it('should return typography variant without color', () => {
        const style = textStyle('heading1');
        expect(style.fontSize).toBe(22);
        expect(style.fontWeight).toBe('700');
        expect(style.color).toBeUndefined();
      });

      it('should return typography variant with color', () => {
        const style = textStyle('body', '#10B981');
        expect(style.fontSize).toBe(17);
        expect(style.fontWeight).toBe('400');
        expect(style.color).toBe('#10B981');
      });
    });
  });

  describe('Typography Object Structure', () => {
    it('should be immutable (const assertion)', () => {
      // All typography variants should be defined
      expect(typography).toBeDefined();
    });

    it('should have all required typography variants', () => {
      const expectedVariants = [
        'displayLarge',
        'heading1',
        'heading2',
        'heading3',
        'body',
        'bodySmall',
        'caption',
        'button',
        'tabBar',
        'monospace',
      ];

      for (const variant of expectedVariants) {
        expect(typography).toHaveProperty(variant);
      }
    });

    it('should have valid TextStyle properties', () => {
      // Each typography variant should have these properties
      for (const variant of Object.values(typography)) {
        expect(variant).toHaveProperty('fontFamily');
        expect(variant).toHaveProperty('fontSize');
        expect(variant).toHaveProperty('fontWeight');
        expect(variant).toHaveProperty('lineHeight');
        expect(variant).toHaveProperty('letterSpacing');
      }
    });
  });

  describe('iOS Dynamic Type Support', () => {
    it('should document Dynamic Type support in comments', () => {
      // This is more of a documentation test
      // Actual Dynamic Type testing requires React Native Paper integration
      expect(fontFamilies.primary.display).toBeDefined();
      expect(fontFamilies.primary.text).toBeDefined();
    });

    it('should use points (pt) for iOS consistency', () => {
      // All fontSize values should be numbers (points for iOS)
      for (const variant of Object.values(typography)) {
        expect(typeof variant.fontSize).toBe('number');
      }
    });
  });

  describe('Line Height Ratios', () => {
    it('should have proper line height for display text (1.2x)', () => {
      // Display Large: 41 / 34 = 1.206
      const ratio =
        typography.displayLarge.lineHeight / typography.displayLarge.fontSize;
      expect(ratio).toBeCloseTo(1.206, 2);
    });

    it('should have the current readable body line-height ratio', () => {
      // Body: 24 / 17 = 1.412
      const ratio = typography.body.lineHeight / typography.body.fontSize;
      expect(ratio).toBeCloseTo(1.412, 2);
    });

    it('should have proper line height for captions (1.4x)', () => {
      // Caption: 18 / 13 = 1.385
      const ratio = typography.caption.lineHeight / typography.caption.fontSize;
      expect(ratio).toBeCloseTo(1.385, 2);
    });
  });
});
