/**
 * Legacy constants — retained for backwards-compat with external consumers.
 * @deprecated Prefer the theme-aware getStrengthColors / getThemeColors helpers.
 */

import type { StrengthLabel } from '../HabitStrengthHistory/types';
import type { StrengthColorSet } from './constants';

export const STRENGTH_COLORS: Record<StrengthLabel, StrengthColorSet> = {
  developing: {
    background: '#fffbeb',
    gradient: { end: 'rgba(245, 158, 11, 0.02)', start: 'rgba(245, 158, 11, 0.25)' },
    primary: '#f59e0b',
  },
  strong: {
    background: '#ecfdf5',
    gradient: { end: 'rgba(16, 185, 129, 0.02)', start: 'rgba(16, 185, 129, 0.25)' },
    primary: '#10b981',
  },
  weak: {
    background: '#fef2f2',
    gradient: { end: 'rgba(239, 68, 68, 0.02)', start: 'rgba(239, 68, 68, 0.25)' },
    primary: '#ef4444',
  },
};

export const COLORS = {
  border: '#e7e5e4',
  cardBackground: '#ffffff',
  gridLine: '#d6d3d1',
  negative: '#ef4444',
  positive: '#15793C',
  ringTrack: '#f5f5f4',
  textMuted: '#a8a29e',
  textPrimary: '#1c1917',
  textSecondary: '#78716c',
};
