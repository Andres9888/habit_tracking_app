import { useEffect, useRef } from 'react';
import { Text, TextInput, View } from 'react-native';
import STRINGS from '../../../constants/strings';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

interface HabitNameFieldProps {
  value: string;
  onChange: (text: string) => void;
  autoFocus: boolean;
}

export const HabitNameField = ({ value, onChange, autoFocus }: HabitNameFieldProps) => {
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
        <Text className='text-base font-semibold text-[#1a1a1a]'>
          {STRINGS.CREATE_HABIT.nameLabel}
        </Text>
        <Text className={`text-xs ${isNearLimit ? 'text-[#f59e0b]' : 'text-[#a8a29e]'}`}>
          {charCount}/{MAX_LENGTH}
        </Text>
      </View>
      <Text className='mb-2 text-xs text-[#78716c]'>
        {STRINGS.CREATE_HABIT.nameHelper}
      </Text>
      <TextInput
        autoFocus={autoFocus}
        blurOnSubmit
        className='h-14 rounded-xl bg-white px-4 text-base text-[#1a1a1a]'
        placeholder={STRINGS.CREATE_HABIT.namePlaceholder}
        placeholderTextColor='#adaebc'
        returnKeyType='done'
        value={value}
        maxLength={MAX_LENGTH}
        onChangeText={onChange}
      />
    </View>
  );
};
