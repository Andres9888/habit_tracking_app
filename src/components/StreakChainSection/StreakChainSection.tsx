/**
 * StreakChainSection Component
 * Clean, focused streak visualization with animated chain
 */

import React, { useMemo } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import type { StreakChainSectionProps } from './types';
import { getTierInfo } from './constants';
import { ContextualMessage } from './ContextualMessage';
import { StreakHeader } from './StreakHeader';
import { StreakNumber } from './StreakNumber';
import { ProgressBar } from './ProgressBar';
import { ChainRow } from './ChainRow';
import { BestStreakBadge } from './BestStreakBadge';
import { useStreakAnimation } from './useStreakAnimation';
import { buildChainData, getDayLabels } from './chainUtils';

export function StreakChainSection({
  bestStreak,
  currentStreak,
  lastSevenDays,
  todayCompleted,
}: StreakChainSectionProps) {
  const { current, next, daysToNext, progress } = getTierInfo(currentStreak);
  const isNewRecord = currentStreak > 0 && currentStreak >= bestStreak;

  const { numberAnimatedStyle, barAnimatedStyle } = useStreakAnimation({
    currentStreak,
    progress,
  });

  const chainData = buildChainData(lastSevenDays, todayCompleted);
  const dayLabels = useMemo(getDayLabels, []);

  return (
    <View className='overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50'>
      <LinearGradient
        colors={['rgba(255, 247, 237, 0.3)', '#ffffff', 'rgba(255, 251, 235, 0.3)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className='absolute inset-0'
      />
      <View className='p-5'>
        <StreakHeader currentIcon={current.icon} />
        <StreakNumber
          animatedStyle={numberAnimatedStyle}
          currentStreak={currentStreak}
          textColor={current.textColor}
        />
        {next && (
          <ProgressBar
            barAnimatedStyle={barAnimatedStyle}
            daysToNext={daysToNext}
            next={next}
          />
        )}
        <ChainRow
          chainData={chainData}
          dayLabels={dayLabels}
          todayCompleted={todayCompleted}
        />
        <ContextualMessage
          bestStreak={bestStreak}
          currentStreak={currentStreak}
          todayCompleted={todayCompleted}
        />
        <BestStreakBadge
          bestStreak={bestStreak}
          currentStreak={currentStreak}
          isNewRecord={isNewRecord}
        />
      </View>
    </View>
  );
}

export default StreakChainSection;
