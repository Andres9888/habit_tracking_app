/**
 * StatsGrid Component
 *
 * Compact 2x2 layout displaying key habit statistics with a strength ring.
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

import React from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useReduceMotion } from '../../hooks/useReduceMotion';

import { CompactStrengthRing } from './CompactStrengthRing';
import { StatsRow } from './StatsRow';
import { useStatCards } from './useStatCards';
import { useStatsGridAnimations } from './useStatsGridAnimations';
import type { StatsGridProps } from './StatsGridTypes';

/**
 * StatsGrid - Compact 2x2 statistics grid with strength ring
 */
export const StatsGrid = React.memo(function StatsGrid({
  strength,
  currentStreak,
  monthlyCompleted,
  monthlyTotal,
  bestDay,
  focusDay,
  weeklyChange = 0,
  monthlyChange,
  progressEmojis,
  onFocusDayPress,
}: StatsGridProps) {
  const reduceMotion = useReduceMotion();
  const { triggerSelection } = useHapticFeedback();
  const { containerStyle } = useStatsGridAnimations({ reduceMotion });
  const { topRowCards, bottomRowCards } = useStatCards({
    bestDay,
    currentStreak,
    focusDay,
    monthlyChange,
    monthlyCompleted,
    monthlyTotal,
  });

  const accessibilityLabel = `Statistics overview: ${currentStreak} day streak, ${monthlyCompleted} of ${monthlyTotal} days this month${
    bestDay ? `, best day is ${bestDay.name}` : ''
  }${focusDay ? `, focus day is ${focusDay.name}` : ''}`;

  return (
    <Animated.View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='summary'
      className='mb-4'
      style={containerStyle}
    >
      <View className='flex-row'>
        <View className='mr-3 items-center justify-center'>
          <CompactStrengthRing
            progressEmojis={progressEmojis}
            strength={strength}
            weeklyChange={weeklyChange}
          />
        </View>

        <View className='flex-1'>
          <View className='mb-2'>
            <StatsRow
              cards={topRowCards}
              indexOffset={0}
              reduceMotion={reduceMotion}
              onHapticFeedback={triggerSelection}
            />
          </View>
          <StatsRow
            cards={bottomRowCards}
            indexOffset={2}
            reduceMotion={reduceMotion}
            onFocusDayPress={onFocusDayPress}
            onHapticFeedback={triggerSelection}
          />
        </View>
      </View>
    </Animated.View>
  );
});

export default StatsGrid;
