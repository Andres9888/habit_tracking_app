/**
 * Offline Persistence Module - Barrel Export
 */

// Main queue storage
export {
  clearQueueState,
  clearLegacyQueueState,
  loadQueueState,
  OFFLINE_QUEUE_STORAGE_KEY,
  saveQueueState,
  saveQueueStateUnsafe,
  setQueueStorageScope,
} from './queueStorage';

// Queue storage helpers
export {
  createDefaultState,
  isValidQueueState,
  migrateQueueState,
} from './queueStorageHelpers';

// Transaction safety utilities
export {
  calculateChecksum,
  createEnvelope,
  getBackupKey,
  getPendingKey,
  isValidEnvelope,
  recoverFromPending,
  TRANSACTION_KEYS,
  verifyChecksum,
} from './transactionSafety';
export type { TransactionEnvelope } from './transactionSafety';

// Transaction write operations
export {
  cleanupTransaction,
  recoverTransaction,
  transactionSafeWrite,
  verifyStorageIntegrity,
} from './transactionWrite';
export type { TransactionWriteOptions } from './transactionWrite';
