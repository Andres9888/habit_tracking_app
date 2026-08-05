import {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';

import {
  type AnimatedTier,
  resolveTierColor,
  resolveTierShadowColor,
} from '@/hooks/useAnimatedTier';
import { LEGENDARY_CELL_BACKGROUND } from './materialTier';

const TODAY_GLOW_COLOR = '#FBBF24';

interface Params {
  tierAnim: AnimatedTier;
  accentColor: string;
  completed: boolean;
  missed: boolean;
  isToday: boolean;
  showCompletedShadow: boolean;
  staticBackground: string;
  staticBorder: string;
}

export function useHabitDayToggleTierStyles({
  tierAnim,
  accentColor,
  completed,
  missed,
  isToday,
  showCompletedShadow,
  staticBackground,
  staticBorder,
}: Params) {
  const cellStyle = useAnimatedStyle(() => {
    if (missed || !completed) {
      return {
        backgroundColor: staticBackground,
        borderColor: staticBorder,
      };
    }
    const fromBg =
      tierAnim.from.name === 'legendary'
        ? LEGENDARY_CELL_BACKGROUND
        : resolveTierColor(tierAnim.from, accentColor);
    const toBg =
      tierAnim.to.name === 'legendary'
        ? LEGENDARY_CELL_BACKGROUND
        : resolveTierColor(tierAnim.to, accentColor);
    const fromBorder = isToday
      ? staticBorder
      : resolveTierColor(tierAnim.from, accentColor);
    const toBorder = isToday
      ? staticBorder
      : resolveTierColor(tierAnim.to, accentColor);
    return {
      backgroundColor: interpolateColor(
        tierAnim.progress.value,
        [0, 1],
        [fromBg, toBg]
      ),
      borderColor: interpolateColor(
        tierAnim.progress.value,
        [0, 1],
        [fromBorder, toBorder]
      ),
    };
  });

  const shadowStyle = useAnimatedStyle(() => {
    const fromShadow = isToday
      ? TODAY_GLOW_COLOR
      : resolveTierShadowColor(tierAnim.from, accentColor);
    const toShadow = isToday
      ? TODAY_GLOW_COLOR
      : resolveTierShadowColor(tierAnim.to, accentColor);
    return {
      elevation: showCompletedShadow ? 2 : 0,
      shadowColor: interpolateColor(
        tierAnim.progress.value,
        [0, 1],
        [fromShadow, toShadow]
      ),
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: showCompletedShadow
        ? interpolate(
            tierAnim.progress.value,
            [0, 1],
            [tierAnim.from.cellShadowOpacity, tierAnim.to.cellShadowOpacity]
          )
        : 0,
      shadowRadius: showCompletedShadow
        ? interpolate(
            tierAnim.progress.value,
            [0, 1],
            [tierAnim.from.cellShadowRadius, tierAnim.to.cellShadowRadius]
          )
        : 0,
    };
  });

  return { cellStyle, shadowStyle };
}
