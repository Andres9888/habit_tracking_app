import {
  buildLatestMemoryKey,
  buildMemoryKey,
  canonicalStringify,
  normalizeArgs,
} from '../keys';

describe('query cache keys', () => {
  it('normalizes object args independent of property order', () => {
    expect(normalizeArgs({ b: 2, a: 1 })).toBe(normalizeArgs({ a: 1, b: 2 }));
  });

  it('normalizes nested args independent of property order', () => {
    expect(normalizeArgs({ range: { end: 'b', start: 'a' } })).toBe(
      normalizeArgs({ range: { start: 'a', end: 'b' } })
    );
  });

  it('separates exact keys from latest fallback keys', () => {
    expect(
      buildMemoryKey('habits.getTracking', { startDate: '2026-07-01' })
    ).not.toBe(buildLatestMemoryKey('habits.getTracking'));
  });

  it('canonicalizes values independent of property order', () => {
    expect(canonicalStringify({ b: 2, a: { d: 4, c: 3 } })).toBe(
      canonicalStringify({ a: { c: 3, d: 4 }, b: 2 })
    );
  });
});
