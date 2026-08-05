/** DetailHero - Flat identity, one status, and one primary action. */
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';
import { durations, enterEasing } from '../../../theme/animations';
import { spacing } from '../../../theme/spacing';
import {
  fontFamilies,
  fontWeights,
  typography,
} from '../../../theme/typography';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import { buildScheduleLabel } from '../../../components/HabitCalendarModal/utils';
import type { Habit } from '../HabitDetailScreen.types';
import { DetailCompleteButton } from './DetailCompleteButton';
import { getHabitDisplayName } from './DetailHero.utils';
import { DetailStatusPill } from './DetailStatusPill';

interface DetailHeroProps {
  habit: Habit;
  isCompletedToday?: boolean;
  isToggling?: boolean;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

export function DetailHero({
  habit,
  isCompletedToday = false,
  isToggling = false,
  onDayPress,
}: DetailHeroProps) {
  const { colors } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const habitName = getHabitDisplayName(habit);
  const kicker = buildScheduleLabel(habit) ?? 'Daily';

  return (
    <Animated.View
      entering={
        reduceMotion
          ? undefined
          : FadeInDown.duration(durations.enter).easing(enterEasing)
      }
      style={{ paddingHorizontal: spacing.base, paddingTop: spacing.xs }}
    >
      <View style={{ gap: 6 }}>
        <View>
          <Text
            numberOfLines={1}
            style={{
              ...typography.overline,
              color: colors.text.tertiary,
              fontWeight: fontWeights.bold,
            }}
          >
            {kicker}
          </Text>
          <Text
            accessibilityLabel={`Habit: ${habitName}`}
            accessibilityRole='header'
            numberOfLines={1}
            style={{
              color: colors.text.primary,
              fontFamily: fontFamilies.primary.display,
              fontSize: 24,
              fontWeight: fontWeights.semibold,
              letterSpacing: -0.45,
              lineHeight: 30,
              marginTop: 2,
            }}
          >
            {habitName}
          </Text>
        </View>
        <DetailStatusPill isCompletedToday={isCompletedToday} />
      </View>

      <View style={{ paddingTop: spacing.md }}>
        <DetailCompleteButton
          disabled={isToggling}
          isCompletedToday={isCompletedToday}
          onPress={() => onDayPress(getLocalDateString(), isCompletedToday)}
        />
      </View>
    </Animated.View>
  );
}
