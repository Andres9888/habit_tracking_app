/**
 * Helper functions for optimistic store
 */

import type { Id } from '../../../../convex/_generated/dataModel';

/**
 * Generate a unique operation ID
 */
export const generateId = () =>
  `op_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

/**
 * Generate a key for toggle state lookup
 */
export const getToggleKey = (habitId: Id<'habits'>, date: string) =>
  `${habitId}:${date}`;
