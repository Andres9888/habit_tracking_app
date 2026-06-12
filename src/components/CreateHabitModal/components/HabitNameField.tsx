import { memo, useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';
import STRINGS from '../../../constants/strings';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { ThemedTextInput } from '@/components/ui/TextInput';
import {
  MAX_LENGTH,
  MAX_CHARS,
  WARNING_THRESHOLD,
  SHOW_THRESHOLD,
  type HabitNameFieldProps,
} from './HabitNameField.constants';
import { useHabitNameFieldAnimation } from './useHabitNameFieldAnimation';

const AnimatedTextInput = Animated.createAnimatedComponent(ThemedTextInput);

const HabitNameFieldComponent = ({
  value,
  onChange,
  autoFocus,
  error,
  onBlur: onBlurProp,
}: HabitNameFieldProps) => {
  const { colors: themeColors } = useThemeColors();
  const charCount = value.length;
  const showCounter = charCount > SHOW_THRESHOLD;
  const isWarning = charCount > WARNING_THRESHOLD;
  const isError = charCount > MAX_CHARS || !!error;
  const [isFocused, setIsFocused] = useState(false);
  const { triggerWarning } = useHapticFeedback();

  const { animatedInputStyle } = useHabitNameFieldAnimation({
    charCount,
    isError,
    isFocused,
    triggerWarning,
  });

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlurProp?.();
  }, [onBlurProp]);

  const counterColor = isError ? '#EF4444' : isWarning ? '#F59E0B' : '#78716c';

  return (
    <View className='mb-3'>
      <AnimatedTextInput
        blurOnSubmit
        accessibilityHint='Enter a name for your habit, up to 50 characters'
        accessibilityLabel='Habit name'
        autoFocus={autoFocus}
        className='h-14 rounded-xl bg-white px-4 text-base'
        maxLength={MAX_LENGTH}
        returnKeyType='done'
        style={[animatedInputStyle, { color: themeColors.text.primary }]}
        value={value}
        placeholder={STRINGS.CREATE_HABIT.namePrompt}
        onBlur={handleBlur}
        onChangeText={onChange}
        onFocus={handleFocus}
      />

      {/* Validation error message */}
      {error ? <Text
          accessibilityLabel={`Error: ${error}`}
          accessibilityRole='alert'
          className='mt-1 text-center text-xs'
          style={{ color: themeColors.status.error }}
        >
          {error}
        </Text> : null}

      {/* V11: Character counter - only show when > 20 chars and no error */}
      {showCounter && !error ? <Text
          accessibilityLabel={`${charCount} of ${MAX_CHARS} characters used${isWarning ? ', approaching limit' : ''}${isError ? ', limit exceeded' : ''}`}
          accessibilityRole='text'
          className='mt-1 text-center text-xs'
          style={{ color: counterColor }}
        >
          {charCount}/{MAX_CHARS}
        </Text> : null}
    </View>
  );
};

export const HabitNameField = memo(HabitNameFieldComponent);
