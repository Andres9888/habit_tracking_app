import { Plus } from 'lucide-react-native';
import { memo, useCallback } from 'react';
import { Keyboard, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { durations, enterEasing, exitEasing } from '@/theme/animations';
import { colors } from '../../../../theme/colors/core';
import { borderRadius } from '../../../../theme/spacing';
import type { CustomColorButtonProps } from './types';
import { AnimatedPressable } from '../../../ui';
import { iconSizes } from '@/theme/iconSizes';

/**
 * Custom color button with dashed border and plus icon
 * V9: Updated to 36px to match color swatches
 * V12: Updated to 44px to match larger color swatches
 */
const CustomColorButtonComponent = ({ onPress }: CustomColorButtonProps) => {
  const scale = useSharedValue(1);
  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const { triggerSelection } = useHapticFeedback();

  const handlePress = useCallback(() => {
    Keyboard.dismiss();
    triggerSelection();
    onPress();
  }, [onPress, triggerSelection]);

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.96, {
      duration: durations.instant,
      easing: exitEasing,
    });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, {
      duration: durations.quick,
      easing: enterEasing,
    });
  }, [scale]);

  return (
    <View
      style={{
        alignItems: 'center',
        height: 52,
        justifyContent: 'center',
        width: 52,
      }}
    >
      <Animated.View style={scaleStyle}>
        <AnimatedPressable
          disableAnimation
          accessibilityLabel='Choose custom color'
          accessibilityRole='button'
          style={{
            alignItems: 'center',
            borderColor: colors.gray[400],
            borderRadius: borderRadius.full,
            borderStyle: 'dashed',
            borderWidth: 2,
            height: 44,
            justifyContent: 'center',
            width: 44,
          }}
          testID='color-swatch-custom'
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Plus color={colors.gray[400]} size={iconSizes.medium} />
        </AnimatedPressable>
      </Animated.View>
    </View>
  );
};

export const CustomColorButton = memo(CustomColorButtonComponent);
