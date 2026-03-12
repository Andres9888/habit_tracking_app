/**
 * SyncOrchestrator Internal Types
 */

import type { OfflineQueueManagerAPI } from '../../queueManager';
import { OfflineSyncManager } from '../../syncManager';
import type {
  SyncOrchestratorConfig,
  SyncOrchestratorState,
  SyncOrchestratorEventListener,
  SyncExecutor,
} from '../types';

export interface OrchestratorDeps {
  queueManager: OfflineQueueManagerAPI;
  syncManager: OfflineSyncManager;
  executor: SyncExecutor | null;
  config: Required<SyncOrchestratorConfig>;
  state: SyncOrchestratorState;
  listeners: Set<SyncOrchestratorEventListener>;
}
