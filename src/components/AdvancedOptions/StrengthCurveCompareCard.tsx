/** One Simple / Average / Complex option — % badge, spark, meta, desc. */
import { Text, View } from 'react-native';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { triggerHaptic } from '@/utils/haptics';
import { typography } from '@/theme/typography';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { StrengthCurveCompareHeader } from './StrengthCurveCompareHeader';
import { CURVE_MOCK_COPY } from './mockTokens';
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
      accessibilityRole='radio'
      accessibilityState={{ checked: active }}
      style={{
        paddingVertical: 11,
        paddingHorizontal: 12,
        borderRadius: 14,
        borderWidth: active ? 2 : 1,
        borderColor: active ? t.accentText : t.border,
        backgroundColor: active ? t.accentTile : t.card,
        gap: 7,
        minHeight: 44,
      }}
      onPress={() => {
        void triggerHaptic('selection');
        onSelect(mode);
      }}
    >
      <StrengthCurveCompareHeader
        active={active}
        growthPct={c.growthPct}
        name={c.name}
        suggested={suggested}
        t={t}
      />
      <StrengthCurveSpark
        fillPath={c.sparkFillPath}
        path={c.sparkPath}
        stroke={t.accentText}
      />
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          columnGap: 8,
          rowGap: 2,
        }}
      >
        <Text style={{ ...typography.caption, fontSize: 11, color: t.meta }}>
          ~{c.days} days to full
        </Text>
        <Text style={{ ...typography.caption, fontSize: 11, color: t.meta }}>
          {c.missLabel}
        </Text>
      </View>
      <Text
        style={{
          ...typography.caption,
          fontSize: 12,
          lineHeight: 16,
          color: t.meta,
        }}
      >
        {c.desc}
      </Text>
    </AnimatedPressable>
  );
}
