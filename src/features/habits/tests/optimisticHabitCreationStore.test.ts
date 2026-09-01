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

  it('reconciles by client request ID even when mutable fields differ', () => {
    optimisticHabitCreationStore.addWithId(
      'operation_exact',
      {
        color: '#A58B6F',
        name: 'Original name',
        remindersEnabled: false,
        tempId: 'temp_habit_exact',
      },
      Date.now()
    );
    const serverHabit = {
      _creationTime: Date.now(),
      _id: 'habit_server_exact',
      clientRequestId: 'temp_habit_exact',
      color: '#000000',
      createdAt: Date.now(),
      name: 'Server-normalized name',
    } as Habit;

    const matches = optimisticHabitCreationStore.reconcile([serverHabit]);

    expect(matches).toEqual([
      expect.objectContaining({
        serverHabit,
        tempHabit: expect.objectContaining({ _id: 'temp_habit_exact' }),
      }),
    ]);
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
