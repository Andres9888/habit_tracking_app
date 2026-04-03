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
import { typography } from '../../../theme/typography';
import { borderRadius, spacing, componentSpacing } from '../../../theme/spacing';
import { OPACITY } from '../../../constants/ui-values';
import { buttonShadow } from './DetailHeader.constants';
import { springs } from '@/theme/animations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface HeaderButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  label: string;
  text?: string;
}

export function HeaderButton({
  onPress,
  icon,
  label,
  text,
}: HeaderButtonProps) {
  const scale = useSharedValue(1);
  const { colors, isDark } = useThemeColors();
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    void triggerHaptic('tap');
    onPress();
  };

  const iconColor = colors.text.secondary;

  if (text) {
    return (
      <AnimatedPressable
        accessibilityLabel={label}
        accessibilityRole='button'
        style={[
          s.textButton,
          animStyle,
          {
            backgroundColor: isDark
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(0,0,0,0.04)',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          },
        ]}
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
  textButton: { alignItems: 'center', borderRadius: borderRadius.xl, borderWidth: 1, flexDirection: 'row', gap: spacing.sm, height: componentSpacing.button.height, paddingHorizontal: spacing.base },
  textLabel: {
    ...typography.bodySmall,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
});
