import type { SharedValue } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';

export interface FloatingActionButtonProps {
  openCreateHabitScreen: () => void;
  celebrationsEnabled?: boolean;
  reduceMotionPreference?: boolean;
}

export interface UseFABAnimationsReturn {
  pressScale: SharedValue<number>;
  rippleOpacity: SharedValue<number>;
  rippleScale: SharedValue<number>;
  fabAnimatedStyle: ViewStyle;
  rippleAnimatedStyle: ViewStyle;
}
