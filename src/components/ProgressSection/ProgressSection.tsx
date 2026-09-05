/**
 * ProgressSection Component
 *
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Use `ProgressSectionConsolidated` from `../ProgressSectionConsolidated` instead.
 *
 * @see ../ProgressSectionConsolidated for the recommended replacement
 */

import React from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { durations, enterEasing } from '../../theme/animations';
import { YourProgressCard } from './YourProgressCard';
import { PersonalBestsCard } from './PersonalBestsCard';
import { ThisMonthCard } from './ThisMonthCard';
import type { ProgressSectionProps } from './types';
import { useProgressSectionData } from './useProgressSectionData';

export function ProgressSection({
  tracking,
  habitCreatedAt,
  strength,
  weeklyChange = 0,
  onInfoPress,
  onWorstDayPress,
  onSeeAllPress,
}: ProgressSectionProps) {
  const {
    actionableTip,
    bestDay,
    currentStreak,
    dayStats,
    hasEnoughData,
    streakRecords,
    thisMonthStats,
    trend,
    worstDay,
  } = useProgressSectionData({ habitCreatedAt, tracking });

  return (
    <Animated.View
      className='gap-4'
      entering={FadeInDown.delay(durations.instant)
        .duration(durations.enter)
        .easing(enterEasing)}
    >
      <YourProgressCard
        actionableTip={actionableTip}
        strength={strength}
        weeklyChange={weeklyChange}
        onInfoPress={onInfoPress}
      />

      {hasEnoughData ? (
        <PersonalBestsCard
          bestDay={bestDay}
          currentStreak={currentStreak}
          streakRecords={streakRecords}
          worstDay={worstDay}
          onWorstDayPress={onWorstDayPress}
        />
      ) : null}

      {hasEnoughData ? (
        <ThisMonthCard
          completedDays={thisMonthStats.completedDays}
          dayStats={dayStats}
          lastMonthRate={trend.lastMonth}
          thisMonthRate={trend.thisMonth}
          totalDays={thisMonthStats.totalDays}
          onSeeAllPress={onSeeAllPress}
        />
      ) : null}
    </Animated.View>
  );
}

export default ProgressSection;
