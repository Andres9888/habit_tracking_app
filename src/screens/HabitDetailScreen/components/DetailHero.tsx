/** DetailHero - Habit icon, name, and streak badge display */
import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';
import type { Habit } from '../HabitDetailScreen.types';
import { iconShadow, streakShadow } from './DetailHeader.constants';

interface DetailHeroProps {
  habit: Habit;
}

const ENTERING = FadeInDown.duration(280).delay(100).springify().damping(18);
const STREAK_ENTERING = FadeInDown.duration(240)
  .delay(200)
  .springify()
  .damping(18);

export function DetailHero({ habit }: DetailHeroProps) {
  const { colors } = useThemeColors();
  const textPrimary = colors.text.primary;
  const habitName = habit.icon
    ? (habit.name ?? '').replace(/^\p{Emoji}\s*/u, '')
    : (habit.name ?? 'Habit');

  return (
    <Animated.View className='items-center px-4 pb-6' entering={ENTERING}>
      {habit.icon ? <View
          accessibilityLabel={`Habit icon: ${habit.icon}`}
          className='mb-4 h-20 w-20 items-center justify-center rounded-2xl'
          style={{
            ...iconShadow,
            backgroundColor: (habit.color ?? habit.iconColor) || '#fef3c7',
            shadowColor: (habit.color ?? habit.iconColor) || '#f59e0b',
          }}
        >
          <Text
            accessibilityLabel={`${habit.icon} emoji`}
            style={{ fontSize: 34, color: textPrimary }}
          >
            {habit.icon}
          </Text>
        </View> : null}
      <Text
        accessibilityLabel={`Habit: ${habitName}`}
        accessibilityRole='header'
        className='text-center font-bold'
        style={{
          fontSize: 34,
          letterSpacing: -0.5,
          lineHeight: 41,
          color: textPrimary,
        }}
      >
        {habitName}
      </Text>
      {(habit.currentStreak ?? 0) > 0 ? <Animated.View
          accessibilityLabel={`Current streak: ${habit.currentStreak} days`}
          accessibilityLiveRegion='polite'
          className='mt-3 flex-row items-center gap-1.5 rounded-full px-4 py-2'
          entering={STREAK_ENTERING}
          style={[
            streakShadow,
            {
              backgroundColor: colors.primary[100],
              shadowColor: colors.primary[500],
            },
          ]}
        >
          <Text accessibilityLabel='Fire emoji' style={{ fontSize: 17 }}>
            🔥
          </Text>
          <Text
            accessibilityLabel={`${habit.currentStreak} day${habit.currentStreak === 1 ? '' : 's'} streak`}
            className='text-[17px] font-semibold'
            style={{ color: colors.primary[700] }}
          >
            {habit.currentStreak} day streak
          </Text>
        </Animated.View> : null}
    </Animated.View>
  );
}
