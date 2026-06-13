import { colors } from '../../theme/colors';
import { darkColors } from '../../theme/darkColors';
import type { CategoryColorMap } from './categoryColors.types';

export const CATEGORY_COLORS_DARK: CategoryColorMap = {
  all: { bg: '#0F172A', bgSelected: '#3B82F6', border: '#334155', text: '#93C5FD' },
  andrew_huberman: { bg: '#022C22', bgSelected: darkColors.primary[600], border: darkColors.primary[100], text: darkColors.primary[500] },
  breathing: { bg: '#0B2A48', bgSelected: colors.secondary[600], border: colors.secondary[600], text: colors.secondary[400] },
  creativity: { bg: '#3B0F26', bgSelected: '#F43F5E', border: '#9D174D', text: '#FDA4AF' },
  environmental_design: { bg: '#022C22', bgSelected: '#059669', border: '#065F46', text: '#6EE7B7' },
  financial: { bg: '#052f2a', bgSelected: darkColors.primary[500], border: darkColors.primary[100], text: darkColors.primary[400] },
  health_fitness: { bg: '#043227', bgSelected: darkColors.primary[700], border: darkColors.primary[300], text: darkColors.primary[600] },
  learning: { bg: '#2E1065', bgSelected: '#A78BFA', border: '#6D28D9', text: '#C4B5FD' },
  longevity: { bg: '#451A03', bgSelected: colors.warning, border: '#92400E', text: '#FED7AA' },
  mental_health: { bg: '#312E81', bgSelected: '#60A5FA', border: '#4338CA', text: '#A5B4FC' },
  mindfulness: { bg: '#4C1D95', bgSelected: '#A78BFA', border: '#7C3AED', text: '#DDD6FE' },
  morning_routine: { bg: '#3F1D0A', bgSelected: colors.warning, border: '#92400E', text: '#FDE68A' },
  productivity: { bg: '#0C2B4D', bgSelected: colors.secondary[600], border: colors.secondary[600], text: colors.secondary[400] },
  recovery: { bg: '#3D1039', bgSelected: '#F43F5E', border: '#9D174D', text: '#FDA4AF' },
  sleep: { bg: '#111827', bgSelected: colors.secondary[500], border: colors.secondary[500], text: colors.secondary[400] },
  social: { bg: '#4A1119', bgSelected: '#F43F5E', border: '#9D174D', text: '#FDA4AF' },
  subtraction: { bg: '#2E1065', bgSelected: '#7C3AED', border: '#6D28D9', text: '#C4B5FD' },
};
