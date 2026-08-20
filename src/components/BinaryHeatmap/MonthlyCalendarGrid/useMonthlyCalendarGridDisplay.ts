/**
 * useMonthlyCalendarGridDisplay — reads dayShape/connectorStyle from user
 * settings and derives the card/completed background colors used by the
 * month grid. Extracted from MonthlyCalendarGrid to keep that file under
 * the project's line cap.
 */
import { useMemo } from 'react';
import { colors as palette } from '@/theme/colors';
import { DEFAULT_SETTINGS } from '../../../../convex/settings/types';
import { useSettingsQuery } from '../../../lib/settings/useSettingsQuery';
import { completedTint } from './chainColors';

interface UseMonthlyCalendarGridDisplayArgs {
  cardColor: string;
  habitColor: string;
  isDark: boolean;
  useSolidCompletedFill: boolean;
}

export function useMonthlyCalendarGridDisplay({
  cardColor,
  habitColor,
  isDark,
  useSolidCompletedFill,
}: UseMonthlyCalendarGridDisplayArgs) {
  const settings = useSettingsQuery();
  const dayShape = settings?.dayShape ?? DEFAULT_SETTINGS.dayShape;
  const connectorStyle =
    settings?.connectorStyle ?? DEFAULT_SETTINGS.connectorStyle;
  const cardBg = isDark ? cardColor : palette.light.surfaceMuted;
  const completedBg = useMemo(
    () =>
      useSolidCompletedFill ? habitColor : completedTint(habitColor, cardBg),
    [useSolidCompletedFill, habitColor, cardBg]
  );

  return { cardBg, completedBg, connectorStyle, dayShape };
}
