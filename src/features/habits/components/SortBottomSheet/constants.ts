import {
  ArrowDownAZ,
  Flame,
  GripVertical,
  Zap,
} from 'lucide-react-native';
import { Dimensions } from 'react-native';

import { springs } from '@/theme/animations';
import { iconSizes } from '@/theme/iconSizes';
import type { SortCardConfig } from './types';

export const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/** Spring configuration — higher damping for stable bottom sheet slide */
export const SHEET_SPRING_CONFIG = springs.bottomSheet;

/** 2×2 card grid sort categories */
export const SORT_CARDS: SortCardConfig[] = [
  {
    description: 'Drag to reorder',
    Icon: GripVertical,
    iconBgColors: ['#6B6560', '#524D47'],
    label: 'Custom',
    mode: 'manual',
  },
  {
    ascLabel: 'A→Z',
    descLabel: 'Z→A',
    description: 'Alphabetical',
    Icon: ArrowDownAZ,
    iconBgColors: ['#6B6560', '#524D47'],
    label: 'Name',
    mode: 'name_asc',
    altMode: 'name_desc',
  },
  {
    ascLabel: 'Low first',
    descLabel: 'High first',
    description: 'By habit strength',
    Icon: Zap,
    iconBgColors: ['#34D399', '#10B981'],
    label: 'Strength',
    mode: 'strength_asc',
    altMode: 'strength_desc',
  },
  {
    ascLabel: 'Low first',
    descLabel: 'High first',
    description: 'By current streak',
    Icon: Flame,
    iconBgColors: ['#ef4444', '#f97316'],
    label: 'Streak',
    mode: 'streak_asc',
    altMode: 'streak_desc',
  },
];

export { DISMISS_THRESHOLD, VELOCITY_THRESHOLD } from '@/constants';

// Icon sizing
export const CARD_ICON_SIZE = iconSizes.small;
export const CARD_ICON_STROKE_WIDTH = 2.25;

// Colors
/** White icon on colored gradient backgrounds — always white regardless of theme */
export const ICON_ON_GRADIENT_COLOR = '#FFFFFF';

// Backdrop animation
export const BACKDROP_FADE_IN_DURATION_MS = 300;
export const BACKDROP_FADE_OUT_DURATION_MS = 250;
export const BACKDROP_VISIBLE_OPACITY = 0.4;
