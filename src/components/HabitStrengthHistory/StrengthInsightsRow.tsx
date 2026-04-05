/**
 * StrengthInsightsRow Component
 *
 * Displays a horizontal row of three key metrics:
 * - Delta vs Month: Change in strength compared to 30 days ago
 * - Peak: Highest recorded strength value
 * - Lowest: Lowest recorded strength value
 */

import React from 'react';
import { View } from 'react-native';
import { Trophy, BarChart3 } from 'lucide-react-native';
import { InsightCard } from './InsightCard';
import { getDeltaIcon, getDeltaColor, formatDelta } from './deltaHelpers';
import { iconSizes } from '@/theme/iconSizes';

const ANIMATION_DELAY_BASE = 300;

export interface StrengthInsightsRowProps {
  /** Change in strength vs 30 days ago (positive = improvement) */
  deltaVsMonth: number;
  /** Highest recorded strength percentage (0-100) */
  peak: number;
  /** Lowest recorded strength percentage (0-100) */
  lowest: number;
}

export function StrengthInsightsRow({
  deltaVsMonth,
  peak,
  lowest,
}: StrengthInsightsRowProps) {
  return (
    <View
      accessible
      accessibilityLabel='Habit strength insights and statistics'
      accessibilityRole='none'
      className='flex-row gap-2'
    >
      <InsightCard
        accessibilityLabel={`${deltaVsMonth >= 0 ? 'Improved' : 'Declined'} ${Math.abs(deltaVsMonth).toFixed(0)} percent compared to last month`}
        animationDelay={ANIMATION_DELAY_BASE}
        icon={getDeltaIcon(deltaVsMonth)}
        label='vs Month'
        value={formatDelta(deltaVsMonth)}
        valueColor={getDeltaColor(deltaVsMonth)}
      />
      <InsightCard
        accessibilityLabel={`Peak strength: ${Math.round(peak)} percent`}
        animationDelay={ANIMATION_DELAY_BASE + 100}
        icon={<Trophy color='#f59e0b' size={iconSizes.medium} testID='icon-trophy' />}
        label='Peak'
        value={`${Math.round(peak)}%`}
      />
      <InsightCard
        accessibilityLabel={`Lowest strength: ${Math.round(lowest)} percent`}
        animationDelay={ANIMATION_DELAY_BASE + 200}
        icon={<BarChart3 color='#6b7280' size={iconSizes.medium} testID='icon-chart' />}
        label='Lowest'
        value={`${Math.round(lowest)}%`}
      />
    </View>
  );
}

export default StrengthInsightsRow;
