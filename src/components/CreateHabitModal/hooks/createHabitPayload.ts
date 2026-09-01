import type { ProgressEmojiSet } from '../../../utils/progressEmojis';
import type { CreateHabitPayload } from '../../../lib/offline/queue';
import type { OptimisticHabitCreateInput } from '../../../features/habits/hooks/optimisticHabitCreationStore.types';
import { formatReminderTime24 } from '../../../utils/notifications';
import type { CreateHabitData } from './useCreateHabitHandlers.types';

export function buildCreateHabitPayload(
  data: CreateHabitData,
  name: string,
  userDefaultEmojis: ProgressEmojiSet | undefined
): CreateHabitPayload {
  const reminderTime = data.hasReminders
    ? formatReminderTime24(data.reminderTime)
    : undefined;
  return {
    color: data.selectedColor,
    daysOfWeek: data.selectedDays.length < 7 ? data.selectedDays : undefined,
    frequency: data.frequency || undefined,
    goalDuration: data.streakGoal > 0 ? data.streakGoal : undefined,
    icon: data.selectedEmoji ?? undefined,
    iconColor: data.selectedColor,
    name,
    notes: '',
    preferredTime: data.dayPhase ?? undefined,
    progressEmojis: data.progressEmojis ?? userDefaultEmojis,
    reminderSound: data.hasReminders
      ? (data.reminderSound ?? undefined)
      : undefined,
    reminderTime,
    remindersEnabled: data.hasReminders,
    strengthAlgorithm: data.strengthAlgorithm,
    tempId: data.clientRequestId,
  };
}

export function toOptimisticCreateInput(
  payload: CreateHabitPayload
): OptimisticHabitCreateInput {
  return {
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
  };
}

export function toCreateHabitArgs(payload: CreateHabitPayload) {
  return {
    clientRequestId: payload.tempId,
    color: payload.color,
    daysOfWeek: payload.daysOfWeek,
    frequency: payload.frequency,
    goalDuration: payload.goalDuration,
    icon: payload.icon,
    iconColor: payload.iconColor,
    name: payload.name,
    notes: payload.notes,
    preferredTime: payload.preferredTime,
    progressEmojis: payload.progressEmojis,
    reminderSound: payload.reminderSound,
    reminderTime: payload.reminderTime,
    remindersEnabled: payload.remindersEnabled,
    strengthAlgorithm: payload.strengthAlgorithm,
  };
}
