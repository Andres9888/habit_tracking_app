import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { useThemeColors } from '@/theme/ThemeContext';
import { Text, View } from 'react-native';
import {
  STRENGTH_CURVE_PICKER_COPY,
  TIER_COPY,
} from './StrengthCurvePicker.copy';

export function StrengthBarMilestones({
  mode,
  accent,
  scale,
}: {
  mode: AlgorithmMode;
  accent: string;
  scale: number;
}) {
  const { colors } = useThemeColors();
  const tier = TIER_COPY[mode];

  return (
    <View
      className='flex-row items-start'
      style={{ marginBottom: 10 * scale, minHeight: 34 * scale }}
    >
      <View className='flex-1 items-start'>
        <Text
          className='font-extrabold tracking-wider'
          style={{ color: colors.text.tertiary, fontSize: 12 * scale }}
        >
          DAY 1
        </Text>
        <Text
          style={{
            color: colors.text.tertiary,
            fontSize: 11 * scale,
            marginTop: 1 * scale,
          }}
        >
          {STRENGTH_CURVE_PICKER_COPY.freshStartLabel}
        </Text>
      </View>
      <View className='flex-1 items-center'>
        <Text
          className='font-extrabold tracking-wider'
          style={{ color: colors.text.tertiary, fontSize: 12 * scale }}
        >
          {tier.midpointLabel}
        </Text>
        <Text
          className='font-semibold'
          style={{
            color: colors.text.primary,
            fontSize: 11 * scale,
            marginTop: 1 * scale,
          }}
        >
          {tier.midpointSub}
        </Text>
      </View>
      <View className='flex-1 items-end'>
        <Text
          className='font-extrabold tracking-wider'
          style={{ color: accent, fontSize: 12 * scale }}
        >
          {tier.automaticMilestone}
        </Text>
        <Text
          style={{ color: accent, fontSize: 11 * scale, marginTop: 1 * scale }}
        >
          {STRENGTH_CURVE_PICKER_COPY.automaticLabel}
        </Text>
      </View>
    </View>
  );
}
