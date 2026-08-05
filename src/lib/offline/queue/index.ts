/**
 * Offline Queue Types - Barrel Export
 *
 * Unified exports for all offline queue-related types.
 */

// Operation types
export type {
  OfflineOperation,
  OfflineOperationPayload,
  OfflineOperationStatus,
  OfflineOperationType,
  ToggleCompletionOperation,
  ToggleCompletionPayload,
  CreateHabitOperation,
  CreateHabitPayload,
  UpdateHabitOperation,
  UpdateHabitPayload,
  ArchiveHabitOperation,
  ArchiveHabitPayload,
  PauseHabitOperation,
  PauseHabitPayload,
  RemoveHabitOperation,
  RemoveHabitPayload,
} from './types';

// State types
export type { OfflineQueueState, OfflineQueueStats } from './state';
export {
  DEFAULT_QUEUE_STATE,
  OFFLINE_QUEUE_VERSION,
  QUEUE_THRESHOLDS,
} from './state';

// Event types
export type {
  QueueEvent,
  QueueEventCallback,
  QueueEventType,
  QueueOperationOptions,
  QueueOperationResult,
} from './events';

// Connectivity types
export type { ConnectivityState } from './connectivity';
