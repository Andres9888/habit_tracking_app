import { getUserTimezone } from '../../../utils/timezone';
import type {
  ArchiveHabitOperation,
  CreateHabitOperation,
  PauseHabitOperation,
  RemoveHabitOperation,
  ToggleCompletionOperation,
  UpdateHabitOperation,
} from '../queue';
import type { ConvexMutations } from './createSyncExecutor.types';
import { normalizeReminderTime } from './normalizeReminderTime';

export async function toggleCompletion(
  operation: ToggleCompletionOperation,
  mutations: ConvexMutations
) {
  const { habitId, date, kind, toCompleted } = operation.payload;
  await mutations.toggleHabit({
    completed: toCompleted,
    date,
    habitId,
    ...(toCompleted && kind ? { kind } : {}),
  });
}

export async function createHabit(
  operation: CreateHabitOperation,
  mutations: ConvexMutations
) {
  const payload = operation.payload;
  await mutations.createHabit({
    name: payload.name,
    icon: payload.icon,
    color: payload.color,
    iconColor: payload.iconColor,
    daysOfWeek: payload.daysOfWeek,
    frequency: payload.frequency,
    goalDuration: payload.goalDuration,
    notes: payload.notes,
    preferredTime: payload.preferredTime,
    remindersEnabled: payload.remindersEnabled,
    reminderTime: normalizeReminderTime(payload.reminderTime),
    reminderSound: payload.reminderSound,
    strengthAlgorithm: payload.strengthAlgorithm,
  });
}

export async function updateHabit(
  operation: UpdateHabitOperation,
  mutations: ConvexMutations
) {
  const { habitId, updates } = operation.payload;
  const normalizedUpdates = { ...updates };
  if (Object.prototype.hasOwnProperty.call(normalizedUpdates, 'reminderTime')) {
    const normalizedReminderTime = normalizeReminderTime(
      normalizedUpdates.reminderTime
    );
    if (normalizedReminderTime) {
      normalizedUpdates.reminderTime = normalizedReminderTime;
    } else {
      delete normalizedUpdates.reminderTime;
    }
  }
  await mutations.updateHabit({ habitId, ...normalizedUpdates });
}

export async function archiveHabit(
  operation: ArchiveHabitOperation,
  mutations: ConvexMutations
) {
  await mutations.archiveHabit({ habitId: operation.payload.habitId });
}

export async function pauseHabit(
  operation: PauseHabitOperation,
  mutations: ConvexMutations
) {
  await mutations.pauseHabit({
    habitId: operation.payload.habitId,
    timezone: getUserTimezone(),
  });
}

export async function removeHabit(
  operation: RemoveHabitOperation,
  mutations: ConvexMutations
) {
  await mutations.removeHabit({ habitId: operation.payload.habitId });
}
