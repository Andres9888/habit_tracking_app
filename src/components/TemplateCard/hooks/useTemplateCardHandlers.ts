/**
 * useTemplateCardHandlers Hook
 *
 * Press event handlers for TemplateCard
 */

import { withSpring, withTiming } from 'react-native-reanimated';

export function useTemplateCardHandlers(
  pressScale: { value: number },
  shadowOpacity: { value: number }
) {
  const handlePressIn = () => {
    pressScale.value = withSpring(0.97, { damping: 15, stiffness: 200 });
    shadowOpacity.value = withTiming(0.12, { duration: 120 });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, { damping: 15, stiffness: 200 });
    shadowOpacity.value = withTiming(0.06, { duration: 200 });
  };

  return { handlePressIn, handlePressOut };
}
