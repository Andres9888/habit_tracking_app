/** Single momentum stat cell (Best / Total / 30-day). */
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights } from '../../../theme/typography';
import { MAX_FONT_SIZE_MULTIPLIER_STRICT } from '../../../utils/accessibility/textScaling';

interface DetailHeroStatCellProps {
  highlight?: boolean;
  label: string;
  value: string;
}

export function DetailHeroStatCell({
  highlight,
  label,
  value,
}: DetailHeroStatCellProps) {
  const { colors } = useThemeColors();
  return (
    <View
      className='flex-1 items-center'
      style={{
        backgroundColor: colors.background,
        borderRadius: borderRadius.medium,
        paddingHorizontal: spacing.xs,
        paddingVertical: spacing.sm + 2,
      }}
    >
      <Text
        maxFontSizeMultiplier={MAX_FONT_SIZE_MULTIPLIER_STRICT}
        style={{
          color: highlight ? colors.status.streak : colors.text.primary,
          fontFamily: fontFamilies.primary.display,
          fontSize: 17,
          fontWeight: fontWeights.bold,
          letterSpacing: -0.3,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          color: colors.text.tertiary,
          fontSize: 11,
          fontWeight: fontWeights.semibold,
          letterSpacing: 0.2,
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
