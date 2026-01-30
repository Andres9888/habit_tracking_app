/**
 * Voice Notes API
 * Audio recordings of motivation, progress, and emotional states
 *
 * Scientific Basis:
 * - Voice has 40% higher emotional recall than text (cognitive psychology)
 * - Hearing your own voice from Day 1 creates powerful emotional anchor
 * - Self-generated audio reinforces commitment through auditory memory
 *
 * Business Model:
 * - Reflectly ($2M ARR) built business on voice journaling
 * - Premium feature: 1 free recording, unlimited for premium users
 * - Day 1 recording prominently featured in Rescue Mode
 *
 * Story T10: Voice Notes
 */

// Re-export types and helpers
export * from './voiceNotes/index';

// Re-export queries
export {
  countByHabit,
  get,
  getDay1Note,
  getFromBestStreak,
  listByHabit,
  listRecent,
} from './voiceNotesQueries';

// Re-export mutations
export { create, remove, update } from './voiceNotesMutations';
