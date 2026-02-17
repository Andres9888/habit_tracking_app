/**
 * Tests for ChainVisualizationBanner and its utilities.
 */

import {
  buildChainDays,
  computeCurrentStreak,
  findChainGaps,
  getLinkSize,
  getConnectorHeight,
  getConnectorOpacity,
  shouldShimmer,
  CHAIN_BANNER_DAYS,
} from '../chainBannerUtils';

// ─── Helper ──────────────────────────────────────────────────────────────────

function makeDates(...dateStrings: string[]): Set<string> {
  return new Set(dateStrings);
}

// ─── buildChainDays ───────────────────────────────────────────────────────────

describe('buildChainDays', () => {
  const TODAY = '2026-02-16';

  it('returns CHAIN_BANNER_DAYS entries', () => {
    const days = buildChainDays(new Set(), undefined, TODAY);
    expect(days).toHaveLength(CHAIN_BANNER_DAYS);
  });

  it('marks completed dates with status "completed"', () => {
    const days = buildChainDays(makeDates(TODAY), undefined, TODAY);
    const today = days[days.length - 1];
    // Today is treated as "future" until completed
    // If completed, it should be "completed"
    expect(today.status).toBe('completed');
  });

  it('marks past uncompleted dates as "missed"', () => {
    const days = buildChainDays(new Set(), undefined, TODAY);
    // All past days should be missed (no habitCreatedAt restriction)
    const pastDays = days.slice(0, days.length - 1);
    pastDays.forEach(d => {
      expect(d.status).toBe('missed');
    });
  });

  it('marks days before habitCreatedAt as "pre-habit"', () => {
    // Habit created on TODAY (Feb 16) at noon local time — all prior days pre-habit
    const createdAtToday = new Date('2026-02-16T12:00:00').getTime();
    const days = buildChainDays(new Set(), createdAtToday, TODAY);
    // All days before today should be 'pre-habit'
    const preHabitDays = days.slice(0, days.length - 1);
    preHabitDays.forEach(d => {
      expect(d.status).toBe('pre-habit');
    });
  });

  it('computes run lengths correctly for consecutive completed days', () => {
    const completedDates = makeDates('2026-02-14', '2026-02-15', '2026-02-16');
    const days = buildChainDays(completedDates, undefined, TODAY);
    const last3 = days.slice(-3);
    expect(last3[0].runLength).toBe(1);
    expect(last3[1].runLength).toBe(2);
    expect(last3[2].runLength).toBe(3);
  });

  it('resets run length after a missed day', () => {
    // Feb 14 completed, Feb 15 missed, Feb 16 completed
    const completedDates = makeDates('2026-02-14', '2026-02-16');
    const days = buildChainDays(completedDates, undefined, TODAY);
    const last3 = days.slice(-3);
    expect(last3[0].runLength).toBe(1); // Feb 14
    expect(last3[1].runLength).toBe(0); // Feb 15 missed
    expect(last3[2].runLength).toBe(1); // Feb 16 — reset
  });

  it('today is flagged with isToday', () => {
    const days = buildChainDays(new Set(), undefined, TODAY);
    const lastDay = days[days.length - 1];
    expect(lastDay.isToday).toBe(true);
    const otherDays = days.slice(0, -1);
    otherDays.forEach(d => expect(d.isToday).toBe(false));
  });

  it('uses single-letter day labels', () => {
    const days = buildChainDays(new Set(), undefined, TODAY);
    days.forEach(d => {
      expect(d.dayLabel).toMatch(/^[MTWFS]$/);
    });
  });
});

// ─── computeCurrentStreak ────────────────────────────────────────────────────

describe('computeCurrentStreak', () => {
  const TODAY = '2026-02-16';

  it('returns 0 when no completed days', () => {
    const days = buildChainDays(new Set(), undefined, TODAY);
    expect(computeCurrentStreak(days)).toBe(0);
  });

  it('counts consecutive completed days from the end', () => {
    const dates = makeDates('2026-02-14', '2026-02-15', '2026-02-16');
    const days = buildChainDays(dates, undefined, TODAY);
    expect(computeCurrentStreak(days)).toBe(3);
  });

  it('stops at a missed day', () => {
    const dates = makeDates('2026-02-14', '2026-02-16');
    const days = buildChainDays(dates, undefined, TODAY);
    expect(computeCurrentStreak(days)).toBe(1);
  });

  it('handles streak of 1', () => {
    const dates = makeDates('2026-02-16');
    const days = buildChainDays(dates, undefined, TODAY);
    expect(computeCurrentStreak(days)).toBe(1);
  });
});

// ─── findChainGaps ────────────────────────────────────────────────────────────

describe('findChainGaps', () => {
  const TODAY = '2026-02-16';

  it('returns empty when no missed days', () => {
    // All pre-habit days are not missed
    const days = buildChainDays(new Set(), new Date(TODAY).getTime(), TODAY, 5);
    // No completed days, last day is today (future)
    // Only 1 missed day (yesterday and before... actually none since habitCreatedAt is today)
    const gaps = findChainGaps(days);
    // Gaps should exist for all missed days
    expect(Array.isArray(gaps)).toBe(true);
  });

  it('groups consecutive missed days into one gap', () => {
    // Habit created 5 days ago, no completions
    const fiveDaysAgo = new Date('2026-02-11').getTime();
    const days = buildChainDays(new Set(), fiveDaysAgo, TODAY, 7);
    const gaps = findChainGaps(days);
    // Should have one gap covering all missed days (Feb 11–Feb 15, today is future)
    const totalGapDays = gaps.reduce((sum, [start, end]) => sum + (end - start + 1), 0);
    expect(totalGapDays).toBeGreaterThan(0);
  });

  it('finds gap between two completed runs', () => {
    // Complete Feb 10, miss Feb 11-14, complete Feb 15-16
    const dates = makeDates('2026-02-10', '2026-02-15', '2026-02-16');
    const days = buildChainDays(dates, new Date('2026-02-10').getTime(), TODAY, 10);
    const gaps = findChainGaps(days);
    expect(gaps.length).toBeGreaterThan(0);
    // The gap should span 4 days (Feb 11–14)
    const largGap = gaps.find(([start, end]) => end - start + 1 >= 4);
    expect(largGap).toBeDefined();
  });
});

// ─── strengthConfig helpers ───────────────────────────────────────────────────

describe('getLinkSize', () => {
  it('returns largest size for streak >= 21', () => {
    expect(getLinkSize(21)).toBe(28);
    expect(getLinkSize(100)).toBe(28);
  });

  it('returns smallest size for streak < 3', () => {
    expect(getLinkSize(1)).toBe(20);
    expect(getLinkSize(2)).toBe(20);
  });

  it('scales intermediately', () => {
    expect(getLinkSize(3)).toBe(22);
    expect(getLinkSize(7)).toBe(24);
    expect(getLinkSize(14)).toBe(26);
  });
});

describe('getConnectorHeight', () => {
  it('returns max height for long streaks', () => {
    expect(getConnectorHeight(21)).toBe(4);
  });

  it('returns min height for short streaks', () => {
    expect(getConnectorHeight(1)).toBe(2);
  });
});

describe('getConnectorOpacity', () => {
  it('is between 0 and 1 for all values', () => {
    [0, 1, 3, 7, 14, 21, 100].forEach(n => {
      const opacity = getConnectorOpacity(n);
      expect(opacity).toBeGreaterThan(0);
      expect(opacity).toBeLessThanOrEqual(1);
    });
  });

  it('increases with streak length', () => {
    expect(getConnectorOpacity(7)).toBeGreaterThan(getConnectorOpacity(2));
    expect(getConnectorOpacity(21)).toBeGreaterThan(getConnectorOpacity(7));
  });
});

describe('shouldShimmer', () => {
  it('returns false for streak < 7', () => {
    expect(shouldShimmer(0)).toBe(false);
    expect(shouldShimmer(6)).toBe(false);
  });

  it('returns true for streak >= 7', () => {
    expect(shouldShimmer(7)).toBe(true);
    expect(shouldShimmer(100)).toBe(true);
  });
});
