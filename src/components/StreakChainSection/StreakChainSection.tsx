/**
 * StreakChainSection Component
 * Clean, focused streak visualization with animated chain
 */

import React, { useMemo } from 'react';
import { View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import type { StreakChainSectionProps } from './types';
import { BestStreakBadge } from './BestStreakBadge';
import { ChainRow } from './ChainRow';
import { ContextualMessage } from './ContextualMessage';
import { ProgressBar } from './ProgressBar';
import { StreakHeader } from './StreakHeader';
import { StreakNumber } from './StreakNumber';
import { buildChainData, getDayLabels } from './chainUtils';
import { getTierInfo } from './constants';
import { useStreakAnimation } from './useStreakAnimation';

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
        className='absolute inset-0'
        colors={['rgba(255, 247, 237, 0.3)', '#ffffff', 'rgba(255, 251, 235, 0.3)']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
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
