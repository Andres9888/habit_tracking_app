import type { MaterialTier } from './materialTier';
import {
  getBackgroundColor,
  getBorderColor,
  MISSED_BG,
  MISSED_BORDER,
} from './habitDayToggleStyles';

export function getHabitDayToggleVisuals(
  completed: boolean,
  missed: boolean,
  isToday: boolean,
  accentColor: string,
  tier: MaterialTier
) {
  const tierBackground = getBackgroundColor(completed, accentColor, tier);
  const tierBorder = getBorderColor(completed, isToday, accentColor, tier);
  return {
    showCompletedShadow: completed && !missed,
    staticBackground: missed ? MISSED_BG : tierBackground,
    staticBorder: missed ? MISSED_BORDER : tierBorder,
  };
}
