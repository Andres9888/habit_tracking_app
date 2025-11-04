import { Text, TextInput, View } from 'react-native';
import STRINGS from '../../../constants/strings';

interface HabitNameFieldProps {
  value: string;
  onChange: (text: string) => void;
  autoFocus: boolean;
  maxLength: number;
  isDuplicate: boolean;
  isTooShort: boolean;
}

export const HabitNameField = ({
  value,
  onChange,
  autoFocus,
  maxLength,
  isDuplicate,
  isTooShort,
}: HabitNameFieldProps) => {
  const trimmedLength = value.trim().length;
  const helperText = isDuplicate
    ? STRINGS.CREATE_HABIT.nameDuplicateWarning
    : isTooShort && trimmedLength > 0
    ? STRINGS.CREATE_HABIT.nameTooShort
    : STRINGS.CREATE_HABIT.nameHelper;

  const helperColor = isDuplicate
    ? '#B91C1C'
    : isTooShort && trimmedLength > 0
    ? '#FB923C'
    : '#64748b';

  const counterColor = trimmedLength >= maxLength - 5 ? '#F97316' : '#94A3B8';
  const borderColor = isDuplicate ? '#F87171' : '#E2E8F0';

  return (
    <View className='mb-6'>
      <Text className='mb-1 text-base font-semibold text-[#1a1a1a]'>
        {STRINGS.CREATE_HABIT.nameLabel}
      </Text>
      <TextInput
        autoCapitalize='sentences'
        autoFocus={autoFocus}
        blurOnSubmit
        className='h-14 rounded-xl px-4 text-base text-[#1a1a1a]'
        maxLength={maxLength}
        placeholder={STRINGS.CREATE_HABIT.namePlaceholder}
        placeholderTextColor='#adaebc'
        returnKeyType='done'
        value={value}
        onChangeText={onChange}
        style={{
          backgroundColor: '#FFFFFF',
          borderColor,
          borderWidth: 1.5,
        }}
      />
      <View className='mt-2 flex-row items-center justify-between'>
        <Text className='flex-1 text-xs' style={{ color: helperColor }}>
          {helperText}
        </Text>
        <Text className='text-xs font-medium' style={{ color: counterColor }}>
          {`${trimmedLength}/${maxLength}`}
        </Text>
      </View>
    </View>
  );
};
