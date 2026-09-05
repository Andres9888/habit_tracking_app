/**
 * AnimatedColorButton - Animated pressable button with selection animation.
 * Used for color picker buttons in StyleSection.
 */

import { useCallback } from 'react';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { useColorButtonAnimations } from './useColorButtonAnimations';

export interface AnimatedColorButtonProps {
  accessibilityLabel: string;
  children: React.ReactNode;
  isSelected: boolean;
  onPress: () => void;
  style?: object;
}

export function AnimatedColorButton({
  accessibilityLabel,
  children,
  isSelected,
  onPress,
  style,
}: AnimatedColorButtonProps) {
  const { handlePressIn, handlePressOut, scale } =
    useColorButtonAnimations(isSelected);
  const { triggerSelection } = useHapticFeedback();
  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    triggerSelection();
    onPress();
  }, [onPress, triggerSelection]);

  return (
    <Animated.View style={scaleStyle}>
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='button'
        accessibilityState={{ selected: isSelected }}
        style={style}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
