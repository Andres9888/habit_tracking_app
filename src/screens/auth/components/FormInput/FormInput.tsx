import type { ReactNode } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import Animated from 'react-native-reanimated';
import { useFormInputAnimations } from './useFormInputAnimations';
import { useThemeColors } from '../../../../theme/ThemeContext';

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
  const { colors, isDark } = useThemeColors();
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
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: colors.text.secondary }]}>
          {label}
        </Text>
        {labelRight}
      </View>
      <Animated.View
        style={[
          styles.inputContainer,
          {
            backgroundColor: isDark ? colors.surface : '#ffffff',
            borderColor: error ? '#ef4444' : colors.border,
          },
          animatedStyle,
        ]}
      >
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={colors.text.tertiary}
          style={[styles.input, { color: colors.text.primary }]}
          onBlur={handleBlurWrapper}
          onFocus={handleFocus}
          {...props}
        />
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  errorText: {
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
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrapper: {
    gap: 8,
  },
});
