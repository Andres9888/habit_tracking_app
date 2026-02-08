/**
 * ActionButtons - Share and Continue buttons for milestone celebration
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { styles } from './styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ActionButtonsProps {
  onShare?: () => void;
  onClose: () => void;
  shareButtonAnimatedStyle: AnimatedStyle;
  continueButtonAnimatedStyle: AnimatedStyle;
}

export function ActionButtons({
  onShare,
  onClose,
  shareButtonAnimatedStyle,
  continueButtonAnimatedStyle,
}: ActionButtonsProps) {
  const handleShare = useCallback(() => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    onShare?.();
  }, [onShare]);

  const handleContinue = useCallback(() => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    onClose();
  }, [onClose]);

  return (
    <View style={styles.actionsContainer}>
      {onShare && (
        <AnimatedPressable
          style={[styles.primaryButton, shareButtonAnimatedStyle]}
          onPress={handleShare}
          accessible
          accessibilityLabel="Share your achievement"
          accessibilityRole="button"
        >
          <Text style={styles.primaryButtonText}>Share 🎉</Text>
        </AnimatedPressable>
      )}

      <AnimatedPressable
        style={[styles.secondaryButton, continueButtonAnimatedStyle]}
        onPress={handleContinue}
        accessible
        accessibilityLabel="Continue"
        accessibilityRole="button"
      >
        <Text style={styles.secondaryButtonText}>Continue</Text>
      </AnimatedPressable>
    </View>
  );
}
