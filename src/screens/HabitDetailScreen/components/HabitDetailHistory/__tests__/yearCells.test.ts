import { buildYearCells } from '../yearCells';

describe('buildYearCells', () => {
  it('runs Monday-first from the week of Jan 1 to today', () => {
    // 1 Jan 2026 is a Thursday → column 0 starts Mon 29 Dec 2025 with 3 blanks.
    const { weeks, monthLabels } = buildYearCells({
      completedDates: new Set(['2026-01-05']),
      schedule: {},
      today: '2026-01-12',
    });
    // Dec 29–Jan 4, Jan 5–11, and the partial week holding the 12th.
    expect(weeks).toHaveLength(3);
    expect(weeks[0]?.slice(0, 3)).toEqual([null, null, null]);
    expect(weeks[0]?.[3]?.date).toBe('2026-01-01');
    expect(weeks[1]?.[0]?.state).toBe('completed');
    expect(weeks[1]?.[6]?.date).toBe('2026-01-11');
    expect(monthLabels).toEqual([{ label: 'Jan', weekIndex: 0 }]);
  });

  it('labels each month at the week holding its first day', () => {
    const { monthLabels } = buildYearCells({
      completedDates: new Set(),
      schedule: {},
      today: '2026-03-03',
    });
    expect(monthLabels.map((m) => m.label)).toEqual(['Jan', 'Feb', 'Mar']);
    expect(monthLabels[1]?.weekIndex).toBe(4); // 1 Feb 2026 is a Sunday → week 4
  });
});
