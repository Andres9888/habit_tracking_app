/**
 * StatColumn - The detail-page stat idiom: mono number over a lowercase
 * label. Pair with StatHairline between columns.
 */
import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../theme';
import { fontFamilies, fontWeights, typography } from '../../theme/typography';

const SIZES = {
  compact: {
    fontSize: typography.body.fontSize,
    fontWeight: fontWeights.semibold,
  },
  large: {
    fontSize: typography.heading3.fontSize,
    fontWeight: fontWeights.bold,
  },
} as const;

const HAIRLINE_HEIGHT = 28;

interface StatColumnProps {
  label: string;
  value: string | number;
  size?: keyof typeof SIZES;
  valueColor?: string;
  labelColor?: string;
}

export function StatColumn({
  label,
  value,
  size = 'large',
  valueColor,
  labelColor,
}: StatColumnProps) {
  const { colors } = useThemeColors();
  return (
    <View className='flex-1 items-center'>
      <Text
        style={{
          color: valueColor ?? colors.text.primary,
          fontFamily: fontFamilies.monospace,
          ...SIZES[size],
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          ...typography.caption,
          color: labelColor ?? colors.text.tertiary,
          fontSize: typography.overline.fontSize,
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export function StatHairline() {
  const { colors } = useThemeColors();
  return (
    <View
      style={{
        backgroundColor: colors.border,
        height: HAIRLINE_HEIGHT,
        width: StyleSheet.hairlineWidth,
      }}
    />
  );
}
