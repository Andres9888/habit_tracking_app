/**
 * Animation hook for ExploreHabitRow add button
 */

import { useEffect } from 'react';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { springs } from '../../../../theme/animations';

export function useAddAnimation(isImported: boolean) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isImported) {
      scale.value = withSpring(1.15, springs.responsive);
      const t = setTimeout(() => {
        scale.value = withSpring(1, springs.responsive);
      }, 120);
      return () => clearTimeout(t);
    }
  }, [isImported, scale]);

  return useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
}
