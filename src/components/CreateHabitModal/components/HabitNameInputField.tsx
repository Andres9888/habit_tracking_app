/**
 * Habit name field ("Balanced"): left-aligned 18/600 text in a 16px-radius
 * stone field, 14×16 padding. The native caret is used; the placeholder is an
 * overlay so it can fade in after the sheet lands (see HabitNamePlaceholderOverlay).
 */
import { Keyboard, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { fontFamilies, fontWeights } from '@/theme/typography';
import { HabitNamePlaceholderOverlay } from './HabitNamePlaceholderOverlay';
import type { HabitNameInputFieldProps } from './HabitNameInputField.types';
import { useHabitNameInputField } from './useHabitNameInputField';

export const HABIT_NAME_FIELD_PADDING = { horizontal: 16, vertical: 14 };

export function HabitNameInputField({
  autoFocus,
  backgroundColor,
  borderStyle,
  habitName,
  hintColor,
  placeholder,
  textColor,
  onBlur,
  onChangeText,
  onFocus,
}: HabitNameInputFieldProps) {
  const { inputRef, handleBlur, handleFocus } = useHabitNameInputField(
    autoFocus,
    onBlur,
    onFocus
  );

  return (
    <View className='relative w-full'>
      <Animated.View
        style={[{ borderRadius: 16, overflow: 'hidden' }, borderStyle]}
      >
        <TextInput
          ref={inputRef}
          accessibilityHint={placeholder || undefined}
          accessibilityLabel='Habit name'
          maxLength={50}
          placeholder=''
          returnKeyType='done'
          style={{
            backgroundColor,
            color: textColor,
            fontFamily: fontFamilies.primary.text,
            fontSize: 18,
            fontWeight: fontWeights.semibold,
            lineHeight: 24,
            paddingHorizontal: HABIT_NAME_FIELD_PADDING.horizontal,
            paddingVertical: HABIT_NAME_FIELD_PADDING.vertical,
            textAlign: 'left',
          }}
          value={habitName}
          onBlur={handleBlur}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onSubmitEditing={Keyboard.dismiss}
        />
      </Animated.View>
      <HabitNamePlaceholderOverlay
        hintColor={hintColor}
        text={placeholder}
        visible={habitName.length === 0}
      />
    </View>
  );
}
