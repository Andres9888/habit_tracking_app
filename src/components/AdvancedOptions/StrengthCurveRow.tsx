/** "Strength curve" panel row — three curve chips plus the compare deep-dive. */
import { useState } from 'react';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { MODE_STYLES } from '@/screens/StrengthCurvePicker/strengthCurveModeStyles';
import { iconSizes } from '@/theme/iconSizes';
import type { GrowthType } from '@/utils/growthTypeMeta';
import { InlineExpandBody } from './InlineExpandBody';
import { CURVE_MOCK_COPY } from './mockTokens';
import { DisclosureLink } from './panel/DisclosureLink';
import { HelperLine } from './panel/HelperLine';
import { PanelRow } from './panel/PanelRow';
import { usePanelTokens } from './panel/panelTokens';
import { StrengthCurveChips } from './StrengthCurveChips';
import { StrengthCurveExpand } from './StrengthCurveExpand';
import { useInlineExpand } from './useInlineExpand';
import { useStrengthCurveInline } from './useStrengthCurveInline';

interface Props {
  strengthAlgorithm: AlgorithmMode;
  growthType?: GrowthType;
  isNewHabit: boolean;
  onSelect: (mode: AlgorithmMode) => void;
  open: boolean;
  onToggle: () => void;
  divided: boolean;
}

export function StrengthCurveRow({
  strengthAlgorithm,
  growthType,
  isNewHabit,
  onSelect,
  open,
  onToggle,
  divided,
}: Props) {
  const t = usePanelTokens();
  const { suggested, handleSelect } = useStrengthCurveInline({
    strengthAlgorithm,
    growthType,
    isNewHabit,
    onSelect,
  });
  const [compareOpen, setCompareOpen] = useState(false);
  const compare = useInlineExpand(compareOpen);
  const HeadIcon = MODE_STYLES[strengthAlgorithm].Icon;

  return (
    <PanelRow
      accessibilityLabel='Strength curve'
      divided={divided}
      hint={
        open
          ? 'How hard is this habit? Easier habits build faster.'
          : 'How hard is this habit?'
      }
      hue='curve'
      icon={
        <HeadIcon
          color={t.hues.curve.ink}
          size={iconSizes.small}
          strokeWidth={2}
        />
      }
      open={open}
      title='Strength curve'
      value={{ label: CURVE_MOCK_COPY[strengthAlgorithm].name, set: true }}
      onToggle={onToggle}
    >
      <StrengthCurveChips
        selected={strengthAlgorithm}
        suggested={suggested}
        onSelect={handleSelect}
      />
      <HelperLine>SUGGESTED · MISSES COST LESS ON SLOWER CURVES</HelperLine>
      <DisclosureLink
        label='SEE THE DIFFERENCE'
        open={compareOpen}
        onToggle={() => setCompareOpen((v) => !v)}
      />
      <InlineExpandBody expand={compare} open={compareOpen}>
        <StrengthCurveExpand
          selected={strengthAlgorithm}
          suggested={suggested}
          onSelect={handleSelect}
        />
      </InlineExpandBody>
    </PanelRow>
  );
}
