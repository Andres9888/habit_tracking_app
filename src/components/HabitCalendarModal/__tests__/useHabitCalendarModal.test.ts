import { act, renderHook } from '@testing-library/react-native';
import { useHabitCalendarModal } from '../useHabitCalendarModal';

jest.mock('../deriveHabitCalendarData', () => ({
  deriveHabitCalendarData: () => ({
    bestStreak: 1,
    completionPercentage: 50,
    emoji: 'x',
    habitTrackingEntries: [],
    isTodayCompleted: false,
    name: 'Read',
    recentMissBadge: null,
    scheduleLabel: 'Daily',
    todayDateString: '2026-08-20',
  }),
}));

describe('useHabitCalendarModal', () => {
  it('closes the edit overlay and calendar after a habit is removed', () => {
    const onClose = jest.fn();
    const { result } = renderHook(() =>
      useHabitCalendarModal({
        habit: { _id: 'habit_1', name: 'Read' } as never,
        onClose,
        toggleHabit: jest.fn(),
        tracking: [],
        visible: true,
      })
    );

    act(() => result.current.handleEditPress());
    expect(result.current.showEditScreen).toBe(true);
    act(() => result.current.handleHabitRemoved());
    expect(result.current.showEditScreen).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
