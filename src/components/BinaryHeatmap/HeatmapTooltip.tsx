/**
 * HeatmapTooltip Component
 *
 * Tooltip that displays date and status information on hover/long-press.
 */

import React, { memo, useEffect } from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { durations, springs } from '@/theme/animations';

import type { HeatmapTooltipProps } from './types';
import { formatTooltipText } from './utils';
import { TOOLTIP } from './constants';
import { styles } from './HeatmapTooltip.styles';

const AnimatedView = Animated.createAnimatedComponent(View);

export const HeatmapTooltip = memo(function HeatmapTooltip({
  day,
  position,
  visible,
  onClose,
}: HeatmapTooltipProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const reduceMotion = useReducedMotion();
  const animationDuration = reduceMotion ? 0 : durations.quick;

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: animationDuration });
      scale.value = reduceMotion
        ? withTiming(1, { duration: 0 })
        : withSpring(1, springs.sheet);
    } else {
      opacity.value = withTiming(0, { duration: animationDuration });
      scale.value = withTiming(0.9, { duration: animationDuration });
    }
  }, [visible, opacity, scale, animationDuration, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: opacity.value ?? 0,
      transform: [{ scale: scale.value ?? 0.9 }],
    };
  });
  const tooltipText = formatTooltipText(day);

  if (!visible) return null;

  // Anchor above the tapped cell so the downward arrow points back at it.
  // ~30px tooltip body + arrow, lifted clear of the finger.
  const tooltipStyle = {
    left: position.x,
    top: position.y - 30 - TOOLTIP.OFFSET,
  };

  return (
    <Modal
      accessibilityViewIsModal
      transparent
      animationType='none'
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        accessibilityHint='Tap anywhere to close tooltip'
        accessibilityLabel='Close tooltip'
        accessibilityRole='button'
        style={styles.backdrop}
        onPress={onClose}
      >
        <AnimatedView
          accessible
          accessibilityLabel={tooltipText}
          accessibilityLiveRegion='polite'
          accessibilityRole='alert'
          style={[styles.tooltip, tooltipStyle, animatedStyle]}
        >
          <Text style={styles.tooltipText}>{tooltipText}</Text>
          <View style={styles.arrow} />
        </AnimatedView>
      </Pressable>
    </Modal>
  );
});

export default HeatmapTooltip;
