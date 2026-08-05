import { optimisticStore } from '../../../optimistic/store';
import { optimisticHabitCreationStore } from '../../../../features/habits/hooks/optimisticHabitCreationStore';
import type { OfflineOperation } from '../../queue';
import {
  rehydrateOptimisticFromQueue,
  syncOptimisticFromQueueEvent,
} from '../rehydrateOptimisticFromQueue';

const habitId = 'habit_1' as never;

describe('rehydrateOptimisticFromQueue', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    optimisticStore.reset();
    optimisticHabitCreationStore.reset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('restores pending toggle overlays with the queue operation ID', () => {
    const operation: OfflineOperation<'toggleCompletion'> = {
      createdAt: Date.now(),
      id: 'queue_op_1',
      payload: { date: '2026-07-01', habitId, toCompleted: true },
      retryCount: 0,
      status: 'pending',
      type: 'toggleCompletion',
    };

    rehydrateOptimisticFromQueue([operation]);

    expect(optimisticStore.getPendingToggle(habitId, '2026-07-01')).toBe(true);
    optimisticStore.confirm('queue_op_1');
    jest.runOnlyPendingTimers();
    expect(
      optimisticStore.getPendingToggle(habitId, '2026-07-01')
    ).toBeUndefined();
  });

  it('does not re-add an existing restored queue operation', () => {
    const base = {
      createdAt: Date.now(),
      id: 'queue_op_1',
      retryCount: 0,
      status: 'pending' as const,
      type: 'toggleCompletion' as const,
    };

    rehydrateOptimisticFromQueue([
      {
        ...base,
        payload: { date: '2026-07-01', habitId, toCompleted: true },
      },
    ]);
    rehydrateOptimisticFromQueue([
      {
        ...base,
        payload: { date: '2026-07-01', habitId, toCompleted: false },
      },
    ]);

    expect(optimisticStore.getPendingToggle(habitId, '2026-07-01')).toBe(true);
    expect(optimisticStore.getPendingCount()).toBe(1);
  });

  it('restores pending create operations with the queued temp id', () => {
    const operation: OfflineOperation<'createHabit'> = {
      createdAt: 1234,
      id: 'queue_create_1',
      payload: {
        color: '#10B981',
        daysOfWeek: [1, 3, 5],
        frequency: 'weekly',
        icon: '💪',
        name: 'Lift',
        remindersEnabled: false,
        tempId: 'temp_habit_queued',
      },
      retryCount: 0,
      status: 'pending',
      type: 'createHabit',
    };

    rehydrateOptimisticFromQueue([operation]);

    expect(optimisticHabitCreationStore.getSnapshot()).toMatchObject([
      {
        _id: 'temp_habit_queued',
        daysOfWeek: [1, 3, 5],
        frequency: 'weekly',
        name: 'Lift',
      },
    ]);
  });

  it('uses queued display names for archive and pause overlays', () => {
    rehydrateOptimisticFromQueue([
      {
        createdAt: Date.now(),
        id: 'archive_1',
        payload: { habitId, habitName: 'Read' },
        retryCount: 0,
        status: 'pending',
        type: 'archiveHabit',
      },
      {
        createdAt: Date.now(),
        id: 'pause_1',
        payload: { habitId, habitName: 'Read' },
        retryCount: 0,
        status: 'pending',
        type: 'pauseHabit',
      },
    ]);

    const snapshot = optimisticStore.getSnapshot();
    expect(snapshot.operations.get('archive_1')?.payload).toMatchObject({
      habitName: 'Read',
    });
    expect(snapshot.operations.get('pause_1')?.payload).toMatchObject({
      habitName: 'Read',
    });
  });

  it('does not rollback optimistic state for transient failures', () => {
    optimisticStore.addToggleWithId('queue_op_1', {
      date: '2026-07-01',
      habitId,
      toCompleted: true,
    });

    syncOptimisticFromQueueEvent(
      {
        error: 'temporary',
        operationId: 'queue_op_1',
        timestamp: Date.now(),
        type: 'operation:failed',
      },
      {} as never
    );

    expect(optimisticStore.getPendingToggle(habitId, '2026-07-01')).toBe(true);
  });

  it('rolls back optimistic state for terminal failures', () => {
    optimisticStore.addToggleWithId('queue_op_1', {
      date: '2026-07-01',
      habitId,
      toCompleted: true,
    });

    syncOptimisticFromQueueEvent(
      {
        error: 'final',
        operationId: 'queue_op_1',
        timestamp: Date.now(),
        type: 'operation:failed-final',
      },
      {} as never
    );

    expect(
      optimisticStore.getPendingToggle(habitId, '2026-07-01')
    ).toBeUndefined();
  });

  it('does not notify when an operation update is already hydrated', () => {
    const operation: OfflineOperation<'toggleCompletion'> = {
      createdAt: Date.now(),
      id: 'queue_op_1',
      payload: { date: '2026-07-01', habitId, toCompleted: true },
      retryCount: 0,
      status: 'pending',
      type: 'toggleCompletion',
    };
    rehydrateOptimisticFromQueue([operation]);
    const listener = jest.fn();
    const unsubscribe = optimisticStore.subscribe(listener);

    syncOptimisticFromQueueEvent(
      {
        operation,
        operationId: operation.id,
        timestamp: Date.now(),
        type: 'operation:updated',
      },
      {} as never
    );

    expect(listener).not.toHaveBeenCalled();
    unsubscribe();
  });

  it('restores a pending reorder overlay from the queue', () => {
    const operation: OfflineOperation<'reorderHabits'> = {
      createdAt: Date.now(),
      id: 'queue_reorder_1',
      payload: {
        habitIds: ['b', 'a', 'c'] as never,
        previousOrder: ['a', 'b', 'c'] as never,
      },
      retryCount: 0,
      status: 'pending',
      type: 'reorderHabits',
    };

    rehydrateOptimisticFromQueue([operation]);

    expect(optimisticStore.getPendingReorder()).toEqual(['b', 'a', 'c']);
    optimisticStore.confirm('queue_reorder_1');
    jest.runOnlyPendingTimers();
    expect(optimisticStore.getPendingReorder()).toBeNull();
  });

  it('cancels pending optimistic timers on reset', () => {
    const operationId = optimisticStore.addToggle({
      date: '2026-07-01',
      habitId,
      toCompleted: true,
    });
    optimisticStore.confirm(operationId);
    const listener = jest.fn();
    const unsubscribe = optimisticStore.subscribe(listener);

    optimisticStore.reset();
    listener.mockClear();
    jest.runOnlyPendingTimers();

    expect(listener).not.toHaveBeenCalled();
    unsubscribe();
  });
});
