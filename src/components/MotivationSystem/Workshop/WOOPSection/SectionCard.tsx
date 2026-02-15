/**
 * SectionCard Component
 * Consistent card styling with press animation
 */

import React, { useCallback } from 'react';
import { View, Pressable } from 'react-native';

import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { clsx } from 'clsx';

import { SPRING_BUTTON } from '../../../animations';
import { shadows } from '../../../../theme/spacing';

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
}

export function SectionCard({
  children,
  className,
  onPress,
  accessibilityLabel,
}: SectionCardProps) {
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.05);
  const elevation = useSharedValue(2);

  const animatedStyle = useAnimatedStyle(() => ({
    elevation: elevation.value,
    shadowOffset: {
      height: interpolate(elevation.value, [1, 2], [1, 2]),
      width: 0,
    },
    shadowOpacity: shadowOpacity.value,
    shadowRadius: interpolate(elevation.value, [1, 2], [4, 8]),
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, SPRING_BUTTON);
    shadowOpacity.value = withSpring(0.02, SPRING_BUTTON);
    elevation.value = withSpring(1, SPRING_BUTTON);
  }, [scale, shadowOpacity, elevation]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_BUTTON);
    shadowOpacity.value = withSpring(0.05, SPRING_BUTTON);
    elevation.value = withSpring(2, SPRING_BUTTON);
  }, [scale, shadowOpacity, elevation]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  }, [onPress]);

  if (onPress) {
    return (
      <Animated.View style={[animatedStyle, { shadowColor: '#1c1917' }]}>
        <Pressable
          accessibilityLabel={accessibilityLabel}
          accessibilityRole='button'
          className={clsx(
            'rounded-xl border border-stone-200 bg-white p-3',
            className
          )}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {children}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <View
      className={clsx(
        'rounded-xl border border-stone-200 bg-white p-3',
        className
      )}
      style={{
        ...shadows.card,
        shadowOpacity: 0.05,
      }}
    >
      {children}
    </View>
  );
}
