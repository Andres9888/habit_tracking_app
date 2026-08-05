import { isWindowEndRecent } from '../windowEndRecency';

describe('isWindowEndRecent', () => {
  const requested = { endDate: '2026-07-06', startDate: '2026-04-07' };

  it('rejects the device-confirmed poison window (ends 90 days early)', () => {
    expect(
      isWindowEndRecent(
        { endDate: '2026-04-07', startDate: '2025-07-07' },
        requested
      )
    ).toBe(false);
  });

  it('accepts a fresh window from a previous session', () => {
    expect(
      isWindowEndRecent(
        { endDate: '2026-07-05', startDate: '2026-04-06' },
        requested
      )
    ).toBe(true);
  });

  it('accepts a window at the staleness boundary (14 days)', () => {
    expect(
      isWindowEndRecent(
        { endDate: '2026-06-22', startDate: '2026-03-24' },
        requested
      )
    ).toBe(true);
  });

  it('rejects a window just past the staleness boundary', () => {
    expect(
      isWindowEndRecent(
        { endDate: '2026-06-21', startDate: '2026-03-23' },
        requested
      )
    ).toBe(false);
  });

  it('rejects unknown or legacy args shapes', () => {
    expect(isWindowEndRecent(undefined, requested)).toBe(false);
    expect(isWindowEndRecent({ dates: [] }, requested)).toBe(false);
    expect(isWindowEndRecent({ endDate: '2026-07-05' }, undefined)).toBe(false);
    expect(isWindowEndRecent({ endDate: 'not-a-date' }, requested)).toBe(false);
  });
});
