import { Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../../theme/typography';
import { formatDuration } from './formatDuration';

interface DailyGoalCaptionProps {
  dailyGoal: number;
  daysHit: number;
  totalDays: number;
  streak: number;
  habitColor?: string;
}

export function DailyGoalCaption({
  dailyGoal,
  daysHit,
  totalDays,
  streak,
  habitColor,
}: DailyGoalCaptionProps) {
  const { colors } = useThemeColors();
  const accent = habitColor ?? colors.primary[600];

  return (
    <View className='mb-3 flex-row items-center'>
      <Text style={{ ...typography.caption, color: colors.text.tertiary }}>
        Daily target{' '}
        <Text style={{ color: colors.text.primary, fontWeight: fontWeights.semibold }}>
          {formatDuration(dailyGoal)}
        </Text>{' '}
        ·{' '}
        <Text style={{ color: colors.text.primary, fontWeight: fontWeights.semibold }}>
          {daysHit} of {totalDays}
        </Text>{' '}
        hit
      </Text>
      {streak >= 2 ? (
        <View
          className='ml-auto flex-row items-center rounded-full px-2 py-0.5'
          style={{ backgroundColor: `${accent}20`, gap: 3 }}
        >
          <Text style={{ fontSize: 11 }}>🔥</Text>
          <Text
            style={{
              color: accent,
              fontSize: 11,
              fontWeight: fontWeights.semibold,
            }}
          >
            {streak} in a row
          </Text>
        </View>
      ) : null}
    </View>
  );
}
