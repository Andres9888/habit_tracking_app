/**
 * StatsGrid Component
 * Displays key habit statistics with visual polish
 *
 * @deprecated This component has been replaced by the "Journey Stats" section
 * in InsightsSection. All metrics (totalCompletions, successRate, daysTracking)
 * are now displayed there. This component is kept for reference but should not
 * be used in new code.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import {
  CheckCircle2,
  TrendingUp,
  Flame,
  Calendar,
  BarChart3,
} from 'lucide-react-native';
import { StatCard } from './StatCard';

export interface StatsGridProps {
  currentStreak: number;
  daysTracking: number;
  successRate: number;
  totalCompletions: number;
}

/** @deprecated Use InsightsSection for metrics display */
export function StatsGrid({
  currentStreak,
  daysTracking,
  successRate,
  totalCompletions,
}: StatsGridProps) {
  const { colors: themeColors } = useThemeColors();
  const displayRate = Math.round(successRate);

  return (
    <View className='rounded-2xl p-4 shadow-sm' style={{ backgroundColor: themeColors.card, shadowColor: themeColors.border }}>
      {/* Header */}
      <View className='mb-4 flex-row items-center justify-center gap-2'>
        <BarChart3 color={themeColors.text.secondary} size={18} />
        <Text className='text-lg font-semibold' style={{ color: themeColors.text.primary }}>Statistics</Text>
      </View>

      <View className='gap-3'>
        {/* Top Row */}
        <View className='flex-row gap-3'>
          <StatCard
            bgColor=''
            bgStyle={{ backgroundColor: themeColors.status.successLight }}
            delay={0}
            icon={<CheckCircle2 color={themeColors.status.success} size={20} />}
            iconBgColor=''
            iconBgStyle={{ backgroundColor: themeColors.status.successLight }}
            label='Completed'
            value={totalCompletions}
            valueColor=''
            valueStyle={{ color: themeColors.status.successText }}
          />
          <StatCard
            bgColor=''
            delay={80}
            icon={<TrendingUp color={themeColors.text.primary} size={20} />}
            iconBgColor=''
            label='Success Rate'
            suffix='%'
            value={displayRate}
            valueColor=''
          />
        </View>

        {/* Bottom Row */}
        <View className='flex-row gap-3'>
          <StatCard
            bgColor=''
            bgStyle={{ backgroundColor: themeColors.status.warningLight }}
            delay={160}
            icon={<Flame color={themeColors.status.warning} fill={themeColors.status.warning} size={20} />}
            iconBgColor=''
            iconBgStyle={{ backgroundColor: themeColors.status.warningLight }}
            label='Current Streak'
            value={currentStreak}
            valueColor=''
            valueStyle={{ color: themeColors.status.warningText }}
          />
          <StatCard
            bgColor=''
            bgStyle={{ backgroundColor: themeColors.status.premiumLight }}
            delay={240}
            icon={<Calendar color={themeColors.status.premium} size={20} />}
            iconBgColor=''
            iconBgStyle={{ backgroundColor: themeColors.status.premiumLight }}
            label='Days Tracking'
            value={daysTracking}
            valueColor=''
            valueStyle={{ color: themeColors.status.premiumText }}
          />
        </View>
      </View>
    </View>
  );
}

export default StatsGrid;
