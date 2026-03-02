/**
 * Templates Screen - Category Color Mappings
 */

import type { CategoryColorTokens } from './templates.types';
import { colors } from '../../theme/colors';
import { darkColors } from '../../theme/darkColors';

type CategoryColorMap = Record<string, CategoryColorTokens>;

export const CATEGORY_COLORS: CategoryColorMap = {
  all: {
    bg: '#EEF2FF',
    bgSelected: '#6366F1',
    border: '#C7D2FE',
    text: '#4338CA',
  },
  andrew_huberman: {
    bg: '#ECFDF5',
    bgSelected: colors.primary[600],
    border: '#A7F3D0',
    text: colors.primary[700],
  },
  breathing: {
    bg: '#E0F2FE',
    bgSelected: '#0284C7',
    border: '#BAE6FD',
    text: '#0369A1',
  },
  creativity: {
    bg: '#FDF2F8',
    bgSelected: '#EC4899',
    border: '#FBCFE8',
    text: '#BE185D',
  },
  financial: {
    bg: '#ECFDF5',
    bgSelected: '#10B981',
    border: '#A7F3D0',
    text: colors.primary[600],
  },
  health_fitness: {
    bg: '#D1FAE5',
    bgSelected: '#10B981',
    border: '#6EE7B7',
    text: colors.primary[700],
  },
  learning: {
    bg: '#F3E8FF',
    bgSelected: '#8B5CF6',
    border: '#DDD6FE',
    text: '#7C3AED',
  },
  longevity: {
    bg: '#FEF3C7',
    bgSelected: '#D97706',
    border: '#FDE68A',
    text: '#B45309',
  },
  mental_health: {
    bg: '#E0E7FF',
    bgSelected: '#6366F1',
    border: '#C7D2FE',
    text: '#4F46E5',
  },
  mindfulness: {
    bg: '#F5F3FF',
    bgSelected: '#8B5CF6',
    border: '#E9D5FF',
    text: '#7C3AED',
  },
  morning_routine: {
    bg: '#FEF3C7',
    bgSelected: '#F59E0B',
    border: '#FDE68A',
    text: '#9A5504',
  },
  productivity: {
    bg: '#DBEAFE',
    bgSelected: '#3B82F6',
    border: '#BFDBFE',
    text: '#2563EB',
  },
  recovery: {
    bg: '#FCE7F3',
    bgSelected: '#EC4899',
    border: '#FBCFE8',
    text: '#DB2777',
  },
  sleep: {
    bg: '#E0E7FF',
    bgSelected: '#1E3A8A',
    border: '#C7D2FE',
    text: '#1E40AF',
  },
  social: {
    bg: '#FFE4E6',
    bgSelected: '#F43F5E',
    border: '#FECDD3',
    text: '#E11D48',
  },
};

export const CATEGORY_COLORS_DARK: CategoryColorMap = {
  all: {
    bg: '#0F172A',
    bgSelected: '#3B82F6',
    border: '#334155',
    text: '#93C5FD',
  },
  andrew_huberman: {
    bg: '#022C22',
    bgSelected: darkColors.primary[600],
    border: darkColors.primary[100],
    text: darkColors.primary[500],
  },
  breathing: {
    bg: '#0B2A48',
    bgSelected: colors.secondary[600],
    border: colors.secondary[600],
    text: colors.secondary[400],
  },
  creativity: {
    bg: '#3B0F26',
    bgSelected: '#F43F5E',
    border: '#9D174D',
    text: '#FDA4AF',
  },
  financial: {
    bg: '#052f2a',
    bgSelected: darkColors.primary[500],
    border: darkColors.primary[100],
    text: darkColors.primary[400],
  },
  health_fitness: {
    bg: '#043227',
    bgSelected: darkColors.primary[700],
    border: darkColors.primary[300],
    text: darkColors.primary[600],
  },
  learning: {
    bg: '#2E1065',
    bgSelected: '#A78BFA',
    border: '#6D28D9',
    text: '#C4B5FD',
  },
  longevity: {
    bg: '#451A03',
    bgSelected: colors.warning,
    border: '#92400E',
    text: '#FED7AA',
  },
  mental_health: {
    bg: '#312E81',
    bgSelected: '#60A5FA',
    border: '#4338CA',
    text: '#A5B4FC',
  },
  mindfulness: {
    bg: '#4C1D95',
    bgSelected: '#A78BFA',
    border: '#7C3AED',
    text: '#DDD6FE',
  },
  morning_routine: {
    bg: '#3F1D0A',
    bgSelected: colors.warning,
    border: '#92400E',
    text: '#FDE68A',
  },
  productivity: {
    bg: '#0C2B4D',
    bgSelected: colors.secondary[600],
    border: colors.secondary[600],
    text: colors.secondary[400],
  },
  recovery: {
    bg: '#3D1039',
    bgSelected: '#F43F5E',
    border: '#9D174D',
    text: '#FDA4AF',
  },
  sleep: {
    bg: '#111827',
    bgSelected: colors.secondary[500],
    border: colors.secondary[500],
    text: colors.secondary[400],
  },
  social: {
    bg: '#4A1119',
    bgSelected: '#F43F5E',
    border: '#9D174D',
    text: '#FDA4AF',
  },
};

export const DEFAULT_CATEGORY_COLORS: CategoryColorTokens = {
  bg: '#F3F4F6',
  bgSelected: '#374151',
  border: '#E5E7EB',
  text: '#374151',
};

export const DEFAULT_CATEGORY_COLORS_DARK: CategoryColorTokens = {
  bg: darkColors.gray[100],
  bgSelected: darkColors.primary[500],
  border: darkColors.border,
  text: darkColors.text.secondary,
};

export function getCategoryColors(isDark: boolean): CategoryColorMap {
  return isDark ? CATEGORY_COLORS_DARK : CATEGORY_COLORS;
}

export function getDefaultCategoryColors(isDark: boolean): CategoryColorTokens {
  return isDark ? DEFAULT_CATEGORY_COLORS_DARK : DEFAULT_CATEGORY_COLORS;
}
