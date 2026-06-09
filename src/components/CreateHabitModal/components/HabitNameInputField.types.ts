import type { StyleProp, ViewStyle } from 'react-native';

export interface HabitNameInputFieldProps {
  autoFocus: boolean;
  backgroundColor: string;
  borderStyle: StyleProp<ViewStyle>;
  habitName: string;
  hintColor: string;
  placeholder: string;
  textColor: string;
  onBlur: () => void;
  onChangeText: (text: string) => void;
  onFocus: () => void;
}
