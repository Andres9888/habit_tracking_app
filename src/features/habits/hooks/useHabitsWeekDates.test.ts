import { renderHook, act } from '@testing-library/react-native';
import { useHabitsWeekDates } from './useHabitsWeekDates';

describe('useHabitsWeekDates', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-19T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not navigate into the future when handleNextWeek is called at today anchor', () => {
    const { result } = renderHook(() => useHabitsWeekDates());
    const todayTime = result.current.today.getTime();

    act(() => {
      result.current.handleNextWeek();
    });

    expect(result.current.weekDates.at(-1)?.getTime()).toBe(todayTime);
    expect(result.current.canNavigateForward).toBe(false);
  });

  it('returns to today from a past week and stops there', () => {
    const { result } = renderHook(() => useHabitsWeekDates());
    const todayTime = result.current.today.getTime();

    act(() => {
      result.current.handlePreviousWeek();
    });

    expect(result.current.canNavigateForward).toBe(true);

    act(() => {
      result.current.handleNextWeek();
    });

    expect(result.current.weekDates.at(-1)?.getTime()).toBe(todayTime);
    expect(result.current.canNavigateForward).toBe(false);

    act(() => {
      result.current.handleNextWeek();
    });

    expect(result.current.weekDates.at(-1)?.getTime()).toBe(todayTime);
  });
});
