/** Strength Curve sheet + full picker modal for Advanced Options. */
import { StrengthCurvePickerModal } from '@/screens/StrengthCurvePicker';
import { AdvancedSheet } from './AdvancedSheet';
import { StrengthCurveSheetBody } from './StrengthCurveSheetBody';

interface Props {
  strengthAlgorithm: 'forgiving' | 'balanced' | 'strict';
  curveSheetOpen: boolean;
  fullPickerVisible: boolean;
  onStrengthAlgorithmChange: (
    next: 'forgiving' | 'balanced' | 'strict'
  ) => void;
  onCloseCurve: () => void;
  onCloseFull: () => void;
  onOpenFull: () => void;
}

export function AdvancedOptionsCurveSheet({
  strengthAlgorithm,
  curveSheetOpen,
  fullPickerVisible,
  onStrengthAlgorithmChange,
  onCloseCurve,
  onCloseFull,
  onOpenFull,
}: Props) {
  return (
    <>
      <StrengthCurvePickerModal
        selected={strengthAlgorithm}
        visible={fullPickerVisible}
        onClose={onCloseFull}
        onSelect={onStrengthAlgorithmChange}
      />
      <AdvancedSheet
        subtitle='How strength grows — and what a missed day costs. Misses never delete the habit.'
        title='Strength Curve'
        visible={curveSheetOpen}
        onClose={onCloseCurve}
      >
        <StrengthCurveSheetBody
          selected={strengthAlgorithm}
          onLearnMore={() => {
            onCloseCurve();
            setTimeout(onOpenFull, 80);
          }}
          onSelect={onStrengthAlgorithmChange}
        />
      </AdvancedSheet>
    </>
  );
}
