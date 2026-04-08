/**
 * Unified category metadata — colors, icons, labels, premium flags
 */

import { colors } from '../../../theme/colors';
import type { CategoryMeta } from './categoryMeta.types';

export type { CategoryMeta } from './categoryMeta.types';

const p600 = colors.primary[600];
const p700 = colors.primary[700];

/* eslint-disable max-len */
export const CATEGORY_META: Record<string, CategoryMeta> = {
  andrew_huberman: { bgColor: '#ECFDF5', borderColor: '#A7F3D0', icon: '🔬', isPremium: true, label: 'Huberman', subtitle: 'Neuroscience-backed protocols for peak performance', textColor: p700 },
  breathing: { bgColor: '#E0F2FE', borderColor: '#BAE6FD', icon: '🌬️', isPremium: false, label: 'Breathing', subtitle: 'Regulate your nervous system with breathwork', textColor: '#0369A1' },
  creativity: { bgColor: '#FDF2F8', borderColor: '#FBCFE8', icon: '🎨', isPremium: false, label: 'Creativity', subtitle: 'Spark imagination and creative output', textColor: '#BE185D' },
  financial: { bgColor: '#ECFDF5', borderColor: '#A7F3D0', icon: '💰', isPremium: false, label: 'Financial', subtitle: 'Build money habits that compound over time', textColor: p600 },
  health_fitness: { bgColor: '#D1FAE5', borderColor: '#6EE7B7', icon: '💪', isPremium: false, label: 'Health', subtitle: 'Strengthen your body with lasting physical habits', textColor: p700 },
  learning: { bgColor: '#F3E8FF', borderColor: '#DDD6FE', icon: '📚', isPremium: false, label: 'Learning', subtitle: 'Grow your knowledge and skills daily', textColor: '#7C3AED' },
  longevity: { bgColor: '#FEF3C7', borderColor: '#FDE68A', icon: '🧬', isPremium: false, label: 'Longevity', subtitle: 'Evidence-based habits for a longer, healthier life', textColor: '#B45309' },
  mental_health: { bgColor: '#E0E7FF', borderColor: '#C7D2FE', icon: '🧠', isPremium: false, label: 'Mental Health', subtitle: 'Support emotional resilience and well-being', textColor: '#4F46E5' },
  mindfulness: { bgColor: '#F5F3FF', borderColor: '#E9D5FF', icon: '🧘', isPremium: false, label: 'Mindfulness', subtitle: 'Reduce stress and sharpen awareness daily', textColor: '#7C3AED' },
  morning_routine: { bgColor: '#FEF3C7', borderColor: '#FDE68A', icon: '🌅', isPremium: false, label: 'Morning', subtitle: 'Build energy, clarity, and momentum before 9am', textColor: '#9A5504' },
  productivity: { bgColor: '#DBEAFE', borderColor: '#BFDBFE', icon: '🎯', isPremium: false, label: 'Productivity', subtitle: 'Focus deeper and get more done each day', textColor: '#2563EB' },
  recovery: { bgColor: '#FCE7F3', borderColor: '#FBCFE8', icon: '🔄', isPremium: false, label: 'Recovery', subtitle: 'Rest and restore for sustainable performance', textColor: '#DB2777' },
  sleep: { bgColor: '#E0E7FF', borderColor: '#C7D2FE', icon: '😴', isPremium: false, label: 'Sleep', subtitle: 'Wind down and optimize rest for peak recovery', textColor: '#1E40AF' },
  social: { bgColor: '#FFE4E6', borderColor: '#FECDD3', icon: '👥', isPremium: false, label: 'Social', subtitle: 'Nurture relationships and community connections', textColor: '#E11D48' },
};
/* eslint-enable max-len */

export const DEFAULT_CATEGORY_META: CategoryMeta = {
  bgColor: '#F3F4F6', borderColor: '#E5E7EB', icon: '📌',
  isPremium: false, label: 'Other', textColor: '#374151',
};

export function getCategoryMeta(categoryId: string): CategoryMeta {
  return CATEGORY_META[categoryId] ?? DEFAULT_CATEGORY_META;
}
