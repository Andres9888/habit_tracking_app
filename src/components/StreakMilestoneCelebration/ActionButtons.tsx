/**
 * ActionButtons - Share and Continue buttons for milestone celebration
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, type ViewStyle } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { styles } from './styles';
import { triggerHaptic } from '@/utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ActionButtonsProps {
  onShare?: () => void;
  onClose: () => void;
  shareButtonAnimatedStyle: AnimatedStyle<ViewStyle>;
  continueButtonAnimatedStyle: AnimatedStyle<ViewStyle>;
}

export function ActionButtons({
  onShare,
  onClose,
  shareButtonAnimatedStyle,
  continueButtonAnimatedStyle,
}: ActionButtonsProps) {
  const handleShare = useCallback(() => {
    triggerHaptic('tap');
    onShare?.();
  }, [onShare]);

  const handleContinue = useCallback(() => {
    triggerHaptic('tap');
    onClose();
  }, [onClose]);

  return (
    <View style={styles.actionsContainer}>
      {onShare ? <AnimatedPressable
          accessible
          accessibilityLabel="Share your achievement"
          accessibilityRole="button"
          style={[styles.primaryButton, shareButtonAnimatedStyle]}
          onPress={handleShare}
        >
          <Text style={styles.primaryButtonText}>Share Achievement 🎉</Text>
        </AnimatedPressable> : null}

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
