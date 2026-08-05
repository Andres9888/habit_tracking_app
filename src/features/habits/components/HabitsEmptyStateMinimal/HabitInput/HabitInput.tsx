/**
 * HabitInput - Text input with animated focus states and cycling hint
 */

import { forwardRef, useMemo } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { buildTextInputHintProps } from '@/utils/textInputHintProps';
import { CHARACTER_LIMIT, COPY } from '../constants';
import type { HabitInputProps } from '../types';
import { useEmptyStateColors } from '../useEmptyStateColors';
import { ClearIcon } from './ClearIcon';
import { getCharacterCounterColor } from './helpers';
import { useAnimatedPlaceholder } from './useAnimatedPlaceholder';
import { useInputAnimations } from './useInputAnimations';
import {
  getContainerStyle,
  getInputTextStyle,
  clearButtonPressedStyle,
  characterCounterStyle,
  placeholderOverlayStyle,
} from './inputStyles';

const AnimatedView = Animated.createAnimatedComponent(View);

export const HabitInput = forwardRef<TextInput, HabitInputProps>(
  function HabitInput(
    { value, onChangeText, onFocus, onBlur, onSubmitEditing, onClear },
    ref
  ) {
    const colors = useEmptyStateColors();
    const { isFocused, containerStyle, handleFocus, handleBlur } =
      useInputAnimations({ onBlur, onFocus });

    const rotatingPrompt = useAnimatedPlaceholder({ inputValue: value });

    const showClearButton = value.length > 0;
    const showCounter = isFocused || showClearButton;
    const counterColor = useMemo(
      () =>
        getCharacterCounterColor(
          value.length,
          colors.counterNormal,
          colors.counterWarning,
          colors.counterError
        ),
      [value.length, colors]
    );

    return (
      <AnimatedView
        style={[
          containerStyle,
          getContainerStyle({
            isFocused,
            backgroundColor: colors.inputBackground,
            shadowColor: colors.inputBorderFocused,
          }),
        ]}
      >
        {rotatingPrompt.isActive ? <Animated.Text
            accessibilityElementsHidden
            importantForAccessibility='no'
            style={[placeholderOverlayStyle(colors.inputPlaceholder), rotatingPrompt.animatedStyle]}
          >
            {rotatingPrompt.displayText}
          </Animated.Text> : null}
        <TextInput
          ref={ref}
          accessibilityHint='Type a habit name and press return to create it'
          accessibilityLabel='Habit name input'
          autoCapitalize='sentences'
          autoCorrect={false}
          maxLength={CHARACTER_LIMIT.max}
          returnKeyType='done'
          selectionColor={colors.inputCaret}
          style={getInputTextStyle(colors.inputText)}
          testID='habit-input'
          value={value}
          {...buildTextInputHintProps(
            COPY.inputPlaceholder,
            rotatingPrompt.isActive ? 'transparent' : colors.inputPlaceholder
          )}
          onBlur={handleBlur}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onSubmitEditing={onSubmitEditing}
        />
        {showClearButton ? <Pressable
            accessibilityHint='Clear the habit name input'
            accessibilityLabel='Clear input'
            accessibilityRole='button'
            hitSlop={{ bottom: 12, left: 12, right: 12, top: 12 }}
            style={({ pressed }) => clearButtonPressedStyle(pressed)}
            onPress={onClear}
          >
            <ClearIcon
              backgroundColor={colors.textTertiary}
              glyphColor={colors.textSecondary}
            />
          </Pressable> : null}
        {showCounter ? <Text
            accessibilityElementsHidden
            importantForAccessibility='no'
            style={characterCounterStyle(counterColor)}
          >
            {value.length}/{CHARACTER_LIMIT.max}
          </Text> : null}
      </AnimatedView>
    );
  }
);
