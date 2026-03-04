import { StyleSheet } from 'react-native';

import { colors as palette } from '../../../theme/colors';
import { darkColors } from '../../../theme/darkColors';
import type { CompletionStatus } from '../CalendarTimeline.types';

export const RING_SIZE = 44;
export const STROKE_WIDTH = 3;
export const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const TRACK_LIGHT = palette.light.card;
const TRACK_DARK = 'rgba(255,255,255,0.08)';
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
  text: string;
  checkIcon: string;
}

export function getRingColors(
  isDark: boolean,
  isToday: boolean,
  status: CompletionStatus
): RingColors {
  const isAmber = isToday && status !== 'complete' && status !== 'future';

  return {
    track: isDark ? TRACK_DARK : TRACK_LIGHT,
    progress: isAmber
      ? isDark
        ? AMBER_DARK
        : AMBER_LIGHT
      : isDark
        ? PROGRESS_EMERALD_DARK
        : PROGRESS_EMERALD_LIGHT,
    fill: isDark ? FILL_COMPLETE_DARK : FILL_COMPLETE_LIGHT,
    text:
      status === 'complete'
        ? '#ffffff'
        : isToday
          ? isDark
            ? palette.streak[300]
            : palette.streak[700]
          : status === 'future'
            ? isDark
              ? darkColors.text.tertiary
              : palette.gray[400]
            : isDark
              ? darkColors.text.primary
              : palette.gray[800],
    checkIcon: '#ffffff',
  };
}

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
  future: {
    opacity: 0.4,
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
