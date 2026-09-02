/**
 * `missedRunLength` is what stops the recovery headline lying: the week strip
 * can draw three dashed circles while the sentence says "Yesterday". Every case
 * below pins the walk-back rules — schedule, pause, creation date, and the
 * first completed day — with an injected `today` so the suite is date-stable.
 *
 * Fixture week (2026): Mon 17 · Tue 18 · Wed 19 · Thu 20 · Fri 21 · Sat 22.
 */
import { missedRunLength } from '../missedRunLength';

describe('missedRunLength', () => {
  it('counts a single missed day', () => {
    expect(
      missedRunLength({
        completedDates: new Set(['2026-08-18']),
        today: '2026-08-20',
      })
    ).toBe(1);
  });

  it('counts three consecutive missed days as one run', () => {
    expect(
      missedRunLength({
        completedDates: new Set(['2026-08-16']),
        today: '2026-08-20',
      })
    ).toBe(3);
  });

  it('steps over an unscheduled weekday instead of ending the run', () => {
    // Wed/Fri habit: Thursday is not owed, so Friday and Wednesday are one run.
    expect(
      missedRunLength({
        completedDates: new Set(['2026-08-14']),
        daysOfWeek: [3, 5],
        today: '2026-08-22',
      })
    ).toBe(2);
  });

  it('stops at the first completed day', () => {
    // Aug 15 and 14 are also unlogged, but the run the reader can see ended
    // when they last showed up.
    expect(
      missedRunLength({
        completedDates: new Set(['2026-08-17', '2026-08-14']),
        today: '2026-08-20',
      })
    ).toBe(2);
  });

  it('stops at the habit’s creation date', () => {
    expect(
      missedRunLength({
        completedDates: new Set(),
        createdAt: new Date(2026, 7, 18, 9).getTime(),
        today: '2026-08-20',
      })
    ).toBe(2);
  });

  it('steps over a paused span rather than counting it', () => {
    expect(
      missedRunLength({
        completedDates: new Set(['2026-08-16']),
        pausedAt: new Date(2026, 7, 18, 12).getTime(),
        resumedAt: new Date(2026, 7, 19, 12).getTime(),
        today: '2026-08-20',
      })
    ).toBe(2);
  });

  it('returns zero when yesterday was completed', () => {
    expect(
      missedRunLength({
        completedDates: new Set(['2026-08-19']),
        today: '2026-08-20',
      })
    ).toBe(0);
  });
});
