/**
 * SwipeActions - Right swipe action panel
 */

import { triggerHaptic } from '@/utils/haptics';
import React from 'react';
import { Text, Pressable, Animated } from 'react-native';
import type { Swipeable } from 'react-native-gesture-handler';
import { styles } from './styles';
import type { SwipeColors } from './types';

interface SwipeActionsProps {
  dragX: Animated.AnimatedInterpolation<number>;
  swipeColors: SwipeColors;
  swipeLabel: string;
  label: string;
  swipeableRef: React.RefObject<Swipeable | null>;
  onSwipeAction?: () => void;
  SwipeIcon: React.ComponentType<{
    color: string;
    size: number;
    strokeWidth: number;
  }>;
}

export function SwipeActions({
  dragX,
  swipeColors,
  swipeLabel,
  label,
  swipeableRef,
  onSwipeAction,
  SwipeIcon,
}: SwipeActionsProps) {
  const trans = dragX.interpolate({
    extrapolate: 'clamp',
    inputRange: [-120, 0],
    outputRange: [0, 120],
  });

  // Progressive icon scale based on swipe progress (0.8 → 1.15)
  const iconScale = dragX.interpolate({
    extrapolate: 'clamp',
    inputRange: [-120, -80, -40, 0],
    outputRange: [1.15, 1.05, 0.9, 0.8],
  });

  // Progressive opacity for icon (0.6 → 1.0)
  const iconOpacity = dragX.interpolate({
    extrapolate: 'clamp',
    inputRange: [-120, -50, 0],
    outputRange: [1, 0.85, 0.6],
  });

  return (
    <Animated.View
      style={[styles.swipeAction, { transform: [{ translateX: trans }] }]}
    >
      <Pressable
        accessibilityLabel={`${swipeLabel} ${label}`}
        accessibilityRole='button'
        style={[styles.swipeActionInner, { backgroundColor: swipeColors.bg }]}
        onPress={() => {
          triggerHaptic('warning');
          swipeableRef.current?.close();
          onSwipeAction?.();
        }}
      >
        <Animated.View
          style={[
            styles.swipeIconContainer,
            {
              backgroundColor: swipeColors.iconBg,
              opacity: iconOpacity,
              transform: [{ scale: iconScale }],
            },
          ]}
        >
          <SwipeIcon color={swipeColors.text} size={20} strokeWidth={2} />
        </Animated.View>
        <Text style={[styles.swipeLabel, { color: swipeColors.text }]}>
          {swipeLabel}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
