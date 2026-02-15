/**
 * HabitInput - Text input with animated focus states
 */

import { Pressable, Text, TextInput, View } from 'react-native';
import { forwardRef, useMemo } from 'react';

import Animated from 'react-native-reanimated';

import type { HabitInputProps } from '../types';
import {
  getContainerStyle,
  inputTextStyle,
  clearButtonPressedStyle,
  characterCounterStyle,
} from './inputStyles';
import { CHARACTER_LIMIT, COLORS, COPY } from '../constants';
import { ClearIcon } from './ClearIcon';
import { getCharacterCounterColor } from './helpers';
import { useInputAnimations } from './useInputAnimations';

const AnimatedView = Animated.createAnimatedComponent(View);

export const HabitInput = forwardRef<TextInput, HabitInputProps>(
  function HabitInput(
    { value, onChangeText, onFocus, onBlur, onSubmitEditing, onClear },
    ref
  ) {
    const { isFocused, containerStyle, handleFocus, handleBlur } =
      useInputAnimations({ onBlur, onFocus });

    const showClearButton = value.length > 0;
    const showCharacterCounter = isFocused || value.length > 0;
    const characterCounterColor = useMemo(
      () => getCharacterCounterColor(value.length),
      [value.length]
    );

    return (
      <AnimatedView style={[containerStyle, getContainerStyle({ isFocused })]}>
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
          style={inputTextStyle}
          value={value}
          onBlur={handleBlur}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onSubmitEditing={onSubmitEditing}
        />
        {showClearButton && (
          <Pressable
            accessibilityHint='Clear the habit name input'
            accessibilityLabel='Clear input'
            accessibilityRole='button'
            hitSlop={{ bottom: 12, left: 12, right: 12, top: 12 }}
            style={({ pressed }) => clearButtonPressedStyle(pressed)}
            onPress={onClear}
          >
            <ClearIcon />
          </Pressable>
        )}
        {showCharacterCounter && (
          <Text
            accessibilityElementsHidden
            importantForAccessibility='no'
            style={characterCounterStyle(characterCounterColor)}
          >
            {value.length}/{CHARACTER_LIMIT.max}
          </Text>
        )}
      </AnimatedView>
    );
  }
);
