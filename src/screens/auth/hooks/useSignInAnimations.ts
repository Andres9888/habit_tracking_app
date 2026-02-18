/**
 * useSignInAnimations Hook
 * 
 * Manages the three-step entrance animation for SignInScreen:
 * 1. Logo scales and fades in
 * 2. Header text appears with slide-up (60ms stagger)
 * 3. Form content appears with slide-up (60ms stagger)
 * 
 * This extracts repeated animation logic to reduce duplication
 * and improve readability of the main screen component.
 */

import { useEffect } from 'react';
import { useSharedValue, useAnimatedStyle, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import { SPRING_CONFIG, ANIMATION_DURATIONS, ANIMATION_SEQUENCES } from '../../../constants/animations';

interface UseSignInAnimationsReturn {
  logoStyle: ReturnType<typeof useAnimatedStyle>;
  headerStyle: ReturnType<typeof useAnimatedStyle>;
  contentStyle: ReturnType<typeof useAnimatedStyle>;
}

/**
 * Create entrance animations for SignInScreen
 * @returns Animated styles for logo, header, and content sections
 */
export function useSignInAnimations(): UseSignInAnimationsReturn {
  // Logo animation values
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);

  // Header animation values (60ms stagger from logo)
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(20);

  // Content animation values (60ms stagger from header)
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);

  // Trigger all animations on mount
  useEffect(() => {
    // Logo entrance: scale up + fade in at start
    logoScale.value = withDelay(
      ANIMATION_SEQUENCES.LOGO,
      withSpring(1, SPRING_CONFIG)
    );
    logoOpacity.value = withDelay(
      ANIMATION_SEQUENCES.LOGO,
      withTiming(1, { duration: ANIMATION_DURATIONS.STANDARD })
    );

    // Header entrance: slide up + fade in (60ms after logo)
    headerOpacity.value = withDelay(
      ANIMATION_SEQUENCES.HEADER_STEP2,
      withTiming(1, { duration: ANIMATION_DURATIONS.STANDARD })
    );
    headerTranslateY.value = withDelay(
      ANIMATION_SEQUENCES.HEADER_STEP2,
      withSpring(0, SPRING_CONFIG)
    );

    // Content entrance: slide up + fade in (60ms after header)
    contentOpacity.value = withDelay(
      ANIMATION_SEQUENCES.CONTENT_STEP2,
      withTiming(1, { duration: ANIMATION_DURATIONS.STANDARD })
    );
    contentTranslateY.value = withDelay(
      ANIMATION_SEQUENCES.CONTENT_STEP2,
      withSpring(0, SPRING_CONFIG)
    );
  }, []);

  // Animated styles for each section
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

  return { logoStyle, headerStyle, contentStyle };
}
