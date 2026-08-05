/**
 * SuccessState - Post-creation celebration screen
 *
 * Features:
 * - Pop animation on the success icon
 * - Confetti particles floating upward
 * - Habit name confirmation
 * - Auto-transition to habit list with shared element animation
 * - Tap anywhere to skip and transition immediately
 * - "Add another habit" button to reset (if staying on empty state)
 */

import { useEffect, useCallback } from 'react';
import { AccessibilityInfo, Pressable } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { Confetti } from './Confetti';
import { SuccessContent } from './SuccessContent';
import { SuccessIcon } from './SuccessIcon';
import type { SuccessStateProps } from './types';
import { useSuccessStateAnimations } from './useSuccessStateAnimations';

export function SuccessState({
  habitName,
  habitEmoji,
  onAddAnother,
  onTransitionComplete,
  autoTransition = true,
}: SuccessStateProps) {
  const shouldReduceMotion = useReducedMotion();

  const displayEmoji = habitEmoji || '🌿';

  const {
    iconStyle,
    contentStyle,
    containerStyle,
    tapHintStyle,
    ringStyle,
    burstStyle,
    triggerExitAnimation,
  } = useSuccessStateAnimations({
    autoTransition,
    onTransitionComplete,
    shouldReduceMotion,
  });

  // Tap to skip handler
  const handleTapToSkip = useCallback(() => {
    if (!autoTransition || !onTransitionComplete) return;
    triggerExitAnimation();
  }, [autoTransition, onTransitionComplete, triggerExitAnimation]);

  // Accessibility announcement on mount (haptic fires in useHabitCreationFlow)
  useEffect(() => {
    const message = `Success! ${habitName} has been added to your habits. Tap anywhere to continue.`;
    AccessibilityInfo?.announceForAccessibility?.(message);
  }, [habitName]);

  return (
    <Pressable
      accessible={Boolean(autoTransition && onTransitionComplete)}
      accessibilityHint={
        autoTransition && onTransitionComplete
          ? 'Double tap to skip celebration and continue immediately'
          : undefined
      }
      accessibilityLabel={
        autoTransition && onTransitionComplete
          ? 'Success celebration. Tap anywhere to continue.'
          : 'Success celebration'
      }
      accessibilityRole={
        autoTransition && onTransitionComplete ? 'button' : 'none'
      }
      style={{ flex: 1 }}
      onPress={handleTapToSkip}
    >
      <Animated.View
        style={[
          containerStyle,
          {
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
          },
        ]}
      >
        <Confetti shouldReduceMotion={shouldReduceMotion ?? false} />

        <SuccessIcon
          autoTransition={autoTransition}
          burstStyle={burstStyle}
          emoji={displayEmoji}
          iconStyle={iconStyle}
          ringStyle={ringStyle}
        />

        <SuccessContent
          autoTransition={autoTransition}
          contentStyle={contentStyle}
          habitName={habitName}
          tapHintStyle={tapHintStyle}
          onAddAnother={onAddAnother}
        />
      </Animated.View>
    </Pressable>
  );
}
