/** HeaderButton - Animated button with scale + haptic feedback */
import React from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../../../theme/ThemeContext';
import { buttonShadow } from './DetailHeader.constants';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface HeaderButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  label: string;
}

export function HeaderButton({ onPress, icon, label }: HeaderButtonProps) {
  const scale = useSharedValue(1);
  const { colors } = useThemeColors();
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <AnimatedPressable
      accessibilityLabel={label}
      accessibilityRole='button'
      className='h-11 w-11 items-center justify-center rounded-full'
      style={[buttonShadow, animStyle, { backgroundColor: colors.card }]}
      onPress={handlePress}
      onPressIn={() => {
        scale.value = withSpring(0.92, { damping: 18, stiffness: 150 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 18, stiffness: 150 });
      }}
    >
      {icon}
    </AnimatedPressable>
  );
}
