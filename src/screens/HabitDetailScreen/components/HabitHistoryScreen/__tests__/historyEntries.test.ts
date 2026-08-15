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

  it('returns nothing for a future month', () => {
    expect(
      buildHistoryEntries(new Date(2026, 8, 1), new Set(), '2026-08-15')
    ).toEqual([]);
  });
});
