import type { ViewStyle } from 'react-native';
import {
  getCompleteDayCell,
  getFutureDateTextColor,
  getTodayHighlight,
  TODAY_SHADOW,
} from '../CalendarTimeline.styles';
import type { CalendarColors } from '../CalendarTimeline.types';

interface GetDayCellStylesParams {
  isCurrentDay: boolean;
  isComplete: boolean;
  isUpcoming: boolean;
  isDark: boolean;
  colors: CalendarColors & {
    borderWidth?: number;
    highContrastBorder?: string;
  };
}

interface DayCellComputedStyles {
  container: ViewStyle;
  text: string;
}

/** Computes background, border, shadow, and text color for a day cell */
export function getDayCellStyles({
  isCurrentDay,
  isComplete,
  isUpcoming,
  isDark,
  colors,
}: GetDayCellStylesParams): DayCellComputedStyles {
  const today = getTodayHighlight(isDark);
  const complete = getCompleteDayCell(isDark);

  if (isComplete) {
    return {
      container: {
        backgroundColor: complete.background,
        borderColor: isCurrentDay ? today.border : 'transparent',
        borderWidth: isCurrentDay ? 2 : 0,
        ...complete.glow,
      },
      text: complete.text,
    };
  }

  if (isCurrentDay) {
    return {
      container: {
        backgroundColor: today.background,
        borderColor: today.border,
        borderWidth: 2,
        ...TODAY_SHADOW,
      },
      text: today.text,
    };
  }

  if (isUpcoming) {
    return {
      container: {
        backgroundColor: colors.dayBackground,
        borderColor: colors.highContrastBorder ?? 'transparent',
        borderWidth: colors.borderWidth ?? 0,
      },
      text: getFutureDateTextColor(isDark),
    };
  }

  return {
    container: {
      backgroundColor: colors.dayBackground,
      borderColor: colors.highContrastBorder ?? 'transparent',
      borderWidth: colors.borderWidth ?? 0,
    },
    text: colors.dayText,
  };
}
