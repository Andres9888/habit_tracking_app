/**
 * Conflict Resolver Types
 *
 * Types for conflict detection and resolution during offline sync.
 * Implements US4 (Graceful Conflict Resolution) and FR-010
 * (Resolve conflicts by preserving completions - completion wins).
 */

import type { Id } from '../../../../../convex/_generated/dataModel';
import type { ToggleCompletionPayload } from '../../queue';

/**
 * Server state for a habit+date combination
 */
export interface ServerCompletionState {
  /** Habit ID */
  habitId: Id<'habits'>;
  /** Date in YYYY-MM-DD format */
  date: string;
  /** Whether the habit is currently marked complete on the server */
  isCompleted: boolean;
  /** Timestamp when this state was fetched */
  fetchedAt: number;
}

/**
 * Result of conflict resolution for a single operation
 */
export interface ConflictResolutionResult {
  /** ID of the operation being resolved */
  operationId: string;
  /** The offline operation payload */
  payload: ToggleCompletionPayload;
  /** Whether a conflict was detected */
  hasConflict: boolean;
  /** Resolution action to take */
  resolution: ConflictResolution;
  /** Reason for the resolution decision */
  reason: string;
  /** Server state used for resolution (if fetched) */
  serverState?: ServerCompletionState;
}

/**
 * Possible conflict resolution actions
 */
export type ConflictResolution =
  /** Execute the sync - no conflict or conflict resolved in favor of sync */
  | 'sync'
  /** Skip the sync - desired state already exists on server */
  | 'skip'
  /** Mark as failed - cannot resolve conflict */
  | 'fail';

/**
 * Batch result from resolving multiple operations
 */
export interface BatchConflictResolutionResult {
  /** Individual resolution results */
  results: ConflictResolutionResult[];
  /** Total operations processed */
  total: number;
  /** Operations that should be synced */
  syncCount: number;
  /** Operations that should be skipped */
  skipCount: number;
  /** Operations that failed to resolve */
  failCount: number;
  /** Number of conflicts detected */
  conflictsDetected: number;
  /** Number of conflicts resolved via completion-wins strategy */
  conflictsResolvedByCompletionWins: number;
}

/**
 * Function to check server completion state for a habit+date
 */
export type CompletionStateChecker = (
  habitId: Id<'habits'>,
  date: string
) => Promise<boolean | null>;

/**
 * Function to batch check server completion states
 */
export type BatchCompletionStateChecker = (
  items: Array<{ habitId: Id<'habits'>; date: string }>
) => Promise<Map<string, boolean>>;

/**
 * Configuration for conflict resolver
 */
export interface ConflictResolverConfig {
  /** Whether to always check server state before sync (default: true) */
  checkServerStateBeforeSync?: boolean;
  /** Timeout for server state check in ms (default: 5000) */
  serverCheckTimeoutMs?: number;
  /** Whether to apply completion-wins strategy (default: true, per FR-010) */
  completionWins?: boolean;
}

/**
 * Event types for conflict resolution
 */
export type ConflictEventType =
  | 'conflict:detected'
  | 'conflict:resolved'
  | 'conflict:skip_sync'
  | 'conflict:error';

/**
 * Event payload for conflict events
 */
export interface ConflictEvent {
  type: ConflictEventType;
  timestamp: number;
  data: {
    operationId: string;
    habitId: Id<'habits'>;
    date: string;
    resolution?: ConflictResolution;
    reason?: string;
    error?: Error;
  };
}

/**
 * Listener for conflict events
 */
export type ConflictEventListener = (event: ConflictEvent) => void;
