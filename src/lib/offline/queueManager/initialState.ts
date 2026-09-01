import {
  DEFAULT_QUEUE_STATE,
  OFFLINE_QUEUE_VERSION,
  type OfflineQueueState,
} from '../queue';

export function createInitialQueueState(): OfflineQueueState {
  const now = Date.now();
  return {
    ...DEFAULT_QUEUE_STATE,
    createdAt: now,
    updatedAt: now,
    version: OFFLINE_QUEUE_VERSION,
  };
}
