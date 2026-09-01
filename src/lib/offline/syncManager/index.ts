/**
 * Sync Manager Module
 */

export { OfflineSyncManager } from './OfflineSyncManager';
export { getOfflineSyncManager, resetOfflineSyncManager } from './singleton';
export type {
  OfflineSyncManagerConfig,
  SyncItem,
  SyncItemExecutor,
  SyncEventListener,
  SyncResult,
} from './types';
