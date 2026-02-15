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
  const displayRate = Math.round(successRate);

  return (
    <View className='rounded-2xl bg-white/90 p-4 shadow-sm shadow-stone-200/50'>
      {/* Header */}
      <View className='mb-4 flex-row items-center justify-center gap-2'>
        <BarChart3 className='text-stone-500' size={18} />
        <Text className='text-lg font-semibold text-stone-800'>Statistics</Text>
      </View>

      <View className='gap-3'>
        {/* Top Row */}
        <View className='flex-row gap-3'>
          <StatCard
            bgColor='bg-emerald-50'
            delay={0}
            icon={<CheckCircle2 className='text-emerald-600' size={20} />}
            iconBgColor='bg-emerald-100'
            label='Completed'
            value={totalCompletions}
            valueColor='text-emerald-700'
          />
          <StatCard
            bgColor='bg-stone-50'
            delay={80}
            icon={<TrendingUp className='text-stone-600' size={20} />}
            iconBgColor='bg-stone-100'
            label='Success Rate'
            suffix='%'
            value={displayRate}
            valueColor='text-stone-700'
          />
        </View>

        {/* Bottom Row */}
        <View className='flex-row gap-3'>
          <StatCard
            bgColor='bg-amber-50'
            delay={160}
            icon={<Flame className='text-amber-600' fill='#d97706' size={20} />}
            iconBgColor='bg-amber-100'
            label='Current Streak'
            value={currentStreak}
            valueColor='text-amber-700'
          />
          <StatCard
            bgColor='bg-violet-50'
            delay={240}
            icon={<Calendar className='text-violet-600' size={20} />}
            iconBgColor='bg-violet-100'
            label='Days Tracking'
            value={daysTracking}
            valueColor='text-violet-700'
          />
        </View>
      </View>
    </View>
  );
}

export default StatsGrid;
