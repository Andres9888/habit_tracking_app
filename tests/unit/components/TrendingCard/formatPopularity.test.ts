import { formatPopularity } from '../../../../src/screens/TemplatesScreen/components/TrendingCard/formatPopularity';

describe('formatPopularity', () => {
  it('returns "New" for zero score', () => {
    expect(formatPopularity(0)).toBe('New');
  });

  it('returns "{n} users" for scores below 1000', () => {
    expect(formatPopularity(42)).toBe('42 users');
    expect(formatPopularity(999)).toBe('999 users');
  });

  it('formats scores >= 1000 as "X.Xk users"', () => {
    expect(formatPopularity(1000)).toBe('1k users');
    expect(formatPopularity(1200)).toBe('1.2k users');
    expect(formatPopularity(1550)).toBe('1.5k users');
    expect(formatPopularity(2400)).toBe('2.4k users');
    expect(formatPopularity(10_000)).toBe('10k users');
    expect(formatPopularity(15_300)).toBe('15.3k users');
  });
});
