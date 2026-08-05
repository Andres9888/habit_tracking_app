/** TierDetailCard — selected tier explainer. */
import { Lock } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useThemeColors } from '@/theme/ThemeContext';
import { STRENGTH_CURVE_PICKER_COPY, TIER_COPY } from './StrengthCurvePicker.copy';
import { MODE_STYLES } from './strengthCurveModeStyles';

interface Props {
  mode: AlgorithmMode;
  isPremium: boolean;
  onUpgradePress: () => void;
  scale?: number;
}

export function TierDetailCard({ mode, isPremium, onUpgradePress, scale = 1 }: Props) {
  const { colors } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const tier = TIER_COPY[mode];
  const style = MODE_STYLES[mode];
  const TierIcon = style.Icon;
  const showPremiumUpsell = mode === 'strict' && !isPremium;

  return (
    <Animated.View
      key={mode}
      entering={reduceMotion ? undefined : FadeInDown.duration(280)}
      className='mx-4 rounded-2xl'
      style={{
        backgroundColor: colors.card,
        borderColor: colors.cardBorder,
        borderLeftColor: style.curveColor,
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
          <TierIcon color={style.tierPillFg} size={12 * scale} strokeWidth={2.25} />
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
              borderColor: colors.cardBorder,
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
      {showPremiumUpsell ? (
        <View className='rounded-xl' style={{ backgroundColor: colors.status.premiumLight, gap: 4 * scale, marginTop: 10 * scale, padding: 8 * scale }}>
          <View className='flex-row items-center' style={{ gap: 6 * scale }}>
            <Lock color={colors.status.premiumText} size={12 * scale} strokeWidth={2.25} />
            <Text className='font-semibold' style={{ color: colors.status.premiumText, fontSize: 11 * scale }}>
              {STRENGTH_CURVE_PICKER_COPY.premiumComplexLockedLabel}
            </Text>
          </View>
          <Text style={{ color: colors.status.premiumText, fontSize: 11 * scale, lineHeight: 15 * scale }}>
            {STRENGTH_CURVE_PICKER_COPY.premiumComplexNote}
          </Text>
          <Pressable accessibilityHint='Open premium options' accessibilityRole='button' onPress={onUpgradePress}>
            <Text className='font-semibold' style={{ color: colors.status.premium, fontSize: 11 * scale }}>
              {STRENGTH_CURVE_PICKER_COPY.premiumComplexCta}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </Animated.View>
  );
}
