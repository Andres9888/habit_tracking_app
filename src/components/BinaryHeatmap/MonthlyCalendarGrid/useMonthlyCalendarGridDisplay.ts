/**
 * useMonthlyCalendarGridDisplay — reads dayShape/connectorStyle from user
 * settings and derives the card/completed background colors used by the
 * month grid. Extracted from MonthlyCalendarGrid to keep that file under
 * the project's line cap.
 */
import { useMemo } from 'react';
import { colors as palette } from '@/theme/colors';
import { api } from '../../../../convex/_generated/api';
import {
  DEFAULT_SETTINGS,
  type ConnectorStyle,
} from '../../../../convex/settings/types';
import { useCachedQuery } from '../../../lib/queryCache';
import { completedTint } from './chainColors';

interface UseMonthlyCalendarGridDisplayArgs {
  cardColor: string;
  connectorStyle?: ConnectorStyle;
  dayShape?: 'circle' | 'square';
  habitColor: string;
  isDark: boolean;
  useSolidCompletedFill: boolean;
}

export function useMonthlyCalendarGridDisplay({
  cardColor,
  connectorStyle: connectorStyleProp,
  dayShape: dayShapeProp,
  habitColor,
  isDark,
  useSolidCompletedFill,
}: UseMonthlyCalendarGridDisplayArgs) {
  const skipSettings = Boolean(dayShapeProp && connectorStyleProp);
  const settings = useCachedQuery(
    api.settings.get,
    skipSettings ? 'skip' : {},
    { entryName: 'settings.get' }
  );
  const dayShape =
    dayShapeProp ?? settings?.dayShape ?? DEFAULT_SETTINGS.dayShape;
  const connectorStyle =
    connectorStyleProp ??
    settings?.connectorStyle ??
    DEFAULT_SETTINGS.connectorStyle;
  const cardBg = isDark ? cardColor : palette.light.surfaceMuted;
  const completedBg = useMemo(
    () =>
      useSolidCompletedFill ? habitColor : completedTint(habitColor, cardBg),
    [useSolidCompletedFill, habitColor, cardBg]
  );

  return { cardBg, completedBg, connectorStyle, dayShape };
}
