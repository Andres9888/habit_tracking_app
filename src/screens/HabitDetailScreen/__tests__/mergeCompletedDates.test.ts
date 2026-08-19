import { mergeCompletedDates, unionDateSets } from '../mergeCompletedDates';

describe('mergeCompletedDates', () => {
  it('returns the original set when there are no pending toggles', () => {
    const dates = new Set(['2026-08-18']);
    expect(mergeCompletedDates(dates, 'habit_1', new Map())).toBe(dates);
  });

  it('applies pending complete and incomplete for this habit only', () => {
    const dates = new Set(['2026-08-17']);
    const pending = new Map([
      ['habit_1:2026-08-18', true],
      ['habit_1:2026-08-17', false],
      ['habit_2:2026-08-18', true],
    ]);
    const merged = mergeCompletedDates(dates, 'habit_1', pending);
    expect(merged.has('2026-08-18')).toBe(true);
    expect(merged.has('2026-08-17')).toBe(false);
    expect(merged.has('2026-08-18') && merged.size === 1).toBe(true);
  });
});

describe('unionDateSets', () => {
  it('returns the other set when one is empty', () => {
    const filled = new Set(['2026-08-18']);
    expect(unionDateSets(new Set(), filled)).toBe(filled);
    expect(unionDateSets(filled, new Set())).toBe(filled);
  });

  it('merges both sets', () => {
    const union = unionDateSets(
      new Set(['2026-08-17']),
      new Set(['2026-08-18'])
    );
    expect([...union].sort()).toEqual(['2026-08-17', '2026-08-18']);
  });
});
