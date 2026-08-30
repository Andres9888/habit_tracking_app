/** MechanicStatRow — two-card check-in / miss explainer with per-tier numbers + stagger. */
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { useThemeColors } from '@/theme/ThemeContext';
import { Text, View } from 'react-native';
import {
  STRENGTH_CURVE_PICKER_COPY,
  TIER_COPY,
} from './StrengthCurvePicker.copy';
import { MODE_STYLES } from './strengthCurveModeStyles';

const MISS_COLOR = '#C84A4A';

export function MechanicStatRow({
  mode,
  scale = 1,
}: {
  mode: AlgorithmMode;
  scale?: number;
}) {
  const { colors } = useThemeColors();
  const tier = TIER_COPY[mode];
  const accent = MODE_STYLES[mode].curveColor;
  const cardStyle = {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    padding: 12 * scale,
  } as const;

  return (
    <View
      className='mx-4 flex-row'
      style={{ gap: 10 * scale, marginTop: 12 * scale }}
    >
      <View className='flex-1 items-center rounded-2xl' style={cardStyle}>
        <Text
          style={{
            color: accent,
            fontSize: 18 * scale,
            lineHeight: 20 * scale,
          }}
        >
          ✓
        </Text>
        <Text
          className='font-bold'
          style={{
            color: colors.text.primary,
            fontSize: 12 * scale,
            marginTop: 2 * scale,
          }}
        >
          {STRENGTH_CURVE_PICKER_COPY.checkInLabel}
        </Text>
        <Text
          className='font-extrabold'
          style={{ color: accent, fontSize: 22 * scale }}
        >
          {tier.fillPercent}
        </Text>
        <Text
          style={{
            color: colors.text.tertiary,
            fontSize: 11 * scale,
            marginTop: 1 * scale,
          }}
        >
          {STRENGTH_CURVE_PICKER_COPY.checkInUnit}
        </Text>
      </View>
      <View className='flex-1 items-center rounded-2xl' style={cardStyle}>
        <Text
          style={{
            color: MISS_COLOR,
            fontSize: 18 * scale,
            lineHeight: 20 * scale,
          }}
        >
          ✗
        </Text>
        <Text
          className='font-bold'
          style={{
            color: colors.text.primary,
            fontSize: 12 * scale,
            marginTop: 2 * scale,
          }}
        >
          {STRENGTH_CURVE_PICKER_COPY.missLabel}
        </Text>
        <Text
          className='font-extrabold'
          style={{ color: MISS_COLOR, fontSize: 22 * scale }}
        >
          {tier.dipPercent}
        </Text>
        <Text
          style={{
            color: colors.text.tertiary,
            fontSize: 11 * scale,
            marginTop: 1 * scale,
          }}
        >
          {STRENGTH_CURVE_PICKER_COPY.missUnit}
        </Text>
      </View>
    </View>
  );
}
