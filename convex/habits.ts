/**
 * Habits Module - Barrel Export
 * CRUD operations for habit management
 *
 * This module has been decomposed into focused files:
 *
 * Core Logic (≤100 lines each):
 * - habits/types.ts: Type definitions and validators
 * - habits/utils.ts: Date and utility functions
 * - habits/create.ts: Create habit mutation
 * - habits/update.ts: Update habits mutation
 * - habits/archive.ts: Archive/unarchive mutations
 * - habits/pause.ts: Pause/resume mutations
 * - habits/remove.ts: Delete and restore mutations
 * - habits/reorder.ts: Reorder habits mutation
 * - habits/queries.ts: Get and list queries
 * - habits/tracking.ts: Toggle and tracking queries
 * - habits/stats.ts: Statistics query
 *
 * @see docs/DECOMPOSITION_PATTERNS.md for decomposition guidelines
 */

// ─────────────────────────────────────────────────────────────────────────────
// Mutation exports
// ─────────────────────────────────────────────────────────────────────────────
export { create } from './habits/create';
export { update, updateNotes } from './habits/update';
export { archive, deleteAllArchived, unarchive } from './habits/archive';
export { batchArchive, batchUnarchive } from './habits/batchArchive';
export { batchRemove } from './habits/batchRemove';
export { pause, resume } from './habits/pause';
export { pauseAll } from './habits/pauseAll';
export { remove, restore } from './habits/remove';
export { reorderHabits } from './habits/reorder';
export { toggleHabit } from './habits/toggle';
export { cleanupLegacyGoalFields } from './habits/cleanupLegacyGoalFields';

// ─────────────────────────────────────────────────────────────────────────────
// Query exports
// ─────────────────────────────────────────────────────────────────────────────
export { get } from './habits/get';
export { list } from './habits/list';
export { listArchived, listArchivedCount } from './habits/archive';
export { listPaused } from './habits/pause';
export { getTracking } from './habits/getTracking';
export { getHabitTracking } from './habits/getHabitTracking';
export { getStats } from './habits/stats';
