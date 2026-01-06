/**
 * StatsGrid Component
 *
 * Compact 2x2 layout displaying key habit statistics with a strength ring.
 * Replaces the horizontal scroll InsightChips with a more scannable grid.
 *
 * Layout:
 * ┌─────────────┬─────────────────────────────┐
 * │             │  🔥 14      │  📅 18/21    │
 * │  Strength   │  Day Streak │  This Month  │
 * │    Ring     ├─────────────┼──────────────┤
 * │   (56px)    │  🏆 Tue     │  ⚡ Sat      │
 * │             │  Best Day   │  Focus Day   │
 * └─────────────┴─────────────────────────────┘
 *
 * Features:
 * - Compact 56px strength ring
 * - 4 color-coded stat cards in 2x2 grid
 * - Trend indicators on monthly and strength
 * - Staggered entrance animations
 * - Focus day is interactive
 * - Full accessibility support
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

import React, { useMemo, useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { Springs } from '../../constants/motion';

import { CompactStrengthRing } from './CompactStrengthRing';
import { StatCard } from './StatCard';
import type { StatsGridProps, StatItemConfig } from './StatsGridTypes';
import { STAT_CARD_COLORS } from './StatsGridTypes';

/**
 * StatsGrid - Compact 2x2 statistics grid with strength ring
 * Memoized to prevent unnecessary re-renders
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
  onFocusDayPress,
}: StatsGridProps) {
  const reduceMotion = useReduceMotion();
  const { triggerSelection } = useHapticFeedback();

  // Entrance animation for container
  const containerScale = useSharedValue(reduceMotion ? 1 : 0.95);

  useEffect(() => {
    if (reduceMotion) {
      containerScale.value = 1;
      return;
    }

    containerScale.value = withSpring(1, Springs.gentle);
  }, [reduceMotion, containerScale]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
  }));

  // Build stat cards configuration
  const statCards = useMemo<StatItemConfig[]>(() => {
    const cards: StatItemConfig[] = [];

    // Streak card (top-left of grid)
    cards.push(
      {
        backgroundColor: STAT_CARD_COLORS.streak.bgHex,
        icon: '🔥',
        id: 'streak',
        label: currentStreak === 1 ? 'Day Streak' : 'Day Streak',
        value: currentStreak === 1 ? '1' : `${currentStreak}`,
      },
      {
        backgroundColor: STAT_CARD_COLORS.monthly.bgHex,
        icon: '📅',
        id: 'monthly',
        label: 'This Month',
        showTrend: monthlyChange !== undefined && monthlyChange !== 0,
        trend: monthlyChange,
        value: `${monthlyCompleted}/${monthlyTotal}`,
      }
    );

    // Best Day card (bottom-left of grid)
    if (bestDay) {
      cards.push({
        backgroundColor: STAT_CARD_COLORS.bestDay.bgHex,
        icon: '🏆',

        id: 'bestDay',
        // Abbreviate to first 3 chars
        label: `Best Day (${Math.round(bestDay.rate)}%)`,
        value: bestDay.name.slice(0, 3),
      });
    }

    // Focus Day card (bottom-right of grid)
    if (focusDay) {
      cards.push({
        backgroundColor: STAT_CARD_COLORS.focusDay.bgHex,
        icon: '⚡',

        id: 'focusDay',
        // Abbreviate to first 3 chars
        label: `Focus Day (${Math.round(focusDay.rate)}%)`,
        value: focusDay.name.slice(0, 3),
      });
    }

    return cards;
  }, [
    currentStreak,
    monthlyCompleted,
    monthlyTotal,
    bestDay,
    focusDay,
    monthlyChange,
  ]);

  // Separate cards into rows for grid layout
  const topRowCards = statCards.slice(0, 2);
  const bottomRowCards = statCards.slice(2, 4);

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
        {/* Left side: Compact Strength Ring */}
        <View className='mr-3 items-center justify-center'>
          <CompactStrengthRing
            strength={strength}
            weeklyChange={weeklyChange}
          />
        </View>

        {/* Right side: 2x2 Stats Grid */}
        <View className='flex-1'>
          {/* Top row */}
          <View className='mb-2 flex-row gap-2'>
            {topRowCards.map((card, index) => (
              <View key={card.id} className='flex-1'>
                <StatCard
                  config={card}
                  index={index}
                  isInteractive={false}
                  reduceMotion={reduceMotion}
                  onHapticFeedback={triggerSelection}
                />
              </View>
            ))}
          </View>

          {/* Bottom row */}
          <View className='flex-row gap-2'>
            {bottomRowCards.map((card, index) => (
              <View key={card.id} className='flex-1'>
                <StatCard
                  config={card}
                  index={index + 2} // Continue stagger from top row
                  isInteractive={card.id === 'focusDay' && !!onFocusDayPress}
                  reduceMotion={reduceMotion}
                  onHapticFeedback={triggerSelection}
                  onPress={card.id === 'focusDay' ? onFocusDayPress : undefined}
                />
              </View>
            ))}
          </View>
        </View>
      </View>
    </Animated.View>
  );
});

export default StatsGrid;
