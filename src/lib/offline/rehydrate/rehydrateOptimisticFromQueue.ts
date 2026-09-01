/* eslint-disable max-lines -- Exhaustive rehydration mapping for every queue operation. */

import type { Id } from '../../../../convex/_generated/dataModel';
import { optimisticHabitCreationStore } from '../../../features/habits/hooks/optimisticHabitCreationStore';
import { optimisticStore } from '../../optimistic/store';
import type { OfflineOperation, QueueEvent } from '../queue';
import type { OfflineQueueManagerAPI } from '../queueManager';

function rehydrateOperation(operation: OfflineOperation): void {
  if (operation.status !== 'pending' && operation.status !== 'syncing') return;
  if (optimisticStore.getSnapshot().operations.has(operation.id)) return;
  switch (operation.type) {
    case 'toggleCompletion': {
      const payload = operation.payload as {
        date: string;
        habitId: Id<'habits'>;
        toCompleted: boolean;
      };
      optimisticStore.addToggleWithId(operation.id, payload);
      break;
    }
    case 'createHabit': {
      const payload = operation.payload as {
        color?: string;
        daysOfWeek?: number[];
        frequency?: string;
        icon?: string;
        iconColor?: string;
        name: string;
        preferredTime?: string;
        reminderSound?: string;
        reminderTime?: string;
        remindersEnabled?: boolean;
        tempId: string;
      };
      optimisticHabitCreationStore.addWithId(
        operation.id,
        {
          color: payload.color ?? payload.iconColor ?? '#10B981',
          daysOfWeek: payload.daysOfWeek,
          frequency: payload.frequency,
          icon: payload.icon,
          iconColor: payload.iconColor,
          name: payload.name,
          preferredTime: payload.preferredTime,
          reminderSound: payload.reminderSound,
          reminderTime: payload.reminderTime,
          remindersEnabled: payload.remindersEnabled ?? false,
          tempId: payload.tempId,
        },
        operation.createdAt
      );
      break;
    }
    case 'archiveHabit': {
      const payload = operation.payload as {
        habitId: Id<'habits'>;
        habitName?: string;
      };
      optimisticStore.addArchiveWithId(operation.id, {
        habitId: payload.habitId,
        habitName: payload.habitName ?? 'Habit',
        toArchived: true,
      });
      break;
    }
    case 'pauseHabit': {
      const payload = operation.payload as {
        habitId: Id<'habits'>;
        habitName?: string;
      };
      optimisticStore.addPauseWithId(operation.id, {
        habitId: payload.habitId,
        habitName: payload.habitName ?? 'Habit',
        toPaused: true,
      });
      break;
    }
    case 'removeHabit': {
      const payload = operation.payload as {
        habitId: Id<'habits'>;
        habitName?: string;
      };
      optimisticStore.addArchiveWithId(operation.id, {
        habitId: payload.habitId,
        habitName: payload.habitName ?? 'Habit',
        toArchived: true,
      });
      break;
    }
  }
}

export function rehydrateOptimisticFromQueue(
  operations: OfflineOperation[]
): void {
  for (const operation of operations) rehydrateOperation(operation);
}

export function syncOptimisticFromQueueEvent(
  event: QueueEvent,
  _manager: OfflineQueueManagerAPI
): void {
  if (event.operation && event.type === 'operation:updated') {
    rehydrateOperation(event.operation);
  } else if (event.operationId && event.type === 'operation:synced') {
    if (event.operation?.type === 'createHabit') {
      optimisticHabitCreationStore.confirm(event.operationId);
    } else {
      optimisticStore.confirm(event.operationId);
    }
  } else if (event.operationId && event.type === 'operation:failed-final') {
    if (event.operation?.type === 'createHabit') {
      optimisticHabitCreationStore.fail(event.operationId);
    } else {
      optimisticStore.fail(
        event.operationId,
        new Error(event.error ?? 'Sync failed')
      );
    }
  }
}
