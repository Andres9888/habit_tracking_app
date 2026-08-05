/**
 * Sync Module
 *
 * Orchestrates offline queue synchronization with network detection.
 *
 * Features:
 * - Core orchestrator for sync coordination (SyncOrchestrator)
 * - React hooks for easy integration (useSyncOrchestrator)
 * - Retry strategy with exponential backoff (FR-006)
 * - FIFO queue processing (FR-005)
 * - State reconciliation (FR-008)
 * - Orphan cleanup for deleted habits (Edge Case)
 */

export * from './exports';
