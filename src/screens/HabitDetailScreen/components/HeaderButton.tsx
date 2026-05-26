/** HeaderButton - Animated button with scale + haptic feedback */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../theme/typography';
import { borderRadius, spacing } from '../../../theme/spacing';
import { OPACITY } from '../../../constants/ui-values';
import { buttonShadow } from './DetailHeader.constants';
import { springs } from '@/theme/animations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface HeaderButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  label: string;
  hint?: string;
  text?: string;
}

export function HeaderButton({
  onPress,
  icon,
  label,
  hint,
  text,
}: HeaderButtonProps) {
  const scale = useSharedValue(1);
  const { colors, isDark } = useThemeColors();
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    void triggerHaptic('tap');
    onPress();
  };

  const iconColor = text ? colors.primary[700] : colors.text.secondary;
  const textButtonColors = {
    backgroundColor: isDark ? colors.primary[100] : colors.status.successLight,
    borderColor: colors.primary[300],
  };

  if (text) {
    return (
      <AnimatedPressable
        accessibilityHint={hint}
        accessibilityLabel={label}
        accessibilityRole='button'
        style={[s.textButton, animStyle, textButtonColors]}
        onPress={handlePress}
        onPressIn={() => {
          scale.value = withSpring(0.92, springs.button);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, springs.button);
        }}
      >
        <View style={{ opacity: OPACITY.high }}>
          {React.cloneElement(icon as React.ReactElement<{ color: string }>, {
            color: iconColor,
          })}
        </View>
        <Text style={[s.textLabel, { color: iconColor }]}>{text}</Text>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      accessibilityLabel={label}
      accessibilityRole='button'
      className='h-11 w-11 items-center justify-center rounded-full'
      style={[buttonShadow, animStyle, { backgroundColor: colors.card }]}
      onPress={handlePress}
      onPressIn={() => {
        scale.value = withSpring(0.92, springs.button);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, springs.button);
      }}
    >
      {icon}
    </AnimatedPressable>
  );
}

const s = StyleSheet.create({
  textButton: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    height: 40,
    paddingHorizontal: spacing.md,
  },
  textLabel: {
    ...typography.bodySmall,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.2,
  },
});
