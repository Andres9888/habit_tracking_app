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
});
