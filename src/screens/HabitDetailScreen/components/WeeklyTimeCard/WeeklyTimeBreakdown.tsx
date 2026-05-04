import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../../theme/typography';
import { formatDurationCompact } from './formatDuration';
import type { WeekDay } from './WeeklyTimeCard.types';

interface WeeklyTimeBreakdownProps {
  days: WeekDay[];
  habitColor?: string;
  dailyGoalMinutes?: number;
  onDayPress: (date: string) => void;
}

export function WeeklyTimeBreakdown({
  days,
  habitColor,
  dailyGoalMinutes,
  onDayPress,
}: WeeklyTimeBreakdownProps) {
  const { colors } = useThemeColors();
  const accent = habitColor ?? colors.primary[600];
  const hasDailyGoal = !!dailyGoalMinutes && dailyGoalMinutes > 0;

  return (
    <View className='flex-row justify-between' style={{ gap: 4 }}>
      {days.map((day, idx) => {
        const hasMinutes = day.minutes > 0;
        const hitGoal =
          hasDailyGoal && hasMinutes && day.minutes >= (dailyGoalMinutes ?? 0);
        const pct = hasDailyGoal
          ? Math.min(100, Math.round((day.minutes / (dailyGoalMinutes ?? 1)) * 100))
          : 0;
        return (
          <Pressable
            key={`${day.date}-${idx}`}
            accessibilityRole='button'
            accessibilityLabel={`${day.label} — ${day.minutes ? `${day.minutes} minutes` : 'no time logged'}`}
            className='flex-1 items-center rounded-lg py-2'
            style={{
              backgroundColor: hasMinutes ? `${accent}${hitGoal ? '24' : '14'}` : 'transparent',
              borderColor: day.isToday ? accent : hasMinutes ? `${accent}33` : 'rgba(45,42,38,0.16)',
              borderStyle: hasMinutes || day.isToday ? 'solid' : 'dashed',
              borderWidth: 1,
            }}
            onPress={() => onDayPress(day.date)}
          >
            <Text
              style={{
                ...typography.caption,
                color: colors.text.tertiary,
                fontWeight: fontWeights.medium,
              }}
            >
              {day.label}
            </Text>
            <Text
              style={{
                ...typography.caption,
                color: hasMinutes ? colors.text.primary : colors.text.tertiary,
                fontWeight: fontWeights.semibold,
                marginTop: 2,
              }}
            >
              {hasMinutes ? formatDurationCompact(day.minutes) : '＋'}
            </Text>
            {hasDailyGoal && hasMinutes ? (
              <View
                className='mt-1.5 h-0.5 w-3/4 overflow-hidden rounded-full'
                style={{ backgroundColor: 'rgba(45,42,38,0.08)' }}
              >
                <View
                  className='h-full rounded-full'
                  style={{ backgroundColor: accent, width: `${pct}%` }}
                />
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
