/** AdvancedAlgorithmBody — Expanded content for AdvancedAlgorithmDisclosure. */
import { View } from 'react-native';
import { AlgorithmCardsList } from './AlgorithmCardsList';
import type { AlgorithmMode } from './algorithmCopy';

interface Props {
  activeMode: AlgorithmMode;
  onSelect: (mode: AlgorithmMode) => void;
}

export function AdvancedAlgorithmBody({
  activeMode,
  onSelect,
}: Props) {
  return (
    <View className='px-3 pb-3'>
      <AlgorithmCardsList selected={activeMode} onSelect={onSelect} />
    </View>
  );
}
