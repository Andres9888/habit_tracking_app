import { buildMonthlyBars } from '../monthlyBars';

describe('buildMonthlyBars', () => {
  it('rates elapsed months as percent of scheduled days', () => {
    const bars = buildMonthlyBars(
      new Set(['2026-07-02', '2026-08-10', '2026-08-11']),
      '2026-08-15'
    );
    expect(bars).toHaveLength(6);
    const jul = bars.find((bar) => bar.label === 'Jul');
    const aug = bars.find((bar) => bar.label === 'Aug');
    expect(jul).toMatchObject({
      partial: false,
      value: Math.round((1 / 31) * 100),
      valueCaption: `${Math.round((1 / 31) * 100)}%`,
    });
    expect(aug).toMatchObject({
      partial: true,
      value: Math.round((2 / 15) * 100),
    });
  });

  it('counts only scheduled weekdays for a part-week habit', () => {
    // Mondays only. August 2026 1–15 includes Aug 3 and Aug 10.
    const bars = buildMonthlyBars(new Set(['2026-08-10']), '2026-08-15', [1]);
    const aug = bars.find((bar) => bar.label === 'Aug');
    expect(aug?.value).toBe(50);
  });
});
