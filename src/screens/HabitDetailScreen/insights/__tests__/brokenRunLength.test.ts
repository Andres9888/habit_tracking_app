import { brokenRunLength } from '../brokenRunLength';
import type { StreakRun } from '../streakRuns';

const run = (start: string, end: string, length: number): StreakRun => ({
  end,
  isCurrent: false,
  length,
  start,
});

/** Mon/Wed/Fri. 2026-08-07 is a Friday; 2026-08-10 the Monday after it. */
const MWF = [1, 3, 5];

describe('brokenRunLength', () => {
  it('returns the adjacent run length when the miss ended it', () => {
    expect(
      brokenRunLength([run('2026-08-01', '2026-08-08', 8)], '2026-08-09')
    ).toBe(8);
  });

  it('returns zero when the latest run ended before an earlier gap', () => {
    expect(
      brokenRunLength([run('2026-08-01', '2026-08-06', 6)], '2026-08-09')
    ).toBe(0);
  });

  it('returns zero when no runs exist', () => {
    expect(brokenRunLength([], '2026-08-09')).toBe(0);
  });

  it('crosses unscheduled days for a Mon/Wed/Fri habit', () => {
    // Run ends Friday, Monday is missed: the weekend in between is not owed,
    // so the run is still the one the miss ended.
    expect(
      brokenRunLength([run('2026-08-05', '2026-08-07', 3)], '2026-08-10', {
        daysOfWeek: MWF,
      })
    ).toBe(3);
  });

  it('stops at a scheduled day that was itself skipped', () => {
    // Run ends Wednesday, Monday is missed — but Friday was scheduled and is
    // not in the run, so the miss did not end this run.
    expect(
      brokenRunLength([run('2026-08-03', '2026-08-05', 3)], '2026-08-10', {
        daysOfWeek: MWF,
      })
    ).toBe(0);
  });

  it('does not cross an off day for a daily habit', () => {
    expect(
      brokenRunLength([run('2026-08-05', '2026-08-07', 3)], '2026-08-10')
    ).toBe(0);
  });

  it('prefers the most recent qualifying run', () => {
    expect(
      brokenRunLength(
        [
          run('2026-08-01', '2026-08-02', 2),
          run('2026-08-05', '2026-08-07', 3),
        ],
        '2026-08-10',
        { daysOfWeek: MWF }
      )
    ).toBe(3);
  });

  it('discounts paused days between the run and the miss', () => {
    expect(
      brokenRunLength([run('2026-08-01', '2026-08-05', 5)], '2026-08-09', {
        pausedAt: Date.parse('2026-08-06T12:00:00'),
        resumedAt: Date.parse('2026-08-09T12:00:00'),
      })
    ).toBe(5);
  });
});
