/** DetailHero - Habit icon and name display */
import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';
import type { Habit } from '../HabitDetailScreen.types';
import { iconShadow } from './DetailHeader.constants';

interface DetailHeroProps {
  habit: Habit;
}

const ENTERING = FadeInDown.duration(280).delay(100).springify().damping(18);

export function DetailHero({ habit }: DetailHeroProps) {
  const { colors } = useThemeColors();
  const textPrimary = colors.text.primary;
  const habitName = habit.icon
    ? (habit.name ?? '').replace(/^\p{Emoji}\s*/u, '')
    : (habit.name ?? 'Habit');

  return (
    <Animated.View className='items-center px-4 pb-6' entering={ENTERING}>
      {habit.icon ? (
        <View
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
            style={{ fontSize: 40, color: textPrimary }}
          >
            {habit.icon}
          </Text>
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
    </Animated.View>
  );
}
