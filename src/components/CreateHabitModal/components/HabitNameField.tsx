import { Text, TextInput, View } from 'react-native';
import STRINGS from '../../../constants/strings';

interface HabitNameFieldProps {
  value: string;
  onChange: (text: string) => void;
  autoFocus: boolean;
}

export const HabitNameField = ({ value, onChange, autoFocus }: HabitNameFieldProps) => (
  <View className='mb-6'>
    <Text className='mb-1 text-base font-semibold text-[#1a1a1a]'>
      {STRINGS.CREATE_HABIT.nameLabel}
    </Text>
    <Text className='mb-2 text-xs text-[#64748b]'>
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
      onChangeText={onChange}
    />
  </View>
);
