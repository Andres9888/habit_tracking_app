import { computeCurrentStreakFromDates } from '../streak';
import { calculateBestStreak } from '../habitCalculations';
import { validateRestDays, getMaxRestDays } from '../restDays';

describe('Rest Days — streak calculation', () => {
  it('skips rest days without breaking current streak', () => {
    // Mon=1, Tue=2, Wed=3(rest), Thu=4, Fri=5
    // Completed Mon, Tue, Thu, Fri — Wed is rest day
    const completed = new Set([
      '2024-01-08', // Mon
      '2024-01-09', // Tue
      // '2024-01-10' Wed — rest day
      '2024-01-11', // Thu
      '2024-01-12', // Fri
    ]);
    const today = new Date('2024-01-12');
    const restDays = [3]; // Wednesday
    expect(computeCurrentStreakFromDates(completed, today, restDays)).toBe(4);
  });

  it('without rest days, gap breaks streak', () => {
    const completed = new Set([
      '2024-01-08',
      '2024-01-09',
      '2024-01-11',
      '2024-01-12',
    ]);
    const today = new Date('2024-01-12');
    expect(computeCurrentStreakFromDates(completed, today)).toBe(2);
  });

  it('rest day at the end keeps streak alive', () => {
    // Last completion was Thu, today is Sat, Fri+Sat are rest days
    const completed = new Set(['2024-01-11']); // Thu
    const today = new Date('2024-01-13'); // Sat
    const restDays = [5, 6]; // Fri, Sat
    expect(computeCurrentStreakFromDates(completed, today, restDays)).toBe(1);
  });

  it('empty rest days array behaves like no rest days', () => {
    const completed = new Set(['2024-01-10', '2024-01-11']);
    const today = new Date('2024-01-11');
    expect(computeCurrentStreakFromDates(completed, today, [])).toBe(2);
  });
});

describe('Rest Days — best streak calculation', () => {
  it('bridges gaps that are all rest days', () => {
    const tracking = [
      { date: '2024-01-08', completed: true }, // Mon
      { date: '2024-01-09', completed: true }, // Tue
      { date: '2024-01-10', completed: false }, // Wed (rest)
      { date: '2024-01-11', completed: true }, // Thu
    ];
    expect(calculateBestStreak(tracking, [3])).toBe(3);
  });

  it('does not bridge non-rest-day gaps', () => {
    const tracking = [
      { date: '2024-01-08', completed: true },
      { date: '2024-01-09', completed: false },
      { date: '2024-01-10', completed: true },
    ];
    expect(calculateBestStreak(tracking, [3])).toBe(1); // Wed is rest but gap is Tue
  });
});

describe('Rest Days — validation', () => {
  it('free user limited to 1 rest day', () => {
    expect(validateRestDays([0], false).valid).toBe(true);
    expect(validateRestDays([0, 6], false).valid).toBe(false);
  });

  it('premium user can set all 7', () => {
    expect(validateRestDays([0, 1, 2, 3, 4, 5, 6], true).valid).toBe(true);
  });

  it('rejects invalid day numbers', () => {
    expect(validateRestDays([7], true).valid).toBe(false);
    expect(validateRestDays([-1], true).valid).toBe(false);
  });

  it('getMaxRestDays returns correct limits', () => {
    expect(getMaxRestDays(false)).toBe(1);
    expect(getMaxRestDays(true)).toBe(7);
  });
});
