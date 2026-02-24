/**
 * AnimatedEntrance - Staggered fade-in-up animation wrapper
 *
 * Features:
 * - Fade in from opacity 0 → 1
 * - Translate up from +20 → 0
 * - Configurable delay for staggered entrance
 * - Respects reduce motion preference
 */

import { type ReactNode, useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

import { SPRING_CONFIGS } from './animations';

interface AnimatedEntranceProps {
  /** Child elements to animate */
  children: ReactNode;
  /** Delay in milliseconds before animation starts */
  delay?: number;
  /** Starting Y offset (positive = below final position) */
  translateY?: number;
}

/**
 * Wraps children in a fade-in-up animation with optional delay
 *
 * @param delay - Delay before animation starts (default: 0)
 * @param translateY - Starting Y offset (default: 20)
 */
export function AnimatedEntrance({
  children,
  delay = 0,
  translateY: initialTranslateY = 20,
}: AnimatedEntranceProps) {
  const shouldReduceMotion = useReducedMotion();
  const opacity = useSharedValue(shouldReduceMotion ? 1 : 0);
  const translateY = useSharedValue(shouldReduceMotion ? 0 : initialTranslateY);

  useEffect(() => {
    if (shouldReduceMotion) {
      opacity.value = 1;
      translateY.value = 0;
      return;
    }

    // Animate to final position with delay
    opacity.value = withDelay(delay, withSpring(1, SPRING_CONFIGS.entrance));
    translateY.value = withDelay(delay, withSpring(0, SPRING_CONFIGS.entrance));
  }, [delay, opacity, shouldReduceMotion, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[{ alignSelf: 'stretch' as const }, animatedStyle]}>
      {children}
    </Animated.View>
  );
}
