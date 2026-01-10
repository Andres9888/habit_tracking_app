/**
 * StreakRecordsSection Component
 * Displays top streak records with medal indicators
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Trophy } from 'lucide-react-native';
import type { StreakRecordsSectionProps } from '../InsightsSection.types';
import { TOP_STREAK_MEDAL_COUNT } from '../InsightsSection.constants';

const MEDAL_EMOJIS = ['🥇', '🥈', '🥉'];

const MEDAL_STYLES = [
  {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    subtext: 'text-amber-500',
    text: 'text-amber-700',
  },
  {
    bg: 'bg-stone-50',
    border: 'border-stone-200',
    subtext: 'text-stone-500',
    text: 'text-stone-700',
  },
  {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    subtext: 'text-orange-500',
    text: 'text-orange-700',
  },
];

export function StreakRecordsSection({
  streakRecords,
}: StreakRecordsSectionProps) {
  if (streakRecords.length === 0) return null;

  const topRecords = streakRecords.slice(0, TOP_STREAK_MEDAL_COUNT);

  return (
    <View className='overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50'>
      <View className='absolute inset-0 bg-gradient-to-br from-violet-50/30 via-white to-blue-50/30' />
      <View className='p-5'>
        <View className='mb-4 flex-row items-center justify-center gap-2'>
          <View className='h-8 w-8 items-center justify-center rounded-lg bg-violet-100'>
            <Trophy className='text-violet-500' size={16} />
          </View>
          <Text className='text-lg font-bold text-stone-800'>
            Streak Records
          </Text>
        </View>
        <Text className='mb-3 text-center text-[10px] font-bold uppercase tracking-widest text-violet-500'>
          Top Performances
        </Text>

        {/* Compact Top 3 Medals */}
        <View className='flex-row gap-2'>
          {topRecords.map((record, i) => {
            const style = MEDAL_STYLES[i];
            return (
              <View
                key={`${record.startDate}-${record.days}`}
                className={`flex-1 items-center rounded-xl border p-2.5 ${style.border} ${style.bg}`}
              >
                <Text className='mb-0.5 text-base'>{MEDAL_EMOJIS[i]}</Text>
                <Text className={`text-lg font-bold ${style.text}`}>
                  {record.days}
                </Text>
                <Text className={`text-[9px] ${style.subtext}`}>days</Text>
                {record.isCurrent && (
                  <View className='mt-1 rounded-full bg-amber-100 px-1.5 py-0.5'>
                    <Text className='text-[8px] font-semibold text-amber-700'>
                      NOW
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
