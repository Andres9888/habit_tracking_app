/**
 * Duolingo-style press depth for the primary CTA: the button translates down
 * into its hard-shadow wrapper on press, then springs back. Reduced motion snaps.
 */

import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Springs } from '../../../constants/motion';

const PRESS_DEPTH = 3;

export function useCtaDepth({ reducedMotion }: { reducedMotion: boolean }) {
  const depth = useSharedValue(0);

  const pressHandlers = {
    onPressIn: () => {
      depth.value = reducedMotion ? PRESS_DEPTH : withSpring(PRESS_DEPTH, Springs.button);
    },
    onPressOut: () => {
      depth.value = reducedMotion ? 0 : withSpring(0, Springs.button);
    },
  };

  const depthStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: depth.value }],
  }));

  return { depthStyle, pressHandlers };
}
