/**
 * Transaction Safety for AsyncStorage
 *
 * Provides atomic write operations to prevent data corruption during
 * app crashes or unexpected terminations. Uses a write-ahead pattern:
 * 1. Write to temp key with checksum
 * 2. Verify temp write integrity
 * 3. Swap temp to main key
 * 4. Cleanup temp key
 *
 * Implements Edge Case: "App crash during queue write: Transaction-safe to prevent corruption"
 */

import { offlineStorage } from './offlineStorage';

/**
 * Storage key suffixes for transaction safety
 */
export const TRANSACTION_KEYS = {
  /** Suffix for backup before overwrite */
  BACKUP: '_backup',

  /** Suffix for temporary/pending write */
  PENDING: '_pending',
} as const;

/**
 * Metadata wrapper for transaction-safe writes
 */
export interface TransactionEnvelope<T> {
  /** The actual data payload */
  data: T;
  /** Simple checksum for integrity verification */
  checksum: string;
  /** Timestamp when write started */
  timestamp: number;
  /** Schema version for the envelope */
  envelopeVersion: 1;
}

/**
 * Calculate a simple checksum for data integrity verification
 * Uses a fast string-based hash suitable for corruption detection
 */
export function calculateChecksum(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.codePointAt(i) ?? 0;
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `cs_${Math.abs(hash).toString(36)}`;
}

/**
 * Verify that data matches its checksum
 */
export function verifyChecksum(data: string, checksum: string): boolean {
  return calculateChecksum(data) === checksum;
}

/**
 * Create a transaction envelope wrapping data with metadata
 */
export function createEnvelope<T>(data: T): TransactionEnvelope<T> {
  const serialized = JSON.stringify(data);
  return {
    checksum: calculateChecksum(serialized),
    data,
    envelopeVersion: 1,
    timestamp: Date.now(),
  };
}

/**
 * Get the pending (temp) key for a storage key
 */
export function getPendingKey(baseKey: string): string {
  return `${baseKey}${TRANSACTION_KEYS.PENDING}`;
}

/**
 * Get the backup key for a storage key
 */
export function getBackupKey(baseKey: string): string {
  return `${baseKey}${TRANSACTION_KEYS.BACKUP}`;
}

/**
 * Check if an envelope is valid and data integrity is intact
 */
export function isValidEnvelope<T>(
  value: unknown
): value is TransactionEnvelope<T> {
  if (!value || typeof value !== 'object') return false;

  const envelope = value as Record<string, unknown>;
  return (
    envelope.envelopeVersion === 1 &&
    typeof envelope.checksum === 'string' &&
    typeof envelope.timestamp === 'number' &&
    'data' in envelope
  );
}

/**
 * Attempt to recover from a pending write
 * Returns the recovered data if valid, null otherwise
 */
export async function recoverFromPending<T>(
  baseKey: string
): Promise<T | null> {
  const pendingKey = getPendingKey(baseKey);

  try {
    const raw = await offlineStorage.getItem(pendingKey);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    if (!isValidEnvelope<T>(parsed)) {
      // Invalid envelope, cleanup
      await offlineStorage.removeItem(pendingKey);
      return null;
    }

    // Verify checksum
    const dataString = JSON.stringify(parsed.data);
    if (!verifyChecksum(dataString, parsed.checksum)) {
      // Corrupted, cleanup
      if (__DEV__) console.warn('[transactionSafety] Corrupted pending write detected');
      await offlineStorage.removeItem(pendingKey);
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
}
