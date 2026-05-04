import { Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../../theme/typography';
import { formatDuration } from './formatDuration';

interface WeeklyProgressBarProps {
  totalMinutes: number;
  goalMinutes: number;
  habitColor?: string;
}

export function WeeklyProgressBar({
  totalMinutes,
  goalMinutes,
  habitColor,
}: WeeklyProgressBarProps) {
  const { colors } = useThemeColors();
  const accent = habitColor ?? colors.primary[600];
  const percent = Math.min(100, Math.round((totalMinutes / goalMinutes) * 100));

  return (
    <View className='mb-3'>
      <View className='mb-1 flex-row items-center'>
        <Text style={{ ...typography.caption, color: colors.text.secondary }}>
          / {formatDuration(goalMinutes)}
        </Text>
        <Text
          className='ml-auto'
          style={{
            ...typography.caption,
            color: accent,
            fontWeight: fontWeights.semibold,
          }}
        >
          {percent}%
        </Text>
      </View>
      <View
        className='h-1.5 overflow-hidden rounded-full'
        style={{ backgroundColor: colors.surface }}
      >
        <View
          className='h-full rounded-full'
          style={{ backgroundColor: accent, width: `${percent}%` }}
        />
      </View>
    </View>
  );
}
