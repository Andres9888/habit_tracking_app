import { toggleCompletion } from '../createSyncExecutorHandlers';
import type { ToggleCompletionOperation } from '../../queue';

describe('toggleCompletion sync handler', () => {
  it('sets the queued desired state instead of blindly flipping', async () => {
    const toggleHabit = jest.fn().mockResolvedValue(null);
    const operation = {
      payload: {
        date: '2026-01-15',
        habitId: 'habit_1',
        toCompleted: true,
      },
    } as unknown as ToggleCompletionOperation;

    await toggleCompletion(operation, { toggleHabit } as never);

    expect(toggleHabit).toHaveBeenCalledWith({
      completed: true,
      date: '2026-01-15',
      habitId: 'habit_1',
    });
  });
});
