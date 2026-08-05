import { renderHook, act } from '@testing-library/react-native';

import { useOptimisticDragEnd } from '../useOptimisticDragEnd';
import { optimisticStore } from '../../../../lib/optimistic';
import { getOfflineQueueManager, isNetworkError } from '../../../../lib/offline';
import { useIsOnline } from '../../../../contexts/NetworkStatusContext';
import { isOptimisticHabitId } from '../optimisticHabitCreationStore';
import { showGenericError } from '../../../../utils/errorAlerts';
import type { Habit } from '../../types';

jest.mock('../../../../lib/optimistic', () => ({
  optimisticStore: {
    addReorder: jest.fn(() => 'auto_op'),
    addReorderWithId: jest.fn(),
    confirm: jest.fn(),
    fail: jest.fn(),
  },
}));
jest.mock('../../../../lib/offline', () => ({
  getOfflineQueueManager: jest.fn(),
  isNetworkError: jest.fn(() => false),
}));
jest.mock('../../../../contexts/NetworkStatusContext', () => ({
  useIsOnline: jest.fn(() => true),
}));
jest.mock('../optimisticHabitCreationStore', () => ({
  isOptimisticHabitId: jest.fn(() => false),
}));
jest.mock('../../../../utils/errorAlerts', () => ({
  showGenericError: jest.fn(),
}));

const mockEnqueue = jest.fn(() => ({ operationId: 'queue_1', success: true }));
const habit = (id: string): Habit => ({ _id: id }) as unknown as Habit;

function run(reorder: jest.Mock, data: Habit[]) {
  const habits = [habit('a'), habit('b')];
  const { result } = renderHook(() =>
    useOptimisticDragEnd('manual', habits, reorder)
  );
  return act(async () => {
    await result.current({ data });
  });
}

describe('useOptimisticDragEnd', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getOfflineQueueManager as jest.Mock).mockReturnValue({
      enqueue: mockEnqueue,
    });
    (useIsOnline as jest.Mock).mockReturnValue(true);
    (isNetworkError as jest.Mock).mockReturnValue(false);
    (isOptimisticHabitId as jest.Mock).mockReturnValue(false);
  });

  it('queues the reorder and skips the mutation when offline', async () => {
    (useIsOnline as jest.Mock).mockReturnValue(false);
    const reorder = jest.fn();

    await run(reorder, [habit('b'), habit('a')]);

    expect(mockEnqueue).toHaveBeenCalledWith('reorderHabits', {
      habitIds: ['b', 'a'],
      previousOrder: ['a', 'b'],
    });
    expect(optimisticStore.addReorderWithId).toHaveBeenCalledWith('queue_1', {
      habitIds: ['b', 'a'],
      previousOrder: ['a', 'b'],
    });
    expect(reorder).not.toHaveBeenCalled();
    expect(showGenericError).not.toHaveBeenCalled();
  });

  it('filters optimistic temp IDs out of the queued order', async () => {
    (useIsOnline as jest.Mock).mockReturnValue(false);
    (isOptimisticHabitId as jest.Mock).mockImplementation((id) => id === 'b');

    await run(jest.fn(), [habit('b'), habit('a')]);

    expect(mockEnqueue).toHaveBeenCalledWith('reorderHabits', {
      habitIds: ['a'],
      previousOrder: ['a', 'b'],
    });
  });

  it('queues on a network error and shows no alert', async () => {
    (isNetworkError as jest.Mock).mockReturnValue(true);
    const reorder = jest.fn().mockRejectedValue(new Error('offline'));

    await run(reorder, [habit('b'), habit('a')]);

    expect(optimisticStore.fail).toHaveBeenCalled();
    expect(mockEnqueue).toHaveBeenCalledWith('reorderHabits', {
      habitIds: ['b', 'a'],
      previousOrder: ['a', 'b'],
    });
    expect(showGenericError).not.toHaveBeenCalled();
  });

  it('fails and alerts on a non-network error', async () => {
    (isNetworkError as jest.Mock).mockReturnValue(false);
    const reorder = jest.fn().mockRejectedValue(new Error('server'));

    await run(reorder, [habit('b'), habit('a')]);

    expect(optimisticStore.fail).toHaveBeenCalled();
    expect(mockEnqueue).not.toHaveBeenCalled();
    expect(showGenericError).toHaveBeenCalled();
  });

  it('confirms the optimistic op when the online mutation succeeds', async () => {
    const reorder = jest.fn().mockResolvedValue(null);

    await run(reorder, [habit('b'), habit('a')]);

    expect(reorder).toHaveBeenCalledWith({ habitIds: ['b', 'a'] });
    expect(optimisticStore.confirm).toHaveBeenCalledWith('auto_op');
  });
});
