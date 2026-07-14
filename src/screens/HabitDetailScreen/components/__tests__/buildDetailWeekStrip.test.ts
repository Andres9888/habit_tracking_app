import {
  buildDetailWeekStrip,
  computeThirtyDayRate,
  isWeekStripEmpty,
} from '../buildDetailWeekStrip';

describe('buildDetailWeekStrip', () => {
  // Fixed Wednesday 2026-07-15 (local) so week is Mon 13 – Sun 19
  const wednesday = '2026-07-15';

  it('builds 7 days Mon–Sun with today marked', () => {
    const days = buildDetailWeekStrip(new Set([wednesday]), wednesday);
    expect(days).toHaveLength(7);
    expect(days[0].label).toBe('M');
    expect(days[0].date).toBe('2026-07-13');
    expect(days[2].today).toBe(true);
    expect(days[2].done).toBe(true);
  });

  it('marks past incomplete days as missed', () => {
    const days = buildDetailWeekStrip(new Set(), wednesday);
    expect(days[0].missed).toBe(true);
    expect(days[1].missed).toBe(true);
    expect(days[2].missed).toBe(false); // today not missed
    expect(days[3].missed).toBe(false); // future
  });

  it('only marks scheduled weekdays as missed', () => {
    const days = buildDetailWeekStrip(new Set(), wednesday, {
      daysOfWeek: [1, 3, 5],
    });
    expect(days[0]).toMatchObject({ missed: true, scheduled: true });
    expect(days[1]).toMatchObject({ missed: false, scheduled: false });
    expect(days[2]).toMatchObject({ missed: false, scheduled: true });
  });

  it('still displays an off-schedule completion', () => {
    const days = buildDetailWeekStrip(new Set(['2026-07-14']), wednesday, {
      daysOfWeek: [1, 3, 5],
    });
    expect(days[1]).toMatchObject({ done: true, scheduled: false });
  });

  it('does not mark days before habit creation as missed', () => {
    const days = buildDetailWeekStrip(new Set(), wednesday, {
      createdAt: new Date(2026, 6, 14).getTime(),
    });
    expect(days[0]).toMatchObject({ missed: false, scheduled: false });
    expect(days[1]).toMatchObject({ missed: true, scheduled: true });
  });

  it('detects empty week', () => {
    const empty = buildDetailWeekStrip(new Set(), wednesday);
    expect(isWeekStripEmpty(empty)).toBe(true);
    const partial = buildDetailWeekStrip(new Set(['2026-07-13']), wednesday);
    expect(isWeekStripEmpty(partial)).toBe(false);
  });
});

describe('computeThirtyDayRate', () => {
  it('returns 0 when nothing completed', () => {
    expect(computeThirtyDayRate(new Set(), '2026-07-15')).toBe(0);
  });

  it('counts only last 30 days', () => {
    const set = new Set(['2026-07-15', '2026-07-14', '2026-06-01']);
    // 2 of 30 ≈ 7%
    expect(computeThirtyDayRate(set, '2026-07-15')).toBe(7);
  });

  it('uses scheduled days as the denominator', () => {
    const completed = new Set([
      '2026-07-13',
      '2026-07-10',
      '2026-07-08',
      '2026-07-06',
    ]);
    expect(
      computeThirtyDayRate(completed, '2026-07-15', {
        daysOfWeek: [1, 3, 5],
      })
    ).toBe(31);
  });

  it('excludes dates before habit creation from the denominator', () => {
    expect(
      computeThirtyDayRate(new Set(['2026-07-15']), '2026-07-15', {
        createdAt: new Date(2026, 6, 15).getTime(),
      })
    ).toBe(100);
  });
});
