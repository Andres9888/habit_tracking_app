/**
 * Journal Entries API
 * Longer-form reflections tied to habits with mood tags and prompted questions.
 *
 * Scientific Basis:
 * - Expressive writing improves health outcomes (Pennebaker, 1997)
 * - Structured reflection increases self-awareness and behavior change
 * - Mood tracking correlates with habit consistency (Daylio model)
 *
 * Business Model:
 * - Free: 3 journal entries per habit
 * - Premium: unlimited entries
 */

// Re-export queries
export { listByHabit, countByHabit } from './journalEntriesQueries';

// Re-export mutations
export { create, update, remove } from './journalEntriesMutations';
