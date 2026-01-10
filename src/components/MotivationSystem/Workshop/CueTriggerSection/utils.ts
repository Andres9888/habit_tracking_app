/**
 * CueTriggerSection Utilities
 */

import type { CueTriggerData } from './types';

/**
 * Checks if the cue data has at least one field filled
 */
export function hasCueData(cue: CueTriggerData | undefined): boolean {
  if (!cue) return false;
  return !!(cue.time || cue.location || cue.afterBehavior);
}

/**
 * Formats the implementation intention string
 * "After I [afterBehavior], I will [habit]"
 */
export function formatIntentionPreview(cue: CueTriggerData): string | null {
  if (!cue.afterBehavior) return null;
  return `After I ${cue.afterBehavior}...`;
}
