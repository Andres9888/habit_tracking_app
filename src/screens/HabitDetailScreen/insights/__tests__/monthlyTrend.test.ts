import {
  bestMonth,
  buildMonthlyRates,
  monthRangeLabel,
  trendCaption,
  turningPoint,
} from '../monthlyTrend';

const TODAY = '2026-07-25';

/** Completes `rate`% of the days in each listed month of 2026, front-loaded. */
function completions(perMonth: Record<number, number>): Set<string> {
  const done = new Set<string>();
  for (const [monthKey, count] of Object.entries(perMonth)) {
    const month = Number(monthKey);
    for (let day = 1; day <= count; day += 1) {
      done.add(
        `2026-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      );
    }
  }
  return done;
}

describe('buildMonthlyRates', () => {
  it('covers only the elapsed months, partial month included', () => {
    const rates = buildMonthlyRates({
      completedDates: new Set(),
      today: TODAY,
    });
    expect(rates).toHaveLength(7);
    expect(rates[0]?.label).toBe('January');
    expect(rates[6]?.label).toBe('July');
    // July 1-25 only.
    expect(rates[6]?.scheduled).toBe(25);
  });

  it('counts only scheduled weekdays for a part-week habit', () => {
    // Mondays only. January 2026 starts on a Thursday, so it has 4 Mondays.
    const rates = buildMonthlyRates({
      completedDates: new Set(),
      daysOfWeek: [1],
      today: TODAY,
    });
    expect(rates[0]?.scheduled).toBe(4);
  });

  it('rates a month by done over scheduled', () => {
    const rates = buildMonthlyRates({
      completedDates: completions({ 0: 31 }),
      today: TODAY,
    });
    expect(rates[0]?.ratePct).toBe(100);
    expect(rates[1]?.ratePct).toBe(0);
  });
});

describe('turningPoint', () => {
  it('stays silent with too few months', () => {
    const rates = buildMonthlyRates({
      completedDates: completions({ 0: 2, 1: 28 }),
      today: '2026-02-25',
    });
    expect(turningPoint(rates)).toBeNull();
    expect(trendCaption(rates)).toBeNull();
  });

  it('stays silent on a flat year', () => {
    const rates = buildMonthlyRates({
      completedDates: completions({ 0: 15, 1: 14, 2: 15, 3: 15, 4: 15, 5: 15 }),
      today: TODAY,
    });
    expect(turningPoint(rates)).toBeNull();
  });

  it('names the month the rate stepped up at', () => {
    const rates = buildMonthlyRates({
      completedDates: completions({
        0: 3,
        1: 3,
        2: 3,
        3: 3,
        4: 30,
        5: 30,
        6: 24,
      }),
      today: TODAY,
    });
    expect(turningPoint(rates)?.label).toBe('May');
    expect(trendCaption(rates)).toBe(
      'Getting stronger — May was your turning point.'
    );
  });
});

describe('bestMonth and monthRangeLabel', () => {
  it('picks the highest-rate month with a real sample', () => {
    const rates = buildMonthlyRates({
      completedDates: completions({ 0: 10, 1: 26, 2: 10, 3: 10, 4: 10, 5: 10 }),
      today: TODAY,
    });
    expect(bestMonth(rates)?.label).toBe('February');
  });

  it('abbreviates the elapsed range', () => {
    const rates = buildMonthlyRates({
      completedDates: new Set(),
      today: TODAY,
    });
    expect(monthRangeLabel(rates)).toBe('Jan – Jul');
    expect(
      monthRangeLabel(
        buildMonthlyRates({ completedDates: new Set(), today: '2026-01-09' })
      )
    ).toBe('Jan');
  });
});
