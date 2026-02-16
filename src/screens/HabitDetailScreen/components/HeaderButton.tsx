/** HeaderButton - Animated button with scale + haptic feedback */
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../../../theme/ThemeContext';
import { buttonShadow } from './DetailHeader.constants';
import { useThemeColors } from '@/theme/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface HeaderButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  label: string;
}

export function HeaderButton({ onPress, icon, label }: HeaderButtonProps) {
  const { colors } = useThemeColors();
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
      style={[
        buttonShadow,
        animStyle,
        styles.button,
        { backgroundColor: `${colors.surface}E6` },
      ]}
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

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 9999,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
});
