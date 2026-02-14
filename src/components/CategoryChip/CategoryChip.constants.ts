/**
 * CategoryChip Constants
 */

import type { CategoryColorConfig } from './CategoryChip.types';

/** Convert hex color to rgba for valid color interpolation */
export const hexToRgba = (hex: string, alpha: number): string => {
  const red = Number.parseInt(hex.slice(1, 3), 16);
  const green = Number.parseInt(hex.slice(3, 5), 16);
  const blue = Number.parseInt(hex.slice(5, 7), 16);
  return `rgba(${red},${green},${blue},${alpha})`;
};

/** Category-specific color configurations */
export const CATEGORY_COLORS: Record<string, CategoryColorConfig> = {
  all: {
    gradient: ['#6366F1', '#8B5CF6'],
    primary: '#6366F1',
  },
  andrew_huberman: {
    gradient: ['#059669', '#10B981'],
    primary: '#059669',
  },
  creativity: {
    gradient: ['#EC4899', '#F472B6'],
    primary: '#EC4899',
  },
  financial: {
    gradient: ['#059669', '#34D399'],
    primary: '#059669',
  },
  health_fitness: {
    gradient: ['#10B981', '#14B8A6'],
    primary: '#10B981',
  },
  learning: {
    gradient: ['#8B5CF6', '#A78BFA'],
    primary: '#8B5CF6',
  },
  mindfulness: {
    gradient: ['#8B5CF6', '#A855F7'],
    primary: '#8B5CF6',
  },
  morning_routine: {
    gradient: ['#F59E0B', '#FB923C'],
    primary: '#F59E0B',
  },
  productivity: {
    gradient: ['#3B82F6', '#06B6D4'],
    primary: '#3B82F6',
  },
  sleep: {
    gradient: ['#1E3A8A', '#3B82F6'],
    primary: '#1E3A8A',
  },
  social: {
    gradient: ['#F43F5E', '#FB7185'],
    primary: '#F43F5E',
  },
};
