import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';

interface FormInputProps extends TextInputProps {
  label: string;
  labelRight?: React.ReactNode;
}

export function FormInput({ label, labelRight, ...props }: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className='gap-2'>
      <View className='flex-row items-center justify-between'>
        <Text className='text-xs font-medium tracking-wide text-stone-500'>
          {label}
        </Text>
        {labelRight}
      </View>
      <TextInput
        className={`rounded-xl border px-5 py-3.5 text-base font-medium text-stone-900 ${
          isFocused
            ? 'border-emerald-500 bg-white'
            : 'border-stone-200 bg-stone-50'
        }`}
        placeholderTextColor='#94a3b8'
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        {...props}
      />
    </View>
  );
}
