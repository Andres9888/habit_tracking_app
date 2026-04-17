/** DetailHero - Horizontal: emoji left, name + inline stats right. */
import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { useThemeColors } from '../../../theme';
import { typography, fontFamilies, fontWeights } from '../../../theme/typography';
import type { Habit } from '../HabitDetailScreen.types';
import { DetailHeroStat } from './DetailHeroStat';
import { iconShadow } from './DetailHeader.constants';
import { formatSchedule } from './DetailHero.utils';

interface DetailHeroProps {
  habit: Habit;
  isCompletedToday?: boolean;
  totalCompletions: number;
}

const ENTERING = FadeInDown.duration(280).delay(100).springify().damping(18);

export function DetailHero({ habit, isCompletedToday, totalCompletions }: DetailHeroProps) {
  const { colors, isDark } = useThemeColors();
  const habitName = habit.icon
    ? (habit.name ?? '').replace(/^(?![0-9#*])\p{Emoji}\s*/u, '')
    : (habit.name ?? 'Habit');
  const defaultIconBg = isDark ? colors.primary[100] : colors.status.warningLight;
  const defaultIconShadow = isDark ? colors.primary[500] : colors.status.warning;
  const schedule = formatSchedule(habit);
  const dotStyle = { backgroundColor: colors.gray[300], borderRadius: 999, height: 3, width: 3 };
  const statProps = { labelColor: colors.text.secondary, valueColor: colors.text.primary };

  return (
    <Animated.View className='flex-row items-center px-5 py-2' entering={ENTERING} style={{ gap: 12 }}>
      {habit.icon ? (
        <View
          accessibilityLabel={`Habit icon: ${habit.icon}${isCompletedToday ? ', completed today' : ''}`}
          className='items-center justify-center rounded-2xl'
          style={{
            ...iconShadow,
            backgroundColor: (habit.color ?? habit.iconColor) || defaultIconBg,
            height: 46,
            shadowColor: (habit.color ?? habit.iconColor) || defaultIconShadow,
            width: 46,
          }}
        >
          <Text style={{ color: colors.text.primary, fontSize: 24 }}>{habit.icon}</Text>
          {isCompletedToday ? (
            <View
              className='absolute -bottom-1 -right-1 items-center justify-center rounded-full'
              style={{
                backgroundColor: colors.status.success,
                borderColor: colors.background,
                borderWidth: 2,
                height: 18,
                width: 18,
              }}
            >
              <Check color={colors.text.inverse} size={10} strokeWidth={3} />
            </View>
          ) : null}
        </View>
      ) : null}

      <View className='flex-1'>
        <Text
          accessibilityLabel={`Habit: ${habitName}`}
          accessibilityRole='header'
          numberOfLines={1}
          style={{ color: colors.text.primary, fontFamily: fontFamilies.primary.display, fontSize: 20, fontWeight: fontWeights.bold, lineHeight: 24 }}
        >
          {habitName}
        </Text>

        <View className='mt-1 flex-row items-center' style={{ gap: 10 }}>
          <DetailHeroStat emoji='🔥' label='streak' value={habit.currentStreak ?? 0} {...statProps} />
          <View style={dotStyle} />
          <DetailHeroStat emoji='⭐' label='best' value={habit.bestStreak ?? 0} {...statProps} />
          <View style={dotStyle} />
          <DetailHeroStat emoji='✓' label='total' value={totalCompletions} {...statProps} />
        </View>

        {schedule ? (
          <Text
            accessibilityLabel={`Schedule: ${schedule}`}
            style={{ ...typography.caption, color: colors.text.tertiary, marginTop: 2 }}
          >
            {schedule}
          </Text>
        ) : null}
      </View>
    </Animated.View>
  );
}
