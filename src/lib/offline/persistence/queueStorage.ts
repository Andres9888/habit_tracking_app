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
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import type { OfflineQueueState } from '../queue';
import { DEFAULT_QUEUE_STATE, OFFLINE_QUEUE_VERSION } from '../queue';

/** Storage key for the offline queue state */
export const OFFLINE_QUEUE_STORAGE_KEY = '@chainday:offline_queue_v1';

/**
 * Save the offline queue state to AsyncStorage
 *
 * @param state - The queue state to persist
 * @throws Error if storage operation fails (caller should handle)
 */
export async function saveQueueState(state: OfflineQueueState): Promise<void> {
  const stateToSave: OfflineQueueState = {
    ...state,
    updatedAt: Date.now(),
  };

  await AsyncStorage.setItem(
    OFFLINE_QUEUE_STORAGE_KEY,
    JSON.stringify(stateToSave)
  );
}

/**
 * Load the offline queue state from AsyncStorage
 *
 * Returns the default empty queue state if no persisted state exists
 * or if the stored state is corrupted.
 *
 * @returns The persisted queue state or default empty state
 */
export async function loadQueueState(): Promise<OfflineQueueState> {
  try {
    const raw = await AsyncStorage.getItem(OFFLINE_QUEUE_STORAGE_KEY);

    if (!raw) {
      return createDefaultState();
    }

    const parsed = JSON.parse(raw) as unknown;

    if (!isValidQueueState(parsed)) {
      console.warn(
        '[queueStorage] Invalid queue state in storage, resetting to default'
      );
      return createDefaultState();
    }

    // Handle version migrations if needed
    if (parsed.version !== OFFLINE_QUEUE_VERSION) {
      return migrateQueueState(parsed);
    }

    return parsed;
  } catch (error) {
    console.warn('[queueStorage] Failed to load queue state:', error);
    return createDefaultState();
  }
}

/**
 * Clear the offline queue from storage
 */
export async function clearQueueState(): Promise<void> {
  await AsyncStorage.removeItem(OFFLINE_QUEUE_STORAGE_KEY);
}

/**
 * Create a new default queue state with proper timestamps
 */
function createDefaultState(): OfflineQueueState {
  const now = Date.now();
  return {
    ...DEFAULT_QUEUE_STATE,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Type guard to validate persisted queue state structure
 */
function isValidQueueState(value: unknown): value is OfflineQueueState {
  if (!value || typeof value !== 'object') return false;

  const state = value as Record<string, unknown>;

  return (
    typeof state.version === 'number' &&
    Array.isArray(state.operations) &&
    typeof state.createdAt === 'number' &&
    typeof state.updatedAt === 'number'
  );
}

/**
 * Migrate queue state from older versions
 * Currently just returns the state as-is since we're at v1
 */
function migrateQueueState(state: OfflineQueueState): OfflineQueueState {
  // Future migrations would be handled here
  // For now, just update the version and return
  return {
    ...state,
    updatedAt: Date.now(),
    version: OFFLINE_QUEUE_VERSION,
  };
}
