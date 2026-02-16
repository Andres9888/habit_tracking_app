/**
 * Type definitions for WeeklyComparisonCard
 */

import type { TrendingUp } from 'lucide-react-native';
import type { WeekOverWeekTrend } from '../../../utils/trendCalculations';

export interface WeeklyComparisonCardProps {
  /** Week-over-week trend data */
  trend: WeekOverWeekTrend;
  /** Optional callback when info button is pressed */
  onInfoPress?: () => void;
  /** Optional callback when share button is pressed (only shown for positive trends) */
  onSharePress?: () => void;
}

export interface TrendStyle {
  bgColor: string;
  textColor: string;
  icon: typeof TrendingUp;
  label: string;
}
