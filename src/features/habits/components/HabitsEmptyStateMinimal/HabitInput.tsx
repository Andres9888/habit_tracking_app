/**
 * HabitInput - Text input with animated focus states
 *
 * Features:
 * - Blue border on focus (per app pattern)
 * - Animated border color transition
 * - Clear button (X) when text is present
 * - Keyboard submit support
 * - Forwarded ref for external focus control
 * - Proper accessibility labels
 */

import { forwardRef, useCallback, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
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
 * X icon for clear button
 */
function ClearIcon() {
  return (
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: COLORS.stone200,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: 10,
          height: 2,
          backgroundColor: COLORS.stone400,
          position: 'absolute',
          transform: [{ rotate: '45deg' }],
        }}
      />
      <View
        style={{
          width: 10,
          height: 2,
          backgroundColor: COLORS.stone400,
          position: 'absolute',
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </View>
  );
}

/**
 * Text input for habit name with animated focus states
 */
export const HabitInput = forwardRef<TextInput, HabitInputProps>(
  function HabitInput({ value, onChangeText, onFocus, onBlur, onSubmitEditing, onClear }, ref) {
    const [isFocused, setIsFocused] = useState(false);
    const focusProgress = useSharedValue(0);
    const showClearButton = value.length > 0;

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
            width: '100%',
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
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
          onSubmitEditing={onSubmitEditing}
          style={{
            flex: 1,
            fontSize: 16,
            fontWeight: '500',
            color: COLORS.stone800,
          }}
          selectionColor={COLORS.emeraldCaret}
        />
        {showClearButton && (
          <Pressable
            accessibilityLabel="Clear input"
            accessibilityRole="button"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={onClear}
            style={({ pressed }) => ({
              marginLeft: 8,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <ClearIcon />
          </Pressable>
        )}
      </AnimatedView>
    );
  }
);
