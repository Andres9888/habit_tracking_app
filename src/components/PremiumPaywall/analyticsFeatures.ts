/**
 * Analytics feature data for analytics variant
 * Descriptions are benefit-focused: what the user gains, not what the feature does.
 */

import type { AnalyticsFeatureItem } from './PremiumPaywall.types';

export const ANALYTICS_FEATURES: readonly AnalyticsFeatureItem[] = [
  {
    description:
      'Never feel held back — grow in every area of life without limits.',
    icon: 'infinite',
    title: 'Unlimited Habits',
  },
  {
    description:
      'Know exactly where to focus so you improve faster every week.',
    icon: 'stats-chart',
    title: 'Habit Strength Insights',
  },
  {
    description: 'Feel proud watching your consistency grow day by day.',
    icon: 'calendar',
    title: 'Progress Heatmaps',
  },
  {
    description: 'Get advice tailored to your patterns — like a personal coach.',
    icon: 'bulb',
    title: 'AI-Powered Insights',
  },
  {
    description: 'Understand what drives your long-term growth and double down.',
    icon: 'trending-up',
    title: 'Advanced Analytics',
  },
  {
    description: 'Your data, your way — take it anywhere, anytime.',
    icon: 'download',
    title: 'Data Export',
  },
];
