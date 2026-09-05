import type { SharedValue } from 'react-native-reanimated';

export interface FloatingActionButtonProps {
  openCreateHabitScreen: () => void;
  celebrationsEnabled?: boolean;
  reduceMotionPreference?: boolean;
}

export interface UseFABAnimationsReturn {
  bounce: SharedValue<number>;
  pressScale: SharedValue<number>;
  rippleOpacity: SharedValue<number>;
  rippleScale: SharedValue<number>;
}
