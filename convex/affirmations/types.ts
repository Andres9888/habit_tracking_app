/**
 * Type definitions for affirmations module
 */

import { v } from 'convex/values';

export const MAX_AFFIRMATIONS_PER_HABIT = 10;
export const MAX_TEXT_LENGTH = 200;

/**
 * Affirmation type categories based on psychology research
 * - identity: "I am..." statements (most powerful per self-affirmation theory)
 * - motivational: Encouraging statements about capability
 * - instructional: Guiding statements about approach
 */
export const affirmationTypeValidator = v.union(
  v.literal('identity'),
  v.literal('motivational'),
  v.literal('instructional')
);

/**
 * Type of affirmation categorized by psychological approach
 * - identity: "I am..." statements based on self-affirmation theory
 * - motivational: Encouraging statements about capability and progress
 * - instructional: Guiding statements about action and approach
 */
export type AffirmationType = 'identity' | 'motivational' | 'instructional';

/**
 * Habit context used in AI generation
 */
export interface HabitContext {
  name: string;
  why?: string;
  identity?: string;
  notes?: string;
  vizSuccessBody?: string;
  vizSuccessMind?: string;
  vizSuccessEmotion?: string;
}

/**
 * Generated affirmation before saving
 */
export interface GeneratedAffirmation {
  text: string;
  type: AffirmationType;
}
