import { act, renderHook, waitFor } from '@testing-library/react-native';

import type { Habit } from '../../../types';
import { useLibraryDetailHandoff } from '../useLibraryDetailHandoff';

jest.mock('convex/react', () => ({
  useConvex: () => ({ query: jest.fn() }),
}));

const existing = {
  _id: 'habits:existing',
  name: 'Drink water',
} as unknown as Habit;
const imported = { _id: 'habits:new', name: 'Meditate' } as unknown as Habit;

function setup(
  habits: Habit[],
  fetchHabit?: (habitId: string) => Promise<Habit | null>
) {
  const order: string[] = [];
  const closeTemplatesScreen = jest.fn(() => {
    order.push('close');
  });
  const openHabitDetail = jest.fn(() => {
    order.push('open');
  });
  const wrappedFetch = fetchHabit
    ? async (habitId: string) => {
        order.push('fetch');
        return fetchHabit(habitId);
      }
    : undefined;
  const { result } = renderHook(() =>
    useLibraryDetailHandoff({
      closeTemplatesScreen,
      fetchHabit: wrappedFetch,
      habits,
      openHabitDetail,
    })
  );
  return { closeTemplatesScreen, openHabitDetail, order, result };
}

describe('useLibraryDetailHandoff', () => {
  it('closes the library and waits for unmount before opening detail', async () => {
    const { openHabitDetail, order, result } = setup([existing]);

    act(() => {
      result.current.handleViewHabit(existing._id);
    });
    expect(order).toEqual(['close']);
    expect(openHabitDetail).not.toHaveBeenCalled();

    act(() => {
      result.current.handleLibraryHidden();
    });
    await waitFor(() => expect(openHabitDetail).toHaveBeenCalledTimes(1));
    expect(order).toEqual(['close', 'open']);
    expect(openHabitDetail).toHaveBeenCalledWith(existing);
  });

  it('ignores duplicate view taps while a handoff is pending', async () => {
    const { openHabitDetail, result } = setup([existing]);

    act(() => {
      result.current.handleViewHabit(existing._id);
      result.current.handleViewHabit(existing._id);
    });
    act(() => {
      result.current.handleLibraryHidden();
    });
    await waitFor(() => expect(openHabitDetail).toHaveBeenCalledTimes(1));
  });

  it('cancels a pending handoff on ordinary library close', async () => {
    const { openHabitDetail, result } = setup([existing]);

    act(() => {
      result.current.handleViewHabit(existing._id);
      result.current.handleClose();
    });
    act(() => {
      result.current.handleLibraryHidden();
    });
    await act(async () => {
      await Promise.resolve();
    });
    expect(openHabitDetail).not.toHaveBeenCalled();
  });

  it('opens an existing habit from the parent list without fetching', async () => {
    const fetchHabit = jest.fn(async () => imported);
    const { openHabitDetail, order, result } = setup([existing], fetchHabit);

    act(() => {
      result.current.handleViewHabit(existing._id);
    });
    act(() => {
      result.current.handleLibraryHidden();
    });
    await waitFor(() => expect(openHabitDetail).toHaveBeenCalledWith(existing));
    expect(fetchHabit).not.toHaveBeenCalled();
    expect(order).toEqual(['close', 'open']);
  });

  it('resolves a newly imported habit missing from the parent list', async () => {
    const fetchHabit = jest.fn(async () => imported);
    const { openHabitDetail, order, result } = setup([], fetchHabit);

    act(() => {
      result.current.handleViewHabit(imported._id);
    });
    act(() => {
      result.current.handleLibraryHidden();
    });
    await waitFor(() => expect(openHabitDetail).toHaveBeenCalledWith(imported));
    expect(order).toEqual(['close', 'fetch', 'open']);
  });

  it('does not present detail when the habit cannot be resolved', async () => {
    const fetchHabit = jest.fn(async () => null);
    const { openHabitDetail, result } = setup([], fetchHabit);

    act(() => {
      result.current.handleViewHabit('habits:missing');
    });
    act(() => {
      result.current.handleLibraryHidden();
    });
    await act(async () => {
      await Promise.resolve();
    });
    expect(openHabitDetail).not.toHaveBeenCalled();
  });
});
