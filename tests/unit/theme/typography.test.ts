/**
 * Typography tokens — Literata (display) + DM Sans (text) + JetBrains Mono
 */

import {
  typography,
  fontFamilies,
  fontWeights,
  textStyle,
} from '@/theme/typography';

describe('Theme Typography', () => {
  describe('Font Families', () => {
    it('uses Literata for display/serif and DMSans for text', () => {
      expect(fontFamilies.primary.display).toBe('Literata');
      expect(fontFamilies.primary.text).toBe('DMSans');
      expect(fontFamilies.serif).toBe('Literata');
    });

    it('uses JetBrainsMono for monospace', () => {
      expect(fontFamilies.monospace).toBe('JetBrainsMono');
    });

    it('has a system font fallback', () => {
      expect(fontFamilies.system).toBe('-apple-system');
    });
  });

  describe('Font Weights', () => {
    it('defines 400/500/600/700', () => {
      expect(fontWeights.regular).toBe('400');
      expect(fontWeights.medium).toBe('500');
      expect(fontWeights.semibold).toBe('600');
      expect(fontWeights.bold).toBe('700');
    });
  });

  describe('Type scale', () => {
    it('displayLarge is 34pt Literata bold', () => {
      expect(typography.displayLarge.fontFamily).toBe('Literata');
      expect(typography.displayLarge.fontSize).toBe(34);
      expect(typography.displayLarge.fontWeight).toBe('700');
      expect(typography.displayLarge.lineHeight).toBe(41);
      expect(typography.displayLarge.letterSpacing).toBe(-0.85);
    });

    it('heading1 is 22pt Literata bold', () => {
      expect(typography.heading1.fontFamily).toBe('Literata');
      expect(typography.heading1.fontSize).toBe(22);
      expect(typography.heading1.fontWeight).toBe('700');
      expect(typography.heading1.lineHeight).toBe(28);
      expect(typography.heading1.letterSpacing).toBe(-0.35);
    });

    it('heading2 is 22pt DMSans semibold', () => {
      expect(typography.heading2.fontFamily).toBe('DMSans');
      expect(typography.heading2.fontSize).toBe(22);
      expect(typography.heading2.fontWeight).toBe('600');
      expect(typography.heading2.lineHeight).toBe(28);
    });

    it('heading3 is 20pt DMSans semibold', () => {
      expect(typography.heading3.fontFamily).toBe('DMSans');
      expect(typography.heading3.fontSize).toBe(20);
      expect(typography.heading3.fontWeight).toBe('600');
      expect(typography.heading3.lineHeight).toBe(26);
    });

    it('body is 17pt DMSans regular', () => {
      expect(typography.body.fontFamily).toBe('DMSans');
      expect(typography.body.fontSize).toBe(17);
      expect(typography.body.fontWeight).toBe('400');
      expect(typography.body.lineHeight).toBe(24);
    });

    it('bodySmall is 14pt DMSans regular', () => {
      expect(typography.bodySmall.fontFamily).toBe('DMSans');
      expect(typography.bodySmall.fontSize).toBe(14);
      expect(typography.bodySmall.lineHeight).toBe(20);
    });

    it('caption is 13pt DMSans medium', () => {
      expect(typography.caption.fontFamily).toBe('DMSans');
      expect(typography.caption.fontSize).toBe(13);
      expect(typography.caption.fontWeight).toBe('500');
      expect(typography.caption.lineHeight).toBe(18);
    });

    it('button is 17pt DMSans semibold', () => {
      expect(typography.button.fontFamily).toBe('DMSans');
      expect(typography.button.fontSize).toBe(17);
      expect(typography.button.fontWeight).toBe('600');
      expect(typography.button.lineHeight).toBe(24);
    });

    it('tabBar is 10pt DMSans medium', () => {
      expect(typography.tabBar.fontFamily).toBe('DMSans');
      expect(typography.tabBar.fontSize).toBe(10);
      expect(typography.tabBar.fontWeight).toBe('500');
    });

    it('monospace is 16pt JetBrainsMono', () => {
      expect(typography.monospace.fontFamily).toBe('JetBrainsMono');
      expect(typography.monospace.fontSize).toBe(16);
      expect(typography.monospace.lineHeight).toBe(24);
    });
  });

  describe('textStyle helper', () => {
    it('returns a variant and optional color', () => {
      expect(textStyle('heading1').fontSize).toBe(22);
      expect(textStyle('body', '#10B981').color).toBe('#10B981');
    });
  });

  describe('Line height ratios', () => {
    it('keeps display ~1.2x and body ~1.4x', () => {
      expect(
        typography.displayLarge.lineHeight / typography.displayLarge.fontSize
      ).toBeCloseTo(1.206, 2);
      expect(typography.body.lineHeight / typography.body.fontSize).toBeCloseTo(
        1.412,
        2
      );
      expect(
        typography.caption.lineHeight / typography.caption.fontSize
      ).toBeCloseTo(1.385, 2);
    });
  });
});
