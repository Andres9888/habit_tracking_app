import type { Id } from '../../../../convex/_generated/dataModel';
import type { OptimisticOperation, OptimisticStore } from '../types';

export interface SerializedOptimisticStore {
  version: number;
  operations: [string, OptimisticOperation][];
  pendingToggles: [string, boolean][];
  pendingArchives: [string, boolean][];
  pendingReorder: Id<'habits'>[] | null;
  pendingPauses: [string, boolean][];
  savedAt: number;
}

export function isValidSerializedStore(
  value: unknown
): value is SerializedOptimisticStore {
  if (!value || typeof value !== 'object') return false;
  const store = value as Record<string, unknown>;
  return (
    typeof store.version === 'number' &&
    Array.isArray(store.operations) &&
    Array.isArray(store.pendingToggles) &&
    Array.isArray(store.pendingArchives) &&
    (store.pendingReorder === null || Array.isArray(store.pendingReorder)) &&
    Array.isArray(store.pendingPauses) &&
    typeof store.savedAt === 'number'
  );
}

export function deserializeStore(
  serialized: SerializedOptimisticStore
): OptimisticStore {
  return {
    operations: new Map(serialized.operations),
    pendingArchives: new Map(serialized.pendingArchives),
    pendingPauses: new Map(serialized.pendingPauses),
    pendingReorder: serialized.pendingReorder,
    pendingToggles: new Map(serialized.pendingToggles),
  };
}

export function migrateSerializedStore(
  store: SerializedOptimisticStore,
  version: number
): SerializedOptimisticStore {
  return { ...store, version };
}
