/**
 * StatsRow - Completion stats display row
 */

import React from 'react';
import { View } from 'react-native';
import { TrendingUp, Trophy, Target } from 'lucide-react-native';

import { StatCard } from './StatCard';
import type { StatsRowProps } from '../types';

export function StatsRow({
  completionRate,
  bestStreak,
  totalCompletions,
}: StatsRowProps) {
  return (
    <View className='flex-row gap-3'>
      {completionRate !== undefined && (
        <StatCard
          color='emerald'
          icon={<TrendingUp className='text-emerald-500' size={20} />}
          label='Completion'
          value={`${Math.round(completionRate)}%`}
        />
      )}
      {bestStreak !== undefined && (
        <StatCard
          color='amber'
          icon={<Trophy className='text-amber-500' size={20} />}
          label='Best Streak'
          value={bestStreak}
        />
      )}
      {totalCompletions !== undefined && (
        <StatCard
          color='violet'
          icon={<Target className='text-violet-500' size={20} />}
          label='Total'
          value={totalCompletions}
        />
      )}
    </View>
  );
}
