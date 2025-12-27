/**
 * HabitInput - Text input with animated focus states
 *
 * Features:
 * - Blue border on focus (per app pattern)
 * - Animated border color transition
 * - Light haptic feedback on focus
 * - Clear button (X) when text is present
 * - Character counter with color warnings (35+ chars: amber, 45+: red)
 * - Max length enforcement (50 characters)
 * - Keyboard submit support
 * - Forwarded ref for external focus control
 * - Proper accessibility labels
 */

import { forwardRef, useCallback, useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import { TIMING_CONFIGS } from './animations';
import {
  BORDER_RADIUS,
  CHARACTER_LIMIT,
  COLORS,
  COPY,
  TOUCH_TARGETS,
} from './constants';
import type { HabitInputProps } from './types';

const AnimatedView = Animated.createAnimatedComponent(View);

/**
 * Get character counter color based on length
 * - Default (stone-400): under warning threshold
 * - Warning (amber-500): 35+ characters
 * - Error (red-500): 45+ characters
 */
function getCharacterCounterColor(length: number): string {
  if (length >= CHARACTER_LIMIT.errorThreshold) {
    return COLORS.red500;
  }
  if (length >= CHARACTER_LIMIT.warningThreshold) {
    return COLORS.amber500;
  }
  return COLORS.stone400;
}

/**
 * X icon for clear button
 */
function ClearIcon() {
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: COLORS.stone200,
        borderRadius: 10,
        height: 20,
        justifyContent: 'center',
        width: 20,
      }}
    >
      <View
        style={{
          backgroundColor: COLORS.stone400,
          height: 2,
          position: 'absolute',
          transform: [{ rotate: '45deg' }],
          width: 10,
        }}
      />
      <View
        style={{
          backgroundColor: COLORS.stone400,
          height: 2,
          position: 'absolute',
          transform: [{ rotate: '-45deg' }],
          width: 10,
        }}
      />
    </View>
  );
}

/**
 * Text input for habit name with animated focus states
 */
export const HabitInput = forwardRef<TextInput, HabitInputProps>(
  function HabitInput(
    { value, onChangeText, onFocus, onBlur, onSubmitEditing, onClear },
    ref
  ) {
    const [isFocused, setIsFocused] = useState(false);
    const focusProgress = useSharedValue(0);
    const showClearButton = value.length > 0;
    const { triggerLightImpact } = useHapticFeedback();

    // Character counter: visible when focused or has text
    const showCharacterCounter = isFocused || value.length > 0;
    const characterCounterColor = useMemo(
      () => getCharacterCounterColor(value.length),
      [value.length]
    );

    const handleFocus = useCallback(() => {
      setIsFocused(true);
      focusProgress.value = withTiming(1, TIMING_CONFIGS.inputFocus);
      triggerLightImpact();
      onFocus?.();
    }, [focusProgress, onFocus, triggerLightImpact]);

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
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: BORDER_RADIUS.input,
            borderWidth: 2,
            elevation: isFocused ? 2 : 0,
            flexDirection: 'row',
            height: TOUCH_TARGETS.inputHeight,
            paddingHorizontal: 20,

            // Shadow properties
            shadowColor: COLORS.blue500,

            shadowOffset: { height: 0, width: 0 },
            shadowRadius: 8,
            width: '100%',
          },
        ]}
      >
        <TextInput
          ref={ref}
          accessibilityHint={`Type a habit you want to track daily, maximum ${CHARACTER_LIMIT.max} characters`}
          accessibilityLabel='Enter your habit name'
          autoCapitalize='sentences'
          autoCorrect={false}
          maxLength={CHARACTER_LIMIT.max}
          placeholder={COPY.inputPlaceholder}
          placeholderTextColor={COLORS.stone400}
          returnKeyType='done'
          selectionColor={COLORS.emeraldCaret}
          style={{
            color: COLORS.stone800,
            flex: 1,
            fontSize: 16,
            fontWeight: '500',
          }}
          value={value}
          onBlur={handleBlur}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onSubmitEditing={onSubmitEditing}
        />
        {showClearButton && (
          <Pressable
            accessibilityLabel='Clear input'
            accessibilityRole='button'
            hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
            style={({ pressed }) => ({
              marginLeft: 8,
              opacity: pressed ? 0.6 : 1,
            })}
            onPress={onClear}
          >
            <ClearIcon />
          </Pressable>
        )}
        {showCharacterCounter && (
          <Text
            accessibilityElementsHidden
            importantForAccessibility='no'
            style={{
              color: characterCounterColor,
              fontSize: 12,
              fontWeight: '500',
              marginLeft: 8,
            }}
          >
            {value.length}/{CHARACTER_LIMIT.max}
          </Text>
        )}
      </AnimatedView>
    );
  }
);
