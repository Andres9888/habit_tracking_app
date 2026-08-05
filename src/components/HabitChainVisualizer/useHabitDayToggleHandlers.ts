import { useCallback } from 'react';
import { Animated } from 'react-native';

interface UseHabitDayToggleHandlersParams {
  buttonScale: Animated.Value;
  completed: boolean;
  onPress: () => void;
}

export const useHabitDayToggleHandlers = ({
  buttonScale,
  completed,
  onPress,
}: UseHabitDayToggleHandlersParams) => {
  const handlePressIn = useCallback(() => {
    Animated.spring(buttonScale, {
      friction: 20,
      tension: 300,
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  }, [buttonScale]);

  const handlePressOut = useCallback(() => {
    if (!completed) {
      Animated.spring(buttonScale, {
        friction: 20,
        tension: 300,
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [buttonScale, completed]);

  const handlePress = useCallback(() => {
    // Haptics are fired by useToggleDayHandler, which knows whether the tap is
    // a completion, an uncompletion, or a disabled-day rejection. Firing a
    // second one here doubled the JSI calls on every press.
    Animated.sequence([
      Animated.spring(buttonScale, {
        friction: 6,
        tension: 300,
        toValue: 1.08,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        friction: 8,
        tension: 300,
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  }, [buttonScale, onPress]);

  return { handlePress, handlePressIn, handlePressOut };
};
