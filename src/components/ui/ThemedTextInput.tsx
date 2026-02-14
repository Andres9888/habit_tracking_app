/**
 * ThemedTextInput - Dark-mode-aware TextInput with consistent styling.
 *
 * Provides a unified look across the app: rounded-2xl, proper padding,
 * animated focus border, and full dark mode support via useThemeColors().
 */

import { forwardRef } from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export interface ThemedTextInputProps extends TextInputProps {
  /** Show focus ring animation (default: true) */
  animateFocus?: boolean;
}

export const ThemedTextInput = forwardRef<TextInput, ThemedTextInputProps>(
  function ThemedTextInput({ animateFocus = true, style, onFocus, onBlur, ...props }, ref) {
    const { colors, isDark } = useThemeColors();
    const focusProgress = useSharedValue(0);

    const bgColor = isDark ? colors.card : '#FFFFFF';
    const borderDefault = isDark ? colors.cardBorder : '#DDD8D2';
    const borderFocused = isDark ? '#34D399' : '#10B981';
    const textColor = colors.text.primary;
    const placeholderColor = isDark ? colors.text.tertiary : '#A8A29E';

    const animatedStyle = useAnimatedStyle(() => {
      if (!animateFocus) {
        return {
          backgroundColor: bgColor,
          borderColor: borderDefault,
          borderWidth: 1,
          borderRadius: 16,
        };
      }
      return {
        backgroundColor: bgColor,
        borderColor: interpolateColor(
          focusProgress.value,
          [0, 1],
          [borderDefault, borderFocused]
        ),
        borderWidth: 1,
        borderRadius: 16,
        shadowColor: borderFocused,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: focusProgress.value * 0.15,
        shadowRadius: focusProgress.value * 4,
        elevation: focusProgress.value * 2,
      };
    });

    return (
      <AnimatedTextInput
        ref={ref}
        placeholderTextColor={placeholderColor}
        style={[
          animatedStyle,
          {
            color: textColor,
            fontSize: 15,
            fontWeight: '500',
            paddingHorizontal: 16,
            paddingVertical: 12,
          },
          style,
        ]}
        onFocus={(e) => {
          if (animateFocus) {
            focusProgress.value = withTiming(1, { duration: 200 });
          }
          onFocus?.(e);
        }}
        onBlur={(e) => {
          if (animateFocus) {
            focusProgress.value = withTiming(0, { duration: 200 });
          }
          onBlur?.(e);
        }}
        {...props}
      />
    );
  }
);
