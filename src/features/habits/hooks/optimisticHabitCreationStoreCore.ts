import {
  CONFIRMED_PENDING_TTL_MS,
  type OptimisticHabitCreateInput,
  type PendingCreatedHabitRecord,
  type PendingCreatedHabitSnapshot,
  type StoreListener,
} from './optimisticHabitCreationStore.types';
import {
  buildMatchKey,
  createOptimisticHabit,
  hasServerMatch,
} from './optimisticHabitCreationStoreHelpers';
import type { Habit } from '../types';

const state = new Map<string, PendingCreatedHabitRecord>();
const listeners = new Set<StoreListener>();
let snapshot: PendingCreatedHabitSnapshot = [];

function notify() {
  snapshot = Array.from(state.values(), (record) => record.tempHabit);
  for (const listener of listeners) listener();
}

function addPendingCreate(
  operationId: string,
  input: OptimisticHabitCreateInput,
  submittedAt: number
) {
  if (state.has(operationId)) return operationId;
  state.set(operationId, {
    confirmedAt: null,
    matchKey: buildMatchKey(input),
    submittedAt,
    tempHabit: createOptimisticHabit(input, submittedAt),
  });
  notify();
  return operationId;
}

export const optimisticHabitCreationStore = {
  add(input: OptimisticHabitCreateInput) {
    const submittedAt = Date.now();
    const operationId = `optimistic_create_${submittedAt}_${Math.random()
      .toString(36)
      .slice(2, 10)}`;
    return addPendingCreate(operationId, input, submittedAt);
  },
  addWithId(
    operationId: string,
    input: OptimisticHabitCreateInput,
    submittedAt = Date.now()
  ) {
    return addPendingCreate(operationId, input, submittedAt);
  },
  confirm(operationId: string) {
    const record = state.get(operationId);
    if (!record) return;
    state.set(operationId, { ...record, confirmedAt: Date.now() });
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
      const isStaleConfirmed =
        record.confirmedAt !== null &&
        now - record.confirmedAt >= CONFIRMED_PENDING_TTL_MS;
      if (!hasServerMatch(record, serverHabits) && !isStaleConfirmed) continue;
      state.delete(operationId);
      hasChanges = true;
    }
    if (hasChanges) notify();
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
