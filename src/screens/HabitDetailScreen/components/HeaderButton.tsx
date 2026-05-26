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
import { borderRadius, spacing, componentSpacing } from '../../../theme/spacing';
import { OPACITY } from '../../../constants/ui-values';
import { buttonShadow } from './DetailHeader.constants';
import { springs } from '@/theme/animations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type HeaderButtonTone = 'subtle' | 'accent';

interface HeaderButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  label: string;
  text?: string;
  /**
   * Visual emphasis.
   * - `subtle`: neutral pill (default, used for low-priority actions).
   * - `accent`: tinted with the primary brand color for higher affordance.
   *   Use for actions we want users to discover (e.g. Edit, which is the
   *   gateway to customization & premium features).
   */
  tone?: HeaderButtonTone;
}

export function HeaderButton({
  onPress,
  icon,
  label,
  text,
  tone = 'subtle',
}: HeaderButtonProps) {
  const scale = useSharedValue(1);
  const { colors, isDark } = useThemeColors();
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    void triggerHaptic('tap');
    onPress();
  };

  const subtleFg = colors.text.secondary;
  const accentFg = colors.primary[700];
  const iconColor = tone === 'accent' ? accentFg : subtleFg;

  if (text) {
    const accentBg = isDark ? 'rgba(110,231,183,0.14)' : 'rgba(5,150,105,0.10)';
    const accentBorder = isDark
      ? 'rgba(110,231,183,0.22)'
      : 'rgba(5,150,105,0.20)';
    const subtleBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)';
    const subtleBorder = isDark
      ? 'rgba(255,255,255,0.1)'
      : 'rgba(0,0,0,0.08)';

    return (
      <AnimatedPressable
        accessibilityLabel={label}
        accessibilityRole='button'
        style={[
          s.textButton,
          animStyle,
          {
            backgroundColor: tone === 'accent' ? accentBg : subtleBg,
            borderColor: tone === 'accent' ? accentBorder : subtleBorder,
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
        <View style={{ opacity: tone === 'accent' ? 1 : OPACITY.high }}>
          {React.cloneElement(icon as React.ReactElement<{ color: string }>, {
            color: iconColor,
          })}
        </View>
        <Text
          style={[
            s.textLabel,
            {
              color: iconColor,
              fontWeight:
                tone === 'accent' ? fontWeights.semibold : fontWeights.medium,
            },
          ]}
        >
          {text}
        </Text>
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
    fontWeight: fontWeights.medium,
    letterSpacing: -0.2,
  },
});
