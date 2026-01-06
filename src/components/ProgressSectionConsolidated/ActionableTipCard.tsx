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
 * - Quick actions bottom sheet on press
 * - Full accessibility support
 *
 * @see docs/specs/habit-details-screen/progress-consolidated-redesign.md
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
import { TipQuickActionsSheet } from './TipQuickActionsSheet';
import {
  determineTipTypeFromText,
  type QuickAction,
} from './TipQuickActionsSheetTypes';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Duration of entrance animation (ms) */
const ENTRANCE_DURATION = 400;

/**
 * ActionableTipCard Component
 *
 * Displays a personalized actionable tip with gradient background,
 * icon, and chevron for tap affordance.
 * Now includes a quick actions bottom sheet for immediate user action.
 * Memoized to prevent re-renders when parent updates unrelated props.
 */
export const ActionableTipCard = React.memo(function ActionableTipCard({
  tip,
  subtitle,
  currentStreak = 0,
  onPress,
  onQuickAction,
}: ActionableTipCardProps) {
  const reduceMotion = useReduceMotion();
  const { triggerLightImpact } = useHapticFeedback();

  // Quick actions sheet state
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  // Determine tip type and focus day from tip text
  const { tipType, focusDayName } = useMemo(
    () => determineTipTypeFromText(tip, currentStreak),
    [tip, currentStreak]
  );

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
  const handlePressIn = useCallback(() => {
    pressScale.value = withSpring(0.98, Springs.button);
  }, [pressScale]);

  const handlePressOut = useCallback(() => {
    pressScale.value = withSpring(1, Springs.button);
  }, [pressScale]);

  const handlePress = useCallback(() => {
    triggerLightImpact();
    // If onQuickAction is provided, show the quick actions sheet
    if (onQuickAction) {
      setIsSheetVisible(true);
    }
    // Also call legacy onPress if provided
    onPress?.();
  }, [triggerLightImpact, onQuickAction, onPress]);

  const handleSheetClose = useCallback(() => {
    setIsSheetVisible(false);
  }, []);

  const handleQuickAction = useCallback(
    (action: QuickAction) => {
      onQuickAction?.(action);
    },
    [onQuickAction]
  );

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: pressScale.value }],
  }));

  // The card is interactive if onPress or onQuickAction is provided
  const isInteractive = !!onPress || !!onQuickAction;

  const accessibilityLabel = subtitle
    ? `Tip: ${tip}. ${subtitle}`
    : `Tip: ${tip}`;
  const accessibilityHint = isInteractive
    ? onQuickAction
      ? 'Double tap to view quick actions'
      : 'Double tap to open this tip'
    : undefined;

  return (
    <>
      <AnimatedPressable
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={isInteractive ? 'button' : 'text'}
        disabled={!isInteractive}
        style={containerStyle}
        testID='actionable-tip-card'
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

      {/* Quick Actions Bottom Sheet */}
      {onQuickAction && (
        <TipQuickActionsSheet
          currentStreak={currentStreak}
          focusDayName={focusDayName}
          tipText={tip}
          tipType={tipType}
          visible={isSheetVisible}
          onActionPress={handleQuickAction}
          onClose={handleSheetClose}
        />
      )}
    </>
  );
});

export default ActionableTipCard;
