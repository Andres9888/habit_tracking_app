/** DetailHero - Horizontal: emoji left, name + inline stats right. */
import React from 'react';
import { View, Text } from 'react-native';
import Animated, { Easing, FadeInDown } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { useThemeColors } from '../../../theme';
import { spacing } from '../../../theme/spacing';
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

const ENTERING = FadeInDown.duration(280).delay(100).easing(Easing.out(Easing.cubic));

/** Hero-only dimensions with no shared token equivalent. */
const ICON_TILE = 46;
const ICON_EMOJI = 24;
const CHECK_BADGE = 18;

export function DetailHero({ habit, isCompletedToday, totalCompletions }: DetailHeroProps) {
  const { colors } = useThemeColors();
  const habitName = habit.icon
    ? (habit.name ?? '').replace(/^(?![0-9#*])\p{Emoji}\s*/u, '')
    : (habit.name ?? 'Habit');
  const defaultIconBg = colors.primary[100];
  const defaultIconShadow = colors.primary[500];
  const schedule = formatSchedule(habit);
  const statProps = { labelColor: colors.text.secondary, valueColor: colors.text.primary };

  return (
    <Animated.View className='flex-row items-center px-5 py-2' entering={ENTERING} style={{ gap: spacing.md }}>
      {habit.icon ? (
        <View
          accessibilityLabel={`Habit icon: ${habit.icon}${isCompletedToday ? ', completed today' : ''}`}
          className='items-center justify-center rounded-2xl'
          style={{
            ...iconShadow,
            backgroundColor: (habit.color ?? habit.iconColor) || defaultIconBg,
            height: ICON_TILE,
            shadowColor: (habit.color ?? habit.iconColor) || defaultIconShadow,
            width: ICON_TILE,
          }}
        >
          <Text style={{ color: colors.text.primary, fontSize: ICON_EMOJI }}>{habit.icon}</Text>
          {isCompletedToday ? (
            <View
              className='absolute -bottom-1 -right-1 items-center justify-center rounded-full'
              style={{
                backgroundColor: colors.status.success,
                borderColor: colors.background,
                borderWidth: 2,
                height: CHECK_BADGE,
                width: CHECK_BADGE,
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
          style={{ color: colors.text.primary, fontFamily: fontFamilies.primary.display, fontSize: typography.heading3.fontSize, fontWeight: fontWeights.bold, lineHeight: typography.body.lineHeight }}
        >
          {habitName}
        </Text>

        <View className='mt-1 flex-row items-center' style={{ gap: spacing.md }}>
          <DetailHeroStat emoji='🔥' label='streak' value={habit.currentStreak ?? 0} {...statProps} />
          <DetailHeroStat emoji='⭐' label='best' value={habit.bestStreak ?? 0} {...statProps} />
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
