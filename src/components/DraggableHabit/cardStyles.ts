/**
 * @module cardStyles
 *
 * Builds the outer card static style object (background, border, shadow).
 * Week-complete cards get a green tint and stronger shadow.
 *
 * Animated properties (fade, translateY, cardScale) are handled via
 * useAnimatedStyle in DraggableHabitCard.
 */

interface StaticCardStyleParams {
  isWeekComplete: boolean;
  highContrastMode: boolean;
  colors: { cardBackground: string; border: string };
}

export function buildStaticCardStyle({
  isWeekComplete,
  highContrastMode,
  colors,
}: StaticCardStyleParams) {
  return {
    backgroundColor:
      isWeekComplete && !highContrastMode
        ? 'rgba(220, 252, 231, 0.3)'
        : colors.cardBackground,
    borderColor:
      isWeekComplete && !highContrastMode ? '#86efac' : colors.border,
    borderWidth: highContrastMode ? 2 : 1,
    elevation: 3,
    shadowColor: isWeekComplete ? '#10b981' : '#78716c',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: isWeekComplete ? 0.12 : 0.06,
    shadowRadius: 12,
  };
}
