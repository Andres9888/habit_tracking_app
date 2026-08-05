import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { borderRadius } from '@/theme/spacing';
import { fontWeights } from '@/theme/typography';
import type { DayEffortForecastProps } from './DayEffortForecast.types';
import { getLoadColor } from './dayEffortForecastColors';

export function DayEffortForecast({
  capacityMinutes = 60,
  isCurrentDay,
  isUpcoming,
  plannedMinutes,
  remainingMinutes,
}: DayEffortForecastProps) {
  const { colors } = useThemeColors();

  if (isCurrentDay) {
    if (remainingMinutes === undefined) return null;
    const label =
      remainingMinutes > 0 ? `~${remainingMinutes}m left` : 'Plan done';
    return (
      <View
        accessible
        accessibilityLabel={
          remainingMinutes > 0
            ? `About ${remainingMinutes} minutes remaining today`
            : 'Today plan complete'
        }
        style={{
          alignSelf: 'center',
          backgroundColor: colors.primary[100],
          borderRadius: borderRadius.full,
          marginTop: 3,
          paddingHorizontal: 5,
          paddingVertical: 2,
        }}
      >
        <Text
          style={{
            color: colors.primary[700],
            fontSize: 8,
            fontVariant: ['tabular-nums'],
            fontWeight: fontWeights.semibold,
          }}
        >
          {label}
        </Text>
      </View>
    );
  }

  if (!isUpcoming || plannedMinutes === undefined) return null;

  const ratio =
    capacityMinutes > 0 ? Math.min(1, plannedMinutes / capacityMinutes) : 0;
  const loadColor = getLoadColor(plannedMinutes, capacityMinutes, colors);
  const isOverCapacity = plannedMinutes > capacityMinutes;

  return (
    <View
      accessible
      accessibilityLabel={`Forecast ${plannedMinutes} minutes${
        isOverCapacity
          ? `, over ${capacityMinutes} minute capacity`
          : ` of ${capacityMinutes} minute capacity`
      }`}
      style={{ alignItems: 'center', gap: 2, marginTop: 3 }}
    >
      <Text
        style={{
          color: loadColor,
          fontSize: 8,
          fontVariant: ['tabular-nums'],
          fontWeight: fontWeights.semibold,
        }}
      >
        {plannedMinutes}m
      </Text>
      <View
        style={{
          backgroundColor: colors.border,
          borderRadius: borderRadius.full,
          height: 3,
          overflow: 'hidden',
          width: 28,
        }}
      >
        <View
          style={{
            backgroundColor: loadColor,
            borderRadius: borderRadius.full,
            height: '100%',
            width: `${ratio * 100}%`,
          }}
        />
      </View>
    </View>
  );
}
