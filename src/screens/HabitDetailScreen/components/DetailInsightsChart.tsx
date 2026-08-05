/** DetailInsightsChart — thin day-of-week bars + labels + Good/Hard tags (mock: dow-chart). */
import { Text, View } from 'react-native';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontWeights } from '../../../theme/typography';
import { withAlpha } from '../../../theme/colors';
import { useThemeColors } from '../../../theme';
import type { WeekdayBar } from './weekdayInsights';

const TRACK_HEIGHT = 118;
const BAR_WIDTH = 20;

interface Props {
  bars: WeekdayBar[];
  habitColor: string;
}

export function DetailInsightsChart({ bars, habitColor }: Props) {
  const { colors } = useThemeColors();
  const hard = colors.status.error;

  const barColor = (kind: string) =>
    kind === 'good'
      ? habitColor
      : kind === 'hard'
        ? withAlpha(hard, 0.3)
        : withAlpha(habitColor, 0.22);
  const labelColor = (kind: string) =>
    kind === 'good'
      ? colors.primary[700]
      : kind === 'hard'
        ? hard
        : colors.text.tertiary;

  return (
    <View className='flex-row items-end justify-between px-1'>
      {bars.map((bar, i) => (
        <View
          key={i}
          className='flex-1 items-center'
          style={{ gap: spacing.xs + 2 }}
        >
          <View style={{ height: TRACK_HEIGHT, justifyContent: 'flex-end' }}>
            <View
              style={{
                backgroundColor: barColor(bar.kind),
                borderRadius: borderRadius.full,
                height: Math.max(12, (TRACK_HEIGHT * bar.pct) / 100),
                width: BAR_WIDTH,
              }}
            />
          </View>
          <Text
            style={{
              color: labelColor(bar.kind),
              fontSize: 11,
              fontWeight:
                bar.kind === 'normal' ? fontWeights.semibold : fontWeights.bold,
            }}
          >
            {bar.label}
          </Text>
          <Text
            style={{
              color: labelColor(bar.kind),
              fontSize: 8,
              fontWeight: fontWeights.bold,
              letterSpacing: 0.4,
              lineHeight: 9,
              textTransform: 'uppercase',
            }}
          >
            {bar.kind === 'good' ? 'Good' : bar.kind === 'hard' ? 'Hard' : ' '}
          </Text>
        </View>
      ))}
    </View>
  );
}
