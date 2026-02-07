/**
 * SettingsModal Token Migration Tests (Phase 2)
 * Verifies that SettingsModal color files use theme tokens
 * instead of hardcoded hex values.
 */

import { colors } from '@/theme/colors';
import {
  DEFAULT_COLORS,
  getSettingsColors,
} from '@/components/SettingsModal/colors';
import {
  STANDARD_COLORS,
  getSettingsRowColors,
} from '@/components/SettingsModal/SettingsRow.colors';

describe('SettingsModal Token Migration - Phase 2', () => {
  describe('DEFAULT_COLORS use theme tokens', () => {
    it('accent uses colors.text.primary', () => {
      expect(DEFAULT_COLORS.accent).toBe(colors.text.primary);
    });

    it('background uses colors.gray[50]', () => {
      expect(DEFAULT_COLORS.background).toBe(colors.gray[50]);
    });

    it('card uses colors.light.card', () => {
      expect(DEFAULT_COLORS.card).toBe(colors.light.card);
      expect(DEFAULT_COLORS.card).toBe('#ffffff');
    });

    it('cardBorder uses colors.gray[100]', () => {
      expect(DEFAULT_COLORS.cardBorder).toBe(colors.gray[100]);
    });

    it('headerText uses colors.text.primary', () => {
      expect(DEFAULT_COLORS.headerText).toBe(colors.text.primary);
    });

    it('mutedText uses colors.gray[500]', () => {
      expect(DEFAULT_COLORS.mutedText).toBe(colors.gray[500]);
      expect(DEFAULT_COLORS.mutedText).toBe('#78716c');
    });

    it('versionText uses colors.gray[500]', () => {
      expect(DEFAULT_COLORS.versionText).toBe(colors.gray[500]);
    });
  });

  describe('getSettingsColors returns correct palette', () => {
    it('returns DEFAULT_COLORS when not high contrast', () => {
      const result = getSettingsColors(false);
      expect(result).toBe(DEFAULT_COLORS);
    });

    it('returns HIGH_CONTRAST_COLORS when high contrast', () => {
      const result = getSettingsColors(true);
      expect(result.background).toBe('#000000');
      expect(result.accent).toBe('#facc15');
    });
  });

  describe('STANDARD_COLORS (SettingsRow) use theme tokens', () => {
    it('background uses colors.light.card', () => {
      expect(STANDARD_COLORS.background).toBe(colors.light.card);
    });

    it('border uses colors.gray[100]', () => {
      expect(STANDARD_COLORS.border).toBe(colors.gray[100]);
    });

    it('chevron uses colors.gray[500]', () => {
      expect(STANDARD_COLORS.chevron).toBe(colors.gray[500]);
      expect(STANDARD_COLORS.chevron).toBe('#78716c');
    });

    it('label uses colors.text.primary', () => {
      expect(STANDARD_COLORS.label).toBe(colors.text.primary);
    });

    it('switchThumb uses colors.text.inverse', () => {
      expect(STANDARD_COLORS.switchThumb).toBe(colors.text.inverse);
      expect(STANDARD_COLORS.switchThumb).toBe('#FFFFFF');
    });

    it('switchTrackFalse uses colors.gray[300]', () => {
      expect(STANDARD_COLORS.switchTrackFalse).toBe(colors.gray[300]);
      expect(STANDARD_COLORS.switchTrackFalse).toBe('#D1D5DB');
    });

    it('switchTrackTrue uses colors.text.primary', () => {
      expect(STANDARD_COLORS.switchTrackTrue).toBe(colors.text.primary);
    });

    it('value uses colors.gray[500]', () => {
      expect(STANDARD_COLORS.value).toBe(colors.gray[500]);
    });
  });

  describe('getSettingsRowColors returns correct palette', () => {
    it('returns STANDARD_COLORS when not high contrast', () => {
      const result = getSettingsRowColors(false);
      expect(result).toBe(STANDARD_COLORS);
    });

    it('returns HIGH_CONTRAST_COLORS when high contrast', () => {
      const result = getSettingsRowColors(true);
      expect(result.background).toBe('#111111');
      expect(result.label).toBe('#ffffff');
    });
  });
});
