/**
 * EmptyState Constants
 * Default content for each variant
 */

import type { EmptyStateVariant, VariantConfig } from './types';

export const VARIANT_CONFIG: Record<EmptyStateVariant, VariantConfig> = {
  noData: {
    ctaLabel: 'Go to Habits',
    description:
      'You need at least 7 days of data to see meaningful analytics.',
    headline: 'Keep tracking',
    icon: '📊',
  },
  noHabits: {
    ctaLabel: 'New Habit',
    description:
      'Add a habit to start tracking your progress and building streaks.',
    headline: 'Create your first habit',
    icon: '🌱',
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
