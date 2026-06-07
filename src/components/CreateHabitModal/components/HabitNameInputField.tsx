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
  const {
    fieldWidth,
    inputTextStyle,
    measurePlaceholder,
    onFieldLayout,
    onPlaceholderTextLayout,
    placeholder: measuredPlaceholder,
  } = useCenteredPlaceholderCaretInset(habitName, placeholder);

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
          onBlur={onBlur}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onSubmitEditing={Keyboard.dismiss}
        />
      </Animated.View>
      {measurePlaceholder ? (
        <HabitNamePlaceholderMeasurer
          fieldWidth={fieldWidth}
          text={measuredPlaceholder}
          onTextLayout={onPlaceholderTextLayout}
        />
      ) : null}
      <HabitNamePlaceholderOverlay
        hintColor={hintColor}
        text={placeholder}
        visible={habitName.length === 0}
      />
    </View>
  );
}
