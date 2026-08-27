import { buildMonthCells } from '../monthCells';

const TODAY = '2026-07-25';

/** Cells for July 2026, keyed by date, with the leading blanks dropped. */
function julyStates(
  overrides: Parameters<typeof buildMonthCells>[0] = {
    completedDates: new Set(),
    month: 6,
    year: 2026,
  }
) {
  const cells = buildMonthCells({ today: TODAY, ...overrides });
  return new Map(
    cells.filter((cell) => cell !== null).map((cell) => [cell.date, cell.state])
  );
}

describe('buildMonthCells', () => {
  it('pads the first week so day 1 lands under its Monday-first column', () => {
    // 1 June 2026 is a Monday — no padding.
    const june = buildMonthCells({
      completedDates: new Set(),
      month: 5,
      today: TODAY,
      year: 2026,
    });
    expect(june[0]?.date).toBe('2026-06-01');
    expect(june).toHaveLength(30);

    // 1 July 2026 is a Wednesday — two leading blanks.
    const july = buildMonthCells({
      completedDates: new Set(),
      month: 6,
      today: TODAY,
      year: 2026,
    });
    expect(july.slice(0, 2)).toEqual([null, null]);
    expect(july[2]?.date).toBe('2026-07-01');
  });

  it('marks completed, missed, today and upcoming days', () => {
    const byDate = julyStates({
      completedDates: new Set(['2026-07-01']),
      month: 6,
      year: 2026,
    });
    expect(byDate.get('2026-07-01')).toBe('completed');
    expect(byDate.get('2026-07-02')).toBe('missed');
    expect(byDate.get('2026-07-25')).toBe('open-today');
    expect(byDate.get('2026-07-31')).toBe('upcoming');
  });

  it('reads unscheduled weekdays as unscheduled, not missed', () => {
    const byDate = julyStates({
      completedDates: new Set(),
      month: 6,
      // Mondays only.
      schedule: { daysOfWeek: [1] },
      year: 2026,
    });
    // 6 July 2026 is a Monday; 7 July is a Tuesday.
    expect(byDate.get('2026-07-06')).toBe('missed');
    expect(byDate.get('2026-07-07')).toBe('unscheduled');
  });

  it('credits a completion on an unscheduled day as completed', () => {
    const byDate = julyStates({
      completedDates: new Set(['2026-07-07']),
      month: 6,
      schedule: { daysOfWeek: [1] },
      year: 2026,
    });
    expect(byDate.get('2026-07-07')).toBe('completed');
  });

  it('reads days before the habit existed and paused days apart from misses', () => {
    const byDate = julyStates({
      completedDates: new Set(),
      month: 6,
      schedule: {
        createdAt: Date.parse('2026-07-10T09:00:00'),
        pausedAt: Date.parse('2026-07-15T09:00:00'),
        resumedAt: Date.parse('2026-07-20T09:00:00'),
      },
      year: 2026,
    });
    expect(byDate.get('2026-07-09')).toBe('before-creation');
    expect(byDate.get('2026-07-13')).toBe('missed');
    expect(byDate.get('2026-07-16')).toBe('paused');
  });

  it('flags a day as noted only when its note has text', () => {
    const cells = buildMonthCells({
      completedDates: new Set(),
      month: 6,
      notes: { '2026-07-02': 'Slept badly', '2026-07-03': '' },
      today: TODAY,
      year: 2026,
    });
    const byDate = new Map(
      cells.filter((cell) => cell !== null).map((cell) => [cell.date, cell])
    );
    expect(byDate.get('2026-07-02')?.hasNote).toBe(true);
    expect(byDate.get('2026-07-03')?.hasNote).toBe(false);
    expect(byDate.get('2026-07-04')?.hasNote).toBe(false);
  });
});
