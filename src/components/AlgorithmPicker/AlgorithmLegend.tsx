/** AlgorithmLegend — Read-only reference cards for Settings (highlights active mode). */
import { View } from 'react-native';
import { AlgorithmCard } from './AlgorithmCard';
import {
  ALGORITHM_COPY,
  ALGORITHM_ORDER,
  DEFAULT_ALGORITHM,
} from './algorithmCopy';

interface Props {
  activeMode: string | undefined;
}

const ORDER: readonly string[] = ALGORITHM_ORDER;

export function AlgorithmLegend({ activeMode }: Props) {
  const resolved = activeMode && ORDER.includes(activeMode) ? activeMode : DEFAULT_ALGORITHM;
  return (
    <View className='px-4 pt-2 pb-3'>
      {ALGORITHM_ORDER.map((mode) => (
        <AlgorithmCard
          key={mode}
          entry={ALGORITHM_COPY[mode]}
          selected={mode === resolved}
          showDefaultPill={false}
        />
      ))}
    </View>
  );
}
