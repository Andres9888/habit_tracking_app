import type { Id } from '../../../../convex/_generated/dataModel';
import { optimisticHabitCreationStore } from '../../../features/habits/hooks/optimisticHabitCreationStore';
import { optimisticHabitUpdateStore } from '../../../features/habits/hooks/optimisticHabitUpdateStore';
import { optimisticStore } from '../../optimistic/store';
import type { OfflineOperation } from '../queue';

function rehydrateCreate(operation: OfflineOperation): void {
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
}

// removeHabit reuses the archive pending-state slot to hide the habit.
function rehydrateHide(operation: OfflineOperation): void {
  const payload = operation.payload as {
    habitId: Id<'habits'>;
    habitName?: string;
    toArchived?: boolean;
  };
  optimisticStore.addArchiveWithId(operation.id, {
    habitId: payload.habitId,
    habitName: payload.habitName ?? 'Habit',
    toArchived: payload.toArchived ?? true,
  });
}

export function rehydrateOperation(operation: OfflineOperation): void {
  if (operation.status !== 'pending' && operation.status !== 'syncing') return;
  if (optimisticStore.getSnapshot().operations.has(operation.id)) return;
  switch (operation.type) {
    case 'toggleCompletion':
      optimisticStore.addToggleWithId(
        operation.id,
        operation.payload as {
          date: string;
          habitId: Id<'habits'>;
          toCompleted: boolean;
        }
      );
      break;
    case 'createHabit':
      rehydrateCreate(operation);
      break;
    case 'updateHabit': {
      const payload = operation.payload as {
        habitId: Id<'habits'>;
        updates: Record<string, unknown>;
      };
      optimisticHabitUpdateStore.addWithId(
        operation.id,
        payload.habitId,
        payload.updates
      );
      break;
    }
    case 'archiveHabit':
    case 'removeHabit':
      rehydrateHide(operation);
      break;
    case 'pauseHabit': {
      const payload = operation.payload as {
        habitId: Id<'habits'>;
        habitName?: string;
        toPaused?: boolean;
      };
      optimisticStore.addPauseWithId(operation.id, {
        habitId: payload.habitId,
        habitName: payload.habitName ?? 'Habit',
        toPaused: payload.toPaused ?? true,
      });
      break;
    }
  }
}
