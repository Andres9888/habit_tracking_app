import type { MaterialTier } from './materialTier';
import { LEGENDARY_CELL_BACKGROUND } from './materialTier';

export const GOLDEN_GLOW_COLOR = '#FBBF24'; // amber-400

export const getTodayGlowStyle = (borderRadius: number) => ({
  borderRadius: borderRadius + 3,
  elevation: 4,
  shadowColor: GOLDEN_GLOW_COLOR,
  shadowOffset: { height: 0, width: 0 },
  shadowOpacity: 0.35,
  shadowRadius: 8,
});

export const getCompletedShadowStyle = (
  isToday: boolean,
  accentColor: string,
  tier: MaterialTier
) => ({
  elevation: 2,
  shadowColor: isToday
    ? GOLDEN_GLOW_COLOR
    : tier.useAccent
      ? accentColor
      : tier.cellShadowColor,
  shadowOffset: { height: 0, width: 0 },
  shadowOpacity: tier.cellShadowOpacity,
  shadowRadius: tier.cellShadowRadius,
});

export const getBackgroundColor = (
  completed: boolean,
  accentColor: string,
  highContrastMode: boolean,
  tier: MaterialTier
) => {
  if (completed) {
    if (tier.name === 'legendary') return LEGENDARY_CELL_BACKGROUND;
    return tier.useAccent ? accentColor : tier.tierColor;
  }
  return highContrastMode ? '#000000' : '#f5f5f5';
};

export const getBorderColor = (
  completed: boolean,
  isToday: boolean,
  accentColor: string,
  highContrastMode: boolean,
  tier: MaterialTier
) => {
  if (completed) {
    if (tier.name === 'legendary') return tier.tierColor;
    return tier.useAccent ? accentColor : tier.tierColor;
  }
  if (isToday) return GOLDEN_GLOW_COLOR;
  return highContrastMode ? '#facc15' : '#78716c';
};
