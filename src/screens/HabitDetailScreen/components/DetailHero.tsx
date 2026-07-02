/** DetailHero - Premium hero card: haloed icon, name, notable badge, journey line, stat band. */
import { Text } from 'react-native';
import Animated, { Easing, FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';
import { colors as palette } from '../../../theme/colors';
import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights } from '../../../theme/typography';
import type { Habit } from '../HabitDetailScreen.types';
import { getHabitDisplayName } from './DetailHero.utils';
import { DetailHeroContext } from './DetailHeroContext';
import { DetailHeroIcon } from './DetailHeroIcon';
import { DetailHeroStats } from './DetailHeroStats';

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
  const { colors, isDark } = useThemeColors();
  const habitName = getHabitDisplayName(habit);

  return (
    <Animated.View
      className='items-center'
      entering={ENTERING}
      style={{
        backgroundColor: isDark ? colors.card : palette.light.surfaceMuted,
        borderColor: colors.border,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        marginHorizontal: spacing.base + spacing.xs,
        marginTop: spacing.sm,
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.lg,
        ...shadows.card,
      }}
    >
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
          fontSize: 24,
          fontWeight: fontWeights.bold,
          letterSpacing: -0.3,
          marginTop: spacing.base,
        }}
      >
        {habitName}
      </Text>

      <DetailHeroContext
        bestStreak={habit.bestStreak ?? 0}
        currentStreak={habit.currentStreak ?? 0}
        goalDuration={habit.goalDuration ?? 0}
      />

      <DetailHeroStats
        bestStreak={habit.bestStreak ?? 0}
        currentStreak={habit.currentStreak ?? 0}
        totalCompletions={totalCompletions}
      />
    </Animated.View>
  );
}
