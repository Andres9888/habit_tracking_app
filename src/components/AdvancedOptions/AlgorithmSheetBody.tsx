/** AlgorithmSheetBody — algorithm card list inside an AdvancedSheet. */
import { ScrollView, View } from 'react-native';
import { AlgorithmCardsList } from '@/components/AlgorithmPicker';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';

interface Props {
  selected: AlgorithmMode;
  onSelect: (mode: AlgorithmMode) => void;
}

export function AlgorithmSheetBody({ selected, onSelect }: Props) {
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 12 }}
      showsVerticalScrollIndicator={false}
    >
      <View className='px-1'>
        <AlgorithmCardsList selected={selected} onSelect={onSelect} />
      </View>
    </ScrollView>
  );
}
