/**
 * SettingsModal Token Migration Tests (Phase 2)
 * Verifies that SettingsModal color files use theme tokens
 * instead of hardcoded hex values.
 */

import { colors } from '@/theme/colors';
import { lightColors } from '@/theme/darkColors';
import { getSettingsRowColors } from '@/components/SettingsModal/SettingsRow/SettingsRow.colors';

describe('SettingsModal Token Migration - Phase 2', () => {
  describe('active light palette uses shared semantic tokens', () => {
    it('accent uses the current primary accent', () => {
      expect(lightColors.accent).toBe(colors.primary[600]);
    });

    it('background uses colors.light.background', () => {
      expect(lightColors.background).toBe(colors.light.background);
    });

    it('card uses colors.light.card', () => {
      expect(lightColors.card).toBe(colors.light.card);
    });

    it('cardBorder uses the light border token', () => {
      expect(lightColors.cardBorder).toBe(lightColors.border);
    });

    it('headerText uses colors.text.primary', () => {
      expect(lightColors.text.primary).toBe(colors.text.primary);
    });

    it('mutedText uses colors.gray[500]', () => {
      expect(lightColors.text.secondary).toBe(colors.text.secondary);
    });

    it('versionText uses colors.gray[500]', () => {
      expect(lightColors.text.tertiary).toBe(colors.text.tertiary);
    });
  });

  describe('Settings rows consume the active palette', () => {
    it('returns light row colors in light mode', () => {
      expect(getSettingsRowColors(false).background).toBe(lightColors.card);
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
