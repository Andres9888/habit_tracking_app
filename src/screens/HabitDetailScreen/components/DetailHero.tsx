/** DetailHero - Minimal centered: large icon, name, journey line, stat row. */
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';
import { spacing } from '../../../theme/spacing';
import {
  fontFamilies,
  fontWeights,
  typography,
} from '../../../theme/typography';
import type { Habit } from '../HabitDetailScreen.types';
import { getHabitDisplayName } from './DetailHero.utils';
import { DetailHeroIcon } from './DetailHeroIcon';
import { DetailHeroStat } from './DetailHeroStat';

interface DetailHeroProps {
  daysTracking?: number;
  habit: Habit;
  isCompletedToday?: boolean;
  totalCompletions: number;
}

const ENTERING = FadeInDown.duration(280)
  .delay(100)
  .easing(Easing.out(Easing.cubic));

const DIVIDER_HEIGHT = 28;

export function DetailHero({
  daysTracking = 0,
  habit,
  isCompletedToday,
  totalCompletions,
}: DetailHeroProps) {
  const { colors } = useThemeColors();
  const habitName = getHabitDisplayName(habit);
  const statProps = {
    labelColor: colors.text.secondary,
    valueColor: colors.text.primary,
  };
  const divider = {
    backgroundColor: colors.border,
    height: DIVIDER_HEIGHT,
    width: StyleSheet.hairlineWidth,
  };

  return (
    <Animated.View className='items-center px-5 pb-1 pt-2' entering={ENTERING}>
      {habit.icon ? (
        <DetailHeroIcon
          color={habit.color ?? habit.iconColor}
          icon={habit.icon}
          isCompletedToday={isCompletedToday}
        />
      ) : null}

      <Text
        accessibilityLabel={`Habit: ${habitName}`}
        accessibilityRole='header'
        numberOfLines={1}
        style={{
          color: colors.text.primary,
          fontFamily: fontFamilies.primary.display,
          fontSize: typography.heading3.fontSize,
          fontWeight: fontWeights.bold,
          marginTop: spacing.md,
        }}
      >
        {habitName}
      </Text>

      <Text
        style={{
          ...typography.caption,
          color: colors.text.tertiary,
          marginTop: spacing.xs,
        }}
      >
        Day {daysTracking + 1} of your journey
      </Text>

      <View
        className='w-full flex-row items-center'
        style={{ marginTop: spacing.base }}
      >
        <DetailHeroStat
          label='streak'
          value={habit.currentStreak ?? 0}
          {...statProps}
        />
        <View style={divider} />
        <DetailHeroStat
          label='best'
          value={habit.bestStreak ?? 0}
          {...statProps}
        />
        <View style={divider} />
        <DetailHeroStat label='total' value={totalCompletions} {...statProps} />
      </View>
    </Animated.View>
  );
}
