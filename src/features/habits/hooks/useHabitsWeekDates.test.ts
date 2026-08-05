import { renderHook, act } from '@testing-library/react-native';
import { addDays } from 'date-fns';
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

  it('maps previous to backward dates and next to forward dates', () => {
    const { result } = renderHook(() => useHabitsWeekDates());
    const initialEnd = result.current.weekDates.at(-1);

    expect(initialEnd).toBeTruthy();

    act(() => {
      result.current.handlePreviousWeek();
    });

    const previousEnd = result.current.weekDates.at(-1);
    expect(previousEnd?.getTime()).toBe(
      addDays(initialEnd as Date, -5).getTime()
    );

    act(() => {
      result.current.handleNextWeek();
    });

    const nextEnd = result.current.weekDates.at(-1);
    expect(nextEnd?.getTime()).toBe((initialEnd as Date).getTime());
  });
});
