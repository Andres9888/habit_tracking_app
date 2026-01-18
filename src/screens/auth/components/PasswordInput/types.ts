import type { TextInputProps } from 'react-native';

export interface PasswordInputProps extends Omit<
  TextInputProps,
  'secureTextEntry'
> {
  /** Current password value */
  value: string;
  /** Callback when password changes */
  onChangeText: (text: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Error message to display */
  error?: string;
}
