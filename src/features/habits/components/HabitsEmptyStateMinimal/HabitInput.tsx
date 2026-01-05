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

import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { useAutocompleteAnalytics } from './analytics';
import { TIMING_CONFIGS } from './animations';
import {
  BORDER_RADIUS,
  CHARACTER_LIMIT,
  COLORS,
  COPY,
  TOUCH_TARGETS,
} from './constants';
import type { HabitInputProps } from './types';
import { getBestSuggestion, getBestSuggestionWithMatchType, getInlinePreview } from './utils';

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
    const [matchType, setMatchType] = useState<'prefix' | 'word' | 'keyword' | 'fuzzy' | null>(
      null
    );
    const previousSuggestionRef = useRef<string | null>(null);
    const focusProgress = useSharedValue(0);
    const showClearButton = value.length > 0;
    const { triggerLightImpact } = useHapticFeedback();
    const autocompleteAnalytics = useAutocompleteAnalytics();

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
          const result = getBestSuggestionWithMatchType(value);
          if (result) {
            setInlineSuggestion(result.suggestion);
            setMatchType(result.matchType);

            // Track suggestion shown (only if it's a new suggestion)
            if (result.suggestion !== previousSuggestionRef.current) {
              autocompleteAnalytics.trackSuggestionShown(
                value,
                result.suggestion,
                result.matchType
              );
              previousSuggestionRef.current = result.suggestion;
            }
          } else {
            // No match found
            if (previousSuggestionRef.current !== null) {
              autocompleteAnalytics.trackNoMatch(value);
            }
            setInlineSuggestion(null);
            setMatchType(null);
            previousSuggestionRef.current = null;
          }
        } else {
          setInlineSuggestion(null);
          setMatchType(null);
          previousSuggestionRef.current = null;
        }
      }, 50); // 50ms debounce - feels instant but prevents excessive updates

      return () => clearTimeout(timer);
    }, [value, autocompleteAnalytics]);

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

      // Track suggestion dismissed if user blurred with an active suggestion
      if (inlineSuggestion && value !== inlineSuggestion) {
        autocompleteAnalytics.trackSuggestionDismissed(
          value,
          inlineSuggestion,
          'blur'
        );
      }

      onBlur?.();
    }, [focusProgress, onBlur, inlineSuggestion, value, autocompleteAnalytics]);

    // Handle keyboard shortcuts for accepting suggestions
    const handleKeyPress = useCallback(
      (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        const key = e.nativeEvent.key;

        // Accept suggestion on Tab or Right Arrow
        if ((key === 'Tab' || key === 'ArrowRight') && inlineSuggestion) {
          e.preventDefault();

          // Track suggestion accepted
          autocompleteAnalytics.trackSuggestionAccepted(
            value,
            inlineSuggestion,
            key === 'Tab' ? 'tab' : 'arrow_right'
          );

          onChangeText(inlineSuggestion);
          setInlineSuggestion(null);
          setMatchType(null);
          previousSuggestionRef.current = null;
        }
        // Dismiss suggestions on Escape
        else if (key === 'Escape' && inlineSuggestion) {
          // Track suggestion dismissed
          autocompleteAnalytics.trackSuggestionDismissed(
            value,
            inlineSuggestion,
            'escape'
          );

          setInlineSuggestion(null);
          setMatchType(null);
          previousSuggestionRef.current = null;
        }
      },
      [inlineSuggestion, value, onChangeText, autocompleteAnalytics]
    );

    // Wrap onSubmitEditing to track ignored suggestions
    const handleSubmitEditing = useCallback(() => {
      // If user submits with a suggestion visible but didn't accept it, track as ignored
      if (inlineSuggestion && value !== inlineSuggestion) {
        autocompleteAnalytics.trackSuggestionIgnored(
          value,
          inlineSuggestion,
          value // final input is what they submitted
        );
      }

      onSubmitEditing?.();
    }, [inlineSuggestion, value, onSubmitEditing, autocompleteAnalytics]);

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
          onSubmitEditing={handleSubmitEditing}
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
