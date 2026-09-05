import {
  buildResolvedStreakByHabit,
  resolveDisplayedStreak,
} from '../resolveDisplayedStreak';
import type { CurrentStreakRun } from '@/utils/streak';

const WINDOW_START = '2026-06-01';

function run(streak: number, earliestDate?: string): CurrentStreakRun {
  return { earliestDate, streak };
}

describe('resolveDisplayedStreak', () => {
  it('takes the server streak when the run reaches the window start', () => {
    // The client counted 91 days back to the first fetched day, so the real
    // streak may be longer — the server's 400-day window knows the truth.
    expect(
      resolveDisplayedStreak(
        run(91, WINDOW_START),
        { currentStreak: 240 },
        WINDOW_START
      )
    ).toBe(240);
  });

  it('takes the server streak when the run starts before the window', () => {
    expect(
      resolveDisplayedStreak(
        run(91, '2026-05-20'),
        { currentStreak: 240 },
        WINDOW_START
      )
    ).toBe(240);
  });

  it('keeps the client streak when it is larger than the truncated server value', () => {
    expect(
      resolveDisplayedStreak(
        run(91, WINDOW_START),
        { currentStreak: 12 },
        WINDOW_START
      )
    ).toBe(91);
  });

  it('uses the client value for a run that ends inside the window, even when the server is larger', () => {
    // The user just un-toggled today: the client is ahead of the server and
    // must win, otherwise the streak snaps back to the stale server number.
    expect(
      resolveDisplayedStreak(
        run(4, '2026-06-20'),
        { currentStreak: 5 },
        WINDOW_START
      )
    ).toBe(4);
  });

  it('takes the max when the habit was paused inside the window', () => {
    const pausedAt = new Date(2026, 5, 10).getTime();
    expect(
      resolveDisplayedStreak(
        run(4, '2026-06-20'),
        { currentStreak: 30, pausedAt },
        WINDOW_START
      )
    ).toBe(30);
  });

  it('ignores a pause that predates the window', () => {
    const pausedAt = new Date(2026, 3, 10).getTime();
    expect(
      resolveDisplayedStreak(
        run(4, '2026-06-20'),
        { currentStreak: 30, pausedAt },
        WINDOW_START
      )
    ).toBe(4);
  });

  it('returns 0 when there is neither a client run nor a server streak', () => {
    expect(resolveDisplayedStreak(undefined, undefined, WINDOW_START)).toBe(0);
  });
});

describe('buildResolvedStreakByHabit', () => {
  it('resolves every habit, including paused ones with no tracking rows', () => {
    const runs = new Map<string, CurrentStreakRun>([
      ['a', run(91, WINDOW_START)],
      ['b', run(3, '2026-06-25')],
    ]);
    const serverInfo = new Map([
      ['a', { currentStreak: 240 }],
      ['b', { currentStreak: 9 }],
      ['c', { currentStreak: 17, pausedAt: new Date(2026, 5, 10).getTime() }],
    ]);

    const resolved = buildResolvedStreakByHabit(runs, serverInfo, WINDOW_START);

    expect(resolved.get('a')).toBe(240);
    expect(resolved.get('b')).toBe(3);
    expect(resolved.get('c')).toBe(17);
  });
});
