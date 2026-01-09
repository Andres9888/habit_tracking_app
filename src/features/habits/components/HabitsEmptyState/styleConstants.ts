/**
 * HabitsEmptyState - Style Constants
 */

import type { TemplatePreview } from './HabitsEmptyState.types';

export const TEMPLATE_PREVIEWS: TemplatePreview[] = [
  { tagline: 'Prime your AM energy', title: 'Morning Momentum' },
  { tagline: 'Deep work ritual', title: 'Focus Flow' },
];

export const COLORS = {
  accent: {
    amber: '#d97706',
    amberLight: '#fef3c7',
    indigo: '#4f46e5',
    indigoLight: '#e0e7ff',
    purple: '#7c3aed',
    purpleLight: '#ede9fe',
  },
  border: {
    light: '#e7e5e4',
    medium: '#d6d3d1',
  },
  surface: {
    primary: '#ffffff',
    secondary: '#fafaf9',
    warm: '#fffbeb',
  },
  text: {
    muted: '#a8a29e',
    primary: '#1c1917',
    secondary: '#57534e',
    tertiary: '#78716c',
  },
} as const;

export const BASE_CARD_CLASS =
  'w-full rounded-2xl border border-stone-200 bg-white px-5 py-5';
