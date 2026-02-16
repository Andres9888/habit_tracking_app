/**
 * ActionButtons - Share and Continue buttons for milestone celebration
 * Uses theme-aware colors for dark mode support.
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../../theme/ThemeContext';
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
  const { colors } = useThemeColors();

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
          accessible
          accessibilityLabel="Share your achievement"
          accessibilityRole="button"
          style={[
            styles.primaryButton,
            { backgroundColor: colors.primary[500] },
            shareButtonAnimatedStyle,
          ]}
          onPress={handleShare}
        >
          <Text style={styles.primaryButtonText}>Share Achievement 🎉</Text>
        </AnimatedPressable>
      )}

      <AnimatedPressable
        accessible
        accessibilityLabel="Keep going"
        accessibilityRole="button"
        style={[
          styles.secondaryButton,
          { borderColor: colors.gray[300] },
          continueButtonAnimatedStyle,
        ]}
        onPress={handleContinue}
      >
        <Text
          style={[
            styles.secondaryButtonText,
            { color: colors.text.secondary },
          ]}
        >
          Continue
        </Text>
      </AnimatedPressable>
    </View>
  );
}
