import { createSyncExecutor } from '../createSyncExecutor';
import type { ConvexMutations } from '../createSyncExecutor.types';
import type { OfflineOperation } from '../../queue';

function buildMutations(): jest.Mocked<ConvexMutations> {
  return {
    archiveHabit: jest.fn().mockResolvedValue(null),
    createHabit: jest.fn().mockResolvedValue(null),
    pauseHabit: jest.fn().mockResolvedValue(null),
    removeHabit: jest.fn().mockResolvedValue(null),
    reorderHabits: jest.fn().mockResolvedValue(null),
    toggleHabit: jest.fn().mockResolvedValue(null),
    updateHabit: jest.fn().mockResolvedValue(null),
  };
}

describe('createSyncExecutor', () => {
  it('routes reorderHabits to the reorder mutation with habitIds only', async () => {
    const mutations = buildMutations();
    const executor = createSyncExecutor(mutations);
    const operation: OfflineOperation<'reorderHabits'> = {
      createdAt: Date.now(),
      id: 'op_1',
      payload: {
        habitIds: ['b', 'a'] as never,
        previousOrder: ['a', 'b'] as never,
      },
      retryCount: 0,
      status: 'pending',
      type: 'reorderHabits',
    };

    await executor(operation);

    expect(mutations.reorderHabits).toHaveBeenCalledWith({
      habitIds: ['b', 'a'],
    });
    expect(mutations.reorderHabits).toHaveBeenCalledTimes(1);
  });

  it('throws on an unknown operation type', async () => {
    const executor = createSyncExecutor(buildMutations());
    await expect(
      executor({ type: 'bogus' } as unknown as OfflineOperation)
    ).rejects.toThrow('Unknown operation type');
  });
});
