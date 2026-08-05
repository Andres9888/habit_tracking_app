/**
 * Analytics feature data for analytics variant
 */

import {
  Infinity,
  BarChart3,
  Calendar,
  Lightbulb,
  TrendingUp,
  Download,
} from 'lucide-react-native';
import type { AnalyticsFeatureItem } from './PremiumPaywall.types';

export const ANALYTICS_FEATURES: readonly AnalyticsFeatureItem[] = [
  {
    description:
      'Track every habit across health, work, learning, and more — no limits.',
    icon: Infinity,
    title: 'Unlimited Habits',
  },
  {
    description:
      'Instantly see which habits are strongest and which need attention.',
    icon: BarChart3,
    title: 'Habit Strength Insights',
  },
  {
    description: 'Beautiful calendar heatmaps that make your consistency visible.',
    icon: Calendar,
    title: 'Progress Heatmaps',
  },
  {
    description: 'Personalized tips based on your patterns to keep you on track.',
    icon: Lightbulb,
    title: 'AI-Powered Insights',
  },
  {
    description: 'Spot trends, compare streaks, and understand your long-term growth.',
    icon: TrendingUp,
    title: 'Advanced Analytics',
  },
  {
    description: 'Own your data — export everything as CSV or JSON anytime.',
    icon: Download,
    title: 'Data Export',
  },
];
