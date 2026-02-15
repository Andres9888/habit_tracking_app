/**
 * CtaButton - Primary call-to-action button
 */

import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { useCallback } from 'react';

import * as Haptics from 'expo-haptics';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import type { CtaButtonProps } from './types';
import { COPY } from './constants';
import { CTA_SHIMMER } from './animations';
import { getCtaButtonStyle, ctaTextStyle } from './CtaButton.styles';
import { useCtaButtonAnimations } from './useCtaButtonAnimations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export function CtaButton({ disabled, isLoading, onPress }: CtaButtonProps) {
  const isDisabled = disabled || isLoading;

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
      style={[animatedStyle, getCtaButtonStyle(!!isDisabled)]}
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
        <ActivityIndicator color='#ffffff' size='small' />
      ) : (
        <Text style={ctaTextStyle}>{COPY.ctaButton}</Text>
      )}
    </AnimatedPressable>
  );
}
