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

import { forwardRef, useMemo } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';

import {
  BORDER_RADIUS,
  CHARACTER_LIMIT,
  COLORS,
  COPY,
  TOUCH_TARGETS,
} from '../constants';
import type { HabitInputProps } from '../types';
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
            hitSlop={{ bottom: 12, left: 12, right: 12, top: 12 }}
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
