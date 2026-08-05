/**
 * Optimistic Habit Update Store
 *
 * Mirrors edits made while offline (or in-flight) onto the rendered habit
 * list so a queued `updateHabit` is visible before it syncs. Keyed by the
 * queue operation id; the snapshot merges every pending patch per habit.
 *
 * @see docs/offline-habit-sync.md
 */

import { useSyncExternalStore } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';

export type HabitUpdatePatch = Record<string, unknown>;

interface PendingUpdateRecord {
  habitId: Id<'habits'>;
  updates: HabitUpdatePatch;
}

const state = new Map<string, PendingUpdateRecord>();
const listeners = new Set<() => void>();
let snapshot = new Map<Id<'habits'>, HabitUpdatePatch>();

function rebuild() {
  const next = new Map<Id<'habits'>, HabitUpdatePatch>();
  for (const { habitId, updates } of state.values()) {
    next.set(habitId, { ...next.get(habitId), ...updates });
  }
  snapshot = next;
  for (const listener of listeners) listener();
}

function set(operationId: string, record: PendingUpdateRecord) {
  state.set(operationId, record);
  rebuild();
}

export const optimisticHabitUpdateStore = {
  add(habitId: Id<'habits'>, updates: HabitUpdatePatch) {
    const operationId = `optimistic_update_${habitId}_${Math.random()
      .toString(36)
      .slice(2, 10)}`;
    set(operationId, { habitId, updates });
    return operationId;
  },
  addWithId(operationId: string, habitId: Id<'habits'>, updates: HabitUpdatePatch) {
    if (state.has(operationId)) return operationId;
    set(operationId, { habitId, updates });
    return operationId;
  },
  confirm(operationId: string) {
    if (state.delete(operationId)) rebuild();
  },
  fail(operationId: string) {
    if (state.delete(operationId)) rebuild();
  },
  reset() {
    if (state.size === 0) return;
    state.clear();
    rebuild();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return snapshot;
  },
};

export function usePendingHabitUpdates() {
  return useSyncExternalStore(
    (listener) => optimisticHabitUpdateStore.subscribe(listener),
    () => optimisticHabitUpdateStore.getSnapshot(),
    () => optimisticHabitUpdateStore.getSnapshot()
  );
}
