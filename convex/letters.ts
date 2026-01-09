/**
 * Letters to Self API
 * Time-locked messages from past self to future self
 *
 * Scientific Basis:
 * - Temporal self-continuity: Connecting with future self increases self-control
 * - Delayed gratification psychology (Mischel's marshmallow studies)
 *
 * Business Model:
 * - Premium feature: creates anticipation, unique feature, emotional depth
 * - Users pay for emotional experiences (Calm model)
 *
 * Story T11: Letters to Self
 */

// Re-export types, constants, and helpers
export * from './letters/index';

// Re-export queries
export {
  countByHabit,
  get,
  getMostRecentUnlocked,
  getStats,
  getUnreadUnlocked,
  getUpcomingUnlocks,
  listByHabit,
  listByUser,
} from './lettersQueries';

// Re-export mutations
export { create, markAsRead, remove, update } from './lettersMutations';
