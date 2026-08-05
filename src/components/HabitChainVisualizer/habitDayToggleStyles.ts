import type { Animated } from 'react-native';
import type { MaterialTier } from './materialTier';
import { LEGENDARY_CELL_BACKGROUND } from './materialTier';

export const GOLDEN_GLOW_COLOR = '#FBBF24'; // amber-400
export const MISSED_BG = '#FEF2F2';
export const MISSED_BORDER = '#DC2626';

export const getTodayGlowStyle = (borderRadius: number) => ({
  borderRadius: borderRadius + 3,
  elevation: 4,
  shadowColor: GOLDEN_GLOW_COLOR,
  shadowOffset: { height: 0, width: 0 },
  shadowOpacity: 0.35,
  shadowRadius: 8,
});

export const getBackgroundColor = (
  completed: boolean,
  accentColor: string,
  tier: MaterialTier
) => {
  if (completed) {
    if (tier.name === 'legendary') return LEGENDARY_CELL_BACKGROUND;
    return tier.useAccent ? accentColor : tier.tierColor;
  }
  return '#f5f5f5';
};

export const getBorderColor = (
  completed: boolean,
  isToday: boolean,
  accentColor: string,
  tier: MaterialTier
) => {
  if (completed) {
    if (tier.name === 'legendary') return tier.tierColor;
    return tier.useAccent ? accentColor : tier.tierColor;
  }
  if (isToday) return GOLDEN_GLOW_COLOR;
  return '#78716c';
};

export function getOuterFrame({
  borderRadius,
  completed,
  missed,
  staticBackground,
  staticBorder,
  tierName,
}: {
  borderRadius: number;
  completed: boolean;
  missed: boolean;
  staticBackground: string;
  staticBorder: string;
  tierName: string;
}) {
  return {
    backgroundColor: staticBackground,
    borderRadius,
    borderColor: staticBorder,
    borderStyle: missed ? ('dashed' as const) : ('solid' as const),
    borderWidth: missed || !completed || tierName === 'legendary' ? 2 : 0,
    height: 44,
    width: 44,
  };
}

export function getPressableStyle(
  borderRadius: number,
  disabled: boolean,
  scale: Animated.AnimatedInterpolation<number> | Animated.Value
) {
  return {
    borderRadius,
    flex: 1,
    opacity: disabled ? 0.5 : 1,
    overflow: 'hidden' as const,
    transform: [{ scale }],
  };
}
