import type { Habit } from '../types';
import {
  optimisticHabitCreationStore,
  OPTIMISTIC_HABIT_ID_PREFIX,
} from '../hooks/optimisticHabitCreationStore';

describe('optimisticHabitCreationStore', () => {
  beforeEach(() => {
    optimisticHabitCreationStore.reset();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-05T10:00:00.000Z'));
  });

  afterEach(() => {
    optimisticHabitCreationStore.reset();
    jest.useRealTimers();
  });

  it('adds a temporary habit immediately', () => {
    optimisticHabitCreationStore.add({
      color: '#A58B6F',
      icon: '🌞',
      iconColor: '#A58B6F',
      name: 'Morning walk',
      remindersEnabled: false,
    });

    expect(optimisticHabitCreationStore.getSnapshot()).toEqual([
      expect.objectContaining({
        _id: expect.stringContaining(OPTIMISTIC_HABIT_ID_PREFIX),
        color: '#A58B6F',
        icon: '🌞',
        name: 'Morning walk',
      }),
    ]);
  });

  it('clears a confirmed temporary habit once the server habit arrives', () => {
    const operationId = optimisticHabitCreationStore.add({
      color: '#A58B6F',
      icon: '🌞',
      iconColor: '#A58B6F',
      name: 'Morning walk',
      remindersEnabled: false,
    });

    optimisticHabitCreationStore.confirm(operationId);

    const serverHabit = {
      _creationTime: Date.now(),
      _id: 'habit_server_1',
      color: '#A58B6F',
      createdAt: Date.now(),
      icon: '🌞',
      iconColor: '#A58B6F',
      name: 'Morning walk',
      remindersEnabled: false,
    } as Habit;

    optimisticHabitCreationStore.reconcile([serverHabit]);

    expect(optimisticHabitCreationStore.getSnapshot()).toEqual([]);
  });

  it('removes a temporary habit after a failed create', () => {
    const operationId = optimisticHabitCreationStore.add({
      color: '#A58B6F',
      iconColor: '#A58B6F',
      name: 'Morning walk',
      remindersEnabled: true,
      reminderTime: '07:00',
    });

    optimisticHabitCreationStore.fail(operationId);

    expect(optimisticHabitCreationStore.getSnapshot()).toEqual([]);
  });
});
