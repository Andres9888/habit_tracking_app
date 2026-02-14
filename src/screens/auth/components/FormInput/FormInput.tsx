import type { ReactNode, Ref } from 'react';
import { forwardRef } from 'react';
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

export const FormInput = forwardRef(function FormInput(
  { label, labelRight, error, onBlur, ...props }: FormInputProps,
  ref: Ref<TextInput>
) {
  const {
    animatedStyle,
    handleFocus,
    handleBlur: handleBlurAnimation,
  } = useFormInputAnimations();

  /**
   * Wraps the blur handler to trigger both animation and parent onBlur
   * @param e - Native focus event from TextInput
   */
  const handleBlurWrapper = (
    e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]
  ) => {
    handleBlurAnimation();
    onBlur?.(e);
  };

  return (
    <View className='gap-2'>
      <View className='flex-row items-center justify-between'>
        <Text className='text-sm font-medium text-stone-600'>{label}</Text>
        {labelRight}
      </View>
      <Animated.View
        className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${error ? 'border-red-500' : 'border-stone-200'}`}
        style={animatedStyle}
      >
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          className='px-5 py-4 text-[17px] font-medium leading-[22px] text-stone-900'
          placeholderTextColor='#a1a1aa'
          onBlur={handleBlurWrapper}
          onFocus={handleFocus}
          {...props}
        />
      </Animated.View>
      {error && <Text className='px-1 text-sm text-red-500'>{error}</Text>}
    </View>
  );
});
