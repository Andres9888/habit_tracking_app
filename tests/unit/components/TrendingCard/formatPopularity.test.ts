import { formatPopularity } from '../../../../src/screens/TemplatesScreen/components/TrendingCard/formatPopularity';

describe('formatPopularity', () => {
  it('returns the score as-is when below 1000', () => {
    expect(formatPopularity(0)).toBe('0');
    expect(formatPopularity(42)).toBe('42');
    expect(formatPopularity(999)).toBe('999');
  });

  it('formats scores >= 1000 as X.Xk', () => {
    expect(formatPopularity(1000)).toBe('1k');
    expect(formatPopularity(1200)).toBe('1.2k');
    expect(formatPopularity(1550)).toBe('1.5k');
    expect(formatPopularity(2400)).toBe('2.4k');
    expect(formatPopularity(10_000)).toBe('10k');
    expect(formatPopularity(15_300)).toBe('15.3k');
  });
});
