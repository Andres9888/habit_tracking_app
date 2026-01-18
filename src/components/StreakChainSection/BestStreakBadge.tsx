/**
 * BestStreakBadge Component
 * Shows the user's personal best streak record
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Trophy } from 'lucide-react-native';

interface BestStreakBadgeProps {
  bestStreak: number;
  isNewRecord: boolean;
  currentStreak: number;
}

export function BestStreakBadge({
  bestStreak,
  isNewRecord,
  currentStreak,
}: BestStreakBadgeProps) {
  if (bestStreak <= 0 || isNewRecord || currentStreak <= 0) {
    return null;
  }

  return (
    <View className='flex-row items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 py-2.5'>
      <Trophy className='text-amber-500' size={16} />
      <Text className='text-sm text-stone-600'>
        Best: <Text className='font-bold text-amber-700'>{bestStreak}</Text>
      </Text>
    </View>
  );
}
