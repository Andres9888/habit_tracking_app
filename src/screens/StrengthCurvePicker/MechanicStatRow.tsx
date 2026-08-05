/** MechanicStatRow — two-card check-in / miss explainer with per-tier numbers + stagger. */
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useThemeColors } from '@/theme/ThemeContext';
import { STRENGTH_CURVE_PICKER_COPY, TIER_COPY } from './StrengthCurvePicker.copy';
import { MODE_STYLES } from './strengthCurveModeStyles';

export function MechanicStatRow({ mode, scale = 1 }: { mode: AlgorithmMode; scale?: number }) {
  const { colors } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const tier = TIER_COPY[mode];
  const accent = MODE_STYLES[mode].curveColor;
  const missColor = colors.status.error;
  const gain = reduceMotion ? undefined : FadeInDown.delay(80).duration(280);
  const dip = reduceMotion ? undefined : FadeInDown.delay(160).duration(280);

  const cardStyle = {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: 12 * scale,
  } as const;

  return (
    <View className='flex-row mx-4' style={{ gap: 10 * scale, marginTop: 12 * scale }}>
      <Animated.View
        key={`gain-${mode}`}
        entering={gain}
        className='flex-1 items-center rounded-2xl'
        style={{ ...cardStyle, borderLeftColor: accent }}
      >
        <Text style={{ color: accent, fontSize: 24 * scale, lineHeight: 26 * scale }}>✓</Text>
        <Text className='font-bold' style={{ color: colors.text.primary, fontSize: 12 * scale, marginTop: 2 * scale }}>
          {STRENGTH_CURVE_PICKER_COPY.checkInLabel}
        </Text>
        <Text className='font-extrabold' style={{ color: accent, fontSize: 22 * scale, marginTop: 2 * scale }}>
          {tier.fillPercent}
        </Text>
      </Animated.View>
      <Animated.View
        key={`dip-${mode}`}
        entering={dip}
        className='flex-1 items-center rounded-2xl'
        style={{ ...cardStyle, borderLeftColor: missColor }}
      >
        <Text style={{ color: missColor, fontSize: 24 * scale, lineHeight: 26 * scale }}>✗</Text>
        <Text className='font-bold' style={{ color: colors.text.primary, fontSize: 12 * scale, marginTop: 2 * scale }}>
          {STRENGTH_CURVE_PICKER_COPY.missLabel}
        </Text>
        <Text className='font-extrabold' style={{ color: missColor, fontSize: 22 * scale, marginTop: 2 * scale }}>
          {tier.dipPercent}
        </Text>
      </Animated.View>
    </View>
  );
}
