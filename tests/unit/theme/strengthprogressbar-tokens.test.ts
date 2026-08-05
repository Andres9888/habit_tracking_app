/**
 * StrengthProgressBar Token Migration Tests (Phase 2)
 * Verifies that StrengthProgressBar uses theme strength tokens
 * instead of hardcoded hex values.
 */

import { colors } from '@/theme/colors';
import {
  LEVELS,
  getCurrentLevel,
  getNextLevel,
} from '@/components/StrengthProgressBar/StrengthProgressBar.constants';
import { styles } from '@/components/StrengthProgressBar/StrengthProgressBar.styles';
import { getGradientColors } from '@/components/StrengthProgressBar/ProgressBarRow.helpers';

describe('StrengthProgressBar Token Migration - Phase 2', () => {
  describe('LEVELS use colors.strength tokens', () => {
    it('Starting level uses colors.strength.starting', () => {
      expect(LEVELS[0].color).toBe(colors.strength.starting);
      expect(LEVELS[0].color).toBe('#4D7A0A');
    });

    it('Starting level bg uses colors.strength.startingLight', () => {
      expect(LEVELS[0].colorBg).toBe(colors.strength.startingLight);
      expect(LEVELS[0].colorBg).toBe('#ecfccb');
    });

    it('Building level uses colors.strength.building', () => {
      expect(LEVELS[1].color).toBe(colors.strength.building);
      expect(LEVELS[1].color).toBe('#16a34a');
    });

    it('Building level bg uses colors.strength.buildingLight', () => {
      expect(LEVELS[1].colorBg).toBe(colors.strength.buildingLight);
      expect(LEVELS[1].colorBg).toBe('#dcfce7');
    });

    it('Developing level uses colors.strength.developing', () => {
      expect(LEVELS[2].color).toBe(colors.strength.developing);
      expect(LEVELS[2].color).toBe('#0d9488');
    });

    it('Developing level bg uses colors.strength.developingLight', () => {
      expect(LEVELS[2].colorBg).toBe(colors.strength.developingLight);
      expect(LEVELS[2].colorBg).toBe('#ccfbf1');
    });

    it('Strong level uses colors.strength.strong', () => {
      expect(LEVELS[3].color).toBe(colors.strength.strong);
      expect(LEVELS[3].color).toBe('#0891b2');
    });

    it('Strong level bg uses colors.strength.strongLight', () => {
      expect(LEVELS[3].colorBg).toBe(colors.strength.strongLight);
      expect(LEVELS[3].colorBg).toBe('#cffafe');
    });

    it('Automatic level uses colors.strength.automatic', () => {
      expect(LEVELS[4].color).toBe(colors.strength.automatic);
      expect(LEVELS[4].color).toBe('#059669');
    });

    it('Automatic level bg uses colors.strength.automaticLight', () => {
      expect(LEVELS[4].colorBg).toBe(colors.strength.automaticLight);
      expect(LEVELS[4].colorBg).toBe('#D4F0E2');
    });
  });

  describe('styles use theme tokens', () => {
    it('arrow color uses colors.gray[500] (WCAG AA compliant)', () => {
      const arrowStyle = styles.arrow;
      expect(arrowStyle.color).toBe(colors.gray[500]);
      expect(arrowStyle.color).toBe('#6B6560');
    });

    it('nextHint color uses colors.gray[500] (WCAG AA compliant)', () => {
      const nextHintStyle = styles.nextHint;
      expect(nextHintStyle.color).toBe(colors.gray[500]);
    });
  });

  describe('getGradientColors returns gradients for strength tokens', () => {
    it('returns gradient for starting color', () => {
      const gradient = getGradientColors(colors.strength.starting);
      expect(gradient).toHaveLength(3);
      expect(gradient[1]).toBe(colors.strength.starting);
    });

    it('returns gradient for building color', () => {
      const gradient = getGradientColors(colors.strength.building);
      expect(gradient).toHaveLength(3);
      expect(gradient[1]).toBe(colors.strength.building);
    });

    it('returns gradient for developing color', () => {
      const gradient = getGradientColors(colors.strength.developing);
      expect(gradient).toHaveLength(3);
      expect(gradient[1]).toBe(colors.strength.developing);
    });

    it('returns gradient for strong color', () => {
      const gradient = getGradientColors(colors.strength.strong);
      expect(gradient).toHaveLength(3);
      expect(gradient[1]).toBe(colors.strength.strong);
    });

    it('returns gradient for automatic color', () => {
      const gradient = getGradientColors(colors.strength.automatic);
      expect(gradient).toHaveLength(3);
      expect(gradient[1]).toBe(colors.strength.automatic);
    });

    it('falls back to solid color for unknown input', () => {
      const gradient = getGradientColors('#unknown');
      expect(gradient).toEqual(['#unknown', '#unknown', '#unknown']);
    });
  });

  describe('getCurrentLevel and getNextLevel work with tokens', () => {
    it('returns Starting level for 0%', () => {
      const level = getCurrentLevel(0);
      expect(level.color).toBe(colors.strength.starting);
      expect(level.label).toBe('Starting');
    });

    it('returns Automatic level for 80%+', () => {
      const level = getCurrentLevel(85);
      expect(level.color).toBe(colors.strength.automatic);
      expect(level.label).toBe('Automatic');
    });

    it('getNextLevel returns Building for 10%', () => {
      const next = getNextLevel(10);
      expect(next).not.toBeNull();
      expect(next!.color).toBe(colors.strength.building);
    });

    it('getNextLevel returns null for 100%', () => {
      const next = getNextLevel(100);
      expect(next).toBeNull();
    });
  });
});
