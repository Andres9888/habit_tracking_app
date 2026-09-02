import { renderHook } from '@testing-library/react-native';
import { useThisWeek } from '../useThisWeek';

describe('useThisWeek', () => {
  it('keeps an off-schedule check-in visible and counts it as a real log', () => {
    const { result } = renderHook(() =>
      useThisWeek({
        completedDates: new Set(['2026-08-19']),
        daysOfWeek: [4],
        today: '2026-08-20',
      })
    );

    expect(
      result.current.days.find((day) => day.date === '2026-08-19')
    ).toMatchObject({ state: 'completed' });
    expect(result.current.doneCount).toBe(1);
    expect(result.current.scheduledCount).toBe(1);
  });

  it('does not turn pre-creation or paused dates into misses', () => {
    const { result } = renderHook(() =>
      useThisWeek({
        completedDates: new Set(),
        createdAt: new Date(2026, 7, 19, 12).getTime(),
        pausedAt: new Date(2026, 7, 19, 12).getTime(),
        resumedAt: new Date(2026, 7, 20, 12).getTime(),
        today: '2026-08-20',
      })
    );

    expect(
      result.current.days.find((day) => day.date === '2026-08-18')?.state
    ).toBe('before-creation');
    expect(
      result.current.days.find((day) => day.date === '2026-08-19')?.state
    ).toBe('paused');
  });

  // Week of Mon 2026-08-17 – Sun 2026-08-23; "today" is Thursday the 20th.
  describe('remainingScheduled', () => {
    it('counts today while it is still open, plus the days after it', () => {
      const { result } = renderHook(() =>
        useThisWeek({
          completedDates: new Set(),
          daysOfWeek: [1, 2, 3, 4, 5],
          today: '2026-08-20',
        })
      );

      // Mon–Wed are already missed and Sat/Sun are not scheduled, so only
      // Thursday (open) and Friday (upcoming) are still on the table.
      expect(result.current.remainingScheduled).toBe(2);
    });

    it('drops today from the count once it is logged', () => {
      const { result } = renderHook(() =>
        useThisWeek({
          completedDates: new Set(['2026-08-20']),
          daysOfWeek: [1, 2, 3, 4, 5],
          today: '2026-08-20',
        })
      );

      expect(result.current.remainingScheduled).toBe(1);
    });

    it('includes the weekend only when the weekend is scheduled', () => {
      const { result } = renderHook(() =>
        useThisWeek({
          completedDates: new Set(),
          today: '2026-08-20',
        })
      );

      expect(result.current.remainingScheduled).toBe(4);
    });
  });
});
