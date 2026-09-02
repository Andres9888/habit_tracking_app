import { getHabitDayState } from '../habitDayState';

const atNoon = (year: number, month: number, day: number) =>
  new Date(year, month - 1, day, 12).getTime();

describe('getHabitDayState', () => {
  const base = {
    createdAt: atNoon(2026, 8, 10),
    daysOfWeek: [1, 2, 3, 4, 5],
    today: '2026-08-20',
  };

  it.each([
    ['completed', '2026-08-15', { completed: true }],
    ['before-creation', '2026-08-09', {}],
    ['open-today', '2026-08-20', {}],
    ['missed', '2026-08-18', {}],
    ['unscheduled', '2026-08-15', {}],
    [
      'paused',
      '2026-08-12',
      {
        pausedAt: atNoon(2026, 8, 11),
        resumedAt: atNoon(2026, 8, 13),
      },
    ],
    ['upcoming', '2026-08-21', {}],
  ] as const)('returns %s for %s', (expected, date, overrides) => {
    expect(getHabitDayState({ ...base, ...overrides, date })).toBe(expected);
  });
});
