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
  /** Show required field indicator (*) next to label */
  required?: boolean;
}

export const FormInput = forwardRef(function FormInput(
  { label, labelRight, error, required, onBlur, ...props }: FormInputProps,
  ref: Ref<TextInput>
) {
  const { colors: themeColors, isDark } = useThemeColors();
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
        <Text
          className='text-sm font-medium'
          style={{ color: themeColors.text.secondary }}
        >
          {label}
          {required && <Text className='text-red-500'> *</Text>}
        </Text>
        {labelRight}
      </View>
      <Animated.View
        className={`overflow-hidden rounded-2xl border shadow-sm ${error ? 'border-red-500' : ''}`}
        style={[
          animatedStyle,
          {
            backgroundColor: themeColors.card,
            borderColor: error ? '#ef4444' : themeColors.border,
          },
        ]}
      >
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          className='px-5 py-4 text-[17px] font-medium leading-[22px]'
          placeholderTextColor={themeColors.text.tertiary}
          style={{ color: themeColors.text.primary }}
          onBlur={handleBlurWrapper}
          onFocus={handleFocus}
          {...props}
        />
      </Animated.View>
      {error && (
        <Text
          accessibilityLiveRegion='polite'
          accessibilityRole='alert'
          className='px-1 text-sm text-red-500'
        >
          {error}
        </Text>
      )}
    </View>
  );
});
