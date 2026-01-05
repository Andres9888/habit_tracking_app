/**
 * HabitInput - Text input with animated focus states and autocomplete
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
 * - **Inline autocomplete**: Shows gray preview text as you type (3+ chars)
 * - **Tab/→ to accept**: Accept suggestion with Tab or Right Arrow key
 * - **Escape to dismiss**: Clear suggestion preview
 * - **Debounced updates**: 50ms delay for smooth performance
 */

import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import {
  NativeSyntheticEvent,
  Pressable,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native';
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
import { getBestSuggestion, getInlinePreview } from './utils';

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
    const [inlineSuggestion, setInlineSuggestion] = useState<string | null>(
      null
    );
    const focusProgress = useSharedValue(0);
    const showClearButton = value.length > 0;
    const { triggerLightImpact } = useHapticFeedback();

    // Character counter: visible when focused or has text
    const showCharacterCounter = isFocused || value.length > 0;
    const characterCounterColor = useMemo(
      () => getCharacterCounterColor(value.length),
      [value.length]
    );

    // Update suggestion on input change (debounced for performance)
    useEffect(() => {
      const timer = setTimeout(() => {
        if (value.length >= 3) {
          const suggestion = getBestSuggestion(value);
          setInlineSuggestion(suggestion);
        } else {
          setInlineSuggestion(null);
        }
      }, 50); // 50ms debounce - feels instant but prevents excessive updates

      return () => clearTimeout(timer);
    }, [value]);

    // Get preview text (the part that extends beyond user input)
    const previewText = inlineSuggestion
      ? getInlinePreview(value, inlineSuggestion)
      : '';

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

    // Handle keyboard shortcuts for accepting suggestions
    const handleKeyPress = useCallback(
      (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        const key = e.nativeEvent.key;

        // Accept suggestion on Tab or Right Arrow
        if ((key === 'Tab' || key === 'ArrowRight') && inlineSuggestion) {
          e.preventDefault();
          onChangeText(inlineSuggestion);
          setInlineSuggestion(null);
        }
        // Dismiss suggestions on Escape
        else if (key === 'Escape') {
          setInlineSuggestion(null);
        }
      },
      [inlineSuggestion, onChangeText]
    );

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
        {/* Inline preview (gray text behind input) - positioned absolutely */}
        {previewText && (
          <Text
            accessibilityElementsHidden
            importantForAccessibility='no'
            pointerEvents='none'
            style={{
              color: COLORS.stone400,
              fontSize: 16,
              fontWeight: '500',
              left: 20,
              position: 'absolute',
            }}
          >
            {/* Invisible spacer to align preview with cursor position */}
            <Text style={{ opacity: 0 }}>{value}</Text>
            {previewText}
          </Text>
        )}

        <TextInput
          ref={ref}
          accessibilityHint={
            inlineSuggestion
              ? `Suggestion available: ${inlineSuggestion}. Press Tab to accept.`
              : `Type a habit you want to track daily, maximum ${CHARACTER_LIMIT.max} characters`
          }
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
          onKeyPress={handleKeyPress}
          onSubmitEditing={onSubmitEditing}
        />
        {showClearButton && (
          <Pressable
            accessibilityLabel='Clear input'
            accessibilityRole='button'
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
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
