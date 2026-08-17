/**
 * ThisWeekCard — "This week" strip from the full-flow mock: range, count,
 * and seven day pips. Streak stats live on History / Analytics, not here.
 */
import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useReduceMotion } from '../../../../hooks/useReduceMotion';
import { durations, enterEasing } from '../../../../theme/animations';
import { borderRadius, shadows } from '../../../../theme/spacing';
import { fontWeights } from '../../../../theme/typography';
import { useInsightPalette } from '../../insightPalette';
import { useThisWeek } from './useThisWeek';
import { WeekDayDot } from './WeekDayDot';

interface ThisWeekCardProps {
  completedDates: Set<string>;
  daysOfWeek?: number[];
  onDayPress: (date: string, isCompleted: boolean) => void;
}

export function ThisWeekCard({
  completedDates,
  daysOfWeek,
  onDayPress,
}: ThisWeekCardProps) {
  const palette = useInsightPalette();
  const reduceMotion = useReduceMotion();
  const { days, doneCount, rangeLabel, scheduledCount } = useThisWeek({
    completedDates,
    daysOfWeek,
  });

  return (
    <Animated.View
      entering={
        reduceMotion
          ? undefined
          : FadeIn.duration(durations.standard).easing(enterEasing)
      }
      style={{
        backgroundColor: palette.card,
        borderColor: palette.cardBorder,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 13,
        ...shadows.subtle,
      }}
    >
      <View
        style={{
          alignItems: 'flex-start',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 12,
          paddingHorizontal: 2,
        }}
      >
        <View>
          <Text
            style={{
              color: palette.textPrimary,
              fontSize: 14,
              fontWeight: fontWeights.semibold,
              lineHeight: 17,
            }}
          >
            This week
          </Text>
          <Text
            style={{
              color: palette.textTertiary,
              fontSize: 11,
              marginTop: 2,
            }}
          >
            {rangeLabel}
          </Text>
        </View>
        <Text
          style={{ color: palette.textTertiary, fontSize: 12, paddingTop: 1 }}
        >
          {doneCount} of {scheduledCount}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {days.map((day) => (
          <WeekDayDot
            key={day.date}
            day={day}
            palette={palette}
            onPress={onDayPress}
          />
        ))}
      </View>
    </Animated.View>
  );
}
