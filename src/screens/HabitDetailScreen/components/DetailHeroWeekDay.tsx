/** Single day cell in the detail hero week strip. */
import { Check } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme';
import { borderRadius } from '../../../theme/spacing';
import { fontWeights } from '../../../theme/typography';
import type { DetailWeekDay } from './buildDetailWeekStrip';

const DOT = 28;

export function DetailHeroWeekDay({ day }: { day: DetailWeekDay }) {
  const { colors } = useThemeColors();
  let status = 'not done';
  if (!day.scheduled) status = 'not scheduled';
  else if (day.done) status = 'completed';
  else if (day.missed) status = 'missed';
  if (day.today) status += ', today';

  return (
    <View
      accessibilityLabel={`${day.name}: ${status}`}
      className='flex-1 items-center'
      style={{ gap: 6 }}
    >
      <Text
        style={{
          color: colors.text.tertiary,
          fontSize: 10,
          fontWeight: fontWeights.bold,
          letterSpacing: 0.4,
        }}
      >
        {day.label}
      </Text>
      <View
        className='items-center justify-center'
        style={{
          backgroundColor: day.done
            ? colors.primary[600]
            : day.missed
              ? 'transparent'
              : colors.surface,
          borderColor: day.done
            ? colors.primary[700]
            : day.missed
              ? colors.text.tertiary
              : colors.border,
          borderRadius: borderRadius.full,
          borderStyle: day.missed ? 'dashed' : 'solid',
          borderWidth: 1.5,
          height: DOT,
          opacity: day.scheduled ? 1 : 0.45,
          width: DOT,
        }}
      >
        {day.done ? (
          <Check color={colors.text.inverse} size={12} strokeWidth={3} />
        ) : null}
      </View>
      {day.today ? (
        <View
          pointerEvents='none'
          style={{
            borderColor: day.done
              ? `${colors.primary[600]}38`
              : colors.primary[100],
            borderRadius: borderRadius.full,
            borderWidth: 3,
            height: DOT + 8,
            position: 'absolute',
            top: 14,
            width: DOT + 8,
          }}
        />
      ) : null}
    </View>
  );
}
