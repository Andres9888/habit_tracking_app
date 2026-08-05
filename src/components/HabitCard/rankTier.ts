/**
 * LoL-flavored rank palette for the home habit card emoji tile.
 *
 * Thresholds derive from STRENGTH_LEVEL_THRESHOLDS so rank, chain material,
 * and strength label stay in lockstep — never diverge.
 */

import { STRENGTH_LEVEL_THRESHOLDS } from '@/utils/strengthThresholds';

export type RankName = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface RankTier {
  name: RankName;
  /** Gradient stops, top-left → bottom-right. */
  gradient: readonly [string, string];
  /** Solid fallback used when cross-fading between tiers. */
  base: string;
  glowColor: string;
  glowOpacity: number;
  glowRadius: number;
  /** 0 disables shimmer; top 2 tiers only. */
  shimmerSpeed: number;
  /** Subtle top highlight for metallic sheen. */
  highlight: string;
}

const BRONZE: RankTier = {
  name: 'bronze',
  gradient: ['#8B5A2B', '#CD7F32'],
  base: '#A8692C',
  glowColor: '#CD7F32',
  glowOpacity: 0.35,
  glowRadius: 6,
  shimmerSpeed: 0,
  highlight: 'rgba(255, 224, 178, 0.35)',
};

const SILVER: RankTier = {
  name: 'silver',
  gradient: ['#9AA3AE', '#D7DCE3'],
  base: '#B8BFC8',
  glowColor: '#D7DCE3',
  glowOpacity: 0.4,
  glowRadius: 7,
  shimmerSpeed: 0,
  highlight: 'rgba(255, 255, 255, 0.45)',
};

const GOLD: RankTier = {
  name: 'gold',
  gradient: ['#B8860B', '#E8C46A'],
  base: '#D4A23F',
  glowColor: '#F2B84B',
  glowOpacity: 0.55,
  glowRadius: 9,
  shimmerSpeed: 0,
  highlight: 'rgba(255, 239, 176, 0.55)',
};

const PLATINUM: RankTier = {
  name: 'platinum',
  gradient: ['#4FB3A9', '#B7EDE6'],
  base: '#7ED4CA',
  glowColor: '#7ED4CA',
  glowOpacity: 0.6,
  glowRadius: 11,
  shimmerSpeed: 2000,
  highlight: 'rgba(220, 255, 250, 0.6)',
};

const DIAMOND: RankTier = {
  name: 'diamond',
  gradient: ['#3E6FD9', '#B9F2FF'],
  base: '#6EA5E8',
  glowColor: '#7BBDFF',
  glowOpacity: 0.7,
  glowRadius: 14,
  shimmerSpeed: 1000,
  highlight: 'rgba(222, 240, 255, 0.7)',
};

const DEFAULT_ACCENT: RankTier = BRONZE;

export const RANK_TIERS = {
  bronze: BRONZE,
  silver: SILVER,
  gold: GOLD,
  platinum: PLATINUM,
  diamond: DIAMOND,
} as const;

const [, T_SILVER, T_GOLD, T_PLATINUM, T_DIAMOND] = STRENGTH_LEVEL_THRESHOLDS;

export function getRankTier(strengthPercent: number): RankTier {
  if (strengthPercent >= T_DIAMOND) return DIAMOND;
  if (strengthPercent >= T_PLATINUM) return PLATINUM;
  if (strengthPercent >= T_GOLD) return GOLD;
  if (strengthPercent >= T_SILVER) return SILVER;
  return Number.isFinite(strengthPercent) ? BRONZE : DEFAULT_ACCENT;
}
