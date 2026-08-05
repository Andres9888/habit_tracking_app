/**
 * PaywallCTA — forest green gradient purchase button
 */

import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import { colors } from '../../theme/colors/core';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import type { PaywallCTAProps } from './paywall.types';

export function PaywallCTA({
  isProcessing,
  isDisabled,
  label,
  onPress,
  onPressIn,
  onPressOut,
  buttonAnimatedStyle,
}: PaywallCTAProps) {
  return (
    <View style={{ marginTop: spacing.lg, paddingHorizontal: spacing.base }}>
      <Pressable
        accessibilityHint="Opens subscription purchase flow"
        accessibilityLabel={label}
        accessibilityRole="button"
        disabled={isDisabled || isProcessing}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Animated.View style={buttonAnimatedStyle}>
          <LinearGradient
            colors={[colors.primary[700], colors.primary[600]]}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
            style={{
              alignItems: 'center',
              borderRadius: borderRadius.button,
              flexDirection: 'row',
              gap: spacing.sm,
              height: 52,
              justifyContent: 'center',
              opacity: isDisabled ? 0.5 : 1,
            }}
          >
            {isProcessing ? (
              <ActivityIndicator color={colors.text.inverse} size="small" />
            ) : (
              <Text
                style={{
                  ...typography.button,
                  color: colors.text.inverse,
                }}
              >
                {label}
              </Text>
            )}
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </View>
  );
}
