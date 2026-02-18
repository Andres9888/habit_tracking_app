/**
 * Sort picker options for the Settings modal.
 * Simplified subset of SortBottomSheet constants.
 */

import type { HabitSortMode } from '../../features/habits/types';

interface SortPickerOption {
  value: HabitSortMode;
  label: string;
  description: string;
}

export const SORT_PICKER_OPTIONS: SortPickerOption[] = [
  {
    value: 'manual',
    label: 'Custom Order',
    description: 'Drag to reorder manually',
  },
  {
    value: 'day_phase',
    label: 'Day Phase',
    description: 'Push → Pivot → Pull',
  },
  { value: 'name_asc', label: 'Name (A–Z)', description: 'Alphabetical order' },
  {
    value: 'name_desc',
    label: 'Name (Z–A)',
    description: 'Reverse alphabetical',
  },
  {
    value: 'strength_asc',
    label: 'Strength (Low → High)',
    description: 'Focus on habits needing attention',
  },
  {
    value: 'strength_desc',
    label: 'Strength (High → Low)',
    description: 'See strongest habits first',
  },
  {
    value: 'streak_asc',
    label: 'Streak (Low → High)',
    description: 'Protect habits at risk',
  },
  {
    value: 'streak_desc',
    label: 'Streak (High → Low)',
    description: 'Celebrate your best streaks',
  },
];

export const SORT_LABEL_MAP: Record<HabitSortMode, string> = {
  day_phase: 'Day Phase',
  manual: 'Custom',
  name_asc: 'A–Z',
  name_desc: 'Z–A',
  streak_asc: 'Streak ↑',
  streak_desc: 'Streak ↓',
  strength_asc: 'Strength ↑',
  strength_desc: 'Strength ↓',
};
