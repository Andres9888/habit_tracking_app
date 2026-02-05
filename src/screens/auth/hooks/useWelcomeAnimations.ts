/**
 * useWelcomeAnimations - Entrance animations for WelcomeScreen
 */

import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export function useWelcomeAnimations() {
  const iconScale = useSharedValue(0.8);
  const iconOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(15);
  const subtitleOpacity = useSharedValue(0);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(15);

  useEffect(() => {
    iconOpacity.value = withDelay(100, withSpring(1));
    iconScale.value = withDelay(100, withSpring(1));
    titleOpacity.value = withDelay(250, withSpring(1));
    titleTranslateY.value = withDelay(250, withSpring(0));
    subtitleOpacity.value = withDelay(350, withSpring(1));
    buttonsOpacity.value = withDelay(450, withTiming(1, { duration: 300 }));
    buttonsTranslateY.value = withDelay(450, withSpring(0));
  }, [
    buttonsOpacity,
    buttonsTranslateY,
    iconOpacity,
    iconScale,
    subtitleOpacity,
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
  }));

  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsTranslateY.value }],
  }));

  return { buttonsStyle, iconStyle, subtitleStyle, titleStyle };
}
