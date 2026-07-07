/**
 * detailOptimistic tests — merge semantics (shared-store pending toggles into
 * the detail completed set) and hybrid hero stats derivation.
 */

import {
  applyOptimisticStats,
  hasPendingToggleForHabit,
  mergeCompletedDates,
} from '../detailOptimistic';

const HABIT = 'habit1';

describe('mergeCompletedDates', () => {
  it('returns server dates untouched with no pending toggles', () => {
    const merged = mergeCompletedDates(
      '2026-07-05,2026-07-06',
      new Map(),
      HABIT
    );
    expect(merged).toEqual(new Set(['2026-07-05', '2026-07-06']));
  });

  it('returns empty set for empty key and no pending toggles', () => {
    expect(mergeCompletedDates('', new Map(), HABIT).size).toBe(0);
  });

  it('adds a pending true toggle', () => {
    const pending = new Map([[`${HABIT}:2026-07-04`, true]]);
    const merged = mergeCompletedDates('2026-07-05', pending, HABIT);
    expect(merged).toEqual(new Set(['2026-07-04', '2026-07-05']));
  });

  it('removes a server date on pending false toggle', () => {
    const pending = new Map([[`${HABIT}:2026-07-05`, false]]);
    const merged = mergeCompletedDates('2026-07-05,2026-07-06', pending, HABIT);
    expect(merged).toEqual(new Set(['2026-07-06']));
  });

  it('ignores other habits pending toggles', () => {
    const pending = new Map([['otherHabit:2026-07-04', true]]);
    const merged = mergeCompletedDates('2026-07-05', pending, HABIT);
    expect(merged).toEqual(new Set(['2026-07-05']));
  });
});

describe('hasPendingToggleForHabit', () => {
  it('detects a pending toggle for the habit', () => {
    const pending = new Map([[`${HABIT}:2026-07-04`, true]]);
    expect(hasPendingToggleForHabit(pending, HABIT)).toBe(true);
  });

  it('ignores other habits and empty habitId', () => {
    const pending = new Map([['otherHabit:2026-07-04', true]]);
    expect(hasPendingToggleForHabit(pending, HABIT)).toBe(false);
    expect(hasPendingToggleForHabit(pending, '')).toBe(false);
  });
});

describe('applyOptimisticStats', () => {
  const TODAY = '2026-07-07';

  it('passes server streak through when nothing is pending', () => {
    const stats = applyOptimisticStats(
      { bestStreak: 400, currentStreak: 380 },
      new Set(['2026-07-06', '2026-07-07']),
      false,
      TODAY
    );
    // Server value survives even though the (window-truncated) set disagrees.
    expect(stats.currentStreak).toBe(380);
    expect(stats.bestStreak).toBe(400);
    expect(stats.isCompletedToday).toBe(true);
    expect(stats.totalCompletions).toBe(2);
  });

  it('computes streak from merged set while pending (backfill extends)', () => {
    // Today done (server streak 1); yesterday just backfilled optimistically.
    const stats = applyOptimisticStats(
      { bestStreak: 3, currentStreak: 1 },
      new Set(['2026-07-06', '2026-07-07']),
      true,
      TODAY
    );
    expect(stats.currentStreak).toBe(2);
    expect(stats.bestStreak).toBe(3);
  });

  it('shortens streak when a mid-streak day is optimistically unmarked', () => {
    const stats = applyOptimisticStats(
      { bestStreak: 3, currentStreak: 3 },
      new Set(['2026-07-07']), // 07-05..07-06 removed
      true,
      TODAY
    );
    expect(stats.currentStreak).toBe(1);
    expect(stats.bestStreak).toBe(3);
  });

  it('raises bestStreak when computed streak exceeds server best', () => {
    const stats = applyOptimisticStats(
      { bestStreak: 2, currentStreak: 2 },
      new Set(['2026-07-05', '2026-07-06', '2026-07-07']),
      true,
      TODAY
    );
    expect(stats.currentStreak).toBe(3);
    expect(stats.bestStreak).toBe(3);
  });

  it('reports isCompletedToday false when today is optimistically unmarked', () => {
    const stats = applyOptimisticStats(
      { bestStreak: 5, currentStreak: 1 },
      new Set(['2026-07-05']),
      true,
      TODAY
    );
    expect(stats.isCompletedToday).toBe(false);
    // 1-day grace: streak ending the day before yesterday is expired.
    expect(stats.currentStreak).toBe(0);
    expect(stats.totalCompletions).toBe(1);
  });
});
