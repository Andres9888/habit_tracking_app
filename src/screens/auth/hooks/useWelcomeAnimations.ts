/**
 * useWelcomeAnimations - Entrance animations for WelcomeScreen
 * Uses consistent spring config: damping(18) with 60ms stagger
 */

import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';
const STAGGER = 60;

export function useWelcomeAnimations() {
  const iconScale = useSharedValue(0.8);
  const iconOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(15);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(15);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(15);

  useEffect(() => {
    // Stagger: 0, 60, 120, 180ms
    iconOpacity.value = withSpring(1, springs.standard);
    iconScale.value = withSpring(1, springs.standard);

    titleOpacity.value = withDelay(STAGGER, withSpring(1, springs.standard));
    titleTranslateY.value = withDelay(STAGGER, withSpring(0, springs.standard));

    subtitleOpacity.value = withDelay(
      STAGGER * 2,
      withSpring(1, springs.standard)
    );
    subtitleTranslateY.value = withDelay(
      STAGGER * 2,
      withSpring(0, springs.standard)
    );

    buttonsOpacity.value = withDelay(
      STAGGER * 3,
      withSpring(1, springs.standard)
    );
    buttonsTranslateY.value = withDelay(
      STAGGER * 3,
      withSpring(0, springs.standard)
    );
  }, [
    buttonsOpacity,
    buttonsTranslateY,
    iconOpacity,
    iconScale,
    subtitleOpacity,
    subtitleTranslateY,
    titleOpacity,
    titleTranslateY,
  ]);

  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsTranslateY.value }],
  }));

  return {
    buttonsStyle,
    iconStyle,
    subtitleStyle,
    titleStyle,
  };
}
