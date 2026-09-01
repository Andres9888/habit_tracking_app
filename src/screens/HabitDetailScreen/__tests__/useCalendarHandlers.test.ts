/**
 * `pendingToggleDate` is what disables the day cell and the hero toggle while a
 * write is in flight. It was state nobody ever set, so the disabled prop below
 * it never engaged and a second tap could race the first.
 */

import { act, renderHook, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import type { Id } from '../../../../convex/_generated/dataModel';
import { useCalendarHandlers } from '../useCalendarHandlers';

const DATE = '2026-08-20';
let settle: (() => void) | undefined;
let reject: ((error: Error) => void) | undefined;

jest.mock('../../../hooks/useToggleHabitWithTimezone', () => ({
  useToggleHabitWithTimezone: () => jest.fn(),
}));
jest.mock('../../../contexts/NetworkStatusContext', () => ({
  useIsOnline: () => true,
}));
jest.mock('../../../utils/haptics', () => ({ triggerHaptic: jest.fn() }));
jest.mock('../announceToggle', () => ({ announceToggle: jest.fn() }));
jest.mock('../../../lib/optimistic', () => ({
  useOptimisticToggleMutation: () => () =>
    new Promise<void>((resolve, rejectFn) => {
      settle = () => resolve();
      reject = rejectFn;
    }),
}));

function renderHandlers(setPendingToggleDate: (date: string | null) => void) {
  return renderHook(() =>
    useCalendarHandlers({
      completedDates: new Set<string>(),
      habit: { _id: 'habit-1' as Id<'habits'>, name: 'Stretch' } as never,
      onClose: jest.fn(),
      setPendingArchive: jest.fn(),
      setPendingDelete: jest.fn(),
      setPendingToggleDate,
    })
  );
}

describe('useCalendarHandlers pendingToggleDate', () => {
  beforeEach(() => {
    settle = undefined;
    reject = undefined;
    jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('holds the date for the life of the mutation', async () => {
    const setPendingToggleDate = jest.fn();
    const { result } = renderHandlers(setPendingToggleDate);

    act(() => {
      result.current.handleCalendarDayPress(DATE, false);
    });
    expect(setPendingToggleDate).toHaveBeenCalledWith(DATE);
    expect(setPendingToggleDate).toHaveBeenCalledTimes(1);

    await act(async () => {
      settle?.();
    });
    await waitFor(() => {
      expect(setPendingToggleDate).toHaveBeenLastCalledWith(null);
    });
  });

  it('clears the date when the mutation fails', async () => {
    const setPendingToggleDate = jest.fn();
    const { result } = renderHandlers(setPendingToggleDate);

    act(() => {
      result.current.handleCalendarDayPress(DATE, false);
    });

    await act(async () => {
      reject?.(new Error('offline'));
    });
    await waitFor(() => {
      expect(setPendingToggleDate).toHaveBeenLastCalledWith(null);
    });
  });

  it('never opens a pending window for a future date', () => {
    const setPendingToggleDate = jest.fn();
    const { result } = renderHandlers(setPendingToggleDate);

    act(() => {
      result.current.handleCalendarDayPress('2099-01-01', false);
    });

    expect(setPendingToggleDate).not.toHaveBeenCalled();
  });
});
