import { colors } from '@/theme/colors';
import type { StrengthLevelKey } from '@/utils/progressEmojis';
import {
  STRENGTH_LEVEL_THRESHOLDS,
  STRENGTH_TIER_INDEX,
} from '@/utils/strengthThresholds';
import type { LevelConfig } from './StrengthProgressBar.types';

export type LevelMeta = Omit<LevelConfig, 'emoji'> & {
  key: StrengthLevelKey;
};

export const LEVEL_META: LevelMeta[] = [
  {
    color: colors.strength.starting,
    colorBg: colors.strength.startingLight,
    key: 'starting',
    label: 'Starting',
    threshold: STRENGTH_LEVEL_THRESHOLDS[STRENGTH_TIER_INDEX.starting],
  },
  {
    color: colors.strength.building,
    colorBg: colors.strength.buildingLight,
    key: 'building',
    label: 'Building',
    threshold: STRENGTH_LEVEL_THRESHOLDS[STRENGTH_TIER_INDEX.building],
  },
  {
    color: colors.strength.developing,
    colorBg: colors.strength.developingLight,
    key: 'developing',
    label: 'Developing',
    threshold: STRENGTH_LEVEL_THRESHOLDS[STRENGTH_TIER_INDEX.developing],
  },
  {
    color: colors.strength.strong,
    colorBg: colors.strength.strongLight,
    key: 'strong',
    label: 'Strong',
    threshold: STRENGTH_LEVEL_THRESHOLDS[STRENGTH_TIER_INDEX.strong],
  },
  {
    color: colors.strength.automatic,
    colorBg: colors.strength.automaticLight,
    key: 'automatic',
    label: 'Automatic',
    threshold: STRENGTH_LEVEL_THRESHOLDS[STRENGTH_TIER_INDEX.automatic],
  },
];
