/**
 * SortChip Constants
 */

import type { HabitSortMode } from '../../types';

/**
 * Abbreviated labels for each sort mode, displayed in the chip trigger
 */
export const SORT_LABEL_MAP: Record<HabitSortMode, string> = {
  manual: 'Custom',
  name_asc: 'A–Z',
  name_desc: 'Z–A',
  streak_asc: 'Streak ↑',
  streak_desc: 'Streak ↓',
  strength_asc: 'Strength ↑',
  strength_desc: 'Strength ↓',
};

/**
 * Full labels for accessibility announcements
 */
export const SORT_ACCESSIBILITY_LABEL_MAP: Record<HabitSortMode, string> = {
  manual: 'Custom order',
  name_asc: 'Name A to Z',
  name_desc: 'Name Z to A',
  streak_asc: 'Streak low to high',
  streak_desc: 'Streak high to low',
  strength_asc: 'Strength low to high',
  strength_desc: 'Strength high to low',
};
