/**
 * Builds the `updates` patch shared by the online updateHabit mutation and the
 * offline updateHabit queue payload (see useCreateHabitHandlers.handleEdit).
 */

import type { UpdateHabitPayload } from '../../../lib/offline/queue';
import type { ProgressEmojiSet } from '../../../utils/progressEmojis';

export interface EditUpdatesInput {
  sanitizedName: string;
  selectedEmoji: string | null;
  selectedColor: string;
  frequency: string;
  selectedDays: number[];
  streakGoal: number;
  dayPhase: string | null;
  finalHasReminders: boolean;
  reminderSound?: string | null;
  formattedReminderTime?: string;
  strengthAlgorithm: 'forgiving' | 'balanced' | 'strict';
  progressEmojis?: ProgressEmojiSet;
  notes: string;
}

export function buildEditUpdates(
  input: EditUpdatesInput
): UpdateHabitPayload['updates'] {
  return {
    color: input.selectedColor,
    daysOfWeek: input.selectedDays.length < 7 ? input.selectedDays : undefined,
    frequency: input.frequency || undefined,
    goalDuration: input.streakGoal > 0 ? input.streakGoal : undefined,
    icon: input.selectedEmoji ?? undefined,
    iconColor: input.selectedColor,
    name: input.sanitizedName,
    notes: input.notes,
    preferredTime: input.dayPhase ?? undefined,
    progressEmojis: input.progressEmojis,
    reminderSound: input.finalHasReminders
      ? (input.reminderSound ?? undefined)
      : undefined,
    reminderTime: input.finalHasReminders
      ? input.formattedReminderTime
      : undefined,
    remindersEnabled: input.finalHasReminders,
    strengthAlgorithm: input.strengthAlgorithm,
  };
}
