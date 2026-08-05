import {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';

import {
  type AnimatedTier,
  resolveTierColor,
} from '@/hooks/useAnimatedTier';

interface Params {
  tierAnim: AnimatedTier;
  streakConnectorColor: string;
  ghostConnectorColor?: string;
  glow: boolean;
}

export function useConnectorArmsTierStyles({
  tierAnim,
  streakConnectorColor,
  ghostConnectorColor,
  glow,
}: Params) {
  const colorStyle = useAnimatedStyle(() => {
    const fromColor = resolveTierColor(tierAnim.from, streakConnectorColor);
    const toColor = resolveTierColor(tierAnim.to, streakConnectorColor);
    return {
      backgroundColor: interpolateColor(
        tierAnim.progress.value,
        [0, 1],
        [fromColor, toColor]
      ),
    };
  });

  const ghostColorStyle = useAnimatedStyle(() => {
    const fallbackFrom = resolveTierColor(tierAnim.from, streakConnectorColor);
    const fallbackTo = resolveTierColor(tierAnim.to, streakConnectorColor);
    const fromColor = ghostConnectorColor ?? fallbackFrom;
    const toColor = ghostConnectorColor ?? fallbackTo;
    return {
      backgroundColor: interpolateColor(
        tierAnim.progress.value,
        [0, 1],
        [fromColor, toColor]
      ),
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    const fromColor = resolveTierColor(tierAnim.from, streakConnectorColor);
    const toColor = resolveTierColor(tierAnim.to, streakConnectorColor);
    return {
      shadowColor: interpolateColor(
        tierAnim.progress.value,
        [0, 1],
        [fromColor, toColor]
      ),
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: glow ? 0.4 : 0,
      shadowRadius: glow ? 6 : 0,
    };
  });

  return { colorStyle, ghostColorStyle, glowStyle };
}
