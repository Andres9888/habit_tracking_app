import { renderHook } from '@testing-library/react-native';

import { getLocalDateString } from '../../../utils/getLocalDateString';
import { useCompletionToast } from '../useCompletionToast';

describe('useCompletionToast', () => {
  const initialProps = {
    currentStreak: 0,
    habitId: 'habit-a',
    isCompletedToday: false,
  };

  it('fires on log with the current streak after the toggle', () => {
    const { result, rerender } = renderHook(
      (props: {
        currentStreak: number;
        habitId: string | undefined;
        isCompletedToday: boolean;
      }) => useCompletionToast(props),
      {
        initialProps,
      }
    );

    rerender({ currentStreak: 4, habitId: 'habit-a', isCompletedToday: true });

    expect(result.current.completionToastVisible).toBe(true);
    expect(result.current.completionToastStreak).toBe(4);
  });

  it('freezes the streak and the date it fired for', () => {
    const { result, rerender } = renderHook(
      (props: {
        currentStreak: number;
        habitId: string | undefined;
        isCompletedToday: boolean;
      }) => useCompletionToast(props),
      { initialProps }
    );

    rerender({ currentStreak: 4, habitId: 'habit-a', isCompletedToday: true });
    const firedDate = result.current.completionToastDate;
    expect(firedDate).toBe(getLocalDateString());

    // The server value lands while the toast is still up.
    rerender({ currentStreak: 9, habitId: 'habit-a', isCompletedToday: true });

    expect(result.current.completionToastVisible).toBe(true);
    expect(result.current.completionToastStreak).toBe(4);
    expect(result.current.completionToastDate).toBe(firedDate);
  });

  it('does not fire on unlog', () => {
    const { result, rerender } = renderHook(
      (props: {
        currentStreak: number;
        habitId: string | undefined;
        isCompletedToday: boolean;
      }) => useCompletionToast(props),
      {
        initialProps: {
          currentStreak: 3,
          habitId: 'habit-a',
          isCompletedToday: true,
        },
      }
    );

    rerender({ currentStreak: 2, habitId: 'habit-a', isCompletedToday: false });

    expect(result.current.completionToastVisible).toBe(false);
  });

  it('does not fire on mount when today is already logged', () => {
    const { result } = renderHook(() =>
      useCompletionToast({
        currentStreak: 5,
        habitId: 'habit-a',
        isCompletedToday: true,
      })
    );

    expect(result.current.completionToastVisible).toBe(false);
  });

  it('hides when today becomes unlogged after showing', () => {
    const { result, rerender } = renderHook(
      (props: {
        currentStreak: number;
        habitId: string | undefined;
        isCompletedToday: boolean;
      }) => useCompletionToast(props),
      {
        initialProps,
      }
    );

    rerender({ currentStreak: 2, habitId: 'habit-a', isCompletedToday: true });
    expect(result.current.completionToastVisible).toBe(true);

    rerender({ currentStreak: 1, habitId: 'habit-a', isCompletedToday: false });

    expect(result.current.completionToastVisible).toBe(false);
  });

  it('does not fire when switching to a habit already logged today', () => {
    const { result, rerender } = renderHook(
      (props: {
        currentStreak: number;
        habitId: string | undefined;
        isCompletedToday: boolean;
      }) => useCompletionToast(props),
      { initialProps }
    );

    rerender({ currentStreak: 6, habitId: 'habit-b', isCompletedToday: true });

    expect(result.current.completionToastVisible).toBe(false);
    // Nothing fired, so nothing was captured — the streak stays at its floor.
    expect(result.current.completionToastStreak).toBe(1);
  });

  it('hides a visible toast immediately when the habit changes', () => {
    const { result, rerender } = renderHook(
      (props: {
        currentStreak: number;
        habitId: string | undefined;
        isCompletedToday: boolean;
      }) => useCompletionToast(props),
      { initialProps }
    );

    rerender({ currentStreak: 3, habitId: 'habit-a', isCompletedToday: true });
    expect(result.current.completionToastVisible).toBe(true);

    rerender({ currentStreak: 7, habitId: 'habit-b', isCompletedToday: true });

    expect(result.current.completionToastVisible).toBe(false);
    expect(result.current.completionToastStreak).toBe(3);
  });

  it('fires after a real log on the new habit following a switch', () => {
    const { result, rerender } = renderHook(
      (props: {
        currentStreak: number;
        habitId: string | undefined;
        isCompletedToday: boolean;
      }) => useCompletionToast(props),
      { initialProps }
    );

    rerender({ currentStreak: 1, habitId: 'habit-b', isCompletedToday: false });
    expect(result.current.completionToastVisible).toBe(false);

    rerender({ currentStreak: 4, habitId: 'habit-b', isCompletedToday: true });

    expect(result.current.completionToastVisible).toBe(true);
    expect(result.current.completionToastStreak).toBe(4);
  });
});
