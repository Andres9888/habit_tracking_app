/**
 * PremiumAnalyticsPaywall Constants
 */

import { Dimensions } from 'react-native';
import type { FeatureItem } from './PremiumAnalyticsPaywall.types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
export { screenWidth, screenHeight };

export const PREMIUM_FEATURES: FeatureItem[] = [
  {
    description:
      'Track unlimited habits and build routines in every area of your life',
    icon: 'infinite',
    title: 'Unlimited Habits',
  },
  {
    description: 'See which habits are strongest and which need more attention',
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
