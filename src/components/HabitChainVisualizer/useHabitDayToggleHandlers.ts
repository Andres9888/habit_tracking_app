
import { Animated } from 'react-native';
import { useCallback } from 'react';

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
