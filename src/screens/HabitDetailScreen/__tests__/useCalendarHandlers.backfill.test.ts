/**
 * useCalendarHandlers backfill tests — past-day taps go through the shared
 * optimistic store: unserialized rapid backfill, future-date guard, and
 * rollback + alert on non-network errors.
 */

import { act, renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';
import type { Id } from '../../../../convex/_generated/dataModel';
import { optimisticStore } from '../../../lib/optimistic';
import { useCalendarHandlers } from '../useCalendarHandlers';

const mockServerToggle = jest.fn();

jest.mock('../../../hooks/useToggleHabitWithTimezone', () => ({
  useToggleHabitWithTimezone: () => mockServerToggle,
}));

jest.mock('../../../contexts/NetworkStatusContext', () => ({
  useIsOnline: () => true,
}));

jest.mock('../../../utils/haptics', () => ({
  triggerHaptic: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../useSwipeActions', () => ({
  useSwipeActions: () => ({}),
}));

jest.spyOn(Alert, 'alert').mockImplementation(() => {});

const HABIT_ID = 'habit1' as Id<'habits'>;
const habit = { _id: HABIT_ID, name: 'Meditation' } as never;

function renderHandlers() {
  return renderHook(() =>
    useCalendarHandlers({
      habit,
      isCompletedOn: (date: string) =>
        optimisticStore.getSnapshot().pendingToggles.get(`${HABIT_ID}:${date}`) ??
        false,
      onClose: jest.fn(),
      setPendingArchive: jest.fn(),
      setPendingDelete: jest.fn(),
    })
  );
}

describe('useCalendarHandlers — optimistic backfill', () => {
  beforeEach(() => {
    // Fake timers keep the deferred a11y announcement (setTimeout 200) from
    // firing after the test env is torn down.
    jest.useFakeTimers();
    optimisticStore.reset();
    mockServerToggle.mockReset().mockResolvedValue(undefined);
    (Alert.alert as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('fires unserialized mutations for rapid taps on distinct past days', async () => {
    const { result } = renderHook(() =>
      useCalendarHandlers({
        habit,
        isCompletedOn: () => false,
        onClose: jest.fn(),
        setPendingArchive: jest.fn(),
        setPendingDelete: jest.fn(),
      })
    );
    // Server never resolves during the taps — old code would drop taps 2+3.
    let release: () => void = () => {};
    mockServerToggle.mockImplementation(
      () => new Promise<void>((resolve) => (release = resolve))
    );

    act(() => {
      result.current.handleCalendarDayPress('2026-07-01', false);
      result.current.handleCalendarDayPress('2026-07-02', false);
      result.current.handleCalendarDayPress('2026-07-03', false);
    });

    expect(mockServerToggle).toHaveBeenCalledTimes(3);
    const pending = optimisticStore.getSnapshot().pendingToggles;
    expect(pending.get(`${HABIT_ID}:2026-07-01`)).toBe(true);
    expect(pending.get(`${HABIT_ID}:2026-07-02`)).toBe(true);
    expect(pending.get(`${HABIT_ID}:2026-07-03`)).toBe(true);
    release();
  });

  it('ignores future dates', () => {
    const { result } = renderHandlers();
    act(() => {
      result.current.handleCalendarDayPress('2099-01-01', false);
    });
    expect(mockServerToggle).not.toHaveBeenCalled();
    expect(optimisticStore.getSnapshot().pendingToggles.size).toBe(0);
  });

  it('rolls back and alerts on non-network server error', async () => {
    mockServerToggle.mockRejectedValue(new Error('validation failed'));
    const { result } = renderHandlers();

    await act(async () => {
      result.current.handleCalendarDayPress('2026-07-01', false);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(Alert.alert).toHaveBeenCalledTimes(1);
    expect(
      optimisticStore.getSnapshot().pendingToggles.has(`${HABIT_ID}:2026-07-01`)
    ).toBe(false);
  });
});
