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
  const { colors: themeColors, isDark } = useThemeColors();
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
      style={[
        buttonShadow,
        {
          backgroundColor: isDark ? themeColors.gray[200] : themeColors.gray[50],
          shadowColor: isDark ? '#000000' : '#1c1917',
        },
        animStyle,
      ]}
      onPress={handlePress}
      onPressIn={() => {
        scale.value = withSpring(0.92, { damping: 18, stiffness: 240 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 18, stiffness: 240 });
      }}
    >
      {icon}
    </AnimatedPressable>
  );
}
