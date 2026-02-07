/**
 * useSignInAnimations Hook
 *
 * Manages entrance animations for the sign-in screen:
 * logo scale/fade, header slide, and content slide.
 */

import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export function useSignInAnimations() {
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(20);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);

  useEffect(() => {
    // Logo entrance
    logoScale.value = withDelay(
      50,
      withSpring(1, { damping: 12, stiffness: 100 })
    );
    logoOpacity.value = withDelay(50, withTiming(1, { duration: 400 }));

    // Header entrance
    headerOpacity.value = withDelay(200, withTiming(1, { duration: 500 }));
    headerTranslateY.value = withDelay(200, withSpring(0, { damping: 15 }));

    // Content entrance
    contentOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    contentTranslateY.value = withDelay(400, withSpring(0, { damping: 15 }));
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
