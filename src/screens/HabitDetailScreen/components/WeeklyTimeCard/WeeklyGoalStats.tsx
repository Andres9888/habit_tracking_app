import { Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../../theme/typography';
import { formatDuration } from './formatDuration';

interface WeeklyGoalStatsProps {
  avgMinutesPerDay: number;
  remainingToWeekly: number;
  habitColor?: string;
}

export function WeeklyGoalStats({
  avgMinutesPerDay,
  remainingToWeekly,
  habitColor,
}: WeeklyGoalStatsProps) {
  const { colors } = useThemeColors();
  const accent = habitColor ?? colors.primary[600];
  const isHit = remainingToWeekly === 0;

  return (
    <View
      className='mb-3 flex-row items-center justify-between rounded-lg px-3 py-2'
      style={{ backgroundColor: `${accent}10` }}
    >
      <Text style={{ ...typography.caption, color: colors.text.secondary }}>
        <Text style={{ color: colors.text.primary, fontWeight: fontWeights.semibold }}>
          {formatDuration(Math.round(avgMinutesPerDay))}
        </Text>{' '}
        avg/day
      </Text>
      {isHit ? (
        <Text
          style={{
            ...typography.caption,
            color: accent,
            fontWeight: fontWeights.semibold,
          }}
        >
          ★ goal hit
        </Text>
      ) : (
        <Text style={{ ...typography.caption, color: colors.text.secondary }}>
          <Text style={{ color: colors.text.primary, fontWeight: fontWeights.semibold }}>
            {formatDuration(remainingToWeekly)}
          </Text>{' '}
          to go
        </Text>
      )}
    </View>
  );
}
