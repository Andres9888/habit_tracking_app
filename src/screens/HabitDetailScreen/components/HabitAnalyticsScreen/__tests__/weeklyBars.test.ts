import { buildWeeklyBars } from '../weeklyBars';

describe('buildWeeklyBars', () => {
  it('counts logged days in Monday-start weeks', () => {
    const bars = buildWeeklyBars(
      new Set(['2026-08-10', '2026-08-11', '2026-08-14']),
      '2026-08-15',
      2
    );
    expect(bars).toHaveLength(2);
    expect(bars[1]).toMatchObject({
      label: 'Aug 10',
      partial: true,
      value: 3,
    });
    expect(bars[0]?.value).toBe(0);
  });
});
