/**
 * Unified category metadata — colors, icons, labels, premium flags
 */

import { colors } from '../../../theme/colors';
import type { CategoryMeta } from './categoryMeta.types';

export type { CategoryMeta } from './categoryMeta.types';

// Four category color families. Every category pulls from one of these,
// so all 14 categories collapse onto 4 token-aligned hue roles:
//   green  → body / growth / compounding        (primary scale)
//   gold   → warmth / time / accumulation       (streak scale)
//   purple → mind / introspection / creativity  (premium scale)
//   blue   → calm / focus / rest                (info flat token)
// bg/border for purple and blue are hand-picked light tints because the
// premium and info tokens don't yet expose 50/100 stops; chosen to match
// the saturation of primary[50/200] and streak[100/300] so the system
// reads as one palette on screen.
const T = {
  green:  { bg: colors.primary[50],  border: colors.primary[200], text: colors.primary[700] },
  gold:   { bg: colors.streak[100],  border: colors.streak[300],  text: colors.streak[700] },
  purple: { bg: '#F5F0FF',           border: '#E0D4F5',           text: colors.premium[600] },
  blue:   { bg: '#EEF4FB',           border: '#D0DFEF',           text: colors.info },
} as const;

/* eslint-disable max-len */
export const CATEGORY_META: Record<string, CategoryMeta> = {
  andrew_huberman: { bgColor: T.green.bg, borderColor: T.green.border, icon: '🔬', isPremium: true, label: 'Huberman', subtitle: 'Neuroscience-backed protocols for peak performance', textColor: T.green.text },
  breathing: { bgColor: T.blue.bg, borderColor: T.blue.border, icon: '🌬️', isPremium: false, label: 'Breathing', subtitle: 'Regulate your nervous system with breathwork', textColor: T.blue.text },
  creativity: { bgColor: T.purple.bg, borderColor: T.purple.border, icon: '🎨', isPremium: false, label: 'Creativity', subtitle: 'Spark imagination and creative output', textColor: T.purple.text },
  financial: { bgColor: T.green.bg, borderColor: T.green.border, icon: '💰', isPremium: false, label: 'Financial', subtitle: 'Build money habits that compound over time', textColor: T.green.text },
  health_fitness: { bgColor: T.green.bg, borderColor: T.green.border, icon: '💪', isPremium: false, label: 'Health', subtitle: 'Strengthen your body with lasting physical habits', textColor: T.green.text },
  learning: { bgColor: T.purple.bg, borderColor: T.purple.border, icon: '📚', isPremium: false, label: 'Learning', subtitle: 'Grow your knowledge and skills daily', textColor: T.purple.text },
  longevity: { bgColor: T.gold.bg, borderColor: T.gold.border, icon: '🧬', isPremium: false, label: 'Longevity', subtitle: 'Evidence-based habits for a longer, healthier life', textColor: T.gold.text },
  mental_health: { bgColor: T.purple.bg, borderColor: T.purple.border, icon: '🧠', isPremium: false, label: 'Mental Health', subtitle: 'Support emotional resilience and well-being', textColor: T.purple.text },
  mindfulness: { bgColor: T.purple.bg, borderColor: T.purple.border, icon: '🧘', isPremium: false, label: 'Mindfulness', subtitle: 'Reduce stress and sharpen awareness daily', textColor: T.purple.text },
  morning_routine: { bgColor: T.gold.bg, borderColor: T.gold.border, icon: '🌅', isPremium: false, label: 'Morning', subtitle: 'Build energy, clarity, and momentum before 9am', textColor: T.gold.text },
  productivity: { bgColor: T.blue.bg, borderColor: T.blue.border, icon: '🎯', isPremium: false, label: 'Productivity', subtitle: 'Focus deeper and get more done each day', textColor: T.blue.text },
  recovery: { bgColor: T.gold.bg, borderColor: T.gold.border, icon: '🔄', isPremium: false, label: 'Recovery', subtitle: 'Rest and restore for sustainable performance', textColor: T.gold.text },
  sleep: { bgColor: T.blue.bg, borderColor: T.blue.border, icon: '😴', isPremium: false, label: 'Sleep', subtitle: 'Wind down and optimize rest for peak recovery', textColor: T.blue.text },
  social: { bgColor: T.gold.bg, borderColor: T.gold.border, icon: '👥', isPremium: false, label: 'Social', subtitle: 'Nurture relationships and community connections', textColor: T.gold.text },
  relationships: { bgColor: T.gold.bg, borderColor: T.gold.border, icon: '❤️', isPremium: false, label: 'Relationships', subtitle: 'Nurture meaningful connections daily', textColor: T.gold.text },
  environmental_design: { bgColor: T.blue.bg, borderColor: T.blue.border, icon: '🏠', isPremium: false, label: 'Environment', subtitle: 'Design your space for better habits', textColor: T.blue.text },
  subtraction: { bgColor: T.purple.bg, borderColor: T.purple.border, icon: '✂️', isPremium: false, label: 'Subtraction', subtitle: 'Remove what holds you back', textColor: T.purple.text },
};
/* eslint-enable max-len */

export const DEFAULT_CATEGORY_META: CategoryMeta = {
  bgColor: colors.gray[100], borderColor: colors.gray[200], icon: '📌',
  isPremium: false, label: 'Other', textColor: colors.gray[700],
};

export function getCategoryMeta(categoryId: string): CategoryMeta {
  return CATEGORY_META[categoryId] ?? DEFAULT_CATEGORY_META;
}
