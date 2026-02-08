/**
 * Card style utilities for DraggableHabitCard
 */

import type { Animated } from 'react-native';

interface CardStyleParams {
  isWeekComplete: boolean;
  highContrastMode: boolean;
  colors: { cardBackground: string; border: string };
  fade: Animated.Value;
  translateY: Animated.Value;
  cardScale: Animated.Value;
}

export function buildCardStyle({
  isWeekComplete,
  highContrastMode,
  colors,
  fade,
  translateY,
  cardScale,
}: CardStyleParams) {
  return {
    backgroundColor:
      isWeekComplete && !highContrastMode
        ? 'rgba(220, 252, 231, 0.3)'
        : colors.cardBackground,
    borderColor:
      isWeekComplete && !highContrastMode ? '#86efac' : colors.border,
    borderWidth: highContrastMode ? 2 : 1,
    elevation: 3,
    opacity: fade,
    shadowColor: isWeekComplete ? '#10b981' : '#78716c',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: isWeekComplete ? 0.12 : 0.06,
    shadowRadius: 16,
    transform: [{ translateY }, { scale: cardScale }],
  };
}
