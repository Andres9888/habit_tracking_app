import { Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';

interface FormInputProps extends TextInputProps {
  label: string;
}

export function FormInput({ label, ...props }: FormInputProps) {
  return (
    <View className='gap-2'>
      <Text className='text-[10px] font-medium tracking-[3px] text-stone-500'>
        {label}
      </Text>
      <TextInput
        className='rounded-3xl border border-stone-200 bg-white px-5 py-3.5 text-base font-medium text-stone-900'
        placeholderTextColor='#94a3b8'
        {...props}
      />
    </View>
  );
}
