import {
  ArrowDownAZ,
  ArrowUpAZ,
  Flame,
  GripVertical,
  Zap,
} from 'lucide-react-native';
import { Dimensions } from 'react-native';

import { springs } from '@/theme/animations';
import { colors } from '@/theme/colors';
import { iconSizes } from '@/theme/iconSizes';
import type { SortOptionConfig } from './types';

export const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Spring configuration for bottom sheet animations.
 * Sheet slide uses a softer organic spring (damping 18 / stiffness 150).
 */
export const SHEET_SPRING_CONFIG = springs.standard;

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

export { DISMISS_THRESHOLD, VELOCITY_THRESHOLD } from '@/constants';

// Icon sizing
export const CHECK_ICON_SIZE = iconSizes.small;
export const CHECK_ICON_STROKE_WIDTH = 2.5;
export const SORT_OPTION_ICON_SIZE = iconSizes.medium;
export const SORT_OPTION_ICON_STROKE_WIDTH = 2.25;

// Colors
export const WHITE_ICON_COLOR = colors.text.inverse;
export const DARK_SURFACE_COLOR = colors.dark.surface;
export const LIGHT_SURFACE_COLOR = colors.gray[50];

// Backdrop animation — matches durations.sheet (360ms) for consistency with
// other bottom sheets. Backdrop and sheet arrive/leave together.
export const BACKDROP_FADE_IN_DURATION_MS = 360;
export const BACKDROP_FADE_OUT_DURATION_MS = 360;
export const BACKDROP_VISIBLE_OPACITY = 0.5;
