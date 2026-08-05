import { getRankTier } from '../rankTier';
import { STRENGTH_LEVEL_THRESHOLDS } from '@/utils/strengthThresholds';
import { LEVELS } from '@/components/StrengthProgressBar/StrengthProgressBar.constants';

describe('rank tier ↔ strength level threshold alignment', () => {
  it('strength bar levels use the canonical thresholds', () => {
    expect(LEVELS.map((l) => l.threshold)).toEqual([
      ...STRENGTH_LEVEL_THRESHOLDS,
    ]);
  });

  it('rank tier transitions occur at the canonical thresholds', () => {
    const [, silver, gold, platinum, diamond] = STRENGTH_LEVEL_THRESHOLDS;
    expect(getRankTier(0).name).toBe('bronze');
    expect(getRankTier(silver - 0.001).name).toBe('bronze');
    expect(getRankTier(silver).name).toBe('silver');
    expect(getRankTier(gold - 0.001).name).toBe('silver');
    expect(getRankTier(gold).name).toBe('gold');
    expect(getRankTier(platinum - 0.001).name).toBe('gold');
    expect(getRankTier(platinum).name).toBe('platinum');
    expect(getRankTier(diamond - 0.001).name).toBe('platinum');
    expect(getRankTier(diamond).name).toBe('diamond');
    expect(getRankTier(100).name).toBe('diamond');
  });
});
