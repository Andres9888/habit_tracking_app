/**
 * Payload builders shared by online and offline habit create/edit paths.
 * Keeps useCreateHabitHandlers focused on orchestration.
 */

import type { CreateHabitPayload } from '../../../lib/offline/queue';
import type { OptimisticHabitCreateInput } from '../../../features/habits/hooks/optimisticHabitCreationStore.types';
import { OPTIMISTIC_HABIT_ID_PREFIX } from '../../../features/habits/hooks/optimisticHabitCreationStore';
import type { ProgressEmojiSet } from '../../../utils/progressEmojis';

export function generateTempHabitId(): string {
  return `${OPTIMISTIC_HABIT_ID_PREFIX}${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export interface CreatePayloadInput {
  tempId: string;
  sanitizedName: string;
  selectedEmoji: string | null;
  selectedColor: string;
  frequency: string;
  selectedDays: number[];
  streakGoal: number;
  dayPhase: string | null;
  hasReminders: boolean;
  reminderSound?: string | null;
  formattedReminderTime?: string;
  strengthAlgorithm: 'forgiving' | 'balanced' | 'strict';
  progressEmojis: ProgressEmojiSet;
}

export function buildCreatePayload(input: CreatePayloadInput): CreateHabitPayload {
  return {
    color: input.selectedColor,
    daysOfWeek: input.selectedDays.length < 7 ? input.selectedDays : undefined,
    frequency: input.frequency || undefined,
    goalDuration: input.streakGoal > 0 ? input.streakGoal : undefined,
    icon: input.selectedEmoji ?? undefined,
    iconColor: input.selectedColor,
    name: input.sanitizedName,
    notes: '',
    preferredTime: input.dayPhase ?? undefined,
    progressEmojis: input.progressEmojis,
    reminderSound: input.hasReminders
      ? (input.reminderSound ?? undefined)
      : undefined,
    reminderTime: input.formattedReminderTime,
    remindersEnabled: input.hasReminders,
    strengthAlgorithm: input.strengthAlgorithm,
    tempId: input.tempId,
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

export function toCreateMutationArgs(payload: CreateHabitPayload) {
  const { tempId: _tempId, ...args } = payload;
  return args;
}
