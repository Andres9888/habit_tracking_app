/** TierPickerRow — three-column tier picker with staggered entrance + spring press. */
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ALGORITHM_ORDER } from '@/components/AlgorithmPicker';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { TIER_COPY } from './StrengthCurvePicker.copy';
import { MODE_STYLES } from './strengthCurveModeStyles';
import { TierPickerTile } from './TierPickerTile';
import { durations } from '@/theme/animations';

interface Props {
  selected: AlgorithmMode;
  onSelect: (mode: AlgorithmMode) => void;
  scale?: number;
}

export function TierPickerRow({ selected, onSelect, scale = 1 }: Props) {
  const reduceMotion = useReduceMotion();
  return (
    <View className='mx-4 flex-row' style={{ gap: 10 * scale }}>
      {ALGORITHM_ORDER.map((mode, idx) => (
        <Animated.View
          key={mode}
          className='flex-1'
          entering={
            reduceMotion
              ? undefined
              : FadeInDown.delay(
                  durations.transition + idx * durations.tick
                ).duration(durations.moderate)
          }
        >
          <TierPickerTile
            isSelected={mode === selected}
            mode={mode}
            scale={scale}
            style={MODE_STYLES[mode]}
            tier={TIER_COPY[mode]}
            onSelect={onSelect}
          />
        </Animated.View>
      ))}
    </View>
  );
}
