// Warm golden glow color for today's habit (softer amber)
export const GOLDEN_GLOW_COLOR = '#FBBF24'; // amber-400 - warmer, softer

export const getTodayGlowStyle = (borderRadius: number) => ({
  borderRadius: borderRadius + 3,
  elevation: 4,
  shadowColor: GOLDEN_GLOW_COLOR,
  shadowOffset: { height: 0, width: 0 },
  shadowOpacity: 0.35,
  shadowRadius: 8,
});

export const getCompletedShadowStyle = (
  isToday: boolean,
  accentColor: string
) => ({
  elevation: 2,
  shadowColor: isToday ? GOLDEN_GLOW_COLOR : accentColor,
  shadowOffset: { height: 0, width: 0 },
  shadowOpacity: 0.3,
  shadowRadius: 5,
});

export const getBackgroundColor = (
  completed: boolean,
  accentColor: string,
  highContrastMode: boolean,
  emptyColor?: string,
) => {
  if (completed) return accentColor;
  if (highContrastMode) return '#000000';
  return emptyColor ?? '#f5f5f5';
};

export const getBorderColor = (
  completed: boolean,
  isToday: boolean,
  accentColor: string,
  highContrastMode: boolean,
  defaultBorderColor?: string,
) => {
  if (completed) return accentColor;
  if (isToday) return GOLDEN_GLOW_COLOR;
  if (highContrastMode) return '#facc15';
  return defaultBorderColor ?? '#78716c';
};
