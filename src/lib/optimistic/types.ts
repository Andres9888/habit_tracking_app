/**
 * Types for optimistic update infrastructure
 *
 * Optimistic updates allow immediate UI feedback before server confirmation,
 * improving perceived performance on slow networks.
 */

import type { Id } from '../../../convex/_generated/dataModel';

/**
 * Optimistic update state for a single operation
 */
export type OptimisticState = 'pending' | 'confirmed' | 'failed';

/**
 * Base optimistic operation with tracking
 */
export interface OptimisticOperation<T = unknown> {
  /** Unique operation ID */
  id: string;
  /** Type of operation */
  type: string;
  /** Operation payload */
  payload: T;
  /** Current state */
  state: OptimisticState;
  /** Timestamp when operation started */
  startedAt: number;
  /** Timestamp when operation completed/failed */
  completedAt?: number;
  /** Error if operation failed */
  error?: Error;
}

/**
 * Toggle operation payload
 */
export interface ToggleOperationPayload {
  habitId: Id<'habits'>;
  date: string;
  /** Whether toggling to completed (true) or incomplete (false) */
  toCompleted: boolean;
  /** Completion intensity when marking complete. Absent means full. */
  kind?: 'full' | 'minimal';
}

/**
 * Archive operation payload
 */
export interface ArchiveOperationPayload {
  habitId: Id<'habits'>;
  habitName: string;
  /** Whether archiving (true) or unarchiving (false) */
  toArchived: boolean;
}

/**
 * Reorder operation payload
 */
export interface ReorderOperationPayload {
  habitIds: Id<'habits'>[];
  /** Previous order for rollback */
  previousOrder: Id<'habits'>[];
}

/**
 * Pause/resume operation payload
 */
export interface PauseOperationPayload {
  habitId: Id<'habits'>;
  habitName?: string;
  /** Whether pausing (true) or resuming (false) */
  toPaused: boolean;
}

/**
 * Union of all operation payloads
 */
export type OperationPayload =
  | ToggleOperationPayload
  | ArchiveOperationPayload
  | ReorderOperationPayload
  | PauseOperationPayload;

/**
 * Operation type discriminator
 */
export type OperationType = 'toggle' | 'archive' | 'reorder' | 'pause';

/**
 * Typed optimistic operation
 */
export type TypedOptimisticOperation<T extends OperationType> =
  T extends 'toggle'
    ? OptimisticOperation<ToggleOperationPayload>
    : T extends 'archive'
      ? OptimisticOperation<ArchiveOperationPayload>
      : T extends 'reorder'
        ? OptimisticOperation<ReorderOperationPayload>
        : T extends 'pause'
          ? OptimisticOperation<PauseOperationPayload>
          : never;

/**
 * Optimistic update store state
 */
export interface OptimisticStore {
  /** Map of operation ID to operation */
  operations: Map<string, OptimisticOperation>;
  /** Pending toggle states (habitId:date -> toCompleted) */
  pendingToggles: Map<string, boolean>;
  /** Pending archive states (habitId -> toArchived) */
  pendingArchives: Map<string, boolean>;
  /** Pending reorder (if any) */
  pendingReorder: Id<'habits'>[] | null;
  /** Pending pause states (habitId -> toPaused) */
  pendingPauses: Map<string, boolean>;
}

/**
 * Optimistic update callbacks
 */
export interface OptimisticCallbacks {
  /** Called when operation succeeds */
  onSuccess?: (operationId: string) => void;
  /** Called when operation fails */
  onError?: (operationId: string, error: Error) => void;
  /** Called when operation is rolled back */
  onRollback?: (operationId: string) => void;
}

/**
 * Options for optimistic mutation execution
 */
export interface OptimisticMutationOptions<T> extends OptimisticCallbacks {
  /** Operation type */
  type: OperationType;
  /** Operation payload */
  payload: T;
  /** Timeout before considering operation failed (ms) */
  timeoutMs?: number;
}

/**
 * Result of optimistic mutation
 */
export interface OptimisticMutationResult<R = void> {
  /** Operation ID for tracking */
  operationId: string;
  /** Promise that resolves when server confirms */
  serverResult: Promise<R>;
}
