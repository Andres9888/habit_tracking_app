import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

interface AnimationValues {
  progressScaleX: Animated.AnimatedInterpolation<number>;
  celebrationScale: Animated.Value;
  glowOpacity: Animated.Value;
  flameScale: Animated.Value;
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

    const anim = Animated.spring(progressAnim, {
      friction: 8,
      tension: 40,
      toValue: percentage,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [percentage, reduceMotion, progressAnim]);

  // Celebration animation at 100%
  useEffect(() => {
    if (percentage === 100 && !reduceMotion) {
      const celebrationLoop = Animated.loop(
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
      );

      const glowLoop = Animated.loop(
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
      );

      const flameLoop = Animated.loop(
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
      );

      celebrationLoop.start();
      glowLoop.start();
      flameLoop.start();

      return () => {
        celebrationLoop.stop();
        glowLoop.stop();
        flameLoop.stop();
      };
    } else {
      celebrationScale.setValue(1);
      glowOpacity.setValue(0);
      flameScale.setValue(1);
    }
  }, [percentage, reduceMotion, celebrationScale, glowOpacity, flameScale]);

  // Map 0-100 percentage to 0-1 scaleX (native driver compatible)
  const progressScaleX = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return {
    celebrationScale,
    flameScale,
    glowOpacity,
    progressScaleX,
  };
}
