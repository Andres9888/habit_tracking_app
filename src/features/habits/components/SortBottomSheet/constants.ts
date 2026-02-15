import {
  ArrowDownAZ,
  ArrowUpAZ,
  Flame,
  GripVertical,
  Sun,
  Zap,
} from 'lucide-react-native';
import { Dimensions } from 'react-native';

import { DISMISS_THRESHOLD, VELOCITY_THRESHOLD } from '@/constants';
import type { SortOptionConfig } from './types';

export { DISMISS_THRESHOLD, VELOCITY_THRESHOLD };

export const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Spring configuration for bottom sheet animations
 * Using softer, more organic spring matching app's FadeInDown.springify().damping(18) pattern
 */
export const SHEET_SPRING_CONFIG = {
  damping: 18,
  mass: 1,
  stiffness: 150,
};

export const SORT_OPTIONS: SortOptionConfig[] = [
  {
    chipLabel: 'Custom',
    description: 'Drag to reorder manually',
    Icon: GripVertical,
    iconBgColors: ['#78716c', '#57534e'],
    label: 'Custom Order',
    value: 'manual',
  },
  {
    chipLabel: 'Day Phase',
    description: 'Push → Pivot → Pull',
    Icon: Sun,
    iconBgColors: ['#fbbf24', '#f97316'],
    label: 'Day Phase',
    value: 'day_phase',
  },
  {
    chipLabel: 'A-Z',
    description: 'Alphabetical order',
    Icon: ArrowDownAZ,
    iconBgColors: ['#78716c', '#57534e'],
    label: 'Name (A–Z)',
    value: 'name_asc',
  },
  {
    description: 'Reverse alphabetical',
    Icon: ArrowUpAZ,
    iconBgColors: ['#78716c', '#57534e'],
    label: 'Name (Z–A)',
    value: 'name_desc',
  },
  {
    chipLabel: 'Strength',
    description: 'Focus on habits that need attention',
    Icon: Zap,
    iconBgColors: ['#34d399', '#14b8a6'],
    label: 'Strength (Low → High)',
    value: 'strength_asc',
  },
  {
    description: 'See your strongest habits first',
    Icon: Zap,
    iconBgColors: ['#34d399', '#14b8a6'],
    label: 'Strength (High → Low)',
    value: 'strength_desc',
  },
  {
    chipLabel: 'Streak',
    description: 'Protect habits at risk',
    Icon: Flame,
    iconBgColors: ['#ef4444', '#f97316'],
    label: 'Streaks (Low → High)',
    value: 'streak_asc',
  },
  {
    description: 'Celebrate your best streaks',
    Icon: Flame,
    iconBgColors: ['#ef4444', '#f97316'],
    label: 'Streaks (High → Low)',
    value: 'streak_desc',
  },
];

/** Quick pick chips - a subset of options for fast access */
export const QUICK_PICK_OPTIONS = SORT_OPTIONS.filter((opt) => opt.chipLabel);
