import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { Motion } from '../../../../constants/motion';

export function usePremiumTeaserAnimations(habitName: string) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Entrance animation
  useEffect(() => {
    if (habitName.trim().length >= 3) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          delay: 500,
          duration: Motion.duration.enter,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          damping: 15,
          delay: 500,
          stiffness: 150,
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [habitName, opacityAnim, slideAnim]);

  // Shimmer animation loop
  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          duration: 1500,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          duration: 1500,
          toValue: 0,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, [shimmerAnim]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.6, 0.3],
  });

  return { opacityAnim, shimmerOpacity, slideAnim };
}
