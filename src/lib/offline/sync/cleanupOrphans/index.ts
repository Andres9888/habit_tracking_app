/**
 * Orphan Cleanup Module
 *
 * Identifies and removes offline operations that reference deleted habits.
 * Implements Edge Case: "Deleted habit on server: Orphaned completions discarded gracefully"
 */

// Main cleanup function
export {
  cleanupOrphans,
  createOrphanCleaner,
  DEFAULT_CLEANUP_BATCH_SIZE,
} from './cleanupOrphans';

// Helpers
export {
  buildCleanupResult,
  createCleanupEvent,
  createEmptyCleanupResult,
  createOrphanedOperation,
  extractUniqueHabitIds,
  findDeletedHabitIds,
  groupOperationsByHabit,
  identifyOrphans,
} from './helpers';

// Existence checking
export { checkHabitsExistence } from './checkExistence';

// Orphan removal
export { notifyOrphansFound, removeOrphans } from './removeOrphans';

// Types
export type {
  BatchHabitExistsChecker,
  CleanupOrphansConfig,
  CleanupOrphansDeps,
  CleanupOrphansEvent,
  CleanupOrphansEventListener,
  CleanupOrphansEventType,
  CleanupOrphansResult,
  HabitExistsChecker,
  HabitExistsResult,
  OrphanedOperation,
} from './types';
