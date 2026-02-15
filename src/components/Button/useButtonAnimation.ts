import { Platform } from 'react-native';
import {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { springs } from '@/theme/animations';

/**
 * Custom hook for button press animation
 * Scale down to 0.96 on press (matches AnimatedPressable) + light haptic
 */
export function useButtonAnimation() {
  const scale = useSharedValue(1);
  const reduceMotion = useReducedMotion();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = reduceMotion
      ? withTiming(0.96, { duration: 0 })
      : withSpring(0.96, springs.button);
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  };

  const handlePressOut = () => {
    scale.value = reduceMotion
      ? withTiming(1, { duration: 0 })
      : withSpring(1, springs.button);
  };

  return { animatedStyle, handlePressIn, handlePressOut };
}
