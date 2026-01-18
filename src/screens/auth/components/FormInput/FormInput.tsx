import type { ReactNode } from 'react';
import { Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';

interface FormInputProps extends TextInputProps {
  label: string;
  /** Optional element rendered on the right side of the label row */
  labelRight?: ReactNode;
}

export function FormInput({ label, labelRight, ...props }: FormInputProps) {
  return (
    <View className='gap-2'>
      <View className='flex-row items-center justify-between'>
        <Text className='text-sm font-medium text-stone-500'>{label}</Text>
        {labelRight}
      </View>
      <TextInput
        className='rounded-3xl border border-stone-200 bg-white px-5 py-3.5 text-base font-medium text-stone-900'
        placeholderTextColor='#94a3b8'
        {...props}
      />
    </View>
  );
}
