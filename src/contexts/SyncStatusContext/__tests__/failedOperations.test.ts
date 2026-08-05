import {
  resetFailedOperations,
  discardFailedOperations,
} from '../failedOperations';
import { getOfflineQueueManager } from '../../../lib/offline/queueManager';
import { optimisticHabitCreationStore } from '../../../features/habits/hooks/optimisticHabitCreationStore';

jest.mock('../../../lib/offline/queueManager', () => ({
  getOfflineQueueManager: jest.fn(),
}));
jest.mock('../../../features/habits/hooks/optimisticHabitCreationStore', () => ({
  optimisticHabitCreationStore: { fail: jest.fn() },
}));

const resetForRetry = jest.fn();
const removeBatch = jest.fn();

function mockQueue(operations: Array<{ id: string; type: string; status: string }>) {
  (getOfflineQueueManager as jest.Mock).mockReturnValue({
    getState: () => ({ operations }),
    resetForRetry,
    removeBatch,
  });
}

describe('failedOperations', () => {
  beforeEach(() => jest.clearAllMocks());

  it('resetForRetry each failed op, ignoring pending ones', () => {
    mockQueue([
      { id: 'a', type: 'toggleCompletion', status: 'failed' },
      { id: 'b', type: 'toggleCompletion', status: 'pending' },
      { id: 'c', type: 'reorderHabits', status: 'failed' },
    ]);

    const count = resetFailedOperations();

    expect(count).toBe(2);
    expect(resetForRetry).toHaveBeenCalledWith('a');
    expect(resetForRetry).toHaveBeenCalledWith('c');
    expect(resetForRetry).not.toHaveBeenCalledWith('b');
  });

  it('rolls back failed createHabit ghosts before removing the batch', () => {
    mockQueue([
      { id: 'a', type: 'createHabit', status: 'failed' },
      { id: 'b', type: 'toggleCompletion', status: 'failed' },
    ]);

    const count = discardFailedOperations();

    expect(count).toBe(2);
    expect(optimisticHabitCreationStore.fail).toHaveBeenCalledWith('a');
    expect(optimisticHabitCreationStore.fail).not.toHaveBeenCalledWith('b');
    expect(removeBatch).toHaveBeenCalledWith(['a', 'b']);
  });
});
