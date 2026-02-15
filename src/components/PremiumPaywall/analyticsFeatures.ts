/**
 * Analytics feature data for analytics variant
 */

import type { AnalyticsFeatureItem } from './PremiumPaywall.types';

export const ANALYTICS_FEATURES: readonly AnalyticsFeatureItem[] = [
  {
    description:
      'Track every habit across health, work, learning, and more — no limits.',
    icon: 'infinite',
    title: 'Track Every Habit That Matters',
  },
  {
    description:
      'Instantly see which habits are strongest and which need attention.',
    icon: 'stats-chart',
    title: 'Know What\'s Working',
  },
  {
    description: 'Beautiful calendar heatmaps that make your consistency visible.',
    icon: 'calendar',
    title: 'See Your Progress Glow',
  },
  {
    description: 'Personalized tips based on your patterns to keep you on track.',
    icon: 'bulb',
    title: 'Get Smarter Every Day',
  },
  {
    description: 'Spot trends, compare streaks, and understand your long-term growth.',
    icon: 'trending-up',
    title: 'Understand Your Growth',
  },
  {
    description: 'Own your data — export everything as CSV or JSON anytime.',
    icon: 'download',
    title: 'Your Data, Your Way',
  },
];
