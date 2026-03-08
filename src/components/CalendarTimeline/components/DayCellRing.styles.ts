/* eslint-disable max-lines */
import { StyleSheet } from 'react-native';

import { colors as palette } from '../../../theme/colors';
import { darkColors } from '../../../theme/darkColors';
import type { CompletionStatus } from '../CalendarTimeline.types';

export const RING_SIZE = 44;
export const STROKE_WIDTH = 4;
export const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const TRACK_LIGHT = palette.gray[200];
const TRACK_DARK = 'rgba(255,255,255,0.15)';
const PROGRESS_EMERALD_LIGHT = palette.primary[500];
const PROGRESS_EMERALD_DARK = palette.primary[400];
const FILL_COMPLETE_LIGHT = palette.primary[600];
const FILL_COMPLETE_DARK = palette.primary[500];
const AMBER_LIGHT = palette.streak[300];
const AMBER_DARK = palette.streak[300];

export interface RingColors {
  track: string;
  progress: string;
  fill: string;
  todayBg: string | undefined;
  todayBorder: string | undefined;
  text: string;
  checkIcon: string;
}

export function getRingColors(
  isDark: boolean,
  isToday: boolean,
  status: CompletionStatus
): RingColors {
  const isAmber = isToday && status !== 'complete' && status !== 'future';

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
    : isDark
      ? PROGRESS_EMERALD_DARK
      : PROGRESS_EMERALD_LIGHT;

  let text: string = isDark ? darkColors.text.primary : palette.gray[800];
  if (status === 'complete') text = '#ffffff';
  else if (isToday) text = isDark ? palette.streak[300] : palette.streak[700];
  else if (status === 'future')
    text = isDark ? darkColors.text.tertiary : palette.gray[400];

  return {
    track: isDark ? TRACK_DARK : TRACK_LIGHT,
    progress,
    fill: isDark ? FILL_COMPLETE_DARK : FILL_COMPLETE_LIGHT,
    todayBg,
    todayBorder,
    text,
    checkIcon: '#ffffff',
  };
}

export const MONTH_PREFIX_COLORS = {
  light: palette.primary[600],
  dark: palette.primary[400],
};

export const COMPLETE_GLOW = {
  shadowColor: palette.primary[500],
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.4,
  shadowRadius: 10,
  elevation: 4,
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
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  dayTextWithPrefix: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  dayTextTodayWithPrefix: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  dayTextToday: {
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
  future: {
    opacity: 0.3,
  },
  missed: {
    opacity: 0.55,
  },
  monthPrefixText: {
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: -1,
    textAlign: 'center',
  },
  solidFill: {
    alignItems: 'center',
    borderRadius: RING_SIZE / 2,
    height: RING_SIZE,
    justifyContent: 'center',
    width: RING_SIZE,
  },
  svg: {
    transform: [{ rotate: '-90deg' }],
  },
});
