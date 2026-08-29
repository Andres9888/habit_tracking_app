import { createHabit, toggleCompletion } from '../createSyncExecutorHandlers';
import type {
  CreateHabitOperation,
  ToggleCompletionOperation,
} from '../../queue';

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

describe('createHabit sync handler', () => {
  it('uses the queued temp id as the server idempotency key', async () => {
    const createHabitMutation = jest.fn().mockResolvedValue('habit_1');
    const operation = {
      payload: {
        color: '#10B981',
        name: 'Read',
        tempId: 'temp_habit_123_request',
      },
    } as unknown as CreateHabitOperation;

    await createHabit(operation, { createHabit: createHabitMutation } as never);

    expect(createHabitMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        clientRequestId: 'temp_habit_123_request',
        color: '#10B981',
        name: 'Read',
      })
    );
  });
});
