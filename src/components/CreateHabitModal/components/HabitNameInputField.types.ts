import type { ViewStyle } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';

export interface HabitNameInputFieldProps {
  autoFocus: boolean;
  backgroundColor: string;
  borderStyle: AnimatedStyle<ViewStyle>;
  habitName: string;
  hintColor: string;
  placeholder: string;
  textColor: string;
  onBlur: () => void;
  onChangeText: (text: string) => void;
  onFocus: () => void;
}
