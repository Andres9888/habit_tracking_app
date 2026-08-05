/**
 * Category color mappings for visual differentiation
 * Data-only file containing static theme configuration
 */

import { colors } from '@/theme/colors';
import type { CategoryColors } from './CategoryFilters.types';

export const CATEGORY_COLORS: Record<string, CategoryColors> = {
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
    bgSelected: colors.primary[700],
    border: '#A7F3D0',
    text: colors.primary[600],
  },
  health_fitness: {
    bg: '#D1FAE5',
    bgSelected: colors.primary[700],
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
    bgSelected: '#B45309',
    border: '#FDE68A',
    text: '#92400E',
  },
  productivity: {
    bg: '#DBEAFE',
    bgSelected: colors.secondary[500],
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

export const DEFAULT_COLORS: CategoryColors = {
  bg: '#f5f5f4',
  bgSelected: '#374151',
  border: '#e7e5e4',
  text: '#374151',
};
