/** MechanicStatRow — two-card check-in / miss explainer with per-tier numbers + stagger. */
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { useThemeColors } from '@/theme/ThemeContext';
import { View } from 'react-native';
import {
  STRENGTH_CURVE_PICKER_COPY,
  TIER_COPY,
} from './StrengthCurvePicker.copy';
import { MODE_STYLES } from './strengthCurveModeStyles';
import { MechanicStatCard } from './MechanicStatCard';

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
      <MechanicStatCard cardStyle={cardStyle} color={accent} colors={colors}
        label={STRENGTH_CURVE_PICKER_COPY.checkInLabel} scale={scale} symbol='✓'
        unit={STRENGTH_CURVE_PICKER_COPY.checkInUnit} value={tier.fillPercent} />
      <MechanicStatCard cardStyle={cardStyle} color={MISS_COLOR} colors={colors}
        label={STRENGTH_CURVE_PICKER_COPY.missLabel} scale={scale} symbol='✗'
        unit={STRENGTH_CURVE_PICKER_COPY.missUnit} value={tier.dipPercent} />
    </View>
  );
}
