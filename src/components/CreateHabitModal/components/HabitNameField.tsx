import { useEffect, useRef } from 'react';
import { Text, TextInput, View } from 'react-native';
import STRINGS from '../../../constants/strings';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

interface HabitNameFieldProps {
  value: string;
  onChange: (text: string) => void;
  autoFocus: boolean;
}

export const HabitNameField = ({
  value,
  onChange,
  autoFocus,
}: HabitNameFieldProps) => {
  const MAX_LENGTH = 50;
  const charCount = value.length;
  const isNearLimit = charCount > 40;
  const isAtLimit = charCount >= 50;
  const { triggerWarning } = useHapticFeedback();
  const previousCount = useRef(charCount);

  // Trigger haptic when hitting character limit
  useEffect(() => {
    if (charCount === 50 && previousCount.current < 50) {
      triggerWarning();
    }
    previousCount.current = charCount;
  }, [charCount, triggerWarning]);

  return (
    <View className='mb-6'>
      <View className='mb-1 flex-row items-center justify-between'>
        <Text
          className='text-[13px] font-semibold uppercase text-stone-500'
          style={{ letterSpacing: 0.5 }}
        >
          {STRINGS.CREATE_HABIT.nameLabel}
        </Text>
        <Text
          className={`text-xs ${isNearLimit ? 'text-amber-500' : 'text-stone-400'}`}
        >
          {charCount}/{MAX_LENGTH}
        </Text>
      </View>
      <Text className='mb-2 text-xs text-stone-500'>
        {STRINGS.CREATE_HABIT.nameHelper}
      </Text>
      <TextInput
        blurOnSubmit
        accessibilityHint='Enter a name for your habit, up to 50 characters'
        accessibilityLabel='Habit name'
        autoFocus={autoFocus}
        className='h-14 rounded-xl bg-white px-4 text-base text-stone-800'
        maxLength={MAX_LENGTH}
        placeholder={STRINGS.CREATE_HABIT.namePlaceholder}
        placeholderTextColor='#a8a29e'
        returnKeyType='done'
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
};
