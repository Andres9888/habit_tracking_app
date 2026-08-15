/**
 * StrengthProgressBar tokens
 */

import { colors } from '@/theme/colors';
import {
  LEVELS,
  getCurrentLevel,
  getNextLevel,
} from '@/components/StrengthProgressBar/StrengthProgressBar.constants';
import { styles } from '@/components/StrengthProgressBar/StrengthProgressBar.styles';
import { getGradientColors } from '@/components/StrengthProgressBar/ProgressBarRow.helpers';

describe('StrengthProgressBar tokens', () => {
  it('maps LEVELS to colors.strength', () => {
    expect(LEVELS[0].color).toBe(colors.strength.starting);
    expect(LEVELS[0].color).toBe('#4D7A0A');
    expect(LEVELS[0].colorBg).toBe(colors.strength.startingLight);
    expect(LEVELS[1].color).toBe(colors.strength.building);
    expect(LEVELS[2].color).toBe(colors.strength.developing);
    expect(LEVELS[3].color).toBe(colors.strength.strong);
    expect(LEVELS[4].color).toBe(colors.strength.automatic);
    expect(LEVELS[4].colorBg).toBe(colors.strength.automaticLight);
    expect(LEVELS[4].colorBg).toBe('#D4F0E2');
  });

  it('uses gray[500] for hint text', () => {
    expect(styles.arrow.color).toBe(colors.gray[500]);
    expect(styles.arrow.color).toBe('#6B6560');
    expect(styles.nextHint.color).toBe(colors.gray[500]);
  });

  it('returns a 3-stop gradient for each strength token', () => {
    for (const key of [
      'starting',
      'building',
      'developing',
      'strong',
      'automatic',
    ] as const) {
      const gradient = getGradientColors(colors.strength[key]);
      expect(gradient).toHaveLength(3);
    }
    expect(getGradientColors('#unknown')).toEqual([
      '#unknown',
      '#unknown',
      '#unknown',
    ]);
  });

  it('resolves current/next levels from thresholds', () => {
    expect(getCurrentLevel(0).label).toBe('Starting');
    expect(getCurrentLevel(85).label).toBe('Automatic');
    expect(getNextLevel(10)?.color).toBe(colors.strength.building);
    expect(getNextLevel(100)).toBeNull();
  });
});
