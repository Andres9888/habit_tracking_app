/**
 * Toast Action Buttons
 * Includes haptic feedback and press animation for better tactile response
 */

import React from 'react';
import { Text, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';

import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useAppTheme } from '../../theme';
import type { ToastVariant } from './types';
import { styles } from './styles';
import { useToastButtonAnimation } from './useToastButtonAnimation';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ToastActionsProps {
  variant: ToastVariant;
  textColor: string;
  actionLabel: string;
  onAction?: () => void;
  onDismiss: () => void;
}

function ActionButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  const theme = useAppTheme();
  const { triggerLightImpact } = useHapticFeedback();
  const { animatedStyle, handlePressIn, handlePressOut } =
    useToastButtonAnimation({ pressedScale: 0.92 });

  return (
    <AnimatedPressable
      accessibilityLabel={label}
      accessibilityRole='button'
      style={[styles.actionButton, animatedStyle]}
      onPress={() => {
        triggerLightImpact();
        onPress();
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text
        style={[
          theme.custom.typography.button,
          { color: theme.custom.colors.primary[400] },
        ]}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

function DismissButton({
  textColor,
  onDismiss,
}: {
  textColor: string;
  onDismiss: () => void;
}) {
  const { triggerLightImpact } = useHapticFeedback();
  const { animatedStyle, handlePressIn, handlePressOut } =
    useToastButtonAnimation({ pressedScale: 0.85 });

  return (
    <AnimatedPressable
      accessibilityLabel='Dismiss'
      accessibilityRole='button'
      hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
      style={[styles.dismissButton, animatedStyle]}
      onPress={() => {
        triggerLightImpact();
        onDismiss();
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text style={[styles.dismissIcon, { color: textColor }]}>✕</Text>
    </AnimatedPressable>
  );
}

export function ToastActions({
  variant,
  textColor,
  actionLabel,
  onAction,
  onDismiss,
}: ToastActionsProps) {
  if ((variant === 'undo' || variant === 'error') && onAction) {
    return (
      <ActionButton
        label={actionLabel}
        onPress={() => {
          onAction();
          onDismiss();
        }}
      />
    );
  }

  return <DismissButton textColor={textColor} onDismiss={onDismiss} />;
}
