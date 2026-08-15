import { buildMonthlyBars } from '../monthlyBars';

describe('buildMonthlyBars', () => {
  it('counts logged days in elapsed months', () => {
    const bars = buildMonthlyBars(
      new Set(['2026-07-02', '2026-08-10', '2026-08-11']),
      '2026-08-15'
    );
    expect(bars).toHaveLength(8);
    expect(bars[6]).toMatchObject({ label: 'Jul', partial: false, value: 1 });
    expect(bars[7]).toMatchObject({ label: 'Aug', partial: true, value: 2 });
  });
});
