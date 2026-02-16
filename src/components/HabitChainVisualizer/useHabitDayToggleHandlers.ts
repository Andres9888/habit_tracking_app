import { useCallback } from 'react';
import { Animated } from 'react-native';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';

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
  const { triggerSuccess, triggerLightImpact } = useHapticFeedback();

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
    // Haptic feedback: success when completing, light tap when uncompleting
    if (completed) {
      triggerLightImpact();
    } else {
      triggerSuccess();
    }

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
  }, [buttonScale, completed, onPress, triggerSuccess, triggerLightImpact]);

  return { handlePress, handlePressIn, handlePressOut };
};
