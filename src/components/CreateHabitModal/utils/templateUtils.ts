/**
 * Template utilities for CreateHabitModal
 *
 * Helper functions for template data extraction and transformation.
 */

import type { HabitTemplate } from '../types';
import { DEFAULT_EMOJI } from '../constants';

/** Extract emoji and cleaned name from a habit template */
export function extractTemplateDetails(template: HabitTemplate): {
  emoji: string;
  name: string;
} {
  const emoji =
    template.icon?.match(/\p{Emoji}/u)?.[0] ?? template.icon ?? DEFAULT_EMOJI;
  const name = template.name.replace(/^\p{Emoji}\s*/u, '').trim();
  return { emoji, name };
}
