import { deriveMomentum, deriveStickRate } from '../badgeUtils';

describe('deriveMomentum', () => {
  it('returns value between 10 and 39', () => {
    for (const score of [0, 50, 100, 500, 1000, 3200, 9999]) {
      const result = deriveMomentum(score);
      expect(result).toBeGreaterThanOrEqual(10);
      expect(result).toBeLessThanOrEqual(39);
    }
  });

  it('is deterministic for the same score', () => {
    expect(deriveMomentum(3200)).toBe(deriveMomentum(3200));
  });
});

describe('deriveStickRate', () => {
  it('returns value between 74 and 92', () => {
    for (const score of [0, 50, 100, 500, 1000, 3200, 9999]) {
      const result = deriveStickRate(score);
      expect(result).toBeGreaterThanOrEqual(74);
      expect(result).toBeLessThanOrEqual(92);
    }
  });

  it('is deterministic for the same score', () => {
    expect(deriveStickRate(3200)).toBe(deriveStickRate(3200));
  });
});
