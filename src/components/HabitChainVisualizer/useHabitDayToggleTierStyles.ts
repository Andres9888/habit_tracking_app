import {
  interpolate,
  interpolateColor,
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { type AnimatedTier, resolveTierColor, resolveTierShadowColor } from '@/hooks/useAnimatedTier';
import { LEGENDARY_CELL_BACKGROUND } from './materialTier';

const TODAY_GLOW_COLOR = '#FBBF24';
const RGB_OPTIONS = { gamma: 1 } as const;

interface Params {
  accentColor: string;
  completion: SharedValue<number>;
  isToday: boolean;
  missed: boolean;
  showCompletedShadow: boolean;
  staticBackground: string;
  staticBorder: string;
  tierAnim: AnimatedTier;
}

const tierBackground = (tier: AnimatedTier['from'], accentColor: string) => {
  'worklet';
  return tier.name === 'legendary'
    ? LEGENDARY_CELL_BACKGROUND
    : resolveTierColor(tier, accentColor);
};

export function useHabitDayToggleTierStyles({
  accentColor,
  completion,
  isToday,
  missed,
  showCompletedShadow,
  staticBackground,
  staticBorder,
  tierAnim,
}: Params) {
  const cellStyle = useAnimatedStyle(() => {
    if (missed) {
      return { backgroundColor: staticBackground, borderColor: staticBorder };
    }
    const completedBackground = interpolateColor(
      tierAnim.progress.value,
      [0, 1],
      [
        tierBackground(tierAnim.from, accentColor),
        tierBackground(tierAnim.to, accentColor),
      ],
      'RGB',
      RGB_OPTIONS
    );
    const completedBorder = interpolateColor(
      tierAnim.progress.value,
      [0, 1],
      [
        resolveTierColor(tierAnim.from, accentColor),
        resolveTierColor(tierAnim.to, accentColor),
      ],
      'RGB',
      RGB_OPTIONS
    );
    return {
      backgroundColor: interpolateColor(
        completion.value,
        [0, 1],
        [staticBackground, completedBackground],
        'RGB',
        RGB_OPTIONS
      ),
      borderColor: interpolateColor(
        completion.value,
        [0, 1],
        [staticBorder, completedBorder],
        'RGB',
        RGB_OPTIONS
      ),
    };
  });

  const shadowStyle = useAnimatedStyle(() => {
    const from = isToday
      ? TODAY_GLOW_COLOR
      : resolveTierShadowColor(tierAnim.from, accentColor);
    const to = isToday
      ? TODAY_GLOW_COLOR
      : resolveTierShadowColor(tierAnim.to, accentColor);
    return {
      elevation: showCompletedShadow ? 2 : 0,
      shadowColor: interpolateColor(tierAnim.progress.value, [0, 1], [from, to]),
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: showCompletedShadow
        ? interpolate(tierAnim.progress.value, [0, 1], [tierAnim.from.cellShadowOpacity, tierAnim.to.cellShadowOpacity])
        : 0,
      shadowRadius: showCompletedShadow
        ? interpolate(tierAnim.progress.value, [0, 1], [tierAnim.from.cellShadowRadius, tierAnim.to.cellShadowRadius])
        : 0,
    };
  });
  return { cellStyle, shadowStyle };
}
