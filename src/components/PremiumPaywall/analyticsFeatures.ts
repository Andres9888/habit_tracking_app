/**
 * Analytics feature data for analytics variant
 */

import type { AnalyticsFeatureItem } from './PremiumPaywall.types';

export const ANALYTICS_FEATURES: readonly AnalyticsFeatureItem[] = [
  {
    icon: 'infinite',
    title: 'Unlimited Habits',
    description:
      'Track unlimited habits and build routines in every area of your life',
  },
  {
    icon: 'stats-chart',
    title: 'Habit Strength Insights',
    description:
      'See which habits are strongest and which need more attention',
  },
  {
    icon: 'calendar',
    title: 'Progress Heatmaps',
    description: 'Visualize your progress with beautiful habit calendars',
  },
  {
    icon: 'bulb',
    title: 'AI-Powered Insights',
    description: 'Get personalized tips to build unbreakable habits',
  },
  {
    icon: 'trending-up',
    title: 'Advanced Analytics',
    description: 'Track trends over time with detailed analytics',
  },
  {
    icon: 'download',
    title: 'Data Export',
    description: 'Export your complete habit data as CSV or JSON',
  },
];
