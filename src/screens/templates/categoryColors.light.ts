import { colors } from '../../theme/colors';
import type { CategoryColorMap } from './categoryColors.types';

export const CATEGORY_COLORS: CategoryColorMap = {
  all: { bg: '#EEF2FF', bgSelected: '#6366F1', border: '#C7D2FE', text: '#4338CA' },
  andrew_huberman: { bg: '#ECFDF5', bgSelected: colors.primary[600], border: '#A7F3D0', text: colors.primary[700] },
  breathing: { bg: '#E0F2FE', bgSelected: '#0284C7', border: '#BAE6FD', text: '#0369A1' },
  creativity: { bg: '#FDF2F8', bgSelected: '#EC4899', border: '#FBCFE8', text: '#BE185D' },
  environmental_design: { bg: '#ECFDF5', bgSelected: '#059669', border: '#A7F3D0', text: '#065F46' },
  financial: { bg: '#ECFDF5', bgSelected: '#10B981', border: '#A7F3D0', text: colors.primary[600] },
  health_fitness: { bg: '#D1FAE5', bgSelected: '#10B981', border: '#6EE7B7', text: colors.primary[700] },
  learning: { bg: '#F3E8FF', bgSelected: '#8B5CF6', border: '#DDD6FE', text: '#7C3AED' },
  longevity: { bg: '#FEF3C7', bgSelected: '#D97706', border: '#FDE68A', text: '#B45309' },
  mental_health: { bg: '#E0E7FF', bgSelected: '#6366F1', border: '#C7D2FE', text: '#4F46E5' },
  mindfulness: { bg: '#F5F3FF', bgSelected: '#8B5CF6', border: '#E9D5FF', text: '#7C3AED' },
  morning_routine: { bg: '#FEF3C7', bgSelected: '#F59E0B', border: '#FDE68A', text: '#9A5504' },
  productivity: { bg: '#DBEAFE', bgSelected: '#3B82F6', border: '#BFDBFE', text: '#2563EB' },
  recovery: { bg: '#FCE7F3', bgSelected: '#EC4899', border: '#FBCFE8', text: '#DB2777' },
  sleep: { bg: '#E0E7FF', bgSelected: '#1E3A8A', border: '#C7D2FE', text: '#1E40AF' },
  social: { bg: '#FFE4E6', bgSelected: '#F43F5E', border: '#FECDD3', text: '#E11D48' },
  subtraction: { bg: '#F5F3FF', bgSelected: '#7C3AED', border: '#DDD6FE', text: '#6D28D9' },
};
