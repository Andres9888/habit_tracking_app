/**
 * Analytics feature data for analytics variant
 */

import type { AnalyticsFeatureItem } from './PremiumPaywall.types';

export const ANALYTICS_FEATURES: readonly AnalyticsFeatureItem[] = [
  {
    description:
      'Track unlimited habits and build routines in every area of your life',
    icon: 'infinite',
    title: 'Unlimited Habits',
  },
  {
    description:
      'See which habits are strongest and which need more attention',
    icon: 'stats-chart',
    title: 'Habit Strength Insights',
  },
  {
    description: 'Visualize your progress with beautiful habit calendars',
    icon: 'calendar',
    title: 'Progress Heatmaps',
  },
  {
    description: 'Get personalized tips to build unbreakable habits',
    icon: 'bulb',
    title: 'AI-Powered Insights',
  },
  {
    description: 'Track trends over time with detailed analytics',
    icon: 'trending-up',
    title: 'Advanced Analytics',
  },
  {
    description: 'Export your complete habit data as CSV or JSON',
    icon: 'download',
    title: 'Data Export',
  },
];
