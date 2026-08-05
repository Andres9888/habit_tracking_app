/** DetailHero - Fused hero card: icon/name/streak row, total, complete bar. */
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';
import { durations, enterEasing } from '../../../theme/animations';
import { colors as palette } from '../../../theme/colors';
import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights } from '../../../theme/typography';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import type { Habit } from '../HabitDetailScreen.types';
import { DetailCompleteButton } from './DetailCompleteButton';
import { getHabitDisplayName } from './DetailHero.utils';
import { DetailHeroContext } from './DetailHeroContext';
import { DetailHeroIcon } from './DetailHeroIcon';
import { DetailHeroTotal } from './DetailHeroTotal';

interface DetailHeroProps {
  habit: Habit;
  isCompletedToday?: boolean;
  isToggling?: boolean;
  totalCompletions: number;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

export function DetailHero({
  habit,
  isCompletedToday = false,
  isToggling = false,
  totalCompletions,
  onDayPress,
}: DetailHeroProps) {
  const { colors, isDark } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const habitName = getHabitDisplayName(habit);

  return (
    <Animated.View
      entering={
        reduceMotion
          ? undefined
          : FadeInDown.duration(durations.enter).easing(enterEasing)
      }
      className='overflow-hidden'
      style={{
        backgroundColor: isDark ? colors.card : palette.light.cardElevated,
        borderColor: colors.border,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        marginHorizontal: spacing.base + spacing.xs,
        marginTop: spacing.sm,
        ...shadows.subtle,
      }}
    >
      <View
        className='flex-row items-center'
        style={{ gap: spacing.md, padding: spacing.base }}
      >
        {habit.icon ? (
          <DetailHeroIcon
            color={habit.color ?? habit.iconColor}
            icon={habit.icon}
            isCompletedToday={isCompletedToday}
          />
        ) : null}

        <View className='flex-1' style={{ minWidth: 0 }}>
          <Text
            accessibilityLabel={`Habit: ${habitName}`}
            accessibilityRole='header'
            numberOfLines={1}
            style={{
              color: colors.text.primary,
              fontFamily: fontFamilies.primary.display,
              fontSize: 19,
              fontWeight: fontWeights.bold,
              letterSpacing: -0.2,
            }}
          >
            {habitName}
          </Text>
          <DetailHeroContext
            bestStreak={habit.bestStreak ?? 0}
            currentStreak={habit.currentStreak ?? 0}
            goalDuration={habit.goalDuration ?? 0}
          />
        </View>

        <DetailHeroTotal colors={colors} totalCompletions={totalCompletions} />
      </View>

      <View
        style={{ paddingHorizontal: spacing.base, paddingBottom: spacing.base }}
      >
        <DetailCompleteButton
          disabled={isToggling}
          isCompletedToday={isCompletedToday}
          onPress={() => onDayPress(getLocalDateString(), isCompletedToday)}
        />
      </View>
    </Animated.View>
  );
}
