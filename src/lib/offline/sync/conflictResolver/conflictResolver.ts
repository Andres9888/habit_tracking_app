/**
 * Conflict Resolver
 *
 * Resolves conflicts between offline operations and server state.
 * Implements US4 (Graceful Conflict Resolution) and FR-010 (completion wins).
 *
 * Core Strategy:
 * - Check server state before syncing
 * - If offline wants to complete and server is already complete → skip sync
 * - If offline wants to uncomplete and server is already uncomplete → skip sync
 * - Otherwise → proceed with sync
 *
 * This ensures completions are never lost and avoids redundant toggles.
 */

// Single operation resolution
export {
  DEFAULT_CONFLICT_RESOLVER_CONFIG,
  resolveOperation,
} from './resolveOperation';

// Batch resolution with individual checks
export { resolveOperations } from './resolveOperations';

// Batch resolution with batch checker
export { resolveOperationsBatch } from './resolveOperationsBatch';
