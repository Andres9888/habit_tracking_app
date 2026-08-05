import { buildInsights, MIN_DAYS_OF_DATA } from '../buildInsights';
import type { InsightEntry } from '../types';

const TODAY = '2026-07-25'; // a Saturday

/** Local-midnight epoch for a YYYY-MM-DD plus an hour offset. */
function at(date: string, hour: number): number {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y!, m! - 1, d!, hour).getTime();
}

function daysBack(count: number): string[] {
  const [y, m, d] = TODAY.split('-').map(Number);
  return Array.from({ length: count }, (_, index) => {
    const cursor = new Date(y!, m! - 1, d! - (index + 1));
    const month = String(cursor.getMonth() + 1).padStart(2, '0');
    const day = String(cursor.getDate()).padStart(2, '0');
    return `${cursor.getFullYear()}-${month}-${day}`;
  });
}

/** Completes every day except the given weekday (0=Sun … 5=Fri). */
function entriesSkipping(weekday: number, span: number, hour = 7) {
  const entries: InsightEntry[] = [];
  for (const date of daysBack(span)) {
    const [y, m, d] = date.split('-').map(Number);
    if (new Date(y!, m! - 1, d!).getDay() === weekday) continue;
    entries.push({ completed: true, createdAt: at(date, hour), date });
  }
  return entries;
}

describe('buildInsights', () => {
  it('hides both cards below the minimum history', () => {
    const result = buildInsights({
      entries: [
        { completed: true, createdAt: at('2026-07-24', 7), date: '2026-07-24' },
      ],
      habitCreatedAt: at('2026-07-20', 9),
      today: TODAY,
    });
    expect(result.daysOfData).toBeLessThan(MIN_DAYS_OF_DATA);
    expect(result.oneFix).toBeNull();
    expect(result.working).toBeNull();
  });

  it('rates the year over elapsed scheduled days, excluding a pending today', () => {
    // Jan 1 – Jul 24 inclusive is 205 elapsed days once today is left out.
    const result = buildInsights({
      entries: daysBack(205).map((date) => ({
        completed: true,
        createdAt: at(date, 7),
        date,
      })),
      habitCreatedAt: at('2026-01-01', 9),
      today: TODAY,
    });
    expect(result.yearCompletions).toBe(205);
    expect(result.yearRatePct).toBe(100);
    expect(result.todayCompletedAt).toBeUndefined();
    // The trend math reads this set — it must carry the full fetched window,
    // not the ~90-day tracking buffer (regression: false "turning point").
    expect(result.doneDates.size).toBe(205);
    expect(result.doneDates.has(daysBack(205)[204]!)).toBe(true);
  });

  it('counts today in the denominator once it is logged', () => {
    const result = buildInsights({
      entries: [
        { completed: true, createdAt: at(TODAY, 7), date: TODAY },
        ...daysBack(20).map((date) => ({
          completed: true,
          createdAt: at(date, 7),
          date,
        })),
      ],
      habitCreatedAt: at('2026-07-04', 9),
      today: TODAY,
    });
    expect(result.todayCompletedAt).toBe(at(TODAY, 7));
    // 4 – 25 July is 22 scheduled days; 21 of them are logged.
    expect(result.yearCompletions).toBe(21);
    expect(result.yearRatePct).toBe(95);
  });

  it('finds the weekday that reliably slips', () => {
    const result = buildInsights({
      entries: entriesSkipping(5, 84),
      habitCreatedAt: at('2026-05-01', 9),
      today: TODAY,
    });
    expect(result.oneFix?.weakest.plural).toBe('Fridays');
    expect(result.oneFix?.weakest.rate).toBe(0);
    expect(result.oneFix?.recentMissed).toBe(4);
  });

  it('reports no fix when every weekday performs alike', () => {
    const entries = daysBack(84).map((date) => ({
      completed: true,
      createdAt: at(date, 7),
      date,
    }));
    expect(buildInsights({ entries, today: TODAY }).oneFix).toBeNull();
  });

  it('names the daypart the completions cluster in', () => {
    const result = buildInsights({
      entries: entriesSkipping(5, 84, 7),
      reminderTime: '6:45 AM',
      today: TODAY,
    });
    expect(result.working?.daypart.key).toBe('early');
    expect(result.working?.sharePct).toBe(100);
    expect(result.working?.otherPct).toBe(0);
    expect(result.working?.reminderInWindow).toBe(true);
  });

  it('ignores back-filled rows when timing completions', () => {
    // Every row was created today, so none of them says anything about timing.
    const entries = daysBack(40).map((date) => ({
      completed: true,
      createdAt: at(TODAY, 21),
      date,
    }));
    expect(buildInsights({ entries, today: TODAY }).working).toBeNull();
  });

  it('counts completions in the current calendar year only', () => {
    const result = buildInsights({
      entries: [
        { completed: true, createdAt: at('2025-12-31', 7), date: '2025-12-31' },
        { completed: true, createdAt: at('2026-01-02', 7), date: '2026-01-02' },
        {
          completed: false,
          createdAt: at('2026-01-03', 7),
          date: '2026-01-03',
        },
      ],
      today: TODAY,
    });
    expect(result.yearCompletions).toBe(1);
  });
});
