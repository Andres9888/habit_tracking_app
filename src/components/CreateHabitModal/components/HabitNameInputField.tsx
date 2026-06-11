import { useState } from 'react';
import {
  Keyboard,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { HabitNamePlaceholderMeasurer } from './HabitNamePlaceholderMeasurer';
import { HabitNamePlaceholderOverlay } from './HabitNamePlaceholderOverlay';
import { useCenteredPlaceholderCaretInset } from './useCenteredPlaceholderCaretInset';
import { useHabitNameInputFocus } from './useHabitNameInputFocus';

interface HabitNameInputFieldProps {
  autoFocus: boolean;
  backgroundColor: string;
  borderStyle: StyleProp<ViewStyle>;
  habitName: string;
  hintColor: string;
  placeholder: string;
  textColor: string;
  onBlur: () => void;
  onChangeText: (text: string) => void;
  onFocus: () => void;
}

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
  const inputRef = useHabitNameInputFocus(autoFocus);
  const [isFocused, setIsFocused] = useState(false);
  const {
    caretInset,
    inputTextStyle,
    isPlaceholderCaretReady,
    onFieldLayout,
    onPlaceholderTextLayout,
    placeholder: measuredPlaceholder,
  } = useCenteredPlaceholderCaretInset(habitName, placeholder);
  const shouldHideNativeCaret =
    habitName.length === 0 && placeholder.length > 0;
  const showPlaceholderCaret =
    isFocused && shouldHideNativeCaret && isPlaceholderCaretReady;

  return (
    <View
      className='relative w-full'
      onLayout={(event) => onFieldLayout(event.nativeEvent.layout.width)}
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
            ...inputTextStyle,
          }}
          value={habitName}
          onBlur={() => {
            setIsFocused(false);
            onBlur();
          }}
          onChangeText={onChangeText}
          onFocus={() => {
            setIsFocused(true);
            onFocus();
          }}
          onSubmitEditing={Keyboard.dismiss}
        />
        {showPlaceholderCaret ? (
          <View
            pointerEvents='none'
            className='absolute top-4 h-8 w-0.5 rounded-full'
            style={{ backgroundColor: '#6D8DFF', left: caretInset }}
          />
        ) : null}
      </Animated.View>
      <HabitNamePlaceholderMeasurer
        text={measuredPlaceholder}
        onTextLayout={onPlaceholderTextLayout}
      />
      <HabitNamePlaceholderOverlay
        hintColor={hintColor}
        text={placeholder}
        visible={habitName.length === 0}
      />
    </View>
  );
}
