/** HeaderButton - Animated button with scale + haptic feedback */
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { triggerHaptic } from '@/utils/haptics';
import { withAlpha } from '@/theme';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontWeights } from '../../../theme/typography';
import { OPACITY } from '../../../constants/ui-values';
import { springs } from '@/theme/animations';
import { headerButtonStyles as s } from './HeaderButton.styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type HeaderButtonTone = 'subtle' | 'accent';

interface HeaderButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  label: string;
  text?: string;
  tone?: HeaderButtonTone;
  /** Icon-only layout — frees header space when the title pins on scroll. */
  compact?: boolean;
}

function toneColors(
  tone: HeaderButtonTone,
  isDark: boolean,
  colors: ReturnType<typeof useThemeColors>['colors']
) {
  if (tone === 'accent') {
    return {
      bg: withAlpha(colors.primary[600], isDark ? 0.14 : 0.1),
      border: withAlpha(colors.primary[600], isDark ? 0.22 : 0.2),
      fg: colors.primary[700],
    };
  }
  const neutral = colors.gray[900];
  return {
    bg: withAlpha(neutral, isDark ? 0.08 : 0.04),
    border: withAlpha(neutral, isDark ? 0.1 : 0.08),
    fg: colors.text.secondary,
  };
}

export function HeaderButton({
  onPress,
  icon,
  label,
  text,
  tone = 'subtle',
  compact = false,
}: HeaderButtonProps) {
  const scale = useSharedValue(1);
  const { colors, isDark } = useThemeColors();
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const { bg, border, fg } = toneColors(tone, isDark, colors);
  const showText = Boolean(text) && !compact;

  const handlePress = () => {
    void triggerHaptic('tap');
    onPress();
  };

  const pressHandlers = {
    onPress: handlePress,
    onPressIn: () => {
      scale.value = withSpring(0.92, springs.button);
    },
    onPressOut: () => {
      scale.value = withSpring(1, springs.button);
    },
  };

  return (
    <AnimatedPressable
      accessibilityLabel={label}
      accessibilityRole='button'
      style={[
        showText ? s.textButton : s.compactButton,
        animStyle,
        { backgroundColor: bg, borderColor: border },
      ]}
      {...pressHandlers}
    >
      <View style={{ opacity: tone === 'accent' ? 1 : OPACITY.high }}>
        {React.cloneElement(icon as React.ReactElement<{ color: string }>, {
          color: fg,
        })}
      </View>
      {showText ? (
        <Text
          style={[
            s.textLabel,
            {
              color: fg,
              fontWeight:
                tone === 'accent' ? fontWeights.semibold : fontWeights.medium,
            },
          ]}
        >
          {text}
        </Text>
      ) : null}
    </AnimatedPressable>
  );
}
