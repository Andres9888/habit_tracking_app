/**
 * Templates Screen - Sort Configuration
 */

import type { SortOption, SortOptionConfig } from './templates.types';

export const SORT_OPTIONS: SortOptionConfig[] = [
  {
    description: 'Most imported templates first',
    label: 'Popular',
    value: 'popular',
  },
  {
    description: 'Alphabetically by name',
    label: 'A-Z',
    value: 'az',
  },
];

export const SORT_LABELS: Record<SortOption, string> = {
  az: 'A-Z',
  popular: 'Popular',
};

export const REMINDER_OPTIONS = ['7:30 AM', '12:00 PM', '9:00 PM'];

export const ICON_COLOR_OPTIONS = [
  '#0EA5E9',
  '#10B981',
  '#F97316',
  '#A855F7',
  '#F43F5E',
];
