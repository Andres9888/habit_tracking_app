import { act, renderHook } from '@testing-library/react-native';
import {
  getOfflineQueueManager,
  resetOfflineQueueManager,
} from '../../../../lib/offline/queueManager';
import { optimisticHabitCreationStore } from '../../../../features/habits/hooks/optimisticHabitCreationStore';
import { useCreateHabitHandler } from '../useCreateHabitHandler';

const mockCreateHabit = jest.fn().mockResolvedValue('habit_server');
const mockMarkFirstHabitCreated = jest.fn().mockResolvedValue(undefined);
const mockScheduleReminder = jest.fn().mockResolvedValue(true);

jest.mock('convex/react', () => ({
  useMutation: () => mockCreateHabit,
}));
jest.mock('../../../../contexts/NetworkStatusContext', () => ({
  useIsOnline: () => false,
}));
jest.mock('../../../../hooks/useProgressEmojis', () => ({
  useUserDefaultProgressEmojis: () => undefined,
}));
jest.mock(
  '../../../../hooks/useStreakReminders/useStreakReminderSettings',
  () => ({ markFirstHabitCreated: () => mockMarkFirstHabitCreated() })
);
jest.mock('../useHabitReminders', () => ({
  scheduleReminder: (...args: unknown[]) => mockScheduleReminder(...args),
}));

describe('useCreateHabitHandler', () => {
  beforeEach(() => {
    mockCreateHabit.mockClear();
    mockMarkFirstHabitCreated.mockClear();
    mockScheduleReminder.mockClear();
    optimisticHabitCreationStore.reset();
    resetOfflineQueueManager();
  });

  it('queues a complete create payload and keeps its optimistic habit', async () => {
    const { result } = renderHook(() => useCreateHabitHandler());

    await act(async () => {
      await result.current({
        clientRequestId: 'temp_habit_123_request',
        dayPhase: 'morning',
        frequency: 'weekly',
        fullHabitName: 'Read',
        hasReminders: false,
        progressEmojis: undefined,
        reminderTime: new Date('2026-08-28T08:00:00'),
        selectedColor: '#10B981',
        selectedDays: [1, 3, 5],
        selectedEmoji: '📚',
        strengthAlgorithm: 'balanced',
        streakGoal: 7,
      });
    });

    expect(mockCreateHabit).not.toHaveBeenCalled();
    expect(getOfflineQueueManager().getState().operations[0]).toMatchObject({
      payload: {
        daysOfWeek: [1, 3, 5],
        goalDuration: 7,
        name: 'Read',
        tempId: 'temp_habit_123_request',
      },
      type: 'createHabit',
    });
    expect(optimisticHabitCreationStore.getSnapshot()).toMatchObject([
      { _id: 'temp_habit_123_request', name: 'Read' },
    ]);
    expect(mockMarkFirstHabitCreated).toHaveBeenCalledTimes(1);
    expect(mockScheduleReminder).not.toHaveBeenCalled();
  });
});
