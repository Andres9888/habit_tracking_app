/**
 * Per-category accent + gradient wash for the science drill-down.
 *
 * Accents are drawn from the existing Chain Day palette (primary / strength)
 * so no new brand hues are invented. The soft gradient stops are light washes
 * paired to each accent — used only for the hero header backgrounds.
 */

import { colors } from '@/theme';
import type { Template } from '../../../../types/template';

export interface ScienceTheme {
  accent: string;
  gradientStart: string;
  gradientEnd: string;
}

const FOREST: ScienceTheme = {
  accent: colors.primary[700],
  gradientStart: '#D7F0E4',
  gradientEnd: '#EAF6F0',
};
const TEAL: ScienceTheme = {
  accent: colors.strength.developing,
  gradientStart: '#CDF7EE',
  gradientEnd: '#E5F5F0',
};
const CYAN: ScienceTheme = {
  accent: colors.strength.strong,
  gradientStart: '#CFF7FB',
  gradientEnd: '#E6F5F7',
};
const GREEN: ScienceTheme = {
  accent: colors.strength.building,
  gradientStart: '#DCF7E4',
  gradientEnd: '#EAF6EC',
};

const BY_CATEGORY: Record<string, ScienceTheme> = {
  mindfulness: FOREST,
  mental_health: FOREST,
  breathing: FOREST,
  recovery: FOREST,
  sleep: TEAL,
  longevity: TEAL,
  productivity: CYAN,
  learning: CYAN,
  creativity: CYAN,
  andrew_huberman: CYAN,
  environmental_design: CYAN,
  subtraction: CYAN,
  health_fitness: GREEN,
  morning_routine: GREEN,
  financial: GREEN,
  social: GREEN,
};

export function scienceTheme(template?: Template): ScienceTheme {
  return BY_CATEGORY[template?.category ?? ''] ?? FOREST;
}
