/**
 * Animation hooks for HabitPreview
 */
import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

export const usePreviewAnimations = (
  isEmpty: boolean,
  selectedEmoji: string | null,
  habitName: string,
  selectedColor: string
) => {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const iconScale = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contentScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Brief skeleton on mount
  useEffect(() => {
    setShowSkeleton(true);
    const timer = setTimeout(() => setShowSkeleton(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Pulse ring animation on emoji icon
  useEffect(() => {
    if (!isEmpty && selectedEmoji) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            duration: 1200,
            toValue: 1.15,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            duration: 1200,
            toValue: 1,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isEmpty, selectedEmoji, pulseAnim]);

  // Trigger spring animation when content changes
  useEffect(() => {
    if (!isEmpty) {
      Animated.sequence([
        Animated.spring(iconScale, {
          friction: 8,
          tension: 180,
          toValue: 1.15,
          useNativeDriver: true,
        }),
        Animated.spring(iconScale, {
          friction: 8,
          tension: 180,
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.sequence([
        Animated.spring(contentScale, {
          friction: 10,
          tension: 200,
          toValue: 1.02,
          useNativeDriver: true,
        }),
        Animated.spring(contentScale, {
          friction: 10,
          tension: 200,
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [
    habitName,
    selectedEmoji,
    selectedColor,
    isEmpty,
    iconScale,
    contentScale,
  ]);

  return {
    contentOpacity,
    contentScale,
    iconScale,
    pulseAnim,
    showSkeleton,
  };
};
