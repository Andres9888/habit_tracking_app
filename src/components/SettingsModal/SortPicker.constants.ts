/**
 * Sort picker options for the Settings modal.
 * Simplified subset of SortBottomSheet constants.
 */

import type { LucideIcon } from 'lucide-react-native';
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Flame,
  GripVertical,
  Zap,
} from 'lucide-react-native';
import type { HabitSortMode } from '../../features/habits/types';

interface SortPickerOption {
  value: HabitSortMode;
  label: string;
  description: string;
  Icon: LucideIcon;
  iconBgColors: [string, string];
}

export const SORT_PICKER_OPTIONS: SortPickerOption[] = [
  {
    value: 'manual',
    label: 'Custom Order',
    description: 'Drag to reorder manually',
    Icon: GripVertical,
    iconBgColors: ['#78716c', '#57534e'],
  },
  {
    value: 'name_asc',
    label: 'Name (A–Z)',
    description: 'Alphabetical order',
    Icon: ArrowDownAZ,
    iconBgColors: ['#78716c', '#57534e'],
  },
  {
    value: 'name_desc',
    label: 'Name (Z–A)',
    description: 'Reverse alphabetical',
    Icon: ArrowUpAZ,
    iconBgColors: ['#78716c', '#57534e'],
  },
  {
    value: 'strength_asc',
    label: 'Strength (Low → High)',
    description: 'Focus on habits needing attention',
    Icon: Zap,
    iconBgColors: ['#34d399', '#14b8a6'],
  },
  {
    value: 'strength_desc',
    label: 'Strength (High → Low)',
    description: 'See strongest habits first',
    Icon: Zap,
    iconBgColors: ['#34d399', '#14b8a6'],
  },
  {
    value: 'streak_asc',
    label: 'Streak (Low → High)',
    description: 'Protect habits at risk',
    Icon: Flame,
    iconBgColors: ['#ef4444', '#f97316'],
  },
  {
    value: 'streak_desc',
    label: 'Streak (High → Low)',
    description: 'Celebrate your best streaks',
    Icon: Flame,
    iconBgColors: ['#ef4444', '#f97316'],
  },
];

export const SORT_LABEL_MAP: Record<HabitSortMode, string> = {
  manual: 'Custom',
  name_asc: 'A–Z',
  name_desc: 'Z–A',
  streak_asc: 'Streak ↑',
  streak_desc: 'Streak ↓',
  strength_asc: 'Strength ↑',
  strength_desc: 'Strength ↓',
};
