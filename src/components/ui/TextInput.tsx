import { ComponentProps, forwardRef } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

type Props = ComponentProps<typeof RNTextInput>;

export const ThemedTextInput = forwardRef<RNTextInput, Props>(
  ({ placeholderTextColor, ...props }, ref) => {
    const { colors } = useThemeColors();
    return (
      <RNTextInput
        ref={ref}
        placeholderTextColor={placeholderTextColor ?? colors.text.tertiary}
        {...props}
      />
    );
  }
);

ThemedTextInput.displayName = 'ThemedTextInput';
