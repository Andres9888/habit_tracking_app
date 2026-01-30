import { memo, useCallback, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';
import STRINGS from '../../../constants/strings';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import {
  MAX_LENGTH,
  MAX_CHARS,
  WARNING_THRESHOLD,
  SHOW_THRESHOLD,
  type HabitNameFieldProps,
} from './HabitNameField.constants';
import { useHabitNameFieldAnimation } from './useHabitNameFieldAnimation';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const HabitNameFieldComponent = ({
  value,
  onChange,
  autoFocus,
}: HabitNameFieldProps) => {
  const charCount = value.length;
  const showCounter = charCount > SHOW_THRESHOLD;
  const isWarning = charCount > WARNING_THRESHOLD;
  const isError = charCount > MAX_CHARS;
  const [isFocused, setIsFocused] = useState(false);
  const { triggerWarning } = useHapticFeedback();

  const { animatedInputStyle } = useHabitNameFieldAnimation({
    charCount,
    isError,
    isFocused,
    triggerWarning,
  });

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  const counterColor = isError ? '#EF4444' : isWarning ? '#F59E0B' : '#78716c';

  return (
    <View className='mb-3'>
      <AnimatedTextInput
        blurOnSubmit
        accessibilityHint='Enter a name for your habit, up to 50 characters'
        accessibilityLabel='Habit name'
        autoFocus={autoFocus}
        className='h-14 rounded-xl bg-white px-4 text-base text-stone-800'
        maxLength={MAX_LENGTH}
        placeholder={STRINGS.CREATE_HABIT.namePlaceholder}
        placeholderTextColor='#a8a29e'
        returnKeyType='done'
        style={animatedInputStyle}
        value={value}
        onBlur={handleBlur}
        onChangeText={onChange}
        onFocus={handleFocus}
      />

      {/* V11: Character counter - only show when > 20 chars */}
      {showCounter && (
        <Text
          accessibilityLabel={`${charCount} of ${MAX_CHARS} characters used${isWarning ? ', approaching limit' : ''}${isError ? ', limit exceeded' : ''}`}
          accessibilityRole='text'
          className='mt-1 text-center text-xs'
          style={{ color: counterColor }}
        >
          {charCount}/{MAX_CHARS}
        </Text>
      )}
    </View>
  );
};

export const HabitNameField = memo(HabitNameFieldComponent);
