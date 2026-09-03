import { resolveTierColor } from '@/hooks/useAnimatedTier';
import { LEGENDARY_CELL_BACKGROUND, type MaterialTier } from './materialTier';

export const GOLDEN_GLOW_COLOR = '#FBBF24';
export const INCOMPLETE_BACKGROUND = '#f5f5f5';
export const INCOMPLETE_BORDER = '#78716c';
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

export const getStaticFrameColors = (isToday: boolean, missed: boolean) => ({
  background: missed ? MISSED_BG : INCOMPLETE_BACKGROUND,
  border: missed
    ? MISSED_BORDER
    : isToday
      ? GOLDEN_GLOW_COLOR
      : INCOMPLETE_BORDER,
});

/**
 * Resting colors of a completed cell. React-owned on purpose: the frame must
 * never depend on a Reanimated props-registry entry surviving a re-render.
 */
export const getTierFrameColors = (
  tier: MaterialTier,
  accentColor: string
) => ({
  background:
    tier.name === 'legendary'
      ? LEGENDARY_CELL_BACKGROUND
      : resolveTierColor(tier, accentColor),
  border: resolveTierColor(tier, accentColor),
});

export const getCellContainerStyle = (borderRadius: number) => ({
  borderRadius,
  height: 44,
  width: 44,
});

export const getFrameStyle = ({
  backgroundColor,
  borderColor,
  borderRadius,
  missed,
}: {
  backgroundColor: string;
  borderColor: string;
  borderRadius: number;
  missed: boolean;
}) => ({
  backgroundColor,
  borderColor,
  borderRadius,
  borderStyle: missed ? ('dashed' as const) : ('solid' as const),
  borderWidth: 2,
});

export const getPressableStyle = (borderRadius: number, disabled: boolean) => ({
  borderRadius,
  flex: 1,
  opacity: disabled ? 0.5 : 1,
  overflow: 'hidden' as const,
});
