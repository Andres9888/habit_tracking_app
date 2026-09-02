import { renderHook } from '@testing-library/react-native';
import { useCalendarDays } from '../useCalendarDays';

const atNoon = (year: number, month: number, day: number) =>
  new Date(year, month - 1, day, 12).getTime();

describe('useCalendarDays', () => {
  it('uses the canonical habit state for every month cell', () => {
    const { result } = renderHook(() =>
      useCalendarDays({
        completedDates: new Set(['2026-08-13']),
        currentMonth: new Date(2026, 7, 1),
        dayContext: {
          createdAt: atNoon(2026, 8, 10),
          daysOfWeek: [1, 2, 3, 4, 5],
          pausedAt: atNoon(2026, 8, 11),
          resumedAt: atNoon(2026, 8, 13),
        },
        today: '2026-08-20',
      })
    );
    const state = (date: string) =>
      result.current.days.find((day) => day.dateString === date)?.state;

    expect(state('2026-08-09')).toBe('before-creation');
    expect(state('2026-08-12')).toBe('paused');
    expect(state('2026-08-13')).toBe('completed');
    expect(state('2026-08-15')).toBe('unscheduled');
    expect(state('2026-08-18')).toBe('missed');
    expect(state('2026-08-20')).toBe('open-today');
    expect(state('2026-08-21')).toBe('upcoming');
  });
});
