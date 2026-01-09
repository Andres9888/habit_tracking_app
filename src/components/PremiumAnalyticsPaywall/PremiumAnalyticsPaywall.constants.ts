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
      'Visualize your habits across 5 strength levels with interactive charts',
    icon: 'stats-chart',
    title: 'Strength Distribution',
  },
  {
    description: 'Track your progress over time with detailed trend analysis',
    icon: 'trending-up',
    title: '30-Day Trends',
  },
  {
    description:
      'GitHub-style calendar showing 90 days of habit completion patterns',
    icon: 'calendar',
    title: 'Compliance Heatmap',
  },
  {
    description: 'AI-powered insights on habits gaining or losing strength',
    icon: 'bulb',
    title: 'Weekly Insights',
  },
  {
    description: 'See your habits ranked by strength with current streaks',
    icon: 'trophy',
    title: 'Rankings & Streaks',
  },
  {
    description: 'Export your complete habit data as CSV or JSON',
    icon: 'download',
    title: 'Data Export',
  },
];
