/** Compact "Detected habit type" bar — shown above the Strength Curve trigger. */
import { Text, View } from 'react-native';
import type { GrowthType } from '@/utils/growthTypeMeta';
import { fontWeights, typography } from '@/theme/typography';
import { CURVE_MOCK_COPY, GROWTH_TO_MODE, TYPE_BAR_COPY } from './mockTokens';
import { useAdvancedTokens } from './useAdvancedTokens';

interface Props {
  growthType: GrowthType;
}

export function StrengthCurveTypeBar({ growthType }: Props) {
  const t = useAdvancedTokens();
  const mode = GROWTH_TO_MODE[growthType];
  const copy = TYPE_BAR_COPY[growthType];
  const pct = CURVE_MOCK_COPY[mode].growthPct;

  return (
    <View
      accessible
      accessibilityLabel={`Detected habit type, ${copy.label}, ${copy.tagline}. Suggested plus ${pct} percent per check-in.`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        marginBottom: 10,
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        backgroundColor: t.accentTile,
        borderColor: t.border,
      }}
    >
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: fontWeights.bold,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            color: t.accentText,
          }}
        >
          Detected habit type
        </Text>
        <Text
          numberOfLines={1}
          style={{
            ...typography.caption,
            fontSize: 13,
            fontWeight: fontWeights.bold,
            color: t.fg,
          }}
        >
          {copy.label} · {copy.tagline}
        </Text>
      </View>
      <View
        style={{
          borderRadius: 999,
          borderWidth: 1,
          borderColor: t.accentText,
          backgroundColor: t.card,
          paddingHorizontal: 10,
          paddingVertical: 6,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: fontWeights.bold,
            color: t.accentText,
            fontVariant: ['tabular-nums'],
          }}
        >
          +{pct}% / check-in
        </Text>
      </View>
    </View>
  );
}
