/**
 * PaywallCTA - Primary amber accent CTA button
 */

import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated from 'react-native-reanimated';
import { useCTAEntryAnimation } from './usePaywallEntryAnimations';
import { useCTAPressAnimation } from './usePaywallInteractionAnimations';
import { PAYWALL_COLORS, SPACING } from './paywall.constants';
import type { PlanType } from './types';

interface PaywallCTAProps {
  isProcessing: boolean;
  onPress: () => void;
  reduceMotion: boolean;
  selectedPlan: PlanType;
  visible: boolean;
}

export function PaywallCTA({
  visible,
  reduceMotion,
  isProcessing,
  selectedPlan,
  onPress,
}: PaywallCTAProps) {
  const { animatedStyle: entryStyle } = useCTAEntryAnimation(
    visible,
    reduceMotion
  );
  const {
    animatedStyle: pressStyle,
    handlePressIn,
    handlePressOut,
  } = useCTAPressAnimation(reduceMotion);
  const buttonText = selectedPlan === 'yearly' ? 'Continue' : 'Start Premium';

  return (
    <Animated.View
      style={[styles.container, reduceMotion ? undefined : entryStyle]}
    >
      <Pressable
        accessibilityHint={`Subscribe to the ${selectedPlan} plan`}
        accessibilityLabel={buttonText}
        accessibilityRole='button'
        disabled={isProcessing}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            styles.button,
            reduceMotion ? undefined : pressStyle,
            isProcessing && styles.buttonDisabled,
          ]}
        >
          {isProcessing ? (
            <ActivityIndicator color='#FFFFFF' size='small' />
          ) : (
            <Text style={styles.buttonText}>{buttonText}</Text>
          )}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: PAYWALL_COLORS.accent,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  container: { marginBottom: SPACING.md, paddingHorizontal: SPACING.lg },
});
