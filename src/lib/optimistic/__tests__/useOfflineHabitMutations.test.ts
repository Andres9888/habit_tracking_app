import { act, renderHook } from '@testing-library/react-native';
import type { Id } from '../../../../convex/_generated/dataModel';
import {
  getOfflineQueueManager,
  resetOfflineQueueManager,
} from '../../offline';
import { optimisticStore } from '../store';
import {
  useOfflineArchiveHabit,
  useOfflinePauseHabit,
  useOfflineRemoveHabit,
} from '../hooks';

const mockServerMutation = jest.fn().mockResolvedValue(undefined);
jest.mock('convex/react', () => ({
  useMutation: () => mockServerMutation,
}));
jest.mock('../../../contexts/NetworkStatusContext', () => ({
  useIsOnline: () => false,
}));

const archiveId = 'habit_archive' as Id<'habits'>;
const pauseId = 'habit_pause' as Id<'habits'>;
const removeId = 'habit_remove' as Id<'habits'>;

describe('offline habit lifecycle mutations', () => {
  beforeEach(() => {
    mockServerMutation.mockClear();
    optimisticStore.reset();
    resetOfflineQueueManager();
  });

  it('queues archive, pause, and remove without touching Convex', async () => {
    const { result } = renderHook(() => ({
      archive: useOfflineArchiveHabit(),
      pause: useOfflinePauseHabit(),
      remove: useOfflineRemoveHabit(),
    }));

    await act(async () => {
      await result.current.archive({ habitId: archiveId, habitName: 'Read' });
      await result.current.pause({ habitId: pauseId, habitName: 'Walk' });
      await result.current.remove({ habitId: removeId, habitName: 'Old' });
    });

    expect(mockServerMutation).not.toHaveBeenCalled();
    expect(
      getOfflineQueueManager()
        .getState()
        .operations.map(({ type }) => type)
    ).toEqual(['archiveHabit', 'pauseHabit', 'removeHabit']);
    expect(optimisticStore.getPendingArchive(archiveId)).toBe(true);
    expect(optimisticStore.getPendingPause(pauseId)).toBe(true);
    expect(optimisticStore.getPendingArchive(removeId)).toBe(true);
  });
});
