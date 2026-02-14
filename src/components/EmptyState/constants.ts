/**
 * EmptyState Constants
 * Default content for each variant
 */

import type {
  EmptyStateVariant,
  QuickStartTemplate,
  VariantConfig,
} from './types';

export const VARIANT_CONFIG: Record<EmptyStateVariant, VariantConfig> = {
  noData: {
    ctaLabel: 'Go to Habits',
    description:
      'A few more days of tracking and your analytics will come alive.',
    headline: 'Almost There',
    icon: '📊',
  },
  noHabits: {
    ctaLabel: 'Create Your Own',
    description: 'Or jump in with a popular template:',
    headline: 'Your journey starts here',
    icon: '🌱',
  },
  noResults: {
    ctaLabel: 'Clear Filters',
    description:
      'Try different keywords or remove some filters.',
    headline: 'Nothing matched',
    icon: '🔍',
  },
  premiumLocked: {
    ctaLabel: 'Start Free Trial',
    description: 'Deeper insights, trends, and patterns — all included with Premium.',
    headline: 'Unlock the Full Picture',
    icon: '✨',
  },
};

/**
 * Quick start templates for first-time users
 * Reduces decision fatigue by offering popular habits
 */
export const QUICK_START_TEMPLATES: QuickStartTemplate[] = [
  { duration: '10 min', emoji: '🧘', name: 'Meditate' },
  { duration: '20 min', emoji: '📖', name: 'Read' },
  { duration: '30 min', emoji: '💪', name: 'Exercise' },
  { duration: '8 glasses', emoji: '💧', name: 'Drink Water' },
];
