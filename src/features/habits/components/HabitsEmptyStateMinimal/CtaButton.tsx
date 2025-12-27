/**
 * CtaButton - Primary call-to-action button
 *
 * Features:
 * - Disabled state with 40% opacity
 * - Press animation (scale 0.98)
 * - Hover animation (translateY -1px)
 * - Loading state with spinner
 */

import { useCallback } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { CTA_TRANSFORMS, SPRING_CONFIGS } from './animations';
import { BORDER_RADIUS, COLORS, COPY, TOUCH_TARGETS } from './constants';
import type { CtaButtonProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Primary action button with disabled/loading states
 */
export function CtaButton({ disabled, isLoading, onPress }: CtaButtonProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handlePressIn = useCallback(() => {
    if (disabled || isLoading) return;
    scale.value = withSpring(CTA_TRANSFORMS.pressScale, SPRING_CONFIGS.ctaPress);
  }, [disabled, isLoading, scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIGS.ctaPress);
    translateY.value = withSpring(0, SPRING_CONFIGS.ctaPress);
  }, [scale, translateY]);

  const handlePress = useCallback(() => {
    if (disabled || isLoading) return;
    onPress();
  }, [disabled, isLoading, onPress]);

  const isDisabled = disabled || isLoading;

  return (
    <AnimatedPressable
      accessibilityLabel={COPY.ctaButton}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      accessibilityHint={isDisabled ? 'Enter a habit name first' : 'Creates your new habit'}
      disabled={isDisabled}
      style={[
        animatedStyle,
        {
          backgroundColor: COLORS.emerald500,
          borderRadius: BORDER_RADIUS.cta,
          height: TOUCH_TARGETS.ctaHeight,
          paddingVertical: 16,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isDisabled ? 0.4 : 1,
          // Shadow for depth
          shadowColor: COLORS.emerald500,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: isDisabled ? 0 : 4,
        },
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {isLoading ? (
        <ActivityIndicator color="#ffffff" size="small" />
      ) : (
        <Text
          style={{
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '700',
          }}
        >
          {COPY.ctaButton}
        </Text>
      )}
    </AnimatedPressable>
  );
}
