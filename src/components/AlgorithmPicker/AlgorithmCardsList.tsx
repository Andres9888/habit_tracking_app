/** AlgorithmCardsList — Renders the three algorithm options in ascending complexity. */
import { View } from 'react-native';
import { AlgorithmCard } from './AlgorithmCard';
import {
  ALGORITHM_COPY,
  ALGORITHM_ORDER,
  DEFAULT_ALGORITHM,
} from './algorithmCopy';
import type { AlgorithmMode } from './algorithmCopy';

interface AlgorithmCardsListProps {
  selected: AlgorithmMode;
  onSelect: (mode: AlgorithmMode) => void;
  /** When true, marks the default (balanced/Average) card with a DEFAULT pill. */
  markDefault?: boolean;
}

export function AlgorithmCardsList({
  selected,
  onSelect,
  markDefault = true,
}: AlgorithmCardsListProps) {
  return (
    <View accessibilityRole='radiogroup'>
      {ALGORITHM_ORDER.map((mode) => {
        const entry = ALGORITHM_COPY[mode];
        return (
          <AlgorithmCard
            key={mode}
            entry={entry}
            selected={selected === mode}
            showDefaultPill={markDefault && mode === DEFAULT_ALGORITHM}
            onPress={() => onSelect(mode)}
          />
        );
      })}
    </View>
  );
}
