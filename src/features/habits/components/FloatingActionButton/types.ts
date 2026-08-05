export interface FloatingActionButtonProps {
  openCreateHabitScreen: () => void;
  celebrationsEnabled?: boolean;
  reduceMotionPreference?: boolean;
}

export interface UseFABAnimationsReturn {
  bounce: import('react-native').Animated.Value;
  pressScale: import('react-native').Animated.Value;
  rippleOpacity: import('react-native').Animated.Value;
  rippleScale: import('react-native').Animated.Value;
}
