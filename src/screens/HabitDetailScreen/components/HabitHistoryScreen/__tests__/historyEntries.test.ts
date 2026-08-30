import { buildHistoryEntries } from '../historyEntries';

describe('buildHistoryEntries', () => {
  it('lists the month newest first and stops at today', () => {
    const entries = buildHistoryEntries(
      new Date(2026, 7, 1),
      new Set(['2026-08-12', '2026-08-10']),
      '2026-08-15'
    );
    expect(entries[0]).toMatchObject({
      date: '2026-08-15',
      done: false,
      label: 'Sat 15',
    });
    expect(entries.find((entry) => entry.date === '2026-08-12')?.done).toBe(
      true
    );
    expect(entries.some((entry) => entry.date === '2026-08-16')).toBe(false);
  });

  it('attaches a per-day note when one exists', () => {
    const entries = buildHistoryEntries(
      new Date(2026, 7, 1),
      new Set(['2026-08-12']),
      '2026-08-15',
      { '2026-08-12': 'Two minutes only.' }
    );
    expect(entries.find((entry) => entry.date === '2026-08-12')?.note).toBe(
      'Two minutes only.'
    );
  });

  it('returns nothing for a future month', () => {
    expect(
      buildHistoryEntries(new Date(2026, 8, 1), new Set(), '2026-08-15')
    ).toEqual([]);
  });

  it('distinguishes scheduled misses from rest days', () => {
    const entries = buildHistoryEntries(
      new Date(2026, 7, 1),
      new Set<string>(),
      '2026-08-20',
      {},
      { daysOfWeek: [1, 2, 3, 4, 5] }
    );

    expect(entries.find((entry) => entry.date === '2026-08-18')).toMatchObject({
      state: 'missed',
    });
    expect(entries.find((entry) => entry.date === '2026-08-16')).toMatchObject({
      state: 'unscheduled',
    });
  });

  it('does not manufacture misses before creation, during pause, or today', () => {
    const entries = buildHistoryEntries(
      new Date(2026, 7, 1),
      new Set<string>(),
      '2026-08-20',
      {},
      {
        createdAt: new Date(2026, 7, 10, 12).getTime(),
        pausedAt: new Date(2026, 7, 11, 12).getTime(),
        resumedAt: new Date(2026, 7, 13, 12).getTime(),
      }
    );

    expect(entries.some((entry) => entry.date === '2026-08-09')).toBe(false);
    expect(entries.find((entry) => entry.date === '2026-08-12')).toMatchObject({
      state: 'paused',
    });
    expect(entries.find((entry) => entry.date === '2026-08-20')).toMatchObject({
      state: 'open-today',
    });
  });
});
