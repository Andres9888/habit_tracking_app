/**
 * ActionButton - Reusable button for permission actions
 */

import React, { useCallback } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { clsx } from 'clsx';
import { SPRING_BUTTON } from '../../../animations';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { ActionButtonProps } from './types';
import { triggerHaptic } from '@/utils/haptics';

export function ActionButton({
  label,
  icon: Icon,
  onPress,
  variant = 'primary',
  accessibilityLabel,
  accessibilityHint,
}: ActionButtonProps) {
  const { colors } = useThemeColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, SPRING_BUTTON);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_BUTTON);
  }, [scale]);

  const handlePress = useCallback(() => {
    triggerHaptic('tap');
    onPress();
  }, [onPress]);

  const isPrimary = variant === 'primary';

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='button'
        className='flex-row items-center justify-center gap-2 rounded-xl px-4 py-3'
        style={{ backgroundColor: isPrimary ? colors.status.success : colors.background }}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Icon
          color={isPrimary ? '#ffffff' : colors.text.secondary}
          size={18}
        />
        <Text
          className={clsx(
            'font-semibold',
            isPrimary ? 'text-white' : ''
          )}
          style={isPrimary ? undefined : { color: colors.text.primary }}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
