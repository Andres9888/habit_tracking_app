import {
  buildStreakRuns,
  rankStreakRuns,
  runRangeLabel,
  runTrend,
  type StreakRun,
} from '../streakRuns';

const run = (start: string, end: string, length: number, isCurrent = false) =>
  ({ end, isCurrent, length, start }) as StreakRun;

describe('buildStreakRuns', () => {
  it('returns nothing without completions', () => {
    expect(
      buildStreakRuns({ completedDates: new Set(), today: '2026-08-06' })
    ).toEqual([]);
  });

  it('breaks a run on a missed scheduled day', () => {
    const runs = buildStreakRuns({
      completedDates: new Set([
        '2026-08-01',
        '2026-08-02',
        '2026-08-03',
        '2026-08-05',
        '2026-08-06',
      ]),
      today: '2026-08-06',
    });

    expect(runs).toEqual([
      run('2026-08-01', '2026-08-03', 3),
      run('2026-08-05', '2026-08-06', 2, true),
    ]);
  });

  it('treats an unscheduled gap day as a break to match the backend rule', () => {
    // Even when the habit would only run on Mondays and Wednesdays, the
    // backend streak rule still breaks on every missed calendar day.
    const runs = buildStreakRuns({
      completedDates: new Set(['2026-08-03', '2026-08-05', '2026-08-10']),
      today: '2026-08-10',
    });

    expect(runs).toEqual([
      run('2026-08-03', '2026-08-03', 1),
      run('2026-08-05', '2026-08-05', 1),
      run('2026-08-10', '2026-08-10', 1, true),
    ]);
  });

  it('leaves today open rather than breaking the run', () => {
    const runs = buildStreakRuns({
      completedDates: new Set(['2026-08-04', '2026-08-05']),
      today: '2026-08-06',
    });

    expect(runs).toEqual([run('2026-08-04', '2026-08-05', 2, true)]);
  });
});

describe('rankStreakRuns', () => {
  it('puts the live run first even when it is not the longest', () => {
    const ranked = rankStreakRuns([
      run('2026-06-01', '2026-06-12', 12),
      run('2026-07-01', '2026-07-08', 8),
      run('2026-08-01', '2026-08-03', 3, true),
    ]);

    expect(ranked.map((entry) => entry.length)).toEqual([3, 12, 8]);
  });
});

describe('runRangeLabel', () => {
  it('collapses the month when both ends share it', () => {
    expect(
      runRangeLabel(run('2026-06-03', '2026-06-14', 12), '2026-08-06')
    ).toBe('Jun 3 – 14');
  });

  it('names today for the live run', () => {
    expect(
      runRangeLabel(run('2026-07-30', '2026-08-06', 8, true), '2026-08-06')
    ).toBe('Jul 30 – today');
  });
});

describe('runTrend', () => {
  it('stays silent below four runs', () => {
    expect(runTrend([run('a', 'b', 2), run('c', 'd', 3)])).toBeNull();
  });

  it('reports lengthening runs', () => {
    const trend = runTrend([
      run('2026-01-01', '2026-01-02', 2),
      run('2026-02-01', '2026-02-03', 3),
      run('2026-03-01', '2026-03-05', 5),
      run('2026-04-01', '2026-04-07', 7),
    ]);

    expect(trend).toEqual({ earlierAvg: 2.5, improving: true, recentAvg: 6 });
  });
});
