import { bucketStrengthLevel } from './analyticsDistribution';

describe('bucketStrengthLevel', () => {
  it.each([
    [0, 'starting'],
    [19, 'starting'],
    [20, 'building'],
    [39, 'building'],
    [40, 'developing'],
    [59, 'developing'],
    [60, 'strong'],
    [79, 'strong'],
    [80, 'automatic'],
    [100, 'automatic'],
  ] as const)('maps %d%% strength to %s', (strength, expected) => {
    expect(bucketStrengthLevel(strength)).toBe(expected);
  });
});
