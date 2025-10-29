import { Text, TextInput, View } from 'react-native';

interface HabitNameFieldProps {
  value: string;
  onChange: (text: string) => void;
  autoFocus: boolean;
}

export const HabitNameField = ({ value, onChange, autoFocus }: HabitNameFieldProps) => (
  <View className='mb-6'>
    <Text className='mb-2 text-base font-semibold text-[#1a1a1a]'>Habit Name</Text>
    <TextInput
      autoFocus={autoFocus}
      blurOnSubmit
      className='h-14 rounded-xl bg-white px-4 text-base text-[#1a1a1a]'
      placeholder='Exercise'
      placeholderTextColor='#adaebc'
      returnKeyType='done'
      value={value}
      onChangeText={onChange}
    />
  </View>
);
