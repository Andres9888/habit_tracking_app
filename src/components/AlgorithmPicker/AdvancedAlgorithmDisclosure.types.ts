import type { AlgorithmMode } from './algorithmCopy';

export interface AdvancedAlgorithmDisclosureProps {
  selected: AlgorithmMode;
  onSelect: (mode: AlgorithmMode) => void;
}
