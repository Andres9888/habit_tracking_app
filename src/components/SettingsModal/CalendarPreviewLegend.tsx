/** CalendarPreviewLegend — weekday letters under the preview week, plus the
 *  line that explains what the strength fill behind it is measuring. Weeks are
 *  Monday-start throughout the app (see getWeekStart), so the letters do too. */
import { Text, View } from 'react-native';
import { typography } from '@/theme/typography';
import { useThemeColors } from '../../theme/ThemeContext';
import { PREVIEW_STRENGTH_PERCENT } from './CalendarPreviewWeek';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface Props {
  showGradientFill: boolean;
}

export function CalendarPreviewLegend({ showGradientFill }: Props) {
  const { colors } = useThemeColors();

  return (
    <View className='mt-2' style={{ marginHorizontal: 14 }}>
      <View
        accessibilityElementsHidden
        className='flex-row'
        importantForAccessibility='no-hide-descendants'
      >
        {WEEKDAYS.map((letter, i) => (
          <Text
            key={i}
            className='flex-1 text-center'
            style={{ ...typography.caption, color: colors.text.tertiary }}
          >
            {letter}
          </Text>
        ))}
      </View>
      {showGradientFill ? (
        <Text
          className='mt-2'
          style={{ ...typography.caption, color: colors.text.tertiary }}
        >
          Strength fill ends at the week&apos;s strongest day (
          {PREVIEW_STRENGTH_PERCENT}%)
        </Text>
      ) : null}
    </View>
  );
}
