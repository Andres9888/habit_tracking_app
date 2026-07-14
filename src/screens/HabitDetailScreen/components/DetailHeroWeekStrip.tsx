/** This-week cadence strip — done / today / missed (dashed), shame-free. */
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontWeights } from '../../../theme/typography';
import type { DetailWeekDay } from './buildDetailWeekStrip';
import { isWeekStripEmpty } from './buildDetailWeekStrip';
import { DetailHeroWeekDay } from './DetailHeroWeekDay';

interface DetailHeroWeekStripProps {
  days: DetailWeekDay[];
}

export function DetailHeroWeekStrip({ days }: DetailHeroWeekStripProps) {
  const { colors } = useThemeColors();
  const empty = isWeekStripEmpty(days);

  if (empty) {
    return (
      <View
        style={{
          borderColor: colors.border,
          borderRadius: borderRadius.medium + 2,
          borderStyle: 'dashed',
          borderWidth: 1.5,
          marginTop: spacing.sm,
          paddingHorizontal: spacing.base,
          paddingVertical: spacing.md,
        }}
      >
        <Text
          style={{
            color: colors.text.secondary,
            fontSize: 13,
            lineHeight: 18,
            textAlign: 'center',
          }}
        >
          No check-ins yet this week.{'\n'}
          <Text style={{ color: colors.text.primary, fontWeight: fontWeights.bold }}>
            Today is day one
          </Text>
          {' — mark done when you’re ready.'}
        </Text>
      </View>
    );
  }

  return (
    <View
      accessibilityLabel='This week'
      accessibilityRole='summary'
      className='flex-row justify-between'
      style={{ gap: 6, marginTop: spacing.md }}
    >
      {days.map((day) => (
        <DetailHeroWeekDay key={day.date} day={day} />
      ))}
    </View>
  );
}
