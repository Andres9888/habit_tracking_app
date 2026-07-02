import type { UpdateHabitArgs } from './types';

export function buildUpdateHabitQueuePayload(args: UpdateHabitArgs) {
  return {
    habitId: args.habitId,
    updates: {
      name: args.name,
      icon: args.icon,
      color: args.color,
      iconColor: args.iconColor,
      notes: args.notes,
      preferredTime: args.preferredTime,
      remindersEnabled: args.remindersEnabled,
      reminderTime: args.reminderTime,
      reminderSound: args.reminderSound,
    },
  };
}
