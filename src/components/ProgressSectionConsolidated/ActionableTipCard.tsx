/**
 * ActionableTipCard Component
 *
 * CTA section with personalized actionable tip.
 * Uses violet/indigo gradient for visual appeal.
 *
 * Features:
 * - Gradient background (violet-50 to indigo-50)
 * - Icon container (40px circle, violet-100 bg)
 * - Tip text from generator
 * - Optional subtitle for context
 * - Chevron for tap affordance
 * - Press animation with spring
 * - Haptic feedback on tap
 * - Full accessibility support
 *
 * @see docs/specs/habit-details-screen/progress-consolidated-redesign.md
 */

import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { Springs } from '../../constants/motion';

import type { ActionableTipCardProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Duration of entrance animation (ms) */
const ENTRANCE_DURATION = 400;

/** Entrance animation delay (ms) - after other sections */
const ENTRANCE_DELAY = 200;

/**
 * ActionableTipCard Component
 *
 * Displays a personalized actionable tip with gradient background,
 * icon, and chevron for tap affordance.
 */
export function ActionableTipCard({
  tip,
  subtitle,
  onPress,
}: ActionableTipCardProps) {
  const reduceMotion = useReduceMotion();
  const { triggerLightImpact } = useHapticFeedback();

  // Entrance animation values
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const translateY = useSharedValue(reduceMotion ? 0 : 10);

  // Press animation
  const pressScale = useSharedValue(1);

  // Entrance animation effect
  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      translateY.value = 0;
      return;
    }

    opacity.value = withTiming(1, {
      duration: ENTRANCE_DURATION,
      easing: Easing.out(Easing.cubic),
    });

    translateY.value = withSpring(0, {
      damping: 18,
      stiffness: 120,
    });
  }, [reduceMotion, opacity, translateY]);

  // Press handlers
  const handlePressIn = () => {
    if (!onPress) return;
    pressScale.value = withSpring(0.98, Springs.button);
  };

  const handlePressOut = () => {
    if (!onPress) return;
    pressScale.value = withSpring(1, Springs.button);
  };

  const handlePress = () => {
    if (!onPress) return;
    triggerLightImpact();
    onPress();
  };

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: pressScale.value }],
  }));

  const isInteractive = !!onPress;

  const accessibilityLabel = subtitle
    ? `Tip: ${tip}. ${subtitle}`
    : `Tip: ${tip}`;
  const accessibilityHint = isInteractive
    ? 'Double tap to view details'
    : undefined;

  return (
    <AnimatedPressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={isInteractive ? 'button' : 'text'}
      disabled={!isInteractive}
      style={containerStyle}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View
        className='flex-row items-center gap-3 rounded-xl border border-violet-100 p-3'
        style={{
          // Gradient from violet-50 to indigo-50
          // Since RN doesn't support linear-gradient natively, we use a solid background
          // that matches the design intent (light violet/indigo tint)
          backgroundColor: '#f5f3ff', // violet-50
        }}
      >
        {/* Icon Container */}
        <View
          accessibilityElementsHidden
          className='h-10 w-10 flex-shrink-0 items-center justify-center rounded-full'
          importantForAccessibility='no-hide-descendants'
          style={{ backgroundColor: '#ede9fe' }} // violet-100
        >
          <Text className='text-lg'>💡</Text>
        </View>

        {/* Text Content */}
        <View className='flex-1'>
          <Text
            className='text-sm font-medium'
            style={{ color: '#4c1d95' }} // violet-900
          >
            {tip}
          </Text>
          {subtitle && (
            <Text
              className='mt-0.5 text-xs'
              style={{ color: '#7c3aed' }} // violet-600
            >
              {subtitle}
            </Text>
          )}
        </View>

        {/* Chevron (only when interactive) */}
        {isInteractive && (
          <View
            accessibilityElementsHidden
            importantForAccessibility='no-hide-descendants'
          >
            <Ionicons
              color='#a78bfa' // violet-400
              name='chevron-forward'
              size={20}
              style={{ flexShrink: 0 }}
            />
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
}

export default ActionableTipCard;
