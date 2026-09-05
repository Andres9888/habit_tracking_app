/**
 * SwipeActions - Right swipe action panel
 * Now with progressive haptic feedback at swipe thresholds
 */

import React from 'react';
import { Text, Pressable } from 'react-native';
import Animated, { type SharedValue } from 'react-native-reanimated';
import type { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { styles } from './styles';
import type { SwipeColors } from './types';
import { iconSizes } from '@/theme/iconSizes';
import { triggerHaptic } from '@/utils/haptics';
import { useSwipeActionsAnimation } from './useSwipeActionsAnimation';

interface SwipeActionsProps {
  dragX: SharedValue<number>;
  swipeColors: SwipeColors;
  swipeLabel: string;
  label: string;
  swipeableRef: React.RefObject<SwipeableMethods | null>;
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
  const { containerStyle, iconStyle } = useSwipeActionsAnimation(dragX);

  return (
    <Animated.View style={[styles.swipeAction, containerStyle]}>
      <Pressable
        accessibilityLabel={`${swipeLabel} ${label}`}
        accessibilityRole='button'
        style={[styles.swipeActionInner, { backgroundColor: swipeColors.bg }]}
        onPress={() => {
          triggerHaptic('heavy');
          swipeableRef.current?.close();
          onSwipeAction?.();
        }}
      >
        <Animated.View
          style={[
            styles.swipeIconContainer,
            { backgroundColor: swipeColors.iconBg },
            iconStyle,
          ]}
        >
          <SwipeIcon color={swipeColors.text} size={iconSizes.medium} strokeWidth={2} />
        </Animated.View>
        <Text style={[styles.swipeLabel, { color: swipeColors.text }]}>
          {swipeLabel}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
