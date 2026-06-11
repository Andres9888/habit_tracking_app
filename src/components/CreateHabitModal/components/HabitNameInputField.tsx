import { Keyboard, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { HabitNamePlaceholderCaret } from './HabitNamePlaceholderCaret';
import { HabitNamePlaceholderMeasurer } from './HabitNamePlaceholderMeasurer';
import { HabitNamePlaceholderOverlay } from './HabitNamePlaceholderOverlay';
import type { HabitNameInputFieldProps } from './HabitNameInputField.types';
import { useHabitNameInputField } from './useHabitNameInputField';

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
  const {
    inputRef,
    caretState,
    shouldHideNativeCaret,
    showPlaceholderCaret,
    handleBlur,
    handleFocus,
  } = useHabitNameInputField(
    autoFocus,
    habitName,
    placeholder,
    onBlur,
    onFocus
  );

  return (
    <View
      className='relative w-full'
      onLayout={(event) =>
        caretState.onFieldLayout(event.nativeEvent.layout.width)
      }
    >
      <Animated.View
        className='overflow-hidden rounded-2xl'
        style={borderStyle}
      >
        <TextInput
          ref={inputRef}
          accessibilityHint={placeholder || undefined}
          accessibilityLabel='Habit name'
          className='w-full px-0 py-4 text-2xl font-semibold'
          caretHidden={shouldHideNativeCaret}
          maxLength={50}
          placeholder=''
          returnKeyType='done'
          style={{
            lineHeight: 28,
            color: textColor,
            backgroundColor,
            ...caretState.inputTextStyle,
          }}
          value={habitName}
          onBlur={handleBlur}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onSubmitEditing={Keyboard.dismiss}
        />
        {showPlaceholderCaret ? (
          <HabitNamePlaceholderCaret left={caretState.caretInset} />
        ) : null}
      </Animated.View>
      <HabitNamePlaceholderMeasurer
        text={caretState.placeholder}
        onTextLayout={caretState.onPlaceholderTextLayout}
      />
      <HabitNamePlaceholderOverlay
        hintColor={hintColor}
        text={placeholder}
        visible={habitName.length === 0}
      />
    </View>
  );
}
