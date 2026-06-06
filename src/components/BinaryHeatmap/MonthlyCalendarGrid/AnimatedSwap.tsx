import React, { memo, type ReactNode } from 'react';
import Animated, {
  FadeInDown,
  type AnimatedProps,
} from 'react-native-reanimated';
import type { ViewProps } from 'react-native';
import { durations, enterEasing } from '@/theme/animations';

type Entering = AnimatedProps<ViewProps>['entering'];

interface AnimatedSwapProps {
  /** Remounts (and re-animates) only when this key changes. */
  swapKey: string;
  children: ReactNode;
  entering?: Entering;
}

const DEFAULT_ENTERING = FadeInDown.duration(durations.enter).easing(
  enterEasing
);

/**
 * Cross-fades its content whenever `swapKey` changes — used so changing
 * labels/numbers settle in instead of snapping. Stable values never animate.
 */
export const AnimatedSwap = memo(function AnimatedSwap({
  swapKey,
  children,
  entering = DEFAULT_ENTERING,
}: AnimatedSwapProps) {
  return (
    <Animated.View key={swapKey} entering={entering}>
      {children}
    </Animated.View>
  );
});
