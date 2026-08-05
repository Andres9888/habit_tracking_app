/**
 * Types for Optimized Queue Operations
 *
 * @see docs/offline-habit-sync.md FR-011 (handle 500+ operations)
 */

/** Operation index for O(1) lookups */
export interface OperationIndex {
  /** Map of operation ID to array index */
  byId: Map<string, number>;
  /** Map of dedupe key to operation ID */
  byDedupeKey: Map<string, string>;
}

/** Batch status result */
export interface BatchStatusResult {
  succeeded: string[];
  failed: string[];
  notFound: string[];
}

/** Batch event payload */
export interface BatchEventPayload {
  count: number;
  error?: string;
}
