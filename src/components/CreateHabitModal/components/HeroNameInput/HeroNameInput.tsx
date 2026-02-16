/**
 * HeroNameInput - Hero-styled text input for habit name with validation
 *
 * @description
 * Large, prominent text input field for habit name. Provides:
 * - Character count with visual warning near limit
 * - Validation feedback (success/warning states)
 * - Haptic feedback when max length reached
 * - Smooth animations for label and validation
 *
 * @features
 * - **Character limit**: 50 characters max
 * - **Visual warning**: Shows when >40 characters (80% full)
 * - **Haptic feedback**: Warning vibration at max length
 * - **Auto-focus**: Focuses input on mount (if autoFocus=true)
 * - **Animated feedback**: Label and validation messages fade in/out
 *
 * @validation States
 * - **Success** (green): Valid habit name entered
 * - **Warning** (amber): Approaching or at character limit
 * - **Default** (gray): No validation state
 *
 * @animations
 * - Label opacity fades in when component mounts
 * - Validation message slides up and fades in
 * - Character count changes color near limit
 *
 * @see {@link useHeroNameInputAnimations} - Animation logic
 * @see {@link MAX_LENGTH} - Character limit constant
 *
 * @module CreateHabitModal/components/HeroNameInput
 */

import { useEffect, useRef } from 'react';
import { Animated, Text, TextInput, View } from 'react-native';
import { colors } from '@/theme/colors';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import type { HeroNameInputProps } from './types';
import { MAX_LENGTH } from './types';
import { useHeroNameInputAnimations } from './useHeroNameInputAnimations';

export const HeroNameInput = ({
  autoFocus,
  onChange,
  value,
}: HeroNameInputProps) => {
  const charCount = value.length;
  const isNearLimit = charCount > 40;
  const { triggerWarning } = useHapticFeedback();
  const previousCount = useRef(charCount);
  const inputRef = useRef<TextInput>(null);

  const { labelOpacity, validation, validationOpacity, validationTranslateY } =
    useHeroNameInputAnimations(value);

  useEffect(() => {
    if (charCount === MAX_LENGTH && previousCount.current < MAX_LENGTH) {
      triggerWarning();
    }
    previousCount.current = charCount;
  }, [charCount, triggerWarning]);

  const getValidationColor = () => {
    switch (validation?.type) {
      case 'success': {
        return 'text-emerald-600';
      }
      case 'warning': {
        return 'text-amber-600';
      }
      default: {
        return 'text-stone-500';
      }
    }
  };

  return (
    <View className='mb-4'>
      <Animated.Text
        className='mb-3 text-xl font-bold text-stone-800'
        style={{ opacity: labelOpacity }}
      >
        What habit do you want to build?
      </Animated.Text>

      <View className='relative'>
        <TextInput
          ref={inputRef}
          blurOnSubmit
          accessibilityHint='Enter the name of your new habit'
          accessibilityLabel='Habit name input'
          autoFocus={autoFocus}
          className='h-16 rounded-2xl bg-white px-5 pr-16 text-lg font-medium text-stone-800 shadow-sm'
          maxLength={MAX_LENGTH}
          placeholder='e.g., Read 10 minutes daily'
          placeholderTextColor='#a8a29e'
          returnKeyType='done'
          style={{
            borderColor:
              value.length > 0 ? colors.secondary[500] : colors.border,
            borderWidth: value.length > 0 ? 2 : 1,
          }}
          value={value}
          onChangeText={onChange}
        />

        <View className='-transtone-y-1/2 absolute right-4 top-1/2'>
          <Text
            className={`text-xs font-medium ${
              isNearLimit ? 'text-amber-500' : 'text-stone-400'
            }`}
          >
            {charCount}/{MAX_LENGTH}
          </Text>
        </View>
      </View>

      {validation && (
        <Animated.View
          className='mt-2'
          style={{
            opacity: validationOpacity,
            transform: [{ translateY: validationTranslateY }],
          }}
        >
          <Text className={`text-sm font-medium ${getValidationColor()}`}>
            {validation.message}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

export default HeroNameInput;
