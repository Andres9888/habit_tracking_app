/**
 * Transaction-Safe Write Operations
 *
 * Implements atomic write pattern for AsyncStorage to prevent
 * data corruption during app crashes or unexpected terminations.
 *
 * Write Flow:
 * 1. Write data to pending key with envelope (checksum + metadata)
 * 2. Create backup of existing data (if any)
 * 3. Write data to main key
 * 4. Remove pending key (commit complete)
 *
 * Recovery Flow (on next load):
 * 1. Check for pending key
 * 2. If pending exists with valid checksum, recover it
 * 3. Cleanup pending key
 */

import { offlineStorage } from './offlineStorage';

import {
  createEnvelope,
  getBackupKey,
  getPendingKey,
  recoverFromPending,
} from './transactionSafety';

/**
 * Options for transaction-safe write operations
 */
export interface TransactionWriteOptions {
  /** Whether to create a backup before overwriting */
  createBackup?: boolean;
  /** Maximum age (ms) for pending writes to be recovered */
  maxPendingAge?: number;
}

const DEFAULT_OPTIONS: Required<TransactionWriteOptions> = {
  createBackup: false,
  maxPendingAge: 5 * 60 * 1000, // 5 minutes
};

/**
 * Write data to AsyncStorage with transaction safety
 *
 * Ensures atomic writes by using a two-phase commit:
 * 1. Write to pending key with integrity checksum
 * 2. Write to main key
 * 3. Remove pending key (marks transaction complete)
 */
export async function transactionSafeWrite<T>(
  key: string,
  data: T,
  options?: TransactionWriteOptions
): Promise<void> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const pendingKey = getPendingKey(key);
  const backupKey = getBackupKey(key);

  // Create envelope with checksum
  const envelope = createEnvelope(data);
  const envelopeJson = JSON.stringify(envelope);

  // Phase 1: Write to pending key (if crash here, we can detect and recover)
  await offlineStorage.setItem(pendingKey, envelopeJson);

  // Phase 2: Optional backup of existing data
  if (opts.createBackup) {
    const existing = await offlineStorage.getItem(key);
    if (existing) {
      await offlineStorage.setItem(backupKey, existing);
    }
  }

  // Phase 3: Write to main key
  // If this fails, pending key still exists for recovery on next load
  await offlineStorage.setItem(key, JSON.stringify(data));

  // Phase 4: Remove pending key (commit complete)
  await offlineStorage.removeItem(pendingKey);
}

/**
 * Recover and cleanup any incomplete transactions
 *
 * Call this during app startup to handle crashes during previous writes.
 * Returns recovered data if a valid pending write was found.
 */
export async function recoverTransaction<T>(
  key: string,
  validator: (data: unknown) => data is T,
  _options?: TransactionWriteOptions
): Promise<{ recovered: boolean; data: T | null }> {
  // _options reserved for future use (e.g., maxPendingAge validation)

  // Try to recover from pending
  const recovered = await recoverFromPending<T>(key);

  if (recovered === null) {
    return { data: null, recovered: false };
  }

  // Validate recovered data
  if (!validator(recovered)) {
    if (__DEV__) console.warn('[transactionWrite] Recovered data failed validation');
    await cleanupTransaction(key);
    return { data: null, recovered: false };
  }

  // Write recovered data to main key to complete the transaction
  await offlineStorage.setItem(key, JSON.stringify(recovered));
  await cleanupTransaction(key);

  // Log recovery - this is notable so using warn level for visibility
  if (__DEV__) console.warn('[transactionWrite] Successfully recovered pending write');
  return { data: recovered, recovered: true };
}

/**
 * Clean up transaction artifacts (pending and backup keys)
 */
export async function cleanupTransaction(key: string): Promise<void> {
  const pendingKey = getPendingKey(key);
  const backupKey = getBackupKey(key);

  await offlineStorage.multiRemove([pendingKey, backupKey]);
}

/**
 * Verify that stored data integrity is intact
 */
export async function verifyStorageIntegrity(key: string): Promise<boolean> {
  try {
    const raw = await offlineStorage.getItem(key);
    if (!raw) return true; // No data is valid

    // Just verify it's parseable JSON
    JSON.parse(raw);
    return true;
  } catch {
    return false;
  }
}
