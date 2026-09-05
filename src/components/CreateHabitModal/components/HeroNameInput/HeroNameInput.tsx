/**
 * HeroNameInput Component
 *
 * Hero-styled text input for habit name with validation feedback.
 */

import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import type { TextInput } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useHabitNamePlaceholder } from '../../hooks/useHabitNamePlaceholder';
import { colors } from '@/theme/colors';
import { useThemeColors } from '@/theme/ThemeContext';
import { shadows } from '@/theme/spacing';
import { ThemedTextInput } from '@/components/ui/TextInput';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import type { HeroNameInputProps } from './types';
import { MAX_LENGTH } from './types';
import { useHeroNameInputAnimations } from './useHeroNameInputAnimations';
import { ValidationMessage } from './ValidationMessage';

export const HeroNameInput = ({
  autoFocus,
  onChange,
  value,
}: HeroNameInputProps) => {
  const { isReady: isPlaceholderReady, placeholder: habitNamePlaceholder } =
    useHabitNamePlaceholder(true);
  const { colors: themeColors } = useThemeColors();
  const charCount = value.length;
  const isNearLimit = charCount > 40;
  const { triggerWarning } = useHapticFeedback();
  const previousCount = useRef(charCount);
  const inputRef = useRef<TextInput>(null);

  const { labelOpacity, validation, validationOpacity, validationTranslateY } =
    useHeroNameInputAnimations(value);
  const labelStyle = useAnimatedStyle(() => ({ opacity: labelOpacity.value }));
  const validationStyle = useAnimatedStyle(() => ({
    opacity: validationOpacity.value,
    transform: [{ translateY: validationTranslateY.value }],
  }));

  useEffect(() => {
    if (charCount === MAX_LENGTH && previousCount.current < MAX_LENGTH) {
      triggerWarning();
    }
    previousCount.current = charCount;
  }, [charCount, triggerWarning]);

  return (
    <View className='mb-4'>
      <Animated.Text
        className='mb-3 text-xl font-bold'
        style={[{ color: themeColors.text.primary }, labelStyle]}
      >
        What habit do you want to build?
      </Animated.Text>

      <View className='relative'>
        <ThemedTextInput
          ref={inputRef}
          blurOnSubmit
          accessibilityHint='Enter the name of your new habit'
          accessibilityLabel='Habit name input'
          autoFocus={autoFocus ? isPlaceholderReady : false}
          className='h-16 rounded-2xl bg-white px-5 pr-16 text-lg font-medium'
          maxLength={MAX_LENGTH}
          returnKeyType='done'
          style={[{
            borderColor:
              value.length > 0 ? colors.secondary[500] : colors.border,
            borderWidth: value.length > 0 ? 2 : 1,
            color: themeColors.text.primary,
          }, shadows.card]}
          value={value}
          placeholder={isPlaceholderReady ? habitNamePlaceholder : ''}
          onChangeText={onChange}
        />

        <View className='-transtone-y-1/2 absolute right-4 top-1/2'>
          <Text
            className='text-xs font-medium'
            style={{
              color: isNearLimit
                ? themeColors.status.warning
                : themeColors.text.tertiary,
            }}
          >
            {charCount}/{MAX_LENGTH}
          </Text>
        </View>
      </View>

      {validation ? (
        <ValidationMessage style={validationStyle} validation={validation} />
      ) : null}
    </View>
  );
};

export default HeroNameInput;
