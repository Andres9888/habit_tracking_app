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

import type { OptimisticStore } from '../types';
import { buildScopedStorageKey } from '../../../utils/storage/scopedStorageKey';
import {
  deserializeStore,
  isValidSerializedStore,
  migrateSerializedStore,
  type SerializedOptimisticStore,
} from './persistenceSerialization';
export type { SerializedOptimisticStore } from './persistenceSerialization';

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
        : migrateSerializedStore(parsed, OPTIMISTIC_STORE_VERSION);

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
