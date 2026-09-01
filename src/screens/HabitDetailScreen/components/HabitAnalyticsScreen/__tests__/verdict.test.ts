import type { MonthRate } from '../../../insights';
import { buildVerdict } from '../verdict';

const month = (index: number, ratePct: number, scheduled = 30): MonthRate => ({
  done: Math.round((ratePct / 100) * scheduled),
  label: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
  ][index] as string,
  month: index,
  ratePct,
  scheduled,
});

describe('buildVerdict', () => {
  it('stays silent until two months carry scheduled days', () => {
    expect(buildVerdict([month(0, 80)])).toBeNull();
    expect(buildVerdict([month(0, 80), month(1, 90, 0)])).toBeNull();
  });

  it('reads a rise as steadier and counts the run of gains', () => {
    const verdict = buildVerdict([
      month(4, 60),
      month(5, 70),
      month(6, 81),
      month(7, 88),
    ]);

    expect(verdict?.headline).toBe("You're steadier than last month.");
    expect(verdict?.deltaPct).toBe(7);
    expect(verdict?.body).toBe(
      '88% of scheduled days in August, up from 81% in July. 3 months of gains in a row.'
    );
    expect(verdict?.labels).toEqual(['May', 'Jun', 'Jul', 'Aug']);
    expect(verdict?.bars).toEqual([60, 70, 81, 88]);
  });

  it('names a slip without softening it', () => {
    const verdict = buildVerdict([month(6, 80), month(7, 61)]);

    expect(verdict?.headline).toBe("You've slipped since last month.");
    expect(verdict?.body).toBe(
      '61% of scheduled days in August, down from 80% in July.'
    );
  });

  it('calls a small move steady', () => {
    const verdict = buildVerdict([month(6, 80), month(7, 82)]);

    expect(verdict?.headline).toBe("You're holding steady.");
    expect(verdict?.body).toContain('up from 80% in July.');
  });

  it('draws at most six months', () => {
    const rates = Array.from({ length: 8 }, (_, index) => month(index, 50));
    expect(buildVerdict(rates)?.bars).toHaveLength(6);
  });
});
