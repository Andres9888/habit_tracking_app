/**
 * Offline Queue Storage
 *
 * Persists the offline operation queue to AsyncStorage for durability
 * across app restarts and device reboots. See spec: docs/offline-habit-sync.md
 *
 * Implements:
 * - FR-003: Persist offline queue across app restarts and device reboots
 * - NFR-001: Queue persistence survives app termination and device restart
 * - SC-003: Zero data loss through restarts, reboots, and updates
 * - Edge Case: App crash during queue write - Transaction-safe to prevent corruption
 */

import { offlineStorage } from './offlineStorage';

import type { OfflineQueueState } from '../queue';
import { OFFLINE_QUEUE_VERSION } from '../queue';
import { buildScopedStorageKey } from '../../../utils/storage/scopedStorageKey';
import {
  createDefaultState,
  isValidQueueState,
  migrateQueueState,
} from './queueStorageHelpers';
import {
  cleanupTransaction,
  recoverTransaction,
  transactionSafeWrite,
} from './transactionWrite';

/** Storage key for the offline queue state */
export const OFFLINE_QUEUE_STORAGE_KEY = '@chainday:offline_queue_v1';

let queueStorageScope: string | null = null;

function getQueueStorageKey(scope: string | null = queueStorageScope): string {
  return buildScopedStorageKey(OFFLINE_QUEUE_STORAGE_KEY, scope);
}

export function setQueueStorageScope(scope: string | null): void {
  queueStorageScope = scope;
}

/**
 * Save the offline queue state to AsyncStorage with transaction safety
 *
 * Uses a two-phase commit to prevent data corruption:
 * 1. Write to pending key with checksum
 * 2. Write to main key
 * 3. Remove pending key (marks commit complete)
 *
 * If app crashes during write, recovery happens on next load.
 *
 * @param state - The queue state to persist
 * @param scope - Optional user/session scope for persistence isolation
 * @throws Error if storage operation fails (caller should handle)
 */
export async function saveQueueState(
  state: OfflineQueueState,
  scope?: string | null
): Promise<void> {
  const stateToSave: OfflineQueueState = {
    ...state,
    updatedAt: Date.now(),
  };

  await transactionSafeWrite(getQueueStorageKey(scope), stateToSave);
}

/**
 * Save queue state WITHOUT transaction safety (fast path)
 *
 * Use only when transaction safety is not required (e.g., tests, dev tools).
 * Prefer saveQueueState() for production use.
 */
export async function saveQueueStateUnsafe(
  state: OfflineQueueState,
  scope?: string | null
): Promise<void> {
  const stateToSave: OfflineQueueState = {
    ...state,
    updatedAt: Date.now(),
  };

  await offlineStorage.setItem(
    getQueueStorageKey(scope),
    JSON.stringify(stateToSave)
  );
}

/**
 * Load the offline queue state from AsyncStorage
 *
 * First checks for and recovers any pending writes from interrupted
 * transactions (app crash during save). Then loads the main state.
 *
 * Returns the default empty queue state if no persisted state exists
 * or if the stored state is corrupted.
 *
 * @param scope - Optional user/session scope for persistence isolation
 * @returns The persisted queue state or default empty state
 */
export async function loadQueueState(
  scope?: string | null
): Promise<OfflineQueueState> {
  const storageKey = getQueueStorageKey(scope);

  try {
    // First, check for and recover any interrupted transactions
    const recovery = await recoverTransaction<OfflineQueueState>(
      storageKey,
      isValidQueueState
    );

    if (recovery.recovered && recovery.data) {
      if (__DEV__)
        console.warn('[queueStorage] Recovered from interrupted write');
      if (recovery.data.version !== OFFLINE_QUEUE_VERSION) {
        return migrateQueueState(recovery.data);
      }
      return recovery.data;
    }

    // Normal load path
    const raw = await offlineStorage.getItem(storageKey);
    if (!raw) return createDefaultState();

    const parsed = JSON.parse(raw) as unknown;
    if (!isValidQueueState(parsed)) {
      if (__DEV__)
        console.warn(
          '[queueStorage] Invalid queue state, resetting to default'
        );
      return createDefaultState();
    }

    if (parsed.version !== OFFLINE_QUEUE_VERSION) {
      return migrateQueueState(parsed);
    }

    return parsed;
  } catch (error) {
    if (__DEV__)
      console.warn('[queueStorage] Failed to load queue state:', error);
    return createDefaultState();
  }
}

/**
 * Clear the offline queue from storage
 *
 * Also cleans up any transaction artifacts (pending/backup keys)
 */
export async function clearQueueState(scope?: string | null): Promise<void> {
  const storageKey = getQueueStorageKey(scope);
  await offlineStorage.removeItem(storageKey);
  await cleanupTransaction(storageKey);
}

export async function clearLegacyQueueState(): Promise<void> {
  await offlineStorage.removeItem(OFFLINE_QUEUE_STORAGE_KEY);
  await cleanupTransaction(OFFLINE_QUEUE_STORAGE_KEY);
}
