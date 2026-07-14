/** Strength Curve sheet — mock list: Gentle / Balanced / Strict. */
import { Pressable, Text, View } from 'react-native';
import {
  ALGORITHM_ORDER,
  type AlgorithmMode,
} from '@/components/AlgorithmPicker';
import { triggerHaptic } from '@/utils/haptics';
import { fontWeights, typography } from '@/theme/typography';
import { CURVE_MOCK_COPY } from './mockTokens';
import { StrengthCurveOption } from './StrengthCurveOption';
import { useAdvancedTokens } from './useAdvancedTokens';

interface Props {
  selected: AlgorithmMode;
  onSelect: (mode: AlgorithmMode) => void;
  onLearnMore: () => void;
}

export function StrengthCurveSheetBody({
  selected,
  onSelect,
  onLearnMore,
}: Props) {
  const t = useAdvancedTokens();
  return (
    <View>
      <View style={{ gap: 8 }}>
        {ALGORITHM_ORDER.map((mode) => {
          const copy = CURVE_MOCK_COPY[mode];
          return (
            <StrengthCurveOption
              key={mode}
              active={mode === selected}
              desc={`+${copy.growthPct}% / day · ${copy.missLabel}`}
              name={copy.name}
              onPress={() => {
                void triggerHaptic('selection');
                onSelect(mode);
              }}
            />
          );
        })}
      </View>
      <Pressable
        accessibilityRole='button'
        style={{ marginTop: 12, alignItems: 'center', paddingVertical: 8 }}
        onPress={onLearnMore}
      >
        <Text
          style={{
            ...typography.caption,
            fontWeight: fontWeights.semibold,
            color: t.accentText,
          }}
        >
          Learn more about strength curves
        </Text>
      </Pressable>
    </View>
  );
}
