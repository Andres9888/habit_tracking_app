/**
 * HabitInput - Text input with animated focus states
 *
 * Features:
 * - Blue border on focus (per app pattern)
 * - Animated border color transition
 * - Forwarded ref for external focus control
 * - Proper accessibility labels
 */

import { forwardRef, useCallback, useState } from 'react';
import { TextInput, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { TIMING_CONFIGS } from './animations';
import { BORDER_RADIUS, COLORS, COPY, TOUCH_TARGETS } from './constants';
import type { HabitInputProps } from './types';

const AnimatedView = Animated.createAnimatedComponent(View);

/**
 * Text input for habit name with animated focus states
 */
export const HabitInput = forwardRef<TextInput, HabitInputProps>(
  function HabitInput({ value, onChangeText, onFocus, onBlur }, ref) {
    const [isFocused, setIsFocused] = useState(false);
    const focusProgress = useSharedValue(0);

    const handleFocus = useCallback(() => {
      setIsFocused(true);
      focusProgress.value = withTiming(1, TIMING_CONFIGS.inputFocus);
      onFocus?.();
    }, [focusProgress, onFocus]);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
      focusProgress.value = withTiming(0, TIMING_CONFIGS.inputFocus);
      onBlur?.();
    }, [focusProgress, onBlur]);

    const containerStyle = useAnimatedStyle(() => ({
      borderColor: interpolateColor(
        focusProgress.value,
        [0, 1],
        [COLORS.stone200, COLORS.blue500]
      ),
      // Subtle shadow ring on focus
      shadowOpacity: focusProgress.value * 0.15,
    }));

    return (
      <AnimatedView
        style={[
          containerStyle,
          {
            backgroundColor: '#ffffff',
            borderWidth: 2,
            borderRadius: BORDER_RADIUS.input,
            height: TOUCH_TARGETS.inputHeight,
            paddingHorizontal: 20,
            justifyContent: 'center',
            // Shadow properties
            shadowColor: COLORS.blue500,
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 8,
            elevation: isFocused ? 2 : 0,
          },
        ]}
      >
        <TextInput
          ref={ref}
          accessibilityLabel="Enter your habit name"
          accessibilityHint="Type a habit you want to track daily"
          autoCapitalize="sentences"
          autoCorrect={false}
          placeholder={COPY.inputPlaceholder}
          placeholderTextColor={COLORS.stone400}
          returnKeyType="done"
          value={value}
          onBlur={handleBlur}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: COLORS.stone800,
          }}
          selectionColor={COLORS.emeraldCaret}
        />
      </AnimatedView>
    );
  }
);
