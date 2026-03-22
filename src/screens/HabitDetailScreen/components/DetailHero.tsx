/** DetailHero - Habit icon, name, schedule, and completed-today indicator */
import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { useThemeColors } from '../../../theme';
import type { Habit } from '../HabitDetailScreen.types';
import { iconShadow } from './DetailHeader.constants';
import { formatSchedule } from './DetailHero.utils';

interface DetailHeroProps {
  habit: Habit;
  isCompletedToday?: boolean;
}

const ENTERING = FadeInDown.duration(280).delay(100).springify().damping(18);

export function DetailHero({ habit, isCompletedToday }: DetailHeroProps) {
  const { colors, isDark } = useThemeColors();
  const textPrimary = colors.text.primary;
  const habitName = habit.icon
    ? (habit.name ?? '').replace(/^\p{Emoji}\s*/u, '')
    : (habit.name ?? 'Habit');
  const defaultIconBg = isDark ? colors.primary[100] : colors.status.warningLight;
  const defaultIconShadow = isDark ? colors.primary[500] : colors.status.warning;
  const schedule = formatSchedule(habit);

  return (
    <Animated.View className='items-center px-4 pb-6' entering={ENTERING}>
      {habit.icon ? (
        <View
          accessibilityLabel={`Habit icon: ${habit.icon}${isCompletedToday ? ', completed today' : ''}`}
          className='mb-4 h-20 w-20 items-center justify-center rounded-2xl'
          style={{
            ...iconShadow,
            backgroundColor: (habit.color ?? habit.iconColor) || defaultIconBg,
            shadowColor: (habit.color ?? habit.iconColor) || defaultIconShadow,
          }}
        >
          <Text
            accessibilityLabel={`${habit.icon} emoji`}
            style={{ fontSize: 34, color: textPrimary }}
          >
            {habit.icon}
          </Text>
          {isCompletedToday ? (
            <View
              className='absolute -bottom-1 -right-1 items-center justify-center rounded-full'
              style={{
                backgroundColor: colors.status.success,
                borderColor: colors.background,
                borderWidth: 2,
                height: 24,
                width: 24,
              }}
            >
              <Check color='#FFFFFF' size={12} strokeWidth={3} />
            </View>
          ) : null}
        </View>
      ) : null}
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
      {schedule ? (
        <Text
          accessibilityLabel={`Schedule: ${schedule}`}
          className='mt-1 text-[13px]'
          style={{ color: colors.text.secondary }}
        >
          {schedule}
        </Text>
      ) : null}
    </Animated.View>
  );
}
