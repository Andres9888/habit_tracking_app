import { algorithmForMinutes } from '../algorithmFromDuration';

describe('algorithmForMinutes', () => {
  it('maps very short habits to forgiving (Simple)', () => {
    expect(algorithmForMinutes(0.5)).toBe('forgiving');
    expect(algorithmForMinutes(1)).toBe('forgiving');
    expect(algorithmForMinutes(2)).toBe('forgiving');
  });

  it('maps everyday durations to balanced (Average)', () => {
    expect(algorithmForMinutes(3)).toBe('balanced');
    expect(algorithmForMinutes(10)).toBe('balanced');
    expect(algorithmForMinutes(20)).toBe('balanced');
  });

  it('maps long commitments to strict (Complex)', () => {
    expect(algorithmForMinutes(21)).toBe('strict');
    expect(algorithmForMinutes(30)).toBe('strict');
    expect(algorithmForMinutes(60)).toBe('strict');
  });
});
