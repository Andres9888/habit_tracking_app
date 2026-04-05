import { useSyncExternalStore } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit } from '../types';

const CONFIRMED_PENDING_TTL_MS = 4000;
const MATCH_LOOKBACK_MS = 15000;
export const OPTIMISTIC_HABIT_ID_PREFIX = 'temp_habit_';

interface OptimisticHabitCreateInput {
  color: string;
  daysOfWeek?: number[];
  frequency?: string;
  icon?: string;
  iconColor?: string;
  name: string;
  preferredTime?: string;
  reminderSound?: string;
  reminderTime?: string;
  remindersEnabled: boolean;
}

interface PendingCreatedHabitRecord {
  confirmedAt: number | null;
  matchKey: string;
  submittedAt: number;
  tempHabit: Habit;
}

type PendingCreatedHabitSnapshot = Habit[];
type StoreListener = () => void;

const state = new Map<string, PendingCreatedHabitRecord>();
const listeners = new Set<StoreListener>();
let snapshot: PendingCreatedHabitSnapshot = [];

function notify() {
  snapshot = Array.from(state.values(), (record) => record.tempHabit);
  for (const listener of listeners) {
    listener();
  }
}

function normalizeValue(value?: string | null) {
  return (value ?? '').trim().toLowerCase();
}

function normalizeDays(daysOfWeek?: number[]) {
  if (!Array.isArray(daysOfWeek) || daysOfWeek.length === 0) {
    return '';
  }

  return [...daysOfWeek].sort((a, b) => a - b).join(',');
}

function buildMatchKey(input: OptimisticHabitCreateInput) {
  return [
    normalizeValue(input.name),
    normalizeValue(input.icon),
    normalizeValue(input.color),
    normalizeValue(input.iconColor ?? input.color),
    normalizeValue(input.frequency),
    normalizeDays(input.daysOfWeek),
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

function createOptimisticHabit(
  input: OptimisticHabitCreateInput,
  submittedAt: number
) {
  return {
    _creationTime: submittedAt,
    _id: `${OPTIMISTIC_HABIT_ID_PREFIX}${submittedAt}_${Math.random()
      .toString(36)
      .slice(2, 10)}` as Id<'habits'>,
    bestStreak: 0,
    color: input.color,
    createdAt: submittedAt,
    currentStreak: 0,
    daysOfWeek: input.daysOfWeek,
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

function hasServerMatch(record: PendingCreatedHabitRecord, serverHabits: Habit[]) {
  return serverHabits.some((habit) => {
    const createdAt = habit.createdAt ?? habit._creationTime;
    return (
      createdAt >= record.submittedAt - MATCH_LOOKBACK_MS &&
      buildMatchKeyFromHabit(habit) === record.matchKey
    );
  });
}

export function isOptimisticHabitId(habitId: string) {
  return habitId.startsWith(OPTIMISTIC_HABIT_ID_PREFIX);
}

export const optimisticHabitCreationStore = {
  add(input: OptimisticHabitCreateInput) {
    const submittedAt = Date.now();
    const operationId = `optimistic_create_${submittedAt}_${Math.random()
      .toString(36)
      .slice(2, 10)}`;

    state.set(operationId, {
      confirmedAt: null,
      matchKey: buildMatchKey(input),
      submittedAt,
      tempHabit: createOptimisticHabit(input, submittedAt),
    });
    notify();

    return operationId;
  },

  confirm(operationId: string) {
    const record = state.get(operationId);
    if (!record) return;

    state.set(operationId, {
      ...record,
      confirmedAt: Date.now(),
    });
    notify();
  },

  fail(operationId: string) {
    if (!state.delete(operationId)) return;
    notify();
  },

  reconcile(serverHabits: Habit[]) {
    const now = Date.now();
    let hasChanges = false;

    for (const [operationId, record] of state) {
      const isResolved = hasServerMatch(record, serverHabits);
      const isStaleConfirmed =
        record.confirmedAt !== null &&
        now - record.confirmedAt >= CONFIRMED_PENDING_TTL_MS;

      if (!isResolved && !isStaleConfirmed) {
        continue;
      }

      state.delete(operationId);
      hasChanges = true;
    }

    if (hasChanges) {
      notify();
    }
  },

  reset() {
    if (state.size === 0) return;
    state.clear();
    notify();
  },

  subscribe(listener: StoreListener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSnapshot() {
    return snapshot;
  },
};

export function usePendingCreatedHabits() {
  return useSyncExternalStore(
    optimisticHabitCreationStore.subscribe,
    optimisticHabitCreationStore.getSnapshot,
    optimisticHabitCreationStore.getSnapshot
  );
}
