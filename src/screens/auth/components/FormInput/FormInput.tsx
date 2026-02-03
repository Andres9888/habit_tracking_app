import type { ReactNode } from 'react';
import { Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import Animated from 'react-native-reanimated';
import { useFormInputAnimations } from './useFormInputAnimations';

interface FormInputProps extends TextInputProps {
  label: string;
  /** Optional element rendered on the right side of the label row */
  labelRight?: ReactNode;
  /** Optional validation error message to display */
  error?: string;
}

export function FormInput({
  label,
  labelRight,
  error,
  onBlur,
  ...props
}: FormInputProps) {
  const {
    animatedStyle,
    handleFocus,
    handleBlur: handleBlurAnimation,
  } = useFormInputAnimations();

  const handleBlurWrapper = (e: any) => {
    handleBlurAnimation(e);
    onBlur?.(e);
  };

  return (
    <View className='gap-2'>
      <View className='flex-row items-center justify-between'>
        <Text className='text-sm font-medium text-stone-500'>{label}</Text>
        {labelRight}
      </View>
      <Animated.View
        className={`overflow-hidden rounded-3xl border ${error ? 'border-red-500' : ''}`}
        style={animatedStyle}
      >
        <TextInput
          accessibilityLabel={label}
          className='px-5 py-3.5 text-base font-medium text-stone-900'
          placeholderTextColor='#94a3b8'
          onBlur={handleBlurWrapper}
          onFocus={handleFocus}
          {...props}
        />
      </Animated.View>
      {error && <Text className='px-1 text-sm text-red-500'>{error}</Text>}
    </View>
  );
}
