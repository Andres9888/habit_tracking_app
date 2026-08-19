import type { Doc } from '../_generated/dataModel';

/** Fields the home list and archived list actually render. */
export function projectHabitForList(habit: Doc<'habits'>) {
  return {
    _creationTime: habit._creationTime,
    _id: habit._id,
    archived: habit.archived,
    archivedAt: habit.archivedAt,
    bestStreak: habit.bestStreak,
    color: habit.color,
    createdAt: habit.createdAt,
    currentStreak: habit.currentStreak,
    daysOfWeek: habit.daysOfWeek,
    frequency: habit.frequency,
    goalDuration: habit.goalDuration,
    goalUnit: habit.goalUnit,
    growthType: habit.growthType,
    icon: habit.icon,
    iconColor: habit.iconColor,
    lastCompletedDate: habit.lastCompletedDate,
    name: habit.name,
    order: habit.order,
    paused: habit.paused,
    pausedAt: habit.pausedAt,
    preferredTime: habit.preferredTime,
    progressEmojis: habit.progressEmojis,
    remindersEnabled: habit.remindersEnabled,
    reminderSound: habit.reminderSound,
    reminderTime: habit.reminderTime,
    resumedAt: habit.resumedAt,
    strength: habit.strength,
    strengthAlgorithm: habit.strengthAlgorithm,
    strengthLevel: habit.strengthLevel,
    strengthUpdatedAt: habit.strengthUpdatedAt,
    totalCompletions: habit.totalCompletions,
  };
}
