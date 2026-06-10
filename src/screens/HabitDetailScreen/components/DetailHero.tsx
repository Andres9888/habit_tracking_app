/** DetailHero - Horizontal: emoji left, name + inline stats right. */
import { Text, View } from 'react-native';
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
import { DetailHeroSchedule } from './DetailHeroSchedule';
import { DetailHeroStat } from './DetailHeroStat';

interface DetailHeroProps {
  habit: Habit;
  isCompletedToday?: boolean;
  totalCompletions: number;
}

const ENTERING = FadeInDown.duration(280)
  .delay(100)
  .easing(Easing.out(Easing.cubic));

export function DetailHero({
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

  return (
    <Animated.View
      className='flex-row items-center px-5 py-1'
      entering={ENTERING}
      style={{ gap: spacing.md }}
    >
      {habit.icon ? (
        <DetailHeroIcon
          color={habit.color ?? habit.iconColor}
          icon={habit.icon}
          isCompletedToday={isCompletedToday}
        />
      ) : null}

      <View className='flex-1'>
        <Text
          accessibilityLabel={`Habit: ${habitName}`}
          accessibilityRole='header'
          numberOfLines={1}
          style={{
            color: colors.text.primary,
            fontFamily: fontFamilies.primary.display,
            fontSize: typography.heading3.fontSize,
            fontWeight: fontWeights.bold,
            lineHeight: typography.body.lineHeight,
          }}
        >
          {habitName}
        </Text>

        <View
          className='mt-1 flex-row items-center'
          style={{ gap: spacing.md }}
        >
          <DetailHeroStat
            emoji='🔥'
            label='streak'
            value={habit.currentStreak ?? 0}
            {...statProps}
          />
          <DetailHeroStat
            emoji='⭐'
            label='best'
            value={habit.bestStreak ?? 0}
            {...statProps}
          />
          <DetailHeroStat
            emoji='✓'
            label='total'
            value={totalCompletions}
            {...statProps}
          />
        </View>

        <DetailHeroSchedule habit={habit} />
      </View>
    </Animated.View>
  );
}
