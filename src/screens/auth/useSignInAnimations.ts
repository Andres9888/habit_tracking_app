/**
 * useSignInAnimations Hook
 *
 * Manages entrance animations for the sign-in screen:
 * logo scale/fade, header slide, and content slide.
 * Spring config: damping(18), 60ms stagger
 */

import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const SPRING_CONFIG = { damping: 18, stiffness: 120 };
const STAGGER = 60;

export function useSignInAnimations() {
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(20);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);

  useEffect(() => {
    // Logo entrance
    logoScale.value = withSpring(1, SPRING_CONFIG);
    logoOpacity.value = withTiming(1, { duration: 280 });

    // Header entrance (60ms stagger)
    headerOpacity.value = withDelay(STAGGER, withTiming(1, { duration: 280 }));
    headerTranslateY.value = withDelay(STAGGER, withSpring(0, SPRING_CONFIG));

    // Content entrance (120ms stagger)
    contentOpacity.value = withDelay(STAGGER * 2, withTiming(1, { duration: 280 }));
    contentTranslateY.value = withDelay(STAGGER * 2, withSpring(0, SPRING_CONFIG));
  }, [
    contentOpacity,
    contentTranslateY,
    headerOpacity,
    headerTranslateY,
    logoOpacity,
    logoScale,
  ]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  return { contentStyle, headerStyle, logoStyle };
}
