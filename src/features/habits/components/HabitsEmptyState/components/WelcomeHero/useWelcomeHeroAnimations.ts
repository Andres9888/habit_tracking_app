import { useEffect } from 'react';
import {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export function useWelcomeHeroAnimations() {
  const waveRotation = useSharedValue(0);
  const streakPulse = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    waveRotation.value = withRepeat(
      withSequence(
        withTiming(14, { duration: 300 }),
        withTiming(-8, { duration: 200 }),
        withTiming(14, { duration: 200 }),
        withTiming(-4, { duration: 200 }),
        withTiming(0, { duration: 300 }),
        withDelay(2000, withTiming(0, { duration: 0 }))
      ),
      -1,
      false
    );

    streakPulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1200 }),
        withTiming(1, { duration: 1200 })
      ),
      -1,
      true
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 2000 }),
        withTiming(0.3, { duration: 2000 })
      ),
      -1,
      true
    );

    return () => {
      cancelAnimation(waveRotation);
      cancelAnimation(streakPulse);
      cancelAnimation(glowOpacity);
    };
  }, [waveRotation, streakPulse, glowOpacity]);

  const waveStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${waveRotation.value}deg` }],
  }));

  const streakStyle = useAnimatedStyle(() => ({
    transform: [{ scale: streakPulse.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return { glowStyle, streakStyle, waveStyle };
}
