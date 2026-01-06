/**
 * HeatmapTooltip Component
 *
 * Tooltip that displays date and status information when hovering (web)
 * or long-pressing (mobile) a cell in the binary heatmap.
 *
 * Tooltip content examples per spec:
 * - "Dec 15: Done ✓"
 * - "Jul 7: Missed"
 * - "Dec 30: Today"
 * - "Jan 5: Future"
 *
 * Styling per spec:
 * - Background: #1c1917 (stone-900)
 * - Text: white, 11px, font-weight 500
 * - Padding: 6px 10px
 * - Border-radius: 6px
 * - Arrow pointing down
 */

import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

import type { HeatmapTooltipProps } from './types';
import { formatTooltipText } from './utils';
import { COLORS, TOOLTIP } from './constants';
import { useReduceMotion } from '../../hooks/useReduceMotion';

const AnimatedView = Animated.createAnimatedComponent(View);

/**
 * HeatmapTooltip - Shows date and completion status on hover/long-press
 *
 * This component renders a floating tooltip positioned above a cell.
 * It displays the date and completion status in a compact format.
 *
 * Features:
 * - Fade-in/out animation
 * - Arrow pointing to the cell below
 * - Modal overlay for dismissal
 * - Respects reduced motion preferences
 */
export const HeatmapTooltip = memo(function HeatmapTooltip({
  day,
  position,
  visible,
  onClose,
}: HeatmapTooltipProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const reduceMotion = useReduceMotion();

  // Animation configuration
  const animationDuration = reduceMotion ? 0 : 150;

  // Handle visibility changes with animation
  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: animationDuration });
      // Use withTiming when reduced motion is enabled, withSpring otherwise
      scale.value = reduceMotion
        ? withTiming(1, { duration: 0 })
        : withSpring(1, { damping: 20, stiffness: 300 });
    } else {
      opacity.value = withTiming(0, { duration: animationDuration });
      scale.value = withTiming(0.9, { duration: animationDuration });
    }
  }, [visible, opacity, scale, animationDuration, reduceMotion]);

  // Animated styles for fade and scale
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  // Format the tooltip text using the utility function
  const tooltipText = formatTooltipText(day);

  // Don't render if not visible (after animation completes)
  if (!visible) {
    return null;
  }

  // Calculate tooltip position (centered above the cell)
  // Position.x and position.y represent the center-top of the target cell
  const tooltipStyle = {
    left: position.x,
    top: position.y - TOOLTIP.OFFSET,
  };

  return (
    <Modal
      transparent
      animationType='none'
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Backdrop for dismissing tooltip */}
      <Pressable
        accessibilityHint='Tap anywhere to close tooltip'
        accessibilityLabel='Close tooltip'
        accessibilityRole='button'
        style={styles.backdrop}
        onPress={onClose}
      >
        {/* Tooltip container */}
        <AnimatedView
          accessible
          accessibilityLabel={tooltipText}
          accessibilityLiveRegion='polite'
          accessibilityRole='tooltip'
          style={[styles.tooltip, tooltipStyle, animatedStyle]}
        >
          {/* Tooltip content */}
          <Text style={styles.tooltipText}>{tooltipText}</Text>

          {/* Arrow pointing down */}
          <View style={styles.arrow} />
        </AnimatedView>
      </Pressable>
    </Modal>
  );
});

const styles = StyleSheet.create({
  arrow: {
    alignSelf: 'center',
    borderLeftColor: 'transparent',
    borderLeftWidth: TOOLTIP.ARROW_SIZE,
    borderRightColor: 'transparent',
    borderRightWidth: TOOLTIP.ARROW_SIZE,
    borderTopColor: COLORS.TOOLTIP_BACKGROUND,
    borderTopWidth: TOOLTIP.ARROW_SIZE,
    bottom: -TOOLTIP.ARROW_SIZE,
    height: 0,
    position: 'absolute',
    width: 0,
  },
  backdrop: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  tooltip: {
    alignItems: 'center',
    backgroundColor: COLORS.TOOLTIP_BACKGROUND,
    borderRadius: TOOLTIP.BORDER_RADIUS,
    paddingHorizontal: TOOLTIP.PADDING_X,
    paddingVertical: TOOLTIP.PADDING_Y,
    position: 'absolute',
    // Transform to center the tooltip horizontally on the position point
    transform: [{ translateX: -50 }],
  },
  tooltipText: {
    color: COLORS.TOOLTIP_TEXT,
    fontSize: TOOLTIP.FONT_SIZE,
    fontWeight: '500',
  },
});

export default HeatmapTooltip;
