/**
 * EmptyState Constants
 * Default content for each variant
 */

import type { EmptyStateVariant, QuickStartTemplate, VariantConfig } from './types';

export const VARIANT_CONFIG: Record<EmptyStateVariant, VariantConfig> = {
  noData: {
    ctaLabel: 'Go to Habits',
    description:
      'You need at least 7 days of data to see meaningful analytics.',
    headline: 'Keep tracking',
    icon: '📊',
  },
  noHabits: {
    ctaLabel: 'Create Custom Habit',
    description: 'Or start with a popular template:',
    headline: 'Ready to build a new habit?',
    icon: '🚀',
  },
  noResults: {
    ctaLabel: 'Clear Filters',
    description:
      "Try adjusting your search or filters to find what you're looking for.",
    headline: 'No results found',
    icon: '🔍',
  },
  premiumLocked: {
    ctaLabel: 'Start Free Trial',
    description: 'Unlock advanced analytics and insights with Premium.',
    headline: 'Premium Feature',
    icon: '🔒',
  },
};

/**
 * Quick start templates for first-time users
 * Reduces decision fatigue by offering popular habits
 */
export const QUICK_START_TEMPLATES: QuickStartTemplate[] = [
  { emoji: '🧘', name: 'Meditate', duration: '10 min' },
  { emoji: '📖', name: 'Read', duration: '20 min' },
  { emoji: '💪', name: 'Exercise', duration: '30 min' },
  { emoji: '💧', name: 'Drink Water', duration: '8 glasses' },
];
