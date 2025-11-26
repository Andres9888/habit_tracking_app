import { Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';

interface FormInputProps extends TextInputProps {
  label: string;
}

export function FormInput({ label, ...props }: FormInputProps) {
  return (
    <View className='gap-2'>
      <Text className='text-[11px] font-semibold tracking-[3px] text-slate-500'>{label}</Text>
      <TextInput
        className='rounded-3xl border border-slate-200 bg-white px-5 py-3.5 text-base font-medium text-slate-900'
        placeholderTextColor='#94a3b8'
        {...props}
      />
    </View>
  );
}
