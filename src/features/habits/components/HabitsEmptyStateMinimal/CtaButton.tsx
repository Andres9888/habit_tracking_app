/**
 * CtaButton - Primary call-to-action button
 */

import { useCallback } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useThemeColors } from '@/theme/ThemeContext';
import { CTA_SHIMMER } from './animations';
import { COPY } from './constants';
import type { CtaButtonProps } from './types';
import { useCtaButtonAnimations } from './useCtaButtonAnimations';
import { getCtaButtonStyle, getCtaTextStyle } from './CtaButton.styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export function CtaButton({ disabled, isLoading, onPress }: CtaButtonProps) {
  const isDisabled = disabled || isLoading;
  const { colors } = useThemeColors();

  const { animatedStyle, handlePressIn, handlePressOut, shimmerAnimatedStyle } =
    useCtaButtonAnimations({ disabled: !!disabled, isLoading: !!isLoading });

  const handlePress = useCallback(() => {
    if (disabled || isLoading) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [disabled, isLoading, onPress]);

  return (
    <AnimatedPressable
      accessibilityHint={
        isDisabled ? 'Enter a habit name first' : 'Creates your new habit'
      }
      accessibilityLabel={COPY.ctaButton}
      accessibilityRole='button'
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      style={[animatedStyle, getCtaButtonStyle(!!isDisabled, colors)]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <AnimatedLinearGradient
        colors={[
          'transparent',
          `rgba(255, 255, 255, ${CTA_SHIMMER.gradientOpacity})`,
          'transparent',
        ]}
        end={{ x: 1, y: 0.5 }}
        start={{ x: 0, y: 0.5 }}
        style={[
          StyleSheet.absoluteFillObject,
          { width: '100%' },
          shimmerAnimatedStyle,
        ]}
        testID='cta-shimmer-overlay'
      />
      {isLoading ? (
        <ActivityIndicator color={colors.text.inverse} size='small' />
      ) : (
        <Text style={getCtaTextStyle(colors)}>{COPY.ctaButton}</Text>
      )}
    </AnimatedPressable>
  );
}
