import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit } from '../types';
import {
  MATCH_LOOKBACK_MS,
  OPTIMISTIC_HABIT_ID_PREFIX,
  type OptimisticHabitCreateInput,
  type PendingCreatedHabitRecord,
} from './optimisticHabitCreationStore.types';

function normalizeValue(value?: string | null) {
  return (value ?? '').trim().toLowerCase();
}

function normalizeDays(daysOfWeek?: number[]) {
  if (!Array.isArray(daysOfWeek) || daysOfWeek.length === 0) return '';
  return [...daysOfWeek].sort((a, b) => a - b).join(',');
}

export function buildMatchKey(input: OptimisticHabitCreateInput) {
  return [
    normalizeValue(input.name),
    normalizeValue(input.icon),
    normalizeValue(input.color),
    normalizeValue(input.iconColor ?? input.color),
    normalizeValue(input.frequency),
    normalizeDays(input.daysOfWeek),
    String(input.effortMinutes ?? ''),
    normalizeValue(input.preferredTime),
    input.remindersEnabled ? '1' : '0',
    normalizeValue(input.reminderTime),
    normalizeValue(input.reminderSound),
  ].join('|');
}

function buildMatchKeyFromHabit(habit: Habit) {
  return buildMatchKey({
    color: habit.color ?? habit.iconColor ?? '',
    daysOfWeek: habit.daysOfWeek,
    effortMinutes: habit.effortMinutes,
    frequency: habit.frequency,
    icon: habit.icon,
    iconColor: habit.iconColor,
    name: habit.name,
    preferredTime: habit.preferredTime,
    reminderSound: habit.reminderSound,
    reminderTime: habit.reminderTime,
    remindersEnabled: habit.remindersEnabled ?? false,
  });
}

export function createOptimisticHabit(
  input: OptimisticHabitCreateInput,
  submittedAt: number
) {
  const fallbackId = `${OPTIMISTIC_HABIT_ID_PREFIX}${submittedAt}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
  return {
    _creationTime: submittedAt,
    _id: (input.tempId ?? fallbackId) as Id<'habits'>,
    bestStreak: 0,
    color: input.color,
    createdAt: submittedAt,
    currentStreak: 0,
    daysOfWeek: input.daysOfWeek,
    effortMinutes: input.effortMinutes,
    frequency: input.frequency,
    icon: input.icon,
    iconColor: input.iconColor ?? input.color,
    name: input.name,
    notes: '',
    preferredTime: input.preferredTime,
    remindersEnabled: input.remindersEnabled,
    reminderSound: input.reminderSound,
    reminderTime: input.reminderTime,
    strength: 0,
    strengthLevel: 'starting',
    strengthUpdatedAt: submittedAt,
  } as Habit;
}

export function hasServerMatch(
  record: PendingCreatedHabitRecord,
  serverHabits: Habit[]
) {
  return serverHabits.some((habit) => {
    const createdAt = habit.createdAt ?? habit._creationTime;
    return (
      createdAt >= record.submittedAt - MATCH_LOOKBACK_MS &&
      buildMatchKeyFromHabit(habit) === record.matchKey
    );
  });
}
