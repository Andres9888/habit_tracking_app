import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

interface AnimationValues {
  progressAnim: Animated.Value;
  celebrationScale: Animated.Value;
  glowOpacity: Animated.Value;
  flameScale: Animated.Value;
  progressWidth: Animated.AnimatedInterpolation<string | number>;
}

export function useAnimations(
  percentage: number,
  reduceMotion: boolean
): AnimationValues {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const celebrationScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const flameScale = useRef(new Animated.Value(1)).current;

  // Animate progress on change
  useEffect(() => {
    if (reduceMotion) {
      progressAnim.setValue(percentage);
      return;
    }

    Animated.spring(progressAnim, {
      friction: 8,
      tension: 40,
      toValue: percentage,
      useNativeDriver: false,
    }).start();
  }, [percentage, reduceMotion, progressAnim]);

  // Celebration animation at 100%
  useEffect(() => {
    if (percentage === 100 && !reduceMotion) {
      // Pulse celebration
      Animated.loop(
        Animated.sequence([
          Animated.timing(celebrationScale, {
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            toValue: 1.03,
            useNativeDriver: true,
          }),
          Animated.timing(celebrationScale, {
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            toValue: 1,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Glow animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, {
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            toValue: 0.5,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Flame bounce
      Animated.loop(
        Animated.sequence([
          Animated.timing(flameScale, {
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            toValue: 1.15,
            useNativeDriver: true,
          }),
          Animated.timing(flameScale, {
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            toValue: 1,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      celebrationScale.setValue(1);
      glowOpacity.setValue(0);
      flameScale.setValue(1);
    }
  }, [percentage, reduceMotion, celebrationScale, glowOpacity, flameScale]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return {
    celebrationScale,
    flameScale,
    glowOpacity,
    progressAnim,
    progressWidth,
  };
}
