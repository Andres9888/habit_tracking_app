/**
 * Optimistic Store Persistence
 *
 * Persists the optimistic store state to AsyncStorage for durability
 * across app restarts and device reboots. This enables offline-first
 * functionality where pending operations survive app lifecycle events.
 *
 * Implements:
 * - FR-003: Persist offline queue across app restarts and device reboots
 * - NFR-001: Queue persistence survives app termination and device restart
 * - SC-003: Zero data loss through restarts, reboots, and updates
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Id } from '../../../../convex/_generated/dataModel';
import type { OptimisticOperation, OptimisticStore } from '../types';
import { buildScopedStorageKey } from '../../../utils/storage/scopedStorageKey';

/** Storage key for the optimistic store state */
export const OPTIMISTIC_STORE_STORAGE_KEY = '@chainday:optimistic_store_v1';

/** Current schema version for migration support */
export const OPTIMISTIC_STORE_VERSION = 1;

let optimisticStoreScope: string | null = null;

function getOptimisticStoreStorageKey(
  scope: string | null = optimisticStoreScope
): string {
  return buildScopedStorageKey(OPTIMISTIC_STORE_STORAGE_KEY, scope);
}

export function setOptimisticStoreScope(scope: string | null): void {
  optimisticStoreScope = scope;
}

/**
 * Serializable representation of the optimistic store
 *
 * Maps cannot be directly JSON-serialized, so we convert them
 * to arrays of [key, value] entries for persistence.
 */
export interface SerializedOptimisticStore {
  version: number;
  operations: [string, OptimisticOperation][];
  pendingToggles: [string, boolean][];
  pendingArchives: [string, boolean][];
  pendingReorder: Id<'habits'>[] | null;
  pendingPauses: [string, boolean][];
  savedAt: number;
}

/**
 * Save the optimistic store state to AsyncStorage
 *
 * @param store - The optimistic store state to persist
 * @throws Error if storage operation fails (caller should handle)
 */
export async function saveOptimisticStore(
  store: OptimisticStore,
  scope?: string | null
): Promise<void> {
  const serialized: SerializedOptimisticStore = {
    operations: [...store.operations.entries()],
    pendingArchives: [...store.pendingArchives.entries()],
    pendingPauses: [...store.pendingPauses.entries()],
    pendingReorder: store.pendingReorder,
    pendingToggles: [...store.pendingToggles.entries()],
    savedAt: Date.now(),
    version: OPTIMISTIC_STORE_VERSION,
  };

  await AsyncStorage.setItem(
    getOptimisticStoreStorageKey(scope),
    JSON.stringify(serialized)
  );
}

/**
 * Load the optimistic store state from AsyncStorage
 *
 * Returns null if no persisted state exists or if the stored
 * state is corrupted. The caller should use the default store
 * state in this case.
 *
 * @returns The persisted store state or null
 */
export async function loadOptimisticStore(
  scope?: string | null
): Promise<OptimisticStore | null> {
  try {
    const raw = await AsyncStorage.getItem(getOptimisticStoreStorageKey(scope));

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as unknown;

    if (!isValidSerializedStore(parsed)) {
      if (__DEV__)
        console.warn(
          '[optimistic/persistence] Invalid store state in storage, discarding'
        );
      return null;
    }

    // Handle version migrations if needed
    const migrated =
      parsed.version === OPTIMISTIC_STORE_VERSION
        ? parsed
        : migrateSerializedStore(parsed);

    return deserializeStore(migrated);
  } catch (error) {
    if (__DEV__)
      console.warn(
        '[optimistic/persistence] Failed to load store state:',
        error
      );
    return null;
  }
}

/**
 * Clear the optimistic store from storage
 */
export async function clearOptimisticStore(): Promise<void> {
  await AsyncStorage.removeItem(getOptimisticStoreStorageKey());
}

export async function clearOptimisticStoreForScope(
  scope?: string | null
): Promise<void> {
  await AsyncStorage.removeItem(getOptimisticStoreStorageKey(scope));
}

export async function clearLegacyOptimisticStore(): Promise<void> {
  await AsyncStorage.removeItem(OPTIMISTIC_STORE_STORAGE_KEY);
}

/**
 * Type guard to validate serialized store structure
 */
function isValidSerializedStore(
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

/**
 * Deserialize the stored format back into OptimisticStore
 */
function deserializeStore(
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

/**
 * Migrate serialized store from older versions
 * Currently just returns the store as-is since we're at v1
 */
function migrateSerializedStore(
  store: SerializedOptimisticStore
): SerializedOptimisticStore {
  // Future migrations would be handled here
  // For now, just update the version and return
  return {
    ...store,
    version: OPTIMISTIC_STORE_VERSION,
  };
}
