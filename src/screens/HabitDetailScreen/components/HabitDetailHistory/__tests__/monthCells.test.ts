import { buildMonthCells } from '../monthCells';

const TODAY = '2026-07-25';

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

  it('marks done, missed and future days', () => {
    const cells = buildMonthCells({
      completedDates: new Set(['2026-07-01']),
      month: 6,
      today: TODAY,
      year: 2026,
    });
    const byDate = new Map(
      cells.filter((cell) => cell !== null).map((cell) => [cell.date, cell.state])
    );
    expect(byDate.get('2026-07-01')).toBe('done');
    expect(byDate.get('2026-07-02')).toBe('missed');
    expect(byDate.get('2026-07-31')).toBe('future');
  });

  it('reads unscheduled weekdays as off, not missed', () => {
    const cells = buildMonthCells({
      completedDates: new Set(),
      // Mondays only.
      daysOfWeek: [1],
      month: 6,
      today: TODAY,
      year: 2026,
    });
    const byDate = new Map(
      cells.filter((cell) => cell !== null).map((cell) => [cell.date, cell.state])
    );
    // 6 July 2026 is a Monday; 7 July is a Tuesday.
    expect(byDate.get('2026-07-06')).toBe('missed');
    expect(byDate.get('2026-07-07')).toBe('off');
  });

  it('credits a completion on an unscheduled day as doneOff', () => {
    const cells = buildMonthCells({
      completedDates: new Set(['2026-07-07']),
      daysOfWeek: [1],
      month: 6,
      today: TODAY,
      year: 2026,
    });
    const cell = cells.find((entry) => entry?.date === '2026-07-07');
    expect(cell?.state).toBe('doneOff');
  });
});
