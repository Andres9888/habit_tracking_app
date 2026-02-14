/**
 * StreakMilestonesTimeline - Visual timeline showing when user hit streak milestones
 * Displays 7, 14, 30, 60, 100 day milestones with dates and celebratory icons
 */

import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { calculateStreakMilestones, getMilestoneEmoji, getMilestoneLabel } from './utils';
import type { Habit } from '../../features/habits/types';

interface StreakMilestonesTimelineProps {
  habit: Habit;
  completedDates: Set<string>;
}

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

interface MilestoneItemProps {
  days: number;
  date: string | null;
  formattedDate: string | null;
  achieved: boolean;
  index: number;
}

function MilestoneItem({ days, date, formattedDate, achieved, index }: MilestoneItemProps) {
  const emoji = getMilestoneEmoji(days);
  const label = getMilestoneLabel(days);

  return (
    <Animated.View
      entering={anim(480 + index * 60)}
      className={`flex-row items-center gap-3 py-2 ${achieved ? 'opacity-100' : 'opacity-40'}`}
    >
      {/* Timeline dot and line */}
      <View className='flex flex-col items-center'>
        <View
          className={`h-10 w-10 items-center justify-center rounded-full ${
            achieved ? 'bg-emerald-100' : 'bg-stone-100'
          }`}
        >
          <Text className='text-xl'>{emoji}</Text>
        </View>
      </View>

      {/* Content */}
      <View className='flex-1'>
        <Text className={`text-base font-semibold ${achieved ? 'text-stone-800' : 'text-stone-400'}`}>
          {label}
        </Text>
        {achieved && formattedDate ? (
          <Text className='text-sm text-stone-500'>{formattedDate}</Text>
        ) : (
          <Text className='text-sm text-stone-400'>
            {date ? 'Streak broken' : 'Not yet achieved'}
          </Text>
        )}
      </View>

      {/* Achieved checkmark */}
      {achieved && (
        <View className='h-6 w-6 items-center justify-center rounded-full bg-emerald-500'>
          <Text className='text-white text-xs'>✓</Text>
        </View>
      )}
    </Animated.Item>
  );
}

export function StreakMilestonesTimeline({ habit, completedDates }: StreakMilestonesTimelineProps) {
  const milestones = useMemo(
    () => calculateStreakMilestones(completedDates, habit.createdAt),
    [completedDates, habit.createdAt]
  );

  // Only show if at least one milestone has been achieved
  const hasMilestones = milestones.some((m) => m.achieved);

  if (!hasMilestones) {
    return null;
  }

  return (
    <Animated.View
      className='rounded-2xl bg-white px-4 py-3'
      entering={anim(450)}
      style={{
        elevation: 4,
        shadowColor: '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      }}
    >
      {/* Timeline items with connector line */}
      <View className='relative'>
        {milestones.map((milestone, index) => (
          <React.Fragment key={milestone.days}>
            <MilestoneItem {...milestone} index={index} />
            {/* Connector line between items */}
            {index < milestones.length - 1 && (
              <View
                className={`absolute left-5 top-10 -ml-px h-6 w-0.5 ${
                  milestone.achieved ? 'bg-emerald-200' : 'bg-stone-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    </Animated.View>
  );
}
