import { sanitizeProductEventFields } from './productEvents';

describe('sanitizeProductEventFields', () => {
  it('bounds numeric and string event properties', () => {
    expect(
      sanitizeProductEventFields({
        count: -2,
        durationMs: Number.POSITIVE_INFINITY,
        release: `1${'x'.repeat(100)}`,
        sessionId: `s${'x'.repeat(100)}`,
        streak: 200_000,
      })
    ).toEqual({
      count: 0,
      durationMs: undefined,
      platform: undefined,
      release: `1${'x'.repeat(79)}`,
      sessionId: `s${'x'.repeat(79)}`,
      source: undefined,
      streak: 100_000,
    });
  });
});
