import { renderHook } from '@testing-library/react-native';
import { useHabitTrackingRange } from '../useHabitTrackingRange';

const mockUseCachedQuery = jest.fn(() => []);
jest.mock('../../../../lib/queryCache', () => ({
  useCachedQuery: (...args: unknown[]) => mockUseCachedQuery(...args),
}));

describe('useHabitTrackingRange', () => {
  it('queries the exact requested record range', () => {
    renderHook(() =>
      useHabitTrackingRange({
        endDate: '2026-08-20',
        habitId: 'habit_1' as never,
        startDate: '2024-01-01',
      })
    );

    expect(mockUseCachedQuery).toHaveBeenCalledWith(
      expect.anything(),
      {
        endDate: '2026-08-20',
        habitId: 'habit_1',
        startDate: '2024-01-01',
      },
      {
        entryName: 'habits.getHabitTracking',
        fallbackToLatest: false,
      }
    );
  });
});
