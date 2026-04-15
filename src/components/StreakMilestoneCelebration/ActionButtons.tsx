/**
 * ActionButtons - Continue button for milestone celebration
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { styles } from './styles';
import { triggerHaptic } from '@/utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ActionButtonsProps {
  onClose: () => void;
  continueButtonAnimatedStyle: AnimatedStyle;
}

export function ActionButtons({
  onClose,
  continueButtonAnimatedStyle,
}: ActionButtonsProps) {
  const handleContinue = useCallback(() => {
    triggerHaptic('tap');
    onClose();
  }, [onClose]);

  return (
    <View style={styles.actionsContainer}>
      <AnimatedPressable
        accessible
        accessibilityLabel="Keep going"
        accessibilityRole="button"
        style={[styles.secondaryButton, continueButtonAnimatedStyle]}
        onPress={handleContinue}
      >
        <Text style={styles.secondaryButtonText}>Keep Going</Text>
      </AnimatedPressable>
    </View>
  );
}
