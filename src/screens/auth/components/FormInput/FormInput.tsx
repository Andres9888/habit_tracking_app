import type { ReactNode, Ref } from 'react';
import { forwardRef } from 'react';
import { Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '../../../../theme/ThemeContext';
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

  const { colors } = useThemeColors();

  return (
    <View className='gap-2'>
      <View className='flex-row items-center justify-between'>
        <Text className='text-sm font-medium' style={{ color: colors.text.secondary }}>{label}</Text>
        {labelRight}
      </View>
      <Animated.View
        className={`overflow-hidden rounded-2xl border shadow-sm ${error ? 'border-red-500' : ''}`}
        style={[animatedStyle, { borderColor: error ? undefined : colors.border, backgroundColor: colors.card }]}
      >
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          className='px-5 py-4 text-[17px] font-medium leading-[22px]'
          placeholderTextColor={colors.text.tertiary}
          style={{ color: colors.text.primary }}
          onBlur={handleBlurWrapper}
          onFocus={handleFocus}
          {...props}
        />
      </Animated.View>
      {error && <Text className='px-1 text-sm text-red-500'>{error}</Text>}
    </View>
  );
});
