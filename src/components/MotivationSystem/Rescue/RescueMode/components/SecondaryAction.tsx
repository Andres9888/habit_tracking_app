import React, { useCallback } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SPRING_BUTTON } from '../RescueMode.constants';
import { useThemeColors } from '../../../../../theme/ThemeContext';
import { triggerHaptic } from '@/utils/haptics';

interface SecondaryActionProps {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  variant?: 'default' | 'destructive';
}

/**
 * SecondaryAction - Less prominent action buttons
 */
export function SecondaryAction({
  label,
  icon,
  onPress,
  variant = 'default',
}: SecondaryActionProps) {
  const { colors } = useThemeColors();
  const scale = useSharedValue(1);

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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View className='flex-1' style={animatedStyle}>
      <Pressable
        accessibilityLabel={label}
        accessibilityRole='button'
        className='flex-row items-center justify-center gap-2 rounded-xl px-4 py-3'
        style={{ backgroundColor: variant === 'destructive' ? colors.background : colors.status.successLight }}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {icon}
        <Text
          className='font-medium'
          style={{ color: variant === 'destructive' ? colors.text.secondary : colors.status.successText }}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
