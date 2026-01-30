/**
 * Reflections API
 * Quick Reflection - Post-habit completion feedback (BJ Fogg's Tiny Habits)
 *
 * Scientific Basis:
 * - BJ Fogg (Stanford, "Tiny Habits"): Celebration wires habits
 * - Journaling increases self-awareness and consistency
 * - Daylio (50M+ downloads) validates the reflection pattern
 *
 * Story T6: Quick Reflection
 */

// Re-export types, constants, and validators
export * from './reflections/index';

// Re-export queries
export {
  getByHabitAndDate,
  listByHabit,
  listRecent,
} from './reflectionsQueries';

// Re-export mutations
export { remove, upsert } from './reflectionsMutations';
