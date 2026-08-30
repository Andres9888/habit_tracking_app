import type { StyleProp, ViewStyle } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';

export type PanelStyle = StyleProp<AnimatedStyle<ViewStyle>>;

export interface HabitAddedPalette {
  addBg: string;
  addedBg: string;
  addedFg: string;
  addFg: string;
  border: string;
  card: string;
  textPrimary: string;
  textSecondary: string;
}

export interface HabitAddedAction {
  disabled?: boolean;
  hint?: string;
  label: string;
  style?: PanelStyle;
  testID?: string;
  pressHandlers?: object;
  onPress: () => void;
}

export interface HabitAddedPanelProps {
  checkStyle?: PanelStyle;
  headline: string;
  headlineTestID?: string;
  message: string;
  palette: HabitAddedPalette;
  primary: HabitAddedAction;
  secondary?: HabitAddedAction;
  style?: PanelStyle;
  testID?: string;
}
