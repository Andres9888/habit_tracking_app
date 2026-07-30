import type { useThemeColors } from '@/theme/ThemeContext';

type ThemeColors = ReturnType<typeof useThemeColors>['colors'];

export function getLoadColor(
  plannedMinutes: number,
  capacityMinutes: number,
  colors: ThemeColors
) {
  const ratio = capacityMinutes > 0 ? plannedMinutes / capacityMinutes : 0;
  if (ratio > 1) return colors.status.error;
  if (ratio >= 0.7) return colors.status.warning;
  return colors.status.success;
}
