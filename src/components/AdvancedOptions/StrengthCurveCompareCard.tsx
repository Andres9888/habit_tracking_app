/** One Simple / Average / Complex option — % badge, spark, meta, desc. */
import { Text, View } from 'react-native';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { fontWeights, typography } from '@/theme/typography';
import { triggerHaptic } from '@/utils/haptics';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { CheckCircle, PctBadge, SuggestedPill } from './StrengthCurveCardBits';
import { CURVE_MOCK_COPY } from './mockTokens';
import { StrengthCurveMetaChip } from './StrengthCurveMetaChip';
import { StrengthCurveSpark } from './StrengthCurveSpark';
import { useAdvancedTokens } from './useAdvancedTokens';

interface Props {
  mode: AlgorithmMode;
  active: boolean;
  suggested?: boolean;
  onSelect: (mode: AlgorithmMode) => void;
}

export function StrengthCurveCompareCard({
  mode,
  active,
  suggested,
  onSelect,
}: Props) {
  const t = useAdvancedTokens();
  const c = CURVE_MOCK_COPY[mode];

  return (
    <AnimatedPressable
      animationConfig={{ enableHaptics: false }}
      accessibilityRole='radio'
      accessibilityState={{ checked: active }}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: active ? t.accentText : t.border,
        backgroundColor: active ? t.accentTile : t.card,
        gap: 8,
        minHeight: 44,
      }}
      onPress={() => {
        if (!active) void triggerHaptic('selection');
        onSelect(mode);
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            flex: 1,
            flexWrap: 'wrap',
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: fontWeights.bold,
              color: active ? t.accentText : t.fg,
            }}
          >
            {c.name}
          </Text>
          <PctBadge active={active} growthPct={c.growthPct} t={t} />
          {suggested ? <SuggestedPill bg={t.accentText} /> : null}
        </View>
        <CheckCircle active={active} t={t} />
      </View>
      <StrengthCurveSpark
        fillPath={c.sparkFillPath}
        path={c.sparkPath}
        stroke={t.accentText}
      />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        <StrengthCurveMetaChip label={`~${c.days} days to full`} t={t} />
        <StrengthCurveMetaChip label={c.missLabel} t={t} />
      </View>
      <Text style={{ ...typography.caption, fontSize: 12, color: t.meta }}>
        {c.desc}
      </Text>
    </AnimatedPressable>
  );
}
