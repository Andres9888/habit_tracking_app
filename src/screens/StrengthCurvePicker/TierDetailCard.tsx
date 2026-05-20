/** TierDetailCard — explainer card for the currently selected tier (Option B). */
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useThemeColors } from '@/theme/ThemeContext';
import { TIER_COPY } from './StrengthCurvePicker.copy';
import { MODE_STYLES } from './strengthCurveModeStyles';

export function TierDetailCard({ mode, scale = 1 }: { mode: AlgorithmMode; scale?: number }) {
  const { colors } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const tier = TIER_COPY[mode];
  const style = MODE_STYLES[mode];
  const accent = style.curveColor;

  return (
    <Animated.View
      key={mode}
      entering={reduceMotion ? undefined : FadeInDown.duration(280)}
      className='mx-4 rounded-2xl'
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderLeftColor: accent,
        borderLeftWidth: 4,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        marginTop: 8 * scale,
        padding: 12 * scale,
      }}
    >
      <View className='flex-row items-center flex-wrap' style={{ gap: 8 * scale, marginBottom: 6 * scale }}>
        <View
          className='flex-row items-center rounded-full'
          style={{ backgroundColor: style.tierPillBg, gap: 4 * scale, paddingHorizontal: 8 * scale, paddingVertical: 2 * scale }}
        >
          <Text style={{ fontSize: 13 * scale }}>{tier.emoji}</Text>
          <Text className='font-bold' style={{ color: style.tierPillFg, fontSize: 11.5 * scale }}>
            {tier.detailHeading}
          </Text>
        </View>
        <Text style={{ color: colors.text.tertiary, fontSize: 10.5 * scale }}>
          · {tier.durationPerDay}
        </Text>
      </View>
      <Text style={{ color: colors.text.secondary, fontSize: 12 * scale, lineHeight: 16 * scale }}>
        {tier.description}
      </Text>
      <View className='flex-row flex-wrap' style={{ gap: 6 * scale, marginTop: 8 * scale }}>
        {tier.exampleChips.map((chip) => (
          <View
            key={chip}
            className='rounded-full'
            style={{
              backgroundColor: colors.gray[100],
              borderColor: colors.border,
              borderWidth: 1,
              paddingHorizontal: 8 * scale,
              paddingVertical: 2 * scale,
            }}
          >
            <Text className='font-medium' style={{ color: colors.text.secondary, fontSize: 11 * scale }}>
              {chip}
            </Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}
