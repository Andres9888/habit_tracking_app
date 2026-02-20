import type { ViewStyle } from 'react-native';
import {
  COMPLETE_DAY_CELL,
  FUTURE_DATE_TEXT_COLOR,
  TODAY_HIGHLIGHT,
  TODAY_SHADOW,
} from '../CalendarTimeline.styles';
import type { CalendarColors } from '../CalendarTimeline.types';

interface GetDayCellStylesParams {
  isCurrentDay: boolean;
  isComplete: boolean;
  isUpcoming: boolean;
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
  colors,
}: GetDayCellStylesParams): DayCellComputedStyles {
  // Complete day: emerald background + white text + green glow
  if (isComplete) {
    return {
      container: {
        backgroundColor: COMPLETE_DAY_CELL.background,
        borderColor: 'transparent',
        borderWidth: 0,
        ...COMPLETE_DAY_CELL.glow,
      },
      text: COMPLETE_DAY_CELL.text,
    };
  }

  // Today (not complete): amber highlight
  if (isCurrentDay) {
    return {
      container: {
        backgroundColor: TODAY_HIGHLIGHT.background,
        borderColor: TODAY_HIGHLIGHT.border,
        borderWidth: 2,
        ...TODAY_SHADOW,
      },
      text: TODAY_HIGHLIGHT.text,
    };
  }

  // Future date
  if (isUpcoming) {
    return {
      container: {
        backgroundColor: colors.dayBackground,
        borderColor: colors.highContrastBorder ?? 'transparent',
        borderWidth: colors.borderWidth ?? 0,
      },
      text: FUTURE_DATE_TEXT_COLOR,
    };
  }

  // Default past date
  return {
    container: {
      backgroundColor: colors.dayBackground,
      borderColor: colors.highContrastBorder ?? 'transparent',
      borderWidth: colors.borderWidth ?? 0,
    },
    text: colors.dayText,
  };
}
