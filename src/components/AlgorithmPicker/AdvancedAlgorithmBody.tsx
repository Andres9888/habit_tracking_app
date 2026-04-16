/** AdvancedAlgorithmBody — Expanded content for AdvancedAlgorithmDisclosure. */
import { Pressable, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/theme/ThemeContext';
import { AlgorithmCardsList } from './AlgorithmCardsList';
import type { AlgorithmMode } from './algorithmCopy';

interface Props {
  activeMode: AlgorithmMode;
  hasOverride: boolean;
  onSelect: (mode: AlgorithmMode | undefined) => void;
}

export function AdvancedAlgorithmBody({
  activeMode,
  hasOverride,
  onSelect,
}: Props) {
  const { colors } = useThemeColors();

  return (
    <View className='px-3 pb-3'>
      <AlgorithmCardsList selected={activeMode} onSelect={onSelect} />
      {hasOverride ? (
        <Pressable
          accessibilityRole='button'
          className='mt-1 items-center justify-center rounded-lg'
          style={{ minHeight: 44, backgroundColor: colors.background }}
          onPress={() => {
            void Haptics.selectionAsync();
            onSelect(undefined);
          }}
        >
          <Text className='text-[12px] font-semibold' style={{ color: colors.text.secondary }}>
            Use global default
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
