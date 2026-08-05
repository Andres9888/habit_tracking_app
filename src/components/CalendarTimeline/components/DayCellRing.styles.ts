/* eslint-disable max-lines */
import { StyleSheet } from 'react-native';

import { colors as palette } from '../../../theme/colors';
import { typography, fontFamilies, fontWeights } from '../../../theme/typography';
import { darkColors } from '../../../theme/darkColors';
import type { MaterialTier } from '../../HabitChainVisualizer/materialTier';
import type { CompletionStatus } from '../CalendarTimeline.types';

export const RING_SIZE = 44;
export const STROKE_WIDTH = 4;
export const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/* Intentional rgba — black overlay for consistent ring definition */
const TRACK_LIGHT = 'rgba(0,0,0,0.12)';
/* Intentional rgba — white overlay on dark surface for track visibility */
const TRACK_DARK = 'rgba(255,255,255,0.15)';
const PROGRESS_EMERALD_LIGHT = palette.primary[500];
const PROGRESS_EMERALD_DARK = palette.primary[400];
const FILL_COMPLETE_LIGHT = palette.primary[600];
const FILL_COMPLETE_DARK = palette.primary[500];
const AMBER_LIGHT = palette.streak[300];
const AMBER_DARK = palette.streak[300];

export const getAccentStroke = (isDark: boolean) =>
  isDark ? PROGRESS_EMERALD_DARK : PROGRESS_EMERALD_LIGHT;
export const getAccentFill = (isDark: boolean) =>
  isDark ? FILL_COMPLETE_DARK : FILL_COMPLETE_LIGHT;

export interface RingColors {
  track: string;
  /** Progress stroke for non-partial states (AMBER today / emerald default). */
  progress: string;
  todayBg: string | undefined;
  todayBorder: string | undefined;
  text: string;
}

export function getRingColors(
  isDark: boolean,
  isToday: boolean,
  status: CompletionStatus,
  tier: MaterialTier
): RingColors {
  const isAmber = isToday && status !== 'complete' && status !== 'future';

  /* Intentional rgba — derived from streak[300] (#E8B94D) with opacity */
  const todayBg = isAmber
    ? isDark
      ? 'rgba(232,185,77,0.08)'
      : 'rgba(232,185,77,0.10)'
    : undefined;
  const todayBorder = isAmber
    ? isDark
      ? 'rgba(232,185,77,0.30)'
      : 'rgba(232,185,77,0.35)'
    : undefined;

  const progress = isAmber
    ? isDark
      ? AMBER_DARK
      : AMBER_LIGHT
    : getAccentStroke(isDark);

  let text: string = isDark ? darkColors.text.primary : palette.gray[800];
  if (status === 'complete') text = tier.iconColor;
  else if (isToday) text = isDark ? palette.streak[300] : palette.streak[700];
  else if (status === 'future')
    text = isDark ? darkColors.text.tertiary : palette.gray[400];

  return {
    track: isDark ? TRACK_DARK : TRACK_LIGHT,
    progress,
    todayBg,
    todayBorder,
    text,
  };
}

export const MONTH_PREFIX_COLORS = {
  light: palette.primary[600],
  dark: palette.primary[400],
};

export const ringStyles = StyleSheet.create({
  centerLabel: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    height: RING_SIZE,
    justifyContent: 'center',
    width: RING_SIZE,
  },
  dayText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
  },
  dayTextWithPrefix: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
  },
  dayTextTodayWithPrefix: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
  },
  dayTextToday: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
  },
  future: {
    opacity: 0.3,
  },
  missed: {
    opacity: 0.55,
  },
  monthPrefixText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 9,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.5,
    marginBottom: 0,
    textAlign: 'center',
  },
  solidFill: {
    alignItems: 'center',
    borderRadius: RING_SIZE / 2,
    height: RING_SIZE,
    justifyContent: 'center',
    width: RING_SIZE,
  },
  completeGlowBase: {
    elevation: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  svg: {
    transform: [{ rotate: '-90deg' }],
  },
});
