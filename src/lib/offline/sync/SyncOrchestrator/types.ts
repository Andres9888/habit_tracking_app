/**
 * SyncOrchestrator Internal Types
 */

import type {
  SyncOrchestratorConfig,
  SyncOrchestratorState,
  SyncOrchestratorEventListener,
  ToggleSyncExecutor,
} from '../types';
import type { OfflineQueueManagerAPI } from '../../queueManager';
import { OfflineSyncManager } from '../../syncManager';

export interface OrchestratorDeps {
  queueManager: OfflineQueueManagerAPI;
  syncManager: OfflineSyncManager;
  executor: ToggleSyncExecutor | null;
  config: Required<SyncOrchestratorConfig>;
  state: SyncOrchestratorState;
  listeners: Set<SyncOrchestratorEventListener>;
}
