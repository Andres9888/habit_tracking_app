/** The three curve option chips (Simple / Average / Complex). */
import {
  ALGORITHM_ORDER,
  type AlgorithmMode,
} from '@/components/AlgorithmPicker';
import { MODE_STYLES } from '@/screens/StrengthCurvePicker/strengthCurveModeStyles';
import { CURVE_MOCK_COPY } from './mockTokens';
import { OptionChip } from './panel/OptionChip';
import { OptionChipRow } from './panel/OptionChipRow';

interface Props {
  selected: AlgorithmMode;
  suggested: AlgorithmMode;
  onSelect: (mode: AlgorithmMode) => void;
}

export function StrengthCurveChips({ selected, suggested, onSelect }: Props) {
  return (
    <OptionChipRow>
      {ALGORITHM_ORDER.map((mode) => {
        const Glyph = MODE_STYLES[mode].Icon;
        const copy = CURVE_MOCK_COPY[mode];
        return (
          <OptionChip
            key={mode}
            accessibilityLabel={`${copy.name} curve, plus ${copy.growthPct} percent per check-in`}
            glyph={
              <Glyph
                color={MODE_STYLES[mode].iconColor}
                size={18}
                strokeWidth={2}
              />
            }
            label={`+${copy.growthPct}%/DAY`}
            selected={mode === selected}
            suggested={mode === suggested}
            value={copy.name}
            valueSize={15}
            onPress={() => onSelect(mode)}
          />
        );
      })}
    </OptionChipRow>
  );
}
