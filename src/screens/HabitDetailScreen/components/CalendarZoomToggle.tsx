/** CalendarZoomToggle — Month | Year segmented control for the History card. */
import { Pressable, Text, View } from 'react-native';
import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';
import { colors as palette } from '../../../theme/colors';
import { useThemeColors } from '../../../theme';

export type CalendarZoom = 'month' | 'year';
const OPTIONS: CalendarZoom[] = ['month', 'year'];

interface Props {
  value: CalendarZoom;
  onChange: (zoom: CalendarZoom) => void;
}

export function CalendarZoomToggle({ value, onChange }: Props) {
  const { colors, isDark } = useThemeColors();
  return (
    <View
      className='mb-3 flex-row'
      style={{
        backgroundColor: isDark ? colors.surface : colors.gray[50],
        borderRadius: borderRadius.full,
        gap: 2,
        padding: 3,
      }}
    >
      {OPTIONS.map((option) => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            accessibilityRole='tab'
            accessibilityState={{ selected }}
            className='flex-1 items-center justify-center'
            style={{
              borderRadius: borderRadius.full,
              minHeight: 34,
              ...(selected
                ? {
                    backgroundColor: isDark
                      ? colors.card
                      : palette.light.cardElevated,
                    ...shadows.subtle,
                  }
                : null),
            }}
            onPress={() => onChange(option)}
          >
            <Text
              style={{
                ...typography.caption,
                color: selected ? colors.text.primary : colors.text.tertiary,
                fontWeight: fontWeights.bold,
                letterSpacing: 0.2,
                paddingHorizontal: spacing.sm,
              }}
            >
              {option === 'month' ? 'Month' : 'Year'}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
