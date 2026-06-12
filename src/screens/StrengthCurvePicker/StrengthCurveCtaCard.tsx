/** Preview-card CTA — sparkline + tier subtitle, opens full picker. */
import { Pressable, Text, View } from 'react-native';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights, typography } from '@/theme/typography';
import { StrengthCurveCtaSparkline } from './StrengthCurveCtaSparkline';
import { TIER_COPY } from './StrengthCurvePicker.copy';
import { MODE_STYLES } from './strengthCurveModeStyles';
import { TierContentCrossfade } from './TierContentCrossfade';

interface Props {
  mode: AlgorithmMode;
  onPress: () => void;
}

export function StrengthCurveCtaCard({ mode, onPress }: Props) {
  const { colors } = useThemeColors();
  const tier = TIER_COPY[mode];
  const modeStyle = MODE_STYLES[mode];

  return (
    <Pressable
      accessibilityHint='Opens detailed strength curve visualization'
      accessibilityLabel='See how strength builds'
      accessibilityRole='button'
      hitSlop={8}
      onPress={onPress}
    >
      <View
        style={{
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: 16,
          borderWidth: 1,
          flexDirection: 'row',
          gap: 12,
          marginTop: 14,
          paddingHorizontal: 14,
          paddingVertical: 12,
          shadowColor: '#1F1B16',
          shadowOffset: { height: 3, width: 0 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <View style={{ flex: 1, minHeight: 40, overflow: 'hidden', position: 'relative' }}>
          <TierContentCrossfade contentKey={mode}>
            <View style={{ alignItems: 'center', flexDirection: 'row', gap: 12 }}>
              <StrengthCurveCtaSparkline color={modeStyle.curveColor} />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    ...typography.bodySmall,
                    color: colors.text.primary,
                    fontWeight: fontWeights.semibold,
                  }}
                >
                  See how strength builds
                </Text>
                <Text
                  style={{
                    color: colors.text.tertiary,
                    fontFamily: typography.caption.fontFamily,
                    fontSize: 11.5,
                    lineHeight: 15,
                    marginTop: 1,
                  }}
                >
                  {tier.ctaSubtitle}
                </Text>
              </View>
            </View>
          </TierContentCrossfade>
        </View>
        <Text
          style={{
            color: colors.text.tertiary,
            fontSize: 18,
            fontWeight: fontWeights.semibold,
          }}
        >
          ›
        </Text>
      </View>
    </Pressable>
  );
}
