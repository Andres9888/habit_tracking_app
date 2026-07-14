/** Inline expand body for Strength Curve (teach + strip + cards + footer). */
import { Text, View } from 'react-native';
import {
  ALGORITHM_ORDER,
  type AlgorithmMode,
} from '@/components/AlgorithmPicker';
import { fontWeights, typography } from '@/theme/typography';
import { StrengthCurveCompareCard } from './StrengthCurveCompareCard';
import { StrengthCurveCompareStrip } from './StrengthCurveCompareStrip';
import { useAdvancedTokens } from './useAdvancedTokens';

interface Props {
  selected: AlgorithmMode;
  suggested?: AlgorithmMode;
  onSelect: (mode: AlgorithmMode) => void;
}

export function StrengthCurveExpand({ selected, suggested, onSelect }: Props) {
  const t = useAdvancedTokens();
  return (
    <View
      style={{
        marginTop: 4,
        marginBottom: 4,
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: t.border,
        backgroundColor: t.card,
      }}
    >
      <Text
        style={{
          ...typography.caption,
          fontSize: 13,
          color: t.muted,
          marginBottom: 12,
          lineHeight: 18,
        }}
      >
        <Text style={{ fontWeight: fontWeights.bold, color: t.fg }}>
          Depends on habit type
        </Text>
        {
          ' — same streak length, different % climb. Simple habits jump faster; complex ones rise slowly so misses hurt less.'
        }
      </Text>
      <StrengthCurveCompareStrip selected={selected} />
      {/* gap 6 matches Streak Goal / Growth Icons chip rows */}
      <View accessibilityRole='radiogroup' style={{ gap: 6 }}>
        {ALGORITHM_ORDER.map((mode) => (
          <StrengthCurveCompareCard
            key={mode}
            active={mode === selected}
            mode={mode}
            suggested={suggested === mode}
            onSelect={onSelect}
          />
        ))}
      </View>
      <Text
        style={{
          ...typography.caption,
          fontSize: 12,
          color: t.muted,
          marginTop: 12,
          lineHeight: 17,
        }}
      >
        <Text style={{ fontWeight: fontWeights.bold, color: t.fg }}>
          Same streak. Different %.
        </Text>
        {
          ' Suggested from habit type; you can override anytime. No lockouts — only miss cost changes.'
        }
      </Text>
    </View>
  );
}
