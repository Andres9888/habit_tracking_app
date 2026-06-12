import { formatPopularity } from '../../../../src/screens/TemplatesScreen/components/TrendingCard/formatPopularity';

describe('formatPopularity', () => {
  it('returns "New" when the score is zero', () => {
    expect(formatPopularity(0)).toBe('New');
  });

  it('appends "tracking" to scores below 1000', () => {
    expect(formatPopularity(42)).toBe('42 tracking');
    expect(formatPopularity(999)).toBe('999 tracking');
  });

  it('formats scores >= 1000 as X.XK tracking', () => {
    expect(formatPopularity(1000)).toBe('1K tracking');
    expect(formatPopularity(1200)).toBe('1.2K tracking');
    expect(formatPopularity(1550)).toBe('1.5K tracking');
    expect(formatPopularity(2400)).toBe('2.4K tracking');
    expect(formatPopularity(10_000)).toBe('10K tracking');
    expect(formatPopularity(15_300)).toBe('15.3K tracking');
  });
});
