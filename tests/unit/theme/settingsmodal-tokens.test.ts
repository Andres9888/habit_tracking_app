/**
 * SettingsModal Token Migration Tests (Phase 2)
 * Verifies that SettingsModal color files use theme tokens
 * instead of hardcoded hex values.
 */

import { colors } from '@/theme/colors';
import { lightColors } from '@/theme/darkColors';
import {
  DEFAULT_COLORS,
  getSettingsColors,
} from '@/components/SettingsModal/colors';
import { getSettingsRowColors } from '@/components/SettingsModal/SettingsRow/SettingsRow.colors';

describe('SettingsModal Token Migration - Phase 2', () => {
  describe('DEFAULT_COLORS use theme tokens', () => {
    it('accent uses colors.text.primary', () => {
      expect(DEFAULT_COLORS.accent).toBe(colors.text.primary);
    });

    it('background uses colors.light.background', () => {
      expect(DEFAULT_COLORS.background).toBe(colors.light.background);
    });

    it('card uses colors.light.card', () => {
      expect(DEFAULT_COLORS.card).toBe(colors.light.card);
    });

    it('cardBorder uses colors.gray[100]', () => {
      expect(DEFAULT_COLORS.cardBorder).toBe(colors.gray[100]);
    });

    it('headerText uses colors.text.primary', () => {
      expect(DEFAULT_COLORS.headerText).toBe(colors.text.primary);
    });

    it('mutedText uses colors.gray[500]', () => {
      expect(DEFAULT_COLORS.mutedText).toBe(colors.gray[500]);
    });

    it('versionText uses colors.gray[500]', () => {
      expect(DEFAULT_COLORS.versionText).toBe(colors.gray[500]);
    });
  });

  describe('getSettingsColors returns correct palette', () => {
    it('returns DEFAULT_COLORS in light mode', () => {
      expect(getSettingsColors(false)).toBe(DEFAULT_COLORS);
    });
  });

  describe('getSettingsRowColors uses theme tokens', () => {
    const rowColors = getSettingsRowColors(false);

    it('background uses lightColors.card', () => {
      expect(rowColors.background).toBe(lightColors.card);
    });

    it('border uses lightColors.border', () => {
      expect(rowColors.border).toBe(lightColors.border);
    });

    it('chevron uses lightColors.text.secondary', () => {
      expect(rowColors.chevron).toBe(lightColors.text.secondary);
    });

    it('label uses lightColors.text.primary', () => {
      expect(rowColors.label).toBe(lightColors.text.primary);
    });

    it('switchThumb uses lightColors.text.inverse', () => {
      expect(rowColors.switchThumb).toBe(lightColors.text.inverse);
    });

    it('switchTrackFalse uses lightColors.gray[300]', () => {
      expect(rowColors.switchTrackFalse).toBe(lightColors.gray[300]);
    });

    it('switchTrackTrue uses lightColors.primary[500]', () => {
      expect(rowColors.switchTrackTrue).toBe(lightColors.primary[500]);
    });

    it('value uses lightColors.text.secondary', () => {
      expect(rowColors.value).toBe(lightColors.text.secondary);
    });
  });
});
