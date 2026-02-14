/**
 * PersonalBestsCard Component
 *
 * @deprecated Use `ProgressSectionConsolidated` instead.
 * See `../ProgressSectionConsolidated` for the unified replacement.
 *
 * Section 2: Combines Streak Records + Best/Worst Days.
 * Features:
 * - Top 3 streak medals (compact horizontal layout)
 * - Current streak highlighted with pulse animation + "NOW 🔥" badge
 * - Best day card (emerald theme)
 * - "Focus On" card for worst day (amber theme, tappable for tips)
 * - Amber/orange gradient theme
 */

import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy } from 'lucide-react-native';

import type { PersonalBestsCardProps } from './types';
import { usePulseAnimation } from './PersonalBestsCard.hooks';
import { MedalRow } from './MedalRow';
import { BestWorstDayCards } from './BestWorstDayCards';

export function PersonalBestsCard({
  streakRecords,
  currentStreak,
  bestDay,
  worstDay,
  onWorstDayPress,
}: PersonalBestsCardProps) {
  const pulseAnimatedStyle = usePulseAnimation(currentStreak);

  const top3Records = streakRecords.slice(0, 3);
  const hasRecords = top3Records.length > 0;
  const showBestWorst = bestDay !== null && worstDay !== null;

  return (
    <View
      accessible
      accessibilityLabel={`Personal bests${currentStreak > 0 ? `, current streak ${currentStreak} days` : ''}`}
      className='overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50'
    >
      <LinearGradient
        colors={['rgba(255, 251, 235, 0.3)', '#ffffff', 'rgba(255, 237, 213, 0.3)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className='absolute inset-0'
      />
      <View className='absolute inset-0 rounded-2xl border border-amber-500/20' />

      <View className='p-4'>
        <View className='mb-3 flex-row items-center gap-2'>
          <View className='h-8 w-8 items-center justify-center rounded-lg bg-amber-100'>
            <Trophy className='text-amber-500' size={16} />
          </View>
          <Text className='text-base font-semibold text-stone-800'>
            Personal Bests
          </Text>
        </View>

        {hasRecords && (
          <MedalRow
            currentStreak={currentStreak}
            pulseAnimatedStyle={pulseAnimatedStyle}
            records={top3Records}
          />
        )}

        {showBestWorst && (
          <BestWorstDayCards
            bestDay={bestDay}
            worstDay={worstDay}
            onWorstDayPress={onWorstDayPress}
          />
        )}

        {!hasRecords && currentStreak === 0 && (
          <View className='items-center py-4'>
            <Text className='text-sm text-stone-500'>
              Complete 2+ consecutive days to start tracking streaks
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default PersonalBestsCard;
