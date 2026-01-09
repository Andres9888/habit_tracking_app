import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export function useCustomHabitCardAnimations() {
  const pressScale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const iconGlow = useSharedValue(0);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1800 }),
        withTiming(1, { duration: 1800 })
      ),
      -1,
      true
    );

    iconGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800 }),
        withTiming(0, { duration: 1800 })
      ),
      -1,
      true
    );
  }, [pulseScale, iconGlow]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: 0.2 + iconGlow.value * 0.15,
    shadowRadius: 8 + iconGlow.value * 4,
  }));

  return { animatedStyle, glowStyle, pressScale, pulseStyle };
}
