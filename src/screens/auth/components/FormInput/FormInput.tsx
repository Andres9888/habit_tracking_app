import type { ReactNode, Ref } from 'react';
import { forwardRef } from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import type { TextInputProps } from 'react-native';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { useFormInputAnimations } from './useFormInputAnimations';
import { useThemeColors } from '@/theme/ThemeContext';

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
  const { colors } = useThemeColors();
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
        <Text style={[styles.label, { color: colors.text.secondary }]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
        {labelRight}
      </View>
      <Animated.View
        className='overflow-hidden rounded-2xl shadow-sm'
        style={[
          animatedStyle,
          styles.inputContainer,
          {
            backgroundColor: colors.surface,
            borderColor: error ? '#ef4444' : colors.cardBorder,
          },
        ]}
      >
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          placeholderTextColor={colors.text.tertiary}
          style={[styles.input, { color: colors.text.primary }]}
          onBlur={handleBlurWrapper}
          onFocus={handleFocus}
          {...props}
        />
      </Animated.View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  error: {
    color: '#ef4444',
    fontSize: 14,
    paddingHorizontal: 4,
  },
  input: {
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 22,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  inputContainer: {
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  required: {
    color: '#ef4444',
  },
});
