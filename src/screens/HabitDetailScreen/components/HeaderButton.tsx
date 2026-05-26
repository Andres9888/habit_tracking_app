/** HeaderButton - Animated edit action with optional compact (icon-only) mode */
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../theme/typography';
import { borderRadius, spacing, componentSpacing } from '../../../theme/spacing';
import { buttonShadow } from './DetailHeader.constants';
import { springs } from '@/theme/animations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface HeaderButtonProps {
  accessibilityHint?: string;
  compact?: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  label: string;
  text?: string;
}

export function HeaderButton({
  accessibilityHint,
  compact = false,
  onPress,
  icon,
  label,
  text,
}: HeaderButtonProps) {
  const scale = useSharedValue(1);
  const { colors, isDark } = useThemeColors();
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const accentColor = colors.primary[700];
  const showText = Boolean(text) && !compact;

  const handlePress = () => {
    void triggerHaptic('tap');
    onPress();
  };

  const pressHandlers = {
    onPressIn: () => {
      scale.value = withSpring(0.92, springs.button);
    },
    onPressOut: () => {
      scale.value = withSpring(1, springs.button);
    },
  };

  const tintedBackground = isDark
    ? 'rgba(16, 185, 129, 0.14)'
    : 'rgba(16, 185, 129, 0.1)';
  const tintedBorder = isDark
    ? 'rgba(52, 211, 153, 0.35)'
    : 'rgba(5, 150, 105, 0.22)';

  if (showText) {
    return (
      <AnimatedPressable
        accessibilityHint={accessibilityHint}
        accessibilityLabel={label}
        accessibilityRole='button'
        style={[
          s.textButton,
          animStyle,
          {
            backgroundColor: tintedBackground,
            borderColor: tintedBorder,
          },
        ]}
        onPress={handlePress}
        {...pressHandlers}
      >
        {React.cloneElement(icon as React.ReactElement<{ color: string }>, {
          color: accentColor,
        })}
        <Text style={[s.textLabel, { color: accentColor }]}>{text}</Text>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={label}
      accessibilityRole='button'
      className='h-11 w-11 items-center justify-center rounded-full'
      style={[
        buttonShadow,
        animStyle,
        {
          backgroundColor: tintedBackground,
          borderColor: tintedBorder,
          borderWidth: 1,
        },
      ]}
      onPress={handlePress}
      {...pressHandlers}
    >
      {React.cloneElement(icon as React.ReactElement<{ color: string }>, {
        color: accentColor,
      })}
    </AnimatedPressable>
  );
}

const s = StyleSheet.create({
  textButton: {
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    height: componentSpacing.button.height,
    paddingHorizontal: spacing.base,
  },
  textLabel: {
    ...typography.bodySmall,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.2,
  },
});
